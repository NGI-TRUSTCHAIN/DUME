import 'dart:async';
import 'dart:convert';
import 'dart:developer';
import 'dart:io';
import 'dart:isolate';
import 'dart:ui';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import 'package:flutter/foundation.dart';
import 'package:intl/intl.dart';
import 'package:latlong2/latlong.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:theia/controller/solid-protocol/request_service.dart';
import 'package:theia/model/coordinates.dart';
import 'package:theia/model/upload_state.dart';
import 'package:theia/utils.dart';
import 'package:uuid/uuid.dart';
import 'package:workmanager/workmanager.dart';

import '../../model/custom_image.dart';

import '../../model/connection.dart';
import '../../model/frame.dart';
import '../../model/loading_state.dart';
import '../../model/order.dart';
import '../../model/recorded_video.dart';
import '../../model/video.dart';
import '../anonymization/service.dart';
import '../repository/video_repository.dart';
import 'package:image/image.dart' as img_lib;
import 'package:processing_camera_image/processing_camera_image.dart';

// global variable to decide if the images are to be anonymized or not
bool isToAnonymize = false;

class VideoProvider extends ChangeNotifier {
  List<RecordedVideo> videos = [];
  var uuid = const Uuid();

  VideoRepository videoRepository = VideoRepository();

  int start = 0;
  static const pageSize = 10;

  List<RecordedVideo> loadingVideosList = [];

  String errorMessage = "";
  LoadingState deleteState = LoadingState.finished;
  LoadingState getVideoState = LoadingState.finished;
  LoadingState getVideosState = LoadingState.finished;

  var port = ReceivePort();
  static const String _keyVideos = 'videos';

  Function(String, int?, int)? onChangeItemUploadStateSize;
  Function(String, UploadState)? onChangeItemUploadState;
  Function(String, int)? onChangeUploadedFrames;

  Function(String)? onChangeItemRemove;
  Function()? onAddItem;

  // yolo anonymization instance class
  static final anonymizeImage = YoloImageV8Seg();

  //solid pod service
  static final solidRequestService = SolidService();

  VideoProvider() {
    IsolateNameServer.registerPortWithName(port.sendPort, "videoChannel");
    initLoadingVideos();
    port.listen((dynamic data) async {
      String action = data["action"];

      switch (action) {
        case "AW":
          loadingVideosList.add(data["video"]);
          saveVideosInSP(loadingVideosList);
          if (onAddItem != null) {
            onAddItem!();
          }
          notifyListeners();

        case "R":
          loadingVideosList.removeWhere((video) => video.videoId == data["id"]);
          saveVideosInSP(loadingVideosList);
          if (onChangeItemRemove != null) {
            onChangeItemRemove!(data["id"]);
          }
          notifyListeners();
          break;

        case "RU":
          loadingVideosList.removeWhere((video) => video.videoId == data["id"]);
          saveVideosInSP(loadingVideosList);
          if (onChangeItemUploadState != null) {
            onChangeItemUploadState!(data["id"], UploadState.uploaded);
          }
          notifyListeners();
          break;

        case "RW_AU":
          loadingVideosList
              .firstWhere((video) => video.videoId == data["id"])
              .uploadState = UploadState.uploading;
          saveVideosInSP(loadingVideosList);
          if (onChangeItemUploadState != null) {
            onChangeItemUploadState!(data["id"], UploadState.uploading);
          }
          notifyListeners();
          break;

        case "AW_RU":
          loadingVideosList
              .firstWhere((video) => video.videoId == data["id"])
              .uploadState = UploadState.waiting;
          saveVideosInSP(loadingVideosList);
          if (onChangeItemUploadState != null) {
            onChangeItemUploadState!(data["id"], UploadState.waiting);
          }
          notifyListeners();
          break;

        case "T_Size":
          loadingVideosList
              .firstWhere((video) => video.videoId == data["id"])
              .totalSize = data["value"];
          loadingVideosList
              .firstWhere((video) => video.videoId == data["id"])
              .uploadedSize = 0;
          saveVideosInSP(loadingVideosList);
          if (onChangeItemUploadStateSize != null) {
            onChangeItemUploadStateSize!(data["id"], data["value"], 0);
          }
          notifyListeners();
          break;

        case "U_Size":
          loadingVideosList
              .firstWhere((video) => video.videoId == data["id"])
              .uploadedSize = data["value"];

          saveVideosInSP(loadingVideosList);
          if (onChangeItemUploadStateSize != null) {
            onChangeItemUploadStateSize!(data["id"], null, data["value"]);
          }
          notifyListeners();
          break;
        case "F_Upload":
          loadingVideosList
              .firstWhere((video) => video.videoId == data["id"])
              .framesUploaded = data["value"];
          saveVideosInSP(loadingVideosList);
          if (onChangeUploadedFrames != null) {
            onChangeUploadedFrames!(data["id"], data["value"]);
          }
          break;
      }
    });
  }

