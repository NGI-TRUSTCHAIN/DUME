import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../model/video.dart';
import '../../utils.dart';
import '../component/bottom_bar.dart';
import '../component/top_bar.dart';
import '../../constants.dart';

class WatchVideoPage extends StatefulWidget {
  const WatchVideoPage({super.key, required this.video});

  final Video video;

  @override
  State<StatefulWidget> createState() {
    return _WatchVideoPageState();
  }
}

class _WatchVideoPageState extends State<WatchVideoPage> {
  int currentFrame = 0;
  bool expand = false;

  @override
  Widget build(BuildContext context) {
    return CustomBottomNavBar(body: getBody(), currentIndex: 1);
  }

  Widget getBody() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TopBar(
          backPage: "/video",
          backButton: true,
          backArg: widget.video,
          text: AppLocalizations.of(context)!.videos,
        ),
        Expanded(
          child: SingleChildScrollView(
            child: Stack(
              children: [getImage(MediaQuery.of(context).size.width, widget.video, currentFrame, context,(){}), getTop(), getNavigateFrames()],
            ),
          ),
        )
      ],
    );
  }

  Widget getTop() {
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
                        widget.video.images[currentFrame].id,
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
                      widget.video.images[currentFrame].dateToString(),
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

  Widget getNavigateFrames() {
    return Positioned(
      bottom: 0,
      child: Container(
        padding: const EdgeInsets.only(top: 20, bottom: 20),
        width: MediaQuery
            .of(context)
            .size
            .width,
        decoration: const BoxDecoration(
            color: theiaAppBarGray,
            borderRadius: BorderRadius.vertical(top: Radius.circular(30))),
        child: Column(
          children: [
            Container(
              decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.all(Radius.circular(20))),
              width: MediaQuery
                  .of(context)
                  .size
                  .width - 40,
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
                        }
                      },
                      child: Container(
                        decoration: BoxDecoration(
                            color: currentFrame > 0
                                ? theiaDarkPurple
                                : Colors.grey,
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
                      "${AppLocalizations.of(context)!.image
                          .toUpperCase()} ${currentFrame + 1}/${widget.video
                          .receivedFrames}",
                      style: const TextStyle(
                          fontWeight: FontWeight.w700, fontSize: 18),
                    ),
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        if (currentFrame < widget.video.receivedFrames - 1) {
                          setState(() {
                            currentFrame++;
                          });
                        }
                      },
                      child: Container(
                        decoration: BoxDecoration(
                            color:
                            currentFrame < widget.video.receivedFrames - 1
                                ? theiaDarkPurple
                                : Colors.grey,
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
