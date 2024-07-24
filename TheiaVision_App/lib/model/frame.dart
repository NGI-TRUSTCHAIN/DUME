

import 'coordinates.dart';

class Frame{

  final String id;
  String path;
  final Coordinates coordinates;
  final String date;

  Frame(this.id, this.path, this.coordinates, this.date);

  factory Frame.fromJson(Map<String, dynamic> map) {
    return Frame(
      map['id'] as String,
      map['path'] as String,
      Coordinates.fromJson(map['coordinates'] as Map<String, dynamic>),
      map['date'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'path': path,
      'date': date,
      'coordinates': coordinates.toJson(),
    };
  }

}