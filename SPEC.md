# SwiftUI to React Native Conversion Plan

## Overview
Convert the SwiftUI Sample App (RSS feed reader) to React Native while preserving all functionality.

---

## 1. Current Application Analysis

### Architecture Summary
- **Pattern**: MVVM-C (Model-View-ViewModel with Coordinators)
- **Modules**: App, Core, Features (Setup, Feed, About)
- **Navigation**: Coordinator-based NavigationStack with enum routing
- **State**: @State (local), @Observable (coordinator), @Binding (forms)
- **Services**: Protocol Witness pattern (closure-based DI)

### Screens to Convert (6 total)
| SwiftUI Screen | Purpose | Key Components |
|----------------|---------|----------------|
| SetupView | RSS source selection list | List, sheet modal, toolbar buttons |
| AddSourceView | Add custom RSS source (modal) | Form, validation, TextField |
| FeedView | Display RSS items | List, pull-to-refresh, loading states |
| DetailView | Article WebView | WKWebView wrapper |
| AboutView | App information | Static list, external links |
| LibrariesView | Third-party licenses | Static list |

### Core Features to Preserve
1. RSS source management (select from presets / add custom / persist selection)
2. RSS/Atom feed fetching and parsing (FeedKit library)
3. Article display in embedded WebView
4. Form validation (URL regex, required fields, real-time feedback)
5. Pull-to-refresh on feed list
6. UserDefaults persistence (selected RSS source)
7. Error handling with dismissable alerts
8. Loading state management (loading/loaded/error with cached data)

### Data Models
```
RssSource { title, url, rss, icon? }  - Codable, persisted
RssItem { title, description?, link, pubDate? }  - In-memory only
Screen { setup | feed(RssSource) | item(RssItem) | about | libraries }
ScreenState<T> { loading | loaded(T) | error(T?, Error) }
```

### Services Architecture
```
Container (DI)
├── Settings: get() -> RssSource?, set(RssSource?) -> void
│   └── Storage: UserDefaults with JSON encoding
└── Feed: get(RssSource) async throws -> [RssItem]
    └── Parser: FeedKit (RSS/Atom support)
```

---

## 2. Architecture Mapping (SwiftUI → React Native)

### Navigation
| SwiftUI | React Native |
|---------|--------------|
| NavigationStack + path | React Navigation Stack Navigator |
| Screen enum routing | TypeScript union types for routes |
| Coordinator pattern | Navigation service / Redux actions |
| .navigationDestination() | Stack.Screen components |
| .sheet(isPresented:) | Modal component or navigation modal |
| .fullScreenCover() | Modal with full screen presentation |

### State Management
| SwiftUI | React Native |
|---------|--------------|
| @State | useState hook |
| @Observable | Context / Redux / Zustand store |
| @Binding | Callback props + setState |
| ScreenState<T> enum | Custom hook with status union type |
| .task { await } | useEffect with async function |
| .refreshable { } | RefreshControl component |

### UI Components
| SwiftUI | React Native |
|---------|--------------|
| List | FlatList / SectionList |
| Form + Section | Custom styled containers |
| TextField | TextInput |
| Button | TouchableOpacity / Pressable |
| ProgressView | ActivityIndicator |
| AsyncImage | Image + fast-image library |
| WKWebView | react-native-webview |
| SFSafariViewController | InAppBrowser or Linking.openURL |
| Alert | Alert.alert() |
| NavigationTitle | Screen options.title |
| ToolbarItem | headerLeft / headerRight |

### Services
| SwiftUI | React Native |
|---------|--------------|
| UserDefaults | AsyncStorage |
| FeedKit | rss-parser or react-native-rss-parser |
| JSONEncoder/Decoder | JSON.stringify/parse |
| OSLog | console or logging library |

---

## 3. Technology Stack Decisions

### Project Configuration
| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | Expo | Easier setup, managed workflow, OTA updates |
| **State Management** | React Context | Built-in, simple, sufficient for app complexity |
| **Platforms** | iOS + Android | Cross-platform from the start |
| **Location** | New folder in this repo | Keep SwiftUI code for reference |
| **Language** | TypeScript | Type safety for routes and models |

### Core Dependencies
| Category | Library | Purpose |
|----------|---------|---------|
| Navigation | @react-navigation/native + stack | Screen routing |
| Storage | @react-native-async-storage/async-storage | Persist RSS source |
| RSS Parsing | rss-parser | Fetch & parse RSS/Atom feeds |
| WebView | react-native-webview | Display articles |
| Expo Router | expo-router (alternative) | File-based routing option |

