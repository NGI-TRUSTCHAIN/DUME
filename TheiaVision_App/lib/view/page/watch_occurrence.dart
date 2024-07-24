import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';
import 'package:theia/model/occurrence.dart';

import '../../constants.dart';
import '../../utils.dart';
import '../component/bottom_bar.dart';
import '../component/top_bar.dart';

class WatchOccurrencePage extends StatefulWidget {
  const WatchOccurrencePage({super.key, required this.occurrence});

  final Occurrence occurrence;

  @override
  State<StatefulWidget> createState() {
    return _WatchOccurrencePageState();
  }
}

class _WatchOccurrencePageState extends State<WatchOccurrencePage> {


  bool expand = false;

  @override
  Widget build(BuildContext context) {
    return CustomBottomNavBar(body: getBody(), currentIndex: 3);
  }

  Widget getBody() {
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
              children: [getImage(), getTop()],
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
                        widget.occurrence.id,
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
                      widget.occurrence.dateToString(),
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


  Widget getImage() {
    return  Image.network(
      replaceLocalhostWithNgrok(widget.occurrence.image!),
      width: MediaQuery.of(context).size.width,
      loadingBuilder:
          (BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
        if (loadingProgress == null) {
          return child;
        } else {
          return SizedBox(
            width: MediaQuery.of(context).size.width,
            child: Center(
              child: CircularProgressIndicator(
                value: loadingProgress.expectedTotalBytes != null
                    ? loadingProgress.cumulativeBytesLoaded /
                    (loadingProgress.expectedTotalBytes ?? 1)
                    : null,
                color: theiaBrightPurple,
              ),
            ),
          );
        }
      },
      frameBuilder: (BuildContext context, Widget child, int? frame,
          bool wasSynchronouslyLoaded) {
        if (wasSynchronouslyLoaded || frame != null) {
          return child;
        } else {
          return SizedBox(
            width: MediaQuery.of(context).size.width,
            child: const Center(
              child: CircularProgressIndicator(
                color: theiaBrightPurple,
              ),
            ),
          );
        }
      },
      errorBuilder: (context, error, stackTrace) {
        log(error.toString());
        return SvgPicture.asset(
          pathImagePlaceHolder,
          width: MediaQuery.of(context).size.width,
        );
      },
    );
  }
}
