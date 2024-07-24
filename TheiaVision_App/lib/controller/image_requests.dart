import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';

class ImageScreen {

  Future<dynamic> getFramesInArea(String token, double radius, LatLng center) async {
    var headers = {
      'Authorization': 'Bearer $token'
    };

    try {
      var request = http.Request('GET',
        Uri.parse('https://tidycity.logimade.pt/server/api/images/coordinates/?outer_radius=$radius&center='
            '{"lat":${center.latitude}, "long": ${center.longitude} }'));

      request.headers.addAll(headers);

      http.StreamedResponse response = await request.send();

      if (response.statusCode == 200 || response.statusCode == 202) {
        var result = jsonDecode(await response.stream.bytesToString());
        return result;
      } else {
        throw("${response.reasonPhrase}");
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<Uint8List> getFrame(String token, String frameId) async {
    var headers = {
      'Authorization': 'Bearer $token'
    };

    try {
      var request = http.Request('GET',
        Uri.parse('https://tidycity.logimade.pt/server/api/images/?image_id=$frameId'));

      request.headers.addAll(headers);

      http.StreamedResponse response = await request.send();

      if (response.statusCode == 200 || response.statusCode == 202) {
        return response.stream.toBytes();
      } else {
        throw("${response.reasonPhrase}");
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<dynamic> getVideo(String token, String videoId) async {
    var headers = {
      'Authorization': 'Bearer $token'
    };

    try {
      var request = http.Request('GET',
        Uri.parse('https://tidycity.logimade.pt/server/api/video/?video_id=$videoId'));

      request.headers.addAll(headers);

      http.StreamedResponse response = await request.send();

      if (response.statusCode == 200 || response.statusCode == 202) {
        return await response.stream.bytesToString();
      } else {
        throw("${response.reasonPhrase}");
      }
    } catch (e) {
      rethrow;
    }
  }

}
