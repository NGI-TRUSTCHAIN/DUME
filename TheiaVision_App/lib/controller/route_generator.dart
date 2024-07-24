import 'package:flutter/material.dart';
import 'package:theia/model/occurrence.dart';
import 'package:theia/view/page/forgot_password.dart';
import 'package:theia/view/page/language_choice.dart';
import 'package:theia/view/page/other_images.dart';
import 'package:theia/view/page/register.dart';
import 'package:theia/view/page/user_profile.dart';
import 'package:theia/view/page/video_map.dart';
import 'package:theia/view/page/videos.dart';
import 'package:theia/view/page/watch_occurrence.dart';

import '../model/video.dart';
import '../view/page/camera.dart';
import '../view/page/homepage.dart';
import '../view/page/login.dart';
import '../view/page/notifications.dart';
import '../view/page/occurances.dart';
import '../view/page/occurrence.dart';
import '../view/page/page_in_construction.dart';
import '../view/page/settings.dart';
import '../view/page/video.dart';
import '../view/page/watch_video.dart';

class RouterGenerator {
  static Route generateRoute(RouteSettings routeSettings) {
    final args = routeSettings.arguments;

    switch (routeSettings.name) {
      case '/login':

        return MaterialPageRoute(builder: (_) => const LoginPage(),settings: RouteSettings(name: routeSettings.name));
      case '/camera':
        return MaterialPageRoute(builder: (_) => const CameraPage(),settings: RouteSettings(name: routeSettings.name));
      case '/register':
        return MaterialPageRoute(builder: (_) => const RegisterPage(),settings: RouteSettings(name: routeSettings.name));
      case '/':
        return MaterialPageRoute(builder: (_) => const HomePage(),settings: RouteSettings(name: routeSettings.name));
      case '/user':
        return MaterialPageRoute(builder: (_) => const UserProfile(),settings: RouteSettings(name: routeSettings.name));
      case '/occurrences':
        return MaterialPageRoute(builder: (_) => const OccurrencesPage(),settings: RouteSettings(name: routeSettings.name));
      case '/occurrence':
        var occurrence = args as Occurrence;

        return MaterialPageRoute(
            builder: (_) => OccurrencePage(occurrence: occurrence),settings: RouteSettings(name: routeSettings.name));
      case '/videos':
        return MaterialPageRoute(builder: (_) => const VideosPage(),settings: RouteSettings(name: routeSettings.name));
      /*case '/streetViewer':
        return MaterialPageRoute(builder: (_) => const StreetViewerWidget(),settings: RouteSettings(name: routeSettings.name));*/
      case '/language':
        return MaterialPageRoute(builder: (_) => const LanguagePage(),settings: RouteSettings(name: routeSettings.name));
      case '/forgotPassEmail':
        return MaterialPageRoute(builder: (_) => const ForgotPasswordEmail(),settings: RouteSettings(name: routeSettings.name));
      case '/settings':
        return MaterialPageRoute(builder: (_) => const SettingsProfile(),settings: RouteSettings(name: routeSettings.name));
      case '/notifications':
        int index;
        if (args == null) {
          index = -1;
        } else {
          index = args as int;
        }

        return MaterialPageRoute(
            builder: (_) => NotificationsPage(
                  open: index,
                ),settings: RouteSettings(name: routeSettings.name));
      case '/video':
        var video = args as Video;
        return MaterialPageRoute(
            builder: (_) => VideoPage(
                  video: video,
                ),settings: RouteSettings(name: routeSettings.name));
      case '/watch-video':
        var video = args as Video;
        return MaterialPageRoute(
            builder: (_) => WatchVideoPage(
                  video: video,
                ),settings: RouteSettings(name: routeSettings.name));

      case '/watch-occurrence':
        var occurrence = args as Occurrence;
        return MaterialPageRoute(
            builder: (_) => WatchOccurrencePage(
                  occurrence: occurrence,
                ),settings: RouteSettings(name: routeSettings.name));
      case '/video-map':
        var video = args as Video;
        return MaterialPageRoute(
            builder: (_) => VideoMapPage(
                  video: video,
                ),settings: RouteSettings(name: routeSettings.name));
      case '/other-images':
        var occurrence = args as Occurrence;
        return MaterialPageRoute(
            builder: (_) => OtherImagesPage(
                  occurrence: occurrence,
                ),settings: RouteSettings(name: routeSettings.name));

      default:
        return MaterialPageRoute(builder: (_) => const PageInConstruction(),settings: RouteSettings(name: routeSettings.name));
    }
  }
}
