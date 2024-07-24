
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_svg/svg.dart';
import 'package:theia/constants.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'circular_checkbox.dart';

class TaskCard extends StatefulWidget{
  const TaskCard({super.key});

  @override
  State<StatefulWidget> createState() {
    return _TaskCard();
  }
}


class _TaskCard extends State<TaskCard>{

  bool value = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(15),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          getImage(),


          Column(
            mainAxisAlignment: MainAxisAlignment.center,
           crossAxisAlignment: CrossAxisAlignment.start,
           children: [
             getId(),
             getEventType(),
             getLocalization()
           ],
      
          ),

          CircularCheckbox(value: value, onChanged: (val) {
            setState(() {
              value = val;
            });

          })
      
        ],
      
      
      ),
    );
  }

  Widget getId(){
    return Row(
      children: [Text("${AppLocalizations.of(context)!.id}: ", style: TextStyle(color: value ? theiaDarkPurple : theiaAppBarGray, fontSize: 20, fontWeight: FontWeight.w700),),Text("jsajsjask", style: TextStyle(color: value ? theiaDarkPurple : theiaAppBarGray, fontSize: 20, fontWeight: FontWeight.w700))],
    );

  }


  Widget getLocalization(){
    return Row(
      children: [Text("${AppLocalizations.of(context)!.localization}: ", style: const TextStyle(color: theiaAppBarGray, fontSize: 12, fontWeight: FontWeight.w700),),const Text("jsajsjask", style: TextStyle(color: theiaAppBarGray, fontSize: 12, fontWeight: FontWeight.w700))],
    );


  }

  Widget getEventType(){

    return Row(
      children: [Text("${AppLocalizations.of(context)!.type_of_event}: ", style: const TextStyle(color: theiaAppBarGray, fontSize: 12, fontWeight: FontWeight.w700),),const Text("jsajsjask", style: TextStyle(color: theiaAppBarGray, fontSize: 12, fontWeight: FontWeight.w700))],
    );
  }

  Widget getImage(){

    return ClipRRect(

      borderRadius: BorderRadius.circular(10), // Adjust the radius as needed
      child: SvgPicture.asset(
        "assets/img_placeholder_9x16.svg",
        width: 80,
      ),
    );

  }





}