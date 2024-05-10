package com.tidycity.code.webservices_utils

import android.text.TextUtils
import android.util.Log
import com.google.gson.GsonBuilder
import com.tidycity.code.dataclasses_prototypes.Prototypes
import okhttp3.Cookie
import okhttp3.CookieJar
import okhttp3.HttpUrl
import okhttp3.Interceptor
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.converter.scalars.ScalarsConverterFactory
import retrofit2.http.Body
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Headers
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Query
import java.util.concurrent.TimeUnit


const val CONNECT_TIMEOUT = "CONNECT_TIMEOUT"
const val READ_TIMEOUT = "READ_TIMEOUT"
const val WRITE_TIMEOUT = "WRITE_TIMEOUT"

interface RetrofitInterface {

    @Multipart
    @POST("files/")
    fun uploadVideoServer(
        @Header("Authorization") token: String,
        @Part("username") username: String,
        @Part("videoId") identifier: String,
        @Part videoMetadata: MultipartBody.Part?,
        @Part Frames: List<MultipartBody.Part>,
    ): Call<Prototypes.RfFileResponse>

    @GET("request_token/")
    fun getToken(
        @Query("username") username: String
    ): Call<Prototypes.RfTokenResponse>

    @POST("token_test/")
    fun validateToken(
        @Header("Authorization") token: String,
    ): Call<Prototypes.RfTokenValidation>

    @POST("auth/register")
    fun createAccount(
        @Body request: Prototypes.CreateAccountParams
    ): Call<Prototypes.RfCreateAccountResponse>

    @POST("auth/authenticate")
    fun signIn(
        @Body request: Prototypes.SignInParams
    ): Call<Prototypes.RfSignResponse>

    /***
    Calls for Solid Protocol
     */

    @GET("theia-vision/ledger.rdf")
    fun testSolid(@Header("Cookie") userCookie: String): Call<Any>


    @POST("login/password")
    @Headers("Content-Type: application/x-www-form-urlencoded")
    @FormUrlEncoded
    fun testAuth(
        @Field("username") username: String,
        @Field("password") password: String
    ): Call<String>

    companion object {

        private val interceptor = Interceptor { chain ->
            val request = chain.request()

            var connectTimeout = chain.connectTimeoutMillis()
            var readTimeout = chain.readTimeoutMillis()
            var writeTimeout = chain.writeTimeoutMillis()

            val connect = request.header(CONNECT_TIMEOUT)
            val read = request.header(READ_TIMEOUT)
            val write = request.header(WRITE_TIMEOUT)

            if (!TextUtils.isEmpty(connect)) {
                connectTimeout = connect!!.toInt()
            }

            if (!TextUtils.isEmpty(read)) {
                readTimeout = read!!.toInt()
            }

            if (!TextUtils.isEmpty(write)) {
                writeTimeout = write!!.toInt()
            }

            chain.withConnectTimeout(connectTimeout, TimeUnit.MILLISECONDS)
                .withReadTimeout(readTimeout, TimeUnit.MILLISECONDS)
                .withWriteTimeout(writeTimeout, TimeUnit.MILLISECONDS)
                .proceed(request)

        }
        //show Network information in to the logcat
        val interceptorLogs =  HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }



        private var okHttpClient: OkHttpClient = OkHttpClient.Builder()

            .connectTimeout(3, TimeUnit.MINUTES)
            .readTimeout(3, TimeUnit.MINUTES)
            .writeTimeout(3, TimeUnit.MINUTES)
            .addInterceptor(interceptor)
            .addInterceptor(interceptorLogs)
            .cookieJar(MyCookieJar())
            .build()

        private var BASE_URL = "https://0ff4-85-139-212-19.ngrok-free.app/api/web-services/"

        operator fun invoke(baseUrl: String? = null): RetrofitInterface {

            val url = baseUrl ?: BASE_URL

            val gson = GsonBuilder()
                .setLenient()
                .create()

            return Retrofit.Builder()
                .baseUrl(url)
                .addConverterFactory(ScalarsConverterFactory.create())
                .client(okHttpClient)
                .build()
                .create(RetrofitInterface::class.java)
        }
    }
}

class MyCookieJar : CookieJar {

    val cookieStorage = CookieDataStore()

    override fun saveFromResponse(url: HttpUrl, cookies: List<Cookie>) {
        cookieStorage.storeCookies(cookies)
    }

    override fun loadForRequest(url: HttpUrl): List<Cookie> {
        return  mutableListOf<Cookie>()
    }

}

class CookieDataStore {
    fun storeCookies(cookies: List<Cookie>) {
        Log.d("Cookies", "$cookies")
    }

    fun getCookies(){
        Log.d("Test", "hello")


    }
}