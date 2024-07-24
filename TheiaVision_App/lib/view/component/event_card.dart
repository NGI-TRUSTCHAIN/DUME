import 'package:flutter/cupertino.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:theia/constants.dart';

import '../../model/event.dart';

class EventCard extends StatelessWidget{



  final Event event;

  const EventCard({super.key, required this.event});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          getImage(),
          const SizedBox(width: 20,),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(event.name, style: const TextStyle(color: theiaDarkPurple, fontSize: 20, fontWeight: FontWeight.bold),),
              Text(event.timestamp,  style: const TextStyle(color: theiaAppBarGray, fontSize: 18))

            ],
          )



        ],
      ),
    );
  }

  getImage(){

    return ClipRRect(
      borderRadius: BorderRadius.circular(10),
      // Adjust the radius as needed
      child: SvgPicture.asset(
        pathImagePlaceHolder,
        width: 80,
      ),
    );

  }


}