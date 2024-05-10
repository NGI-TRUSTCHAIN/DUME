package com.tidycity.code.webservices_utils

class retro_saveFile {
//    @RequiresApi(Build.VERSION_CODES.O)
//    private fun testMultiple(uri: Uri, uri1: Uri) {
//
//        lifecycleScope.launch {
//            val stream = contentResolver.openInputStream(uri) ?: return@launch
//            val request = UploadRequestBody("video/*", stream, onUploadProgress = {
//                Log.d("MyActivity", "On upload progress $it")
//            })
//            val filePart = MultipartBody.Part.createFormData(
//                "files",
//                "video.mp4",
//                request,
//            )
//
//            val stream1 = contentResolver.openInputStream(uri1) ?: return@launch
//            val request1 = UploadRequestBody("*/*", stream1, onUploadProgress = {
//                Log.d("MyActivity", "On upload progress $it")
//            })
//            val filePart1 = MultipartBody.Part.createFormData(
//                "files",
//                "cam_intrinsics.txt",
//                request1
//            )
//
//            Retrofit_Interface().uploadfiles(filePart, filePart1, user!!).enqueue(object : Callback<ResponseBody> {
//                override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
//
//                    println(response.code())
//                    if (response.code()==201) {
//                        Log.d(TAG, "server contacted and has file")
//                        println(response.body().toString())
//                        val result = response.body()?.byteStream()
//                        result?.let {
//                            writeToFile(it)
//                        } ?: kotlin.run {
//                            Log.e("====", "====IOException : ")
//                        }
//                    }
//                    else {
//                        Log.d(TAG, "server contact failed")
//                    }
//
//                }
//
//                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
//                    Log.e(TAG, "error")
//                }
//            })
//        }
//    }
//
//
//    /** Write obj file in especially path */
//    private fun writeToFile(inputStream: InputStream) {
//        try {
//            Log.e("====", "====writeToFile : " )
//
//            val fileReader = ByteArray(4096)
//            var fileSizeDownloaded = 0
//            val DownloadsDir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS)
//            val DownloadsDirObj = File(DownloadsDir!!.absolutePath + "/face1.ply")
//            val fos: OutputStream = FileOutputStream(DownloadsDirObj)
//            do {
//                val read = inputStream.read(fileReader)
//                if (read != -1) {
//                    fos.write(fileReader, 0, read)
//                    fileSizeDownloaded += read
//                }
//            } while (read != -1)
//            fos.flush()
//            fos.close()
//
//            val i = Intent(this, ModelViewer::class.java)
//            val message = DownloadsDirObj.toString()
//            i.putExtra("obj_dir",message);
//            startActivity(i)
//
//        }catch ( e: IOException) {
//            Log.e("====", "====IOException : "+e )
//        }
//    }
}