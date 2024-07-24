import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';
import 'package:provider/provider.dart';
import 'package:theia/model/loading_state.dart';
import 'package:theia/model/notification.dart';
import 'package:theia/model/notification_types.dart';
import 'package:theia/view/component/notification_card.dart';
import '../../controller/provider/notification_provider.dart';
import '../../model/filter.dart';
import '../../model/order.dart';
import '../component/bottom_bar.dart';
import '../component/top_bar.dart';
import '../../constants.dart';

class NotificationsPage extends StatefulWidget {
  NotificationsPage({super.key, required this.open});

  late int open;

  @override
  State<StatefulWidget> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  final PagingController<int, CustomNotification> _pagingController =
      PagingController(firstPageKey: 0);

  Order order = Order.descendant;
  late String from;
  late String to;
  late final String fromMax;
  late final String toMax;
  bool? read;
  NotificationType? notificationType;

  late List<String> dates;

  @override
  void initState() {
    _pagingController.addPageRequestListener((pageKey) {
      _fetchPage(pageKey);
    });

    dates = Provider.of<NotificationProvider>(context, listen: false)
        .getDateLimits();

    Provider.of<NotificationProvider>(context, listen: false).updateList = updateList;
    fromMax = dates[0];
    toMax = dates[1];
    from = fromMax;
    to = toMax;
    super.initState();
  }

  updateList(){
    _pagingController.refresh();
  }



  @override
  Widget build(BuildContext context) {
    return CustomBottomNavBar(body: getBody(), currentIndex: -1);
  }

  void _fetchPage(int pageKey) {
    try {
      log('Fetching page: $pageKey');

      final newItems = Provider.of<NotificationProvider>(context, listen: false)
          .getAllNotifications(
              pageKey, to, from, order, notificationType, read);

      log('Fetched ${newItems.length} new items');

      final isLastPage = newItems.length < NotificationProvider.pageSize;
      if (isLastPage) {
        _pagingController.appendLastPage(newItems);
      } else {
        final nextPageKey = pageKey + 1;
        _pagingController.appendPage(newItems, nextPageKey);
      }
    } catch (error) {
      // Handle any errors by setting the error state on the paging controller
      _pagingController.error = error;
    }
  }

  @override
  void dispose() {
    _pagingController.dispose();
    Provider.of<NotificationProvider>(context, listen: false).updateList = null;

    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Check if open index is provided and valid
    if (widget.open != -1 &&
        widget.open <
            context.read<NotificationProvider>().notifications.length) {
      // Set isNew to false for the notification at the open index
      context.read<NotificationProvider>().setAsRead( order == Order.descendant ? Provider.of<NotificationProvider>(context,listen: false).notifications.length -1 - widget.open : widget.open);
    }
  }

  _onChangeNotifState(String state) {
    if (state == AppLocalizations.of(context)!.all("female")) {
      setState(() {
        read = null;
      });
    }
    if (state == AppLocalizations.of(context)!.notif_new) {
      setState(() {
        read = true;
      });
    }
    if (state == AppLocalizations.of(context)!.notif_old) {
      setState(() {
        read = false;
      });
    }

    setState(() {
      widget.open = -1;
    });
    _pagingController.refresh();
  }

  _onChangeNotifType(String type) {
    setState(() {
      widget.open = -1;
      notificationType = NotificationType.fromStringWithContext(type, context);
    });
    _pagingController.refresh();
  }

  onOrderChange(Order newOrder) {
    setState(() {
      widget.open = -1;

      order = newOrder;
      _pagingController.refresh();
    });
  }

  onDatesChanges(String newFrom, String newTo) {
    setState(() {
      widget.open = -1;

      from = newFrom;
      to = newTo;
      _pagingController.refresh();
    });
  }

