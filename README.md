# Android Tablet Meeting Room Kiosk App

A React Native application for displaying meeting room information on Android tablets in kiosk mode. Built with TypeScript, featuring offline-first architecture, secure admin access, and Firebase Cloud Messaging integration.

## 📋 Overview

This kiosk app is designed to run on Android tablets in landscape orientation, displaying current and upcoming meetings for a specific room. The app operates in kiosk mode (Device Owner + Lock Task Mode) to prevent users from exiting the application.

### Key Features
- **Kiosk Mode** - Device Owner + Lock Task Mode for secure kiosk operation
- **Offline-First** - Local SQLite database with MMKV caching for offline operation
- **Admin Settings** - Password-protected admin access modal for configuration
- **Firebase Integration** - FCM push notifications for real-time meeting updates
- **Background Sync** - WorkManager integration for periodic data synchronization
- **Landscape UI** - Optimized dashboard for 2-3m viewing distance (large typography, high contrast)
- **TypeScript** - Full type safety throughout the application
- **Security** - Android Keystore integration, Argon2id/Bcrypt password hashing

## 🚀 Basic Requirements

- **Node.js** >= 18.0.0
- **React Native CLI** (bare CLI, not Expo)
- **Android Studio** (for Android development)
- **Android SDK** (API level 21+)
- **Java JDK** 11 or higher

### Development Environment
- **macOS/Windows/Linux** (Android development)
- **Note:** This app is Android-only (tablet kiosk mode)

## ⭐ Highlights

### Core Technologies
- **React Native 0.81.0** - Latest stable version
- **TypeScript 5.8.3** - Full type safety
- **React 19.1.0** - Latest React version
- **React Navigation 7.x** - Type-safe navigation
- **State Management** - Zustand or Redux Toolkit (configurable)

### Utilities & Services
- **Axios** - HTTP client with interceptors for API communication
- **Yup** - Schema validation for forms (admin settings)
- **i18next** - Internationalization support
- **MMKV** - Fast key-value storage for app preferences
- **SQLite** - Local database for meeting data
- **React Native Keychain** - Secure storage for admin passwords
- **Firebase Cloud Messaging** - Push notifications for meeting updates
- **WorkManager** - Background sync jobs
- **Toast Messages** - User feedback
- **Error Boundaries** - Error handling

### Developer Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Testing framework
- **TypeScript ESLint** - TypeScript-specific linting

## 🛠️ Developer Experience

### Code Generation Scripts
```bash
# Generate MVC screen structure
npm run generateMVCScreen ScreenName

# Generate Redux slice
npm run generateReduxSlice SliceName

# Generate React Native component
npm run generateRNComponent ComponentName
```

### Code Quality
- **Automatic formatting** with Prettier
- **Linting** with ESLint
- **Pre-commit hooks** with Husky
- **Type checking** with TypeScript
- **Testing** with Jest and React Native Testing Library

### Hot Reload & Development
- **Fast Refresh** for instant updates
- **Metro bundler** configuration
- **Development builds** for both platforms
- **Debug configurations** for VS Code

## 📁 Directory Structure

```
src/
├── assets/                 # Images, fonts, and static assets
│   └── reference_image.png # UI reference image
├── components/             # Reusable UI components
│   ├── ErrorHandler.tsx   # Error boundary component
│   ├── Flatlist.tsx       # Custom flatlist component
│   ├── Header.tsx         # Navigation header
│   ├── Image.tsx          # Custom image component
│   ├── ReusableButton.tsx # Button component
│   ├── Text.tsx           # Custom text component
│   └── TextInput.tsx      # Input component
├── contexts/              # React contexts
│   └── ThemeContext.tsx   # Theme provider
├── hocs/                  # Higher-order components
│   └── LanguageProvider.ts # i18n provider
├── hooks/                 # Custom React hooks
├── language/              # Internationalization
│   └── en.json           # English translations
├── navigators/            # Navigation configuration
│   ├── RootStackNavigator.tsx
│   └── routes.ts         # Route definitions
├── networkConfig/         # API configuration
│   ├── Endpoints.ts      # API endpoints
│   └── HttpServices.ts   # HTTP client
├── screens/              # Application screens
│   └── ErrorScreen/      # Error handling screens
├── services/             # Business logic services
│   ├── database/         # SQLite database service
│   ├── sync/             # Background sync service
│   └── kiosk/            # Kiosk mode management
├── theme/                # Theming
│   └── colors.ts         # Color definitions
├── types/                # TypeScript type definitions
│   └── types.ts
└── utils/                # Utility functions
    ├── Constants.ts      # App constants
    ├── Dimensions.ts     # Responsive dimensions
    ├── ImageConstants.ts # Image constants
    ├── NewRelic.ts       # Performance monitoring
    ├── SecureLogger.ts   # Secure logging
    ├── SizeUtility.ts    # Size utilities
    ├── StorageService.ts # Storage utilities (MMKV)
    ├── Typography.ts     # Typography styles
    ├── ValidationSchemas.ts # Form validation schemas
    └── ValidationUtils.ts # Validation utilities
```

