package com.tidycity.code.webservices_utils

import android.content.Context
import android.util.Log
import com.tidycity.code.database_utils.DatabaseAccess
import com.tidycity.code.database_utils.FrameStructure
import com.tidycity.code.dataclasses_prototypes.Prototypes
import com.tidycity.code.utilities.Extensions
import com.tidycity.code.utilities.Extensions.writeJsonFile
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File


class ExtensionsRetrofit(private val context: Context) {

    private lateinit var token: String
    private lateinit var numberOfFrames: Prototypes.DbNumberOfFrames

    private var framesUploaded: Int = 0

    // define value to split list into sublist
    private val sizeToSplit = 30

    fun uploadFiles(specificVideo: String) {
        GlobalScope.launch {
            withContext(Dispatchers.Default) {
                val content = DatabaseAccess(context).getVideoToUpload(specificVideo)
                if (content.frames.isNotEmpty()) {

                    // check if user has valid token
                    checkToken(
                        Prototypes.RfParametersToUpload(
                            content.video.user,
                            content.video.videoName,
                            content.video.startDate,
                            content.video.endDate,
                            content.frames,
                            null
                        )
                    )
                } else
                    DatabaseAccess(context)
                        .updateUploadStatus(
                            specificVideo,
                            "uploaded"
                        )
            }
        }
    }

    private fun checkToken(uploadParams: Prototypes.RfParametersToUpload) {
        val credentials = DatabaseAccess(context).getServerAuthCredentials(uploadParams.user)
        if (credentials != null) {
            credentials.let {
                if (credentials.isNotFilled)
                    requestToken(uploadParams)
                else {
                    token = "${credentials.serverTokenType} ${credentials.serverToken}"
                    GlobalScope.launch {
                        val response: Response<Prototypes.RfTokenValidation> = RetrofitInterface()
                            .validateToken(token).execute()
                        Log.e("Token Validation Response", response.code().toString())
                        if (response.code() == 226) {
                            /* update video uploading status */
                            DatabaseAccess(context).updateUploadStatus(
                                uploadParams.videoId,
                                "uploading"
                            )

                            uploadMultipleFile(
                                uploadParams.user, uploadParams.videoId, uploadParams.startDate,
                                uploadParams.videoDateEnd, uploadParams.frames, token
                            )
                        } else
                            requestToken(uploadParams)
                    }
                }
            }
        } else
            requestToken(uploadParams)
    }


