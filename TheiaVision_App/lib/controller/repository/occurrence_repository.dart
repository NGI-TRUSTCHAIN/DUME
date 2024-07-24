import 'dart:developer';
import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:theia/model/coordinates.dart';
import 'package:theia/model/occurrence.dart';
import 'package:theia/model/occurrence_type.dart';
import 'package:theia/utils.dart';

import '../../model/custom_image.dart';
import '../../model/occurance_state.dart';
import '../../model/order.dart';
import '../http_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class OccurrenceRepository {
  HttpService httpService = HttpService();

  Future<List<String>> getDateLimits(
      String token, String email, BuildContext context) async {
    try {
      var headers = {'Authorization': 'Bearer $token'};

      String url = 'occurrences/date-limits';

      var queryParams = {"email": email};

      var response =
          await httpService.getRequest(url, queryParams, headers, context);

      var message = response.data["message"];

      if (httpService.isOk(response.statusCode!)) {
        var oldestDate =
            message["oldest occurrence"] ?? DateTime.now().toString();
        var newestDate =
            message["newest occurrence"] ?? DateTime.now().toString();
        return [oldestDate, newestDate];
      } else {
        log(response.data);
        return [DateTime.now().toString(), DateTime.now().toString()];
      }
    } catch (e) {
      log(e.toString());
      return [DateTime.now().toString(), DateTime.now().toString()];
    }
  }

  Future<List<OccurrenceType>> getOccurrenceTypes(BuildContext context) async {
    String url = "/ai-models/classes";
    try {
      var response = await httpService.getRequest(url, {}, {}, context);

      if (httpService.isOk(response.statusCode!)) {
        List<OccurrenceType> list = [];

        var msg = response.data["message"];

        for (var type in msg) {
          list.add(OccurrenceType(type["id"],
              AppLocalizations.of(context)!.occurrence_type(type["name"])));
        }

        return list;
      } else {
        log(response.data);
        return [];
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<List<Occurrence>> getOccurrences(
      int page,
      int pageNum,
      String token,
      String email,
      Order order,
      OccurrenceState? occurrenceState,
      int? type,
      String from,
      String to,
      BuildContext context) async {
    try {
      String url = 'occurrences/';
      var queryParameters = {
        "startingRow": page,
        "numberOfRows": pageNum,
        "orderBy": order == Order.ascendant ? "asc" : "desc",
        "dateStart": from,
        "dateEnd": to
      };

      if (type != null) {
        queryParameters.addAll({"classId": type});
      }

      if (occurrenceState != null) {
        try {
          queryParameters
              .addAll({"occurrenceStatus": occurrenceState.toServerString()});
        } catch (e) {
          return [];
        }
      }

      log(queryParameters.toString());

      var response =
          await httpService.getRequest(url, queryParameters, {}, context);

      if (httpService.isOk(response.statusCode!)) {
        var msg = response.data["message"];

        log(msg.toString());

        List<Occurrence> list = [];

        for (var occurrence in msg) {
          var coordinates = Coordinates(occurrence["coordinates"]["latitude"],
              occurrence["coordinates"]["longitude"]);
          var location =
              await getAddress(coordinates.latitude, coordinates.longitude);

          list.add(Occurrence(
              occurrence["id"].toString(),
              occurrence["date"],
              location,
              occurrence["classId"],
              OccurrenceState.getState(occurrence["state"]),
              occurrence["url"],
              occurrence["videoId"],
              coordinates));
        }

        return list;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<List<CustomImage>> getOtherPictures(
      Coordinates coordinates, String token, BuildContext context) async {
    try {
      var headers = {'Authorization': 'Bearer $token'};

      String url = "frames/coordinates";

      var queryParameters = {
        "latitude": coordinates.latitude,
        "longitude": coordinates.longitude,
      };

      log(queryParameters.toString());



      var response =
          await httpService.getRequest(url, queryParameters, headers, context);

      if (httpService.isOk(response.statusCode!)) {

        List<CustomImage> list = [];

        var msg = response.data["message"];

        for(var img in msg){
          list.add(
            CustomImage(img["id"],img["date"],img["url"])
          );

        }
        return list;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }
}