### Optional Enhancements
| Category | Library | Notes |
|----------|---------|-------|
| Image Caching | expo-image | Better than built-in Image |
| In-App Browser | expo-web-browser | For external links (About screen) |
| Linking | expo-linking | Deep linking support |

---

## 4. Conversion Phases

### Phase 0: Migration Matrix & Baseline Screenshots
- Create `MIGRATION_MATRIX.md` file (see Section 8 for template)
- Capture baseline SwiftUI screenshots for all screens and states:
  - Run SwiftUI app in iOS Simulator
  - Capture screenshots using `xcrun simctl io booted screenshot`
  - Save to `screenshots/swiftui/` folder
- Document existing test cases from `SettingsTests.swift`
- Verify all SwiftUI features work as expected (baseline verification)

### Phase 1: Project Setup
- Create `react-native-app/` folder in repository root
- Initialize Expo project: `npx create-expo-app@latest . --template expo-template-blank-typescript`
- Install core dependencies:
  - `@react-navigation/native`, `@react-navigation/stack`
  - `@react-native-async-storage/async-storage`
  - `react-native-webview`
  - `rss-parser`
  - `expo-web-browser`
  - `jest`, `@testing-library/react-native` (for TDD)
- Set up folder structure (screens, services, components, hooks, __tests__)
- Copy `sources.json` to assets
- Configure Jest for testing

### Phase 2: Core Infrastructure (TDD)
- Define TypeScript types (`src/models/types.ts`):
  - `RssSource`, `RssItem`, `ScreenState<T>`, route params

**Settings Service (TDD):**
1. Write tests first (`__tests__/settings.test.ts`):
   - Port `testInitialGet`, `testSetAndGet`, `testRemoving`
   - Tests should FAIL (red phase)
2. Implement Settings service (`src/services/settings.ts`)
3. Tests should PASS (green phase)
4. Update migration matrix with checkmarks

**Feed Service (TDD):**
1. Write tests first (`__tests__/feed.test.ts`):
   - Test RSS parsing, Atom parsing, error handling
   - Tests should FAIL (red phase)
2. Implement Feed service (`src/services/feed.ts`)
3. Tests should PASS (green phase)
4. Update migration matrix with checkmarks

**Other Infrastructure:**
- Create Context for app state (`src/context/AppContext.tsx`)
- Create `useLoadableState` hook (`src/hooks/useLoadableState.ts`)

### Phase 3: Navigation Setup
- Configure React Navigation (`src/navigation/RootNavigator.tsx`):
  - Stack navigator with all screens
  - Type-safe route definitions
- Implement initial route logic:
  - Check AsyncStorage for saved source
  - Navigate to Feed if exists, otherwise Setup

### Phase 4: Screen Implementation

For each screen, follow this process:
1. Review SwiftUI baseline screenshot
2. Implement React Native screen
3. Capture RN screenshot (iOS + Android)
4. Compare with SwiftUI screenshot
5. Update migration matrix with checkmarks

| SwiftUI | React Native | Key Features |
|---------|--------------|--------------|
| SetupView | SetupScreen | FlatList, source selection, modal trigger |
| AddSourceView | AddSourceModal | Form fields, validation, Modal component |
| FeedView | FeedScreen | FlatList, RefreshControl, loading states |
| DetailView | DetailScreen | WebView component |
| AboutView | AboutScreen | Static list, expo-web-browser |
| LibrariesView | LibrariesScreen | Static FlatList |

### Phase 5: Component Implementation
- `SourceRow` - Source item with icon and selection indicator
- `ItemRow` - Feed item with title/description
- `FormField` - Input with validation state
- `LoadingScreen` - Reusable loading/error wrapper

### Phase 6: Features & Polish
- Pull-to-refresh on FeedScreen
- Real-time form validation (URL regex, required)
- Error alerts with Alert.alert()
- Loading indicators (ActivityIndicator)
- Persistence verification (reload app test)

### Phase 7: Testing & Validation (TDD Approach)

**Step 1: Create Migration Matrix**
- Create `MIGRATION_MATRIX.md` file to track all migration progress
- Document every screen, component, service, and test mapping
- Include screenshot comparison placeholders for each screen

**Step 2: Migrate Existing Tests First (Red Phase)**
- Port `SettingsTests.swift` to Jest/React Native Testing Library
- Tests should FAIL initially (no implementation yet)
- Existing SwiftUI tests to migrate:
  - `testInitialGet` → Settings service returns null initially
  - `testSetAndGet` → Settings service persists and retrieves source
  - `testRemoving` → Settings service removes source when set to null