    private fun requestToken(uploadParams: Prototypes.RfParametersToUpload) {
        RetrofitInterface().getToken(uploadParams.user)
            .enqueue(object : Callback<Prototypes.RfTokenResponse> {
                override fun onResponse(
                    call: Call<Prototypes.RfTokenResponse>,
                    response: Response<Prototypes.RfTokenResponse>
                ) {
                    Log.e("Retrofit on Response", response.code().toString())
                    if (response.code() == 202) {

                        // save credentials into DB
                        GlobalScope.launch {
                            DatabaseAccess(context).saveAuthCredentials(
                                uploadParams.user,
                                response.body()!!.token_type.replaceFirstChar { it.uppercase() },
                                response.body()!!.access_token
                            )
                        }

                        // update video uploading status
                        DatabaseAccess(context).updateUploadStatus(
                            uploadParams.videoId,
                            "uploading"
                        )

                        // create string with format bearer token
                        token = "${
                            response.body()!!.token_type
                                .replaceFirstChar { it.uppercase() }
                        } ${response.body()!!.access_token}"
                        Log.d("token", token)

                        GlobalScope.launch {
                            withContext(Dispatchers.IO) {
                                uploadMultipleFile(
                                    uploadParams.user, uploadParams.videoId, uploadParams.startDate,
                                    uploadParams.videoDateEnd, uploadParams.frames, token
                                )
                            }
                        }
                    }
                }

                override fun onFailure(call: Call<Prototypes.RfTokenResponse>, t: Throwable) {
                    Log.e("Retrofit On Failure", t.message.toString())
                    DatabaseAccess(context).updateUploadStatus(
                        uploadParams.videoId,
                        "!uploading"
                    )
                }
            })
    }


    private fun String.prepareFilePart(framePath: String): MultipartBody.Part? {

        val file = File(framePath)

        Log.e("File", "$framePath")

        if (!file.exists())
            return null

        // create RequestBody instance from file
        val requestFile: RequestBody = file
            .asRequestBody("${this}/*}".toMediaTypeOrNull())

        // MultipartBody.Part is used to send also the actual file name
        return MultipartBody.Part.createFormData(this, file.name, requestFile)
    }

    private fun uploadMultipleFile(
        user: String,
        videoId: String,
        videoStartDate: String,
        videoDateEnd: String,
        frameContent: List<FrameStructure>,
        authToken: String
    ) {
        // initialize lists to upload multiple files
        var allFrames = mutableListOf<MultipartBody.Part>()
        var allPaths = mutableListOf<String>()

        // initialize variable to store frame metadata
        var frameMetadata = mutableListOf<Prototypes.JsFrameDict>()

        // initialize variable to send metadata to server
        var metadata: MultipartBody.Part?

        // sort list of frames by id
        frameContent.sortedBy { it.frameId }

        // append different content for each respective list
        frameContent.forEach {
            val preparedFile = "files".prepareFilePart(it.framePath)

            if (preparedFile != null) {

                allFrames.add(preparedFile)
                allPaths.add(it.framePath)

                // store frame info to metadata list
                frameMetadata.add(
                    Prototypes.JsFrameDict(
                        id = it.frameId
                            .replace(":", "_")
                            .replace(".", "_"),
                        user = user,
                        date = it.frameDate,
                        coordinates = Prototypes.JsCoordinatesDict(
                            lat = it.latitude,
                            long = it.longitude
                        ),
                        classes = it.classes
                    )
                )
            } else {
                DatabaseAccess(context).updateFramesLength(
                    key = videoId,
                    framesLength = (DatabaseAccess(context).getTotalFrames(videoId).totalFrames - 1)
                )

                DatabaseAccess(context).deleteFrameRow(it.framePath)
            }
        }

        metadata = writeJsonFile(
            Prototypes.JsMetadataDict(
                video = Prototypes.JsVideoDict(
                    id = videoId
                        .replace(":", "_")
                        .replace(".", "_"),
                    user = user,
                    dateStart = videoStartDate,
                    dateEnd = videoDateEnd
                ),
                frames = frameMetadata
            )
        )

        // split lists with the size specified above
//        val allLocationsSubList = allLocations.chunked(sizeToSplit)
//        val allClassesSubList = allClasses.chunked(sizeToSplit)
        val allFramesSubList = allFrames.chunked(sizeToSplit)
        val allPathsSubList = allPaths.chunked(sizeToSplit)

        // declare variables to use in upload progress in Upload History Activity
        numberOfFrames = DatabaseAccess(context).getTotalFrames(videoId)
        framesUploaded = DatabaseAccess(context).getUploadedFrames(videoId).uploadedFrames
        Log.e("framesUploadingDB", "$framesUploaded")

        // iterate over the indices to send list of files split
        try {
            run outForeach@{
                allFramesSubList.indices.forEach {
//                    if (it != 0 || framesUploaded != 0)
//                        metadata = null
                    Log.d("iteration", "entering")
                    val response: Response<Prototypes.RfFileResponse> = RetrofitInterface()
                        .uploadVideoServer(
                            token = authToken,
                            username = user,
                            identifier = videoId,
                            videoMetadata = metadata,
                            Frames = allFramesSubList[it]
                        ).execute()
                    if (response.isSuccessful) {
                        when (response.code()) {
                            201 -> {

                                GlobalScope.launch {
                                    if (DatabaseAccess(context).getVideoToUpload(videoId).video.currentStatus == "!uploading")
                                        DatabaseAccess(context)
                                            .updateUploadStatus(
                                                videoId,
                                                "uploading"
                                            )
                                }


                                // update Database parameters like uploaded percentage and
                                // delete frames uploaded
                                updateDBParams(
                                    allFramesSubList[it].size,
                                    videoId,
                                    allPathsSubList[it]
                                )

                                // when all frames have been uploaded successfully change the status of
                                // the video to uploaded successfully
                                if (framesUploaded == numberOfFrames.totalFrames) {
                                    DatabaseAccess(context)
                                        .updateUploadStatus(
                                            videoId,
                                            "uploaded"
                                        )
                                }
                            }
                            // if response code different from above probably means that the server is offline
                            // or received to many requests
                            else -> {
                                DatabaseAccess(context).updateUploadStatus(
                                    videoId,
                                    "!uploading"
                                )
                                return@outForeach
                            }
                        }
                    } else Log.e("Host Connection", "Failed to connect to host")
                }
            }
        } catch (ex: Exception) {
            ex.printStackTrace()
            DatabaseAccess(context).updateUploadStatus(
                videoId,
                "!uploading"
            )
        }
    }

    private fun updateDBParams(framesUpload: Int, videoId: String, framesToDelete: List<String>) {
        // add the value of uploaded files
        framesUploaded += framesUpload

        Log.e("TotalFrames", "${numberOfFrames.totalFrames}")
        Log.e("framesUpload", "$framesUploaded")

        // calculate the percentage of files uploaded
        val uploadPercentage = ((framesUploaded * 100) / numberOfFrames.totalFrames)

        Log.e("Uploading Percent", "$uploadPercentage")

        // update the video upload percentage
        DatabaseAccess(context).updateUploadPercentage(videoId, uploadPercentage)

        // update the framesUploaded value to help when upload restart
        DatabaseAccess(context).updateUploadedFrames(videoId, framesUploaded)

        // delete file in memory
        Extensions.deletePicture(framesToDelete)

        // delete frame from FrameStructure Database
        framesToDelete.forEach { frame ->
            DatabaseAccess(context).deleteFrameRow(frame)
        }
    }

    fun createAccount(credentials: Prototypes.CreateAccountParams) {
        RetrofitInterface().createAccount(credentials)
            .enqueue(object : Callback<Prototypes.RfCreateAccountResponse> {
                override fun onResponse(
                    call: Call<Prototypes.RfCreateAccountResponse>,
                    response: Response<Prototypes.RfCreateAccountResponse>
                ) {
                    Log.e("Retrofit on Response", response.code().toString())
                    Log.e("Retrofit on Response", response.message())


//                        // create string with format bearer token
//                        token = "${
//                            response.body()!!.token_type
//                                .replaceFirstChar { it.uppercase() }
//                        } ${response.body()!!.access_token}"
//                        Log.d("token", token)
                }

                override fun onFailure(
                    call: Call<Prototypes.RfCreateAccountResponse>,
                    t: Throwable
                ) {
                    Log.e("Retrofit On Failure", t.message.toString())
                }
            })
    }

    fun authenticateAccount(credentials: Prototypes.SignInParams) {
        RetrofitInterface().signIn(credentials)
            .enqueue(object : Callback<Prototypes.RfSignResponse> {
                override fun onResponse(
                    call: Call<Prototypes.RfSignResponse>,
                    response: Response<Prototypes.RfSignResponse>
                ) {
                    Log.e("Retrofit on Response", response.code().toString())
                    Log.e("Retrofit on Response", response.message())
                }

                override fun onFailure(call: Call<Prototypes.RfSignResponse>, t: Throwable) {
                    Log.e("Retrofit On Failure", t.message.toString())
                }
            })
    }

    fun solid() {
        RetrofitInterface("https://andre.dume-arditi.com/").testSolid("nssidp.sid=s%3AORr5YZBHcNEtwxgw7UtWRxJRlxSfN5BT.PKp1LijAG7ETcbr8LaB3SHyQGJnScWJWUKSkPlSW%2FL4")
            .enqueue(
                object : Callback<Any> {
                    override fun onResponse(
                        call: Call<Any>,
                        response: Response<Any>
                    ) {
                        Log.e("Retrofit on Response", response.code().toString())
                        Log.e("Retrofit on Response", response.message())
                    }

                    override fun onFailure(call: Call<Any>, t: Throwable) {
                        Log.e("Retrofit On Failure", t.message.toString())
                    }
                })

    }

    fun solidAuth() {
        RetrofitInterface("https://dume-arditi.com/").testAuth(
            username = "test1",
            password = "Test1234!"
        ).enqueue(
            object : Callback<String> {
                override fun onResponse(
                    call: Call<String>,
                    response: Response<String>
                ) {
                    Log.e("Retrofit on Response", response.code().toString())
                    Log.e("Retrofit on Response", response.message())
                    Log.i("Response Headers", "${response.headers()}")

                    try {
                        val Cookielist = response.headers().values("Set-Cookie")
                        Cookielist.forEach {
                            Log.i("cookie", it)
                        }
                        val jsessionid =
                            Cookielist[0].split(";".toRegex()).dropLastWhile { it.isEmpty() }
                                .toTypedArray()[0]



                    }
                    catch (e: Exception) {
                        e.printStackTrace()
                    }



                }

                override fun onFailure(call: Call<String>, t: Throwable) {
                    Log.e("Retrofit On Failure", t.stackTraceToString())
                }
            })

    }


