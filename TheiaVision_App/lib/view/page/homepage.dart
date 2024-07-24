import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:theia/controller/provider/user_provider.dart';
import 'package:theia/view/component/top_bar.dart';
import 'package:theia/constants.dart';

import '../../controller/provider/notification_provider.dart';
import '../../model/dates.dart';
import '../component/bottom_bar.dart';
import '../component/horizontal_select_menu.dart';
import '../component/task_card.dart';
import '../component/title_list.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<StatefulWidget> createState() {
    return _HomePageState();
  }
}

class _HomePageState extends State<HomePage> {
  Dates selectedOption = Dates.today;
  late List<String> options;


  @override
  void initState() {
    Provider.of<NotificationProvider>(context, listen: false).updateList = updateNotifs;

    super.initState();
  }


  @override
  void dispose() {
    Provider.of<NotificationProvider>(context, listen: false).updateList = null;
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    options = getAllDateStrings(context);
    return CustomBottomNavBar(body: getBody(), currentIndex: 0);
  }

  getSelectedOption(String option) {
    setState(() {
      selectedOption = Dates.getDateFromLocalizedString(option, context);
    });
  }

  Widget getBody() {
    return Container(
      decoration: const BoxDecoration(color: theiaAppBarGray),
      child: Column(
        children: [
          TopBar(
            logo: true,
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Stack(
                children: [getBkgDecoration(), getContent()],
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget getBkgDecoration() {
    return Container(
      height: 300,
      decoration: const BoxDecoration(
        color: theiaDarkPurple,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(50)),
      ),
    );
  }

  Widget getWelcome() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        getWelcomeText(),
        const SizedBox(
          height: 45,
        ),
        HorizontalSelectMenu(
          options: options,
          onPressed: getSelectedOption,
        ),
        const SizedBox(
          height: 45,
        ),
      ],
    );
  }

  Widget getContent() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 50, 20, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          getWelcome(),

          // Related to task -> For the future
          /*getTasks(),
          const SizedBox(
            height: 20,
          ),
          const ObjectivesCard(
            completedTasks: 12,
            totalTasks: 120,
          ),
          const SizedBox(
            height: 20,
          ),*/
          getNotifications()
        ],
      ),
    );
  }

  Widget getNotifications() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ListTitle(
          buttonPath: '/notifications',
          title: AppLocalizations.of(context)!.notifications,
          cards: getNotificationsWidgets(),
        )
      ],
    );
  }

  updateNotifs(){
    setState(() {

    });
  }

  List<Widget> getNotificationsWidgets() {
    List<Widget> list = [];

    if (context
        .watch<NotificationProvider>()
        .getNewNotifications(selectedOption)
        .isEmpty) {
      list.add(Container(
        padding: const EdgeInsets.all(20),
        child: Text(AppLocalizations.of(context)!.no_new_notifications,
            style: const TextStyle(
                color: theiaDarkPurple,
                fontSize: 15,
                fontWeight: FontWeight.normal)),
      ));
    }

    for (var pair in context
        .watch<NotificationProvider>()
        .getNewNotifications(selectedOption)) {
      list.add(GestureDetector(
          onTap: () => Navigator.of(context)
              .pushNamed("/notifications", arguments: pair.index),
          child: Container(
            height: 70,
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 2),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        pair.customNotification.dateToString(),
                        softWrap: true,
                        style: const TextStyle(
                            color: theiaAppBarGray,
                            fontSize: 12,
                            fontWeight: FontWeight.w700),
                      ),
                      SizedBox(
                          width: MediaQuery.of(context).size.width / 2,
                          child: Text(
                            pair.customNotification.title,
                            softWrap: true,
                            style: const TextStyle(
                                color: theiaDarkPurple,
                                fontSize: 15,
                                fontWeight: FontWeight.w700),
                          )),
                    ]),
                IconButton(
                    onPressed: () {
                      Provider.of<NotificationProvider>(context, listen: false)
                          .deleteNotification(pair.index);
                    },
                    icon: const Icon(
                      Icons.cancel,
                      color: theiaBrightPurple,
                    ))
              ],
            ),
          )));
    }

    return list;
  }

  Widget getTasks() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ListTitle(
          separators: true,
          title: AppLocalizations.of(context)!.tasks,
          buttonPath: "/taskDetails",
          cards: const [
            TaskCard(),
          ],
        )
      ],
    );
  }

  Widget getWelcomeText() {
    return Container(
      margin: const EdgeInsets.fromLTRB(15, 0, 0, 0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppLocalizations.of(context)!.hello(
                context.watch<UserProvider>().name ??
                    AppLocalizations.of(context)!.user),
            style: const TextStyle(
                color: theiaBrightPurple,
                fontSize: 30,
                fontWeight: FontWeight.w700),
          ),
          Text(
            AppLocalizations.of(context)!.nNotificationsToday(
                context.watch<NotificationProvider>().getNumberOfNewNotifs()),
            style: const TextStyle(color: Colors.white, fontSize: 15),
          ),
        ],
      ),
    );
  }
}
