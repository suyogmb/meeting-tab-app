# Mindbowser React Native Boilerplate

## Overview
This project is a React Native boilerplate designed to help developers kickstart mobile applications with a clean and optimized architecture.

The boilerplate provides a structured approach to separating concerns between UI and business logic, ensuring scalability and maintainability.

---

## Requirements
- **Node.js**: Version 16 or greater.
- **iOS Development**:
  - macOS with Xcode 13.3.1 or later.
  - Targeting iOS 13 and above.
- **React Native Environment Setup**:
  - Follow the [React Native CLI Quickstart](https://reactnative.dev/docs/environment-setup) instructions for your OS.

---

## Boilerplate Highlights
### **Core Technologies**
- **React Native**: For UI components.
- **React Navigation**: For in-app navigation.
- **JavaScript**: The main programming language.
- **Redux**: For global state management.
- **React Redux**: React bindings for Redux.

### **Utilities**
- **React Native Bootsplash**: Prevents white screen on startup.
- **Redux Toolkit**: Simplifies async Redux actions.
- **Axios**: For API calls.
- **HTTP Service**: Base service class for API calls.
- **Navigation Service**: Provides navigation functions independent of props.
- **Custom Button Component**: Extends `Pressable` with additional functionality.

### **Developer Experience**
- **Prettier**: Code formatting.
- **ESLint**: Code linting and analysis.
- **Flipper**: Debugging tool.
- [ESLint & Prettier Setup](https://github.com/vasilestefirta/react-native-eslint-prettier-example)

---

## Directory Structure
```
.
├── tests               # Test cases container.
├── android             # Android-specific files.
├── ios                 # iOS-specific files.
├── node_modules        # Installed Node.js packages.
├── resources           # Fonts and assets.
├── src                 # Source code.
│   ├── containers      # App container files.
│   ├── navigation      # Navigation components.
│   │   ├── AppNavigator.js  # Main route container.
│   │   ├── NavigationService.js  # Navigation helper functions.
│   ├── networkConfig   # API-related files.
│   │   ├── Endpoints.js  # API URLs.
│   │   ├── HttpServices.js  # API request methods (GET, POST, etc.).
│   ├── redux           # Redux store and reducers.
│   │   ├── actions     # Thunk action functions.
│   │   ├── reducers    # Reducers.
│   │   ├── store.js    # Redux store.
│   │   ├── reducers.js # Combined reducers.
│   │   ├── ReduxTypes.js # Redux action types.
│   ├── res             # Resource files.
│   │   ├── images      # Image assets.
│   ├── components      # Reusable UI components.
│   │   ├── Button.js   # Custom button component.
│   ├── screens         # App screens.
│   ├── theme           # Theme and color settings.
│   │   ├── Colors.js   # Color constants.
│   │   ├── Theme.js    # Light/Dark theme settings.
│   ├── utils           # Helper functions.
├── .gitignore          # Git ignore settings.
├── .prettierrc         # Prettier configuration.
├── App.js              # Main app entry.
├── index.js            # Initial entry point.
├── package.json        # Project dependencies and scripts.
├── .env                # Base environment file.
├── .env.production     # Production environment configuration.
├── .env.development    # Development environment configuration.
├── .env.staging        # Staging environment configuration.
├── .env.qa             # QA environment configuration.
```

---

## Getting Started
### **Create a New Project**
To create a new React Native project using this boilerplate, run:
```sh
npx react-native init MyApp --template https://bitbucket.org/Mindbowser/reactnative-boilerplate2.0
```

### **Run the Project**
Ensure you have all dependencies installed, then execute:
```sh
yarn start  # Start the Metro bundler
yarn <platform>  # Run the app on the chosen platform (iOS/Android)
```

### **Running with Multiple Environments**
You can run the app with different environments (production, development, staging, QA) using:

#### **Android Commands**
```sh
yarn android:staging          # Run on staging
yarn android:staging-release  # Run staging release
yarn android:dev              # Run on development
yarn android:dev-release      # Run development release
yarn android:prod             # Run on production
yarn android:prod-release     # Run production release
yarn android:qa               # Run on QA
yarn android:qa-release       # Run QA release
```
#### **Build APKs for Android**
```sh
./gradlew assembleStagingRelease      # Create a staging build APK
./gradlew assembleProductionRelease   # Create a production build APK
./gradlew assembleQaRelease           # Create a QA build APK
./gradlew assembleDevelopmentRelease  # Create a development build APK
```

#### **iOS Commands**
```sh
yarn ios:production  # Run on production
yarn ios:development # Run on development
yarn ios:staging     # Run on staging
yarn ios:qa          # Run on QA
```