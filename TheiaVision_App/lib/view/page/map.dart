import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import 'package:theia/controller/provider/map_provider.dart';
import 'package:theia/controller/provider/user_provider.dart';

import '/../constants.dart';
import '../../model/map_screen_state.dart';
import '../component/bottom_bar.dart';
import '../component/top_bar.dart';


class StreetViewerWidget extends StatefulWidget {
    const StreetViewerWidget({super.key});

    @override
    _StreetViewerWidget createState() => _StreetViewerWidget();
}

class _StreetViewerWidget extends State<StreetViewerWidget> {

    late double offset;
    List<({String id, LatLng coordinate})> dropdownOptions = [];

    @override
    Widget build(BuildContext context) {
        offset = MediaQuery.of(context).size.width * 0.075;

        return CustomBottomNavBar(body: getBody(), currentIndex: 4);
    }

    Widget getBody() {
        return Container(
            decoration: const BoxDecoration(color: theiaAppBarGray),
            child: Column(
                children: [
                    TopBar(
                        text: AppLocalizations.of(context)!.street_viewer,
                    ),
                    Expanded(
                        child: switch(context.watch<MapProvider>().currentScreenState) {
                            ScreenState.expandedMap => expandedMap(),
                            ScreenState.expandedViewer => expandedViewer(),
                            ScreenState.splitScreen => splitScreen(),
                            _ => throw(e)
                        }
                    )
                ]
            )
        );
    }

    // -------------------------------- screens --------------------------------

    Widget expandedMap() {
        Widget viewerPopup;
        if (context.watch<MapProvider>().currentVideo.id == "") {
            viewerPopup = Container();
        } else {
            viewerPopup = Positioned(
                bottom: offset,
                left: offset,
                child: streetViewerBox()
            );
        }
        return Column(
            children: [
                searchBar(),
                Expanded(
                    flex: 12,
                    child: Stack(
                        children: [
                            mapConsumer(),
                            viewerPopup
                        ],
                    )
                )
            ],
        );
    }

    Widget splitScreen() {
        return Column(
            children: [
                Expanded(
                    flex: 1,
                    child: searchBar()
                ),
                Expanded(
                    flex: 6,
                    child: mapConsumer()
                ),
                Expanded(
                    flex: 6,
                    child: Stack(
                        children: [
                            ColoredBox(
                                color: Colors.black,
                                child: streetVideoGetter()
                            ),
                            streetImageNavigatorArrows(250),
                            IconButton(
                                onPressed: () {
                                    setState(() {
                                        context.watch<MapProvider>().currentScreenState = ScreenState.expandedMap;
                                    });
                                },
                                icon: const Icon(
                                    FontAwesomeIcons.minimize,
                                    color: theiaBrightPurple
                                ),
                            )
                        ]
                    )
                )
            ]
        );
    }

