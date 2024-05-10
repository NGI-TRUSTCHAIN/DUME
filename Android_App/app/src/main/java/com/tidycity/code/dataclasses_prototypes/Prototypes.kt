package com.tidycity.code.dataclasses_prototypes

import com.tidycity.code.database_utils.FrameStructure

sealed class Prototypes {

    // dictionary prototypes to write json file
    data class JsVideoDict(
        val id: String, val user: String,
        val dateStart: String, val dateEnd: String
    )

    data class JsFrameDict(
        val id: String, val user: String, val date: String,
        val coordinates: JsCoordinatesDict, val classes: String
    )

    data class JsCoordinatesDict(val lat: Double?, val long: Double?)

    data class JsMetadataDict(val video: JsVideoDict, val frames: List<JsFrameDict>)

    // Database prototypes
    data class DbUploadMenu(
        val videoName: String, val startDate: String, val currentStatus: String,
        val progress: Int
    )

    data class DbCheckVideoToUpload(
        val videoName: String, val startDate: String,
        val currentStatus: String
    )

    data class DbNumberOfFrames(val totalFrames: Int)
    data class DbNumberOfUploadedFrames(val uploadedFrames: Int)
    data class DbUploadRfCredentials(val serverTokenType: String, val serverToken: String) {
        val isNotFilled get() = serverTokenType == "" || serverToken == ""
    }

    data class DbCoordinates(var lat: Double?, var long: Double?)

    // Retrofit prototypes
    data class RfTokenResponse(val token_type: String, val access_token: String)
    data class RfParametersToUpload(
        val user: String, val videoId: String, val startDate: String,
        val videoDateEnd: String, val frames: List<FrameStructure>,
        val token: String?
    )

    data class RfFileResponse(val Message: String)
    data class RfTokenValidation(val detail: String)

    data class CreateAccountParams(
        val email: String,
        val password: String
    )

    data class RfCreateAccountResponse(val message: String)

    data class SignInParams(
        val email: String,
        val password: String
    )

    data class RfSignResponse(val tokenType: String, val accessToken: String)

    data class LoginSolidParams(
        val username: String,
        val password: String
    )
}
