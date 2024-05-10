package com.tidycity.code.views

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.widget.ImageView
import android.widget.PopupMenu
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.get
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.tidycity.code.R
import com.tidycity.code.database_utils.DatabaseAccess
import com.tidycity.code.webservices_utils.ExtensionsRetrofit
import com.tidycity.code.utilities.Extensions.isInternetEnabled
import com.tidycity.code.utilities.Extensions.isWifiEnable
import com.tidycity.code.utilities.Extensions.storedInfo
import com.tidycity.code.utilities.Extensions.toast
import com.tidycity.code.utilities.UploadHistoryAdapter


class HistoryActivity : AppCompatActivity() {

    private lateinit var contentList: RecyclerView
    private lateinit var historyAdapter: UploadHistoryAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_history)

        contentList = findViewById(R.id.list)
        contentList.layoutManager = LinearLayoutManager(this)

        historyAdapter = UploadHistoryAdapter(
            this@HistoryActivity,
            object : UploadHistoryAdapter.OptionsMenuClickListener {
                override fun onOptionsMenuClicked(position: Int) {
                    detailsOnClick(position)
                }
            }
        )

        contentList.adapter = historyAdapter

        DatabaseAccess(this@HistoryActivity).getVideoStatus().observe(
            this@HistoryActivity
        ) {
            historyAdapter.setData(it)
        }

        findViewById<TextView>(R.id.btnGoBack).setOnClickListener {
            val extras = intent.extras
            val intent = Intent(this@HistoryActivity, HomeActivity::class.java)
            if (extras != null) {
                intent.putExtra("email", extras.getString("email"))
                intent.putExtra("username", extras.getString("username"))
            }
            startActivity(intent)
            finish()
        }
    }

    private fun detailsOnClick(position: Int) {

        // create object of PopupMenu and pass context and view where we want to show the popup menu
        val popupMenu = PopupMenu(this, contentList[position].findViewById(R.id.details))

        // add popup menu
        popupMenu.inflate(R.menu.menu_options)

        // check the upload status to change icon
        (if (historyAdapter.uploadedHistory[position].currentStatus == "uploaded") {
            getDrawable(R.drawable.ic_baseline_cloud_done_24)
        } else getDrawable(R.drawable.ic_baseline_cloud_upload_24)).also { popupMenu.menu.getItem(0).icon = it }

        // check the upload status to change tittle
        popupMenu.menu.getItem(0).title = if (!historyAdapter.uploadedHistory[position].
            currentStatus.contains("!")) {
            getString(R.string.uploaded)
        } else getString(R.string.tap_to_upload)

        // implement on menu item click Listener
        popupMenu.setOnMenuItemClickListener(object : PopupMenu.OnMenuItemClickListener {
            override fun onMenuItemClick(item: MenuItem?): Boolean {
                when (item?.itemId) {
                    R.id.maps -> {
                        // here are the logic to delete an item from the list
//                        openMap(historyAdapter.uploadedHistory[position].videoName)
                        toast("Still in development")
                        return true
                    }
                    R.id.status -> {
                        if (historyAdapter.uploadedHistory[position].currentStatus.contains("!")) {
                            when (storedInfo(this@HistoryActivity,false, null)) {
                                "WIFI" -> {
                                    if (isWifiEnable() && isInternetEnabled()) {
                                        ExtensionsRetrofit(this@HistoryActivity)
                                            .uploadFiles(historyAdapter.uploadedHistory[position].videoName)

                                        contentList[position].findViewById<ImageView>(R.id.details).visibility =
                                            View.GONE
                                        contentList[position].findViewById<ProgressBar>(R.id.circularProgressbar).visibility =
                                            View.VISIBLE
                                    }
                                    else if (!isInternetEnabled()){
                                        toast("Don't have internet connection")
                                    }
                                    else toast("Your internet connectivity doesn't match with your settings")

                                }
                                "ALL" -> {
                                    if (isInternetEnabled()) {
                                        ExtensionsRetrofit(this@HistoryActivity)
                                            .uploadFiles(historyAdapter.uploadedHistory[position].videoName)

                                        contentList[position].
                                            findViewById<ImageView>(R.id.details).visibility = View.GONE
                                        contentList[position].
                                            findViewById<ProgressBar>(R.id.circularProgressbar).visibility = View.VISIBLE
                                    }
                                    else toast("Your internet connectivity doesn't match with your settings")
                                }
                            }
                        }
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
                .getDeclaredMethod("setForceShowIcon", Boolean::class.java)
                .invoke(mPopup, true)
        } catch (e: Exception) {
            Log.e("Main", "Error showing icon: ", e)
        } finally {
            popupMenu.show()
        }
    }

    private fun openMap(videoFile: String) {
        val intent = Intent(this, MapActivity::class.java)
        intent.putExtra("videoID", videoFile)
        startActivity(intent)
    }
}