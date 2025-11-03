# React Native TypeScript Boilerplate

A comprehensive, production-ready React Native boilerplate built with TypeScript, featuring modern architecture patterns, robust state management, and enterprise-grade tooling.

## 📋 Overview

This boilerplate provides a solid foundation for building scalable React Native applications with TypeScript. It includes pre-configured navigation, state management, API services, validation, theming, and internationalization out of the box.

### Key Features
- **TypeScript** - Full type safety and better developer experience
- **Redux Toolkit** - Modern state management with RTK
- **React Navigation** - Type-safe navigation with stack and tab navigators
- **Firebase Integration** - Analytics and crashlytics
- **Internationalization** - Multi-language support with i18next
- **Theme System** - Dark/Light mode support
- **Form Validation** - Comprehensive validation with Yup
- **HTTP Services** - Axios-based API client with interceptors
- **Code Generation** - CLI tools for rapid development
- **Testing Setup** - Jest and React Native Testing Library
- **Code Quality** - ESLint, Prettier, and Husky

## 🚀 Basic Requirements

- **Node.js** >= 18.0.0
- **React Native CLI** or **Expo CLI**
- **Xcode** (for iOS development)
- **Android Studio** (for Android development)
- **CocoaPods** (for iOS dependencies)

### Development Environment
- **macOS** (recommended for iOS development)
- **Windows/Linux** (Android development)

## ⭐ Highlights

### Core Technologies
- **React Native 0.79.3** - Latest stable version
- **TypeScript 5.0.4** - Full type safety
- **React 19.0.0** - Latest React version
- **Redux Toolkit 2.8.2** - Modern Redux with RTK
- **React Navigation 7.x** - Type-safe navigation

### Utilities & Services
- **Axios** - HTTP client with interceptors and token refresh
- **Yup** - Schema validation for forms
- **i18next** - Internationalization
- **MMKV** - Fast key-value storage
- **React Native Keychain** - Secure storage
- **Toast Messages** - User feedback
- **Error Boundaries** - Error handling
- **New Relic** - Performance monitoring

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
│   ├── LanguageProvider.ts # i18n provider
│   └── Loader.tsx         # Loading component
├── hooks/                 # Custom React hooks
│   └── useTypedSelector.ts # Typed Redux selector
├── language/              # Internationalization
│   └── en.json           # English translations
├── navigators/            # Navigation configuration
│   ├── AuthStackNavigator.tsx
│   ├── HomeTabNavigator.tsx
│   ├── MainStackNavigator.tsx
│   ├── RootStackNavigator.tsx
│   └── routes.ts         # Route definitions
├── networkConfig/         # API configuration
│   ├── Endpoints.ts      # API endpoints
│   └── HttpServices.ts   # HTTP client
├── redux/                # State management
│   ├── app/
│   │   └── store.ts      # Redux store
│   ├── constants/
│   │   └── index.ts      # Redux constants
│   └── reducer/          # Redux slices
│       ├── AppSlice/
│       ├── CounterSlice/
│       ├── DashboardSlice/
│       └── UserSlice/
├── screens/              # Application screens
│   ├── AuthScreens/      # Authentication screens
│   │   └── Login/
│   ├── DetailScreen/     # Detail screens
│   ├── ErrorScreen/      # Error handling screens
│   └── Home/             # Home screens
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
    ├── StorageService.ts # Storage utilities
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

## 📱 Features Overview

### Authentication
- Login/logout functionality
- Token-based authentication
- Secure storage with Keychain
- Automatic token refresh

### Navigation
- Stack navigation for authentication
- Tab navigation for main app
- Type-safe navigation with TypeScript
- Deep linking support

### State Management
- Redux Toolkit for global state
- RTK Query for API state management
- Type-safe selectors and actions
- DevTools integration

### API Integration
- Axios-based HTTP client
- Request/response interceptors
- Automatic error handling
- Token refresh mechanism

### Form Handling
- Yup validation schemas
- Real-time validation
- Error message handling
- Type-safe form state

### Theming
- Dark/Light mode support
- Dynamic theme switching
- Consistent color system
- Typography system

### Internationalization
- Multi-language support
- Dynamic language switching
- Type-safe translations
- Pluralization support

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