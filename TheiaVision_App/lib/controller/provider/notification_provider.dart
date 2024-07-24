import 'dart:isolate';
import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:theia/model/notification.dart';
import 'package:theia/model/notification_types.dart';
import 'package:uuid/uuid.dart';

import '../../main.dart';
import '../../model/dates.dart';
import '../../model/loading_state.dart';
import '../../model/notif_and_index.dart';
import '../../model/order.dart';
import '../../model/upload_state.dart';

class NotificationProvider extends ChangeNotifier {
  List<CustomNotification> notifications = [];
  Locale currentLocale = const Locale('en');

  Uuid uuid = const Uuid();

  static const pageSize = 10;

  LoadingState deleteAll = LoadingState.finished;
  var port = ReceivePort();
  Function()? updateList;

  NotificationProvider() {
    IsolateNameServer.registerPortWithName(
        port.sendPort, "notificationChannel");
    initializeTestFromSharedPrefs();

    port.listen((dynamic data) async {
      if(data["image"]){
        showImageNotification(data["email"], data["id"],data["action"] == "Uploaded" ? UploadState.uploaded : UploadState.uploading);
      }else{
        showVideoNotification(data["email"], data["id"],data["action"] == "Uploaded" ? UploadState.uploaded : UploadState.uploading);
      }
    });
  }

  Future<void> initializeTestFromSharedPrefs() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    var list = prefs.getStringList("notifications") ?? [];

    for (var notification in list) {
      notifications.add(CustomNotification.fromJsonString(notification));
    }

    currentLocale = Locale(prefs.getString("locale") ?? "en");

