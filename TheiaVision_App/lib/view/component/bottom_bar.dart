import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:theia/constants.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../utils.dart';

class CustomBottomNavBar extends StatelessWidget {
  final Widget body;
  final int currentIndex;
  static const pages = [
    "/",
    "/videos",
    "/camera",
    "/occurrences",
    "/streetViewer"
  ];
  bool isLocked;

  CustomBottomNavBar(
      {super.key,
      required this.body,
      required this.currentIndex,
      this.isLocked = false});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: body,
      bottomNavigationBar: getBottomNavBar(context),
    );
  }

  getBottomNavBar(BuildContext context) {
    return Container(
      height: 70,
      decoration: const BoxDecoration(boxShadow: <BoxShadow>[
        BoxShadow(
            color: theiaBrightPurple,
            blurRadius: 10,
            blurStyle: BlurStyle.outer),
      ], color: theiaAppBarGray),
      child: BottomNavigationBar(
        currentIndex: currentIndex == -1 ? 0 : currentIndex,
        onTap: (index) {
          if (isLocked) {
            showCustomToast(AppLocalizations.of(context)!
                .cannot_leave_while_recording_toast);
            return;
          }
          log(ModalRoute.of(context)!.settings.name.toString());
          if(  index == -1 || ModalRoute.of(context)?.settings.name != pages[index]) {
            Navigator.of(context).pushReplacementNamed(pages[index]);
          }
        },
        items: getItems(context),
        selectedItemColor: currentIndex == -1
            ? theiaBrightPurpleOpacityDown
            : theiaBrightPurple,
        unselectedItemColor: theiaBrightPurpleOpacityDown,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        selectedFontSize: 10,
        unselectedFontSize: 10,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700),
      ),
    );
  }

  List<BottomNavigationBarItem> getItems(BuildContext context) {
    return [
      BottomNavigationBarItem(
          icon: SvgPicture.asset(
            "assets/icons/icon_home.svg",
            colorFilter: ColorFilter.mode(
                (currentIndex == 0)
                    ? theiaBrightPurple
                    : theiaBrightPurpleOpacityDown,
                BlendMode.srcIn),
            height: 30,
          ),
          label: AppLocalizations.of(context)!.homepage),
      BottomNavigationBarItem(
          icon: SvgPicture.asset(
            "assets/icons/icon_videos.svg",
            colorFilter: ColorFilter.mode(
                (currentIndex == 1)
                    ? theiaBrightPurple
                    : theiaBrightPurpleOpacityDown,
                BlendMode.srcIn),
            height: 30,
          ),
          label: AppLocalizations.of(context)!.videos),
      BottomNavigationBarItem(
          icon: SvgPicture.asset(
            "assets/icons/icon_camera.svg",
            colorFilter: ColorFilter.mode(
                (currentIndex == 2)
                    ? theiaBrightPurple
                    : theiaBrightPurpleOpacityDown,
                BlendMode.srcIn),
            height: 30,
          ),
          label: AppLocalizations.of(context)!.camera),
      BottomNavigationBarItem(
          icon: SvgPicture.asset(
            "assets/icons/icon_occur.svg",
            colorFilter: ColorFilter.mode(
                (currentIndex == 3)
                    ? theiaBrightPurple
                    : theiaBrightPurpleOpacityDown,
                BlendMode.srcIn),
            height: 30,
          ),
          label: AppLocalizations.of(context)!.occurrences),
      BottomNavigationBarItem(
          icon: SvgPicture.asset(
            "assets/icons/icon_maps.svg",
            colorFilter: ColorFilter.mode(
                (currentIndex == 4)
                    ? theiaBrightPurple
                    : theiaBrightPurpleOpacityDown,
                BlendMode.srcIn),
            height: 30,
          ),
          label: AppLocalizations.of(context)!.map),
    ];
  }
}
