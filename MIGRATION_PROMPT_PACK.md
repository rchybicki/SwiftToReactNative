# Swift (SwiftUI/UIKit) → React Native Migration Prompt Pack

This is a copy/paste “prompt sequence” you can feed to a coding agent to migrate an existing Swift iOS app to React Native using the same process used in this repository: **baseline first**, **migration matrix**, **TDD for core logic**, **screen-by-screen parity with deterministic screenshots**, and a final **production hardening** pass.

Each prompt is intentionally thorough. Run them **in order**. The outputs of earlier prompts become the inputs to later ones.

---

## How to use

- Replace placeholders like `{{IOS_APP_ROOT}}`, `{{RN_APP_DIR}}`, `{{APP_NAME}}`, `{{BUNDLE_ID}}` with your repo’s values.
- Prefer an **incremental migration loop**: implement one service/screen at a time, take screenshots, update the matrix, repeat.
- Maintain two running references throughout:
  - **Old app**: the existing iOS Swift app (SwiftUI or UIKit)
  - **New app**: the React Native app (Expo recommended)

---

## Prompt 00 — Ground Rules + Working Agreement

Paste this first:

```text
You are a coding agent migrating an existing Swift iOS app to React Native with visual + behavioral parity.

Non-negotiables:
1) Do NOT start implementation until you produce: (a) a SPEC, (b) an IMPLEMENTATION PLAN, and (c) a MIGRATION MATRIX.
2) Every screen migration must be validated with deterministic screenshots (old vs new) and recorded in the matrix.
3) Migrate/port existing non-UI logic tests first (TDD). If no tests exist, create minimal tests for critical services.
4) Keep React Navigation route params serializable (no Date/class instances); use strings and parse on screen.
5) Avoid libraries that require Node built-ins (http/https/fs/crypto) unless you can prove RN support.
6) Add accessibility identifiers/testIDs early to enable automation (Maestro).

Deliverables you will create in-repo:
- `SPEC.md` (architecture + mapping + risks)
- `IMPLEMENTATION_PLAN.md` (session-sized steps)
- `{{RN_APP_DIR}}/MIGRATION_MATRIX.md` (checklists + screenshot log)
- Screenshot folders under `screenshots/`

When done with each prompt: summarize changes, list created/modified files, and state the next prompt number to run.
```

---

## Prompt 01 — Audit the iOS App and Write `SPEC.md`

```text
Goal: produce a conversion SPEC for migrating this iOS Swift app to React Native.

Input:
- iOS app source root: `{{IOS_APP_ROOT}}`
- Any existing docs: README, architecture docs, ADRs, etc.

Tasks:
1) Enumerate all user-facing screens/routes, including modal flows, deep links, and edge-state UIs (loading/error/empty).
2) Identify the app’s architecture (SwiftUI + MVVM? Coordinators? UIKit + MVVM-C? Redux-ish?).
3) List critical features and data flows:
   - Persistence (UserDefaults/CoreData/Keychain/etc.)
   - Networking layer (URLSession, GraphQL, etc.), auth, caching/offline
   - Web views, media playback, push notifications, background tasks
   - Analytics/crash reporting
4) Inventory models and service boundaries:
   - For each service: API surface + dependencies + storage format
5) Inventory existing tests and how they map to future RN tests.
6) Decide and document a React Native stack:
   - Expo vs bare RN (justify)
   - Navigation choice (recommend `@react-navigation/native-stack` for iOS large titles)
   - State management choice (Context/Zustand/Redux/etc.) based on complexity
   - Storage (AsyncStorage / MMKV / SQLite / SecureStore)
   - Any platform-specific modules you will need
7) Create a “Swift → RN mapping” section:
   - Navigation mapping (Coordinator/NavigationStack → RN navigator)
   - State mapping (@State/@Observable/etc. → hooks/store)
   - Component mapping (List/Form/Alert/WebView/etc.)
8) Add a “Risk Areas & Mitigations” section (high/medium/low).

Output:
- Create/overwrite `SPEC.md` with the full plan above.
- Include a table of “Screens to Convert” with: name, purpose, key UI states, dependencies.

Acceptance criteria:
- `SPEC.md` is concrete enough that someone could implement from it without guessing.
- Every screen has at least: entry points, back behavior, and a screenshot plan (what states to capture).
```

