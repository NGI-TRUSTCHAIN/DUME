import 'dart:async' show Future, Timer;
import 'dart:developer';
import 'dart:io';

import 'package:camera/camera.dart';
import 'package:disk_space_update/disk_space_update.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:geolocator/geolocator.dart';
import 'package:intl/intl.dart';
import 'package:path_provider/path_provider.dart';
import 'package:provider/provider.dart';
import 'package:rxdart/rxdart.dart';
import 'package:theia/constants.dart';
import 'package:theia/controller/provider/user_provider.dart';
import 'package:theia/model/button_info.dart';
import 'package:theia/model/camera_mode.dart';
import 'package:theia/model/coordinates.dart';
import 'package:theia/model/upload_state.dart';
import 'package:theia/model/yuv_struct.dart';
import 'package:theia/view/component/top_bar.dart';
import 'package:wakelock_plus/wakelock_plus.dart';

import '../../controller/provider/notification_provider.dart';
import '../../controller/provider/video_provider.dart';
import '../../utils.dart';
import '../component/bottom_bar.dart';
import '../component/warning_popup.dart';

const platform = MethodChannel('ram_memory');

class CameraPage extends StatefulWidget {
  const CameraPage({super.key});

  @override
  State<CameraPage> createState() => _CameraPageState();
}

class _CameraPageState extends State<CameraPage> {
  // Camera variables
  late final CameraController _cameraController;
  late Future<void> _instanceInit;
  var isRecording = false;

  // Pipe that saves images taken in continuous pictures mode
  final yuvStream = BehaviorSubject<YUVStruct?>.seeded(null);

  // Camera Image
  CameraImage? cameraImage;

  // Continuous pictures mode timer
  Timer? _captureTimer;
  Timer? _locationTimer;

  // Stopwatch for testing
  final stopwatch = Stopwatch();

  // Capture timer
  int minInterval = 200;

  Duration timer = Duration.zero;
  Timer? recordingTime;
  bool isAnnotating = false;
  CameraMode mode = CameraMode.video;

  String? currVideoId;

  var isTakingPicture = false;
  bool _isStartingRecording = false;

  var speedThreshold = 0.1;
  int? previousInterval;

  Future<double> getTotalRAM() async {
    try {
      final double totalRAMGB = await platform.invokeMethod('getTotalRAM');
      return totalRAMGB;
    } on PlatformException catch (e) {
      if (kDebugMode) {
        print("Failed to get total RAM: '${e.message}'.");
      }
      return 0;
    }
  }

  void _savingImage(YUVStruct? img) async {
    if (img != null) {
      stopwatch.start();
      try {
        await compute(saveCameraImageToYUVFile, img);
      } catch (e) {
        // If the phone is out of memory
        if (e is FileSystemException && e.osError?.errorCode == 28) {
          showMemoryFullDialog();
        }
      }
      stopwatch.stop();
      if (kDebugMode) {
        print("Saving: ${stopwatch.elapsedMilliseconds}");
      }
      stopwatch.reset();
    }
  }

  _onError(Object error) {
    if (kDebugMode) {
      print("Error in pipe: ${error.toString()}");
    }
  }

  @override
  void initState() {
    WidgetsFlutterBinding.ensureInitialized();

    // Stop screen from going to sleep
    WakelockPlus.enable();

    // Set listen for yuv stream
    yuvStream.listen(_savingImage, onError: _onError, cancelOnError: false);

    // Init the camera
    _instanceInit = initCamera();

    super.initState();
  }

  Future<Position> _determinePosition() async {
    return await Geolocator.getCurrentPosition();
  }

