# Migration Matrix - SwiftUI to React Native

> This file tracks all migration progress with checkboxes, code mappings, and screenshot comparisons.

---

## 1. Screen Migration Tracker

| Screen | SwiftUI File | RN File | Tests | Screenshots | Status |
|--------|--------------|---------|-------|-------------|--------|
| Setup | SetupView.swift | SetupScreen.tsx | ✅ | ✅ SwiftUI ✅ RN-iOS ⬜ RN-Android | ✅ Implemented |
| Add Source | AddSourceView.swift | AddSourceModal.tsx | ⬜ | ✅ SwiftUI ✅ RN-iOS ⬜ RN-Android | ✅ Implemented |
| Feed | FeedView.swift | FeedScreen.tsx | ✅ | ✅ SwiftUI ✅ RN-iOS ⬜ RN-Android | ✅ Implemented |
| Detail | DetailView.swift | DetailScreen.tsx | ⬜ | ✅ SwiftUI ✅ RN-iOS ⬜ RN-Android | ✅ Implemented |
| About | AboutView.swift | AboutScreen.tsx | ⬜ | ✅ SwiftUI ✅ RN-iOS ⬜ RN-Android | ✅ Implemented |
| Libraries | LibrariesView.swift | LibrariesScreen.tsx | ⬜ | ✅ SwiftUI ✅ RN-iOS ⬜ RN-Android | ✅ Implemented |

---

## 2. Component Migration Tracker

| Component | SwiftUI File | RN File | Tests | Status |
|-----------|--------------|---------|-------|--------|
| SourceRow | SourceRow.swift | SourceRow.tsx | ⬜ | ✅ Implemented |
| ItemRow | ItemRow.swift | ItemRow.tsx | ⬜ | ✅ Implemented |
| FormField | FormField.swift | FormField.tsx | ⬜ | ✅ Implemented |
| WebView | WebView.swift | (react-native-webview) | ⬜ | ✅ Implemented |
| LoadableScreen | LoadableScreen.swift | LoadingWrapper.tsx | ⬜ | ✅ Implemented |

---

## 3. Service Migration Tracker

| Service | SwiftUI File | RN File | Tests Migrated | Tests Passing | Status |
|---------|--------------|---------|----------------|---------------|--------|
| Settings | Settings.swift | settings.ts | ✅ testInitialGet | ✅ | ✅ Complete |
| | | | ✅ testSetAndGet | ✅ | |
| | | | ✅ testRemoving | ✅ | |
| Feed | Feed.swift | feed.ts | ✅ fetchRss | ✅ | ✅ Complete |
| | | | ✅ fetchError | ✅ | |
| | | | ✅ handleError | ✅ | |
| | | | ✅ stripHtml | ✅ | |

---

## 4. Test Migration Tracker

| Original Test | Test File | RN Test File | Migrated | Passing |
|---------------|-----------|--------------|----------|---------|
| testInitialGet | SettingsTests.swift | settings.test.ts | ✅ | ✅ |
| testSetAndGet | SettingsTests.swift | settings.test.ts | ✅ | ✅ |
| testRemoving | SettingsTests.swift | settings.test.ts | ✅ | ✅ |

**Total Tests: 7 (3 Settings + 4 Feed)**

---

## 5. Screenshot Comparison Log

### Screenshot Capture Protocol (Dual Simulators + Size Limits)
- Always run two iOS simulators at the same time: one for **SwiftUI (old)** and one for **React Native (new)**.
- Use the **same device model and runtime** for both to keep resolution identical.
- **Standard resolution:** iPhone 17 Pro portrait = **1206 × 2622 px** (402 × 874 pt @3x).
- **Size limit:** keep each PNG **≤ 400 KB**. Check with `ls -lh screenshots/**/**/*.png`.
- If any PNG exceeds 400 KB, downscale **both SwiftUI + RN** screenshots from that capture batch:
  - `sips -Z 2000 screenshots/swiftui/*.png screenshots/react-native-ios/*.png`
  - Re-check sizes and note the resize in this log.

### Screenshot Capture Steps (Exact)
1. Boot both simulators and set identical status bars:
   - `xcrun simctl list devices | rg -n \"iPhone 17 Pro\"`
   - `xcrun simctl boot <SWIFTUI_UDID>` and `xcrun simctl boot <RN_UDID>`
   - `xcrun simctl status_bar <UDID> override --time \"09:41\" --dataNetwork wifi --wifiBars 3 --cellularBars 4 --batteryState charged --batteryLevel 100`