**Step 3: Implement to Pass Tests (Green Phase)**
- Implement Settings service → tests pass
- Implement Feed service → add tests, make pass
- Continue for each service/component

**Step 4: Screen-by-Screen Validation**
- For each screen:
  1. Capture SwiftUI screenshot (iOS Simulator)
  2. Implement React Native screen
  3. Capture React Native screenshot (iOS Simulator + Android Emulator)
  4. Compare screenshots, document differences
  5. Mark as complete in migration matrix

**Step 5: Cross-Platform Testing**
- Test on iOS Simulator
- Test on Android Emulator
- Document any platform-specific differences

**Step 6: Edge Case Testing**
- Network errors (offline, timeout)
- Empty feeds
- Invalid URLs
- Malformed RSS/Atom data

---

## 5. Risk Areas & Challenges

### High Risk
| Area | Challenge | Mitigation |
|------|-----------|------------|
| RSS Parsing | FeedKit vs JS parsers may differ | Test with same RSS feeds |
| Navigation State | Coordinator pattern translation | Use navigation state persistence |
| Form Validation | Real-time validation UX | Match SwiftUI behavior closely |

### Medium Risk
| Area | Challenge | Mitigation |
|------|-----------|------------|
| WebView | WKWebView features vs RN WebView | Test article rendering |
| Async Patterns | Task modifier vs useEffect lifecycle | Handle cleanup properly |
| Styling | SwiftUI system styles vs RN | Create theme constants |

### Low Risk
| Area | Notes |
|------|-------|
| Storage | AsyncStorage is well-documented |
| Static screens | AboutView, LibrariesView are straightforward |

---

## 6. File Structure Mapping

### SwiftUI Structure
```
sources/
├── SwiftUISampleApp/           → Entry point
├── App/Sources/App/
│   ├── Coordinator/            → Navigation logic
│   ├── Model/Screen.swift      → Route definitions
│   └── Services/Container.swift → DI container
├── Core/Sources/Core/
│   ├── Models/RssSource.swift  → Data models
│   ├── Services/Settings.swift → Persistence
│   └── Extensions/             → View helpers
└── Features/Sources/Features/
    ├── Setup/                  → SetupView, AddSourceView
    ├── Feed/                   → FeedView, DetailView
    └── About/                  → AboutView, LibrariesView
```

### React Native Project Structure (Expo)
```
react-native-app/                    → New folder in repo root
├── App.tsx                          → Entry point + Providers
├── app.json                         → Expo config
├── package.json
├── tsconfig.json
├── src/
│   ├── navigation/
│   │   ├── types.ts                 → RootStackParamList
│   │   └── RootNavigator.tsx        → Stack.Navigator
│   ├── context/
│   │   └── AppContext.tsx           → Settings context provider
│   ├── services/
│   │   ├── settings.ts              → AsyncStorage wrapper
│   │   └── feed.ts                  → RSS fetch/parse
│   ├── models/
│   │   └── types.ts                 → RssSource, RssItem, ScreenState
│   ├── hooks/
│   │   └── useLoadableState.ts      → Loading state hook
│   ├── screens/
│   │   ├── SetupScreen.tsx
│   │   ├── FeedScreen.tsx
│   │   ├── DetailScreen.tsx
│   │   ├── AboutScreen.tsx
│   │   └── LibrariesScreen.tsx
│   ├── components/
│   │   ├── AddSourceModal.tsx
│   │   ├── SourceRow.tsx
│   │   ├── ItemRow.tsx
│   │   ├── FormField.tsx
│   │   └── LoadingWrapper.tsx
│   └── utils/
│       └── validation.ts            → URL validation regex
└── assets/
    └── sources.json                 → Copied from SwiftUI project
```

---

## 7. Key Source Files Reference

### Must-Analyze for Conversion
| SwiftUI File | Purpose |
|--------------|---------|
| `sources/App/Sources/App/Coordinator/Coordinator.swift` | Navigation logic |
| `sources/App/Sources/App/Coordinator/CoordinatorView.swift` | Root view |
| `sources/Core/Sources/Core/Services/Settings.swift` | Persistence |
| `sources/Features/Sources/Features/Feed/Services/Feed.swift` | RSS fetching |
| `sources/Features/Sources/Features/Setup/Views/SetupView.swift` | Main setup UI |
| `sources/Features/Sources/Features/Setup/Views/AddSourceView.swift` | Form + validation |
| `sources/Features/Sources/Features/Feed/Views/FeedView.swift` | Feed list |
| `sources/Core/Sources/Core/LoadableScreen.swift` | Loading state pattern |

---

## 8. Migration Matrix (MIGRATION_MATRIX.md)