## 🚀 Getting Started

### Prerequisites
1. Install Node.js (>= 18.0.0)
2. Install React Native CLI: `npm install -g @react-native-community/cli`
3. Install Xcode (for iOS development)
4. Install Android Studio (for Android development)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd reactnative-boilerplate-typescript

# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..
```

## 🏗️ How to Create a New Project Using This Boilerplate

```bash
# Clone the boilerplate
git clone <repository-url> my-new-project
cd my-new-project

# Remove git history and start fresh
rm -rf .git
git init

# Update package.json with your project details
# Update app.json with your app configuration
# Update iOS/Android bundle identifiers

# Install dependencies
npm install
```

### Customization Steps
1. **Update App Configuration**
   - Modify `app.json` with your app details
   - Update bundle identifiers in iOS/Android
   - Configure Firebase project settings

2. **Update Dependencies**
   - Review and update package.json dependencies
   - Configure native dependencies

3. **Customize Theme**
   - Update colors in `src/theme/colors.ts`
   - Modify typography in `src/utils/Typography.ts`

4. **Configure API**
   - Update endpoints in `src/networkConfig/Endpoints.ts`
   - Configure base URLs and authentication

## ▶️ Run the Project

### Development Mode
```bash
# Start Metro bundler
npm start

# Run on iOS (macOS only)
npm run ios

# Run on Android
npm run android
```

### Production Build
```bash
# iOS Production Build
npm run ios:archive:template:release

# Android Production Build
npm run android:prod-release
```

## 🌍 Running with Multiple Environments

This boilerplate supports multiple environments for different deployment stages:

### Environment Configuration
- **Development** - Local development
- **QA** - Quality assurance testing
- **Staging** - Pre-production testing
- **UAT** - User acceptance testing
- **Production** - Live application

### Android Commands
```bash
# Development
npm run android:dev
npm run android:dev-release

# QA
npm run android:qa
npm run android:qa-release

# Staging
npm run android:staging
npm run android:staging-release

# UAT
npm run android:uat
npm run android:uat-release

# Production
npm run android:prod
npm run android:prod-release
```

### iOS Commands
```bash
# Development
npm run ios:run:templateDevelopment:debug
npm run ios:run:templateDevelopment:release

# QA
npm run ios:run:templateQA:debug
npm run ios:run:templateQA:release

# Staging
npm run ios:run:templateStaging:debug
npm run ios:run:templateStaging:release

# UAT
npm run ios:run:templateUAT:debug
npm run ios:run:templateUAT:release

# Production
npm run ios:run:template:debug
npm run ios:run:template:release
```

### Environment-Specific Files
- **iOS**: Different schemes and configurations
- **Android**: Different build variants and flavors
- **Firebase**: Environment-specific Google Services files
- **Configuration**: Environment variables and settings

## 📱 Kiosk App Features

### Kiosk Mode
- Device Owner setup for kiosk operation
- Lock Task Mode to prevent app exit
- Auto-launch on device boot
- Admin password protection for settings

### Dashboard UI
- Split-screen landscape layout
- Left pane: Time/date + room information
- Right pane: Wallet-style current/next meeting cards
- Bottom: Day's meetings list
- Large typography for 2-3m viewing distance
- High contrast colors for visibility

### Offline-First Architecture
- SQLite local database for meeting data
- MMKV for fast key-value storage
- Manual sync button for data refresh
- Automatic background sync via WorkManager

### Admin Settings
- Password-protected settings modal
- Room configuration
- Sync interval settings
- Network configuration
- Device information display

### Firebase Integration
- FCM push notifications
- Individual meeting fetch on notification
- Analytics tracking
- Crashlytics error reporting

### Security
- Android Keystore for secure credential storage
- Argon2id/Bcrypt for admin password hashing
- Secure storage for sensitive data
- Device policy enforcement

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 📦 Build & Deploy

### Android
```bash
# Generate APK
cd android && ./gradlew assembleRelease

# Generate AAB
cd android && ./gradlew bundleRelease
```

### iOS
```bash
# Archive for App Store
npm run ios:archive:template:release

# Build for distribution
xcodebuild -workspace ios/template.xcworkspace -scheme template -configuration Release archive
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using React Native and TypeScript**