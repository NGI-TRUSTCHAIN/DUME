import 'dart:convert';

import 'package:geolocator/geolocator.dart';
import 'package:theia/model/coordinates.dart';
import 'package:theia/model/upload_state.dart';

import 'frame.dart';

class RecordedVideo {
  final String videoId;
  List<Frame> frames = [];
  final String email;
  late String? token;
  UploadState? uploadState;
  int? totalSize;
  int? uploadedSize;
  int framesUploaded;

  RecordedVideo(this.videoId, this.email, this.token, this.framesUploaded);

  void addFrame(Frame frame) {
    frames.add(frame);
  }

  String? getStartDate() {
    if (frames.isNotEmpty) {
      return frames.first.date;
    }
    return null;
  }

  String? getEndDate() {
    if (frames.isNotEmpty) {
      return frames.last.date;
    }
    return null;
  }

  Coordinates? getStartCoordinates() {
    if (frames.isNotEmpty) {
      return frames.first.coordinates;
    }
    return null;
  }

  Coordinates? getEndCoordinates() {
    if (frames.isNotEmpty) {
      return frames.last.coordinates;
    }
    return null;
  }

  int getFrameNumber() {
    return frames.length;
  }

  factory RecordedVideo.fromMap(Map<String, dynamic> map) {
    RecordedVideo video =
        RecordedVideo(map['videoId'] as String, map['email'] as String, null,map["framesUploaded"]);

    video.frames.addAll(
      (map['frames'] as List<dynamic>).map(
        (frameData) => Frame.fromJson(frameData as Map<String, dynamic>),
      ),
    );

    video.uploadState = UploadState.values.firstWhere((e) => e.toString() == map['uploadState']);

    video.uploadedSize = map["uploadedSize"];
    video.totalSize = map["totalSize"];


    return video;
  }

  Map<String, dynamic> toMap() {
    return {
      'videoId': videoId,
      'email': email,
      'frames': frames.map((frame) => frame.toJson()).toList(),
      'uploadState': uploadState.toString(),
      'totalSize' : totalSize,
      'uploadedSize' : uploadedSize,
      'framesUploaded' : framesUploaded,

    };
  }

  double getDistanceTravelled(){
    return Geolocator.distanceBetween(
      getStartCoordinates()!.latitude,
      getStartCoordinates()!.longitude,
      getEndCoordinates()!.latitude,
      getEndCoordinates()!.longitude,
    );
  }

  @override
  String toString() {
    return json.encode({
      'id': videoId,
      'device': "MOBILE",
      //TODO: Will need to account for THEIA companion in the future
      'dateStart': getStartDate(),
      'dateEnd': getEndDate(),
      'totalFrames': frames.length,
      'coordinateStart': {
        'latitude': getStartCoordinates()!.latitude,
        'longitude': getStartCoordinates()!.longitude,
      },
      'distanceTravelled': getDistanceTravelled(),
      'receivedFrames':0
    });
  }
}
