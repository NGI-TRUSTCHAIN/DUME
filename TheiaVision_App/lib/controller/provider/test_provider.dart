
import 'package:http/http.dart' as http;
import 'package:flutter/cupertino.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TestProvider extends ChangeNotifier{
  String test = "";
  String path = "";

  TestProvider() {
    initializeTestFromSharedPrefs();
  }

  Future<void> initializeTestFromSharedPrefs() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    test = prefs.getString("test") ?? "";
    path = prefs.getString("path")?? "";

    notifyListeners();
  }

  Future<String> getApplicationPath() async{

    if (path != ""){
      var dir = await getApplicationDocumentsDirectory();
      path = dir.path;
    }
    print(path);
    return path;

  }




  void changeTest({
    required String newTest
}) async {
    test = newTest;
    saveTestToSharedPrefs();
    notifyListeners();
  }




  Future<void> saveTestToSharedPrefs() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString("test", test);
  }



  Future<String> fetchAlbum() async {
    final response = await http
        .get(Uri.parse('https://jsonplaceholder.typicode.com/albums/1'));

    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception('Failed to load album');
    }
  }
}