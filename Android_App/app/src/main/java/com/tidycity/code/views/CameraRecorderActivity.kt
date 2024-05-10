package com.tidycity.code.views

import android.annotation.SuppressLint
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.res.Configuration
import android.graphics.Bitmap
import android.location.LocationManager
import android.os.*
import android.util.Log
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import android.widget.ToggleButton
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.content.res.AppCompatResources
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.tidycity.code.R
import com.tidycity.code.database_utils.DatabaseAccess
import com.tidycity.code.databinding.ActivityCameraRecorderBinding
import com.tidycity.code.dataclasses_prototypes.Prototypes
import com.tidycity.code.webservices_utils.ExtensionsRetrofit
import com.tidycity.code.utilities.Extensions.bitmapToUriFile
import com.tidycity.code.utilities.Extensions.enableGPS
import com.tidycity.code.utilities.Extensions.getDateTime
import com.tidycity.code.utilities.Extensions.isInternetEnabled
import com.tidycity.code.utilities.Extensions.isWifiEnable
import com.tidycity.code.utilities.Extensions.storedInfo
import com.tidycity.code.utilities.Extensions.toast
import kotlinx.coroutines.*
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import kotlin.properties.Delegates


/**
 * https://developer.android.com/codelabs/camerax-getting-started?hl=RU#1
 * https://github.com/android/camera-samples
 */

class CameraRecorderActivity : AppCompatActivity() {

    private lateinit var viewBinding: ActivityCameraRecorderBinding
    private lateinit var cameraExecutor: ExecutorService
    private lateinit var possibleClasses: List<ToggleButton>
    private lateinit var videoID: String

    private var isRecording: Boolean = false
    private var myJob: Job? = null
    private var user: String? = null
    private var email: String? = null
    private var selectedClass = mutableListOf<String>()
    private var locationCoordinates = Prototypes.DbCoordinates(null,null)
    private var broadcastReceiver: BroadcastReceiver? = null
    private var acquiredFrames = 0

    private val frameRate = 250L


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewBinding = ActivityCameraRecorderBinding.inflate(layoutInflater)
        setContentView(viewBinding.root)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        hideNavigationBar()

        // start camera Preview
        runBlocking(Dispatchers.Default) {
            withContext(Dispatchers.Default) {
                startCamera()
            }
        }

        // create a list with possible Classes buttons
        possibleClasses = listOf(
            viewBinding.cls1, viewBinding.cls2,
            viewBinding.cls3, viewBinding.cls4,
            viewBinding.cls5, viewBinding.cls6,
            viewBinding.cls7
        )

        // check if any of the buttons is checked
        possibleClasses.forEach { toggleButton ->
            toggleButton.setOnCheckedChangeListener { _, checked ->
                if (checked) {
                    disableButton(toggleButton)
                    if (!selectedClass.contains(toggleButton.contentDescription.toString()))
                        selectedClass.add(toggleButton.contentDescription.toString())
                } else {
                    if (selectedClass.contains(toggleButton.contentDescription.toString()))
                        selectedClass.remove(toggleButton.contentDescription.toString())
                }
            }
        }

        // Set up the listener for take photo button
        viewBinding.videoCaptureButton.setOnClickListener {
            isRecording = when (isRecording) {
                true -> {

                    myJob?.cancel()
                    Log.e("Frames stopped", "$acquiredFrames")
                    // update video database with the number of frames in captured video
                    DatabaseAccess(this@CameraRecorderActivity)
                        .updateFinishDate(key = videoID, endDate = getDateTime())

                    viewBinding.idTCClock.visibility = View.GONE
                    viewBinding.idTCClock.stop()

                    viewBinding.videoCaptureButton.background =
                        AppCompatResources.getDrawable(this, R.drawable.ic_start)

                    // check shared preferences for uploading video and update VideoStructure DB but
                    // give a delay to save last captured frame
                    Handler(Looper.getMainLooper()).postDelayed({
                        updateDBWithUploadChecker()
                    }, 500)
                    false
                }
                false -> {

                    viewBinding.videoCaptureButton.background =
                        AppCompatResources.getDrawable(this, R.drawable.ic_stop)

                    acquiredFrames = 0
                    myJob = startTakingPhoto(frameRate)

                    viewBinding.idTCClock.visibility = View.VISIBLE
                    viewBinding.idTCClock.base = SystemClock.elapsedRealtime()
                    viewBinding.idTCClock.start()

                   lifecycleScope.launch {
                       // create fileName with timestamp
                       videoID = "Video_${getDateTime()}"

                       DatabaseAccess(this@CameraRecorderActivity).saveVideo(
                           videoName = videoID,
                           user = email!!,
                           videoDate = videoID.removePrefix("Video_"),
                           currentStatus = "!uploading",
                           uploadProgress = 0,
                           frameLength = 0,
                       )
                   }
                    true
                }
            }
        }

        viewBinding.btnGoBack.setOnClickListener {
            if (isRecording) {
                viewBinding.videoCaptureButton.invalidate()
                viewBinding.videoCaptureButton.performClick()
            }
            else {
                val intent = Intent(this@CameraRecorderActivity, HomeActivity::class.java)
                intent.putExtra("email", email)
                intent.putExtra("username", user)
                startActivity(intent)
//                finish()
            }
        }