//    private fun uploadToBucket(urls:List<String>, files:List<String>){
//        val CONTENT_IMAGE = "image/jpeg"
//        val file = File("${context.externalMediaDirs[0]}/2023-03-22T15_06_30.107.jpg") // create new file on device
//
//        val requestFile: RequestBody = file.asRequestBody(CONTENT_IMAGE.toMediaTypeOrNull())
//
//        val url = "https://tidycity-frames.s3.amazonaws.com/server-api/app/Image_DB/andre_torneiro12_gmail_com/Video_1/Frame_1.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4RQD45KCV6AFXSPA%2F20230325%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230325T152222Z&X-Amz-Expires=1000&X-Amz-SignedHeaders=host&X-Amz-Signature=e1d049016defaf09745cb6d14fa53ee86cafde6813b3ba6783c4edb51a57f0b8"
////        RequestBody.create(MediaType.parse("image/jpeg"), file);
////                val requestBody = AwsServices().InputStreamRequestBody(contentResolver, file)
//        RetrofitInterface().uploadFileAWS(url, requestFile).enqueue(object :
//            Callback<Void> {
//            override fun onResponse(call: Call<Void>, response: Response<Void>) {
//                Log.e("Retrofit on Response", response.code().toString())
//                Log.e("Retrofit on Response", response.body().toString())
//
//            }
//            override fun onFailure(call: Call<Void>, t: Throwable) {
//                Log.e("Retrofit On Failure", t.message.toString())
//            }
//        })
//
//    }
}
