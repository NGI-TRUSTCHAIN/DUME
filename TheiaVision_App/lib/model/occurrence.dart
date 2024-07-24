
import 'package:intl/intl.dart';
import 'package:theia/model/coordinates.dart';
import 'package:theia/model/occurance_state.dart';

class Occurrence{

  final String id;
  final String videoId;
  final String date;
  final String location;
  final Coordinates coordinates;
  final int occurrenceType;
  final OccurrenceState occurrenceState;
  final String? image;

  Occurrence(this.id, this.date, this.location, this.occurrenceType,
      this.occurrenceState, this.image, this.videoId, this.coordinates);

  String dateToString(){
    DateTime dateTime = DateTime.parse(date);

    return  DateFormat("yyyy-MM-dd | HH:mm:ss").format(dateTime);
  }
}