import 'package:flutter/material.dart';

const theiaBrightPurple = Color.fromRGBO(152, 75, 255, 1);
const theiaBrightPurpleOpacityDown = Color.fromRGBO(
    152, 75, 255,0.5);

const theiaDarkPurple = Color.fromRGBO(30, 0, 80, 1);
const theiaAppBarGray = Color.fromRGBO(216, 213, 226, 1);
const theiaGreen = Color.fromRGBO(81, 206, 146, 1);

var customTheme = ThemeData(
  fontFamily: 'Montserrat',
  colorScheme: ColorScheme.fromSeed(seedColor: theiaBrightPurple),
  inputDecorationTheme: const InputDecorationTheme(
    enabledBorder: UnderlineInputBorder(
      borderSide: BorderSide(color: Colors.white, width: 1),
    ),
    labelStyle: TextStyle(
        color: Colors.white, fontSize: 15, fontWeight: FontWeight.w500),
  ),
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: Colors.white,
      textStyle: const TextStyle(fontSize: 12),
    ),
  ),
  useMaterial3: true,
);

final passwordRegExp = RegExp(
  r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$',
);

final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
    caseSensitive: false, multiLine: false);

const pathImagePlaceHolder = "assets/img_placeholder_9x16.svg";
const pfPicPlaceHolder = "assets/icons/img_user.svg";
const editIcon = "assets/icons/icon_edit.svg";
