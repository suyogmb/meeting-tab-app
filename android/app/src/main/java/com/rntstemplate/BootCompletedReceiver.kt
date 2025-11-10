package com.mindbowser.meetingroomkiosk

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build

class BootCompletedReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (Intent.ACTION_BOOT_COMPLETED == intent.action) {
      val activityIntent = Intent(context, MainActivity::class.java)
      activityIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      if (Build.VERSION.SDK_INT >= 29) {
        activityIntent.addFlags(Intent.FLAG_ACTIVITY_REQUIRE_DEFAULT)
      }
      context.startActivity(activityIntent)
    }
  }
}


