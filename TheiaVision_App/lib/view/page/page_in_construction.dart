import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:theia/constants.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../component/bottom_bar.dart';
import '../component/top_bar.dart';

class PageInConstruction extends StatelessWidget {
  const PageInConstruction({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomBottomNavBar(body: getBody(context), currentIndex: -1);
  }

  Widget getBody(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(color: theiaAppBarGray),
      child: Column(
        children: [
          TopBar(text: AppLocalizations.of(context)!.coming_soon_title),
          Expanded(
            child: Container(
              margin: const EdgeInsets.all(20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(AppLocalizations.of(context)!.coming_soon_title,
                      style: const TextStyle(
                          color: theiaDarkPurple,
                          fontSize: 40,
                          fontWeight: FontWeight.bold)),
                  Text(AppLocalizations.of(context)!.coming_soon_message,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          color: theiaDarkPurple,
                          fontSize: 18,
                          fontWeight: FontWeight.bold))
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
