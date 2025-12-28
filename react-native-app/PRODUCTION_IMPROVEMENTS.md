# React Native RSS Reader - Production Improvements

This document outlines improvements needed to make this React Native application production-ready.

---

## Priority Legend
- **Critical** - Must fix before release
- **High** - Should fix for production quality
- **Medium** - Recommended improvements
- **Low** - Nice to have

---

## 1. Styling Architecture

### Issue: Hardcoded Colors Throughout Codebase
**Priority: Medium**

Magic color values are scattered across 8+ files:
- `#f2f2f7` (iOS grouped background) - repeated in 5 files
- `#c6c6c8` (separator) - repeated in 4 files
- `#007AFF` (accent blue) - repeated in 2 files

**Files affected:**
- `src/screens/FeedScreen.tsx:144`
- `src/screens/SetupScreen.tsx:114`
- `src/screens/AboutScreen.tsx:95`
- `src/screens/LibrariesScreen.tsx:46`
- `src/components/ItemRow.tsx:40`
- `src/components/SourceRow.tsx:72`
- `src/components/AddSourceModal.tsx:138`
- `src/components/FormField.tsx:89`

**Recommendation:** Create a centralized theme file:

```typescript
// src/theme.ts
export const colors = {
  background: '#f2f2f7',
  backgroundSecondary: '#ffffff',
  separator: '#c6c6c8',
  accent: '#007AFF',
  text: '#000000',
  textSecondary: '#8e8e93',
  error: '#ff3b30',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

### Issue: No Dark Mode Support
**Priority: Low**

The app only supports light mode. For production, consider implementing theme switching using React Native's `useColorScheme` hook or a context-based theme provider.

---

## 2. State Management

### Issue: Limited Error Handling in Context
**Priority: Medium**

Settings load errors are only logged, not surfaced to the UI.

**File:** `src/context/AppContext.tsx:24`
```typescript
} catch (error) {
  console.error('Failed to load saved source:', error);
}
```

**Recommendation:** Add error state to context and display appropriate UI feedback.

### Issue: Tight Coupling of Settings Service
**Priority: Low**

Context directly imports `getSettings`/`setSettings`, making it harder to swap implementations or test.

**Recommendation:** Use dependency injection pattern:
```typescript
interface ISettingsService {
  getSettings(): Promise<RssSource | null>;
  setSettings(source: RssSource | null): Promise<void>;
}
```

---

## 3. API/Data Layer

### Issue: No Fetch Timeout
**Priority: Critical**

Network requests can hang indefinitely with no timeout configured.

**File:** `src/services/feed.ts`

**Recommendation:**
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 15000);

try {
  const response = await fetch(source.rss, { signal: controller.signal });
  // ...
} finally {
  clearTimeout(timeoutId);
}
```

### Issue: No Retry Logic
**Priority: High**

Single attempt only; transient network failures aren't retried.

**Recommendation:** Implement exponential backoff:
```typescript
async function fetchWithRetry(url: string, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
    }
  }
}
```

### Issue: Basic HTML Stripping
**Priority: Medium**

The regex `/<[^>]+>/g` doesn't handle:
- HTML entities (`&nbsp;`, `&quot;`, etc.)
- Malformed HTML
- Whitespace normalization

**File:** `src/services/feed.ts:15-18`

**Recommendation:** Use a proper HTML entity decoder:
```typescript
import { decode } from 'html-entities';
const text = decode(html.replace(/<[^>]+>/g, '').trim());
```

### Issue: No Data Caching
**Priority: Medium**

Every screen load triggers a new fetch. Consider implementing:
- In-memory cache with TTL
- Conditional requests using `If-Modified-Since`
- Offline support with AsyncStorage caching

---

## 4. Navigation

### Issue: Magic Timeout for Navigation
**Priority: Medium**

**File:** `src/navigation/RootNavigator.tsx:33`
```typescript
setTimeout(() => {
  navigationRef.current?.navigate('Feed', { source: selectedSource });
}, 0);
```

**Recommendation:** Use navigation event listener instead:
```typescript
const unsubscribe = navigationRef.current?.addListener('state', () => {
  if (selectedSource) {
    navigationRef.current?.navigate('Feed', { source: selectedSource });
  }
});
```

### Issue: No Deep Link Configuration
**Priority: Medium**

No `linking.config.ts` for production deep linking support.

---

## 5. Component Architecture

### Issue: No Component Memoization
**Priority: High**

List item components are not memoized, causing unnecessary re-renders.

**Files:**
- `src/components/ItemRow.tsx`
- `src/components/SourceRow.tsx`

**Recommendation:**
```typescript
export const ItemRow = React.memo(function ItemRow({
  item,
  onPress,
  isFirst,
  isLast
}: ItemRowProps) {
  return (/* ... */);
}, (prevProps, nextProps) => {
  return prevProps.item.link === nextProps.item.link &&
         prevProps.onPress === nextProps.onPress &&
         prevProps.isFirst === nextProps.isFirst &&
         prevProps.isLast === nextProps.isLast;
});
```

### Issue: Long Inline JSX in Headers
**Priority: Low**

**File:** `src/screens/SetupScreen.tsx:52-76`

Header button logic is ~25 lines inline. Consider extracting to a separate component.

---

## 6. Testing

### Issue: Very Limited Test Coverage
**Priority: Critical**

Only 2 test files exist, covering ~5-10% of the codebase:
- `src/__tests__/feed.test.ts`
- `src/__tests__/settings.test.ts`

