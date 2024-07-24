


import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:provider/provider.dart';

import '../../constants.dart';
import '../../controller/provider/user_provider.dart';
import '../../controller/provider/video_provider.dart';
import '../../model/button_info.dart';
import '../../model/loading_state.dart';
import '../../model/upload_state.dart';
import '../../model/video.dart';
import '../../utils.dart';
import '../component/bottom_bar.dart';
import '../component/event_card.dart';
import '../component/top_bar.dart';
import '../component/warning_popup.dart';

class VideoPage extends StatefulWidget {
  VideoPage({super.key, required this.video});

  Video video;

  @override
  State<StatefulWidget> createState() {
    return _VideoPageState();
  }
}

class _VideoPageState extends State<VideoPage> {
  late VideoProvider _videoProvider;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Safely access the provider
    _videoProvider = Provider.of<VideoProvider>(context, listen: false);

    _videoProvider.onChangeItemUploadState = onChangeItemUploadState;
    _videoProvider.onChangeItemUploadStateSize = onChangeItemUploadStateSize;
    _videoProvider.onChangeItemRemove = onChangeItemRemove;
    _videoProvider.onChangeUploadedFrames = onChangeUploadedFrames;
  }

  @override
  void dispose() {
    _videoProvider.onChangeItemUploadState = null;
    _videoProvider.onChangeItemUploadStateSize = null;
    _videoProvider.onChangeItemRemove = null;
    _videoProvider.onChangeUploadedFrames = null;

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CustomBottomNavBar(body: getBody(), currentIndex: 1);
  }

  onChangeItemUploadStateSize(String id, int? totalSize, int uploadedSize) {
    if (widget.video.id == id) {
      if (totalSize != null) {
        setState(() {
          widget.video.totalSize = totalSize;
        });
      }
      if (widget.video.uploadedSize != null) {
        setState(() {
          widget.video.uploadedSize = uploadedSize;
        });
      } else {
        setState(() {
          widget.video.uploadedSize = uploadedSize;
        });
      }
    }
  }

  onChangeItemUploadState(String id, UploadState newUploadState) {
    if (widget.video.id == id) {
      setState(() {
        widget.video.uploadState = newUploadState;
      });
    }
  }

  onChangeUploadedFrames(String id, int frames) {
    if (widget.video.id == id) {
      setState(() {
        widget.video.receivedFrames = frames;
      });
    }
  }

  onChangeItemRemove(String id) {
    if (widget.video.id == id) {
      showCustomToast(AppLocalizations.of(context)!.sync_video);
      Navigator.of(context).pushNamed("/videos");
    }
  }

  Widget getBody() {
    return Container(
      decoration: const BoxDecoration(color: theiaAppBarGray),
      child: Column(
        children: [
          TopBar(
            backButton: true,
            backPage: '/videos',
            text: AppLocalizations.of(context)!.videos,
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  getTopInfo(),
                  if (widget.video.uploadState != UploadState.uploading)
                    getButtons(),
                  if (widget.video.uploadState == UploadState.uploading)
                    const SizedBox(
                      height: 20,
                    ),
                  getGeneralInfo(),
                  getEvents()
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget getButtons() {
    return Container(
      width: MediaQuery.of(context).size.width,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (widget.video.uploadState == UploadState.uploaded)
            ElevatedButton(
              onPressed: () => {

                Navigator.of(context).pushNamed("/video-map",arguments: widget.video)
              },
              style: ButtonStyle(
                  backgroundColor: WidgetStateProperty.all(Colors.white),
                  surfaceTintColor: WidgetStateProperty.all(Colors.white)),
              child: Text(AppLocalizations.of(context)!.see_map.toUpperCase(),
                  style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: theiaBrightPurple)),
            ),
          if (widget.video.uploadState == UploadState.uploaded)
            const SizedBox(
              height: 15,
            ),
          if (widget.video.uploadState == UploadState.uploaded)
            ElevatedButton(
              onPressed: () => {
                showCustomToast(AppLocalizations.of(context)!.coming_soon_title)


              },
              style: ButtonStyle(
                  backgroundColor: WidgetStateProperty.all(Colors.white),
                  surfaceTintColor: WidgetStateProperty.all(Colors.white)),
              child: Text(AppLocalizations.of(context)!.annotate.toUpperCase(),
                  style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: theiaBrightPurple.withOpacity(0.5))),
            ),
          const SizedBox(
            height: 15,
          ),
          ElevatedButton(
              style: ButtonStyle(
                  backgroundColor: WidgetStateProperty.all(theiaBrightPurple),
                  surfaceTintColor: WidgetStateProperty.all(theiaBrightPurple),
                  foregroundColor: WidgetStateProperty.all(Colors.white)),
              onPressed: () => {
                    if (widget.video.uploadState == UploadState.waiting)
                      {showDeleteWaitingVideoPopUp()}
                    else if (widget.video.uploadState == UploadState.uploaded)
                      {showDeleteUploadedVideoPopUp()}
                  },
              child: Text(
                AppLocalizations.of(context)!.delete.toUpperCase(),
                style:
                    const TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
              )),
        ],
      ),
    );
  }

  showDeleteWaitingVideoPopUp() {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return WarningPopup(
            title: AppLocalizations.of(context)!.delete_video,
            text: AppLocalizations.of(context)!.local_video_delete,
            buttonAccept: ButtonInfo(
                AppLocalizations.of(context)!.confirm, deleteLocalVideo),
            buttonCancel: ButtonInfo(AppLocalizations.of(context)!.cancel,
                () => {Navigator.of(context).pop()}),
            isLoading: context.watch<VideoProvider>().deleteState ==
                LoadingState.loading,
          );
        });
  }

  showDeleteUploadedVideoPopUp() {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return WarningPopup(
            title: AppLocalizations.of(context)!.delete_video,
            text: AppLocalizations.of(context)!.server_video_delete,
            buttonAccept: ButtonInfo(
                AppLocalizations.of(context)!.confirm, deleteUploadedVideo),
            buttonCancel: ButtonInfo(AppLocalizations.of(context)!.cancel,
                () => {Navigator.of(context).pop()}),
            isLoading: context.watch<VideoProvider>().deleteState ==
                LoadingState.loading,
          );
        });
  }

  deleteLocalVideo() {
    Provider.of<VideoProvider>(context, listen: false)
        .deleteVideoLocal(widget.video.id, context)
        .then((value) {
      if (Provider.of<VideoProvider>(context, listen: false).deleteState ==
          LoadingState.finished) {
        showCustomToast(AppLocalizations.of(context)!.delete_success);
        Navigator.of(context).pop();
        Navigator.pushNamed(context, "/videos");
      } else if (Provider.of<VideoProvider>(context, listen: false)
              .deleteState ==
          LoadingState.error) {
        showCustomToast(
            Provider.of<VideoProvider>(context, listen: false).errorMessage);
        Navigator.of(context).pop();
        if (Provider.of<VideoProvider>(context, listen: false).errorMessage ==
            AppLocalizations.of(context)!.error_uploading) {
          setState(() {
            widget.video.uploadState = UploadState.uploading;
          });
        }

        if (Provider.of<VideoProvider>(context, listen: false).errorMessage ==
            AppLocalizations.of(context)!.error_uploaded) {
          Navigator.pushNamed(context, "/videos");
        }
      }
    });
  }

  void reload(){
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        setState(() {});
      }});
  }

  deleteUploadedVideo() {
    Provider.of<VideoProvider>(context, listen: false)
        .deleteVideo(widget.video.id,
            Provider.of<UserProvider>(context, listen: false).token!, context)
        .then((value) {
      if (Provider.of<VideoProvider>(context, listen: false).deleteState ==
          LoadingState.finished) {
        showCustomToast(AppLocalizations.of(context)!.delete_success);
        Navigator.of(context).pop();
        Navigator.pushNamed(context, "/videos");
      } else if (Provider.of<VideoProvider>(context, listen: false)
              .deleteState ==
          LoadingState.error) {
        showCustomToast(
            Provider.of<VideoProvider>(context, listen: false).errorMessage);
      }
    });

    Navigator.of(context).pop();
  }

  Widget getImageTop() {
    return GestureDetector(
      onTap: () => {
        if (widget.video.images.isNotEmpty)
          {
            Navigator.of(context)
                .pushNamed("/watch-video", arguments: widget.video)
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
                  // Adjust the radius as needed
                  border: Border.all(color: Colors.white, width: 10)),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10),
                // Adjust the radius as needed
                child: getImage(201,widget.video,  0,
                    context,reload),
              ),
            ),
          ),
          if (widget.video.images.isNotEmpty)
            const Center(
                child: Icon(
              Icons.circle,
              color: Colors.white,
              size: 50,
            )),
          if (widget.video.images.isNotEmpty)
            const Center(
                child: Icon(
              Icons.play_circle,
              color: theiaBrightPurple,
              size: 100,
            )),
          if (widget.video.images.isEmpty)
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
        height: 600,
        padding: const EdgeInsets.all(30),
        decoration: const BoxDecoration(
          color: theiaDarkPurple,
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(50)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            getImageTop(),
            const SizedBox(
              height: 10,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [

                Text(
                  "${AppLocalizations.of(context)!.frame_in_server}:",
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold),
                ),
                Row(
                  children: [

                    Text(
                        "${widget.video.receivedFrames}/${widget.video.totalFrames}",
                        style: const TextStyle(color: Colors.white, fontSize: 18)),
                    if(widget.video.totalFrames == 1)
                      const SizedBox(width: 5,),
                      if(widget.video.totalFrames == 1)
                       Tooltip(
                         showDuration: const Duration(seconds: 2),
                        triggerMode: TooltipTriggerMode.tap,
                        message: AppLocalizations.of(context)!.pic_video,
                        child: const Icon(Icons.help, color: Colors.white,),
                      ),
                  ],
                )

              ],
            ),
            const SizedBox(
              height: 10,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  AppLocalizations.of(context)!.uploadState,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold),
                ),
                Text(widget.video.uploadState.localizedDescription(context),
                    style: const TextStyle(color: Colors.white, fontSize: 18))
              ],
            ),
            if (widget.video.uploadState == UploadState.uploading)
              const SizedBox(
                height: 10,
              ),
            if (widget.video.uploadState == UploadState.uploading)
              SizedBox(
                height: 10,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(100),
                  child: LinearProgressIndicator(
                    backgroundColor: theiaAppBarGray,
                    color: theiaBrightPurple,
                    value: widget.video.uploadedSize == null ||
                            widget.video.totalSize == null
                        ? null
                        : (widget.video.uploadedSize!.toDouble() /
                            widget.video.totalSize!.toDouble()),
                  ),
                ),
              ),
          ],
        ));
  }

  /*
  *      if (widget.video.events.isNotEmpty)
            ListView.builder(
              itemCount: widget.video.events.length,
              itemBuilder: (context, index) {
                return EventCard(event: widget.video.events[index]);
              },
            ),
  *
  * */

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
            child: Text("${AppLocalizations.of(context)!.events}:",
                style: const TextStyle(
                    color: theiaDarkPurple,
                    fontSize: 20,
                    fontWeight: FontWeight.w700)),
          ),
          Container(
            height: 3,
            color: theiaAppBarGray,
          ),
          if (widget.video.events.isNotEmpty)
            Column(
              children: getEventCards(),
            ),
          if (widget.video.events.isEmpty)
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

  List<Widget> getEventCards() {
    List<Widget> list = [];

    for (var event in widget.video.events) {
      list.add(EventCard(event: event));
      list.add(Container(
        height: 3,
        color: theiaAppBarGray,
      ));
    }

    list.removeLast();

    return list;
  }

  Widget getGeneralInfo() {
    return Container(
      width: MediaQuery.of(context).size.width - 40,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(30))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          getId(),
          const SizedBox(
            height: 10,
          ),
          getOrigin(),
          const SizedBox(
            height: 5,
          ),
          getStartDate(),
          const SizedBox(
            height: 5,
          ),
          getEndDate(),
          const SizedBox(
            height: 5,
          ),
          getLocalization(),
          const SizedBox(
            height: 5,
          ),
          getDistanceTravelled()
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
            widget.video.id,
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
          widget.video.location,
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

  Widget getOrigin() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "${AppLocalizations.of(context)!.origin}: ",
          style: const TextStyle(
              color: theiaDarkPurple,
              fontSize: 14,
              fontWeight: FontWeight.w700),
        ),
        Expanded(
          child: Text(
            widget.video.origin,
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

  Widget getDistanceTravelled() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
         Text(
          "${AppLocalizations.of(context)!.distance_travelled}: ",
          style: const TextStyle(
              color: theiaDarkPurple,
              fontSize: 14,
              fontWeight: FontWeight.w700),
        ),
        Expanded(
          child: Text(
            "${widget.video.distanceTravelled} m",
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
            widget.video.startDateToString(),
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

  Widget getEndDate() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "${AppLocalizations.of(context)!.end_date}: ",
          style: const TextStyle(
              color: theiaDarkPurple,
              fontSize: 14,
              fontWeight: FontWeight.w700),
        ),
        Expanded(
          child: Text(
            widget.video.endDateToString(),
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
