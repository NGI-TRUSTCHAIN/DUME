import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:theia/controller/provider/notification_provider.dart';
import 'package:theia/model/notification.dart';
import 'package:theia/constants.dart';

class NotificationCard extends StatelessWidget {
  const NotificationCard({
    super.key,
    required this.customNotification, required this.index, required this.onDelete,
  });

  final CustomNotification customNotification;
  final int index;
  final Function(int) onDelete;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(
              customNotification.dateToString(),
              softWrap: true,
              style: const TextStyle(
                  color: theiaAppBarGray,
                  fontSize: 12,
                  fontWeight: FontWeight.w700),
            ),
            SizedBox(
                width: MediaQuery.of(context).size.width / 2,
                child: Text(
                  customNotification.title,
                  softWrap: true,
                  style: TextStyle(
                      color: customNotification.isNew
                          ? Colors.white
                          : theiaDarkPurple,
                      fontSize: 15,
                      fontWeight: FontWeight.w700),
                )),

          ]),
          IconButton(
              onPressed: () {
                Provider.of<NotificationProvider>(context, listen: false)
                    .deleteNotification(index);
                onDelete(index);

              },
              icon: const Icon(Icons.cancel, color: theiaBrightPurple,))
        ],
      ),
    );
  }
}
