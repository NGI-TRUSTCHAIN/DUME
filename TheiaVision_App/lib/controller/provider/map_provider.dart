import 'dart:typed_data';

import 'package:flutter/cupertino.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../model/map_screen_state.dart';
import '../image_requests.dart';

class MapProvider extends ChangeNotifier {
    ScreenState currentScreenState = ScreenState.expandedMap;
    ImageScreen imageScreen = ImageScreen();
    MapController mapController = MapController();
    MapOptions mapOptions = const MapOptions(
        initialCenter: LatLng(32.655153, -16.928667),
        initialZoom: 13
    );

    List<Marker> markers = [];
    ({String id, dynamic data}) currentVideo = (id: "", data: null), previousVideo = (id: "", data: null);
    int currentIndex = -1;

    Map<String, Uint8List?> imageCache = {};

    Future<dynamic> getFramesInInitialArea(String token) async {
        return imageScreen.getFramesInArea(token, 100, const LatLng(32.6550162, -16.9145789));
    }
}