A separate tracking file will be created at `react-native-app/MIGRATION_MATRIX.md` to track all migration progress with checkboxes, code mappings, and screenshot comparisons.

### Matrix Structure

#### 8.1 Screen Migration Tracker

| Screen | SwiftUI File | RN File | Tests | Screenshots | Status |
|--------|--------------|---------|-------|-------------|--------|
| Setup | SetupView.swift | SetupScreen.tsx | ⬜ | ⬜ SwiftUI ⬜ RN-iOS ⬜ RN-Android | ⬜ Not Started |
| Add Source | AddSourceView.swift | AddSourceModal.tsx | ⬜ | ⬜ SwiftUI ⬜ RN-iOS ⬜ RN-Android | ⬜ Not Started |
| Feed | FeedView.swift | FeedScreen.tsx | ⬜ | ⬜ SwiftUI ⬜ RN-iOS ⬜ RN-Android | ⬜ Not Started |
| Detail | DetailView.swift | DetailScreen.tsx | ⬜ | ⬜ SwiftUI ⬜ RN-iOS ⬜ RN-Android | ⬜ Not Started |
| About | AboutView.swift | AboutScreen.tsx | ⬜ | ⬜ SwiftUI ⬜ RN-iOS ⬜ RN-Android | ⬜ Not Started |
| Libraries | LibrariesView.swift | LibrariesScreen.tsx | ⬜ | ⬜ SwiftUI ⬜ RN-iOS ⬜ RN-Android | ⬜ Not Started |

#### 8.2 Component Migration Tracker

| Component | SwiftUI File | RN File | Tests | Status |
|-----------|--------------|---------|-------|--------|
| SourceRow | SourceRow.swift | SourceRow.tsx | ⬜ | ⬜ |
| ItemRow | ItemRow.swift | ItemRow.tsx | ⬜ | ⬜ |
| FormField | FormField.swift | FormField.tsx | ⬜ | ⬜ |
| WebView | WebView.swift | (react-native-webview) | ⬜ | ⬜ |
| LoadableScreen | LoadableScreen.swift | LoadingWrapper.tsx | ⬜ | ⬜ |

#### 8.3 Service Migration Tracker

| Service | SwiftUI File | RN File | Tests Migrated | Tests Passing | Status |
|---------|--------------|---------|----------------|---------------|--------|
| Settings | Settings.swift | settings.ts | ⬜ testInitialGet | ⬜ | ⬜ |
| | | | ⬜ testSetAndGet | ⬜ | |
| | | | ⬜ testRemoving | ⬜ | |
| Feed | Feed.swift | feed.ts | ⬜ fetchRss | ⬜ | ⬜ |
| | | | ⬜ fetchAtom | ⬜ | |
| | | | ⬜ handleError | ⬜ | |

#### 8.4 Test Migration Tracker

| Original Test | Test File | RN Test File | Migrated | Passing |
|---------------|-----------|--------------|----------|---------|
| testInitialGet | SettingsTests.swift | settings.test.ts | ⬜ | ⬜ |
| testSetAndGet | SettingsTests.swift | settings.test.ts | ⬜ | ⬜ |
| testRemoving | SettingsTests.swift | settings.test.ts | ⬜ | ⬜ |

#### 8.5 Screenshot Comparison Log

For each screen, capture and compare:

```
screenshots/
├── swiftui/
│   ├── setup-screen.png
│   ├── add-source-modal.png
│   ├── feed-screen-loading.png
│   ├── feed-screen-loaded.png
│   ├── feed-screen-error.png
│   ├── detail-screen.png
│   ├── about-screen.png
│   └── libraries-screen.png
├── react-native-ios/
│   └── (same structure)
└── react-native-android/
    └── (same structure)
```

| Screen | State | SwiftUI | RN iOS | RN Android | Visual Match |
|--------|-------|---------|--------|------------|--------------|
| Setup | Default | ⬜ | ⬜ | ⬜ | ⬜ |
| Setup | With selection | ⬜ | ⬜ | ⬜ | ⬜ |
| Add Source | Empty form | ⬜ | ⬜ | ⬜ | ⬜ |
| Add Source | Validation error | ⬜ | ⬜ | ⬜ | ⬜ |
| Add Source | Valid form | ⬜ | ⬜ | ⬜ | ⬜ |
| Feed | Loading | ⬜ | ⬜ | ⬜ | ⬜ |
| Feed | Loaded | ⬜ | ⬜ | ⬜ | ⬜ |
| Feed | Error | ⬜ | ⬜ | ⬜ | ⬜ |
| Detail | Article loaded | ⬜ | ⬜ | ⬜ | ⬜ |
| About | Default | ⬜ | ⬜ | ⬜ | ⬜ |
| Libraries | Default | ⬜ | ⬜ | ⬜ | ⬜ |

