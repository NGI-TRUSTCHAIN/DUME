package com.tidycity.code.views

import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.drawable.BitmapDrawable
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.google.android.gms.maps.model.PolylineOptions
import com.tidycity.code.R
import com.tidycity.code.database_utils.DatabaseAccess
import kotlinx.coroutines.launch


class MapActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var mMap: GoogleMap

    // creating array list for adding all our locations.
    private var videoKey: String? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)

        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.map_fragment) as SupportMapFragment
        mapFragment.getMapAsync(this)

        val extras = intent.extras
        if (extras != null) {
            videoKey = extras.getString("videoID")
        }


    }

    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap

//        lifecycleScope.launch {
//            val locations = videoKey?.let { DatabaseAccess(this@MapActivity)
//                .getVideoSpecs(it) }
//
//            for (location in locations!!.specs) {
//                println(location.classes == "")
//                if (location.classes != "") {
//                    val marker = getMarker(location.classes.toString())
//                    mMap.addMarker(
//                        MarkerOptions().position(LatLng(location.lat, location.long))
//                            .title("Found at ${location.date}")
//                            .icon(BitmapDescriptorFactory.fromBitmap(marker))
//                    )
//                }
//            }
//            val line = PolylineOptions()
//                .add(LatLng(locations.specs[0].lat, locations.specs[0].long),
//                    LatLng(locations.specs[locations.specs.lastIndex].lat, locations.specs[locations.specs.lastIndex].long))
//                .width(5f)
//                .color(Color.MAGENTA)
//                .geodesic(true)
//
//            mMap.addPolyline(line)
//
//            // below lin is use to zoom our camera on map.
//            mMap.animateCamera(CameraUpdateFactory.zoomTo(10.0f))
//
//            // below line is use to move our camera to the specific location.
//            mMap.moveCamera(
//                CameraUpdateFactory.newLatLng(
//                    LatLng(
//                        locations.specs[0].lat,
//                        locations.specs[0].long
//                    )
//                )
//            )
//
//            // below lin is use to zoom our camera on map.
//            mMap.animateCamera(CameraUpdateFactory.zoomTo(10.0f))
//        }
    }

//    private fun getMarker(name: String): Bitmap {
//        println(name)
//        val icon = when (name) {
//            getString(R.string.traffic_signs) -> getDrawable(R.drawable.small_off)
//            getString(R.string.big_container) -> getDrawable(R.drawable.big_off)
//            getString(R.string.underground_container) -> getDrawable(R.drawable.underground_off)
//            getString(R.string.graffiti) -> getDrawable(R.drawable.graf_off)
//            getString(R.string.plastic_bag) -> getDrawable(R.drawable.bag_off)
//            getString(R.string.cardbox) -> getDrawable(R.drawable.box_off)
//            getString(R.string.home_appliances) -> getDrawable(R.drawable.eletro_off)
//            else -> {
//                Log.e("aaa","$name")
//                getDrawable(R.drawable.mob_off)
//            }
//        }
//
//        val bitMapDraw = icon as BitmapDrawable
//        val b = bitMapDraw.bitmap
//        return Bitmap.createScaledBitmap(b, 80, 80, false)
//
//    }
}