#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/provision_kiosk.sh <appId>
# Example dev flavor: ./scripts/provision_kiosk.sh com.rntstemplate.development

APP_ID=${1:-com.rntstemplate.development}
ADMIN_RECEIVER="$APP_ID/.KioskDeviceAdminReceiver"

echo "Granting device owner to $ADMIN_RECEIVER"
adb shell dpm set-device-owner "$ADMIN_RECEIVER" || true

echo "Granting Home role (Android 12+) if available"
adb shell cmd role add-role-holder android.app.role.HOME "$APP_ID" || true

echo "Allowing lock task"
adb shell dpm set-lock-task-packages $ADMIN_RECEIVER $APP_ID || true

echo "Disabling keyguard and statusbar (OEM/EMM dependent)"
adb shell settings put global policy_control immersive.navigation=* || true

echo "Done. Rebooting to apply policies"
adb reboot


