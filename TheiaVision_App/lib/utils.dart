import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:geocoding/geocoding.dart';
import 'package:provider/provider.dart';
import 'package:theia/controller/provider/user_provider.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import 'constants.dart';
import 'controller/provider/video_provider.dart';
import 'model/custom_image.dart';
import 'model/upload_state.dart';
import 'model/video.dart';

Widget getLogo(BuildContext context) {
  return AnimatedContainer(
    duration: const Duration(milliseconds: 200),
    curve: Curves.easeInOut,
    child: Container(
      margin: MediaQuery.of(context).viewInsets.bottom == 0
          ? const EdgeInsets.only(bottom: 50)
          : const EdgeInsets.all(0),
      height: MediaQuery.of(context).viewInsets.bottom == 0 ? 60 : 0,
      width: 300,
      child: SvgPicture.asset(
        "assets/logos/theia_logo1.svg",
        fit: BoxFit.contain,
        colorFilter:
            const ColorFilter.mode(theiaBrightPurple, BlendMode.srcATop),
      ),
    ),
  );
}

DateTime parseDate(String dateString) {
  // Add 'Z' if it's missing to indicate UTC

  log(dateString);

  if (!dateString.endsWith('Z') && !dateString.contains('T00:00:00')) {
    dateString += 'Z';
  }
  return DateTime.parse(dateString);
}

void showCustomToast(String message) {
  Fluttertoast.cancel();
  Fluttertoast.showToast(
    msg: message,
    toastLength: Toast.LENGTH_LONG,
    gravity: ToastGravity.TOP,
    timeInSecForIosWeb: 1,
    backgroundColor: Colors.white,
    textColor: theiaBrightPurple,
    fontSize: 16.0,
  );
}

Future<String> getAddress(double lat, double long) async {
  List<Placemark> place = await placemarkFromCoordinates(lat, long);
  Placemark placemark = place.first;

  // Create a list to hold address components
  List<String> addressComponents = [];

  // Add components only if they are not empty
  if (placemark.name?.isNotEmpty ?? false) {
    addressComponents.add(placemark.name!);
  }
  if (placemark.street?.isNotEmpty ?? false) {
    addressComponents.add(placemark.street!);
  }
  if (placemark.subLocality?.isNotEmpty ?? false) {
    addressComponents.add(placemark.subLocality!);
  }
  if (placemark.locality?.isNotEmpty ?? false) {
    addressComponents.add(placemark.locality!);
  }
  if (placemark.subAdministrativeArea?.isNotEmpty ?? false) {
    addressComponents.add(placemark.subAdministrativeArea!);
  }
  if (placemark.administrativeArea?.isNotEmpty ?? false) {
    addressComponents.add(placemark.administrativeArea!);
  }
  if (placemark.postalCode?.isNotEmpty ?? false) {
    addressComponents.add(placemark.postalCode!);
  }
  if (placemark.country?.isNotEmpty ?? false) {
    addressComponents.add(placemark.country!);
  }

  // Join the non-empty components with a comma and a space
  var location = addressComponents.join(', ');

  return location;
}


logOut(BuildContext context) {
  Provider.of<UserProvider>(context, listen: false).logout().then((val) {
    showCustomToast(AppLocalizations.of(context)!.session_expired_toast);
    Navigator.pushNamed(context, "/login");
  });
}

BoxDecoration getBackgroundImage() {
  return const BoxDecoration(
      image: DecorationImage(
          image: AssetImage("assets/theia_background.png"), fit: BoxFit.fill));
}

String replaceLocalhostWithNgrok(String url) {
  // Define the original localhost URL and the ngrok URL
  const String localhost = 'localhost:3000';
  const String ngrokUrl = 'f675d8bd575f54b3439c221af95aab70.serveo.net';

  // Replace the localhost part with the ngrok URL
  String updatedUrl = url.replaceFirst(localhost, ngrokUrl);


  // Add https protocol
  if (!updatedUrl.startsWith('https://')) {
    updatedUrl = 'https://$updatedUrl';
  }

  return updatedUrl;
}

Widget getNetworkImage(double width, double height, int index, List<CustomImage> images) {

  return Image.network(
    images[index].url,
    width: width,
    height: height,
    loadingBuilder:
        (BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
      if (loadingProgress == null) {
        return child;
      } else {
        return SizedBox(
          width: width,
          height: height,
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
          width: width,
          height: height,
          child: const Center(
            child: CircularProgressIndicator(
              color: theiaBrightPurple,
            ),
          ),
        );
      }
    },
    errorBuilder: (context, error, stackTrace) {
      return SvgPicture.asset(
        pathImagePlaceHolder,
        width: width,
        height: height,
      );
    },
  );
}

Widget getOccurrenceImages(double width, List<CustomImage> images, int index,
BuildContext context){

  var height = width * 16 / 9;

  if (images.isEmpty){
    return SvgPicture.asset(
      pathImagePlaceHolder,
      width: width,
      height: height,
    );
  }


  return getNetworkImage(width, height, index, images);


}

Widget getImage(double width, Video video, int index,
    BuildContext context, Function()? setState) {

  var height = width * 16 / 9;

  if(video.uploadState != UploadState.uploaded){
    return SvgPicture.asset(
      pathImagePlaceHolder,
      width: width,
      height: height,
    );
  }

  if (video.images.isEmpty && video.uploadState == UploadState.uploaded) {
    return getImages(width, height, context, video, index,setState);
  }

  if (video.images.isEmpty){
    return SvgPicture.asset(
      pathImagePlaceHolder,
      width: width,
      height: height,
    );
  }



  return getNetworkImage(width, height, index, video.images);
}

getImages(double width, double height, BuildContext context, Video video,
    int index, Function()? setState) {
  return FutureBuilder(
      future: Provider.of<VideoProvider>(context, listen: false).getFrames(
        video.id,
        Provider.of<UserProvider>(context, listen: false).token!,
        context,
      ),
      builder:
          (BuildContext context, AsyncSnapshot<List<CustomImage>> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return SizedBox(
            width: width,
            height: height,
            child: const Center(
              child: CircularProgressIndicator(
                color: theiaBrightPurple,
              ),
            ),
          );
        }

        if (snapshot.connectionState == ConnectionState.done) {
          if (video.images.isEmpty) {
            video.images = snapshot.data ?? [];
            if (video.images.isEmpty) {
              return SvgPicture.asset(
                pathImagePlaceHolder,
                width: width,
                height: height,
              );
            }

            if (setState != null){
              setState();
            }

            return getNetworkImage(width, height, index,video.images);
          }
        }

        return SvgPicture.asset(
          pathImagePlaceHolder,
          width: width,
          height: height,
        );
      });
}