    notifyListeners();
  }

  Future<void> deleteNotification(int index) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    var list = prefs.getStringList("notifications") ?? [];
    list.remove(notifications[index].toJsonString());
    notifications.removeAt(index);
    notifyListeners();

    await prefs.setStringList("notifications", list);
  }

  Future<void> deleteAllNotifications() async {
    deleteAll = LoadingState.loading;
    SharedPreferences prefs = await SharedPreferences.getInstance();

    notifications.clear();
    notifyListeners();

    await prefs.setStringList("notifications", []);
    deleteAll = LoadingState.finished;
  }

  Future<void> setAsRead(int index) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    var list = prefs.getStringList("notifications") ?? [];
    list.remove(notifications[index].toJsonString());
    notifications[index].setIsNew(false);
    list.add(notifications[index].toJsonString());
    await prefs.setStringList("notifications", list);

    notifyListeners();
  }

  Future<void> _showNotification(String title, String body,
      NotificationType notificationType, int id) async {
    const AndroidNotificationDetails androidPlatformChannelSpecifics =
        AndroidNotificationDetails(
      'channel_id', // Change to your channel id
      'Channel Name', // Change to your channel name
      importance: Importance.max,
    );
    const NotificationDetails platformChannelSpecifics =
        NotificationDetails(android: androidPlatformChannelSpecifics);
    await flutterLocalNotificationsPlugin.show(
      id, // Notification ID
      title, // Notification title
      body, // , // Notification body
      platformChannelSpecifics,
    );
  }

  Future<void> showVideoNotification(String email, String videoId, UploadState mode) async {
    var appLocal = await AppLocalizations.delegate.load(currentLocale);

    var title = mode == UploadState.waiting ? appLocal.scheduled_video_upload_notification_title :mode == UploadState.uploading ? appLocal.video_uploading_notification_title :appLocal.video_uploaded_notification_title ;
    var body = mode == UploadState.waiting ? appLocal.scheduled_video_upload_notification_message(videoId) : mode == UploadState.uploading ? appLocal.video_uploading_notification_message(videoId) : appLocal.video_uploaded_notification_message(videoId) ;
    var notificationType = NotificationType.video;
    var id = videoId.hashCode;

    _showNotification(title, body, notificationType, id);

    var customNotification = CustomNotification(title, body, true,
        DateTime.now().toString(), notificationType, email, id);

    addToNotifications(customNotification);

    await saveToSharedPrefs(customNotification);

    notifyListeners();
  }

  Future<void> showImageNotification(String email, String imageId, UploadState mode) async {
    var appLocal = await AppLocalizations.delegate.load(currentLocale);

    var title = mode == UploadState.waiting ? appLocal.scheduled_image_upload_notification_title :mode == UploadState.uploading ? appLocal.image_uploading_notification_title :appLocal.image_uploaded_notification_title ;
    var body = mode == UploadState.waiting ? appLocal.scheduled_image_upload_notification_message(imageId) : mode == UploadState.uploading ? appLocal.image_uploading_notification_message(imageId) : appLocal.image_uploaded_notification_message(imageId) ;
    var notificationType = NotificationType.image;
    var id = imageId.hashCode;

    _showNotification(title, body, notificationType, id);

    var customNotification = CustomNotification(title, body, true,
        DateTime.now().toString(), notificationType, email, id);

    addToNotifications(customNotification);

    await saveToSharedPrefs(customNotification);

    notifyListeners();
  }

  saveToSharedPrefs(CustomNotification customNotification) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    var list = prefs.getStringList("notifications") ?? [];
    list.add(customNotification.toJsonString());
    await prefs.setStringList("notifications", list);
    list = prefs.getStringList("notifications") ?? [];
  }

  addToNotifications(CustomNotification customNotification) {
    var found = notifications.indexWhere((c) => c.id == customNotification.id);

    if (found == -1) {
      notifications.add(customNotification);
    } else {
      notifications.removeAt(found);
      notifications.add(customNotification);
    }

    if(updateList != null) {
      updateList!();
    }
  }

  int getNumberOfNewNotifs() {
    int i = 0;

    for (var notif in notifications) {
      if (notif.isNew) {
        i++;
      }
    }

    return i;
  }

  List<String> getDateLimits() {
    if (notifications.isEmpty) {
      String oldestDateStr = DateFormat('yyyy-MM-dd').format(DateTime.now());
      String newestDateStr = DateFormat('yyyy-MM-dd').format(DateTime.now());

      return [oldestDateStr, newestDateStr];
    }

    // Convert the date strings to DateTime objects
    List<DateTime> dates = notifications
        .map((notification) => DateTime.parse(notification.date))
        .toList();

    // Find the greatest and smallest dates
    DateTime minDate = dates
        .reduce((value, element) => value.isBefore(element) ? value : element);
    DateTime maxDate = dates
        .reduce((value, element) => value.isAfter(element) ? value : element);

    // Convert DateTime objects back to strings
    String minDateString = DateFormat('yyyy-MM-dd').format(minDate);
    String maxDateString = DateFormat('yyyy-MM-dd').format(maxDate);

    print(minDateString);
    print(maxDateString);

    return [minDateString, maxDateString];
  }

  List<CustomNotification> getAllNotifications(
      int page,
      String to,
      String from,
      Order order,
      NotificationType? notificationType,
      bool? notificationState) {
    try {
      // Convert 'to' and 'from' strings to DateTime objects
      DateTime? toDate;
      DateTime? fromDate;

      if (to.isNotEmpty) {
        toDate = DateTime.parse(to).add(const Duration(days: 1));
      }
      if (from.isNotEmpty) {
        fromDate = DateTime.parse(from);
      }

      // Filter notifications based on criteria
      List<CustomNotification> filteredNotifications =
          notifications.where((notification) {
        // You can adjust the filtering logic based on your requirements
        bool matchesType = notificationType == null ||
            notification.notificationType == notificationType;

        bool matchesState = notificationState == null ||
            notification.isNew == notificationState;
        bool matchesTo = toDate == null ||
            DateTime.parse(notification.date).isBefore(toDate);
        bool matchesFrom = fromDate == null ||
            DateTime.parse(notification.date).isAfter(fromDate);

        return matchesType && matchesState && matchesTo && matchesFrom;
      }).toList();

      // Sorting
      filteredNotifications.sort((a, b) {
        // Assuming 'date' is a string, you might need to convert it to DateTime before comparing
        DateTime aDate = DateTime.parse(a.date);
        DateTime bDate = DateTime.parse(b.date);

        if (order == Order.ascendant) {
          return aDate.compareTo(bDate);
        } else {
          return bDate.compareTo(aDate);
        }
      });

      // Pagination
      int startIndex = page * pageSize;
      int endIndex = startIndex + pageSize;
      if (startIndex < filteredNotifications.length) {
        if (endIndex > filteredNotifications.length) {
          endIndex = filteredNotifications.length;
        }
        return filteredNotifications.sublist(startIndex, endIndex);
      } else {
        return [];
      }
    } catch (e) {
      print(e.toString());
      return [];
    }
  }

  List<NotifAndIndex> getNewNotifications(Dates dates) {
    List<NotifAndIndex> list = [];

    DateTime now = DateTime.now();
    DateTime startOfToday = DateTime(now.year, now.month, now.day);
    DateTime startOfWeek =
        startOfToday.subtract(Duration(days: now.weekday - 1));
    DateTime startOfMonth = DateTime(now.year, now.month, 1);

    switch (dates) {
      case Dates.today:
        for (int i = 0; i < notifications.length; i++) {
          if (notifications[i].isNew) {
            DateTime notificationDate = DateTime.parse(notifications[i].date);
            if (notificationDate.isAfter(startOfToday)) {
              list.add(NotifAndIndex(notifications[i], notifications.length -1 - i));
            }
          }
        }
        break;
      case Dates.week:
        for (int i = 0; i < notifications.length; i++) {
          if (notifications[i].isNew) {
            DateTime notificationDate = DateTime.parse(notifications[i].date);
            if (notificationDate.isAfter(startOfWeek)) {
              list.add(NotifAndIndex(notifications[i], notifications.length -1 - i));
            }
          }
        }
        break;
      case Dates.month:
        for (int i = 0; i < notifications.length; i++) {
          if (notifications[i].isNew) {
            DateTime notificationDate = DateTime.parse(notifications[i].date);
            if (notificationDate.isAfter(startOfMonth)) {
              list.add(NotifAndIndex(notifications[i], notifications.length -1 - i));
            }
          }
        }
        break;
    }

    list.sort((a, b) => DateTime.parse(b.customNotification.date)
        .compareTo(DateTime.parse(a.customNotification.date)));

    return list;
  }
}