        cameraExecutor = Executors.newSingleThreadExecutor()
    }

    override fun onStart() {
        super.onStart()

        // get the email of current user until "@"
        val extras = intent.extras
        if (extras != null) {
            email = extras.getString("email")
            user = extras.getString("username")
        }
    }

    private val gpsSwitchStateReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (LocationManager.PROVIDERS_CHANGED_ACTION == intent.action) {
                val locationManager = context.getSystemService(LOCATION_SERVICE) as LocationManager
                val isGpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
                if (!isGpsEnabled ){
                    viewBinding.gpsToogle.background = getDrawable(R.drawable.ic_baseline_gps_not_fixed_24)
                    enableGPS()
                }
            }
        }
    }

    @SuppressLint("MissingPermission")
    override fun onResume() {
        super.onResume()
        val filter = IntentFilter(LocationManager.PROVIDERS_CHANGED_ACTION)
        filter.addAction(Intent.ACTION_PROVIDER_CHANGED)
        registerReceiver(gpsSwitchStateReceiver, filter)

        if (broadcastReceiver == null) {
            broadcastReceiver = object : BroadcastReceiver() {
                override fun onReceive(context: Context, intent: Intent) {
                    println(intent.extras?.getDouble("Latitude"))
                    println(intent.extras?.getDouble("Longitude"))
                    locationCoordinates.lat = intent.extras?.getDouble("Latitude")!!
                    locationCoordinates.long = intent.extras?.getDouble("Longitude")!!
                    viewBinding.gpsToogle.background = getDrawable(R.drawable.ic_baseline_gps_fixed_24)
                }
            }
        }
        registerReceiver(broadcastReceiver, IntentFilter("location_update"))
    }

    // hide navigation bar and show app in full screen
    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY)
        }
    }

    // hide navigation bar when screen is rotated
    override fun onConfigurationChanged(config: Configuration) {
        super.onConfigurationChanged(config)
        window.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN)
        actionBar!!.hide()
        hideNavigationBar()
    }

    private fun hideNavigationBar() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(false)
            if (window.insetsController != null) {
                window.insetsController!!.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
                window.insetsController!!.systemBarsBehavior =
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY)
        }
    }

    private fun startCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)

        cameraProviderFuture.addListener({
            // Used to bind the lifecycle of cameras to the lifecycle owner
            val cameraProvider: ProcessCameraProvider = cameraProviderFuture.get()

            // Preview
            val preview = Preview.Builder()
                .build()
                .also {
                    it.setSurfaceProvider(viewBinding.viewFinder.surfaceProvider)
                }

            // Select back camera as a default
            val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

            try {
                // Unbind use cases before rebinding
                cameraProvider.unbindAll()

                // Bind use cases to camera
                cameraProvider.bindToLifecycle(
                    this, cameraSelector, preview
                )

                Log.e("Info Cam","${preview.resolutionInfo}")

            } catch (exc: Exception) {
                Log.e(TAG, "Use case binding failed", exc)
            }

        }, ContextCompat.getMainExecutor(this))
    }

    /**
     * Start repeating job
     *
     * @param timeInterval
     * @return
     * This fun has the objective of take one picture with time interval of 250ms which
     * represents a frame rate of 4
     */
    private fun startTakingPhoto(timeInterval: Long): Job {
        return CoroutineScope(Dispatchers.Default).launch {
            while (isActive) {

                // call function to take picture
                takePhoto()

                // wait the defined time interval which is equal of defined frame rate
                delay(timeInterval)
            }
        }
    }

    private fun takePhoto() {
        lifecycleScope.launch {
            val frame = viewBinding.viewFinder.bitmap ?: return@launch
            savingFrame(frame)
            Log.d("Acquired frames", "$acquiredFrames Frames")
        }
    }

    private fun savingFrame(frame:Bitmap) = Thread {

        acquiredFrames++

        // resize frame to 1080 and 1920
        val resizedFrame = Bitmap.createScaledBitmap(
            frame, frame.width, 1920, false
        )

        // get timestamp
        val dateTime = getDateTime()

        // save image as file
        val (framePath, hasFileLength) = bitmapToUriFile(resizedFrame, dateTime)

        if (hasFileLength) {
            runBlocking(Dispatchers.Default) {
                withContext(Dispatchers.Default) {

                    Log.d(TAG, "Saving image into database")
                    DatabaseAccess(this@CameraRecorderActivity).updateFramesLength(
                        key = videoID,
                        framesLength = acquiredFrames
                    )
                    println(locationCoordinates)
                    DatabaseAccess(this@CameraRecorderActivity).saveFrame(
                        frameName = dateTime,
                        videoId = videoID,
                        framePath = framePath,
                        coordinates = locationCoordinates,
                        classes = selectedClass.joinToString("|")
                    )
                }
            }
        } else {
            acquiredFrames--
            runOnUiThread {
                viewBinding.videoCaptureButton.invalidate()
                viewBinding.videoCaptureButton.performClick()
                toast("Not available")
            }
        }
    }.start()

    private fun updateDBWithUploadChecker() {

        when (storedInfo(this@CameraRecorderActivity, false, null)) {
            "WIFI" -> {
                if (isWifiEnable() && isInternetEnabled()) {
                    toast("Uploading video...")
                    ExtensionsRetrofit(this@CameraRecorderActivity).uploadFiles(videoID)
                } else toast("Video Saved successfully")
            }
            "ALL" -> {
                if (isInternetEnabled()) {
                    toast("Uploading video...")
                    ExtensionsRetrofit(this@CameraRecorderActivity).uploadFiles(videoID)
                } else toast("Video Saved successfully")
            }
        }
    }

    private fun disableButton(button: ToggleButton) {
        // if toggle button is checked and user forgot to uncheck
        // wait 5s and uncheck it programmatically
        Handler(Looper.getMainLooper()).postDelayed({
            if (button.isChecked) {
                button.isChecked = false
            }
        }, 3000)
    }

    override fun onDestroy() {
        super.onDestroy()
        cameraExecutor.shutdown()
        unregisterReceiver(broadcastReceiver)
        unregisterReceiver(gpsSwitchStateReceiver)
    }


    companion object {
        private const val TAG = "CameraXApp"
    }
}


