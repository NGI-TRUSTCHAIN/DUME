import 'dart:convert';
import 'dart:developer';

import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:path/path.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:theia/model/frame.dart';
import 'package:theia/model/recorded_video.dart';

class SolidService {
  Map<String, String?>? _credentials;
  late String _url;
  late String _token;
  final String _ledgerUrl = '/theia-vision/ledger.json';

  SolidService() {
    _initializeCredentials();
  }

  Future<void> _initializeCredentials() async {
    _credentials = await _getSolidCredentials();
    log('$_credentials');
    _token = _credentials!['solidToken']!;
    log('token first $_token');
    log('URL is ${_credentials!['solidUsername']!}');
    _url = '${_credentials!['solidUsername']!}.dume-arditi.com';
  }

  Future<Map<String, String>> createAccount(
      String username, String password, String email, String name) async {
    var response = await http.post(
      Uri.https('dume-arditi.com', '/new-pod'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'username': username,
        'password': password,
        'email': email,
        'name': name,
      }),
    );

    log('Response status: ${response.statusCode}');
    log('Response body: ${response.body}');
    if (response.statusCode != 201) {
      return {'message': 'error'};
    }

    return {'message': 'success'};
  }

  Future<Map<String, String>> signIn(String username, String password) async {
    final solidWebId = 'https://$username.dume-arditi.com/profile/card#me';

    var response = await http.post(Uri.https('dume-arditi.com', '/jwt'),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          'username': username,
          'password': password,
          'webId': solidWebId
        });

    log('Response status: ${response.statusCode}');
    log('Response body: ${response.body}');
    if (response.statusCode != 200) {
      return {'message': 'error'};
    }

    final Map<String, dynamic> responseData = jsonDecode(response.body);
    final String token = responseData['token'];

    await _storeSolidCredentials(username, password, token, solidWebId);
    return {'message': 'success'};
  }

  Future<void> _testToken() async {
    var response = await http.get(Uri.https(_url, _ledgerUrl),
        headers: {'Authorization': 'Bearer $_token'});

    if (response.statusCode == 400 && response.body == 'Invalid Token') {
      await signIn(
          _credentials!['solidUsername']!, _credentials!['solidPassword']!);
      await _initializeCredentials();
    }
  }

  Future<Map<String, dynamic>?> getLedger() async {
    await _testToken();
    log('token second $_token');
    var response = await http.get(Uri.https(_url, '/theia-vision/ledger.json'),
        headers: {'Authorization': 'Bearer $_token'});
    log('${response.statusCode}');
    log(response.body);

    if (response.statusCode != 200) {
      return null;
    }

    return jsonDecode(response.body);
  }

  Future<void> uploadVideoParams(Map<String, dynamic> ledgerData,
      List<Frame> copyFrames, String folderUrl) async {
    await _initializeCredentials();
    RegExp regExp = RegExp(
        r"_rowStr0_(\d+)_rowStr1_(\d+)_pixStr_(\d+)_width_(\d+)_height_(\d+)_sensorOrientation_(\d+)");
    var metadataList = [];
    for (var frame in copyFrames) {
      var frameUrl = withoutExtension(frame.path.replaceAll(regExp, ''));
      var frameMetadata = {
        "id": frame.id,
        "date": frame.date,
        "coordinates": {
          "lat": frame.coordinates.latitude,
          "long": frame.coordinates.longitude
        },
        "videoId": folderUrl.split('_').last,
        "classes": "",
        "url":
            "https://$_url/theia-vision/$folderUrl/${frameUrl.split('/').last}",
        "analysed": 0,
        "date_analysed": null
      };

      metadataList.add(frameMetadata);
    }

    ledgerData['images'].addAll(metadataList);

    var response = await http.put(
        Uri.https(_url, "/theia-vision/$folderUrl/ledger.json"),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_token'
        },
        body: jsonEncode(ledgerData));

    log('${response.statusCode}');
  }

  Future<void> uploadFrames(String folderUrl, List<Frame> frames) async {
    log('entering in upload frames from solid');

    var request = http.MultipartRequest(
        'POST', Uri.https(_url, '/theia-vision/$folderUrl/'));

    var headers = {
      'Content-Type': 'multipart/form-data; boundary=bound',
      'Authorization': 'Bearer $_token'
    };

    request.headers.addAll(headers);

    for (var frame in frames) {
      request.files.add(await http.MultipartFile.fromPath('image', frame.path,
          contentType: MediaType.parse('image/png'),
          filename: frame.path
              .split('/')
              .last // Assuming `filePath` is the path to the frame file
          ));
    }

    var response = await request.send();

    log("${response.statusCode}");
  }

  Future<void> _storeSolidCredentials(String solidUsername,
      String solidPassword, String solidToken, String solidWebId) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString("solidUsername", solidUsername);
    prefs.setString("solidPassword", solidPassword);
    prefs.setString("solidToken", solidToken);
    prefs.setString("solidWebId", solidWebId);
  }

  Future<Map<String, String?>> _getSolidCredentials() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();

    return {
      'solidUsername': prefs.getString('solidUsername'),
      'solidPassword': prefs.getString('solidPassword'),
      'solidToken': prefs.getString('solidToken'),
      'solidWebId': prefs.getString('solidWebId'),
    };
  }
}
