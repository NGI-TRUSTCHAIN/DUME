import 'dart:async';
import 'dart:developer';
import 'dart:io';
import 'dart:ui' as dartUi;


import 'package:flutter_vision/flutter_vision.dart';
import 'package:image/image.dart' as img;

class YoloImageV8Seg {
  static final vision = FlutterVision();
  static final List<String> tagsToAnonymize = [
    'person',
    'bicycle',
    'car',
    'motorcycle',
    'bus'
  ];

  late List<Map<String, dynamic>> anonymizationResults;
  late File? imageFile;
  late String imagePath;
  int imageHeight = 1;
  int imageWidth = 1;
  bool isLoaded = false;

  Future<void> _loadYoloModel() async {
    await vision.loadYoloModel(
        labels: 'assets/cv_models/labels.txt',
        modelPath: 'assets/cv_models/yolov8n-seg.tflite',
        modelVersion: "yolov8seg",
        quantization: false,
        numThreads: 2,
        useGpu: true);

    isLoaded = true;
  }

  Future<dartUi.Image> _convertImage(img.Image image) async {
    final completer = Completer<dartUi.Image>();
    dartUi.decodeImageFromPixels(
      image.getBytes(),
      image.width,
      image.height,
      dartUi.PixelFormat.rgba8888,
          (dartUi.Image img) {
        completer.complete(img);
      },
    );
    return completer.future;
  }

  Future<void> _drawOnImage(dartUi.Image image) async {
    log('drawing image');
    final recorder = dartUi.PictureRecorder();

    double factorX = imageWidth / imageWidth;
    double imgRatio = imageWidth / imageHeight;
    double newWidth = imageWidth * factorX;
    double newHeight = newWidth / imgRatio;
    double factorY = newHeight / imageHeight;
    double pady = (imageHeight - newHeight) / 2;

    final canvas = dartUi.Canvas(recorder,
        dartUi.Rect.fromLTWH(0, 0, imageWidth.toDouble(), imageHeight.toDouble()));
    canvas.drawImage(image, dartUi.Offset.zero, dartUi.Paint());

    for (var result in anonymizationResults) {
      final List<dynamic> box = result['box'];
      double left = box[0] * factorX;
      double top = box[1] * factorY + pady;
      double width = (box[2] - box[0]) * factorX;
      double height = (box[3] - box[1]) * factorY;

      final List<dynamic> polygons = result["polygons"];
      final List<Map<String, double>> adjustedPoints = polygons.map((e) {
        Map<String, double> xy = Map<String, double>.from(e);
        xy['x'] = xy['x']! * factorX;
        xy['y'] = xy['y']! * factorY + pady;
        return xy;
      }).toList();

      canvas.save();
      canvas.translate(left,
          top); // Position the painter at the top-left corner of the bounding box
      canvas.clipRect(
          dartUi.Rect.fromLTWH(0, 0, width, height)); // Clip to the bounding box area

      final paint = dartUi.Paint()
        ..color = const dartUi.Color.fromRGBO(0, 0, 0, 1.0)
        ..strokeWidth = 2
        ..style = dartUi.PaintingStyle.fill;

      final path = dartUi.Path();
      if (adjustedPoints.isNotEmpty) {
        path.moveTo(adjustedPoints[0]['x']!, adjustedPoints[0]['y']!);
        for (var i = 1; i < adjustedPoints.length; i++) {
          path.lineTo(adjustedPoints[i]['x']!, adjustedPoints[i]['y']!);
        }
        path.close();
        canvas.drawPath(path, paint);
      }

      canvas.restore();
    }

    final picture = recorder.endRecording();
    final finalImg = await picture.toImage(image.width, image.height);

    await _saveAnonymizedImage(finalImg);
  }

  Future<void> _saveAnonymizedImage(dartUi.Image anonymizedImage) async {
    // Directory? directory;
    // directory = await getExternalStorageDirectory();
    // if (directory != null) {
    //   final picturesPath = Directory('${directory.path}/Pictures');
    //   if (!(await picturesPath.exists())) {
    // await picturesPath.create(recursive: true);
    // }
    // }

    // final path = imagePath.replaceAll('.jpg', '.png');
    final byteData =
        await anonymizedImage.toByteData(format: dartUi.ImageByteFormat.png);
    final buffer = byteData!.buffer.asUint8List();

    await File(imagePath).writeAsBytes(buffer);
    log('Repainted image saved at $imagePath');
  }

  Future<void> runInference(String path) async {
    if (!isLoaded) {
      await _loadYoloModel();
    }

    imagePath = path;
    imageFile = File(imagePath);

    final imageBytes = await imageFile!.readAsBytes();
    final image = img.decodeImage(imageBytes);

    if (image == null) {
      return;
    }

    imageHeight = image.height;
    imageWidth = image.width;

    final yoloResults = await vision.yoloOnImage(
        bytesList: imageBytes,
        imageHeight: image.height,
        imageWidth: image.width,
        iouThreshold: 0.4,
        confThreshold: 0.4,
        classThreshold: 0.5);

    if (yoloResults.isEmpty) {
      return;
    }

    anonymizationResults = [
      for (int i = 0; i < yoloResults.length; i++)
        if (tagsToAnonymize.contains(yoloResults[i]['tag'])) yoloResults[i]
    ];
    log('$anonymizationResults');

    if (anonymizationResults.isEmpty) {
      return;
    }
    try {
      final dartUi.Image dartUiImage = await _convertImage(image);
      await _drawOnImage(dartUiImage);

    } on Exception catch (e){
      log('error');
      log(e as String);
    }
    anonymizationResults.clear();

  }
}
