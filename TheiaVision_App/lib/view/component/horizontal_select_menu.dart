import 'package:flutter/material.dart';
import '../../constants.dart';

class HorizontalSelectMenu extends StatefulWidget {
  const HorizontalSelectMenu({super.key, required this.options, required this.onPressed});

  final List<String> options;
  final Function(String) onPressed;

  @override
  State<StatefulWidget> createState() {
    return _HorizontalSelectMenuState();
  }
}

class _HorizontalSelectMenuState extends State<HorizontalSelectMenu> {
  String currentSelected = "";

  @override
  void initState() {
    currentSelected = widget.options[0];
    super.initState();
  }

  @override
  Widget build(BuildContext context) {

      return Container(
        decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.all(Radius.circular(20))),
        width: MediaQuery.of(context).size.width - 40,
        height: 35,
        child:LayoutBuilder(
        builder: (context, constraints) => SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child:  ConstrainedBox(
              constraints: BoxConstraints(minWidth: constraints.maxWidth),
              child:
             Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: getButtons()),
          ),
        ),
      ));

  }

  List<Widget> getButtons() {
    List<Widget> buttons = [];

    for (var i = 0; i < widget.options.length; i++) {
      buttons.add(getButton(widget.options[i]));
      if (i < widget.options.length - 1) {
        buttons.add(
          Container(
            width: 1.5,
            color: theiaDarkPurple,
            margin: const EdgeInsets.fromLTRB(0, 8, 0, 8),
          ),
        );
      }
    }

    return buttons;
  }

  Widget getButton(String text) {
    return ElevatedButton(
      style: ButtonStyle(
        backgroundColor: WidgetStateProperty.all<Color>(Colors.transparent),
        shadowColor: WidgetStateProperty.all<Color>(Colors.transparent),
        foregroundColor: WidgetStateProperty.all<Color>(
            (text == currentSelected) ? theiaBrightPurple : theiaDarkPurple),
        surfaceTintColor: WidgetStateProperty.all<Color>(Colors.transparent),
      ),
      child: Text(
        text,
        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
      ),
      onPressed: () {
        setState(() {
          currentSelected = text;
        });
        widget.onPressed(text);
      },
    );
  }
}
