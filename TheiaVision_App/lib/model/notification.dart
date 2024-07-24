
import 'dart:convert';

import 'package:intl/intl.dart';

import 'notification_types.dart';

class CustomNotification{

  final int id;
  final String title;
  final String text;
  late bool isNew;
  final String date;
  final NotificationType notificationType;
  final String email;
  



  CustomNotification(this.title, this.text, this.isNew, this.date, this.notificationType, this.email, this.id);

  void setIsNew(bool val){
    isNew = val;
  }

  String dateToString(){
    DateTime dateTime = DateTime.parse(date);

    return  DateFormat("yyyy-MM-dd | HH:mm:ss").format(dateTime);
  }


  // Convert CustomNotification object to JSON
  Map<String, dynamic> toJson() {
    return {'id':id,
      'title': title,
      'text': text,
      'isNew': isNew,
      'date': date,
      'notificationType': notificationType.toJson(),
      'email': email
    };
  }

  // Create CustomNotification object from JSON
  factory CustomNotification.fromJson(Map<String, dynamic> json) {
    return CustomNotification(
      json['title'],
      json['text'],
      json['isNew'],
      json['date'],
      NotificationType.fromJson(json['notificationT'
          'ype']),
      json['email'],
      json['id']
    );
  }

  // Convert CustomNotification object to JSON string
  String toJsonString() {
    return json.encode(toJson());
  }

  // Create CustomNotification object from JSON string
  static CustomNotification fromJsonString(String jsonString) {
    Map<String, dynamic> jsonMap = json.decode(jsonString);
    return CustomNotification.fromJson(jsonMap);
  }
}