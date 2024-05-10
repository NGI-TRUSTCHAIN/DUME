package com.tidycity.code.views

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.widget.Button
import android.widget.PopupMenu
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.tidycity.code.R
import com.tidycity.code.firebase_utils.FirebaseDeclarations.firebaseAuth
import com.tidycity.code.gps_utils.GPService
import com.tidycity.code.utilities.Extensions.checkGpsStatus
import com.tidycity.code.utilities.Extensions.enableGPS
import com.tidycity.code.utilities.Extensions.storedInfo
import com.tidycity.code.utilities.NetworkMonitoring


class HomeActivity : AppCompatActivity() {

    private lateinit var displayUsername: TextView
    private lateinit var recordData: Button
    private lateinit var showHistory: Button
    private lateinit var settings: Button
    private lateinit var switchView: Button

    private var userEmail: String? = null
    private var username: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        NetworkMonitoring(this@HomeActivity).enable()

        recordData = findViewById(R.id.btnCamera)
        showHistory = findViewById(R.id.btnHistory)
        settings = findViewById(R.id.btnSettings)
        displayUsername = findViewById(R.id.userName)

        // get the email of current user until "@"
        val extras = intent.extras
        if (extras != null) {
            username = extras.getString("username")
            userEmail = extras.getString("email")
        }

        displayUsername.text = username

        recordData.setOnClickListener {
            if (checkGpsStatus()) {
                val i = Intent(applicationContext, GPService::class.java)
                startService(i)

                val intent = Intent(this, CameraRecorderActivity::class.java)
                intent.putExtra("email", userEmail)
                intent.putExtra("username", username)
                startActivity(intent)
            }
            else
                enableGPS()

        }
        showHistory.setOnClickListener {
            val intent = Intent(this, HistoryActivity::class.java)
            intent.putExtra("email", userEmail)
            intent.putExtra("username", username)
            startActivity(intent)
        }

        settings.setOnClickListener {
            showMenu()
        }

        switchView = findViewById(R.id.btnHelp)
        switchView.setOnClickListener {
            val intent = Intent(this, PodAccessActivity::class.java)
            startActivity(intent)
        }

        val btn1: Button = findViewById<Button>(R.id.btnHelp1)
        btn1.setOnClickListener {
            val intent = Intent(this, SettingsActivity::class.java)
            startActivity(intent)
        }


        val btn2: Button = findViewById<Button>(R.id.btnHelp2)
        btn2.setOnClickListener {
            val intent = Intent(this, UserPodFiles::class.java)
            startActivity(intent)
        }


    }

//    private fun showUploadDialog() {
//        runOnUiThread {
//            val builder = AlertDialog.Builder(this)
//            builder.setTitle(getString(R.string.alert_description))
//            builder.setMessage(getString(R.string.videos_to_upload))
//            builder.setCancelable(false)
//
//            builder.setPositiveButton(getString(R.string.leave_it)) { _, _ ->
//                if (!isInternetEnabled())
//                    toast("Your internet connectivity doesn't match with your settings")
////                else uploadContent(videosToUpload)
//            }
//            builder.setNegativeButton(getString(R.string.not_now)) { _, _ -> }
//            builder.show()
//        }
//    }



    private fun showMenu() {

        val popupMenu = PopupMenu(this , findViewById(R.id.btnSettings))

        // add popup menu
        popupMenu.inflate(R.menu.menu_logout)

        // radio buttons
        val wifiOnly = popupMenu.menu.findItem(R.id.submenu0)
        val allConnectivity = popupMenu.menu.findItem(R.id.submenu1)

        if (storedInfo(this@HomeActivity,false, null) == "WIFI"){
            wifiOnly.isChecked = true
        }
        else if (storedInfo(this@HomeActivity,false, null) == "ALL") {
            allConnectivity.isChecked = true
        }


        // implement on menu item click Listener
        popupMenu.setOnMenuItemClickListener(object : PopupMenu.OnMenuItemClickListener{
            override fun onMenuItemClick(item: MenuItem?): Boolean {
                when(item?.itemId){
                    R.id.logout -> {
                        // here are the logic to delete an item from the list
                        firebaseAuth.signOut()
                        startActivity(Intent(this@HomeActivity,SignInActivity::class.java))
                        finish()
                        return true
                    }
                    R.id.submenu0 -> {
                        allConnectivity.isChecked = false
                        item.isChecked = !item!!.isChecked

                        storedInfo(this@HomeActivity, true, "WIFI")

                        return true
                    }
                    R.id.submenu1 -> {
                        item.isChecked = !item!!.isChecked
                        wifiOnly.isChecked = false

                        storedInfo(this@HomeActivity, true, "ALL")

                        return true
                    }
                }
                return false
            }

        })
        try {
            val field = PopupMenu::class.java.getDeclaredField("mPopup")
            field.isAccessible = true
            val mPopup = field.get(popupMenu)
            mPopup.javaClass
                .getDeclaredMethod("setForceShowIcon",Boolean::class.java)
                .invoke(mPopup,true)
        } catch (e:Exception) {
            Log.e("Main", "Error showing icon: ", e)
        }finally {
            popupMenu.show()
        }
    }
}