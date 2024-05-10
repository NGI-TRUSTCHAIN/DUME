package com.example.tidy_city_app.utilities

import android.content.ContentValues.TAG
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.SystemClock
import android.util.Log
import android.view.Surface
import org.tensorflow.lite.gpu.CompatibilityList
import org.tensorflow.lite.support.image.ImageProcessor
import org.tensorflow.lite.support.image.TensorImage
import org.tensorflow.lite.task.core.BaseOptions
import org.tensorflow.lite.task.core.vision.ImageProcessingOptions
import org.tensorflow.lite.task.vision.classifier.Classifications
import org.tensorflow.lite.task.vision.classifier.ImageClassifier
import org.tensorflow.lite.task.vision.detector.Detection
import org.tensorflow.lite.task.vision.detector.ObjectDetector

class PerformModelPrediction(
    var threshold: Float = 0.5f,
    var numThreads: Int = 2,
    var maxResults: Int = 3,
    var currentDelegate: Int = 0,
    var currentModel: Int = 0,
    val context: Context,
    val imageClassifierListener: ClassifierListener?
) {
    private var imageClassifier: ImageClassifier? = null

    init {
        setupImageClassifier()
    }

    fun clearImageClassifier() {
        imageClassifier = null
    }

    private fun setupImageClassifier() {
        val optionsBuilder = ImageClassifier.ImageClassifierOptions.builder()
            .setScoreThreshold(threshold)
            .setMaxResults(maxResults)

        val baseOptionsBuilder = BaseOptions.builder().setNumThreads(numThreads)

        when (currentDelegate) {
            DELEGATE_CPU -> {
                // Default
            }
            DELEGATE_GPU -> {
                if (CompatibilityList().isDelegateSupportedOnThisDevice) {
                    baseOptionsBuilder.useGpu()
                } else {
                    imageClassifierListener?.onError("GPU is not supported on this device")
                }
            }
            DELEGATE_NNAPI -> {
                baseOptionsBuilder.useNnapi()
            }
        }

        optionsBuilder.setBaseOptions(baseOptionsBuilder.build())

        val modelName =
            when (currentModel) {
                MODEL_MOBILENETV1 -> "mobilenetv1.tflite"
                MODEL_EFFICIENTNETV0 -> "efficientnet-lite0.tflite"
                MODEL_EFFICIENTNETV1 -> "efficientnet-lite1.tflite"
                MODEL_EFFICIENTNETV2 -> "efficientnet-lite2.tflite"
                else -> "mobilenetv1.tflite"
            }

        try {
            imageClassifier =
                ImageClassifier.createFromFileAndOptions(context, modelName, optionsBuilder.build())
        } catch (e: IllegalStateException) {
            imageClassifierListener?.onError(
                "Image classifier failed to initialize. See error logs for details"
            )
            Log.e(TAG, "TFLite failed to load model with error: " + e.message)
        }
    }

    fun classify(image: Bitmap, rotation: Int) {
        if (imageClassifier == null) {
            setupImageClassifier()
        }

        // Inference time is the difference between the system time at the start and finish of the
        // process
        var inferenceTime = SystemClock.uptimeMillis()

        // Create preprocessor for the image.
        // See https://www.tensorflow.org/lite/inference_with_metadata/
        //            lite_support#imageprocessor_architecture
        val imageProcessor =
            ImageProcessor.Builder()
                .build()

        // Preprocess the image and convert it into a TensorImage for classification.
        val tensorImage = imageProcessor.process(TensorImage.fromBitmap(image))

        val imageProcessingOptions = ImageProcessingOptions.builder()
            .setOrientation(getOrientationFromRotation(rotation))
            .build()

        val results = imageClassifier?.classify(tensorImage, imageProcessingOptions)
        inferenceTime = SystemClock.uptimeMillis() - inferenceTime
        imageClassifierListener?.onResults(
            results,
            inferenceTime
        )
    }

    // Receive the device rotation (Surface.x values range from 0->3) and return EXIF orientation
    // http://jpegclub.org/exif_orientation.html
    private fun getOrientationFromRotation(rotation: Int) : ImageProcessingOptions.Orientation {
        when (rotation) {
            Surface.ROTATION_270 ->
                return ImageProcessingOptions.Orientation.BOTTOM_RIGHT
            Surface.ROTATION_180 ->
                return ImageProcessingOptions.Orientation.RIGHT_BOTTOM
            Surface.ROTATION_90 ->
                return ImageProcessingOptions.Orientation.TOP_LEFT
            else ->
                return ImageProcessingOptions.Orientation.RIGHT_TOP
        }
    }

    interface ClassifierListener {
        fun onError(error: String)
        fun onResults(
            results: List<Classifications>?,
            inferenceTime: Long
        )
    }

    companion object {
        const val DELEGATE_CPU = 0
        const val DELEGATE_GPU = 1
        const val DELEGATE_NNAPI = 2
        const val MODEL_MOBILENETV1 = 0
        const val MODEL_EFFICIENTNETV0 = 1
        const val MODEL_EFFICIENTNETV1 = 2
        const val MODEL_EFFICIENTNETV2 = 3

        private const val TAG = "ImageClassifierHelper"
    }
}
//
//class PerformModelPrediction(context: Context) {
//
//    private val context = context
//    private var imageClassifier: ImageClassifier? = null
//
//    /**
//     * TFLite Object Detection Function
//     */
//    fun runObjectDetection(uri: Uri) {
//
//        val bitmap = convertUriToBitmap(uri)
//
//        val image = TensorImage.fromBitmap(bitmap)
//
////        val options = ObjectDetector.ObjectDetectorOptions.builder()
////            .setScoreThreshold(0.5f)
////            .build()
//        val options = ImageClassifier.ImageClassifierOptions.builder()
//            .setScoreThreshold(0.5f)
//            .build()
//
//        val imageClassifier = ImageClassifier.createFromFileAndOptions(
//            context, // the application context
//            "yolov7_tiny.tflite", // must be same as the filename in assets folder
//            options
//        )
//
//        val results = classify(bitmap)
//
////        debugPrint(results)
//    }
//
//    fun classify(image: Bitmap) {
////        if (imageClassifier == null) {
////            setupImageClassifier()
////        }
//
//        // Inference time is the difference between the system time at the start and finish of the
//        // process
//        var inferenceTime = SystemClock.uptimeMillis()
//
//        // Create preprocessor for the image.
//        // See https://www.tensorflow.org/lite/inference_with_metadata/
//        //            lite_support#imageprocessor_architecture
//        val imageProcessor =
//            ImageProcessor.Builder()
//                .build()
//
//        // Preprocess the image and convert it into a TensorImage for classification.
//        val tensorImage = imageProcessor.process(TensorImage.fromBitmap(image))
//
//        val imageProcessingOptions = ImageProcessingOptions.builder()
//            .setOrientation(getOrientationFromRotation(0))
//            .build()
//
//        val results = imageClassifier?.classify(tensorImage, imageProcessingOptions)
//        inferenceTime = SystemClock.uptimeMillis() - inferenceTime
//        context?.onResults(
//            results,
//            inferenceTime
//        )
//    }
//
//    // Receive the device rotation (Surface.x values range from 0->3) and return EXIF orientation
//    // http://jpegclub.org/exif_orientation.html
//    private fun getOrientationFromRotation(rotation: Int) : ImageProcessingOptions.Orientation {
//        when (rotation) {
//            Surface.ROTATION_270 ->
//                return ImageProcessingOptions.Orientation.BOTTOM_RIGHT
//            Surface.ROTATION_180 ->
//                return ImageProcessingOptions.Orientation.RIGHT_BOTTOM
//            Surface.ROTATION_90 ->
//                return ImageProcessingOptions.Orientation.TOP_LEFT
//            else ->
//                return ImageProcessingOptions.Orientation.RIGHT_TOP
//        }
//    }
//
//    interface ClassifierListener {
//        fun onError(error: String)
//        fun onResults(
//            results: List<Classifications>?,
//            inferenceTime: Long
//        )
//    }
//
//    private fun convertUriToBitmap(uri: Uri): Bitmap{
//
//        val imageStream = context.contentResolver.openInputStream(uri)
//        return BitmapFactory.decodeStream(imageStream)
//    }
//
//    private fun debugPrint(results : List<Detection>) {
//        for ((i, obj) in results.withIndex()) {
//            val box = obj.boundingBox
//
//            Log.d(TAG, "Detected object: $i ")
//            Log.d(TAG, "  boundingBox: (${box.left}, ${box.top}) - (${box.right},${box.bottom})")
//
//            for ((j, category) in obj.categories.withIndex()) {
//                Log.d(TAG, "    Label $j: ${category.label}")
//                val confidence: Int = category.score.times(100).toInt()
//                Log.d(TAG, "    Confidence: ${confidence}%")
//            }
//        }
//    }
//}