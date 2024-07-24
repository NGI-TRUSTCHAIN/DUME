import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:theia/constants.dart';

class CustomPasswordFormField extends StatefulWidget {
  const CustomPasswordFormField(
      {super.key, required this.text, this.mandatory = false, required this.controller, this.color = Colors.white});

  final String text;
  final bool mandatory;
  final TextEditingController controller;
  final Color color;

  @override
  State<StatefulWidget> createState() {
    return _CustomPasswordFormField();
  }
}

class _CustomPasswordFormField extends State<CustomPasswordFormField> {
  var _isObscured = true;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
        obscureText: _isObscured,
        enableSuggestions: false,
        autocorrect: false,
        controller: widget.controller,
        style: TextStyle(color: widget.color),
        decoration: InputDecoration(
            enabledBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: widget.color), // Customize enabled underline color
            ),
            focusedBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: widget.color, width: 2.0), // Customize focused underline color
            ),
            label: widget.mandatory
                ? RichText(
                    text: TextSpan(
                      text: widget.text,
                      style: TextStyle(
                          color: widget.color,
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          fontFamily: "Montserrat"),
                      children: const <TextSpan>[
                        TextSpan(
                          text: ' *',
                          style: TextStyle(
                              color: theiaBrightPurple,
                              fontSize: 15,
                              fontWeight: FontWeight.w500,
                              fontFamily: "Montserrat"),
                        ),
                      ],
                    ),
                  )
                : Text(widget.text, style: TextStyle(
                color: widget.color,
                fontSize: 15,
                fontWeight: FontWeight.w500,
                fontFamily: "Montserrat") ),
            suffixIcon: IconButton(
                onPressed: () {
                  setState(() {
                    _isObscured = !_isObscured;
                  });
                },
                icon: _isObscured
                    ? SvgPicture.asset("assets/icons/icon_eye_open.svg", colorFilter: ColorFilter.mode(widget.color,BlendMode.srcATop),)
                    : SvgPicture.asset("assets/icons/icon_eye_closed.svg",colorFilter: ColorFilter.mode(widget.color,BlendMode.srcATop)))));
  }
}
