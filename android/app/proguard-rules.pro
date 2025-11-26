# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# React Native
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}
-keepclassmembers class * {
  @react-native-community.netinfo.* <methods>;
}
-dontwarn com.facebook.react.**
-keep,includedescriptorclasses class com.facebook.react.bridge.** { *; }
-keepclassmembers class * {
  @com.facebook.react.uimanager.UIProp <fields>;
}
-keepclassmembers class * {
  @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-keepclassmembers class * {
  @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# React Native Firebase
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

# React Navigation
-keep class com.swmansion.** { *; }
-keep class com.th3rdwave.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# React Native SVG
-keep class com.horcrux.svg.** { *; }

# React Native SQLite
-keep class io.liteglue.** { *; }

# React Native Keychain
-keep class com.oblador.keychain.** { *; }

# React Native MMKV
-keep class com.tencent.mmkv.** { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# React Native Boot Splash
-keep class com.zoontek.rnbootsplash.** { *; }

# React Native Device Info
-keep class com.learnium.RNDeviceInfo.** { *; }

# React Native Kiosk Manager
-keep class com.reactnativekioskmanager.** { *; }

# New Relic
-keep class com.newrelic.** { *; }
-dontwarn com.newrelic.**

# Notifee
-keep class app.notifee.** { *; }

# Axios
-keep class okhttp3.** { *; }
-keep class okio.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# Kotlin
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings {
    <fields>;
}
-keepclassmembers class kotlin.Metadata {
    public <methods>;
}

# Kotlin Coroutines
-keepclassmembers class kotlinx.coroutines.** { *; }
-dontwarn kotlinx.coroutines.**

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep Parcelable implementations
-keepclassmembers class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator CREATOR;
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep custom application class
-keep class com.epicodev.scheduling.MainApplication { *; }
-keep class com.epicodev.scheduling.MainActivity { *; }

# Keep native modules
-keep class com.epicodev.scheduling.** { *; }

# Remove logging in release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Remove console.log in release (if using babel-plugin-transform-remove-console)
-assumenosideeffects class com.facebook.react.bridge.ReactMarker {
    public static *** logMarker(...);
}