2. **React Native (new):** run Maestro and export screenshots.
   - `DEV_CLIENT_URL=\"exp+react-native-app://expo-development-client/?url=http%3A%2F%2F<LAN_IP>%3A8081\"`
   - `maestro test --debug-output=react-native-app/.maestro-output/debug --flatten-debug-output -e DEV_CLIENT_URL=\"$DEV_CLIENT_URL\" react-native-app/maestro/verify-screens.yaml`
   - `cp -f .maestro-output/screenshots/*.png screenshots/react-native-ios/`
3. **SwiftUI (old):** run the SwiftUI Maestro flow and copy screenshots.
   - `maestro test --debug-output=sources/.maestro-output/debug --flatten-debug-output sources/maestro/swiftui-verify-screens.yaml`
   - `cp -f sources/.maestro-output/screenshots/screenshots/*.png screenshots/swiftui/`
4. Verify size/resolution, then update this log.

### Directory Structure
```
screenshots/
├── swiftui/
│   ├── setup-screen-default.png ✅
│   ├── setup-screen-selected.png ✅
│   ├── add-source-empty.png ✅
│   ├── add-source-validation-error.png ✅
│   ├── add-source-valid.png ✅
│   ├── feed-screen-loading.png ✅
│   ├── feed-screen-loaded.png ✅
│   ├── feed-screen-error.png ✅
│   ├── detail-screen.png ✅
│   ├── about-screen.png ✅
│   └── libraries-screen.png ✅
├── react-native-ios/
│   ├── setup-screen-default.png ✅
│   ├── setup-screen-selected.png ✅
│   ├── add-source-empty.png ✅
│   ├── add-source-validation-error.png ✅
│   ├── add-source-valid.png ✅
│   ├── feed-screen-loading.png ✅
│   ├── feed-screen-loaded.png ✅
│   ├── feed-screen-error.png ✅
│   ├── detail-screen.png ✅
│   ├── about-screen.png ✅
│   └── libraries-screen.png ✅
└── react-native-android/
    └── (pending)
```

### Screenshot Status

| Screen | State | SwiftUI | RN iOS | RN Android | Visual Match |
|--------|-------|---------|--------|------------|--------------|
| Setup | Default | ✅ | ✅ (updated) | ⬜ | ⚠️ Minor |
| Setup | With selection | ✅ | ✅ | ⬜ | ⚠️ Minor |
| Add Source | Empty form | ✅ | ✅ | ⬜ | ⚠️ Minor |
| Add Source | Validation error | ✅ | ✅ | ⬜ | ⚠️ Minor |
| Add Source | Valid form | ✅ | ✅ | ⬜ | ⚠️ Minor |
| Feed | Loading | ✅ | ✅ | ⬜ | ⚠️ Minor |
| Feed | Loaded | ✅ | ✅ | ⬜ | ⚠️ Minor |
| Feed | Error | ✅ | ✅ | ⬜ | ⚠️ Minor |
| Detail | Article loaded | ✅ | ✅ | ⬜ | ✅ Match |
| About | Default | ✅ | ✅ | ⬜ | ⚠️ Minor |
| Libraries | Default | ✅ | ✅ | ⬜ | ⚠️ Minor |

### Visual Parity Review Log (iOS)

