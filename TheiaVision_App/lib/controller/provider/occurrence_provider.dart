import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:theia/model/custom_image.dart';
import 'package:theia/model/occurance_state.dart';
import 'package:theia/model/occurrence.dart';
import 'package:theia/model/occurrence_type.dart';

import '../../model/coordinates.dart';
import '../../model/order.dart';
import '../repository/occurrence_repository.dart';

class OccurrenceProvider extends ChangeNotifier {
  OccurrenceRepository occurrenceRepository = OccurrenceRepository();
  String errorMessage = "";
  static const pageSize = 10;
  List<OccurrenceType> occurrenceTypes = [];


  String getTypeFromId(int id) {
    var type = occurrenceTypes.firstWhere((types) => types.id == id);

    return type.name;
  }

  Future<List<Occurrence>> getOccurrences(
      int page,
      String token,
      String email,
      Order order,
      OccurrenceState? occurrenceState,
      int? type,
      String from,
      String to,
      BuildContext context) async {
    List<Occurrence> list = await occurrenceRepository.getOccurrences(
        page,
        pageSize,
        token,
        email,
        order,
        occurrenceState,
        type,
        from,
        to,
        context);

    return list;
  }

  Future<List<String>> getDateLimits(
      String token, String email, BuildContext context) async {
    try {
      var dateLimits =
          await occurrenceRepository.getDateLimits(token, email, context);
      return dateLimits;
    } on HttpException catch (e, _) {
      errorMessage = e.message;
    }

    return [DateTime.now().toString(), DateTime.now().toString()];
  }

  Future<List<OccurrenceType>> getOccurrenceTypes(BuildContext context) async {
    occurrenceTypes = await occurrenceRepository.getOccurrenceTypes(context);
    return occurrenceTypes;
  }

  Future<List<CustomImage>> getOtherImages(
      Coordinates coordinates, String token, BuildContext context) async {
    return await occurrenceRepository.getOtherPictures(
        coordinates, token, context);
  }
}
