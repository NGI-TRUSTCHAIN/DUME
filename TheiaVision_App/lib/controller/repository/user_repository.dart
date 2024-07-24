import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:http_parser/http_parser.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../http_service.dart';

class UserRepository {
  HttpService httpService = HttpService();

  Future<void> forgotPassword(String userEmail, BuildContext context) async {
    try {
      var headers = {
        'Content-Type': 'application/json',
      };

      String url = "users/forgot-password";

      var data = {
        "email": userEmail,
      };

      var response =
          await httpService.postRequest(url, data, headers, context, (a, b) {});

      if (httpService.isOk(response.statusCode!)) {
        return;
      } else if (response.statusCode == 400) {
        throw const HttpException("Invalid email");
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<void> changePassword(
      String password, String email, String token, BuildContext context) async {
    try {
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      };

      String url = "users/reset-password";
      var data = {
        "email": email,
        "password": password,
      };

      var response = await httpService.putRequest(url, data, headers, context);

      if (httpService.isOk(response.statusCode!)) {
        return;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<void> createAccount(
      String email, String password, String? name, BuildContext context) async {
    try {
      var headers = {'Content-Type': 'application/json'};
      String url = "users/create-account";

      var data = {
        "email": email,
        "password": password,
      };

      if (name != null) {
        data["name"] = name;
      }

      var response =
          await httpService.postRequest(url, data, headers, context, (a, b) {});

      if (httpService.isOk(response.statusCode!)) {
        return;
      } else if (response.statusCode == 409) {
        throw HttpException(AppLocalizations.of(context)!.account_already_exists);
      }else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<List<String>> login(
      String emailForm, String password, BuildContext context) async {
    try {
      var headers = {'Content-Type': 'application/json'};
      String url = "users/authenticate-account";

      var data = {"email": emailForm, "password": password};

      var response =
          await httpService.postRequest(url, data, headers, context, (a, b) {});

      log(response.statusCode.toString());

      if (httpService.isOk(response.statusCode!)) {
        var message = response.data;

        final SharedPreferences prefs = await SharedPreferences.getInstance();

        var email = message["message"]["email"];
        var name = message["message"]["name"];
        var token = message["message"]["accessToken"];

        if (email != null) {
          prefs.setString("user_email", email!);
        }
        if (name != null) {
          prefs.setString("user_name", name!);
        }
        if (token != null) {
          prefs.setString("user_token", token!);
        }

        return [email, name, token];
      } else if (response.statusCode == 400) {
        throw HttpException(AppLocalizations.of(context)!.no_account_login);
      } else if (response.statusCode == 406) {
        throw HttpException(AppLocalizations.of(context)!.wrong_password_login);
      } else if (response.statusCode == 403) {
        throw HttpException(AppLocalizations.of(context)!.account_not_activated_login);
      }else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<void> deleteAccount(
      String token, String email, BuildContext context) async {
    try {
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      };
      String url = "users/delete-account";

      var data = {"email": email};

      var response =
          await httpService.deleteRequest(url, data, headers, context);

      if (httpService.isOk(response.statusCode!)) {
        return;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getProfileInfo(
      String token, String emailForm, BuildContext? context) async {
    try {
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      };

      log(token);

      var queryParameters = {"email": emailForm};

      String url = "users/profile";

      var response = await httpService.getRequest(
          url, queryParameters, headers, context,
          responseType: ResponseType.bytes);

      if (httpService.isOk(response.statusCode!)) {
        var message = response.headers.value("payload");

        var email = json.decode(message!)["email"];
        var name = json.decode(utf8.decode(message.codeUnits))["name"];

        var path = await getApplicationDocumentsDirectory();

        String? newPath = "${path.path}/profile_pic.jpg";

        var image = response.data;

        if (image!.isEmpty) {
          image = null;
          newPath = null;
        } else {
          await File(newPath).writeAsBytes(response.data);
        }

        return {"email": email, "name": name, "image": image, "path": newPath};
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<void> changeName(
      String newName, String token, String email, BuildContext context) async {
    try {
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      };

      String url = "users/profile/edit-name";

      var data = {"email": email, "name": newName};

      var response = await httpService.putRequest(url, data, headers, context);

      if (httpService.isOk(response.statusCode!)) {
        return;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<void> changeEmail(
      String newEmail, String token, String email, BuildContext context) async {
    try {
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      };

      String url = "users/profile/edit-email";

      var data = {"newEmail": newEmail, "oldEmail": email};

      var response = await httpService.putRequest(url, data, headers, context);

      if (httpService.isOk(response.statusCode!)) {
        return;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }

  Future<void> changePicture(String picturePath, String token, String email,
      BuildContext context) async {
    try {
      var ext = extension(picturePath);

      String url = "users/profile/edit-picture";

      var headers = {'Authorization': 'Bearer $token'};

      // Determine the content type based on the file extension
      MediaType contentType;
      if (ext == ".png") {
        contentType = MediaType("image", "png");
      } else if (ext == ".jpg") {
        contentType = MediaType("image", "jpg");
      } else if (ext == ".jpeg") {
        contentType = MediaType("image", "jpeg");
      } else {
        contentType = MediaType("application", "octet-stream");
      }

      FormData formData = FormData.fromMap({
        'email': email,
        'image': await MultipartFile.fromFile(
          picturePath,
          contentType: contentType,
        ),
      });

      var response =
          await httpService.putRequest(url, formData, headers, context);

      if (httpService.isOk(response.statusCode!)) {
        return;
      } else {
        throw HttpException(response.data["error"] ?? response.data["message"]);
      }
    } on HttpException catch (_) {
      rethrow;
    }
  }
}
