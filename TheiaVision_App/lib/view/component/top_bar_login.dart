import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class TopBarLogin extends StatelessWidget {
  final bool backButton;

  final String backPage;

  const TopBarLogin(
      {super.key, required this.backButton, required this.backPage});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(4, 0, 4, 0),
      height: 80,
      decoration: const BoxDecoration(
          border: Border(
        bottom: BorderSide(width: 1, color: Colors.white),
      )),
      child: Row(
        mainAxisAlignment:
            backButton ? MainAxisAlignment.spaceBetween : MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (backButton)
            IconButton(
              onPressed: () {
                Navigator.of(context).pushNamed(backPage);
              },
              icon: SvgPicture.asset("assets/icons/icon_back.svg", colorFilter: const ColorFilter.mode(Colors.white,BlendMode.srcATop)),
              color: Colors.white,
            ),
          IconButton(
              onPressed: () {},
              icon: SvgPicture.asset("assets/icons/icon_3dots.svg", colorFilter: const ColorFilter.mode(Colors.white,BlendMode.srcATop)),
              color: Colors.white)
        ],
      ),
    );
  }
}
