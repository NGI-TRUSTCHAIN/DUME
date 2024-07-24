import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'notification_provider.dart';

class LanguageChangeProvider extends ChangeNotifier {
  Locale _currentLocale = const Locale('en');

  LanguageChangeProvider() {
    initializeLocaleFromSharedPrefs();
  }

  Future<void> initializeLocaleFromSharedPrefs() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();

    _currentLocale = Locale(prefs.getString("locale") ?? "en");
    notifyListeners();
  }

  Future<void> saveLocaleToSharedPrefs() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString("locale", _currentLocale.languageCode);
  }

  void changeLocale(String code, BuildContext context) {
    _currentLocale = Locale(code);
    Provider.of<NotificationProvider>(context,listen: false).currentLocale = Locale(code);
    notifyListeners();
    saveLocaleToSharedPrefs();
  }

  Locale getCurrentLocale() {
    return _currentLocale;
  }

  String getCurrentLocaleCode() {
    return _currentLocale.languageCode;
  }
}
