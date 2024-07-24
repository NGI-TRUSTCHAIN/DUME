
class Coordinates{

  final double latitude;
  final double longitude;

  Coordinates(this.latitude, this.longitude);


  factory Coordinates.fromJson(Map<String, dynamic> map) {
    return Coordinates(
      map['latitude'] as double,
      map['longitude'] as double,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'latitude': latitude,
      'longitude': longitude,
    };
  }
}