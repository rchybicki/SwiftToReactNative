# React Native RSS Reader - Migration Project

## Overview

This is a React Native (Expo) port of a SwiftUI RSS Reader app. The goal is to achieve visual and functional parity with the original iOS SwiftUI implementation.

## Project Structure

```
react-native-app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context (AppContext for global state)
│   ├── hooks/            # Custom hooks (useLoadableState)
│   ├── models/           # TypeScript types
│   ├── navigation/       # React Navigation setup
│   ├── screens/          # Screen components
│   ├── services/         # Business logic (feed fetching, settings)
│   └── __tests__/        # Jest tests
├── assets/               # Images and static files
├── maestro/              # Maestro UI test flows
├── MIGRATION_MATRIX.md   # Detailed migration tracking
└── IMPLEMENTATION_PLAN.md # Original implementation plan
```

## Setup

### Prerequisites
- Node.js 18+
- Xcode (for iOS Simulator)
- Android Studio + Android SDK (for Android Emulator / `adb`)
- Java 17+ (for Maestro)

### Installation

```bash
cd react-native-app
npm install
```

### Running the App

```bash
# Recommended (stable for Maestro): standalone dev build (not Expo Go)
# Terminal 1 (Metro)
npx expo start --dev-client

# Terminal 2 (build + install + launch)
npx expo run:ios

# Android (same pattern)
# Terminal 2
npx expo run:android

# Expo Go fallback (less reliable for automation)
npx expo start --ios
```

### Running Tests

```bash
npm test
```

## UI Testing with Maestro

Maestro is used for automated UI verification to ensure the React Native app matches the SwiftUI design.

### Maestro Setup

```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Install Java 17 (required)
brew install openjdk@17

# Install iOS support
brew tap facebook/fb
brew install facebook/fb/idb-companion

# Add to PATH (add to ~/.zshrc for persistence)
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH:$HOME/.maestro/bin"
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
```

### Running Maestro Tests

There are two supported workflows:
1. **Standalone dev build (recommended)**: Maestro launches the app directly (`appId: com.rssreader.reactnative`).
2. **Expo Go fallback**: Maestro launches Expo Go and opens the project via an `EXPO_URL` deep link (avoids tapping through Expo’s UI).

```bash
# Recommended: run a dev build once (installs the app on the simulator/emulator)
npx expo start --dev-client
npx expo run:ios

# In another terminal, run the screenshot flow (all artifacts in-repo)
cd react-native-app
maestro test \
  --debug-output=.maestro-output/debug \
  --flatten-debug-output \
  maestro/verify-screens.yaml

# Export the screenshots into the top-level comparison folder
./scripts/export-maestro-screenshots.sh ios
```

**Important:** The `--flatten-debug-output` flag prevents timestamped subdirectories, making output predictable for CI and easier to read.

#### Expo Go fallback (if you can’t run a dev build)

```bash
# Terminal 1 (Metro)
npx expo start --ios

# Grab the "exp://..." URL from the Expo CLI output, then:
cd react-native-app
maestro test \
  -e EXPO_URL="exp://..." \
  --debug-output=.maestro-output/debug \
  --flatten-debug-output \
  maestro/verify-screens-expo-go.yaml
```

### Maestro Configuration

Configuration file: `.maestro/config.yaml`

```yaml
# Where takeScreenshot() and other artifacts are written (relative to react-native-app/)
testOutputDir: .maestro-output

platform:
  ios:
    disableAnimations: true
  android:
    disableAnimations: true

flows:
  - 'maestro/*'
```

### Maestro Test Flows

- `maestro/verify-screens.yaml` - Full app verification flow (standalone dev build)
- `maestro/verify-screens-expo-go.yaml` - Expo Go fallback (requires `EXPO_URL`)

### Screenshot Output

All screenshots are saved within the project directory (gitignored):

```
.maestro-output/
├── screenshots/           # Success screenshots from takeScreenshot commands
│   ├── 01-setup-default.png
│   ├── 02-setup-selected.png
│   ├── 03-feed-screen.png
│   ├── 04-about-screen.png
│   └── 05-libraries-screen.png
└── debug/                 # Debug output (failure screenshots, logs)
    ├── screenshot-❌-*.png   # Failure screenshots
    ├── screenshot-⚠️-*.png   # Warning screenshots
    ├── commands-*.json       # Command execution log
    └── maestro.log           # Full execution log
```

### Quick Reference Commands

```bash
# Run full verification (standalone dev build)
maestro test --debug-output=.maestro-output/debug --flatten-debug-output maestro/verify-screens.yaml

# Export latest screenshots into the repo-level comparison folders
./scripts/export-maestro-screenshots.sh ios
./scripts/export-maestro-screenshots.sh android

# Ad-hoc screenshots (no Maestro)
./scripts/screenshot-ios.sh ../screenshots/react-native-ios/manual.png
./scripts/screenshot-android.sh ../screenshots/react-native-android/manual.png

# Run with HTML report
maestro test --debug-output=.maestro-output/debug --flatten-debug-output --format=HTML --output=.maestro-output/report.html maestro/verify-screens.yaml

# Run specific flow only
maestro test --debug-output=.maestro-output/debug --flatten-debug-output maestro/verify-app.yaml
```

## Key Technical Decisions

### Navigation
- Uses `@react-navigation/native-stack` for native iOS large title support
- Navigation behavior matches SwiftUI Coordinator pattern (Setup as root, Feed pushed on top)

### Styling
- iOS system colors (`#f2f2f7` for grouped background)
- Card/inset grouped list style with 10px border radius
- Native large titles via native-stack

### RSS Parsing
- Uses `react-native-rss-parser` (not `rss-parser` which requires Node.js modules)

### State Management
- React Context for global state (selected source)
- AsyncStorage for persistence (equivalent to UserDefaults)

## SwiftUI Parity Checklist

- [x] Large navigation titles
- [x] Inset grouped list style (card appearance)
- [x] "+" button on LEFT, "Next" on RIGHT (Setup screen)
- [x] Gear on LEFT, Info on RIGHT (Feed screen)
- [x] Black checkmark (not blue)
- [x] Correct About screen logo
- [x] Correct menu item order (Libraries first, Author's Blog second)
- [x] Navigation: gear taps go BACK (not push new screen)
- [x] Serializable navigation params (pubDate as string)

## Comparing with SwiftUI

Screenshots for comparison are stored in:
- `../screenshots/swiftui/` - Original SwiftUI app
- `../screenshots/react-native-ios/` - React Native iOS
- `../screenshots/react-native-android/` - React Native Android
- `.maestro-output/screenshots/` - Latest Maestro captures (export into `../screenshots/` for before/after diffs)
