package com.tidycity.code.utilities

import android.content.ContentValues.TAG
import android.content.Context
import android.content.Context.WIFI_SERVICE
import android.net.ConnectivityManager
import android.net.ConnectivityManager.NetworkCallback
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.net.wifi.WifiManager
import android.util.Log
import com.tidycity.code.database_utils.DatabaseAccess
import com.tidycity.code.webservices_utils.ExtensionsRetrofit
import com.tidycity.code.utilities.Extensions.storedInfo
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext


class NetworkMonitoring(val context: Context): NetworkCallback() {

    private val networkRequest = NetworkRequest.Builder()
    .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    .addTransportType(NetworkCapabilities.TRANSPORT_WIFI)
    .addTransportType(NetworkCapabilities.TRANSPORT_CELLULAR)
    .build()


    private val networkCallback = object : NetworkCallback() {

        // network is available for use
        override fun onAvailable(network: Network) {
            super.onAvailable(network)
            Log.d(TAG, "ConnectivityManager ON")
            when (storedInfo(context, false, null)) {
                "WIFI" -> {
                    val wifiManager = context.getSystemService(WIFI_SERVICE) as WifiManager?
                        if (wifiManager!!.isWifiEnabled) {
                        checkForNonUploadedVideo()
                    }
                }
                "ALL" -> {
                    checkForNonUploadedVideo()
                }
            }
        }

        // Network capabilities have changed for the network
        override fun onCapabilitiesChanged(
            network: Network,
            networkCapabilities: NetworkCapabilities
        ) {
            super.onCapabilitiesChanged(network, networkCapabilities)
            val unMetered = networkCapabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_NOT_METERED)

        }

        // lost network connection
        override fun onLost(network: Network) {
            super.onLost(network)
            Log.d(TAG, "ConnectivityManager off")
            changeUploadStatus()
        }
    }

    fun enable() {
        val connectivityManager = context.getSystemService(ConnectivityManager::class.java) as ConnectivityManager
        connectivityManager.requestNetwork(networkRequest, networkCallback)
    }

    fun checkForNonUploadedVideo() {
        GlobalScope.launch {
            withContext(Dispatchers.Default) {
                for (video in DatabaseAccess(context).uploadVideo())
                    if (video.currentStatus == "!uploading")
                    // call function to upload video
                        ExtensionsRetrofit(context).uploadFiles(video.videoName)
            }
        }
    }

    private fun changeUploadStatus(){
        GlobalScope.launch {
            withContext(Dispatchers.Default) {
                for (video in DatabaseAccess(context).uploadVideo())
                    if (video.currentStatus != "uploaded")
                        DatabaseAccess(context)
                            .updateUploadStatus(
                                video.videoName,
                                "!uploading"
                            )
            }
        }
    }

}


