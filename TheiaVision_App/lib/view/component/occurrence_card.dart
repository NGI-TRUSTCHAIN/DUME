import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:theia/controller/provider/occurrence_provider.dart';
import 'package:theia/model/occurance_state.dart';
import 'package:theia/model/occurrence.dart';
import 'package:theia/constants.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class OccurrenceCard extends StatelessWidget {
  const OccurrenceCard({super.key, required this.occurrence});

  final Occurrence occurrence;

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Container(
                    margin: const EdgeInsets.fromLTRB(0, 10, 0, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        getDate(),
                        getEventType(context),
                        getLocation(context)
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(
              height: 10,
            ),
            getState(context)
          ],
        ));
  }

  Widget getDate() {
    return Text(
      occurrence.dateToString(),
      style: const TextStyle(
          color: theiaDarkPurple, fontSize: 18, fontWeight: FontWeight.w700),
    );
  }

  Widget getEventType(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "${AppLocalizations.of(context)!.type_of_event}: ",
          style: const TextStyle(
            color: theiaDarkPurple,
            fontSize: 12,
          ),
        ),
        Text(
          Provider.of<OccurrenceProvider>(context, listen: false)
              .getTypeFromId(occurrence.occurrenceType),
          style: const TextStyle(
            color: theiaDarkPurple,
            fontSize: 12,
          ),
        )
      ],
    );
  }

  Widget getLocation(BuildContext context) {
    return Row(
      children: [
        Text(
          "${AppLocalizations.of(context)!.localization}: ",
          style: const TextStyle(
            color: theiaAppBarGray,
            fontSize: 12,
          ),
        ),
        Expanded(
          child: Text(
            occurrence.location,
            style: const TextStyle(
              color: theiaAppBarGray,
              fontSize: 12,
            ),
            overflow: TextOverflow.ellipsis,
            softWrap: true,
          ),
        )
      ],
    );
  }

  Widget getState(BuildContext context) {
    return Text(
      AppLocalizations.of(context)!
          .occurrence_state(occurrence.occurrenceState.toString()),
      style: TextStyle(
          color: OccurrenceState.getColor(occurrence.occurrenceState),
          fontSize: 18,
          fontWeight: FontWeight.w700),
      textAlign: TextAlign.end,
    );
  }
}
