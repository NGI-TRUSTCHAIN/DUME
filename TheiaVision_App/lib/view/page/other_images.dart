import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:provider/provider.dart';
import 'package:theia/controller/provider/occurrence_provider.dart';
import 'package:theia/controller/provider/user_provider.dart';
import 'package:theia/model/custom_image.dart';

import '../../model/occurrence.dart';
import '../../utils.dart';
import '../component/bottom_bar.dart';
import '../component/top_bar.dart';
import '../../constants.dart';

class OtherImagesPage extends StatefulWidget {
  const OtherImagesPage({super.key, required this.occurrence});

  final Occurrence occurrence;

  @override
  State<StatefulWidget> createState() {
    return _OtherImagesPageState();
  }
}

class _OtherImagesPageState extends State<OtherImagesPage> {
  int currentFrame = 0;

  late Future<List<CustomImage>> getImages;
  bool expand = false;

  @override
  void initState() {
    getImages = Provider.of<OccurrenceProvider>(context, listen: false)
        .getOtherImages(widget.occurrence.coordinates,
            Provider.of<UserProvider>(context, listen: false).token!, context);

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return CustomBottomNavBar(body: getBody(), currentIndex: 3);
  }

  Widget getBody() {
    return FutureBuilder<List<CustomImage>>(
      future: getImages,
      builder:
          (BuildContext context, AsyncSnapshot<List<CustomImage>> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TopBar(
              backPage: "/occurrence",
              backButton: true,
              backArg: widget.occurrence,
              text: AppLocalizations.of(context)!.occurrence,
            ),
            Expanded(
              child: SingleChildScrollView(
                child: Stack(
                  children: [
                    getOccurrenceImages(MediaQuery.of(context).size.width,
                        snapshot.data!, currentFrame, context),
                    getTop(snapshot.data!),
                    getNavigateFrames(snapshot.data!)
                  ],
                ),
              ),
            )
          ],
        );
      },
    );
  }



  Widget getTop(List<CustomImage> images) {
    return GestureDetector(
      onVerticalDragUpdate: (details) {
        setState(() {
          expand = details.delta.dy > 0;
        });
      },
      child: Container(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
        decoration: const BoxDecoration(
          color: theiaDarkPurple,
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(30)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            if (expand)
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.all(Radius.circular(20)),
                ),
                width: MediaQuery.of(context).size.width - 40,
                height: 70,
                margin: const EdgeInsets.fromLTRB(0, 0, 0, 10),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Text(
                      AppLocalizations.of(context)!.id.toUpperCase(),
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                      ),
                    ),
                    Container(
                      width: 1.5,
                      height: 20,
                      color: theiaDarkPurple,
                      margin: const EdgeInsets.fromLTRB(0, 8, 0, 8),
                    ),
                    SizedBox(
                      width: (MediaQuery.of(context).size.width - 40) /2,
                      child: Text(
                        images[currentFrame].id,
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 15,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            if (expand)
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.all(Radius.circular(20)),
                ),
                width: MediaQuery.of(context).size.width - 40,
                height: 35,
                margin: const EdgeInsets.fromLTRB(0, 0, 0, 10),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Text(
                      AppLocalizations.of(context)!.image.toUpperCase(),
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                      ),
                    ),
                    Container(
                      width: 1.5,
                      color: theiaDarkPurple,
                      margin: const EdgeInsets.fromLTRB(0, 8, 0, 8),
                    ),
                    Text(
                      images[currentFrame].dateToString(),
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
              ),
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: MediaQuery.of(context).size.width - 40,
              height: 2,
              color: Colors.white,
              margin: const EdgeInsets.all(10),
            ),
          ],
        ),
      ),
    );
  }

  Widget getNavigateFrames(List<CustomImage> images) {
    return Positioned(
      bottom: 0,
      child: Container(
        padding: const EdgeInsets.only(top: 20, bottom: 20),
        width: MediaQuery.of(context).size.width,
        decoration: const BoxDecoration(
            color: theiaAppBarGray,
            borderRadius: BorderRadius.vertical(top: Radius.circular(30))),
        child: Column(
          children: [
            Container(
              decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.all(Radius.circular(20))),
              width: MediaQuery.of(context).size.width - 40,
              height: 50,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        if (currentFrame > 0) {
                          setState(() {
                            currentFrame--;
                          });
                        }else{
                          setState(() {
                            currentFrame = images.length-1;
                          });
                        }
                      },
                      child: Container(
                        decoration: BoxDecoration(
                            color: images.length == 1 ? Colors.grey : theiaDarkPurple,
                            borderRadius: const BorderRadius.horizontal(
                                left: Radius.circular(20))),
                        child: const Icon(
                          Icons.keyboard_double_arrow_left,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 40),
                    alignment: Alignment.center,
                    child: Text(
                      "${AppLocalizations.of(context)!.image.toUpperCase()} ${currentFrame + 1}/${images.length}",
                      style: const TextStyle(
                          fontWeight: FontWeight.w700, fontSize: 18),
                    ),
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        if (currentFrame < images.length - 1) {
                          setState(() {
                            currentFrame++;
                          });
                        }else{
                          setState(() {
                            currentFrame = 0;
                          });
                        }
                      },
                      child: Container(
                        decoration: BoxDecoration(
                            color: images.length == 1 ? Colors.grey :  theiaDarkPurple,

                            borderRadius: const BorderRadius.horizontal(
                                right: Radius.circular(20))),
                        child: const Icon(
                          Icons.keyboard_double_arrow_right,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
