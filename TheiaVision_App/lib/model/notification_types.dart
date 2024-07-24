import 'package:flutter/cupertino.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';


enum NotificationType{

  video, packages, updates, occurrences, other, image;


  String toStringWithContext(BuildContext context) {
    switch (this) {
      case NotificationType.video:
        return  AppLocalizations.of(context)!.notif_type_video;
      case NotificationType.image:
        return  AppLocalizations.of(context)!.notif_type_image;
      case NotificationType.packages:
        return  AppLocalizations.of(context)!.notif_type_packages;
      case NotificationType.updates:
        return AppLocalizations.of(context)!.notif_type_updates;
      case NotificationType.occurrences:
        return AppLocalizations.of(context)!.notif_type_occurrence;
      case NotificationType.other:
        return AppLocalizations.of(context)!.notif_type_other;
      default:
        return '';
    }
  }

  static NotificationType? fromStringWithContext(String value, BuildContext context) {
    final AppLocalizations? localizations = AppLocalizations.of(context);

    if (localizations == null) return null;

    if (value == localizations.notif_type_video) {
      return NotificationType.video;
    } else if (value == localizations.notif_type_packages) {
      return NotificationType.packages;
    } else if (value == localizations.notif_type_updates) {
      return NotificationType.updates;
    } else if (value == localizations.notif_type_occurrence) {
      return NotificationType.occurrences;
    } else if (value == localizations.notif_type_other) {
      return NotificationType.other;
    } else if (value == localizations.notif_type_image) {
      return NotificationType.image;
    }  else {
      return null;
    }
  }


  String toJson() {
    return toString().split('.').last;
  }

  static NotificationType fromJson(String json) {
    return NotificationType.values.firstWhere((e) => e.toString().split('.').last == json);
  }

}


List<String> getUploadStateFilterStrings(BuildContext context) {
  return NotificationType.values.map((state) => state.toStringWithContext(context)).toList();
}