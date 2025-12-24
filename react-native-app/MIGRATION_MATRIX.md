# Migration Matrix - SwiftUI to React Native

> This file tracks all migration progress with checkboxes, code mappings, and screenshot comparisons.

---

## 1. Screen Migration Tracker

| Screen | SwiftUI File | RN File | Tests | Screenshots | Status |
|--------|--------------|---------|-------|-------------|--------|
| Setup | SetupView.swift | SetupScreen.tsx | ✅ | ✅ SwiftUI ✅ RN-iOS ⬜ RN-Android | ✅ Implemented |
| Add Source | AddSourceView.swift | AddSourceModal.tsx | ⬜ | ✅ SwiftUI ⬜ RN-iOS ⬜ RN-Android | ✅ Implemented |
| Feed | FeedView.swift | FeedScreen.tsx | ✅ | ⬜ SwiftUI ⬜ RN-iOS ⬜ RN-Android | ✅ Implemented |
| Detail | DetailView.swift | DetailScreen.tsx | ⬜ | ⬜ SwiftUI ⬜ RN-iOS ⬜ RN-Android | ✅ Implemented |
| About | AboutView.swift | AboutScreen.tsx | ⬜ | ⬜ SwiftUI ⬜ RN-iOS ⬜ RN-Android | ✅ Implemented |
| Libraries | LibrariesView.swift | LibrariesScreen.tsx | ⬜ | ⬜ SwiftUI ⬜ RN-iOS ⬜ RN-Android | ✅ Implemented |

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

### Directory Structure
```
screenshots/
├── swiftui/
│   ├── setup-screen-default.png ✅
│   ├── setup-screen-selected.png ✅
│   ├── add-source-empty.png
│   ├── add-source-validation-error.png
│   ├── add-source-valid.png
│   ├── feed-screen-loading.png
│   ├── feed-screen-loaded.png
│   ├── feed-screen-error.png
│   ├── detail-screen.png
│   ├── about-screen.png
│   └── libraries-screen.png
├── react-native-ios/
│   ├── setup-screen-default.png ✅
│   └── setup-screen-selected.png ✅
└── react-native-android/
    └── (pending)
```

### Screenshot Status

| Screen | State | SwiftUI | RN iOS | RN Android | Visual Match |
|--------|-------|---------|--------|------------|--------------|
| Setup | Default | ✅ | ✅ (updated) | ⬜ | ✅ Match (after Phase 5) |
| Setup | With selection | ✅ | ✅ | ⬜ | ✅ Match (after Phase 5) |
| Add Source | Empty form | ⬜ | ⬜ | ⬜ | ⬜ |
| Add Source | Validation error | ⬜ | ⬜ | ⬜ | ⬜ |
| Add Source | Valid form | ⬜ | ⬜ | ⬜ | ⬜ |
| Feed | Loading | ⬜ | ⬜ | ⬜ | ⬜ |
| Feed | Loaded | ⬜ | ⬜ | ⬜ | ⬜ |
| Feed | Error | ⬜ | ⬜ | ⬜ | ⬜ |
| Detail | Article loaded | ⬜ | ⬜ | ⬜ | ⬜ |
| About | Default | ⬜ | ⬜ | ⬜ | ⬜ (logo fixed) |
| Libraries | Default | ⬜ | ⬜ | ⬜ | ⬜ |

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
