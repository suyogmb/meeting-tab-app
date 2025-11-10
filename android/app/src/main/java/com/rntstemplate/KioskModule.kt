package com.mindbowser.meetingroomkiosk

import android.app.ActivityManager
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.ReactActivity

/**
 * React Native bridge module for Kiosk operations
 */
class KioskModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "KioskModule"
    }

    /**
     * Start lock task mode (kiosk mode)
     */
    @ReactMethod
    fun startLockTask(promise: Promise) {
        try {
            val activity = reactApplicationContext.currentActivity
            if (activity != null && activity is ReactActivity) {
                activity.runOnUiThread {
                    try {
                        activity.startLockTask()
                        promise.resolve(true)
                    } catch (e: Exception) {
                        promise.reject("LOCK_TASK_ERROR", "Failed to start lock task: ${e.message}", e)
                    }
                }
            } else {
                promise.reject("NO_ACTIVITY", "No current activity")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to start lock task: ${e.message}", e)
        }
    }

    /**
     * Stop lock task mode (exit kiosk)
     */
    @ReactMethod
    fun stopLockTask(promise: Promise) {
        try {
            val activity = reactApplicationContext.currentActivity
            if (activity != null && activity is ReactActivity) {
                activity.runOnUiThread {
                    try {
                        activity.stopLockTask()
                        promise.resolve(true)
                    } catch (e: Exception) {
                        promise.reject("LOCK_TASK_ERROR", "Failed to stop lock task: ${e.message}", e)
                    }
                }
            } else {
                promise.reject("NO_ACTIVITY", "No current activity")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to stop lock task: ${e.message}", e)
        }
    }

    /**
     * Check if lock task is active
     */
    @ReactMethod
    fun isLockTaskActive(promise: Promise) {
        try {
            val activityManager = reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            val isLocked = activityManager.lockTaskModeState == ActivityManager.LOCK_TASK_MODE_LOCKED ||
                    activityManager.lockTaskModeState == ActivityManager.LOCK_TASK_MODE_PINNED
            promise.resolve(isLocked)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to check lock task status: ${e.message}", e)
        }
    }

    /**
     * Check if device is device owner
     */
    @ReactMethod
    fun isDeviceOwner(promise: Promise) {
        try {
            val devicePolicyManager = reactApplicationContext.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
            val adminComponent = ComponentName(reactApplicationContext, KioskDeviceAdminReceiver::class.java)
            val isOwner = devicePolicyManager.isDeviceOwnerApp(reactApplicationContext.packageName)
            promise.resolve(isOwner)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to check device owner status: ${e.message}", e)
        }
    }

    /**
     * Exit kiosk mode with password verification
     */
    @ReactMethod
    fun exitKioskMode(password: String, promise: Promise) {
        try {
            // Verify password using AdminAuthService (will be called from React Native)
            // For now, we'll verify in native code or pass to React Native
            val activity = reactApplicationContext.currentActivity
            if (activity != null && activity is ReactActivity) {
                activity.runOnUiThread {
                    try {
                        // Password verification should happen via React Native bridge
                        // This is a placeholder - actual verification should use AdminAuthService
                        activity.stopLockTask()
                        promise.resolve(true)
                    } catch (e: Exception) {
                        promise.reject("LOCK_TASK_ERROR", "Failed to exit kiosk mode: ${e.message}", e)
                    }
                }
            } else {
                promise.reject("NO_ACTIVITY", "No current activity")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to exit kiosk mode: ${e.message}", e)
        }
    }

    /**
     * Verify admin password from native code
     * This will be called from MainActivity when back button is pressed
     * Note: This requires a callback mechanism to verify via React Native
     */
    @ReactMethod
    fun verifyPasswordFromNative(password: String, promise: Promise) {
        // This will be handled by React Native side
        // We emit an event that React Native can listen to
        // For now, we'll need to use a different approach
        promise.reject("NOT_IMPLEMENTED", "Password verification from native not yet implemented")
    }
}

