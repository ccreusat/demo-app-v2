package com.demo.v2;

import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;

import androidx.core.app.NotificationCompat;
//import androidx.work.OneTimeWorkRequest;
//import androidx.work.WorkManager;

import android.os.Build;
import android.util.Log;

import com.dianalytics.DIAnalytics;
import com.dianalytics.center.fcm.DINotificationReceiver;
import com.google.firebase.messaging.RemoteMessage;
import com.demo.v2.R;


/**
 * Created by samuel on 2016-11-11.
 */

public class NotificationReceiver extends DINotificationReceiver {

    @Override
    public void onMessageReceived(Context context, RemoteMessage remoteMessage) {
        Log.e("msg data", "onMessageReceived: " + remoteMessage.getNotification());
        Log.e("msg", "onMessageReceived: " + remoteMessage.getNotification().getBody());

        try {
            //JSONObject aps = new JSONObject(remoteMessage.getData().get("aps"));

            Intent intent = new Intent(context, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0 /* Request code */, intent, PendingIntent.FLAG_ONE_SHOT);

            String channelId = "lpb_app_channel";
            Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(context, channelId)
                    .setContentTitle(remoteMessage.getNotification().getTitle())
                    .setContentText(remoteMessage.getNotification().getBody())
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setStyle(new NotificationCompat.BigTextStyle())
                    .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
                    .setSmallIcon(R.drawable.ic_notification_app)
                    .setAutoCancel(true);

            NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            // Since android Oreo notification channel is needed.
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(channelId, "lpb_app", NotificationManager.IMPORTANCE_DEFAULT);
                notificationManager.createNotificationChannel(channel);
            }

            notificationManager.notify(0, notificationBuilder.build());

            DIAnalytics.sendPushReception(remoteMessage.getData().get("PushId"));

            //notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());

        } catch (Throwable t) {
            Log.e("NotificationReceiver", "Error on notification received.");
            t.printStackTrace();
            return;
        }
    }

}