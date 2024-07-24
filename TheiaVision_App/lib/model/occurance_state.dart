
import 'package:flutter/material.dart';
import 'package:theia/constants.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

enum OccurrenceState{

  confirmed,
  unconfirmed,
  submitted,
  submittedForManualConfirmation,
  definitelyUnconfirmed,
  resolved,
  inRevision;

  static OccurrenceState getState(String state){
    switch(state){
      case "solved":
        return resolved;
      case "pending":
        return inRevision;
      default:
        throw Exception("'$state' no correspondence for this occurrence state");
    }
  }

   String toServerString(){
    switch(this){

      case resolved:
        return "solved";
      case inRevision:
        return "pending";
      default:
        throw Exception("'$this' no correspondence for this occurrence state");
    }
   }


  static Color getColor(OccurrenceState state){
    switch(state){

      case OccurrenceState.confirmed:
        return theiaBrightPurple;
      case OccurrenceState.unconfirmed:
        return theiaBrightPurple;
      case OccurrenceState.submitted:
        return theiaAppBarGray;
      case OccurrenceState.submittedForManualConfirmation:
        return theiaAppBarGray;
      case OccurrenceState.definitelyUnconfirmed:
        return theiaDarkPurple;
      case OccurrenceState.resolved:
        return theiaGreen;
      case OccurrenceState.inRevision:
        return theiaAppBarGray;
    }

  }

  static OccurrenceState? fromLocalizedString(String localizedString, BuildContext context) {
    if (localizedString == AppLocalizations.of(context)!.confirmed) {
      return OccurrenceState.confirmed;
    } else if (localizedString == AppLocalizations.of(context)!.unconfirmed) {
      return OccurrenceState.unconfirmed;
    } else if (localizedString == AppLocalizations.of(context)!.submitted) {
      return OccurrenceState.submitted;
    } else if (localizedString == AppLocalizations.of(context)!.submittedForManualConfirmation) {
      return OccurrenceState.submittedForManualConfirmation;
    } else if (localizedString == AppLocalizations.of(context)!.definitelyUnconfirmed) {
      return OccurrenceState.definitelyUnconfirmed;
    } else if (localizedString == AppLocalizations.of(context)!.resolved) {
      return OccurrenceState.resolved;
    } else if (localizedString == AppLocalizations.of(context)!.inRevision) {
      return OccurrenceState.inRevision;
    }else if(localizedString == AppLocalizations.of(context)!.all("female")){
      return null;
    } else {
      throw ArgumentError('Unknown localized string: $localizedString');
    }
  }

}

List<String> getLocalizedOccurrenceStates(BuildContext context) {

  List<String> states = [AppLocalizations.of(context)!.all("female")];

  for (var o in OccurrenceState.values) {
    states.add(AppLocalizations.of(context)!.occurrence_state(o.toString().split('.').last));
  }

  return states;
}



