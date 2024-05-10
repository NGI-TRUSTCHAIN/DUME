package com.tidycity.code.database_utils

import androidx.lifecycle.LiveData
import androidx.room.*
import com.tidycity.code.dataclasses_prototypes.Prototypes

@Dao
interface VideoMethods {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertVideoID(videoStructure: VideoStructure)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFrame(frameStructure: FrameStructure)

    @Query("UPDATE VideoStructure SET currentStatus=:newUploadingStatus WHERE videoName=:key")
    fun updateStatus(key:String, newUploadingStatus:String)

    @Query("UPDATE VideoStructure SET endDate=:endDate WHERE videoName=:key")
    fun updateEndDate(key:String,  endDate: String)

    @Query("UPDATE VideoStructure SET totalFrames=:frameNumber WHERE videoName=:key")
    fun updateAcquiredFrames(key:String, frameNumber:Int)

    @Query("UPDATE VideoStructure SET progress=:percentage WHERE videoName=:key")
    fun updatePercentage(key:String, percentage:Int)

    @Query("UPDATE VideoStructure SET uploadedFrames=:framesUploaded WHERE videoName=:key")
    fun updateUploadedFrames(key:String, framesUploaded:Int)

    @Query("SELECT videoName, startDate, currentStatus, progress FROM VideoStructure")
    fun getUploadStatus(): LiveData<List<Prototypes.DbUploadMenu>>

    @Query("SELECT  totalFrames FROM VideoStructure WHERE videoName=:key")
    fun getTotalFrames(key:String): Prototypes.DbNumberOfFrames

    @Query("SELECT uploadedFrames FROM VideoStructure WHERE videoName=:key")
    fun getUploadedFrames(key:String): Prototypes.DbNumberOfUploadedFrames

    @Query("SELECT videoName, startDate, VideoStructure.currentStatus FROM VideoStructure")
    suspend fun uploadStatus(): List<Prototypes.DbCheckVideoToUpload>

    @Query("DELETE FROM VideoStructure WHERE videoName=:key")
    fun deleteVideoContent(key:String)

    @Query("DELETE FROM FrameStructure WHERE framePath=:key")
    fun deleteFrameContent(key:String)

    @Transaction
    @Query("SELECT * FROM VideoStructure")
    fun getVideoContent(): List<VideoStructure>

    @Transaction
    @Query("SELECT * FROM VideoStructure WHERE videoName=:key")
    suspend fun getSpecificVideo(key:String):VideoWithFrames
}

@Dao
interface UserMethods {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(userStructure: UserStructure)

    @Query("SELECT user FROM UserStructure WHERE email=:userEmail")
    fun getUserName(userEmail:String):String
}


@Dao
interface CredentialMethods {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCredentials(credentialStructure: CredentialStructure)

    @Query("SELECT serverTokenType, serverToken FROM CredentialStructure WHERE email=:userEmail")
    fun getServerCredentials(userEmail: String): Prototypes.DbUploadRfCredentials
}