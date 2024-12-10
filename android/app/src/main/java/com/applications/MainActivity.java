package com.applications;

import android.content.Intent;
import android.os.Build;
import android.widget.Toast;

import androidx.annotation.RequiresApi;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.clevertap.android.sdk.CleverTapAPI;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Applications";
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    CleverTapAPI clevertapDefaultInstance = CleverTapAPI.getDefaultInstance(getApplicationContext());

    // On Android 12 and onwards, raise notification clicked event and get the click
    // callback
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      if (clevertapDefaultInstance != null) {
        clevertapDefaultInstance.pushNotificationClickedEvent(intent.getExtras());
        //toast
        Toast.makeText(this, "Notification click callback received", Toast.LENGTH_SHORT).show();

      }
    }
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util
   * class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and
   * Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}
