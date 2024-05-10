package com.tidycity.code.views

import android.Manifest
import android.content.Intent
import android.net.ConnectivityManager
import android.os.Bundle
import android.telephony.TelephonyManager
import android.util.Log
import android.view.View
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.google.firebase.auth.FirebaseUser
import com.tidycity.code.R
import com.tidycity.code.database_utils.DatabaseAccess
import com.tidycity.code.firebase_utils.FirebaseDeclarations
import com.tidycity.code.utilities.Extensions.checkGpsStatus
import com.tidycity.code.utilities.Extensions.enableGPS
import com.tidycity.code.utilities.Extensions.storedInfo
import com.tidycity.code.utilities.NetworkMonitoring
import com.tidycity.code.webservices_utils.RetrofitInterface
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File


class PresentationActivity : AppCompatActivity() {

    private lateinit var begin: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ActivityCompat.requestPermissions(
            this,
            arrayOf(
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.CAMERA
            ), 1
        )

        setContentView(R.layout.activity_presentation)

        // activate service to monitor internet connectivity
        NetworkMonitoring(this@PresentationActivity).enable()

//        correctPercentage()

        if (storedInfo(this@PresentationActivity, false, null) == null) {
            storedInfo(this@PresentationActivity, true, "WIFI")
        }

        begin = findViewById(R.id.btnSignIn)
        begin.setOnClickListener {
            signIn()
//            val message = mGetNetworkClass()
//            Log.e("Test connectivity", "$message")
        }

    }

    override fun onResume() {
        super.onResume()
        if (!checkGpsStatus())
            enableGPS()
    }

    private fun signIn() {

        val user: FirebaseUser? = FirebaseDeclarations.firebaseAuth.currentUser
        println(user?.email)

        if (user == null)
            startActivity(Intent(this@PresentationActivity, SignInActivity::class.java))
        else {
            val userName = DatabaseAccess(this@PresentationActivity)
                .getUser(user.email.toString())
            println(userName)
            val intent = Intent(this, HomeActivity::class.java)
            intent.putExtra("email", user.email)
            intent.putExtra("username", userName)
            startActivity(intent)
        }
    }

    private fun mGetNetworkClass(): String? {

        // ConnectionManager instance
        val mConnectivityManager = this.getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
        val mInfo = mConnectivityManager.activeNetworkInfo

        // If not connected, "-" will be displayed
        if (mInfo == null || !mInfo.isConnected) return "-"

        // If Connected to Wifi
        if (mInfo.type == ConnectivityManager.TYPE_WIFI) return "WIFI"

        // If Connected to Mobile
        if (mInfo.type == ConnectivityManager.TYPE_MOBILE) {
            return when (mInfo.subtype) {
                TelephonyManager.NETWORK_TYPE_GPRS, TelephonyManager.NETWORK_TYPE_EDGE, TelephonyManager.NETWORK_TYPE_CDMA, TelephonyManager.NETWORK_TYPE_1xRTT, TelephonyManager.NETWORK_TYPE_IDEN, TelephonyManager.NETWORK_TYPE_GSM -> "2G"
                TelephonyManager.NETWORK_TYPE_UMTS, TelephonyManager.NETWORK_TYPE_EVDO_0, TelephonyManager.NETWORK_TYPE_EVDO_A, TelephonyManager.NETWORK_TYPE_HSDPA, TelephonyManager.NETWORK_TYPE_HSUPA, TelephonyManager.NETWORK_TYPE_HSPA, TelephonyManager.NETWORK_TYPE_EVDO_B, TelephonyManager.NETWORK_TYPE_EHRPD, TelephonyManager.NETWORK_TYPE_HSPAP, TelephonyManager.NETWORK_TYPE_TD_SCDMA -> "3G"
                TelephonyManager.NETWORK_TYPE_LTE, TelephonyManager.NETWORK_TYPE_IWLAN, 19 -> "4G"
                TelephonyManager.NETWORK_TYPE_NR -> "5G"
                else -> "?"
            }
        }
        return "?"
    }

//    private fun correctPercentage(){
//        val referenceDate = "2023-03-21T23:59:59"
//        for (video in DatabaseAccess(this@PresentationActivity).getVideoContent())
//            if (video.startDate < referenceDate)
//                if (video.currentStatus == "uploading")
//                    DatabaseAccess(this@PresentationActivity).updateUploadStatus(
//                        video.videoId!!,
//                        "uploaded"
//                    )
//    }

//    fun testjson(view: View) {
////        val file = File("/storage/emulated/0/Android/media/com.tidycity.code/2023-03-24T16_47_51.745.jpg").toUri()
//
//        // create RequestBody instance from file
////        val requestFile: RequestBody = file
////            .asRequestBody("image/jpeg}".toMediaTypeOrNull())
////        val requestBody = AwsServices().InputStreamRequestBody(contentResolver,)
////        val fileUri = Uri.parse(file.toString())
////        val videoFile = File("/storage/emulated/0/Android/media/com.tidycity.code/2023-03-24T16_47_51.745.jpg")
////
////         val file = Uri.parse(videoFile.toString())
//        val CONTENT_IMAGE = "image/jpeg"
//        val file = File("${externalMediaDirs[0]}/2023-03-22T15_06_30.107.jpg") // create new file on device
//
//        val requestFile: RequestBody = file.asRequestBody(CONTENT_IMAGE.toMediaTypeOrNull())
//
//        val url = "https://tidycity-frames.s3.amazonaws.com/server-api/app/Image_DB/andre_torneiro12_gmail_com/Video_1/Frame_1.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4RQD45KCV6AFXSPA%2F20230325%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230325T152222Z&X-Amz-Expires=1000&X-Amz-SignedHeaders=host&X-Amz-Signature=e1d049016defaf09745cb6d14fa53ee86cafde6813b3ba6783c4edb51a57f0b8"
////        RequestBody.create(MediaType.parse("image/jpeg"), file);
////                val requestBody = AwsServices().InputStreamRequestBody(contentResolver, file)
//                RetrofitInterface().uploadFileAWS(url, requestFile).enqueue(object :
//                    Callback<Void> {
//                    override fun onResponse(call: Call<Void>, response: Response<Void>) {
//                        Log.e("Retrofit on Response", response.code().toString())
//                        Log.e("Retrofit on Response", response.body().toString())
//
//                    }
//                    override fun onFailure(call: Call<Void>, t: Throwable) {
//                        Log.e("Retrofit On Failure", t.message.toString())
//                    }
//                })


//           val resp  = RetrofitInterface().uploadFileAWS(mimeType, url, requestBody).execute()



//        GlobalScope.launch {
//            DatabaseAccess(this@PresentationActivity).addUser("andre.torneiro12@gmail.com", "André", "Tidy_city6")
//        }
        //        GlobalScope.launch {
//            val response: Response<Prototypes.RfTokenValidation> = RetrofitInterface()
//                .validateToken(
//                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvbGEiLCJleHAiOjE2Nzk0NTUxMTN9.Gkz5lDCKA7a8XEpp_X2d6PrCMGhEGbn8MZ0b2SpDQbU"
//                ).execute()
//        }
//    }
}
