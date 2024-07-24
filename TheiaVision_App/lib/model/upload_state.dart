


import 'package:flutter/cupertino.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

enum UploadState { uploading, uploaded, waiting





}



extension UploadStateExtension on UploadState {
  String localizedDescription(BuildContext context) {
    switch (this) {
      case UploadState.uploading:
        return AppLocalizations.of(context)!.uploading;
      case UploadState.uploaded:
        return AppLocalizations.of(context)!.complete;
      case UploadState.waiting:
        return AppLocalizations.of(context)!.waiting;
      default:
        return '';
    }
  }
}
