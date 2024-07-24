
class Event{


  final String name;
  final String timestamp;

  Event(this.name, this.timestamp);

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'timestamp': timestamp,
    };
  }

  static Event fromJson(Map<String, dynamic> json) {
    return Event(
      json['name'],
      json['timestamp'],
    );
  }
}