| Screen/State | SwiftUI Screenshot | RN iOS Screenshot | Match | Notes |
|--------------|-------------------|------------------|-------|-------|
| Setup - Default | `screenshots/swiftui/setup-screen-default.png` | `screenshots/react-native-ios/setup-screen-default.png` | ⚠️ | Minor spacing + list row/icon sizing differences; disabled Next tint/opacity slightly different. |
| Setup - Selected | `screenshots/swiftui/setup-screen-selected.png` | `screenshots/react-native-ios/setup-screen-selected.png` | ⚠️ | Next pill styling still slightly different; small row spacing differences. |
| Add Source - Empty | `screenshots/swiftui/add-source-empty.png` | `screenshots/react-native-ios/add-source-empty.png` | ⚠️ | Sheet layout now aligned; minor label sizing/top padding differences. |
| Add Source - Validation error | `screenshots/swiftui/add-source-validation-error.png` | `screenshots/react-native-ios/add-source-validation-error.png` | ⚠️ | URL validation text should be red (SwiftUI); RN shows default text color. |
| Add Source - Valid | `screenshots/swiftui/add-source-valid.png` | `screenshots/react-native-ios/add-source-valid.png` | ⚠️ | Add button enabled color differs; scroll/keyboard inset shows more of Image URL field in RN. |
| Feed - Loading | `screenshots/swiftui/feed-screen-loading.png` | `screenshots/react-native-ios/feed-screen-loading.png` | ⚠️ | Refresh banner no longer visible; minor header icon/tint differences remain. |
| Feed - Loaded | `screenshots/swiftui/feed-screen-loaded.png` | `screenshots/react-native-ios/feed-screen-loaded.png` | ⚠️ | Row typography/spacing + chevron weight slightly differ; header icons minor. |
| Feed - Error | `screenshots/swiftui/feed-screen-error.png` | `screenshots/react-native-ios/feed-screen-error.png` | ⚠️ | Refresh banner no longer visible; minor header icon/tint differences remain. |
| Detail - Article loaded | `screenshots/swiftui/detail-screen.png` | `screenshots/react-native-ios/detail-screen.png` | ✅ | Very close; minor nav bar/spacing differences only. |
| About - Default | `screenshots/swiftui/about-screen.png` | `screenshots/react-native-ios/about-screen.png` | ⚠️ | Overlap fixed; minor nav back button label/style difference vs SwiftUI. |
| Libraries - Default | `screenshots/swiftui/libraries-screen.png` | `screenshots/react-native-ios/libraries-screen.png` | ⚠️ | Overlap fixed; minor nav back button label/style difference vs SwiftUI. |

---

## 6. Feature Behavior Verification

| Feature | SwiftUI Behavior | RN Behavior | Match |
|---------|------------------|-------------|-------|
| Pull-to-refresh | ⬜ Verified | ✅ Implemented | ⬜ |
| Form validation (URL) | ⬜ Verified | ✅ Implemented | ⬜ |
| Form validation (required) | ⬜ Verified | ✅ Implemented | ⬜ |
| Persistence (app restart) | ⬜ Verified | ✅ Implemented | ⬜ |
| Error alert dismissal | ⬜ Verified | ✅ Implemented | ⬜ |
| Navigation back | ⬜ Verified | ✅ Implemented | ⬜ |
| External link (Safari) | ⬜ Verified | ✅ Implemented | ⬜ |

---

## 7. Notes & Issues

### Phase 0 Notes
- [x] Captured SwiftUI baseline screenshots (Setup screen default and selected states)
- [x] Created Migration Matrix file
- [x] Created screenshot directories

### Phase 1 Notes
- [x] Initialized Expo project with TypeScript
- [x] Installed all required dependencies
- [x] Created source directory structure
- [x] Configured Jest for testing
- [x] Copied sources.json to assets

### Phase 2 Notes
- [x] Created TypeScript types (RssSource, RssItem, ScreenState)
- [x] Implemented Settings service with TDD (3 tests passing)
- [x] Implemented Feed service with TDD (4 tests passing)
- [x] Created useLoadableState hook
- [x] Created AppContext for state management

### Phase 3 Notes
- [x] Created navigation types
- [x] Implemented RootNavigator with Stack Navigator
- [x] Set up initial route logic based on saved source

### Phase 4 Notes
- [x] Implemented all screens (Setup, Feed, Detail, About, Libraries)
- [x] Created all components (SourceRow, ItemRow, FormField, AddSourceModal, LoadingWrapper)
- [x] Added URL validation utility
- [x] **CRITICAL FIX**: Replaced `rss-parser` with `react-native-rss-parser` due to Node.js compatibility issues
  - `rss-parser` uses Node.js built-in modules (`http`, `https`) not available in React Native
  - `react-native-rss-parser` is designed for React Native and uses `fetch` API
  - Updated `src/services/feed.ts` and `src/__tests__/feed.test.ts` accordingly
- [x] Captured React Native iOS screenshots for Setup screen (default and selected states)

