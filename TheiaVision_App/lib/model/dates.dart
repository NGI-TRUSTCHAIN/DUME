
import 'package:flutter/cupertino.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

enum Dates{

  today,week,month;

  String getLocalizedDateOption( BuildContext context) {
    switch (this) {
      case Dates.today:
        return AppLocalizations.of(context)!.today_option;
      case Dates.week:
        return AppLocalizations.of(context)!.week_option;
      case Dates.month:
        return AppLocalizations.of(context)!.month_option;
      default:
        return '';
    }
  }

  static Dates getDateFromLocalizedString(String dateString, BuildContext context) {

    if (dateString == AppLocalizations.of(context)!.today_option) {
      return Dates.today;
    } else if (dateString == AppLocalizations.of(context)!.week_option) {
      return Dates.week;
    } else if (dateString == AppLocalizations.of(context)!.month_option) {
      return Dates.month;
    } else {
      throw ArgumentError('Invalid date string');
    }
  }

}

List<String> getAllDateStrings(BuildContext context) {
  return Dates.values.map((date) => date.getLocalizedDateOption(context)).toList();
}

