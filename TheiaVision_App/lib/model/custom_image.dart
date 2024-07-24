import 'package:intl/intl.dart';

class CustomImage{

  String id;
  String date;
  String url;

  CustomImage(this.id, this.date, this.url);

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': date,
      'url': url,
    };
  }

  @override
  String toString() {
    return 'CustomImage{id: $id, date: $date, url: $url}';
  }

  static CustomImage fromJson(Map<String, dynamic> json) {
    return CustomImage(
      json['id'],
      json['date'],
      json['url'],
    );
  }

  String dateToString() {
    DateTime dateTime = DateTime.parse(date);

    return DateFormat("yyyy-MM-dd  HH:mm:ss").format(dateTime);
  }
}