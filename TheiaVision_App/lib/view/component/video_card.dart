import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';
import 'package:theia/constants.dart';
import 'package:theia/model/upload_state.dart';

import '../../model/video.dart';
import '../../utils.dart';

class VideoCard extends StatefulWidget {
  final Video video;

  const VideoCard({super.key, required this.video});

  @override
  State<StatefulWidget> createState() {
    return _VideoCard();
  }
}

class _VideoCard extends State<VideoCard> {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(15),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
              margin: const EdgeInsets.fromLTRB(0, 15, 0, 0),
              child: ClipRRect(
                  borderRadius: BorderRadius.circular(10), child: getImage(80,widget.video, 0,
                  context,null))),
          const SizedBox(
            width: 15,
          ),
          Expanded(
            child: Container(
              margin: const EdgeInsets.fromLTRB(0, 10, 0, 0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  getId(),
                  getOrigin(),
                  getDate(),
                  getLocalization(),
                  getUploadState()
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget getUploadState() {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(
        "${AppLocalizations.of(context)!.uploadState}: ",
        style: const TextStyle(
            color: theiaDarkPurple, fontSize: 12, fontWeight: FontWeight.w700),
      ),
      if (widget.video.uploadState != UploadState.uploading)
        Text(widget.video.uploadState.localizedDescription(context),
            style: const TextStyle(
                color: theiaAppBarGray,
                fontSize: 12,
                fontWeight: FontWeight.w700)),
      if (widget.video.uploadState == UploadState.uploading)
        Text(
            "${widget.video.uploadState.localizedDescription(context)} ${widget.video.uploadedSize == null || widget.video.totalSize == null ? "- ${AppLocalizations.of(context)!.preparing_video_upload}" : "${widget.video.receivedFrames}/${widget.video.totalFrames}"}",
            style: const TextStyle(
                color: theiaAppBarGray,
                fontSize: 12,
                fontWeight: FontWeight.w700)),
      const SizedBox(
        height: 5,
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
    ]);
  }

  Widget getButton() {
    return SvgPicture.asset(
      "assets/icons/icon_plus.svg",
      colorFilter: const ColorFilter.mode(theiaBrightPurple, BlendMode.srcATop),
      width: 30,
    );
  }

  Widget getId() {
    return Row(
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
            overflow: TextOverflow.ellipsis,
            softWrap: true,
          ),
        ),
      ],
    );
  }

  Widget getLocalization() {
    return Row(
      children: [
        Text(
          "${AppLocalizations.of(context)!.localization}: ",
          style: const TextStyle(
              color: theiaDarkPurple,
              fontSize: 12,
              fontWeight: FontWeight.w700),
        ),
        Expanded(
          child: Text(
            widget.video.location,
            style: const TextStyle(
                color: theiaAppBarGray,
                fontSize: 12,
                fontWeight: FontWeight.w700),
            overflow: TextOverflow.ellipsis,
            softWrap: true,
          ),
        ),
      ],
    );
  }

  Widget getOrigin() {
    return Row(
      children: [
        Text(
          "${AppLocalizations.of(context)!.origin}: ",
          style: const TextStyle(
              color: theiaDarkPurple,
              fontSize: 12,
              fontWeight: FontWeight.w700),
        ),
        Expanded(
          child: Text(
            widget.video.origin,
            style: const TextStyle(
                color: theiaAppBarGray,
                fontSize: 12,
                fontWeight: FontWeight.w700),
            overflow: TextOverflow.ellipsis,
            softWrap: true,
          ),
        ),
      ],
    );
  }

  Widget getDate() {
    return Row(
      children: [
        Text(
          "${AppLocalizations.of(context)!.date}: ",
          style: const TextStyle(
              color: theiaDarkPurple,
              fontSize: 12,
              fontWeight: FontWeight.w700),
        ),
        Expanded(
          child: Text(
            widget.video.startDateToString(),
            style: const TextStyle(
                color: theiaAppBarGray,
                fontSize: 12,
                fontWeight: FontWeight.w700),
            overflow: TextOverflow.ellipsis,
            softWrap: true,
          ),
        ),
      ],
    );
  }

}
