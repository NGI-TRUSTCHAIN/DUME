import 'package:flag/flag_enum.dart';
import 'package:flag/flag_widget.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../controller/provider/language_provider.dart';
import '../../utils.dart';
import '../component/top_bar_login.dart';
import '../../constants.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class LanguagePage extends StatefulWidget {
  const LanguagePage({super.key});

  @override
  State<StatefulWidget> createState() {
    return _LanguagePageState();
  }
}

class _LanguagePageState extends State<LanguagePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: double.infinity,
        width: MediaQuery.of(context).size.width,
        decoration: getBackgroundImage(),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Column(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.start, children: [
                const TopBarLogin(
                  backButton: false,
                  backPage: "/language",
                ),
                getChangeLanguage()
              ]),
            ),
            getButton()
          ],
        ),
      ),
    );
  }

  Widget getChangeLanguage() {
    return Container(
      margin: const EdgeInsets.all(55),

      child: Column(

        children: [
          getLogo(context),
          const SizedBox(height: 50),

          SizedBox(height: 50,
            child: Text(
              AppLocalizations.of(context)!.choose_lang.toUpperCase(),
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 4),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 50),


            Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
              getPortugueseFlag(),
              getEnglishFlag(),
            ]),

        ],
      ),
    );
  }

  Widget getButton() {
    return Container(
      margin: const EdgeInsets.all(25),
      width: double.infinity,
      child: ElevatedButton(
          onPressed: () {
            Navigator.of(context).pushNamed("/login");
          },
          child: Text(
            AppLocalizations.of(context)!.continue_word.toUpperCase(),
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
          )),
    );
  }

  Widget getPortugueseFlag() {
    return Container(
      padding: EdgeInsets.zero,
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
              color: context
                          .read<LanguageChangeProvider>()
                          .getCurrentLocaleCode() ==
                      "pt"
                  ? theiaBrightPurple
                  : Colors.transparent,
              width: 10)),
      child: IconButton(
          onPressed: () {
            context.read<LanguageChangeProvider>().changeLocale("pt",context);
            setState(() {});
          },
          icon: Flag.fromCode(
            FlagsCode.PT,
            flagSize: FlagSize.size_4x3,
            width: 100,
            height: 70,
          )),
    );
  }

  Widget getEnglishFlag() {
    return Container(
      padding: EdgeInsets.zero,
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color:
                context.read<LanguageChangeProvider>().getCurrentLocaleCode() ==
                        "en"
                    ? theiaBrightPurple
                    : Colors.transparent,
            width: 10,
          )),
      child: IconButton(
          onPressed: () {
            context.read<LanguageChangeProvider>().changeLocale("en",context);
            setState(() {});
          },
          icon: Flag.fromCode(
            FlagsCode.US,
            flagSize: FlagSize.size_4x3,
            width: 100,
            height: 70,
          )),
    );
  }
}
