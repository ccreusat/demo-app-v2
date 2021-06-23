package com.demo.v2;

import android.app.Application;
import android.content.Context;
import android.content.IntentFilter;
import android.content.SharedPreferences;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.HashMap;

import com.demo.v2.BuildConfig;

import com.dianalytics.DIAnalytics;
//import com.skyward.NotificationManager.NotificationManager;


public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
          new ReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
              return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
              @SuppressWarnings("UnnecessaryLocalVariable")
              List<ReactPackage> packages = new PackageList(this).getPackages();
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // packages.add(new MyReactNativePackage());
              //new NotificationManager();
              packages.add(new LpbManager()); // <-- Add this line with your package name.
              return packages;
            }

            @Override
            protected String getJSMainModuleName() {
              return "index";
            }
          };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {

    SharedPreferences sharedPref = this.getSharedPreferences("MyDiEmail",Context.MODE_PRIVATE);
    String userEmail = sharedPref.getString("user_email", null);//"No name defined" is the default value.
      //Set the base url for all calls to the server
    DIAnalytics.setBaseUrl("https://app.mydialoginsight.com/");
    //Enable logs to be displayed
    DIAnalytics.setLogEnabled(true);
    //Register your application to the service
    DIAnalytics.startWithApplicationId(this, "173:pI8lVf15E4yJALgcROPr8aBqD6edqhiX");

    HashMap contactData = new HashMap();
    contactData.put("f_EMail", userEmail);
    HashMap hashMap = new HashMap();
    hashMap.put("Contact", contactData);
    DIAnalytics.identify(hashMap);
    DIAnalytics.sendPushReception("messageID");
    // end DIAnalytics config
    DIAnalytics.registerForRemoteNotification();

    NotificationReceiver n = new NotificationReceiver();
    IntentFilter filter = new IntentFilter();
    filter.addAction("com.dialoginsight.dianalytics.NotificationBroadcast");
    this.registerReceiver(n, filter);

    super.onCreate();

    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }

}
