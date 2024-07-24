import 'package:intl/intl.dart';
import 'package:theia/model/custom_image.dart';
import 'package:theia/model/recorded_video.dart';
import 'package:theia/model/upload_state.dart';

import '../utils.dart';
import 'event.dart';

class Video {
  final String id;
  final List<Event> events;
  final String origin;
  late final String startDate;
  late final String endDate;
  final String location;
  final double distanceTravelled;
  late int receivedFrames;
  final int totalFrames;
  late UploadState uploadState;
  List<CustomImage> images;
  int? totalSize;
  int? uploadedSize;

  Video(
      this.id,
      this.events,
      this.origin,
      this.startDate,
      this.endDate,
      this.location,
      this.uploadState,
      this.images,
      this.distanceTravelled,
      this.receivedFrames,
      this.totalFrames,
      this.totalSize,
      this.uploadedSize
      );

  String startDateToString() {
    DateTime dateTime = DateTime.parse(startDate);

    return DateFormat("yyyy-MM-dd | HH:mm:ss").format(dateTime);
  }

  String endDateToString() {
    DateTime dateTime = DateTime.parse(endDate);

    return DateFormat("yyyy-MM-dd | HH:mm:ss").format(dateTime);
  }

  static Future<Video> fromRecordedVideo(RecordedVideo recordedVideo) async {
    return Video(
      recordedVideo.videoId,
      [],
      "MOBILE",
      recordedVideo.getStartDate()!,
      recordedVideo.getEndDate()!,
      await getAddress(recordedVideo.getStartCoordinates()!.latitude,
          recordedVideo.getStartCoordinates()!.longitude),
      recordedVideo.uploadState ?? UploadState.waiting,
      [],
      recordedVideo.getDistanceTravelled(),
      recordedVideo.framesUploaded,
      recordedVideo.frames.length,
      recordedVideo.totalSize,
      recordedVideo.uploadedSize
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'events': events.map((e) => e.toJson()).toList(),
      'origin': origin,
      'startDate': startDate,
      'endDate': endDate,
      'location': location,
      'distanceTravelled': distanceTravelled,
      'receivedFrames': receivedFrames,
      'totalFrames': totalFrames,
      'uploadState': uploadState.toString(),
      'images': images.map((i) => i.toJson()).toList(),
      'totalSize' : totalSize,
      'uploadedSize': uploadedSize
    };
  }

  static Video fromJson(Map<String, dynamic> json) {
    return Video(
      json['id'],
      (json['events'] as List).map((e) => Event.fromJson(e)).toList(),
      json['origin'],
      json['startDate'],
      json['endDate'],
      json['location'],
      UploadState.values.firstWhere((e) => e.toString() == json['uploadState']),
      (json['images'] as List).map((i) => CustomImage.fromJson(i)).toList(),
      json['distanceTravelled'],
      json['receivedFrames'],
      json['totalFrames'],
      json['totalSize'],
      json['uploadedSize'],
    );
  }

  @override
  String toString() {
    return 'Video{id: $id, events: $events, origin: $origin, startDate: $startDate, endDate: $endDate, location: $location, distanceTravelled: $distanceTravelled, receivedFrames: $receivedFrames, totalFrames: $totalFrames, uploadState: $uploadState, images: $images, totalSize: $totalSize, uploadedSize: $uploadedSize}';
  }
}
