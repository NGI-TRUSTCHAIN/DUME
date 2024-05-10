package com.tidycity.code.webservices_utils

import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider
import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.deleteBucket
import aws.sdk.kotlin.services.s3.deleteObject
import aws.sdk.kotlin.services.s3.model.ListObjectsRequest
import aws.sdk.kotlin.services.s3.model.PutObjectRequest
import aws.smithy.kotlin.runtime.content.asByteStream
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

class AwsServices {

    suspend fun cleanUp(s3: S3Client) {
        println("Deleting object $BUCKET/$KEY...")
        s3.deleteObject {
            bucket = BUCKET
            key = KEY
        }
        println("Object $BUCKET/$KEY deleted successfully!")
        println("Deleting bucket $BUCKET...")
        s3.deleteBucket {
            bucket = BUCKET
        }
    }

    suspend fun listBucketObjects() {

        val request = ListObjectsRequest {
            bucket = "tidycity-frames"
        }
        withContext(Dispatchers.IO) {
            S3Client {
                region = REGION
                credentialsProvider = staticCredentials
            }.use { s3 ->

                val response = s3.listObjects(request)
                response.contents?.forEach { myObject ->
                    println("The name of the key is ${myObject.key}")
                    println("The object is ${calKb(myObject.size)} KBs")
                    println("The owner is ${myObject.owner}")
                }
            }
        }
    }

    private fun calKb(intValue: Long): Long = intValue / 1024

    // snippet-start:[s3.kotlin.s3_object_upload.main]
    suspend fun putS3Object(bucketName: String, objectKey: String, objectPath: String) {
        withContext(Dispatchers.IO) {
            val metadataVal = mutableMapOf<String, String>()
            metadataVal["myVal"] = "test"
            print(File(objectPath).exists())
            val request = PutObjectRequest {
                bucket = bucketName
                key = "User1/Video1/test.json"
                metadata = metadataVal
                body = File(objectPath).asByteStream()
            }

            S3Client {
                region = REGION
                credentialsProvider = staticCredentials
            }.use { s3 ->
                val response = s3.putObject(request)
                println("Tag information is $response")
            }
        }
    }
    companion object {
        const val REGION = "eu-west-2"
        const val BUCKET = "tidycity-frames"
        const val KEY = ""
        val staticCredentials = StaticCredentialsProvider {
            accessKeyId = ""
            secretAccessKey = ""
        }
    }
}