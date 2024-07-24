import 'package:flutter/material.dart';
import 'package:theia/constants.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class ListTitle extends StatefulWidget {
  const ListTitle({super.key, this.title = "", this.buttonPath = "", required this.cards, this.separators = false});

  final String title;
  final String buttonPath;
  final List<Widget> cards;
  final bool separators;

  @override
  State<StatefulWidget> createState() {
    return _ListTileState();
  }

}

class _ListTileState extends State<ListTitle> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width - 40,

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: getContent()
      ),
    );
  }

  List<Widget> getContent(){
    List<Widget> list = [];

    if (widget.title != "") {
      list.add(
        Container(
            margin: const EdgeInsets.all(15),
            child: (widget.buttonPath != "")
                ? Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [getTitle(), getButton()])
                : getTitle()),
      );
    }

    for (var card in widget.cards){
      if (widget.separators)list.add(Container(height: 3, color: theiaAppBarGray,));
      list.add(card);
    }

    if (widget.title == "" && widget.separators) {
      list.removeAt(0);
    }


    return list;


  }

  Widget getButton() {
    return SizedBox(
      height: 30,
      child: TextButton(
        onPressed: () {
          Navigator.of(context).pushNamed(widget.buttonPath);
        },
        child: Text(
          AppLocalizations.of(context)!.see_more_button,
          style: const TextStyle(
            color: theiaAppBarGray,
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }


  Widget getTitle() {
    return SizedBox( height:30,  child: Text(widget.title.toUpperCase(), style: const TextStyle(color: theiaDarkPurple, fontWeight: FontWeight.w700, fontSize: 18),));
  }


}