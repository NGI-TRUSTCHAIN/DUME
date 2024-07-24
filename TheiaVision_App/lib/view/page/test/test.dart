import 'dart:async';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:path_provider/path_provider.dart';
import 'package:provider/provider.dart';
import 'package:theia/controller/provider/language_provider.dart';
import 'package:theia/controller/provider/test_provider.dart';
import 'package:theia/view/page/test/pdf.dart';
import 'package:workmanager/workmanager.dart';

import '../map.dart';

class TestPage extends StatefulWidget {
  const TestPage({super.key});
  @override
  State<StatefulWidget> createState() {
    return _TestPage();
  }
}

class _TestPage extends State<TestPage> {

  late TextEditingController testController = TextEditingController();

  late Future<String> _fetchResult = Future.value("");

  late int num = 0;

  String remotePDFpath = "";

  @override
  void initState() {
    super.initState();
    createFileOfPdfUrl().then((f) {
      setState(() {
        remotePDFpath = f.path;
      });
    }
    );


  }


  Future<File> createFileOfPdfUrl() async {
    Completer<File> completer = Completer();
    print("Start download file from internet!");
    try {
      const url = "http://www.pdf995.com/samples/pdf.pdf";
      final filename = url.substring(url.lastIndexOf("/") + 1);
      var request = await HttpClient().getUrl(Uri.parse(url));
      var response = await request.close();
      var bytes = await consolidateHttpClientResponseBytes(response);
      var dir = await getApplicationDocumentsDirectory();
      print("Download files");
      print("${dir.path}/$filename");
      File file = File("${dir.path}/$filename");

      await file.writeAsBytes(bytes, flush: true);
      completer.complete(file);
    } catch (e) {
      throw Exception('Error parsing asset file!');
    }

    return completer.future;
  }




  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.test_page_title,
        style: const TextStyle(color: Colors.white),),
        backgroundColor: Theme.of(context).primaryColor,

      ),
      body: Container(
        margin: const EdgeInsets.all(30),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text( "${AppLocalizations.of(context)!.language}:",
                style: const TextStyle(fontSize: 30, fontWeight: FontWeight.bold),),
              DropdownMenu(dropdownMenuEntries: const [
                DropdownMenuEntry(value: 'en', label: "English",),
                DropdownMenuEntry(value: 'pt', label: "Português")
              ],
                onSelected: (value) => context.read<LanguageChangeProvider>().changeLocale(value!,context)
                ,
                initialSelection: context.watch<LanguageChangeProvider>().getCurrentLocaleCode(),
                textStyle: const TextStyle(fontSize: 20),

              ),
            ElevatedButton(onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const StreetViewerWidget())
              );
            }, child: Text(AppLocalizations.of(context)!.street_viewer)),
            const SizedBox(height: 30,),

              Text( "${AppLocalizations.of(context)!.provider_text}:",
              style: const TextStyle(fontSize: 30, fontWeight: FontWeight.bold),),
              Text(
              context.watch<TestProvider>().test,
              style: const TextStyle(
                    fontSize: 30
                    ),
            ),
            const SizedBox(height: 30,),
            Text( "${AppLocalizations.of(context)!.change_provider_text}:",
              style:  const TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
            ),
              TextField(
                controller: testController,
              ),
              const SizedBox(height: 10,),
              ElevatedButton(onPressed: (){
                context.read<TestProvider>().changeTest(newTest: testController.text);
                FocusManager.instance.primaryFocus?.unfocus();
                testController.clear;
              }, child:  Text(AppLocalizations.of(context)!.save,
                style: const TextStyle(
                    fontSize: 30
                ),
              )),
              const SizedBox(height: 30,),

              Text( "${AppLocalizations.of(context)!.network_request}:",
                style: const TextStyle(fontSize: 30, fontWeight: FontWeight.bold),),
              ElevatedButton(
                onPressed: () {
                  FocusManager.instance.primaryFocus?.unfocus();
                  setState(() {
                    // Set a local variable to track the asynchronous operation.
                    _fetchResult = context.read<TestProvider>().fetchAlbum();
                  });
                },
                child: Text(
                  AppLocalizations.of(context)!.request,
                  style: const TextStyle(fontSize: 30),
                ),
              ),
              FutureBuilder<String>(
                future: _fetchResult,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    // Show a loading indicator while waiting for the result.
                    return const CircularProgressIndicator();
                  } else if (snapshot.hasError) {
                    // Handle the error case.
                    return Text('Error: ${snapshot.error}');
                  } else {
                    // Display the result using Text widget.
                    return Text((snapshot.data ?? ''), style: const TextStyle(fontSize: 30),);
                  }
                },
              ),


              const SizedBox(height: 30,),

              Text( "${AppLocalizations.of(context)!.schedule_network_request}:",
                style: const TextStyle(fontSize: 30, fontWeight: FontWeight.bold),),


              ElevatedButton(
                onPressed: () {
                  FocusManager.instance.primaryFocus?.unfocus();
                  setState(() {
                    // Set a local variable to track the asynchronous operation.
                    num ++;
                    Workmanager().registerOneOffTask(num.toString(), "scheduleReq", constraints: Constraints(networkType: NetworkType.connected));
                  });
                },
                child: Text(
                  AppLocalizations.of(context)!.request,
                  style: const TextStyle(fontSize: 30),
                ),
              ),



              const SizedBox(height: 30,),

              Text( "${AppLocalizations.of(context)!.see_pdf}:",
                style: const TextStyle(fontSize: 30, fontWeight: FontWeight.bold),),


              ElevatedButton(
                onPressed: () {
                  FocusManager.instance.primaryFocus?.unfocus();
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => PDFScreen(path: remotePDFpath),
                      ),
                    );
                },
                child: Text(
                  AppLocalizations.of(context)!.request,
                  style: const TextStyle(fontSize: 30),
                ),
              ),

              const SizedBox(height: 30,),


              Text( "${AppLocalizations.of(context)!.notification}:",
                style: const TextStyle(fontSize: 30, fontWeight: FontWeight.bold),),

              ElevatedButton(
                onPressed: () {
                  FocusManager.instance.primaryFocus?.unfocus();
                },
                child: Text(
                  AppLocalizations.of(context)!.create,
                  style: const TextStyle(fontSize: 30),
                ),
              ),
              const SizedBox(height: 30,),

              const Text( "Camera:",
                style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),),

              ElevatedButton(onPressed: () {
                FocusManager.instance.primaryFocus?.unfocus();
                Navigator.of(context).pushNamed("/camera");
              }
                  , child: const Text(
                  "Open Camera",
                  style: TextStyle(fontSize: 30),
                ),)
            ]
          ),
        ),
      ),
    );
  }



}

