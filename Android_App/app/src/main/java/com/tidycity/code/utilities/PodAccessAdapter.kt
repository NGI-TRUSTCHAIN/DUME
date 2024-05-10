package com.tidycity.code.utilities

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.tidycity.code.R
import com.tidycity.code.dataclasses_prototypes.Prototypes

class PodAccessAdapter(private val context: Context) :
    RecyclerView.Adapter<PodAccessAdapter.MyViewHolder>() {

    var uploadedHistory = emptyList<String>()

    class MyViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val dateTime: TextView
        val user: TextView
        val podUrl: TextView
        val detailsMenu: ImageView
        val accessType: TextView


        init {
            dateTime = itemView.findViewById(R.id.datetimeItem)
            user = itemView.findViewById(R.id.userItem)
            podUrl = itemView.findViewById(R.id.podItem)
            detailsMenu = itemView.findViewById(R.id.details)
            accessType = itemView.findViewById(R.id.accessType)
        }


        fun bind(isFirstItem: Boolean, isLastItem: Boolean) {
            // Set data to views

            // Conditionally set background
            when {
                isFirstItem && isLastItem -> {
                    // If it's both the first and last item
                    itemView.setBackgroundResource(R.drawable.rounded_tablayout_background)
                }

                isFirstItem -> {
                    // If it's the first item
                    itemView.setBackgroundResource(R.drawable.round_top_corners)
                }

                isLastItem -> {
                    // If it's the last item
                    itemView.setBackgroundResource(R.drawable.round_bottom_corners)
                }

                else -> {
                    // If it's neither the first nor the last item
                    itemView.setBackgroundResource(R.color.white)
                }
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.access_pod_item, parent, false)

        return MyViewHolder(view)
    }

    override fun getItemCount(): Int {
        return uploadedHistory.size
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        val startDate = uploadedHistory[position]

        startDate.split('.')[0]
            .replace("T", "/")
            .removePrefix("Video_")
            .also { holder.dateTime.text = it }

        holder.user.text = "User: X"
        holder.podUrl.text = "Pod URL: x.dume-arditi.com/theiaVisison"


        when (holder.user.text) {
            "Allowed" -> {
                holder.user.setTextColor(ContextCompat.getColor(context, R.color.green_background))
            }

            "Pending" -> {
                holder.user.setTextColor(ContextCompat.getColor(context, R.color.yellow))
            }
            else -> {
                holder.user.setTextColor(ContextCompat.getColor(context, R.color.purple_200))
            }
        }

        holder.bind(position == 0, position == itemCount - 1)
    }


    fun setData(videoStatus: List<String>) {
        this.uploadedHistory = videoStatus
        notifyDataSetChanged()
    }
}