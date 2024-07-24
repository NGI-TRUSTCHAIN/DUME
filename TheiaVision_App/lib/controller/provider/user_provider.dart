
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/cupertino.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:theia/utils.dart';

import '../../model/connection.dart';
import '../../model/loading_state.dart';
import '../repository/user_repository.dart';

class UserProvider extends ChangeNotifier {
  String? email;
  String? name;
  String? token;
  String? picturePath;
  Connection connection = Connection.wifi;
  LoadingState state = LoadingState.finished;
  LoadingState logoutState = LoadingState.finished;
  LoadingState editState = LoadingState.finished;
  LoadingState changePasswordState = LoadingState.finished;
  LoadingState deleteAccountState = LoadingState.finished;
  Uint8List? image;

  static const String serverURL = "https://theiabo.logimade.com/api";

  UserRepository userRepository = UserRepository();

  String errorMessage = "";

  UserProvider() {
    initializeTestFromSharedPrefs();
  }

  Future<void> initializeTestFromSharedPrefs() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    email = prefs.getString("user_email");
    name = prefs.getString("user_name");
    token = prefs.getString("user_token");
    picturePath = prefs.getString("user_img_Path");
    if(picturePath != null) {
      image = await File(picturePath!).readAsBytes();
    }

    String con = prefs.getString("upload_pref") ?? "Connection.wifi";
    connection = Connection.getConnection(con);
    notifyListeners();
  }

  Future<void> forgotPassword(String userEmail,BuildContext context) async {
    try {
      state = LoadingState.loading;
      notifyListeners();

      await userRepository.forgotPassword(userEmail,context);

      state = LoadingState.finished;
      notifyListeners();
    } on HttpException catch (e, _) {
      errorMessage = e.message;
      state = LoadingState.error;
      notifyListeners();
    }
  }

  Future<void> changePassword(String password, BuildContext context) async {
    try {
      changePasswordState = LoadingState.loading;
      notifyListeners();

      if (email == null || token == null) {
        logOut(context);
      }

      await userRepository.changePassword(password, email!, token!, context);

      changePasswordState = LoadingState.finished;
      notifyListeners();
    } on HttpException catch (e, _) {
      errorMessage = e.message;
      state = LoadingState.error;
      notifyListeners();
    }
  }

  Future<void> createAccount(
      String email, String password, String? name,BuildContext context) async {
    try {
      state = LoadingState.loading;
      notifyListeners();

      await userRepository.createAccount(email, password, name,context);

      state = LoadingState.finished;
      notifyListeners();
    } on HttpException catch (e, _) {
      errorMessage = e.message;
      state = LoadingState.error;
      notifyListeners();
    }
  }

  bool loggedIn() {
    if (token != null && email != null) {
      return true;
    }
    return false;
  }

  Future<void> login(String emailForm, String password,BuildContext context) async {
    try {
      state = LoadingState.loading;
      notifyListeners();

      var list = await userRepository.login(emailForm, password,context);

      email = list[0];
      name = list[1];
      token = list[2];

      await getProfileInfo(null);

      state = LoadingState.finished;
      notifyListeners();
    } on HttpException catch (e, _) {
      errorMessage = e.message;
      state = LoadingState.error;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    logoutState = LoadingState.loading;
    notifyListeners();

    email = null;
    name = null;
    token = null;
    final SharedPreferences prefs = await SharedPreferences.getInstance();

    prefs.setString("user_email", "");
    prefs.setString("user_name", "");
    prefs.setString("user_token", "");
    logoutState = LoadingState.finished;
    notifyListeners();
  }

  Future<void> deleteAccount(BuildContext context) async {
    try {
      deleteAccountState = LoadingState.loading;
      notifyListeners();

      await userRepository.deleteAccount(token!, email!, context);

      logout();

      deleteAccountState = LoadingState.finished;
      notifyListeners();
    } on HttpException catch (e, _) {
      errorMessage = e.message;
      deleteAccountState = LoadingState.error;
      notifyListeners();
    }
  }

  Future<void> getProfileInfo(BuildContext? context) async {
    try {
      editState = LoadingState.loading;
      notifyListeners();

      if (token == null || email == null) {
        logOut(context!);
        return;
      }

      var map = await userRepository.getProfileInfo(token!, email!, context);


      name = map["name"];
      email = map["email"];
      image = map["image"];
      picturePath = map["path"];

      final SharedPreferences prefs = await SharedPreferences.getInstance();


      prefs.setString("user_email", email!);
      prefs.setString("user_name", name!);
      if(picturePath != null) {
        prefs.setString("user_img_Path", picturePath!);
      }

      editState = LoadingState.finished;
      notifyListeners();
    } on HttpException catch (e, _) {
      errorMessage = e.message;
      editState = LoadingState.error;
      notifyListeners();
    }
  }

  Future<void> changeName(String newName, BuildContext context) async {
    try {
      editState = LoadingState.loading;
      notifyListeners();

      if (token == null || email == null) {
        logOut(context);
        return;
      }

      await userRepository.changeName(newName, token!, email!, context);
      await getProfileInfo(context);

      editState = LoadingState.finished;
      notifyListeners();
    } on HttpException catch (e, _) {
      errorMessage = e.message;
      editState = LoadingState.error;
      notifyListeners();
    }
  }

  Future<void> changeEmail(String newEmail, BuildContext context) async {
    try {
      editState = LoadingState.loading;
      notifyListeners();

      if (token == null || email == null) {
        logOut(context);
        return;
      }

      await userRepository.changeEmail(newEmail, token!, email!, context);
      await getProfileInfo(context);

      editState = LoadingState.finished;
      notifyListeners();
    } on HttpException catch (e, _) {
      errorMessage = e.message;
      editState = LoadingState.error;
      notifyListeners();
    }
  }

  Future<void> changePicture(String picturePath, BuildContext context) async {

    try {
      editState = LoadingState.loading;
      notifyListeners();

      if (token == null || email == null) {
        logOut(context);
        return;
      }

      await userRepository.changePicture(picturePath, token!, email!, context);
      await getProfileInfo(context);

      editState = LoadingState.finished;
      notifyListeners();
    } on HttpException catch (e, _) {
      errorMessage = e.message;
      editState = LoadingState.error;
      notifyListeners();
    }
  }
}
