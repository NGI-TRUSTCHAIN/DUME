package com.tidycity.code.utilities

import android.app.Activity
import android.content.Context
import android.content.Context.*
import android.content.IntentSender
import android.graphics.Bitmap
import android.location.LocationManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.wifi.WifiManager
import android.os.Build
import android.util.Log
import android.widget.Toast
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.google.android.gms.common.api.ResolvableApiException
import com.google.android.gms.location.*
import com.google.android.gms.tasks.Task
import com.tidycity.code.dataclasses_prototypes.Prototypes
import okhttp3.MultipartBody
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.io.OutputStream
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*


object Extensions {

    fun Activity.toast(msg: String) {
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
    }


    fun Activity.isInternetEnabled(): Boolean {

        // register activity with the connectivity manager service
        val connectivityManager =
            this.getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager

        // if the android version is equal to M  or greater we need to use the
        // NetworkCapabilities to check what type of network has the internet connection

        // Returns a Network object corresponding to the currently active default data network.
        val network = connectivityManager.activeNetwork ?: return false

        // Representation of the capabilities of an active network.
        val activeNetwork = connectivityManager.getNetworkCapabilities(network) ?: return false

        return when {
            // Indicates this network uses a Wi-Fi transport, or WiFi has network connectivity
            activeNetwork.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> true

            // Indicates this network uses a Cellular transport. or
            // Cellular has network connectivity
            activeNetwork.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> true

            // else return false
            else -> false
        }
    }

    fun Activity.isWifiEnable(): Boolean {

        val wifiManager = applicationContext.getSystemService(WIFI_SERVICE) as WifiManager?
        return wifiManager!!.isWifiEnabled
    }

    fun Activity.checkGpsStatus(): Boolean {
        val locationManager =
            applicationContext.getSystemService(LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
    }

    fun Activity.enableGPS(): Boolean {
        var connectionStatus = false
        val locationRequest = LocationRequest.create()
        val builder = LocationSettingsRequest.Builder()
            .addLocationRequest(locationRequest)

        val client: SettingsClient = LocationServices.getSettingsClient(this)
        val task: Task<LocationSettingsResponse> = client.checkLocationSettings(builder.build())

        task.addOnSuccessListener { response ->
            val states = response.locationSettingsStates
            if (states!!.isLocationPresent) {
                connectionStatus = true
            }
        }

        // Location settings are not satisfied, but this can be fixed by showing the user a dialog.
        task.addOnFailureListener { exception ->
            if (exception is ResolvableApiException) {

                try {
                    // Show the dialog by calling startResolutionForResult(),
                    // and check the result in onActivityResult().
                    exception.startResolutionForResult(
                        this,
                        2
                    )
                } catch (sendEx: IntentSender.SendIntentException) {
                    // Ignore the error.
                }
            }
        }
        return connectionStatus
    }

    private fun getCurrentDateTime(): String {
        val formatter = SimpleDateFormat("yyyy/MM/dd HH:mm:ss", Locale.getDefault())
        return formatter.format(Calendar.getInstance().time)
    }

    fun getDateTime(): String {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(LocalDateTime.now())
        } else getCurrentDateTime()
    }

    fun storedInfo(context: Context, save: Boolean, msg: String?): String? {
        val uploadPreferences = context.getSharedPreferences("UploadSettings", MODE_PRIVATE)
        return when (save) {
            false -> {
                uploadPreferences.getString("UploadWith", null)
            }
            true -> {
                with(uploadPreferences.edit()) {
                    putString("UploadWith", msg)
                    apply()
                }
                null
            }
        }
    }

//    fun Activity.uriToBitmap(uri: Uri): Bitmap {
//        val imageStream = contentResolver.openInputStream(uri)
//        return BitmapFactory.decodeStream(imageStream)
//    }

    fun writeJsonFile(videoMetadata: Prototypes.JsMetadataDict): MultipartBody.Part {
        val mapper = jacksonObjectMapper()

        val jsonArray = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(videoMetadata)

//        val path = "${context.externalCacheDir}/videoMetadata.json"
//        mapper.writerWithDefaultPrettyPrinter().writeValue(File(path), videoMetadata)

        return MultipartBody.Part.createFormData("videoMetadata", jsonArray)
    }

    fun Activity.bitmapToUriFile(bitmap: Bitmap, date: String): Pair<String,Boolean> {

        val fileDirectory = "${externalMediaDirs[0]}/${date.replace(":","_")}.jpg"
        val file = File(fileDirectory)

        try {
            // Get the file output stream
            val stream: OutputStream = FileOutputStream(file)

            stream.use {
                // Compress bitmap
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, it)

                // Flush the stream
                it.flush()

                // Close stream
                it.close()

                Log.i("Saving frame to file", "Successfully Saved")
            }
        } catch (e: IOException) { // Catch the exception
            e.printStackTrace()
            Log.w("WARNING","${e.message}")
        }
        return fileDirectory to (file.length()>0)
    }

    fun deletePicture(framePath: List<String>) {
        framePath.forEach {
            val filepath = File(it)
            if (filepath.exists())
                filepath.delete()
        }
    }
}

//    private fun showInternetDialog() {
//        runOnUiThread {
//            val builder = AlertDialog.Builder(this)
//            builder.setTitle(getString(R.string.internet_connectivity))
//            builder.setMessage(getString(R.string.internet_message))
//            builder.setCancelable(false)
//
//            builder.setPositiveButton(getString(R.string.upload_later)) { _, _ ->
//                mapCopy.putAll(uploadContentPrototype)
//                saveFileDatabase(mapCopy)
//            }
//            builder.show()
//        }
//    }

//    private fun showUploadDialog() {
//        runOnUiThread {
//            val builder = AlertDialog.Builder(this)
//            builder.setTitle(getString(R.string.alert_description))
//            builder.setMessage(getString(R.string.alert_description_message))
//            builder.setCancelable(false)
//
//            builder.setPositiveButton(getString(R.string.leave_it)) { _, _ ->
//                println(uploadContentPrototype)
//                if (isInternetEnabled()) {
//                    uploadContent()
//                } else showInternetDialog()
//            }
//            builder.setNeutralButton(getString(R.string.record_again)) { _, _ ->
//                mapCopy.putAll(uploadContentPrototype)
//                saveFileDatabase(mapCopy)
//            }
//            builder.setNegativeButton(getString(R.string.descartar_video)) { _, _ ->
//                deletePicture()
//            }
//
//            builder.show()
//        }
//    }
