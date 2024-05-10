package com.tidycity.code.database_utils

import android.content.Context
import androidx.lifecycle.LiveData
import com.tidycity.code.dataclasses_prototypes.Prototypes

/**
 * Database access
 *
 * @constructor
 *
 * @param context
 */
class DatabaseAccess(context: Context) {

    private val db by lazy {
        DatabaseDefinition.getDatabase(
            context
        )
    }

    /**
     * Clear tables
     *
     */
    fun clearTables() {
        db.clearAllTables()
    }

    suspend fun saveVideo(
        videoName: String,
        videoDate: String,
        user: String,
        currentStatus: String,
        uploadProgress: Int,
        frameLength: Int,
    ) {
        db.daoVideoMethods().insertVideoID(
            VideoStructure(
                videoName = videoName,
                user = user,
                startDate = videoDate,
                endDate = "",
                currentStatus = currentStatus,
                progress = uploadProgress,
                totalFrames = frameLength,
                uploadedFrames = 0
            )
        )
    }

    suspend fun saveFrame(
        frameName: String,
        videoId: String,
        framePath: String,
        coordinates: Prototypes.DbCoordinates,
        classes: String,
        ) {
        db.daoVideoMethods().insertFrame(
            FrameStructure(
                frameId = "Frame_$frameName",
                videoNameID = videoId,
                frameDate = frameName,
                framePath = framePath,
                latitude = coordinates.lat,
                longitude = coordinates.long,
                classes = classes,
            )
        )
    }

    /**
     * Get d b value
     *
     * @return
     */
    fun getVideoContent(): List<VideoStructure> {
        return db.daoVideoMethods().getVideoContent()
    }

    suspend fun getVideoToUpload(key:String): VideoWithFrames {
        return db.daoVideoMethods().getSpecificVideo(key)
    }

    fun updateUploadStatus(key:String, uploadingStatus: String){
        db.daoVideoMethods().updateStatus(key, uploadingStatus)
    }

    fun updateFinishDate(key: String,  endDate: String){
        db.daoVideoMethods().updateEndDate(key, endDate)
    }

    fun updateFramesLength(key: String, framesLength: Int){
        db.daoVideoMethods().updateAcquiredFrames(key, framesLength)
    }

    fun updateUploadPercentage(key: String, percentage: Int){
        db.daoVideoMethods().updatePercentage(key, percentage)
    }

    fun updateUploadedFrames(key: String, framesUploaded: Int){
        db.daoVideoMethods().updateUploadedFrames(key, framesUploaded)
    }


    fun getTotalFrames(key:String): Prototypes.DbNumberOfFrames {
        return db.daoVideoMethods().getTotalFrames(key)
    }

    fun getVideoStatus(): LiveData<List<Prototypes.DbUploadMenu>> {
        return db.daoVideoMethods().getUploadStatus()
    }

    fun getUploadedFrames(key: String): Prototypes.DbNumberOfUploadedFrames {
        return db.daoVideoMethods().getUploadedFrames(key)
    }

    suspend fun uploadVideo(): List<Prototypes.DbCheckVideoToUpload> {
        return db.daoVideoMethods().uploadStatus()
    }

    fun deleteFrameRow(key:String){
        db.daoVideoMethods().deleteFrameContent(key)
    }

    fun deleteVideoRow(key:String){
        db.daoVideoMethods().deleteVideoContent(key)
    }

    /** -------------------- Access to user methods ---------------------------------------*/
    suspend fun addUser(email: String, user: String, password: String) {
        // insert new user into database
        db.daoUserMethods().insertUser(
            UserStructure(
                email = email,
                user = user,
                pwd = password,
            )
        )
    }

    fun getUser(email: String): String {
        return db.daoUserMethods().getUserName(email)

    }

    /** -------------------- Access to credentials methods --------------------------------*/
    suspend fun saveAuthCredentials(email: String, type: String, token: String){
        db.daoCredentialsMethods().insertCredentials(
            CredentialStructure(
                email = email,
                serverTokenType = type,
                serverToken = token
            )
        )
    }

    fun getServerAuthCredentials(email: String): Prototypes.DbUploadRfCredentials {
        return db.daoCredentialsMethods().getServerCredentials(email)
    }
}