#### 8.6 Feature Behavior Verification

| Feature | SwiftUI Behavior | RN Behavior | Match |
|---------|------------------|-------------|-------|
| Pull-to-refresh | ⬜ Verified | ⬜ Implemented | ⬜ |
| Form validation (URL) | ⬜ Verified | ⬜ Implemented | ⬜ |
| Form validation (required) | ⬜ Verified | ⬜ Implemented | ⬜ |
| Persistence (app restart) | ⬜ Verified | ⬜ Implemented | ⬜ |
| Error alert dismissal | ⬜ Verified | ⬜ Implemented | ⬜ |
| Navigation back | ⬜ Verified | ⬜ Implemented | ⬜ |
| External link (Safari) | ⬜ Verified | ⬜ Implemented | ⬜ |

---

## 9. Feature Parity Checklist

When implementation is complete, verify these features work identically:

- [ ] Load preset RSS sources from JSON file
- [ ] Select RSS source from list
- [ ] Add custom RSS source via modal form
- [ ] URL validation (regex pattern)
- [ ] Required field validation
- [ ] Persist selected source (survives app restart)
- [ ] Fetch and parse RSS feed
- [ ] Fetch and parse Atom feed
- [ ] Display feed items in scrollable list
- [ ] Pull-to-refresh on feed list
- [ ] Loading indicator during fetch
- [ ] Error alert on fetch failure
- [ ] Tap item to view in WebView
- [ ] Navigate to About screen
- [ ] Open external link in browser (About)
- [ ] View libraries/licenses list
- [ ] Navigate back to Setup (change source)

---

## 10. iOS Simulator Interaction Guide

Use this guide to view and interact with the SwiftUI app for reference during conversion.

### Taking Screenshots (Viewing the App)

```bash
# Capture screenshot from running simulator
xcrun simctl io booted screenshot /tmp/screenshot.png

# Then read the image to see current UI state
```

### Clicking/Tapping (Interacting with the App)

**Step 1 - Get window position:**
```bash
osascript -e '
tell application "System Events"
    tell process "Simulator"
        set frontWindow to front window
        set winPos to position of frontWindow
        set winSize to size of frontWindow
        return "Position: " & (item 1 of winPos) & "," & (item 2 of winPos) & " Size: " & (item 1 of winSize) & "," & (item 2 of winSize)
    end tell
end tell
'
```

**Step 2 - Click at coordinates:**
```bash
osascript -e '
tell application "System Events"
    tell process "Simulator"
        set frontWindow to front window
        set winPos to position of frontWindow
        set clickX to (item 1 of winPos) + <X_OFFSET>
        set clickY to (item 2 of winPos) + <Y_OFFSET>
        click at {clickX, clickY}
    end tell
end tell
'
```

**Note:** Offsets are relative to top-left of Simulator window. Account for ~50px title bar.

### Useful Simulator Commands

| Command | Description |
|---------|-------------|
| `xcrun simctl list devices` | List available simulators |
| `xcrun simctl boot <uuid>` | Boot a simulator |
| `open -a Simulator` | Open Simulator app |
| `xcrun simctl install booted /path/to/App.app` | Install app |
| `xcrun simctl launch booted <bundle_id>` | Launch app |
| `osascript -e 'tell application "Simulator" to activate'` | Bring to front |

### Testing Feedback Loop

1. Take screenshot → Read image → Understand current UI state
2. Calculate click coordinates based on visible elements
3. Execute click via AppleScript
4. Take another screenshot → Verify action worked
5. Repeat

### Limitations

| Capability | Status |
|------------|--------|
| Screenshots | ✅ Works |
| Single taps/clicks | ✅ Works via AppleScript |
| Swipe gestures | ⚠️ May need drag simulation |
| Text input | ⚠️ Use `osascript keystroke` or `simctl pbcopy` + paste |
| Multi-touch | ❌ Not available |

### Prerequisites

- macOS with Xcode installed
- iOS Simulator runtime downloaded
- Simulator device created and booted
- Accessibility permissions may be needed for AppleScript UI control

---

## Status: HIGH-LEVEL PLAN COMPLETE

**Decisions Made:**
- Framework: Expo (TypeScript template)
- State: React Context
- Platforms: iOS + Android
- Location: `react-native-app/` folder in this repo

**Next Steps:**
When ready to implement, this plan provides the architecture mapping and phase breakdown needed to convert the SwiftUI app to React Native with full feature parity.
