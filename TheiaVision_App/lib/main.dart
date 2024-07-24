import 'dart:convert';
import 'dart:developer';
import 'dart:io';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:theia/constants.dart';
import 'package:theia/controller/provider/test_provider.dart';
import 'package:theia/controller/provider/video_provider.dart';
import 'package:theia/controller/route_generator.dart';
import 'package:workmanager/workmanager.dart';

import 'controller/provider/language_provider.dart';
import 'controller/provider/map_provider.dart';
import 'controller/provider/notification_provider.dart';
import 'controller/provider/occurrence_provider.dart';
import 'controller/provider/user_provider.dart';
import 'model/connection.dart';
import 'model/recorded_video.dart';

final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
    FlutterLocalNotificationsPlugin();

String? token;

Future<void> initNotifications() async {
  const AndroidInitializationSettings initializationSettingsAndroid =
      AndroidInitializationSettings('ic_launcher');
  const InitializationSettings initializationSettings =
      InitializationSettings(android: initializationSettingsAndroid);
  await flutterLocalNotificationsPlugin
      .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>()
      ?.requestNotificationsPermission();

  await flutterLocalNotificationsPlugin.initialize(initializationSettings);
}

Future<void> requestNotificationPermissions() async {
  await flutterLocalNotificationsPlugin
      .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>()
      ?.createNotificationChannel(const AndroidNotificationChannel(
        'channel_id', // Change to your channel id
        'Channel Name', // Change to your channel name
        description: 'Description',
        importance: Importance.max,

      ));
}

@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((taskName, inputData) async {

    var data = await File(inputData!["path"]).readAsString();
    var video = RecordedVideo.fromMap(json.decode(data));

    var uploadDate = DateTime.parse(inputData["uploadDate"]);
    var timeOut = uploadDate.difference(DateTime.now()) >= const Duration(minutes: 3);


    final SharedPreferences prefs = await SharedPreferences.getInstance();
    var token = prefs.getString("user_token");




    if (token == null){
      log("🛑 User is not logged in. Scheduling retry for later.");

      String con = prefs.getString("upload_pref") ?? "Connection.wifi";

      var connection = Connection.getConnection(con);

      NetworkType networkType;

      if (connection == Connection.wifi){
        networkType = NetworkType.unmetered;
      }else{
        networkType = NetworkType.connected;
      }

      // IOS needs to manually reschedule the tasks... Android does it automatically
      if (Platform.isIOS) {
        Workmanager().registerOneOffTask(video.videoId, "uploadVideo",
            constraints: Constraints(networkType: networkType),
            inputData: inputData, backoffPolicy: BackoffPolicy.exponential, // Retry policy
            existingWorkPolicy: ExistingWorkPolicy.keep);
      }

      return Future.value(false);
    }

    try {

      video.token = token;

      for (var frame in video.frames){
        final file = File(frame.path);
        var exists = await file.exists();
        if (!exists && !timeOut){

          log("🛑 File ${frame.path} has not been saved yet... Rescheduling");

          String con = prefs.getString("upload_pref") ?? "Connection.wifi";

          var connection = Connection.getConnection(con);

          NetworkType networkType;

          if (connection == Connection.wifi){
            networkType = NetworkType.unmetered;
          }else{
            networkType = NetworkType.connected;
          }

          // IOS needs to manually reschedule the tasks... Android does it automatically
          if (Platform.isIOS) {
            Workmanager().registerOneOffTask(video.videoId, "uploadVideo",
                constraints: Constraints(networkType: networkType),
                inputData: inputData, backoffPolicy: BackoffPolicy.exponential, // Retry policy
                existingWorkPolicy: ExistingWorkPolicy.keep);
          }

          return Future.value(false);


        }else if (!exists && timeOut){
          video.frames.remove(frame);
        }
      }

      await VideoProvider.uploadVideoAndCleanMemory(video);

      File videoFile = File(inputData["path"]);
      await videoFile.delete();

      log("📗 Video ${video.videoId} File deleted");

      log("📗 Video ${video.videoId} All files deleted from local memory");


      return true;
    } catch (error) {


      final sendPort = IsolateNameServer.lookupPortByName("videoChannel");

      if (sendPort != null) {
        sendPort.send({"action": "AW_RU", "id": video.videoId});
      }


      var file = File(inputData["path"]);
      await file.writeAsString(json.encode(video.toMap()));

      log("🛑 WorkManager Failed to upload video ${video.videoId} - $error");

      String con = prefs.getString("upload_pref") ?? "Connection.wifi";

      var connection = Connection.getConnection(con);

      NetworkType networkType;

      if (connection == Connection.wifi){
        networkType = NetworkType.unmetered;
      }else{
        networkType = NetworkType.connected;
      }

      // IOS needs to manually reschedule the tasks... Android does it automatically
      if (Platform.isIOS) {
        Workmanager().registerOneOffTask(video.videoId, "uploadVideo",
            constraints: Constraints(networkType: networkType),
            inputData: inputData, backoffPolicy: BackoffPolicy.exponential, // Retry policy
            existingWorkPolicy: ExistingWorkPolicy.keep);
      }

      return Future.value(false);
    }
  });
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initNotifications();
  await requestNotificationPermissions();
  Workmanager().initialize(callbackDispatcher);
  final SharedPreferences prefs = await SharedPreferences.getInstance();
  token = prefs.getString("user_token");
  runApp(MultiProvider(providers: [
    ChangeNotifierProvider<TestProvider>(create: (context) => TestProvider()),
    ChangeNotifierProvider<LanguageChangeProvider>(
        create: (context) => LanguageChangeProvider()),
    ChangeNotifierProvider<UserProvider>(create: (context) => UserProvider()),
    ChangeNotifierProvider<VideoProvider>(create: (context) => VideoProvider()),
    ChangeNotifierProvider<OccurrenceProvider>(create: (context) => OccurrenceProvider()),
    ChangeNotifierProvider<NotificationProvider>(create: (context) => NotificationProvider()),
    ChangeNotifierProvider<MapProvider>(create: (context) => MapProvider()),
  ], child: const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Theia',
      theme: customTheme,
      locale: Provider.of<LanguageChangeProvider>(context, listen: true)
          .getCurrentLocale(),
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      initialRoute: token == null ? '/language' : '/',
      onGenerateRoute: RouterGenerator.generateRoute,
    );
  }
}