**Missing tests:**
- Component tests (ItemRow, SourceRow, FormField, etc.)
- Hook tests (`useLoadableState`)
- Context tests
- Navigation flow tests
- Integration tests

**Recommendation:** Aim for minimum 50% coverage before release. Add:

```typescript
// Example component test
describe('SourceRow', () => {
  it('renders checkmark when selected', () => {
    const { getByText } = render(
      <SourceRow source={mockSource} isSelected={true} onPress={jest.fn()} />
    );
    expect(getByText('✓')).toBeVisible();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <SourceRow source={mockSource} isSelected={false} onPress={onPress} />
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Issue: No E2E Test Integration
**Priority: Medium**

Maestro flows exist but aren't integrated into CI/CD.

---

## 7. Accessibility

### Issue: Limited Accessibility Implementation
**Priority: Critical**

Only ~10 accessibility attributes across the entire codebase.

**Missing:**
- List semantics (`accessibilityRole="list"`, `accessibilityRole="listitem"`)
- Image alt text
- Labels on all interactive elements
- Screen reader testing documentation

**Files needing accessibility improvements:**
- `src/components/ItemRow.tsx` - no accessibility labels
- `src/screens/DetailScreen.tsx` - WebView has no context
- `src/screens/AboutScreen.tsx` - image missing alt text
- `src/components/SourceRow.tsx` - icon missing alt text

**Recommendations:**

1. Add semantic roles to lists:
```typescript
<FlatList
  accessible={true}
  accessibilityRole="list"
  accessibilityLabel="RSS Sources"
  // ...
/>
```

2. Add labels to interactive items:
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={`Open article: ${item.title}`}
  accessibilityHint="Opens the full article in a web view"
  onPress={onPress}
>
```

3. Add alt text to images:
```typescript
<Image
  source={{ uri: source.icon }}
  accessibilityLabel={`${source.title} logo`}
/>
```

### Issue: Color Contrast Not Verified
**Priority: Medium**

Text on background colors not checked for WCAG compliance. Gray placeholder text on white may have insufficient contrast.

---

## 8. Configuration & Environment

### Issue: No Environment Configuration
**Priority: High**

No `.env` handling or environment-specific configuration.

**Recommendation:** Add `react-native-dotenv`:

```bash
npm install react-native-dotenv
```

Create `.env`:
```
API_TIMEOUT=15000
ENABLE_DEV_MENU=false
```

Create `src/config.ts`:
```typescript
export const config = {
  apiTimeout: Number(process.env.API_TIMEOUT) || 15000,
  enableDevMenu: process.env.ENABLE_DEV_MENU === 'true',
};
```

### Issue: No Centralized Logging
**Priority: Medium**

Only `console.error()` used in three places. Consider a logging abstraction:

```typescript
// src/utils/logger.ts
export const logger = {
  error: (message: string, error?: unknown) => {
    if (__DEV__) {
      console.error(message, error);
    }
    // In production: send to Sentry, Crashlytics, etc.
  },
  warn: (message: string) => { /* ... */ },
  info: (message: string) => { /* ... */ },
};
```

---

## 9. Code Organization

### Issue: Magic Strings
**Priority: Low**

AsyncStorage keys and route names are hardcoded strings.

**Recommendation:** Create constants file:

```typescript
// src/constants.ts
export const STORAGE_KEYS = {
  RSS_SOURCE: 'source',
} as const;

export const ROUTES = {
  SETUP: 'Setup',
  FEED: 'Feed',
  DETAIL: 'Detail',
  ABOUT: 'About',
  LIBRARIES: 'Libraries',
} as const;
```

---

## 10. Performance

### Issue: No Image Optimization
**Priority: Medium**

Icons in SourceRow loaded directly without:
- Caching
- Placeholders
- Size optimization

**Recommendation:** Use `expo-image` or `react-native-fast-image` with caching.

### Issue: No Network Optimization
**Priority: Low**

- No `If-Modified-Since` headers for conditional fetching
- No compression negotiation

---

## Production Readiness Checklist

### Critical (Must Fix)
- [ ] Add timeout to fetch calls (15-30s)
- [ ] Add accessibility labels to all interactive elements
- [ ] Add component tests (minimum 50% coverage)
- [ ] Add environment configuration
- [ ] Test with screen readers (VoiceOver, TalkBack)

### High Priority (Should Fix)
- [ ] Add React.memo() to list item components
- [ ] Create centralized theme/constants file
- [ ] Add retry logic with exponential backoff
- [ ] Implement proper HTML entity decoding

### Medium Priority (Recommended)
- [ ] Add image caching
- [ ] Add deep linking configuration
- [ ] Implement offline data caching
- [ ] Add centralized logging
- [ ] Verify color contrast for accessibility

### Low Priority (Nice to Have)
- [ ] Dark mode support
- [ ] Feature flags for A/B testing
- [ ] Performance monitoring integration
- [ ] Analytics integration

---

## Summary

This React Native RSS Reader has a **solid foundation** with good separation of concerns, proper TypeScript usage, and clean component architecture. The main gaps are:

1. **Accessibility** - Needs significant work for screen reader users
2. **Testing** - Only ~5-10% coverage; needs component and integration tests
3. **Production Hardening** - Missing timeouts, retries, and proper error handling
4. **Theming** - Hardcoded colors throughout; no dark mode support

With these improvements addressed, the app would be ready for a production release.