  void startLocationUpdates() {
    // Timer to request location updates every 100ms
    _locationTimer = Timer.periodic(const Duration(milliseconds: 200), (timer) {
      Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.best,
      ).then((position) {
        if (_captureTimer != null && _captureTimer!.isActive) {
          handlePositionUpdate(position);
        }
      }).catchError((error) {
        if (kDebugMode) {
          print('Error receiving location updates: $error');
        }
      });
    });
  }

  void handlePositionUpdate(Position position) {
    log('Speed: ${position.speed}, Interval: 200 ms, Speed Accuracy: ${position.speedAccuracy}');

    if (position.speed > speedThreshold) {
      if (previousInterval == null) {
        restartPictureTimer(200);
      }
    } else {
      stopPictureTimer();
    }
  }

  int calculateIntervalBasedOnSpeed(double speed) {
    // If speed is 0, we don't take pictures
    if (speed <= speedThreshold) return 0;

    // Calculate interval (ensuring it is at least minInterval)
    int intervalMs = (10000 / speed).round(); // Example calculation
    return intervalMs < minInterval ? minInterval : intervalMs;
  }

  bool isSignificantDifference(int oldInterval, int newInterval) {
    // Define a threshold for significant difference, e.g., 10% change
    double percentageChange = (newInterval - oldInterval).abs() / oldInterval;
    return percentageChange > 0.1; // 10% change
  }

  void restartPictureTimer(int intervalMs) {
    // Cancel the existing timer if it exists
    _captureTimer?.cancel();

    _captureTimer =
        Timer.periodic(Duration(milliseconds: intervalMs), (Timer timer) async {
      var freeSpaceGB = await _getFreeDiskSpace();

      if (freeSpaceGB <= 1) {
        showLowSpaceDialog();
        stopImageCapture();
        return;
      }

      await scheduleImageCapture();
    });
  }

  void stopPictureTimer() {
    log("Cancelling timer"); // Cancel the existing timer if it exists
    _captureTimer?.cancel();
    _captureTimer = null;
  }

  @override
  void dispose() {
    closeCameraAndStreams();
    super.dispose();
  }

  void closeCameraAndStreams() async {
    await _cameraController.stopImageStream();

    await _cameraController.dispose();

    _captureTimer?.cancel();
    _captureTimer = null;

    _locationTimer?.cancel();
    _locationTimer = null;

    WakelockPlus.disable();
  }

  Future<void> getLocationPerm() async {
    bool serviceEnabled;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await showDialog(
          context: context,
          builder: (context) {
            return WarningPopup(
              title: AppLocalizations.of(context)!.location_services_disabled,
              text: AppLocalizations.of(context)!.turn_on_location_for_videos,
              buttonAccept:
                  ButtonInfo(AppLocalizations.of(context)!.turn_on, () async {
                serviceEnabled = await Geolocator.isLocationServiceEnabled();

                if (serviceEnabled) {
                  Navigator.of(context).pop();
                  return;
                }
                await Geolocator.openLocationSettings();
                while (!serviceEnabled) {
                  serviceEnabled = await Geolocator.isLocationServiceEnabled();
                }
                if (serviceEnabled) {
                  Navigator.of(context).pop();
                  return;
                }
              }),
              buttonCancel:
                  ButtonInfo(AppLocalizations.of(context)!.cancel, () async {
                Navigator.of(context).pushNamed("/");
              }),
            );
          });

      await getPermissions();
    } else {
      await getPermissions();
    }
  }

  getPermissions() async {
    LocationPermission permission;

    permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }

    if (permission == LocationPermission.deniedForever ||
        permission == LocationPermission.deniedForever) {
      await showDialog(
          context: context,
          builder: (context) {
            return WarningPopup(
              title:
                  AppLocalizations.of(context)!.no_permission_access_location,
              text: AppLocalizations.of(context)!.allow_location_for_videos,
              buttonAccept:
                  ButtonInfo(AppLocalizations.of(context)!.turn_on, () async {
                permission = await Geolocator.checkPermission();

                if (permission == LocationPermission.always ||
                    permission == LocationPermission.whileInUse) {
                  Navigator.of(context).pop();
                  return;
                }
                await Geolocator.openAppSettings();
                while (permission != LocationPermission.always &&
                    permission != LocationPermission.whileInUse) {
                  permission = await Geolocator.checkPermission();
                }

                if (permission == LocationPermission.always ||
                    permission == LocationPermission.whileInUse) {
                  Navigator.of(context).pop();
                  return;
                }
              }),
              buttonCancel:
                  ButtonInfo(AppLocalizations.of(context)!.cancel, () async {
                Navigator.of(context).pushNamed("/");
              }),
            );
          });
    }
  }

  Future<void> initCamera() async {
    await getLocationPerm();

    try {
      final cameras = await availableCameras();

      var camera = cameras[0];

      _cameraController = CameraController(camera, ResolutionPreset.veryHigh,
          enableAudio: false, imageFormatGroup: ImageFormatGroup.yuv420);

      await _cameraController.initialize();

      _cameraController.startImageStream((image) {
        if (isRecording) {
          setState(() {
            cameraImage = image;
          });
        }
      });
    } catch (e) {
      if (kDebugMode) {
        print("Error initializing camera: $e");
      }
    }
  }

  void stopImageCapture() async {
    _captureTimer?.cancel();
    _captureTimer = null;

    _locationTimer?.cancel();
    _locationTimer = null;

    // Wait for any ongoing frame saving to complete
    await Future.delayed(Duration(milliseconds: minInterval + 100));

    recordingTime?.cancel();
    timer = Duration.zero;

    setState(() {
      stopwatch.start();
      stopwatch.reset();
      isRecording = false;
    });

    // Ensure UI updates before starting upload
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<VideoProvider>(context, listen: false)
          .startUploadingVideo(context)
          .then((saveVideo) {
        Provider.of<NotificationProvider>(context, listen: false)
            .showVideoNotification(
                Provider.of<UserProvider>(context, listen: false).email!,
                saveVideo.videoId,
                UploadState.waiting);
      });
    });
  }

  Future<void> checkRAM() async {
    var ram = await getTotalRAM();

    if (ram < 7) {
      showRamWarningDialog();
    } else {
      startRecordingCounting();
    }
  }

  void startImageCapture() {
    _captureTimer?.cancel();

    if (!isRecording) {
      setState(() {
        isRecording = true;
      });
    }

    // Set up a new timer with the current interval
    _captureTimer =
        Timer.periodic(const Duration(milliseconds: 200), (Timer timer) async {
      log("hi??");

      var freeSpaceGB = await _getFreeDiskSpace();

      if (freeSpaceGB <= 1) {
        showLowSpaceDialog();
        stopImageCapture();
        return;
      }

      await scheduleImageCapture();

      //startLocationUpdates();
    });
  }

  Future<void> scheduleImageCapture() async {
    if (_cameraController.value.isInitialized) {
      final directory = await getApplicationDocumentsDirectory();
      final formattedTimestamp =
          DateFormat("yyyy-MM-ddTHH:mm:ss.SSSZ").format(DateTime.now());

      final imagePath = '${directory.path}/image_$formattedTimestamp';
      try {
        if (cameraImage == null) {
          if (kDebugMode) {
            print("Camera Image is null");
          }
          return;
        }


        var newPath =
            "${imagePath}_rowStr0_${cameraImage!.planes[0].bytesPerRow}_rowStr1_${cameraImage!.planes[1].bytesPerRow}_pixStr_${cameraImage!.planes[1].bytesPerPixel}_width_${cameraImage!.width}_height_${cameraImage!.height}_sensorOrientation_${_cameraController.description.sensorOrientation}.yuv";

        Position position = await _determinePosition();
        saveFrame(position, newPath, formattedTimestamp);

        YUVStruct uint8listStructure = YUVStruct(newPath, cameraImage);
        yuvStream.sink.add(uint8listStructure);
      } catch (e) {
        if (kDebugMode) {
          print('Error: $e');
        }
      }
    }
  }

  void saveFrame(Position coordinates, String path, String date) {
    Coordinates finalCoordinates =
        Coordinates(coordinates.latitude, coordinates.longitude);

    Provider.of<VideoProvider>(context, listen: false)
        .createFrame(finalCoordinates, path, date, currVideoId!);
  }

  void continueRamWarning() {
    Navigator.of(context).pop();
    startRecordingCounting();
  }

  void startRecordingCounting() {
    setState(() {
      _isStartingRecording = true;
    });

    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        _isStartingRecording = false;
        currVideoId = Provider.of<VideoProvider>(context, listen: false)
            .createVideo(
                Provider.of<UserProvider>(context, listen: false).email!,
                Provider.of<UserProvider>(context, listen: false).token!);

        startImageCapture();
        recordingTime = Timer.periodic(const Duration(seconds: 1), (_) {
          setState(() {
            timer += const Duration(seconds: 1);
          });
        });
      });
    });
  }

  void dismissWindows() {
    Navigator.of(context).pop();
  }

  void showRamWarningDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return WarningPopup(
          title: AppLocalizations.of(context)!.warning_pop_up,
          text: AppLocalizations.of(context)!.ram_warning,
          buttonAccept: ButtonInfo(
              AppLocalizations.of(context)!.continue_word, continueRamWarning),
          buttonCancel:
              ButtonInfo(AppLocalizations.of(context)!.cancel, dismissWindows),
        );
      },
    );
  }

  void showLowSpaceDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return WarningPopup(
            title: AppLocalizations.of(context)!.low_space_pop_up,
            text: AppLocalizations.of(context)!.low_space_warning,
            buttonAccept:
                ButtonInfo(AppLocalizations.of(context)!.ok, dismissWindows));
      },
    );
  }

  Future<double> _getFreeDiskSpace() async {
    try {
      var diskSpace = await DiskSpace.getFreeDiskSpace;
      var freeSpaceGB = diskSpace! / (1000); // Convert bytes to GB
      return freeSpaceGB;
    } catch (e) {
      if (kDebugMode) {
        print("Error getting free disk space: $e");
      }
      return 0;
    }
  }

  void showMemoryFullDialog() {
    if (isRecording) {
      stopImageCapture();
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return WarningPopup(
              title: AppLocalizations.of(context)!.low_space_pop_up,
              text: AppLocalizations.of(context)!.low_space_warning,
              buttonAccept:
                  ButtonInfo(AppLocalizations.of(context)!.ok, dismissWindows));
        },
      );
    }
  }

  static void saveCameraImageToYUVFile(YUVStruct image) async {
    if (image.image == null) {
      throw Exception("Camera Image is null");
    }

    // Convert CameraImage to YUV format
    List<int> bytes = _convertYUV444(image.image!);

    try {
      // Save bytes to file
      await File(image.path).writeAsBytes(bytes);
    } catch (e) {
      // An error occurred while writing to the file
      if (e is FileSystemException && e.osError?.errorCode == 28) {
        rethrow;
      } else {
        if (kDebugMode) {
          print("Error: $e");
        }
      }
    }
  }

  static List<int> _convertYUV444(CameraImage cameraImage) {
    int width = cameraImage.width;
    int height = cameraImage.height;

    // Calculate the number of bytes needed to store the YUV image
    int ySize = width * height;
    int uvSize = width * height;

    // Allocate the buffer
    List<int> bytes = List<int>.filled(ySize + uvSize, 0, growable: true);

    // Copy Y plane
    for (int i = 0; i < ySize; i++) {
      bytes[i] = cameraImage.planes[0].bytes[i];
    }

    // Copy U plane
    for (int i = 0; i < cameraImage.planes[1].bytes.length; i++) {
      bytes[width * height + i] = cameraImage.planes[1].bytes[i];
    }

    // Copy V plane
    for (int i = 0; i < cameraImage.planes[2].bytes.length; i++) {
      bytes[width * height + (width * height ~/ 2) + i] =
          cameraImage.planes[2].bytes[i];
    }
    return bytes;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<void>(
      future: _instanceInit,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          return CustomBottomNavBar(
            body: Container(
              color: theiaAppBarGray,
              child: Column(
                children: <Widget>[
                  TopBar(
                    text: AppLocalizations.of(context)!.camera,
                    isLocked: isRecording || isTakingPicture,
                  ),
                  Expanded(
                    child: Stack(
                      children: [
                        getCamera(),
                        Positioned(
                            bottom: 0, left: 0, right: 0, child: getButtons()),
                        if (mode == CameraMode.video && isRecording)
                          Positioned(
                              bottom: 15,
                              right: 15,
                              child: getAnnotationButton())
                      ],
                    ),
                  )
                ],
              ),
            ),
            currentIndex: 2,
            isLocked: isRecording || isTakingPicture,
          );
        }
        return CustomBottomNavBar(
          body: Container(
            color: theiaAppBarGray,
            child: Column(children: [
              TopBar(
                text: AppLocalizations.of(context)!.camera,
                isLocked: isRecording || isTakingPicture,
              ),
              const Expanded(
                  child: Center(
                      child: SizedBox(
                          height: 200,
                          width: 200,
                          child: CircularProgressIndicator(
                            strokeWidth: 15,
                          )))),
            ]),
          ),
          currentIndex: 2,
          isLocked: isRecording || isTakingPicture,
        );
      },
    );
  }

  Widget getButtons() {
    if (mode == CameraMode.video) {
      return Container(
          margin: const EdgeInsets.all(20),
          width: MediaQuery.of(context).size.width,
          child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                getRecordButton(),
                getSwitchCameraButton(),
              ]));
    }

    return Container(
        margin: const EdgeInsets.all(20),
        width: MediaQuery.of(context).size.width,
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              getPhotoButton(),
              getSwitchCameraButton(),
            ]));
  }

  Widget getAnnotationButton() {
    return Container(
      height: 70,
      width: 70,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: theiaDarkPurple.withOpacity(0.2),
      ),
      child: IconButton(
        onPressed: () {
          showCustomToast(AppLocalizations.of(context)!.coming_soon_title);
        },
        icon: const Icon(
          Icons.add_location,
          color: theiaAppBarGray,
          size: 45,
        ),
      ),
    );
  }

  Widget getRecordButton() {
    return Container(
      height: 70,
      width: 70,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: isRecording ? Colors.red : theiaDarkPurple,
      ),
      child: _isStartingRecording ||
              (context.watch<VideoProvider>().videos.isNotEmpty
                  ? context.watch<VideoProvider>().videos[0].frames.isEmpty
                  : false)
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            )
          : IconButton(
              onPressed: isRecording ? stopImageCapture : checkRAM,
              icon: Stack(children: [
                const Positioned(
                  top: -3,
                  left: -3,
                  child: Icon(
                    Icons.circle,
                    color: Colors.white,
                    size: 60,
                  ),
                ),
                Center(
                  child: isRecording
                      ? const Icon(
                          Icons.square_rounded,
                          color: Colors.red,
                          size: 20,
                        )
                      : const Icon(
                          Icons.circle,
                          color: theiaDarkPurple,
                          size: 20,
                        ),
                )
              ]),
            ),
    );
  }

  Widget getPhotoButton() {
    return Container(
      height: 70,
      width: 70,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: isTakingPicture ? Colors.grey : theiaDarkPurple,
      ),
      child: isTakingPicture
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            )
          : IconButton(
              onPressed: isTakingPicture ? null : takePicture,
              icon: const Icon(
                Icons.circle,
                color: Colors.white,
                size: 50,
              ),
            ),
    );
  }

  Widget getSwitchCameraButton() {
    return SizedBox(
      height: 70,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ElevatedButton(
              style: ButtonStyle(
                backgroundColor: WidgetStateProperty.all<Color>(
                    mode == CameraMode.video
                        ? theiaDarkPurple
                        : Colors.transparent),
                foregroundColor: WidgetStateProperty.all<Color>(Colors.white),
                shape: WidgetStateProperty.all<RoundedRectangleBorder>(
                  const RoundedRectangleBorder(
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(25),
                      topRight: Radius.circular(0),
                      bottomLeft: Radius.circular(25),
                      bottomRight: Radius.circular(0),
                    ),
                  ),
                ),
              ),
              onPressed: () {
                setState(() {
                  mode = CameraMode.video;
                });
              },
              child: Text(
                AppLocalizations.of(context)!.video_text,
                style: const TextStyle(fontWeight: FontWeight.bold),
              )),
          ElevatedButton(
              style: ButtonStyle(
                backgroundColor: WidgetStateProperty.all<Color>(
                    mode == CameraMode.picture
                        ? theiaDarkPurple
                        : Colors.transparent),
                foregroundColor: WidgetStateProperty.all<Color>(Colors.white),
                shape: WidgetStateProperty.all<RoundedRectangleBorder>(
                  const RoundedRectangleBorder(
                    borderRadius: BorderRadius.only(
                      topRight: Radius.circular(25),
                      topLeft: Radius.circular(0),
                      bottomRight: Radius.circular(25),
                      bottomLeft: Radius.circular(0),
                    ),
                  ),
                ),
              ),
              onPressed: () {
                setState(() {
                  mode = CameraMode.picture;
                });
              },
              child: Text(
                AppLocalizations.of(context)!.image,
                style: TextStyle(fontWeight: FontWeight.bold),
              ))
        ],
      ),
    );
  }

  Future<void> takePicture() async {
    if (mounted) {
      setState(() {
        isTakingPicture = true;
      });

      currVideoId =
          Provider.of<VideoProvider>(context, listen: false).createVideo(
        Provider.of<UserProvider>(context, listen: false).email!,
        Provider.of<UserProvider>(context, listen: false).token!,
      );

      final directory = await getApplicationDocumentsDirectory();
      final formattedTimestamp =
          DateFormat("yyyy-MM-ddTHH:mm:ss.SSSZ").format(DateTime.now());
      final imagePath = '${directory.path}/image_$formattedTimestamp.jpeg';

      try {
        XFile image = await _cameraController.takePicture();
        await image.saveTo(imagePath);

        Position position = await _determinePosition();
        saveFrame(position, imagePath, formattedTimestamp);

        if (mounted) {
          Provider.of<VideoProvider>(context, listen: false)
              .startUploadingVideo(context)
              .then((saveVideo) {
            Provider.of<NotificationProvider>(context, listen: false)
                .showImageNotification(
                    Provider.of<UserProvider>(context, listen: false).email!,
                    saveVideo.videoId,
                    UploadState.waiting);
          });
        }
      } catch (e) {
        if (kDebugMode) {
          print('Error taking picture: $e');
        }
      } finally {
        if (mounted) {
          setState(() {
            isTakingPicture = false;
          });
        }
      }
    }
  }

  String formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, "0");
    String twoDigitMinutes = twoDigits(duration.inMinutes.remainder(60));
    String twoDigitSeconds = twoDigits(duration.inSeconds.remainder(60));
    return "${twoDigits(duration.inHours)}:$twoDigitMinutes:$twoDigitSeconds";
  }

  Widget getCamera() {
    if (isRecording) {
      return Stack(
        children: [
          SizedBox(
              width: MediaQuery.of(context).size.width,
              child: CameraPreview(_cameraController)),
          Positioned(
              top: 0,
              left: 0,
              child: Container(
                padding: const EdgeInsets.fromLTRB(10, 5, 20, 5),
                width: MediaQuery.of(context).size.width,
                height: 40,
                decoration: const BoxDecoration(color: Colors.red),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.circle,
                          color: Colors.white,
                          size: 15,
                        ),
                        const Text(
                          "REC ",
                          style: TextStyle(
                              color: Colors.white, fontWeight: FontWeight.w700),
                        ),
                        Text(
                          context.watch<VideoProvider>().videos.isNotEmpty
                              ? context
                                  .watch<VideoProvider>()
                                  .videos[0]
                                  .frames
                                  .length
                                  .toString()
                              : "0",
                          style: const TextStyle(
                              color: Colors.white, fontWeight: FontWeight.w700),
                        )
                      ],
                    ),
                    Text(
                      formatDuration(timer),
                      style: const TextStyle(
                          color: Colors.white, fontWeight: FontWeight.w700),
                    )
                  ],
                ),
              ))
        ],
      );
    }

    return SizedBox(
        width: MediaQuery.of(context).size.width,
        child: CameraPreview(_cameraController));
  }
}
