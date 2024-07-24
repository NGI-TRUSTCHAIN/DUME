import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../constants.dart';

class ObjectivesCard extends StatelessWidget {
  const ObjectivesCard({super.key, required this.completedTasks, required this.totalTasks});

  final int completedTasks;
  final int totalTasks;

  @override
  Widget build(BuildContext context) {
    return Container(
        width: MediaQuery.of(context).size.width - 40,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(30),
        ),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [getTitle(context), getButton(context)],
          ),
          const SizedBox(height: 20),
          getProgressBar(),
          const SizedBox(height: 10),

          getProgressText(context)
        ]));
  }

  Widget getProgressText(BuildContext context){

    return Text("$completedTasks / $totalTasks ${AppLocalizations.of(context)!.tasks}", style: const TextStyle(
        color: theiaBrightPurple,
        fontWeight: FontWeight.w700,
        fontSize: 18), textAlign: TextAlign.end,);

  }

  Widget getProgressBar(){

    return Container(
      height: 12,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(100),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(100),
        child: LinearProgressIndicator(
          value: completedTasks / totalTasks,
          valueColor: const AlwaysStoppedAnimation(theiaBrightPurple),
          backgroundColor: theiaAppBarGray,
        ),
      ),
    );
  }

  Widget getTitle(BuildContext context) {
    return SizedBox(
        height: 50,
        width: MediaQuery.of(context).size.width /2 - 40,
        child: Text(
          AppLocalizations.of(context)!.objectives_of_the_week.toUpperCase(),
          softWrap: true,
          style: const TextStyle(
              color: theiaDarkPurple,
              fontWeight: FontWeight.w700,
              fontSize: 18),
        ));
  }

  Widget getButton(BuildContext context) {
    return SizedBox(
      height: 30,
      child: TextButton(
        onPressed: () {
          Navigator.of(context).pushNamed("/objectives");
        },
        child: Text(
          AppLocalizations.of(context)!.see_more_button,
          style: const TextStyle(
            color: theiaAppBarGray,
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }



}
