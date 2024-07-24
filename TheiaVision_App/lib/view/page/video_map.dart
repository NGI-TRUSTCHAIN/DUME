import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import 'package:theia/controller/provider/user_provider.dart';
import 'package:theia/controller/provider/video_provider.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../constants.dart';
import '../../model/video.dart';
import '../component/bottom_bar.dart';
import '../component/top_bar.dart';

class VideoMapPage extends StatefulWidget {
  const VideoMapPage({super.key, required this.video});

  final Video video;

  @override
  State<StatefulWidget> createState() {
    return _VideoMapPageState();
  }
}

class _VideoMapPageState extends State<VideoMapPage> {
  late Future<List<LatLng>> initPoints;

  @override
  void initState() {
    initPoints = Provider.of<VideoProvider>(context, listen: false)
        .getRouteTraveled(
            Provider.of<UserProvider>(context, listen: false).token!,
            widget.video.id,
            context);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return CustomBottomNavBar(body: getBody(), currentIndex: 1);
  }

  Widget getBody() {
    return Container(
        decoration: const BoxDecoration(color: theiaAppBarGray),
        child: Column(children: [
          TopBar(
            text: AppLocalizations.of(context)!.map,
            backButton: true,
            backArg: widget.video,
            backPage: '/video',
          ),
          Expanded(
            child: getMap(),
          )
        ]));
  }

  Widget getMap() {
    return FutureBuilder<List<LatLng>>(
      future: initPoints,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        return Stack(
          children: [
            FlutterMap(
              options: MapOptions(
                  initialCenter: snapshot.data![0], initialZoom: 20),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.example.app',
                ),
                MarkerLayer(markers: getMarkers(snapshot.data!))
              ],
            ),
          ],
        );
      },
    );
  }

  List<Marker> getMarkers(List<LatLng> coordinates) {
    List<Marker> list = [];

    for (var coordinate in coordinates) {
      list.add(getMarker(coordinate));
    }

    return list;
  }

  Marker getMarker(LatLng coordinate) {
    return Marker(
      point: coordinate,
      child: const Icon(Icons.circle, size: 10, color: theiaBrightPurple),
    );
  }
}