  initLoadingVideos() async {
    loadingVideosList = await getVideosFromSP();
  }

  static Future<void> saveVideosInSP(List<RecordedVideo> videos) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    List<String> videoJsonList =
        videos.map((video) => json.encode(video.toMap())).toList();
    await prefs.setStringList(_keyVideos, videoJsonList);
  }

  static Future<List<RecordedVideo>> getVideosFromSP() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    List<String>? videoJsonList = prefs.getStringList(_keyVideos);

    if (videoJsonList == null) {
      return [];
    }

    return videoJsonList
        .map((videoJson) => RecordedVideo.fromMap(json.decode(videoJson)))
        .toList();
  }

  static Future<String?> getApiPreference() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString("api_pref");
  }

  @override
  void dispose() {
    IsolateNameServer.removePortNameMapping("videoChannel");
    port.close();
    super.dispose();
  }

  Future<List<CustomImage>> getFrames(
      String videoId, String token, BuildContext context) async {
    try {
      List<CustomImage> list =
          await videoRepository.getFrames(videoId, token, context);

      return list;
    } on HttpException catch (c, _) {
      errorMessage = c.message;
      return [];
    }
  }

  Future<void> deleteVideo(
      String videoId, String token, BuildContext context) async {
    deleteState = LoadingState.loading;
    notifyListeners();

    try {
      await videoRepository.deleteVideo(videoId, token, context);
      deleteState = LoadingState.finished;
      notifyListeners();
    } on HttpException catch (e, _) {
      errorMessage = e.message;
      deleteState = LoadingState.error;
      notifyListeners();
    }
  }

  Future<List<LatLng>> getRouteTraveled(
      String token, String videoId, BuildContext context) async {
    try {
      List<LatLng> coordinates =
          await videoRepository.getRouteTraveled(token, videoId, context);

      return coordinates;
    } on HttpException catch (e, _) {
      rethrow;
    }
  }

  Future<List<Video>> getVideos(
    int page,
    String token,
    String email,
    Order order,
    UploadState? uploadState,
    String from,
    String to,
    BuildContext context,
    bool Function(String) isInList,
  ) async {
    getVideosState = LoadingState.finished;

    var fromDate = DateTime.parse(from);
    var toDate = DateTime.parse(to);

    List<Video> vidList = [];

    var hasNetwork = await Connectivity().checkConnectivity();
    if (hasNetwork.contains(ConnectivityResult.none)) {
      for (var video in loadingVideosList) {
        if (video.uploadState == UploadState.uploading) {
          video.uploadState = UploadState.waiting;
        }
      }
    }

    // Adding waiting videos when the order is descendant

    if (uploadState == null && order == Order.descendant && page == 0) {
      for (var video in loadingVideosList) {
        if (video.uploadState == UploadState.waiting && video.email == email) {
          var videoDate = parseDate(video.getStartDate()!);

          if (videoDate.isAfter(fromDate) &&
              videoDate.isBefore(toDate.add(const Duration(days: 1)))) {
            var finalVid = await Video.fromRecordedVideo(video);
            log(finalVid.startDate);

            vidList.add(finalVid);
          }
        }
      }
    }

    // Adding only waiting videos

    if (uploadState == UploadState.waiting) {
      for (var video in loadingVideosList) {
        if (video.uploadState == UploadState.waiting && video.email == email) {
          var videoDate = parseDate(video.getStartDate()!);
          if (videoDate.isAfter(fromDate) &&
              videoDate.isBefore(toDate.add(const Duration(days: 1)))) {
            var finalVid = await Video.fromRecordedVideo(video);

            vidList.add(finalVid);
          }
        }
      }

      vidList.sort((a, b) {
        DateTime aDate = parseDate(a.startDate);
        DateTime bDate = parseDate(b.startDate);
        if (order == Order.ascendant) {
          return aDate.compareTo(bDate);
        } else {
          return bDate.compareTo(aDate);
        }
      });

      return vidList;
    }

    // Adding only uploading videos

    if (uploadState == UploadState.uploading) {
      for (var video in loadingVideosList) {
        if (video.uploadState == UploadState.uploading &&
            video.email == email) {
          var videoDate = parseDate(video.getStartDate()!);
          if (videoDate.isAfter(fromDate) &&
              videoDate.isBefore(toDate.add(const Duration(days: 1)))) {
            log(video.getStartDate().toString());
            var finalVid = await Video.fromRecordedVideo(video);

            vidList.add(finalVid);
          }
        }
      }

      vidList.sort((a, b) {
        DateTime aDate = parseDate(a.startDate);
        DateTime bDate = parseDate(b.startDate);
        if (order == Order.ascendant) {
          return aDate.compareTo(bDate);
        } else {
          return bDate.compareTo(aDate);
        }
      });

      return vidList;
    }

    // Getting videos from server

    try {
      if (context.mounted) {
        var serverVideos = await videoRepository.getVideos(page, token, email,
            order, uploadState, from, to, loadingVideosList, pageSize, context);

        vidList.addAll(serverVideos);
      }
    } on HttpException catch (e, _) {
      errorMessage = e.message;
      getVideosState = LoadingState.error;
    }

    // Adding waiting videos when the order is ascendant
    if (uploadState == null &&
        order == Order.ascendant &&
        vidList.length < pageSize) {
      for (var video in loadingVideosList) {
        if (video.uploadState == UploadState.waiting &&
            video.email == email &&
            (isInList(video.videoId) == false)) {
          var videoDate = parseDate(video.getStartDate()!);
          if (videoDate.isAfter(fromDate) &&
              videoDate.isBefore(toDate.add(const Duration(days: 1)))) {
            var finalVid = await Video.fromRecordedVideo(video);

            vidList.add(finalVid);
          }
        }
      }
    }

    return vidList;
  }

  Future<Video?> getVideoById(
      String videoId, String token, BuildContext context) async {
    getVideoState = LoadingState.loading;
    notifyListeners();

    try {
      // if (sahred_pref == solid){
      //   var video = await videoRepository.getVideoByIdSolid(
      //       videoId, token, loadingVideosList, context);
      //   getVideoState = LoadingState.finished;
      //   notifyListeners();
      //   return video
      // }
      var video = await videoRepository.getVideoById(
          videoId, token, loadingVideosList, context);
      getVideoState = LoadingState.finished;
      notifyListeners();
      return video;
    } on HttpException catch (c, _) {
      errorMessage = c.message;
      getVideoState = LoadingState.error;
      notifyListeners();
    }
  }

  Future<List<String>> getDateLimits(
      String token, String email, BuildContext context) async {
    var list = await videoRepository.getDateLimits(token, email, context);

    var oldestDate = DateTime.parse(list[0]);
    var newestDate = DateTime.parse(list[1]);

    List<DateTime> dates = [
      ...loadingVideosList
          .map((video) => DateTime.parse(video.getStartDate()!)),
    ];

    for (var date in dates) {
      if (date.isBefore(oldestDate)) {
        oldestDate = date;
      }
      if (date.isAfter(newestDate)) {
        newestDate = date;
      }
    }

    // Getting rid of hours, minutes, ... tyo avoid trouble later
    String oldestDateStr = DateFormat('yyyy-MM-dd').format(oldestDate);
    String newestDateStr = DateFormat('yyyy-MM-dd').format(newestDate);

    return [oldestDateStr, newestDateStr];
  }

  String createVideo(String email, String token) {
    String id = uuid.v4();
    videos.add(RecordedVideo(id, email, token, 0));
    return id;
  }

  void createFrame(
      Coordinates coordinates, String path, String date, String videoID) {
    var frame = Frame(uuid.v4(), path, coordinates, date);
    for (var vid in videos) {
      if (vid.videoId == videoID) {
        vid.addFrame(frame);
      }
    }
  }

  Future<RecordedVideo> startUploadingVideo(BuildContext context) async {
    RecordedVideo saveVideo = videos.first;
    videos.removeAt(0);

    if (saveVideo.frames.isEmpty) {
      showCustomToast(AppLocalizations.of(context)!.no_frames);
    }

    final SharedPreferences prefs = await SharedPreferences.getInstance();

    // Add to waiting upload so it's not lost
    //await _updateVideoList("video_waiting_upload", saveVideo, add: true);

    saveVideo.uploadState = UploadState.waiting;

    final sendPort = IsolateNameServer.lookupPortByName("videoChannel");

    if (sendPort != null) {
      sendPort.send({"action": "AW", "video": saveVideo});
    }

    final directory = await getApplicationDocumentsDirectory();
    final path = "${directory.path}/${saveVideo.videoId}";

    var file = File(path);
    await file.writeAsString(json.encode(saveVideo.toMap()));

    String con = prefs.getString("upload_pref") ?? "Connection.wifi";

    var connection = Connection.getConnection(con);

    NetworkType networkType;

    if (connection == Connection.wifi) {
      networkType = NetworkType.unmetered;
    } else {
      networkType = NetworkType.connected;
    }

    Workmanager().registerOneOffTask(saveVideo.videoId, "uploadVideo",
        constraints: Constraints(networkType: networkType),
        inputData: {"path": path, "uploadDate": DateTime.now().toString()},
        backoffPolicy: BackoffPolicy.exponential,
        existingWorkPolicy: ExistingWorkPolicy.keep);

    log("📗 Schedule Video Upload: ${saveVideo.videoId}");
    return saveVideo;
  }

  static Uint8List? convertImage(
      int bytesPerPixel,
      int bytesPerRowP1,
      int bytesPerRowP0,
      int height,
      int width,
      Uint8List plane0,
      Uint8List plane1,
      Uint8List plane2,
      int angle) {
    final ProcessingCameraImage processingCameraImage = ProcessingCameraImage();

    var image = processingCameraImage.processCameraImageToRGB(
      bytesPerPixelPlan1: bytesPerPixel,
      bytesPerRowPlane0: bytesPerRowP0,
      bytesPerRowPlane1: bytesPerRowP1,
      rotationAngle: angle.toDouble(),
      height: height,
      plane0: plane0,
      plane1: plane1,
      plane2: plane2,
      width: width,
    );

    return img_lib.encodePng(image!);
    return img_lib.encodeJpg(image!, quality: 90);
  }

  static Future<void> uploadVideoAndCleanMemory(RecordedVideo video) async {
    log("📗 Attempting to upload video: ${video.videoId}");

    final sendPort = IsolateNameServer.lookupPortByName("videoChannel");

    if (sendPort != null) {
      sendPort.send({"action": "RW_AU", "id": video.videoId});
    }

    final sendNotificationPort =
        IsolateNameServer.lookupPortByName("notificationChannel");

    if (sendNotificationPort != null) {
      sendNotificationPort.send({
        "action": "Uploading",
        "id": video.videoId,
        "email": video.email,
        "image": video.frames.length == 1
      });
    }

    await VideoProvider.uploadVideo(video);

    log("📗 Video ${video.videoId} Uploaded with success");

    if (sendPort != null) {
      sendPort.send({"action": "RU", "id": video.videoId});
    }

    if (sendNotificationPort != null) {
      sendNotificationPort.send({
        "action": "Uploaded",
        "id": video.videoId,
        "email": video.email,
        "image": video.frames.length == 1
      });
    }

    log("📗 Video ${video.videoId} Removed from Loading Videos");

    for (var frame in video.frames) {
      File frameFile = File(frame.path);
      await frameFile.delete();

      log("📗 Frame ${frame.id} File deleted \n(${frame.path})");
    }

    log("📗 Video ${video.videoId} All frames deleted from local memory");
  }

  Future<void> deleteVideoLocal(String videoId, BuildContext context) async {
    deleteState = LoadingState.loading;
    notifyListeners();

    var videoInList = loadingVideosList.any((vid) => vid.videoId == videoId);

    if (!videoInList) {
      errorMessage = AppLocalizations.of(context)!.error_uploaded;
      deleteState = LoadingState.error;
      notifyListeners();

      return;
    }
    var video = loadingVideosList.firstWhere((vid) => vid.videoId == videoId);

    if (video.uploadState != UploadState.waiting) {
      errorMessage = AppLocalizations.of(context)!.error_uploading;
      deleteState = LoadingState.error;
      notifyListeners();
      return;
    }

// Cancelling workmanager...
    Workmanager().cancelByUniqueName(videoId);

    final sendPort = IsolateNameServer.lookupPortByName("videoChannel");

    if (sendPort != null) {
      sendPort.send({"action": "R", "id": videoId});
    }

    final directory = await getApplicationDocumentsDirectory();
    final path = "${directory.path}/$videoId";
    File file = File(path);
    file.delete();

    for (var frame in video.frames) {
      File frameFile = File(frame.path);
      await frameFile.delete();
    }
    deleteState = LoadingState.finished;
    notifyListeners();
  }

  static Future<void> uploadVideo(RecordedVideo video) async {
    try {
      // Upload to theia or Solid
      final String? apiChoose = await getApiPreference();
      if (apiChoose == 'solid') {
        isToAnonymize = true;
      } else {
        isToAnonymize = false;
        await VideoRepository.uploadVideo(video);
      }

      log("📗 Video uploaded");

      await divideAndUploadFrames(video);
    } on HttpException catch (e, _) {
      log(e.message);
      throw Exception("Failed to upload frames: $e");
    }
  }

  static Future<void> divideAndUploadFrames(RecordedVideo video) async {
    try {
      final sendPort = IsolateNameServer.lookupPortByName("videoChannel");

      List<Frame> copyFrames = List.from(video.frames);
      int uploaded = 0;

      final String? apiChoose = await getApiPreference();
      log('API choose: $apiChoose');

      final String? startDate = video.getStartDate();
      final String startTime = _getHourAndMinutes(startDate!);
      final String endTime = _getHourAndMinutes(video.getEndDate()!);

      // Inicio_11h20min_Fim_12h01min/
      final String folderUrl =
          "${startDate.split('T').first}/Inicio_${startTime}min_Fim_${endTime}min/video_${video.videoId}";

      if (apiChoose == 'solid') {
        var videoData = {
          "id": video.videoId,
          "dateStart": video.getStartDate(),
          "dateEnd": video.getEndDate(),
          "coordinatesStart": {
            "lat": video.getStartCoordinates()!.latitude,
            "long": video.getStartCoordinates()!.longitude
          },
          "coordinatesEnd": {
            "lat": video.getEndCoordinates()!.latitude,
            "long": video.getEndCoordinates()!.longitude
          },
          "origin": "MOBILE", //TODO: This will need to be checked somehow...
          "totalFrames": video.getFrameNumber()
        };

        Map<String, dynamic>? ledgerData = {
          'video': videoData,
          'images': []
        };
        log("$ledgerData");
        await solidRequestService.uploadVideoParams(ledgerData, copyFrames, folderUrl);
      }

      while (copyFrames.isNotEmpty) {
        List<Frame> frames = [];

        while (frames.length < 30 && copyFrames.isNotEmpty) {
          frames.add(copyFrames.removeAt(0));
        }
        if (apiChoose == 'solid') {
          log('entering in theia');

          await VideoProvider.uploadFrames(
              frames, video.videoId, video.token!, folderUrl);
        } else {
          await VideoProvider.uploadFrames(
              frames, video.videoId, video.token!, null);
        }

        uploaded += frames.length;

        log("📗 $uploaded/${video.frames.length} were uploaded");

        if (sendPort != null) {
          log("Sending frame");
          sendPort.send(
              {"action": "F_Upload", "id": video.videoId, "value": uploaded});
        }
      }
    } catch (e) {
      rethrow;
    }
  }

  static Future<void> convertBatch(List<Frame> frames) async {
    for (var frame in frames) {
      var bytes = await File(frame.path).readAsBytes();

      RegExp regExp = RegExp(
          r"_rowStr0_(\d+)_rowStr1_(\d+)_pixStr_(\d+)_width_(\d+)_height_(\d+)_sensorOrientation_(\d+)");

      // Matching the pattern with the example string
      Match? match = regExp.firstMatch(frame.path);

      // Checking if a match is found and printing the captured groups
      if (match != null) {
        int rowStr0 = int.parse(match.group(1) ?? '0');
        int rowStr1 = int.parse(match.group(2) ?? '0');

        int pixStr = int.parse(match.group(3) ?? '0');
        int width = int.parse(match.group(4) ?? '0');
        int height = int.parse(match.group(5) ?? '0');
        int sensorOrientation = int.parse(match.group(6) ?? '0');

        int size = width * height;

        Uint8List yPlaneData = bytes.sublist(0, size);
        Uint8List uPlaneData = bytes.sublist(size, size + size ~/ 2);
        Uint8List vPlaneData = bytes.sublist(size + size ~/ 2);

        var image = convertImage(pixStr, rowStr0, rowStr1, height, width,
            yPlaneData, uPlaneData, vPlaneData, sensorOrientation);

        if (image != null) {
          String newFileName = frame.path.replaceAll(regExp, '');
          newFileName = withoutExtension(newFileName);

          await File("$newFileName.png").writeAsBytes(image);
          await File(frame.path).delete();

          frame.path = "$newFileName.png";

          // implementation of anonymize images
          if (isToAnonymize) {
            await anonymizeImage.runInference("$newFileName.png");
            // frame.path = "$newFileName.png";
          }
        }
      }
    }
  }

  static String _getHourAndMinutes(String dateTimeStr) {
    // Parse the input string to a DateTime object
    DateTime dateTime = DateTime.parse(dateTimeStr);

    // Format the DateTime object to a string with only hour and minutes
    String formattedTime =
        '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';

    return formattedTime.replaceAll(':', 'h');
  }

  static Future<void> uploadFrames(
      List<Frame> frames, String videoId, String token, String? pathUrl) async {
    try {
      await convertBatch(frames);
      // Upload to theia or Solid
      if (pathUrl != null) {
        log('uploading to solid....');

        await solidRequestService.uploadFrames(pathUrl, frames);
      } else {
        await VideoRepository.uploadFrames(frames, videoId, token);
      }
    } on HttpException catch (e, _) {
      log(e.message);
      throw Exception("Failed to upload frames: $e");
    }
  }

  Future<Uint8List> getFrame(String url) async {
    var frame = await videoRepository.getFrame(url);
    return frame;
  }
}
