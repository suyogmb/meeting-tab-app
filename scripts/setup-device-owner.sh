#!/bin/bash

# Script to set up Device Owner for kiosk app
# Usage: ./scripts/setup-device-owner.sh [package-name]
# Example: ./scripts/setup-device-owner.sh com.epicodev.scheduling.development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Package names for different flavors
PACKAGE_DEV="com.epicodev.scheduling.development"
PACKAGE_PROD="com.epicodev.scheduling"
PACKAGE_STAGING="com.epicodev.scheduling.staging"
PACKAGE_QA="com.epicodev.scheduling.qa"
PACKAGE_UAT="com.epicodev.scheduling.uat"

# Determine package name
if [ -n "$1" ]; then
    PACKAGE_NAME="$1"
else
    echo "Available package names:"
    echo "  1. $PACKAGE_DEV (development)"
    echo "  2. $PACKAGE_PROD (production)"
    echo "  3. $PACKAGE_STAGING"
    echo "  4. $PACKAGE_QA"
    echo "  5. $PACKAGE_UAT"
    echo ""
    read -p "Enter package name or number (1-5): " choice
    
    case $choice in
        1) PACKAGE_NAME=$PACKAGE_DEV ;;
        2) PACKAGE_NAME=$PACKAGE_PROD ;;
        3) PACKAGE_NAME=$PACKAGE_STAGING ;;
        4) PACKAGE_NAME=$PACKAGE_QA ;;
        5) PACKAGE_NAME=$PACKAGE_UAT ;;
        *) PACKAGE_NAME=$choice ;;
    esac
fi

echo ""
echo "=== Device Owner Setup Script ==="
echo "Package: $PACKAGE_NAME"
echo ""

# Check if device is connected
if ! adb devices | grep -q "device$"; then
    echo -e "${RED}❌ No Android device connected${NC}"
    echo "Please connect your device via USB and enable USB debugging"
    exit 1
fi

echo -e "${GREEN}✅ Device connected${NC}"
echo ""

# Check if device is already set up
echo "Step 1: Checking current device owner status..."
CURRENT_OWNER=$(adb shell dpm list-owners 2>/dev/null | grep "$PACKAGE_NAME" || true)

if [ -n "$CURRENT_OWNER" ]; then
    echo -e "${YELLOW}⚠️  Device owner already set:${NC}"
    echo "   $CURRENT_OWNER"
    echo ""
    read -p "Do you want to continue anyway? (y/n): " continue_anyway
    if [ "$continue_anyway" != "y" ]; then
        echo "Exiting..."
        exit 0
    fi
else
    echo "✅ No device owner currently set"
fi

echo ""
echo "Step 2: Checking prerequisites..."
echo ""

# Check if device has been set up (has user accounts)
HAS_ACCOUNTS=$(adb shell dumpsys user | grep -c "UserInfo" || echo "0")
if [ "$HAS_ACCOUNTS" -gt "1" ]; then
    echo -e "${RED}❌ Device has user accounts. Device Owner can only be set on a factory reset device.${NC}"
    echo ""
    echo "Options:"
    echo "  1. Factory reset the device (recommended)"
    echo "  2. Use Device Admin instead (limited functionality)"
    echo ""
    read -p "Do you want to factory reset? (y/n): " reset_choice
    if [ "$reset_choice" = "y" ]; then
        echo "Factory resetting device..."
        adb shell am broadcast -a android.intent.action.MASTER_CLEAR
        echo "Device will reset. Please wait for reset to complete, then run this script again."
        exit 0
    else
        echo "Exiting. Device Owner setup requires a factory reset device."
        exit 1
    fi
fi

# Check if app is installed
echo "Step 3: Checking if app is installed..."
if ! adb shell pm list packages | grep -q "$PACKAGE_NAME"; then
    echo -e "${RED}❌ App not installed: $PACKAGE_NAME${NC}"
    echo "Please install the app first:"
    echo "  yarn android:dev"
    exit 1
