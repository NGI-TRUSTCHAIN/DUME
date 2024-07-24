import 'dart:convert';
import 'dart:developer';
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui';

import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http_parser/http_parser.dart';
import 'package:latlong2/latlong.dart';

import '../../model/custom_image.dart';
import '../../model/frame.dart';
import '../../model/order.dart';
import '../../model/recorded_video.dart';
import '../../model/upload_state.dart';
import '../../model/video.dart';
import '../../utils.dart';
import '../http_service.dart';

class VideoRepository {
  HttpService httpService = HttpService();

  Future<Video> getVideoById(String videoId, String token,
      List<RecordedVideo> loadingVideosList, BuildContext context) async {
    try {
      var headers = {'Authorization': 'Bearer $token'};

      String url = "videos//video/";

      var queryParameters = {"videoId": videoId};

      var response =
          await httpService.getRequest(url, queryParameters, headers, context);

      if (httpService.isOk(response.statusCode!)) {


        var object = response.data["message"];

        var location = await getAddress(object["coordinateStart"]["latitude"],
            object["coordinateStart"]["longitude"]);

        var video = Video(
            object["id"],
            [],
            object["deviceId"] == 1 ? "MOBILE" : "COMPANION",
            object["dateStart"],
            object["dateEnd"],
            location,
            loadingVideosList.any((v) => v.videoId == object["id"])
                ? UploadState.uploading
                : UploadState.uploaded,
            [],
            (object["distanceTravelled"] as int).toDouble(),
            object["receivedFrames"],
            object["totalFrames"],
            1,
            1);

        return video;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<Video> getVideoByIdSolid(String videoId, String token,
      List<RecordedVideo> loadingVideosList, BuildContext context) async {
    try {
      var headers = {'Authorization': 'Bearer $token'};

      String url = "videos//video/";

      var queryParameters = {"videoId": videoId};

      var response =
      await httpService.getRequest(url, queryParameters, headers, context);

      if (httpService.isOk(response.statusCode!)) {


        var object = response.data["message"];

        var location = await getAddress(object["coordinateStart"]["latitude"],
            object["coordinateStart"]["longitude"]);

        var video = Video(
            object["id"],
            [],
            object["deviceId"] == 1 ? "MOBILE" : "COMPANION",
            object["dateStart"],
            object["dateEnd"],
            location,
            loadingVideosList.any((v) => v.videoId == object["id"])
                ? UploadState.uploading
                : UploadState.uploaded,
            [],
            (object["distanceTravelled"] as int).toDouble(),
            object["receivedFrames"],
            object["totalFrames"],
            1,
            1);

        return video;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<List<CustomImage>> getFrames(
      String videoId, String token, BuildContext context) async {
    try {
      List<CustomImage> list = [];

      var headers = {'Authorization': 'Bearer $token'};
      String url = "videos/frames/";
      var queryParameters = {"videoId": videoId};

      var response =
          await httpService.getRequest(url, queryParameters, headers, context);

      if (httpService.isOk(response.statusCode!)) {
        var msg = response.data["message"];

        for (var img in msg["images"]) {
          var image = CustomImage(img["id"], img["date"], img["url"]);
          list.add(image);
        }
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }

      return list;
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<List<String>> getDateLimits(
      String token, String email, BuildContext context) async {
    try {
      var headers = {'Authorization': 'Bearer $token'};

      String url = 'videos/date-limits';

      var queryParams = {"email": email};

      var response =
          await httpService.getRequest(url, queryParams, headers, context);

      var message = response.data["message"];

      if (httpService.isOk(response.statusCode!)) {
        var oldestDate = message["oldestDate"] ?? DateTime.now().toString();
        var newestDate = message["newestDate"] ?? DateTime.now().toString();
        return [oldestDate, newestDate];
      } else {
        log(response.data);
        return [DateTime.now().toString(), DateTime.now().toString()];
      }
    } on HttpException catch (_) {
      return [DateTime.now().toString(), DateTime.now().toString()];
    }
  }

  static Future<void> uploadFrames(
    List<Frame> frames,
    String videoId,
    String token,
  ) async {
    try {
      final sendPort = IsolateNameServer.lookupPortByName("videoChannel");

      HttpService httpService = HttpService();

      var path = frames.first.path;

      var ext = path.split('.').last;

      var headers = {
        'Authorization': 'Bearer $token',
      };

      var metadataList = [];

      var formData = FormData();

      for (var frame in frames) {
        var frameMetadata = json.encode({
          "frameId": frame.id,
          "date": frame.date,
          "coordinates": {
            "latitude": frame.coordinates.latitude,
            "longitude": frame.coordinates.longitude
          },
          "videoId": videoId,
        });

        metadataList.add(frameMetadata);

        MediaType? contentType;

        if (ext == "yuv") {
          contentType = MediaType("application", "octet-stream");
        } else if (ext == "png") {
          contentType = MediaType("image", "png");
        } else if (ext == "jpg" || ext == "jpeg") {
          contentType = MediaType("image", ext);
        }

        var fileKey = frames.length == 1 ? 'frame' : 'frames';

        formData.files.add(MapEntry(
          fileKey,
          await MultipartFile.fromFile(frame.path, contentType: contentType),
        ));
      }

      formData.fields.add(MapEntry('frameMetadata', metadataList.toString()));

      int newTotal = 0;
      int prev = 0;

      onSend(sent, total) {
        if (newTotal == 0) {
          if (sendPort != null) {
            sendPort.send({"action": "T_Size", "id": videoId, "value": total});
          }
          newTotal = total;
        }
        if ((sent - prev) / total > 0.05) {
          prev = sent;
          if (sendPort != null) {
            sendPort.send({
              "action": "U_Size",
              "id": videoId,
              "value": sent,
            });
          }
        }
      }

      String url = "frames/create-frame";

      var response =
          await httpService.postRequest(url, formData, headers, null, onSend);

      if (httpService.isOk(response.statusCode!)) {
        return;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  static Future<void> uploadVideo(RecordedVideo video) async {
    try {
      HttpService httpService = HttpService();

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${video.token}'
      };

      String url = "videos/create-video";

      var data = json.encode({
        "videoId": video.videoId,
        "dateStart": video.getStartDate(),
        "dateEnd": video.getEndDate(),
        "coordinatesStart": {
          "latitude": video.getStartCoordinates()!.latitude,
          "longitude": video.getStartCoordinates()!.longitude
        },
        "coordinatesEnd": {
          "latitude": video.getEndCoordinates()!.latitude,
          "longitude": video.getEndCoordinates()!.longitude
        },
        "origin": "MOBILE", //TODO: This will need to be checked somehow...
        "userEmail": video.email,
        "totalFrames": video.getFrameNumber()
      });

      var response =
          await httpService.postRequest(url, data, headers, null, (a, b) {});

      if (httpService.isOk(response.statusCode!) || response.statusCode == 409 ) {
        return;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    } catch (e) {
      print(e);
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
      List<RecordedVideo> loadingVideosList,
      int pageSize,
      BuildContext context) async {
    try {
      final sendPort = IsolateNameServer.lookupPortByName("videoChannel");

      List<Video> vidList = [];

      var headers = {'Authorization': 'Bearer $token'};

      var fromDate = DateTime.parse(from);
      var toDate = DateTime.parse(to);

      String url = "videos/";

      var queryParameters = {
        "email": email,
        "startingRow": page * pageSize,
        "numberOfRows": pageSize,
        "orderBy": order == Order.ascendant ? "asc" : "desc",
        "dateStart": fromDate,
        "dateEnd": toDate,
      };

      if (uploadState == UploadState.uploaded) {
        queryParameters["uploadStatus"] = "uploaded";
      }

      if (uploadState == UploadState.uploading) {
        queryParameters["uploadStatus"] = "uploading";
      }

      var response =
          await httpService.getRequest(url, queryParameters, headers, context);

      if (httpService.isOk(response.statusCode!)) {
        var msg = response.data["message"];

        for (var object in msg) {
          var location = await getAddress(object["coordinateStart"]["latitude"],
              object["coordinateStart"]["longitude"]);

          // -------
          // Updating loading list if needed with info from the server

          // Removing from is waiting if is uploading or complete
          var isInWaiting = loadingVideosList.any((v) =>
              v.videoId == object["id"] &&
              v.uploadState == UploadState.waiting);

          if (object["uploadStatus"] == 100 && isInWaiting) {
            if (sendPort != null) {
              sendPort.send({"action": "R", "id": object["id"]});
            }
          } else if (object["uploadStatus"] != 100 && isInWaiting) {
            if (sendPort != null) {
              sendPort.send({"action": "RW_AU", "id": object["id"]});
            }
          }

          // Removing from is uploading if is complete

          var isUploading = loadingVideosList.any((v) =>
              v.videoId == object["id"] &&
              v.uploadState == UploadState.uploading &&
              (v.totalSize != null && v.uploadedSize != null));

          if (object["receivedFrames"] == object["totalFrames"] &&
              isUploading) {
            if(sendPort != null) {
              sendPort.send({"action": "RU", "id": object["id"]});
            }
          }

          // -------

          var video = Video(
            object["id"],
            [],
            object["deviceId"] == 1 ? "MOBILE" : "COMPANION",
            object["dateStart"],
            object["dateEnd"],
            location,
            loadingVideosList.any((v) =>
                    v.videoId == object["id"] &&
                    v.uploadState == UploadState.uploading)
                ? UploadState.uploading
                : UploadState.uploaded,
            [],
            (object["distanceTravelled"] as int).toDouble(),
            object["receivedFrames"],
            object["totalFrames"],
            loadingVideosList.any((v) =>
                    v.videoId == object["id"] &&
                    v.uploadState == UploadState.uploading)
                ? loadingVideosList
                    .firstWhere((v) =>
                        v.videoId == object["id"] &&
                        v.uploadState == UploadState.uploading)
                    .totalSize
                : 1,
            loadingVideosList.any((v) =>
                    v.videoId == object["id"] &&
                    v.uploadState == UploadState.uploading)
                ? loadingVideosList
                    .firstWhere((v) =>
                        v.videoId == object["id"] &&
                        v.uploadState == UploadState.uploading)
                    .uploadedSize
                : 1,
          );

          if (uploadState == UploadState.uploaded &&
              video.uploadState == video.uploadState) {
            vidList.add(video);
          } else if (uploadState == null) {
            vidList.add(video);
          }
        }
        return vidList;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<void> deleteVideo(
      String videoId, String token, BuildContext context) async {
    try {
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      };

      String url = "videos/delete-video";

      var data = {"videoId": videoId};

      var response =
          await httpService.deleteRequest(url, data, headers, context);

      if (httpService.isOk(response.statusCode!)) {
        return;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<List<LatLng>> getRouteTraveled(
      String token, String videoId, BuildContext context) async {
    try {
      List<LatLng> coordinates = [];

      var headers = {'Authorization': 'Bearer $token'};

      String url = "videos/route-travelled/";
      var queryParameters = {"videoId": videoId};

      var response =
          await httpService.getRequest(url, queryParameters, headers, context);


      if (httpService.isOk(response.statusCode!)) {

        var msg = response.data["message"];

        for (var pic in msg){
          var coords = pic["coordinates"];
          LatLng coordinate = LatLng(
              coords["latitude"],
              coords["longitude"]
          );

          coordinates.add(coordinate);
        }

        log(coordinates.toString());
        return coordinates;

      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<Uint8List> getFrame(String url) async {
    var response = await httpService.getRequest(url, {}, {}, null,
        responseType: ResponseType.bytes);

    log(response.statusCode.toString());
    log(url);
    log(response.toString());

    return response.data;
  }
}