  Widget getBody() {
    List<String> notifState = [
      AppLocalizations.of(context)!.all("female"),
      AppLocalizations.of(context)!.notif_new,
      AppLocalizations.of(context)!.notif_old
    ];

    var notifStateFilter = Filter(AppLocalizations.of(context)!.notif_state,
        notifState, true, _onChangeNotifState);

    List<String> notifType = [AppLocalizations.of(context)!.all("female")];

    notifType.addAll(getUploadStateFilterStrings(context));

    var notifTypeFilter = Filter(AppLocalizations.of(context)!.notif_type,
        notifType, false, _onChangeNotifType);

    return Container(
      decoration: const BoxDecoration(color: theiaAppBarGray),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TopBar(
            text: AppLocalizations.of(context)!.notifications,
            isNotifPage: true,
            orderIcon: true,
            dateFilter: true,
            otherFilters: [notifTypeFilter, notifStateFilter],
            oldest: fromMax,
            until: toMax,
            onOrderChange: onOrderChange,
            onDateChange: onDatesChanges,
          ),
          Container(
              margin: const EdgeInsets.all(20),
              child: ElevatedButton(
                  style: ButtonStyle(
                      backgroundColor: WidgetStateProperty.all(Colors.white),
                      surfaceTintColor: WidgetStateProperty.all(Colors.white),
                      foregroundColor:
                          WidgetStateProperty.all(theiaBrightPurple)),
                  onPressed: () {
                    Provider.of<NotificationProvider>(context, listen: false)
                        .deleteAllNotifications()
                        .then((a) {
                      _pagingController.refresh();
                    });
                  },
                  child:
                      Provider.of<NotificationProvider>(context, listen: false)
                                  .deleteAll ==
                              LoadingState.loading
                          ? const Center(child: CircularProgressIndicator())
                          : Text(AppLocalizations.of(context)!.clear_all_button,
                              style: const TextStyle(
                                  fontSize: 14, fontWeight: FontWeight.w700)))),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => Future.sync(
                () => _pagingController.refresh(),
              ),
              child: Consumer<NotificationProvider>(
                builder: (context, notificationProvider, child) {
                  return PagedListView<int, CustomNotification>(
                    pagingController: _pagingController,
                    builderDelegate:
                        PagedChildBuilderDelegate<CustomNotification>(
                      itemBuilder: (context, item, index) =>
                          getNotificationCard(item, index),
                      noItemsFoundIndicatorBuilder: (context) => Container(
                        margin: const EdgeInsets.all(20),
                        child: Center(
                          child: Text(
                            textAlign: TextAlign.center,
                            AppLocalizations.of(context)!.no_items(
                                AppLocalizations.of(context)!
                                    .notifications
                                    .toLowerCase()),
                            style: const TextStyle(
                                color: theiaDarkPurple,
                                fontSize: 24,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                      firstPageErrorIndicatorBuilder: (context) => Container(
                        margin: const EdgeInsets.all(20),
                        child: Center(
                          child: Text(
                            textAlign: TextAlign.center,
                            AppLocalizations.of(context)!.error_items(
                                AppLocalizations.of(context)!
                                    .notifications
                                    .toLowerCase()),
                            style: const TextStyle(
                                color: theiaDarkPurple,
                                fontSize: 24,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          )
        ],
      ),
    );
  }

  _onDelete(int index) {
    _pagingController.itemList?.removeAt(index);
    if (index == widget.open) {
      widget.open = -1;
    }
    _pagingController.notifyListeners();
  }

  Widget getNotificationCard(CustomNotification notification, int index) {
    return GestureDetector(
      onTap: () {
        setState(() {
          widget.open = (widget.open == index) ? -1 : index;
          context.read<NotificationProvider>().setAsRead( order == Order.descendant ? Provider.of<NotificationProvider>(context,listen: false).notifications.length -1 - widget.open : widget.open);
        });
      },
      child: Container(
        width: MediaQuery.of(context).size.width,
        margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Container(
          width: MediaQuery.of(context).size.width - 40,
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
          decoration: BoxDecoration(
            color: notification.isNew ? theiaDarkPurple : Colors.white,
            borderRadius: BorderRadius.circular(30),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              NotificationCard(
                customNotification: notification,
                index: index,
                onDelete: _onDelete,
              ),
              if (index == widget.open)
                Text(
                  notification.text,
                  softWrap: true,
                  style: TextStyle(
                    color: notification.isNew ? Colors.white : theiaDarkPurple,
                    fontSize: 15,
                    fontWeight: FontWeight.normal,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
