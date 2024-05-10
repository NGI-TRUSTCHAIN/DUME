package com.tidycity.code.utilities

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
import androidx.core.content.ContextCompat.getDrawable
import androidx.recyclerview.widget.RecyclerView
import com.tidycity.code.R
import com.tidycity.code.dataclasses_prototypes.Prototypes

class UploadHistoryAdapter(
    private val context: Context,
    private var optionsMenuClickListener: OptionsMenuClickListener
) : RecyclerView.Adapter<UploadHistoryAdapter.MyViewHolder>() {


    var uploadedHistory = emptyList<Prototypes.DbUploadMenu>()

    class MyViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val filename: TextView
        val dateTime: TextView
        val popMenu: ImageView
        val icon: ImageView
        val uploadingProgress: ProgressBar
        val progress: TextView

        init {
            filename = itemView.findViewById(R.id.videonameItem)
            dateTime = itemView.findViewById(R.id.datetimeItem)
            icon = itemView.findViewById(R.id.iconVideo)
            popMenu = itemView.findViewById(R.id.details)
            uploadingProgress = itemView.findViewById(R.id.circularProgressbar)
            progress = itemView.findViewById(R.id.progressText)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.history_item, parent, false)

        return MyViewHolder(view)

    }

    override fun getItemCount(): Int {
        return uploadedHistory.size
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        val (_, startDate, currentStatus, progress) = uploadedHistory[position]
        holder.icon.background = when (currentStatus) {
            "uploaded" -> {
                getDrawable(context, R.drawable.ic_baseline_cloud_done_24)
            }
            "uploading" -> {
                getDrawable(context,R.drawable.ic_baseline_cloud_queue_24)
            }
            else -> getDrawable(context, R.drawable.ic_baseline_cloud_upload_24)
        }

        "Video ${position + 1}".also { holder.filename.text = it }

        startDate.split('.')[0]
            .replace("T", "/")
            .removePrefix("Video_")
            .also { holder.dateTime.text = it }

        if (currentStatus == "uploading") {
            if (holder.progress.visibility != View.VISIBLE) {
                holder.popMenu.visibility = View.GONE
                holder.uploadingProgress.visibility = View.VISIBLE
                holder.progress.visibility = View.VISIBLE
            }
            holder.uploadingProgress.progress = progress
            "$progress %".also { holder.progress.text = it }

        } else {
            holder.uploadingProgress.visibility = View.GONE
            holder.progress.visibility = View.GONE
            holder.popMenu.visibility = View.VISIBLE
            holder.popMenu.setOnClickListener {
                optionsMenuClickListener.onOptionsMenuClicked(position)
            }
        }
    }

    fun setData(videoStatus: List<Prototypes.DbUploadMenu>){
        this.uploadedHistory = videoStatus
        notifyDataSetChanged()
    }

    interface OptionsMenuClickListener {
        fun onOptionsMenuClicked(position: Int)
    }

}