    Widget expandedViewer() {
        return Stack(
            children: [
                streetVideoGetter(),
                streetImageNavigatorArrows(600),
                Positioned(
                    bottom: offset,
                    left: offset,
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                            videosDropdown(),
                            mapBox()
                        ],
                    )
                )
            ],
        );
    }

    // ---------------------------------- map ----------------------------------

    Widget mapConsumer () {

        Widget mapWidget;
        if (context.watch<MapProvider>().markers.isEmpty) {
            mapWidget = FutureBuilder(
                future: Provider.of<MapProvider>(context, listen: false).getFramesInInitialArea(
                    Provider.of<UserProvider>(context, listen: false).token!
                ),
                builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                        return mapBuilder();
                    } else if (snapshot.hasError) {
                        return Text('Error: ${snapshot.error}');
                    } else {
                        context.watch<MapProvider>().markers = getMarkers(snapshot.data["images"]);
                        return mapBuilder();
                    }
                }
            );
        } else {
            mapWidget = mapBuilder();
        }

        return mapWidget;
    }

    Widget mapBuilder() {
        return FlutterMap(
            options: Provider.of<MapProvider>(context, listen: false).mapOptions,
            mapController: Provider.of<MapProvider>(context, listen: false).mapController,
            children: [
                GestureDetector(
                    onTap: () {
                        setState(() {
                            context.watch<MapProvider>().currentScreenState = ScreenState.expandedMap;
                        });
                    }
                ),
                TileLayer(
                    urlTemplate: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                    subdomains: const ['a', 'b', 'c'],
                ), MarkerLayer(markers: context.watch<MapProvider>().markers)
            ],
        );
    }

    // ----------------------------- street images -----------------------------

    Widget streetVideoGetter() {

        Widget videoWidget;
        if (Provider.of<MapProvider>(context, listen: false).currentVideo.id == "") {
          throw(e);
        } else if (Provider.of<MapProvider>(context, listen: false).currentVideo.id != Provider.of<MapProvider>(context, listen: false).previousVideo.id) {

            context.watch<MapProvider>().imageCache = {};
            context.watch<MapProvider>().previousVideo = context.watch<MapProvider>().currentVideo;

            videoWidget = FutureBuilder(
                future: Provider.of<MapProvider>(context, listen: false).imageScreen.getVideo(
                    Provider.of<UserProvider>(context, listen:false).token!,
                    context.watch<MapProvider>().currentVideo.id
                ),
                builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                        return waiting();
                    } else if (snapshot.hasError) {
                        return Text('Error: ${snapshot.error}');
                    } else {
                        var jsonData = jsonDecode(snapshot.data);
                        processFrames(jsonData);
                        return streetImageGetter();
                    }
                }
            );
        } else {
            videoWidget = streetImageGetter();
        }

        return Center(
            child: videoWidget
        );
    }

    Widget streetImageGetter() {
        if (Provider.of<MapProvider>(context, listen: false).currentIndex == -1) {
            context.watch<MapProvider>().currentIndex = Provider.of<MapProvider>(context, listen: false).currentVideo.data.indexWhere((element) => (
                element["coordinates"]["lat"] == context.watch<MapProvider>().mapOptions.initialCenter.latitude &&
                element["coordinates"]["long"] == context.watch<MapProvider>().mapOptions.initialCenter.longitude
            ));
            if (Provider.of<MapProvider>(context, listen: false).currentIndex == -1) {
                print("index not found");
                Provider.of<MapProvider>(context, listen: false).currentIndex = 0;
            }
        }

        dynamic currentFrame = context.watch<MapProvider>().currentVideo.data[context.watch<MapProvider>().currentIndex];
        LatLng newCenter = LatLng(
            currentFrame["coordinates"]["lat"],
            currentFrame["coordinates"]["long"]
        );

        context.watch<MapProvider>().mapOptions = MapOptions(
            initialCenter: newCenter,
            initialZoom: Provider.of<MapProvider>(context, listen: false).mapController.camera.zoom,
        );

        Widget imageWidget;

        if (!(imageCache.containsKey(currentFrame["id"]))) {
            String imageId = currentFrame["url"].split("?image_id=")[1];
            imageWidget = FutureBuilder(
                future: Provider.of<MapProvider>(context, listen: false).imageScreen.getFrame(
                    Provider.of<UserProvider>(context, listen:false).token!,
                    imageId
                ),
                builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                        return waiting();
                    } else if (snapshot.hasError) {
                        return Text('Error: ${snapshot.error}');
                    } else {
                        context.watch<MapProvider>().imageCache[currentFrame["id"]] = snapshot.data;
                        return Image.memory(snapshot.data!);
                    }
                },
            );
        } else {
            imageWidget = Image.memory(context.watch<MapProvider>().imageCache[currentFrame["id"]]!);
        }

        WidgetsBinding.instance.addPostFrameCallback((_) {
            Provider.of<MapProvider>(context, listen: false).mapController.move(
                newCenter,
                Provider.of<MapProvider>(context, listen: false).mapOptions.initialZoom
            );
        });

        return GestureDetector(
            onTap: () {
                setState(() {
                    context.watch<MapProvider>().currentScreenState = ScreenState.expandedViewer;
                });
            },
            child: imageWidget
        );
    }

    // ---------------------------- helper widgets -----------------------------

    Widget waiting() {
        return const Center(
            child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                    CircularProgressIndicator()
                ],
            )
        );
    }

    Widget streetImageNavigatorArrows([double? top, double? iconSize]){
        return Positioned(
            top: top ?? 0,
            left: 0,
            right: 0,
            child: Center(
                child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                        IconButton(
                            onPressed: () {
                                setState(() {
                                    context.watch<MapProvider>().currentIndex = min(
                                        Provider.of<MapProvider>(context, listen: false).currentIndex + 1,
                                        Provider.of<MapProvider>(context, listen: false).currentVideo.data.length - 1);
                                });
                            },
                            icon: Icon(
                                Icons.arrow_upward,
                                size: iconSize ?? 25.0,
                                color: theiaBrightPurple
                            )
                        ),
                        IconButton(
                            onPressed: () {
                                setState(() {
                                    context.watch<MapProvider>().currentIndex = max(
                                        Provider.of<MapProvider>(context, listen: false).currentIndex - 1,
                                        0
                                    );
                                });
                            },
                            icon: Icon(
                                Icons.arrow_downward,
                                size: iconSize ?? 25.0,
                                color: theiaBrightPurple
                            )
                        ),
                    ]
                )
            )
        );
    }

    Widget streetViewerBox([double? boxWidth, double? boxHeight]) {
        return Stack(
            children: [
                GestureDetector(
                    onTap: () {
                        context.watch<MapProvider>().currentScreenState = ScreenState.expandedViewer;
                    },
                    child: Container(
                        decoration: BoxDecoration(
                            color: Colors.black,
                            border: Border.all(
                                color: Colors.black
                            ),
                            borderRadius: const BorderRadius.all(Radius.circular(20))
                        ),
                        width: boxWidth ?? 150,
                        height: boxHeight ?? 150,
                        alignment: Alignment.center,
                        child: Center(child: streetVideoGetter())
                    )
                ),
                IconButton(
                    onPressed: () {
                        setState(() {
                            context.watch<MapProvider>().currentScreenState = ScreenState.splitScreen;
                        });
                    },
                    icon: const Icon(
                        FontAwesomeIcons.expand,
                        color: theiaBrightPurple
                    ),
                )
            ]
        );
    }

    Widget mapBox([double? boxWidth, double? boxHeight]) {
        return Stack(
            children: [
                Container(
                    decoration: BoxDecoration(
                        border: Border.all(
                            color: Colors.black,
                            width: 2
                        ),
                        borderRadius: const BorderRadius.all(Radius.circular(20))
                    ),
                    child: SizedBox(
                        width: boxWidth ?? 150,
                        height: boxHeight ?? 150,
                        child: ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: mapConsumer(),
                        ),
                    )
                )
            ],
        );
    }

    Widget videosDropdown() {

        Widget futureBuilder = FutureBuilder(
            future: Provider.of<MapProvider>(context, listen: false).imageScreen.getFramesInArea(
                Provider.of<UserProvider>(context, listen:false).token!,
                0.002,
                Provider.of<MapProvider>(context, listen: false).mapOptions.initialCenter
            ),
            builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                    return DropdownButton(
                        dropdownColor: Colors.white,
                        value: Provider.of<MapProvider>(context, listen: false).currentVideo.id,
                        isExpanded: true,
                        items: [
                            DropdownMenuItem<String>(
                                value: Provider.of<MapProvider>(context, listen: false).currentVideo.id,
                                child: Text(
                                    getVideoDate(Provider.of<MapProvider>(context, listen: false).currentVideo.id),
                                    overflow: TextOverflow.ellipsis,
                                ),
                            ),
                        ],
                        onChanged: null
                    );
                } else if (snapshot.hasError) {
                    return Text('Error: ${snapshot.error}');
                } else {
                    dropdownOptions = getOptions(snapshot.data["images"]);
                    return DropdownButton(
                        dropdownColor: Colors.white,
                        value: (id: dropdownOptions[0].id, coordinate: dropdownOptions[0].coordinate),
                        isExpanded: true,
                        items: dropdownOptions.map<DropdownMenuItem>((value) {
                            return DropdownMenuItem(
                                value: value,
                                child: Text(
                                    getVideoDate(value.id),
                                    overflow: TextOverflow.ellipsis,
                                ),
                            );
                        }).toList(),
                        onChanged: (value) {
                            if (value != null) {
                                setState(() {
                                    context.watch<MapProvider>().currentIndex = -1;
                                    context.watch<MapProvider>().mapOptions = MapOptions(
                                        initialCenter: value.coordinate,
                                        initialZoom: context.watch<MapProvider>().mapController.camera.zoom
                                    );
                                    context.watch<MapProvider>().previousVideo = context.watch<MapProvider>().currentVideo;
                                    context.watch<MapProvider>().currentVideo = (id: value.id, data: context.watch<MapProvider>().currentVideo.data);
                                });
                            }
                        }
                    );
                }
            }
        );

        return Container(
            width: 150,
            height: 50,
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            child: futureBuilder,
        );
    }

    Widget searchBar() {
        return Container(
            color: theiaDarkPurple,
            padding: const EdgeInsets.all(10.0),
            height: 65,
            child: SearchAnchor(
                builder: (BuildContext context, SearchController controller) {
                    return SearchBar(
                        controller: controller,
                        onChanged: (String value) {
                            print(value);
                        }
                    );
                },
                suggestionsBuilder: (BuildContext context, SearchController controller) { return []; },
            )
        );
    }

    // -------------------------------- helpers --------------------------------

    List<Marker> getMarkers(List<dynamic> mapPoints) {

        List<Marker> markersList = [];
        for(var point in mapPoints) {
            LatLng coordinate = LatLng(
                point["coordinates"]["lat"],
                point["coordinates"]["long"]
            );

            markersList.add(
                Marker(
                    point: coordinate,
                    child: GestureDetector(
                        onTap: () {
                            setState(() {
                                context.watch<MapProvider>().currentScreenState = ScreenState.expandedViewer;
                                context.watch<MapProvider>().currentIndex = -1;
                                context.watch<MapProvider>().mapOptions = MapOptions(
                                    initialCenter: coordinate,
                                    initialZoom: context.watch<MapProvider>().mapController.camera.zoom
                                );
                                context.watch<MapProvider>().previousVideo = context.watch<MapProvider>().currentVideo;
                                context.watch<MapProvider>().currentVideo = (id: point["videoId"], data: context.watch<MapProvider>().currentVideo.data);
                            });
                        },
                        child: const Icon(
                            Icons.circle,
                            size: 10,
                            color: theiaGreen
                        )
                    )

                )
            );
        }

        return markersList;
    }

    void processFrames(dynamic videoMD) {
        List<LatLng> framesLatLng = [];
        List<dynamic> processedVideoData = [];

        for (dynamic frame in videoMD["frames"]){

            LatLng coordinate =
            frame["coordinates"]["lat"] != null && frame["coordinates"]["long"] != null ?
            LatLng(
                frame["coordinates"]["lat"],
                frame["coordinates"]["long"]
            ) :
            throw("coordinates do not exist on db");

            if (frame["url"] == null) continue;
            if (!(framesLatLng.contains(coordinate))) {
                framesLatLng.add(coordinate);
                processedVideoData.add(frame);
            }
        }
        context.watch<MapProvider>().currentVideo = (id: videoMD["video"]["id"], data: processedVideoData);
    }

    String getVideoDate(String id) {
        return id.split("Video_")[1].replaceAll('_', ':').replaceFirst(':', '.', 19);
    }

    List<({String id, LatLng coordinate})> getOptions(List images) {
        List<({String id, LatLng coordinate})> options = [];

        for (dynamic image in images) {
            bool existsCoordinate = false;
            for (dynamic option in options) {
                if (option.id == image["videoId"]){
                    existsCoordinate = true;
                    break;
                }
            }
            if (!existsCoordinate && context.watch<MapProvider>().currentVideo.id != image["videoId"]) {
                options.add(
                    (
                        id: image["videoId"],
                        coordinate: LatLng(
                            image["coordinates"]["lat"],
                            image["coordinates"]["long"]
                        )
                    )
                );
            }
        }
        options.sort((a, b) => a.id.compareTo(b.id));
        options.insert(0, (id: Provider.of<MapProvider>(context, listen: false).currentVideo.id, coordinate: Provider.of<MapProvider>(context, listen: false).mapOptions.initialCenter));

        return options;
    }

}
