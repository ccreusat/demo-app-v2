package com.demo.v2;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.Context;
import android.content.SharedPreferences;

import java.util.Map;
import java.util.HashMap;

public class LpbModule extends ReactContextBaseJavaModule {
  SharedPreferences sharedPref;
 
  private static ReactApplicationContext reactContext;
  private Context mContext;

  LpbModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "LpbModule";
  }

  @ReactMethod
  public void show(String message) {
    // get or create SharedPreferences
    SharedPreferences sharedPref = reactContext.getSharedPreferences("MyDiEmail",reactContext.MODE_PRIVATE);
    SharedPreferences.Editor prefEditor = sharedPref.edit();
    // save your string in SharedPreferences
    prefEditor.putString("user_email", message).commit();
    System.out.println("******" + message);
  }
}