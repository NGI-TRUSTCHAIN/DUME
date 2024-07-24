import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';
import 'package:provider/provider.dart';
import 'package:theia/controller/provider/user_provider.dart';
import 'package:theia/controller/provider/video_provider.dart';
import 'package:theia/model/loading_state.dart';

import '../../controller/provider/occurrence_provider.dart';
import '../../model/occurance_state.dart';
import '../../model/occurrence.dart';
import '../../utils.dart';
import '../component/bottom_bar.dart';

import '../component/top_bar.dart';
import '../../constants.dart';

class OccurrencePage extends StatefulWidget {
  const OccurrencePage({super.key, required this.occurrence});

  final Occurrence occurrence;

  @override
  State<StatefulWidget> createState() {
    return _OccurrencePageState();
  }
}

class _OccurrencePageState extends State<OccurrencePage> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return CustomBottomNavBar(body: getBody(), currentIndex: 3);
  }

  Widget getBody() {
    return Container(
      decoration: const BoxDecoration(color: theiaAppBarGray),
      child: Column(
        children: [
          TopBar(
            backButton: true,
            backPage: '/occurrences',
            text: AppLocalizations.of(context)!.occurrence,
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  getTopInfo(),
                  getButtons(),
                  getGeneralInfo(),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget getOtherImagesButton() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ElevatedButton(
          onPressed: () => {
            Navigator.of(context).pushNamed("/other-images",arguments: widget.occurrence)
          },
          style: ButtonStyle(
              backgroundColor: WidgetStateProperty.all(Colors.white),
              surfaceTintColor: WidgetStateProperty.all(Colors.white)),
          child: Text(
            AppLocalizations.of(context)!.other_images_button.toUpperCase(),
            style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: theiaBrightPurple),
            textAlign: TextAlign.center,
          ),
        ),
        const SizedBox(
          height: 15,
        ),
      ],
    );
  }

  Widget getPutUnderRevisionButton() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ElevatedButton(
          onPressed: () => {
            showCustomToast(AppLocalizations.of(context)!.coming_soon_title)
          },
          style: ButtonStyle(
              backgroundColor: WidgetStateProperty.all(Colors.white),
              surfaceTintColor: WidgetStateProperty.all(Colors.white)),
          child: Text(
            AppLocalizations.of(context)!.under_revision_button.toUpperCase(),
            style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: theiaBrightPurple.withOpacity(0.5)),
          ),
        ),
        const SizedBox(
          height: 15,
        ),
      ],
    );
  }

  Widget getVideoButton() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ElevatedButton(
          onPressed: () => {
            if (Provider.of<VideoProvider>(context, listen: false)
                    .getVideoState !=
                LoadingState.loading)
              {
                Provider.of<VideoProvider>(context, listen: false)
                    .getVideoById(
                        widget.occurrence.videoId,
                        Provider.of<UserProvider>(context, listen: false)
                            .token!,
                        context)
                    .then((video) {
                  if (Provider.of<VideoProvider>(context, listen: false)
                          .getVideoState ==
                      LoadingState.finished) {
                    Navigator.pushNamed(context, "/video", arguments: video);
                  }

                  if (Provider.of<VideoProvider>(context, listen: false)
                          .getVideoState ==
                      LoadingState.error) {
                    showCustomToast(
                        Provider.of<VideoProvider>(context, listen: false)
                            .errorMessage);
                  }
                })
              }
          },
          style: ButtonStyle(
              backgroundColor: WidgetStateProperty.all(Colors.white),
              surfaceTintColor: WidgetStateProperty.all(Colors.white)),
          child: context.watch<VideoProvider>().getVideoState ==
                  LoadingState.loading
              ? const Center(
                  child: SizedBox(
                      width: 12,
                      height: 12,
                      child: CircularProgressIndicator()),
                )
              : Text(
                  AppLocalizations.of(context)!.view_video_button.toUpperCase(),
                  style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: theiaBrightPurple),
                ),
        ),
        const SizedBox(
          height: 15,
        ),
      ],
    );
  }

  Widget getEditAnnotationsButton() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ElevatedButton(
          onPressed: () => {
            showCustomToast(AppLocalizations.of(context)!.coming_soon_title)
          },
          style: ButtonStyle(
              backgroundColor: WidgetStateProperty.all(Colors.white),
              surfaceTintColor: WidgetStateProperty.all(Colors.white)),
          child: Text(
            AppLocalizations.of(context)!.edit_annotations_button.toUpperCase(),
            // TODO: missing page and endpoints
            style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: theiaBrightPurple.withOpacity(0.5)),
          ),
        ),
        const SizedBox(
          height: 15,
        ),
      ],
    );
  }

  Widget getManualConfirmationButton() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ElevatedButton(
          onPressed: () => {
            showCustomToast(AppLocalizations.of(context)!.coming_soon_title)
          },
          style: ButtonStyle(
              backgroundColor: WidgetStateProperty.all(Colors.white),
              surfaceTintColor: WidgetStateProperty.all(Colors.white)),
          child: Text(
            AppLocalizations.of(context)!
                .manual_confirmation_button
                .toUpperCase(),
            // TODO: missing page and endpoints
            style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: theiaBrightPurple.withOpacity(0.5)),
          ),
        ),
        const SizedBox(
          height: 15,
        ),
      ],
    );
  }

  Widget getMarkAsSolvedButton() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ElevatedButton(
          onPressed: () => {
            showCustomToast(AppLocalizations.of(context)!.coming_soon_title)
          },
          style: ButtonStyle(
              backgroundColor: WidgetStateProperty.all(Colors.white),
              surfaceTintColor: WidgetStateProperty.all(Colors.white)),
          child: Text(
            AppLocalizations.of(context)!.mark_as_solved_button.toUpperCase(),
            // TODO: missing page and endpoints
            style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: theiaBrightPurple.withOpacity(0.5)),
          ),
        ),
        const SizedBox(
          height: 15,
        ),
      ],
    );
  }

  Widget getDeleteButton() {
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      ElevatedButton(
        onPressed: () =>
            {showCustomToast(AppLocalizations.of(context)!.coming_soon_title)},
        style: ButtonStyle(
            backgroundColor: WidgetStateProperty.all(Colors.white),
            surfaceTintColor: WidgetStateProperty.all(Colors.white)),
        child: Text(AppLocalizations.of(context)!.delete.toUpperCase(),
            // TODO: missing page and endpoints
            style:  TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: theiaBrightPurple.withOpacity(0.5))),
      ),
      const SizedBox(
        height: 15,
      ),
    ]);
  }

  Widget getButtons() {
    return Container(
      width: MediaQuery.of(context).size.width,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (widget.occurrence.occurrenceState == OccurrenceState.confirmed ||
              (widget.occurrence.occurrenceState == OccurrenceState.resolved) ||
              (widget.occurrence.occurrenceState == OccurrenceState.inRevision))
            getOtherImagesButton(),
          if (widget.occurrence.occurrenceState == OccurrenceState.confirmed)
            getPutUnderRevisionButton(),
          getVideoButton(),
          if (widget.occurrence.occurrenceState == OccurrenceState.unconfirmed)
            getEditAnnotationsButton(),
          if (widget.occurrence.occurrenceState == OccurrenceState.unconfirmed)
            getManualConfirmationButton(),
          if (widget.occurrence.occurrenceState == OccurrenceState.inRevision)
            getMarkAsSolvedButton(),
          if (widget.occurrence.occurrenceState == OccurrenceState.unconfirmed)
            getDeleteButton()
        ],
      ),
    );
  }

  Widget getImage() {
    return GestureDetector(
      onTap: () => {
        if (widget.occurrence.image != null)
          {
            Navigator.of(context)
                .pushNamed("/watch-occurrence", arguments: widget.occurrence)
          }
      },
      child: SizedBox(
        height: 210 * 16 / 9 - 20,
        child: Stack(children: [
          Center(
            child: Container(
              width: 210,
              decoration: BoxDecoration(
                  color: theiaAppBarGray,
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(color: Colors.white, width: 10)),
              child: ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Image.network(
                    replaceLocalhostWithNgrok(widget.occurrence.image!),
                    width: 210,
                    loadingBuilder: (BuildContext context, Widget child,
                        ImageChunkEvent? loadingProgress) {
                      if (loadingProgress == null) {
                        return child;
                      } else {
                        return SizedBox(
                          width: 210,
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
                    frameBuilder: (BuildContext context, Widget child,
                        int? frame, bool wasSynchronouslyLoaded) {
                      if (wasSynchronouslyLoaded || frame != null) {
                        return child;
                      } else {
                        return const SizedBox(
                          width: 210,
                          child: Center(
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
                        width: 210,
                      );
                    },
                  )),
            ),
          ),

          if (widget.occurrence.image != null)
            const Center(
                child: Icon(
                  Icons.circle,
                  color: theiaBrightPurple,
                  size: 100,
                )),
          if (widget.occurrence.image != null)
            const Center(
                child: Icon(
              Icons.zoom_out_map,
              color: Colors.white,
              size: 70,
            )),
          if (widget.occurrence.image == null)
            Center(
                child: SizedBox(
                    width: 190,
                    child: Text(
                      AppLocalizations.of(context)!.no_images_available,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                          shadows: [
                            Shadow(
                                offset: Offset(2.0, 2.0),
                                blurRadius: 15.0,
                                color: theiaBrightPurple),
                          ],
                          color: Colors.white),
                    )))
        ]),
      ),
    );
  }

  Widget getTopInfo() {
    return Container(
        height: 500,
        padding: const EdgeInsets.all(30),
        decoration: const BoxDecoration(
          color: theiaDarkPurple,
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(50)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            getImage(),
            const SizedBox(
              height: 10,
            ),
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  AppLocalizations.of(context)!.state,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold),
                ),
                Container(
                  width: 200,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
                  decoration: BoxDecoration(
                      color: OccurrenceState.getColor(
                          widget.occurrence.occurrenceState),
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(
                          color: OccurrenceState.getColor(
                                          widget.occurrence.occurrenceState) ==
                                      theiaAppBarGray ||
                                  OccurrenceState.getColor(
                                          widget.occurrence.occurrenceState) ==
                                      theiaGreen
                              ? theiaDarkPurple
                              : Colors.white,
                          width: 2)),
                  child: Text(
                    textAlign: TextAlign.center,
                    AppLocalizations.of(context)!.occurrence_state(
                        widget.occurrence.occurrenceState.toString()),
                    style: TextStyle(
                        color: OccurrenceState.getColor(
                                        widget.occurrence.occurrenceState) ==
                                    theiaAppBarGray ||
                                OccurrenceState.getColor(
                                        widget.occurrence.occurrenceState) ==
                                    theiaGreen
                            ? theiaDarkPurple
                            : Colors.white,
                        fontWeight: FontWeight.w700),
                  ),
                )
              ],
            ),
          ],
        ));
  }

  Widget getEvents() {
    return Container(
      width: MediaQuery.of(context).size.width - 40,
      decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(30))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 5),
            child: Text(AppLocalizations.of(context)!.events,
                style: const TextStyle(
                    color: theiaDarkPurple,
                    fontSize: 20,
                    fontWeight: FontWeight.w700)),
          ),
          Container(
            height: 3,
            color: theiaAppBarGray,
          ),
          Container(
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
              child: Text(AppLocalizations.of(context)!.no_events_available,
                  style: const TextStyle(
                      color: theiaAppBarGray,
                      fontSize: 14,
                      fontWeight: FontWeight.w700)))
        ],
      ),
    );
  }

  Widget getGeneralInfo() {
    return Container(
      width: MediaQuery.of(context).size.width - 40,
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.only(bottom: 20),
      decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.all(Radius.circular(30))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          getId(),
          const SizedBox(
            height: 10,
          ),
          getStartDate(),
          const SizedBox(
            height: 5,
          ),
          getLocalization(),
          const SizedBox(
            height: 5,
          ),
          getType()
        ],
      ),
    );
  }

  Widget getId() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "${AppLocalizations.of(context)!.id}: ",
          style: const TextStyle(
              color: theiaDarkPurple,
              fontSize: 20,
              fontWeight: FontWeight.w700),
        ),
        Expanded(
          child: Text(
            widget.occurrence.id,
            style: const TextStyle(
                color: theiaDarkPurple,
                fontSize: 20,
                fontWeight: FontWeight.w700),
            overflow: TextOverflow.visible,
            softWrap: true,
          ),
        ),
      ],
    );
  }

  Widget getLocalization() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Text(
          "${AppLocalizations.of(context)!.localization}: ",
          style: const TextStyle(
              color: theiaDarkPurple,
              fontSize: 14,
              fontWeight: FontWeight.w700),
        ),
        Text(
          widget.occurrence.location,
          style: const TextStyle(
              color: theiaAppBarGray,
              fontSize: 14,
              fontWeight: FontWeight.w700),
          overflow: TextOverflow.visible,
          softWrap: true,
        ),
      ],
    );
  }

  Widget getType() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Text(
          "${AppLocalizations.of(context)!.type}: ",
          style: const TextStyle(
              color: theiaDarkPurple,
              fontSize: 14,
              fontWeight: FontWeight.w700),
        ),
        Text(
          Provider.of<OccurrenceProvider>(context, listen: false)
              .getTypeFromId(widget.occurrence.occurrenceType),
          style: const TextStyle(
              color: theiaAppBarGray,
              fontSize: 14,
              fontWeight: FontWeight.w700),
          overflow: TextOverflow.visible,
          softWrap: true,
        ),
      ],
    );
  }

  Widget getStartDate() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "${AppLocalizations.of(context)!.start_date}: ",
          style: const TextStyle(
              color: theiaDarkPurple,
              fontSize: 14,
              fontWeight: FontWeight.w700),
        ),
        Expanded(
          child: Text(
            widget.occurrence.dateToString(),
            style: const TextStyle(
                color: theiaAppBarGray,
                fontSize: 14,
                fontWeight: FontWeight.w700),
            overflow: TextOverflow.visible,
            softWrap: true,
          ),
        ),
      ],
    );
  }
}
