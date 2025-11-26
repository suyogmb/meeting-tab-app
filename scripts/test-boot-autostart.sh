#!/bin/bash

# Script to test and verify boot auto-start functionality
# Usage: ./scripts/test-boot-autostart.sh

echo "=== Boot Auto-Start Test Script ==="
echo ""

# Check if device is connected
if ! adb devices | grep -q "device$"; then
    echo "❌ No Android device connected"
    echo "Please connect your device via USB and enable USB debugging"
    exit 1
fi

echo "✅ Device connected"
echo ""

# Get package name (adjust if needed)
PACKAGE_NAME="com.epicodev.scheduling.development"

echo "Checking BootReceiver registration..."
echo ""

# Check if BootReceiver is registered
echo "1. Checking if BootReceiver is registered in manifest:"
adb shell dumpsys package $PACKAGE_NAME | grep -A 10 "BootReceiver" || echo "   ⚠️  BootReceiver not found in package dump"
echo ""

# Check RECEIVE_BOOT_COMPLETED permission
echo "2. Checking RECEIVE_BOOT_COMPLETED permission:"
adb shell dumpsys package $PACKAGE_NAME | grep "RECEIVE_BOOT_COMPLETED" || echo "   ⚠️  Permission not found"
echo ""

# Check device admin status
echo "3. Checking device admin status:"
adb shell dumpsys device_policy | grep -A 5 "$PACKAGE_NAME" || echo "   ⚠️  Device admin not found"
echo ""

# Test boot broadcast manually
echo "4. Testing boot broadcast manually (this will try to launch the app):"
echo "   Sending BOOT_COMPLETED broadcast..."
adb shell am broadcast -a android.intent.action.BOOT_COMPLETED -n $PACKAGE_NAME/com.riuhou.kioskmanager.BootReceiver
echo ""

# Check logs
echo "5. Recent BootReceiver logs:"
adb logcat -d | grep -i "BootReceiver\|boot.*complete" | tail -10 || echo "   No recent boot logs found"
echo ""

echo "=== Test Complete ==="
echo ""
echo "To test actual boot:"
echo "1. Reboot your device: adb reboot"
echo "2. After reboot, check if app launched automatically"
echo "3. Check logs: adb logcat | grep -i bootreceiver"

