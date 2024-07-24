import 'package:flutter/material.dart';

import '../../constants.dart';

class CustomFormField extends StatefulWidget {
  const CustomFormField(
      {super.key,
      required this.text,
      required this.keyboardType,
      this.mandatory = false,
      required this.controller});

  final TextEditingController controller;
  final String text;
  final TextInputType keyboardType;
  final bool mandatory;

  @override
  State<StatefulWidget> createState() {
    return _CustomFormFieldState();
  }
}

class _CustomFormFieldState extends State<CustomFormField> {
  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      enableSuggestions: true,
      autocorrect: true,
      keyboardType: widget.keyboardType,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        label: widget.mandatory
            ? RichText(
                text: TextSpan(
                  text: widget.text,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      fontFamily: "Montserrat",
                      ),
                  children: const <TextSpan>[
                    TextSpan(
                      text: '*',
                      style: TextStyle(
                          color: theiaBrightPurple,
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          fontFamily: "Montserrat",
                          ),
                    ),
                  ],
                ),
              )
            : Text(widget.text),
      ),
    );
  }
}
