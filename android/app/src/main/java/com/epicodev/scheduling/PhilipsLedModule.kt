package com.epicodev.scheduling

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.net.InetSocketAddress
import java.net.Socket

class PhilipsLedModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "PhilipsLedModule"
    }

    companion object {
        // Default display IP - can be configured later
        private const val DEFAULT_DISPLAY_IP = "127.0.0.1"
        private const val DISPLAY_PORT = 5000
        private const val SOCKET_TIMEOUT_MS = 2000

        // Predefined commands from Philips SICP docs
        private val CMD_OFF = "09 01 00 F3 00 FF 00 00 04"
        private val CMD_RED = "09 01 00 F3 01 FF 00 00 05"
        private val CMD_BLUE = "09 01 00 F3 01 00 00 FF 05"
        private val CMD_YELLOW = "09 01 00 F3 01 FF F2 00 F7"
    }

    @ReactMethod
    fun setLedOff(promise: Promise) {
        sendHexCommand(CMD_OFF, promise)
    }

    @ReactMethod
    fun setLedRed(promise: Promise) {
        sendHexCommand(CMD_RED, promise)
    }

    @ReactMethod
    fun setLedBlue(promise: Promise) {
        sendHexCommand(CMD_BLUE, promise)
    }

    @ReactMethod
    fun setLedYellow(promise: Promise) {
        sendHexCommand(CMD_YELLOW, promise)
    }

    @ReactMethod
    fun setDisplayIP(ip: String, promise: Promise) {
        // Store IP for future use (can be implemented with SharedPreferences)
        promise.resolve(true)
    }

    private fun sendHexCommand(hex: String, promise: Promise) {
        val bytes = hexStringToByteArray(hex)

        CoroutineScope(Dispatchers.IO).launch {
            try {
                android.util.Log.d("PhilipsLed", "Attempting to connect to $DEFAULT_DISPLAY_IP:$DISPLAY_PORT")
                android.util.Log.d("PhilipsLed", "Sending hex command: $hex")
                
                Socket().use { socket ->
                    socket.soTimeout = SOCKET_TIMEOUT_MS
                    socket.connect(
                        InetSocketAddress(DEFAULT_DISPLAY_IP, DISPLAY_PORT),
                        SOCKET_TIMEOUT_MS
                    )
                    android.util.Log.d("PhilipsLed", "Socket connected successfully")
                    
                    socket.getOutputStream().use { out ->
                        out.write(bytes)
                        out.flush()
                        android.util.Log.d("PhilipsLed", "Command sent successfully (${bytes.size} bytes)")
                    }
                }
                // Success - resolve on main thread
                CoroutineScope(Dispatchers.Main).launch {
                    promise.resolve(true)
                }
            } catch (e: java.net.ConnectException) {
                android.util.Log.e("PhilipsLed", "Connection failed", e)
                CoroutineScope(Dispatchers.Main).launch {
                    promise.reject(
                        "LED_CONNECTION_ERROR",
                        "Cannot connect to display at $DEFAULT_DISPLAY_IP:$DISPLAY_PORT. Please check:\n1. Display is powered on\n2. SICP network port is enabled (Settings → Signage Display → SICP port)\n3. Port is set to $DISPLAY_PORT\n4. Display IP address is correct",
                        e
                    )
                }
            } catch (e: java.net.SocketTimeoutException) {
                android.util.Log.e("PhilipsLed", "Connection timeout", e)
                CoroutineScope(Dispatchers.Main).launch {
                    promise.reject(
                        "LED_TIMEOUT_ERROR",
                        "Connection timeout. Display at $DEFAULT_DISPLAY_IP:$DISPLAY_PORT did not respond. Please check the display is accessible.",
                        e
                    )
                }
            } catch (e: Exception) {
                android.util.Log.e("PhilipsLed", "Error sending LED command", e)
                CoroutineScope(Dispatchers.Main).launch {
                    promise.reject(
                        "LED_ERROR",
                        "Failed to send LED command: ${e.javaClass.simpleName} - ${e.message}",
                        e
                    )
                }
            }
        }
    }

    private fun hexStringToByteArray(hex: String): ByteArray {
        val clean = hex.replace(" ", "")
        require(clean.length % 2 == 0) { "Invalid hex string length" }

        return ByteArray(clean.length / 2) { i ->
            clean.substring(i * 2, i * 2 + 2).toInt(16).toByte()
        }
    }
}