### Phase 5 Notes - Visual Parity Fixes
- [x] **"+" button position**: Moved from RIGHT to LEFT (matches SwiftUI topBarLeading)
- [x] **Checkmark color**: Changed from blue (#007AFF) to black (#000) to match SF Symbol default
- [x] **Large title**: Switched from `@react-navigation/stack` to `@react-navigation/native-stack` for native large title support
- [x] **Card/inset grouped list style**: Added rounded corners (10px), proper background (#f2f2f7), contentInsetAdjustmentBehavior
- [x] **About screen logo**: Copied correct logo from SwiftUI (Icon-180.png) to assets/logo.png
- [x] **About screen item order**: Reordered to match SwiftUI (Libraries first, then Author's Blog)
- [x] **Libraries screen**: Updated package name from `rss-parser` to `react-native-rss-parser`
- [x] **Navigation behavior**: Changed `navigation.navigate('Setup')` to `navigation.goBack()` in FeedScreen to match SwiftUI pop behavior
- [x] **pubDate serialization**: Changed from Date to string for React Navigation serialization requirement
- [x] **SafeAreaView**: Updated to use `react-native-safe-area-context` (non-deprecated)
- [x] **Dev menu suppression (iOS dev build)**: Disabled Expo dev menu onboarding + gestures via UserDefaults in AppDelegate to keep screenshots clean.
- [x] **Maestro stability helpers**: Added testIDs for Add Source inputs and Detail WebView; updated flow to capture add-source/feed/detail/about/libraries states.
- [x] **SwiftUI Maestro hooks**: Added accessibility identifiers for Add Source fields/buttons to support SwiftUI Maestro flow.
- [x] **About/Libraries top inset**: Switched to header-height padding to avoid large title overlap.

### Capture Status (2025-12-27)
- RN iOS screenshots captured for all required states and copied into `screenshots/react-native-ios/`.
- SwiftUI Maestro flow completes end-to-end and screenshots captured for all required states, copied into `screenshots/swiftui/`.
- Dev menu onboarding sheet is disabled in DEBUG via UserDefaults to avoid blocking flows.
- About/Libraries overlap fixed in RN; screenshots re-captured.

### Capture Path Evaluation (2025-12-26)
- [x] **Ad-hoc iOS capture**: `react-native-app/scripts/screenshot-ios.sh` works against a booted simulator and saves PNGs deterministically.
- [x] **Maestro capture**: Java 17 installed and Maestro runs in dev-client mode. Flow now captures initial RN screenshots; remaining steps still flaky around Add Source inputs.
- [x] **Navigation coverage**: Maestro flows validate navigation (Setup → Feed → About → Libraries → Back → Setup) and enforce state reset via `launchApp(clearState: true)`.
- [x] **Decision**: Maestro flow verified end-to-end for SwiftUI and RN iOS; RN Android pending.

### Full Re-capture Checklist (iOS)
- [x] SwiftUI: Setup (default)
- [x] SwiftUI: Setup (selected)
- [x] SwiftUI: Add Source (empty)
- [x] SwiftUI: Add Source (validation error)
- [x] SwiftUI: Add Source (valid)
- [x] SwiftUI: Feed (loading)
- [x] SwiftUI: Feed (loaded)
- [x] SwiftUI: Feed (error)
- [x] SwiftUI: Detail (loaded)
- [x] SwiftUI: About
- [x] SwiftUI: Libraries
- [x] RN iOS: Setup (default)
- [x] RN iOS: Setup (selected)
- [x] RN iOS: Add Source (empty)
- [x] RN iOS: Add Source (validation error)
- [x] RN iOS: Add Source (valid)
- [x] RN iOS: Feed (loading)
- [x] RN iOS: Feed (loaded)
- [x] RN iOS: Feed (error)
- [x] RN iOS: Detail (loaded)
- [x] RN iOS: About
- [x] RN iOS: Libraries

---

## 8. Completion Summary

| Phase | Description | Status | Date |
|-------|-------------|--------|------|
| Phase 0 | Migration Matrix & Baseline Screenshots | ✅ Complete | 2025-12-23 |
| Phase 1 | Project Setup | ✅ Complete | 2025-12-23 |
| Phase 2 | Core Infrastructure (TDD) | ✅ Complete | 2025-12-23 |
| Phase 3 | Navigation Setup | ✅ Complete | 2025-12-23 |
| Phase 4 | Screen Implementation | ✅ Complete | 2025-12-23 |
| Phase 5 | Visual Parity Fixes | ✅ Complete | 2025-12-23 |
| Phase 6 | Android Testing | ⬜ Pending | |
| Phase 7 | Final Verification | ⬜ Pending | |
