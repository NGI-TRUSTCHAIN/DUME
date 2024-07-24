
import 'package:flutter/cupertino.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:theia/model/upload_state.dart';

enum UploadStateFilter{

  all, uploaded, uploading, waiting;

  String toStringWithContext(BuildContext context) {
    switch (this) {
      case UploadStateFilter.all:
        return  AppLocalizations.of(context)!.all("male");

      case UploadStateFilter.uploaded:
        return  AppLocalizations.of(context)!.complete;
      case UploadStateFilter.uploading:
        return AppLocalizations.of(context)!.uploading;
      case UploadStateFilter.waiting:
        return AppLocalizations.of(context)!.waiting;
      default:
        return '';
    }
  }

  static UploadState? fromLocalizedString(String localizedString, BuildContext context) {
    if (localizedString == AppLocalizations.of(context)!.all("male")) {
      return null;
    } else if (localizedString == AppLocalizations.of(context)!.complete) {
      return UploadState.uploaded;
    } else if (localizedString == AppLocalizations.of(context)!.uploading) {
      return UploadState.uploading;
    } else if (localizedString == AppLocalizations.of(context)!.waiting) {
      return UploadState.waiting;
    } else {
      throw ArgumentError('Unknown localized string: $localizedString');
    }
  }

}







List<String> getUploadStateFilterStrings(BuildContext context) {
  return UploadStateFilter.values.map((state) => state.toStringWithContext(context)).toList();
}