---

## Prompt 02 — Create `IMPLEMENTATION_PLAN.md` (Session-Sized Tasks)

```text
Goal: create an implementation plan that can be executed in small, sequential sessions.

Tasks:
1) Create/overwrite `IMPLEMENTATION_PLAN.md` that breaks the migration into phases, each with checkboxes.
2) Include a deterministic screenshot capture protocol and where artifacts live.
3) Make tasks “small enough to finish in one focused session” (ideally 30–90 minutes each).

Include these phases (adapt naming as needed):
Phase 0: Baseline + Migration Matrix + screenshots
Phase 1: RN project setup (folder, dependencies, Jest)
Phase 2: Core models + services (TDD)
Phase 3: Navigation + global state
Phase 4: Screen-by-screen implementation (with screenshot verification loop)
Phase 5: Visual parity polish pass
Phase 6: Automation (Maestro) + CI integration
Phase 7: Production hardening checklist

Acceptance criteria:
- Every phase has explicit “done” conditions (tests pass, screenshots captured, matrix updated).
- There is an explicit loop for each screen: implement → screenshot → compare → record.
```

---

## Prompt 03 — Create `MIGRATION_MATRIX.md` + Screenshot Folder Layout

```text
Goal: create a single source of truth for migration progress and parity comparisons.

Tasks:
1) Create `{{RN_APP_DIR}}/MIGRATION_MATRIX.md` with these sections:
   A) Screen Migration Tracker (Swift file ↔ RN file ↔ tests ↔ screenshots ↔ status)
   B) Component Migration Tracker
   C) Service Migration Tracker (and which tests were migrated)
   D) Test Migration Tracker (original ↔ new)
   E) Screenshot Comparison Log (old iOS vs RN iOS vs RN Android)
   F) Feature Behavior Verification table (pull-to-refresh, persistence-after-restart, error handling, etc.)
   G) Notes & Issues (by phase)

2) Create screenshot directories:
   - `screenshots/swiftui/` (or `screenshots/ios-old/` if UIKit)
   - `screenshots/react-native-ios/`
   - `screenshots/react-native-android/`

3) Add a strict screenshot protocol section (copy into matrix):
   - Always capture old+new on identical simulator device/runtime (ideally keep two simulators booted side-by-side)
   - Normalize the status bar (time/network/battery) for both devices
   - Keep PNG size ≤ 400 KB; if larger, downscale both sets from that batch

Suggested iOS commands (adjust device names/UDIDs):
- `xcrun simctl status_bar <UDID> override --time "09:41" --dataNetwork wifi --wifiBars 3 --cellularBars 4 --batteryState charged --batteryLevel 100`
- `xcrun simctl io <UDID> screenshot <path>`
- Downscale: `sips -Z 2000 screenshots/**/**/*.png`

Acceptance criteria:
- Matrix is comprehensive and starts with all checkboxes unchecked.
- Screenshot directory layout matches the matrix log.
```

---

## Prompt 04 — Baseline: Deterministic Old-App Screenshots (and Optional Maestro)

```text
Goal: capture baseline screenshots for every screen and critical UI state in the existing iOS app.

Tasks:
1) From `SPEC.md`, list every screenshot you will capture (including loading/error/empty/modal states).
2) Capture and store them in `screenshots/swiftui/` (or `screenshots/ios-old/`).
3) Record each captured screenshot in `{{RN_APP_DIR}}/MIGRATION_MATRIX.md`.

Optional (strongly recommended): automate with Maestro:
4) Add accessibility identifiers in the iOS app for any element you need to tap/type/verify:
   - SwiftUI: `.accessibilityIdentifier("...")`
   - UIKit: `view.accessibilityIdentifier = "..."`
5) Add a Maestro flow like `{{IOS_APP_ROOT}}/maestro/verify-screens.yaml` that:
   - `launchApp(clearState: true)`
   - navigates through all screens deterministically
   - captures screenshots for all required states

Acceptance criteria:
- You have baseline screenshots for *all* screens and key states.
- The migration matrix reflects baseline capture status.
```

---

## Prompt 05 — Create the React Native App Skeleton (Expo + TypeScript)

```text
Goal: bootstrap the RN project in-repo and prepare for TDD + automation.

Tasks:
1) Create `{{RN_APP_DIR}}/` and initialize a TypeScript RN project (Expo recommended).
2) Install and configure:
   - React Navigation (prefer `@react-navigation/native-stack` for iOS large titles)
   - Storage (AsyncStorage or your chosen alternative)
   - WebView if needed (`react-native-webview`)
   - Test stack: Jest + React Native Testing Library
3) Create a clean folder structure:
   - `src/models`, `src/services`, `src/screens`, `src/components`, `src/navigation`, `src/hooks`, `src/context`, `src/__tests__`
4) Add a minimal `App.tsx` wiring: providers + root navigator placeholder.
5) Create `{{RN_APP_DIR}}/README.md` (or `claude.md`) with:
   - prerequisites (Node/Xcode/Android SDK/Java for Maestro)
   - run commands (iOS/Android)
   - test commands
   - Maestro commands + screenshot export commands
6) Prepare for Maestro:
   - Add `.maestro/config.yaml` with `testOutputDir: .maestro-output` and animations disabled.
   - Add a script to export screenshots from `.maestro-output/` into `../screenshots/react-native-ios` etc.
7) Ensure iOS/Android bundle IDs are set (needed for stable Maestro `appId`).

Key pitfall to avoid:
- Do NOT pick JS libraries that rely on Node built-ins (http/https/fs). Validate compatibility early.

Acceptance criteria:
- The RN app builds and runs on iOS simulator.
- `npm test` runs and finds tests (even if none yet).
- Folder structure and configs exist and are committed.
```

---

## Prompt 06 — Types + Service Layer via TDD (Port Existing Swift Tests First)

```text
Goal: migrate non-UI logic with tests first (red → green).

Tasks:
1) Create TypeScript model types mirroring Swift models:
   - Use serializable shapes; store/transport dates as strings.
2) Identify existing Swift unit tests (or create equivalents if missing).
3) Port those tests into Jest first so they fail (red).
4) Implement services until tests pass (green).

Required service work:
- Settings/persistence layer:
  - Migrate UserDefaults/CoreData behavior into AsyncStorage/MMKV/SQLite as appropriate.
  - Keep storage format stable and versionable (plan migration if needed).
- Networking layer:
  - Implement fetch calls with timeout + error mapping.
  - Add minimal retry/backoff if appropriate.
  - If parsing RSS/XML/etc., use RN-compatible parsers (avoid Node-only parsers).

Acceptance criteria:
- Jest tests pass for the migrated services.
- Migration matrix service tracker is updated (tests migrated + passing).
```

---

## Prompt 07 — Navigation + Global State (Match iOS Back Behavior Exactly)

```text
Goal: match the old app’s navigation behavior (including back-stack semantics and modals).

Tasks:
1) Implement the root navigator using React Navigation:
   - Prefer native-stack for iOS large title parity.
2) Implement route typing and keep params serializable.
3) Implement initial routing logic:
   - On cold start, load persisted state and route to the correct initial screen.
4) Implement global state (Context/Zustand/Redux) ONLY for state that’s truly global.
5) Verify “back behavior” parity:
   - If old app “pops” back to Setup, don’t “navigate to Setup” (use `goBack` / reset stack appropriately).

Acceptance criteria:
- Navigation flows in RN match old app flows, including modals and back actions.
- Matrix navigation/parity notes updated.
```

---

## Prompt 08 — Screen-by-Screen Migration Loop (Implement → Screenshot → Compare → Record)

```text
Goal: migrate screens one at a time with strict parity validation.

For each screen (in the order defined in `IMPLEMENTATION_PLAN.md`):
1) Review baseline screenshots and list the required UI states (default/selected/loading/error/empty/modal).
2) Implement the RN screen and any needed shared components.
3) Add stable `testID` / accessibility labels to elements used in automation.
4) Capture RN screenshots for the same states (iOS first, then Android).
5) Compare old vs new:
   - Record differences and decide: fix now vs defer (but record).
6) Update `{{RN_APP_DIR}}/MIGRATION_MATRIX.md` checkboxes and notes.

Visual parity “common fixes” to watch for:
- Large iOS titles (native-stack options)
- Inset-grouped list look (background, rounded corners, separators, safe area insets)
- Header button placement (left vs right) and icon styles
- Color defaults (SwiftUI SF Symbols often appear black; don’t assume blue accent)
- Top inset issues under large titles (avoid content overlap; use header height padding if needed)

Acceptance criteria:
- Each completed screen has: passing tests (if relevant), iOS screenshots, and matrix updates.
```

---

## Prompt 09 — Maestro Automation for RN (Deterministic Screenshot Flow)

```text
Goal: create a stable Maestro flow that can re-capture all RN screenshots deterministically.

Tasks:
1) Prefer a standalone dev build (Expo dev-client) over Expo Go for Maestro stability.
   - If using a dev-client, your Maestro flow may need an explicit deep link to connect the running build to Metro (pass it as an env var, e.g. `DEV_CLIENT_URL`).
2) Create `{{RN_APP_DIR}}/maestro/verify-screens.yaml` that:
   - launches app with `clearState: true`
   - navigates through all screens (and key states)
   - takes screenshots into `.maestro-output/screenshots/`
3) Add an export script to copy screenshots into `../screenshots/react-native-ios/` and `../screenshots/react-native-android/`.
4) Add missing `testID`s / accessibility labels to RN components to reduce flakiness.

Known flake reducers:
- Disable animations in `.maestro/config.yaml`
- Avoid swipe-back gestures in flows; relaunch if needed
- Prefer tapping elements by `id:` over visible text
- Use `--flatten-debug-output` so output paths are predictable (helpful for CI and easy exports)
- If dev overlays block automation (dev menu/onboarding sheets), suppress them in dev builds (platform-specific)

Acceptance criteria:
- `maestro test ...` runs end-to-end and produces all required screenshots.
- Export script copies them to the repo-level screenshot folders.
```

---

## Prompt 10 — Production Hardening Backlog (`PRODUCTION_IMPROVEMENTS.md`)

```text
Goal: create a prioritized production-readiness plan and fix the most critical gaps.

Tasks:
1) Create `{{RN_APP_DIR}}/PRODUCTION_IMPROVEMENTS.md` with:
   - Styling/theming architecture (avoid hard-coded colors; support dark mode if required)
   - Networking hardening (timeouts, retries, better error mapping)
   - Caching/offline strategy (if needed)
   - Accessibility plan (labels, roles, contrast checks, VoiceOver/TalkBack notes)
   - Testing plan (component tests, hooks, navigation flows, integration tests)
   - Config/env strategy (`.env`, build-time config)
   - Logging/analytics/crash reporting plan
2) Implement the “Critical” items immediately if in scope (especially fetch timeouts + accessibility basics).

Acceptance criteria:
- The doc is actionable, prioritized (Critical/High/Medium/Low), and references concrete files/locations.
```

---

## Prompt 11 — Final Parity Audit + Release Checklist

```text
Goal: ensure the RN app is ready to replace the iOS app (or be shipped as v2).

Tasks:
1) Run a full parity audit:
   - Compare screenshots old vs RN iOS vs RN Android
   - Verify behavior checklist in the migration matrix (persistence after restart, offline error, etc.)
2) Make a final pass to remove “debug blockers”:
   - Ensure dev menus/onboarding overlays don’t block automated flows (especially for iOS screenshots).
3) (Optional) Integrate CI:
   - Run Jest in CI
   - Run Maestro (or at least ensure scripts are CI-friendly)
4) Produce a “Release Checklist” section with:
   - build/signing steps
   - required env vars
   - smoke test steps

Acceptance criteria:
- Migration matrix shows all required items complete (or explicitly deferred with rationale).
- You can deterministically re-run screenshots and tests on demand.
```
