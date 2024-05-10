package com.tidycity.code.views

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.PopupMenu
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.get
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.tabs.TabItem
import com.google.android.material.tabs.TabLayout
import com.tidycity.code.R
import com.tidycity.code.database_utils.DatabaseAccess
import com.tidycity.code.utilities.Extensions
import com.tidycity.code.utilities.Extensions.isInternetEnabled
import com.tidycity.code.utilities.Extensions.isWifiEnable
import com.tidycity.code.utilities.Extensions.toast
import com.tidycity.code.utilities.PodAccessAdapter
import com.tidycity.code.utilities.UploadHistoryAdapter
import com.tidycity.code.webservices_utils.ExtensionsRetrofit

class PodAccessActivity : AppCompatActivity() {

    private lateinit var tabLayout: TabLayout
    private lateinit var contentList: RecyclerView
    private lateinit var historyAdapter: PodAccessAdapter
    private lateinit var backButton: ImageView


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pod_access)

        tabLayout = findViewById(R.id.tabLayout)

        for (i in 1..4) {
            val tab = tabLayout.newTab()
            val tabItemView = LayoutInflater.from(this).inflate(R.layout.custom_tab_item, null)
            val tabTitle = tabItemView.findViewById<TextView>(R.id.tabTitle)

            when (i) {
                1 -> tabTitle.text = "All"
                2 -> tabTitle.text = "Allowed"
                3 -> tabTitle.text = "Pending"
                4 -> tabTitle.text = "Denied"
            }

            tab.customView = tabItemView
            tabLayout.addTab(tab)
        }


        // Define a TabLayout.OnTabSelectedListener
        val tabSelectedListener = object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                // Get the custom view of the selected tab
                val customView = tab?.customView
                customView?.let {
                    // Find the TextView inside the custom view
                    val tabTitle = it.findViewById<TextView>(R.id.tabTitle)
                    // Update the text color of the TextView
                    tabTitle.setTextColor(
                        ContextCompat.getColor(
                            this@PodAccessActivity,
                            R.color.purple_700
                        )
                    )
                }
            }

            override fun onTabUnselected(tab: TabLayout.Tab?) {
                // Get the custom view of the unselected tab
                val customView = tab?.customView
                customView?.let {
                    // Find the TextView inside the custom view
                    val tabTitle = it.findViewById<TextView>(R.id.tabTitle)
                    // Update the text color of the TextView
                    tabTitle.setTextColor(
                        ContextCompat.getColor(
                            this@PodAccessActivity,
                            R.color.black
                        )
                    )
                }
            }

            override fun onTabReselected(tab: TabLayout.Tab?) {
                // No action needed when reselecting a tab
            }

        }
        // Set the tabSelectedListener to the TabLayout
        tabLayout.addOnTabSelectedListener(tabSelectedListener)

        contentList = findViewById(R.id.list)
        contentList.layoutManager = LinearLayoutManager(this)

        historyAdapter = PodAccessAdapter(
            this@PodAccessActivity,
        )

        contentList.adapter = historyAdapter

        val videoStatusList = listOf("Status 1", "Status 2", "Status 3", "Status 3", "Status 3", "Status 3", "Status 3","Status 3")
        historyAdapter.setData(videoStatusList)

        backButton = findViewById(R.id.backIcon)
        backButton.setOnClickListener {
            val intent = Intent(this@PodAccessActivity, HomeActivity::class.java)
            startActivity(intent)
        }
    }

//    private fun detailsOnClick(position: Int) {
//
//        // create object of PopupMenu and pass context and view where we want to show the popup menu
//        val popupMenu = PopupMenu(this, contentList[position].findViewById(R.id.details))
//
//        // add popup menu
//        popupMenu.inflate(R.menu.menu_options)
//
//        // check the upload status to change icon
//        (if (historyAdapter.uploadedHistory[position].currentStatus == "uploaded") {
//            getDrawable(R.drawable.ic_baseline_cloud_done_24)
//        } else getDrawable(R.drawable.ic_baseline_cloud_upload_24)).also { popupMenu.menu.getItem(0).icon = it }
//
//        // check the upload status to change tittle
//        popupMenu.menu.getItem(0).title = if (!historyAdapter.uploadedHistory[position].
//            currentStatus.contains("!")) {
//            getString(R.string.uploaded)
//        } else getString(R.string.tap_to_upload)
//
//        // implement on menu item click Listener
//        popupMenu.setOnMenuItemClickListener(object : PopupMenu.OnMenuItemClickListener {
//            override fun onMenuItemClick(item: MenuItem?): Boolean {
//                when (item?.itemId) {
//                    R.id.maps -> {
//                        // here are the logic to delete an item from the list
////                        openMap(historyAdapter.uploadedHistory[position].videoName)
//                        toast("Still in development")
//                        return true
//                    }
//                    R.id.status -> {
//                        if (historyAdapter.uploadedHistory[position].currentStatus.contains("!")) {
//                            when (Extensions.storedInfo(this@PodAccessActivity, false, null)) {
//                                "WIFI" -> {
//                                    if (isWifiEnable() && isInternetEnabled()) {
//                                        ExtensionsRetrofit(this@PodAccessActivity)
//                                            .uploadFiles(historyAdapter.uploadedHistory[position].videoName)
//
//                                        contentList[position].findViewById<ImageView>(R.id.details).visibility =
//                                            View.GONE
//                                        contentList[position].findViewById<ProgressBar>(R.id.circularProgressbar).visibility =
//                                            View.VISIBLE
//                                    }
//                                    else if (!isInternetEnabled()){
//                                        toast("Don't have internet connection")
//                                    }
//                                    else toast("Your internet connectivity doesn't match with your settings")
//
//                                }
//                                "ALL" -> {
//                                    if (isInternetEnabled()) {
//                                        ExtensionsRetrofit(this@PodAccessActivity)
//                                            .uploadFiles(historyAdapter.uploadedHistory[position].videoName)
//
//                                        contentList[position].
//                                        findViewById<ImageView>(R.id.details).visibility = View.GONE
//                                        contentList[position].
//                                        findViewById<ProgressBar>(R.id.circularProgressbar).visibility = View.VISIBLE
//                                    }
//                                    else toast("Your internet connectivity doesn't match with your settings")
//                                }
//                            }
//                        }
//                        return true
//                    }
//                }
//                return false
//            }
//        })
//        try {
//            val field = PopupMenu::class.java.getDeclaredField("mPopup")
//            field.isAccessible = true
//            val mPopup = field.get(popupMenu)
//            mPopup.javaClass
//                .getDeclaredMethod("setForceShowIcon", Boolean::class.java)
//                .invoke(mPopup, true)
//        } catch (e: Exception) {
//            Log.e("Main", "Error showing icon: ", e)
//        } finally {
//            popupMenu.show()
//        }
//    }

}