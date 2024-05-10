package com.tidycity.code.database_utils

import android.graphics.Bitmap
import androidx.room.*

/**
 * https://stackoverflow.com/questions/73446959/how-to-store-a-list-field-in-android-room
 */


@Entity
data class VideoStructure(
    @PrimaryKey val videoName: String,
    val user: String,
    val startDate: String,
    val endDate: String,
    val currentStatus: String,
    val progress: Int,
    val totalFrames: Int,
    val uploadedFrames:Int,
)

@Entity
data class FrameStructure(
    @PrimaryKey val frameId: String,
    val videoNameID: String,
    val frameDate: String,
    val framePath: String,
    val latitude: Double?,
    val longitude: Double?,
    val classes: String,
)

@Entity
data class VideoWithFrames(
    @Embedded val video: VideoStructure,
    @Relation(
        parentColumn = "videoName",
        entityColumn = "videoNameID",
    )
    val frames: List<FrameStructure>
)

@Entity
data class UserStructure(
    @PrimaryKey val email: String,
    val user: String,
    val pwd: String,
)

@Entity
data class CredentialStructure(
    @PrimaryKey val email: String,
    val serverTokenType: String,
    val serverToken: String
)

//data class StatusCharacteristic(
//    var date:String,
//    var lat: Double,
//    var long: Double,
//    var classes: String?
//)
//
//data class StatusList(
//    var specs: List<StatusCharacteristic>
//)
//
//@Entity
//data class StatusStructure(
//    @PrimaryKey val uid: String,
//    @ColumnInfo(name = "status") val status: Boolean,
//    @ColumnInfo(name = "map location") val statusList: StatusList
//)

