package com.tidycity.code.views

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.CheckBox
import android.widget.ImageView
import android.widget.RadioButton
import androidx.appcompat.app.AppCompatActivity
import com.tidycity.code.R
import com.tidycity.code.webservices_utils.ExtensionsRetrofit

class SettingsActivity : AppCompatActivity() {

    private lateinit var theiaButton: Button
    private lateinit var solidButton: Button

    private lateinit var uploadConnectivityArray: Array<RadioButton>
    private lateinit var notificationsArray: Array<CheckBox>

    private lateinit var backButton: ImageView


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        theiaButton = findViewById(R.id.theiaApi)
        solidButton = findViewById(R.id.solidPod)

        uploadConnectivityArray = arrayOf(
            findViewById(R.id.WifiButton),
            findViewById(R.id.Wifi_Mobile)
        )

        notificationsArray = arrayOf(
            findViewById(R.id.notifications),
            findViewById(R.id.events),
            findViewById(R.id.annotations),
            findViewById(R.id.invites),
            findViewById(R.id.PodAccess)
        )

        theiaButton.setOnClickListener {
            openSolidBrowser()
        }

        solidButton.setOnClickListener {
            ExtensionsRetrofit(this@SettingsActivity).solidAuth()
        }

        backButton = findViewById(R.id.backIcon)
        backButton.setOnClickListener {
            val intent = Intent(this@SettingsActivity, HomeActivity::class.java)
            startActivity(intent)
        }
    }

    private fun openSolidBrowser(){

        val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(SOLIDPODURL))
        startActivity(browserIntent)
    }

    companion object {
        const val SOLIDPODURL = "https://eelab.dume-arditi.com/"
    }
}