fi
echo -e "${GREEN}✅ App is installed${NC}"

# Check if app is already a device admin
echo ""
echo "Step 4: Checking for existing Device Admin..."
ADMIN_STATUS=$(adb shell dumpsys device_policy | grep -A 5 "$PACKAGE_NAME" | grep "Admin" || echo "")
if [ -n "$ADMIN_STATUS" ]; then
    echo -e "${YELLOW}⚠️  App is already set as Device Admin${NC}"
    echo "   Device Admin must be removed before setting Device Owner"
    echo ""
    echo "Options:"
    echo "  1. Remove Device Admin and continue (recommended)"
    echo "  2. Factory reset device"
    echo "  3. Exit"
    echo ""
    read -p "Choose option (1-3): " admin_choice
    
    case $admin_choice in
        1)
            echo "Removing Device Admin..."
            adb shell dpm remove-active-admin "$PACKAGE_NAME/com.riuhou.kioskmanager.DeviceAdminReceiver" 2>/dev/null || true
            echo "Uninstalling app..."
            adb uninstall "$PACKAGE_NAME" 2>/dev/null || true
            echo "Please reinstall the app: yarn android:dev"
            echo "Then run this script again."
            exit 0
            ;;
        2)
            echo "Factory resetting device..."
            adb shell am broadcast -a android.intent.action.MASTER_CLEAR
            echo "Device will reset. Please wait for reset to complete, then run this script again."
            exit 0
            ;;
        *)
            echo "Exiting..."
            exit 0
            ;;
    esac
else
    echo "✅ No existing Device Admin found"
fi

echo ""
echo "Step 5: Setting Device Owner..."
echo ""

# The library uses com.riuhou.kioskmanager.DeviceAdminReceiver
# But we should use the app's own DeviceAdminReceiver if it exists
# For now, we'll try the library's receiver first
DEVICE_ADMIN_RECEIVER="com.riuhou.kioskmanager.DeviceAdminReceiver"

echo "Attempting to set device owner..."
echo "Command: adb shell dpm set-device-owner $PACKAGE_NAME/$DEVICE_ADMIN_RECEIVER"
echo ""

RESULT=$(adb shell dpm set-device-owner "$PACKAGE_NAME/$DEVICE_ADMIN_RECEIVER" 2>&1)

if echo "$RESULT" | grep -q "Success"; then
    echo -e "${GREEN}✅ Device Owner set successfully!${NC}"
elif echo "$RESULT" | grep -q "already"; then
    echo -e "${YELLOW}⚠️  Device Owner already set${NC}"
elif echo "$RESULT" | grep -q "not allowed"; then
    echo -e "${RED}❌ Failed: Device has been set up (user accounts exist)${NC}"
    echo "Device Owner can only be set on a factory reset device."
    echo "Please factory reset the device first."
    exit 1
else
    echo -e "${YELLOW}⚠️  Unexpected response, checking status...${NC}"
    echo "Response: $RESULT"
fi

echo ""
echo "Step 6: Verifying Device Owner status..."
VERIFY=$(adb shell dpm list-owners 2>/dev/null | grep "$PACKAGE_NAME" || echo "")
if [ -n "$VERIFY" ]; then
    echo -e "${GREEN}✅ Verification successful!${NC}"
    echo "   $VERIFY"
else
    echo -e "${YELLOW}⚠️  Could not verify device owner status${NC}"
    echo "   Run manually: adb shell dpm list-owners"
    
    # Check if error was due to existing device admin
    if echo "$RESULT" | grep -q "already an admin\|Invalid component"; then
        echo ""
        echo -e "${RED}❌ Error: App is already a Device Admin${NC}"
        echo "   Solution: Remove Device Admin first, then set Device Owner"
        echo "   See troubleshooting section in documentation"
    fi
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Launch the app"
echo "2. The app will automatically detect Device Owner status"
echo "3. Kiosk mode will be fully enabled"
echo ""
echo "To check status in app, use: KioskService.isDeviceOwner()"

