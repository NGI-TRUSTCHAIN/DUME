import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import 'package:theia/constants.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../controller/provider/notification_provider.dart';
import '../../model/filter.dart';
import '../../model/order.dart';
import '../../utils.dart';
import 'filter_bar.dart';

class TopBar extends StatefulWidget {
  final String text;
  final bool logo;
  final bool orderIcon;
  final bool backButton;
  final String backPage;
  final List<Filter>? otherFilters;
  final bool dateFilter;
  final String oldest;
  final String until;

  final bool isUserPage;
  final bool isNotifPage;
  final Function(Order) onOrderChange;
  final Function(String, String) onDateChange;
  final Object? backArg;
  bool isLocked;

  final String toolTip;

  TopBar(
      {super.key,
      this.text = "",
      this.logo = false,
      this.orderIcon = false,
      this.backButton = false,
      this.backPage = "/",
      this.otherFilters,
      this.dateFilter = false,
      this.oldest = "",
      this.isUserPage = false,
      this.isNotifPage = false,
      this.onOrderChange = _defaultOnOrderChange,
      this.onDateChange = _defaultOnDateChange,
      this.backArg,
      this.until = "",
      this.isLocked = false,
      this.toolTip = ""
      });

  static void _defaultOnOrderChange(Order order) {
    // Default implementation does nothing
  }

  static void _defaultOnDateChange(String from, String to) {
    // Default implementation does nothing
  }

  @override
  State<StatefulWidget> createState() {
    return _TopBarState();
  }
}

class _TopBarState extends State<TopBar> {
  bool showAllFilters = false;

  Widget getLeft() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        if (widget.backButton)
          IconButton(
              onPressed: () {
                if (widget.backArg != null) {
                  if (widget.isLocked) {
                    showCustomToast(AppLocalizations.of(context)!
                        .cannot_leave_while_recording_toast);
                    return;
                  }
                  Navigator.of(context)
                      .pushNamed(widget.backPage, arguments: widget.backArg);
                } else {
                  if (widget.isLocked) {
                    showCustomToast(AppLocalizations.of(context)!
                        .cannot_leave_while_recording_toast);
                    return;
                  }
                  Navigator.of(context).pushNamed(widget.backPage);
                }
              },
              icon: SvgPicture.asset("assets/icons/icon_back.svg",
                  colorFilter:
                      const ColorFilter.mode(Colors.white, BlendMode.srcATop))),
        if (widget.logo)
          Container(
            padding: const EdgeInsets.fromLTRB(5, 0, 0, 0),
            width: 80,
            child: SvgPicture.asset("assets/logos/theia_logo2.svg",
                colorFilter:
                    const ColorFilter.mode(Colors.white, BlendMode.srcATop)),
          ),
        if (widget.text != "")
          Container(
              padding: const EdgeInsets.fromLTRB(5, 0, 0, 10),
              height: 35,
              child: Text(
                widget.text.toUpperCase(),
                style: const TextStyle(
                    fontSize: 18,
                    color: Colors.white,
                    fontWeight: FontWeight.w700),
              )),
        if (widget.toolTip != "")

          Container(
          padding: const EdgeInsets.fromLTRB(5, 0, 0, 10),
          height: 35,
          child: Tooltip(
            showDuration: const Duration(seconds: 2),
            triggerMode: TooltipTriggerMode.tap,
            message: widget.toolTip,
            child: const Icon(
              Icons.info,
              color: Colors.white,
              size: 15,
            ),
          ),
        ),
      ],
    );
  }

  Widget getRight() {
    return Container(
      margin: const EdgeInsets.fromLTRB(0, 0, 0, 4),
      child: Row(
        children: [
          if (widget.orderIcon)
            IconButton(
              onPressed: () {
                setState(() {
                  showAllFilters = !showAllFilters;
                });
              },
              icon: SvgPicture.asset(
                "assets/icons/icon_filters.svg",
                colorFilter: ColorFilter.mode(
                    showAllFilters ? theiaBrightPurple : Colors.white,
                    BlendMode.srcATop),
                height: 30,
              ),
            ),
          Stack(children: [
            IconButton(
              iconSize: 30,
              onPressed: () {
                if (widget.isLocked) {
                  showCustomToast(AppLocalizations.of(context)!
                      .cannot_leave_while_recording_toast);
                  return;
                }
                Navigator.of(context).pushNamed('/notifications');
              },
              icon: SvgPicture.asset(
                "assets/icons/icon_notif.svg",
                colorFilter: widget.isNotifPage
                    ? const ColorFilter.mode(
                        theiaBrightPurple,
                        BlendMode.srcATop,
                      )
                    : const ColorFilter.mode(
                        Colors.white,
                        BlendMode.srcATop,
                      ),
                height: 30,
              ),
              color: Colors.white,
            ),
            if (context.watch<NotificationProvider>().getNumberOfNewNotifs() !=
                0)
              Positioned(
                top: 0,
                right: 0,
                child: Container(
                  width: 20, // Diameter of the circle
                  height: 20,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: theiaBrightPurple,
                  ),
                  child: Center(
                    child: Text(
                      "${(context.watch<NotificationProvider>().getNumberOfNewNotifs() > 9) ? "9+" : context.watch<NotificationProvider>().getNumberOfNewNotifs()}",
                      style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                          fontSize: 12),
                    ),
                  ),
                ),
              )
          ]),
          IconButton(
            iconSize: 30,
            onPressed: () {
              if (widget.isLocked) {
                showCustomToast(AppLocalizations.of(context)!
                    .cannot_leave_while_recording_toast);
                return;
              }

              Navigator.of(context).pushNamed('/user');
            },
            icon: SvgPicture.asset(
              "assets/icons/icon_user.svg",
              colorFilter: widget.isUserPage
                  ? const ColorFilter.mode(
                      theiaBrightPurple,
                      BlendMode.srcATop,
                    )
                  : const ColorFilter.mode(
                      Colors.white,
                      BlendMode.srcATop,
                    ),
              height: 30,
            ),
            color: Colors.white,
          ),
          PopupMenuButton(
            icon: SvgPicture.asset(
              "assets/icons/icon_3dots.svg",
              colorFilter:
                  const ColorFilter.mode(Colors.white, BlendMode.srcATop),
              height: 20,
            ),
            itemBuilder: (BuildContext bc) {
              return [
                PopupMenuItem(
                  value: '/settings',
                  onTap: () {
                    if (widget.isLocked) {
                      showCustomToast(AppLocalizations.of(context)!
                          .cannot_leave_while_recording_toast);
                      return;
                    }
                    Navigator.of(context).pushNamed('/settings');
                  },
                  child: Text(AppLocalizations.of(context)!.settings),
                ),
              ];
            },
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Container(
        padding: const EdgeInsets.fromLTRB(4, 0, 4, 0),
        height: 80,
        decoration: const BoxDecoration(
            color: theiaDarkPurple,
            border: Border(
              bottom: BorderSide(width: 1, color: Colors.white),
            )),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [getLeft(), getRight()],
        ),
      ),
      if (widget.orderIcon)
        FilterBar(
          dateFilter: widget.dateFilter,
          otherFilters: widget.otherFilters!,
          oldest: widget.oldest,
          until: widget.until,
          showAll: showAllFilters,
          onOrderChange: widget.onOrderChange,
          onDateChange: widget.onDateChange,
        ),
    ]);
  }
}
