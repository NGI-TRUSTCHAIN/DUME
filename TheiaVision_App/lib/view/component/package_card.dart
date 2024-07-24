
import 'package:flutter/material.dart';
import 'package:theia/constants.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PackageCard extends StatelessWidget{
  const PackageCard({super.key, required this.color, required this.name, required this.date});

  final Color color;
  final String name;
  final String date;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(15),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,

        children: [
          Row(

            children: [
              Icon(Icons.circle, size: 20, color: color,),
              const SizedBox(width: 5,),
              Text(name, style: const TextStyle(color: theiaDarkPurple, fontSize: 18, fontWeight: FontWeight.w700),)
            ],
          ),

          Text("${AppLocalizations.of(context)!.invoiced_on}: $date", style: const TextStyle(color: theiaAppBarGray,fontSize: 15), textAlign: TextAlign.end,)

        ],

      )
    );
  }






}
