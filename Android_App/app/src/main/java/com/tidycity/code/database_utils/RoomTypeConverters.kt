package com.tidycity.code.database_utils

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import androidx.room.TypeConverter
import com.google.gson.Gson
import java.io.ByteArrayOutputStream

class RoomTypeConverters{

//    @TypeConverter
//    fun convertStatusListToJSONString(statusList: StatusList): String = Gson().toJson(statusList)
//
//    @TypeConverter
//    fun convertJSONStringToStatusList(jsonString: String): StatusList = Gson().fromJson(jsonString,StatusList::class.java)

    @TypeConverter
    fun fromBitmap(bitmap: Bitmap): ByteArray {
        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream)
        return outputStream.toByteArray()
    }

    @TypeConverter
    fun toBitmap(byteArray: ByteArray): Bitmap {
        return BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)
    }

}