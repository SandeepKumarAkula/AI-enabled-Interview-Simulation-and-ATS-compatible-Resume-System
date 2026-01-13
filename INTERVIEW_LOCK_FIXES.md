# Interview Lock & Navigation Prevention Fixes

## Problem Identified
Users were able to:
1. Navigate to other tabs using the header links during interview
2. Keep camera enabled even after switching to other tabs
3. Access the page behind the interview room

## Solutions Implemented

### 1. **Header Hidden During Interview**
- Header is automatically hidden when `interviewStarted` becomes true
- Header is restored when interview ends or report is displayed
- Uses direct DOM manipulation to set `display: none`

```tsx
const header = document.querySelector("header")
if (header) {
  (header as HTMLElement).style.display = "none"
}
```

### 2. **Body Scroll Lock**
- Body and document element overflow set to `hidden` during interview
- Prevents any scrolling outside the interview room
- Automatically restored when interview completes

```tsx
document.body.style.overflow = "hidden"
document.documentElement.style.overflow = "hidden"
```

### 3. **Enhanced Navigation Prevention**
Added comprehensive navigation blocking:
- **Before Unload**: Prevents browser close/tab close with warning dialog
- **Pop State**: Blocks back button attempts
- **Keyboard Shortcuts**: Blocks `Ctrl+W`, `Ctrl+Q`, `Cmd+W`, `Cmd+Q`
- **Tab Focus**: Prevents Shift+Tab for backward navigation

```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === "w" || e.key === "q")) {
    e.preventDefault()
    addToast("🔒 Cannot close during interview.", "error")
  }
}
```

### 4. **Tab/Window Focus Detection** (NEW)
Monitors when user switches tabs or minimizes window:
- **Visibility Change**: Detects when user switches to another tab
  - Stops microphone recording (`stopListening()`)
  - Shows warning toast with message about switching tabs
  - Logs console warning
  
- **Blur Event**: Detects when window loses focus
  - Also stops microphone recording
  - Provides pause functionality

```tsx
const handleVisibilityChange = () => {
  if (document.hidden) {
    console.warn("⚠️ Interview tab lost focus")
    addToast("⚠️ Interview paused - you switched tabs. Return to continue.", "warning")
    if (isListening) stopListening()
  }
}

const handleBlur = () => {
  console.warn("⚠️ Window lost focus")
  if (isListening) stopListening()
}
```

### 5. **Automatic Cleanup on Interview End**
When interview ends (report shown or completed):
- Header display restored to default
- Body overflow scrolling re-enabled
- All event listeners removed
- Navigation lock disabled

## Effects Added/Modified

### Effect 1: Navigation & UI Lock (Lines 373-443)
**Triggers**: `interviewStarted`, `report`, `addToast`
- Hides header
- Locks body scroll
- Adds multiple event listeners
- Cleans up on interview end

### Effect 2: Tab/Focus Detection (Lines 445-469)
**Triggers**: `interviewStarted`, `report`, `isListening`, `addToast`
- Monitors tab switching
- Monitors window focus
- Stops recording on focus loss
- Auto-cleanup on interview end

## User Experience Flow

### During Interview
1. Header is completely hidden
2. No scrolling possible
3. Cannot access other navigation
4. Cannot close tab/window (warning dialog)
5. Cannot use back button (error toast)
6. Cannot use keyboard shortcuts to close (error toast)
7. If switches tabs → warning and recording stops
8. If window loses focus → recording stops

### After Interview Completes
1. Header becomes visible again
2. Page scrolling enabled
3. Normal navigation possible
4. Can close tab/window freely
5. Can use browser shortcuts

## Technical Details

### Event Listeners
- `beforeunload`: Page close prevention
- `popstate`: Back button blocking
- `keydown`: Keyboard shortcut blocking
- `visibilitychange`: Tab switch detection
- `blur`: Window focus loss detection
- `fullscreenchange` & `webkitfullscreenchange`: Fullscreen monitoring

### DOM Manipulation
- `document.body.style.overflow`
- `document.documentElement.style.overflow`
- `document.querySelector("header")`

### Condition Guards
All navigation prevention is disabled when:
- `!interviewStarted` (interview not started)
- `report !== null` (interview already completed)

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with webkit prefixes)
- Mobile browsers: Partial support (Ctrl+W not available on mobile)

## Important Notes

1. **Header Element**: Assumes header is a `<header>` HTML element or similar selector
2. **Focus Detection**: Relies on `document.hidden` API and `blur` event
3. **Fullscreen Lock**: Works in conjunction with Fullscreen API lock (10-second exit timer)
4. **Recording Stop**: Automatically stops microphone if recording during focus loss

## Testing Checklist

- [ ] Header hidden on interview start
- [ ] Header visible after interview ends
- [ ] Cannot scroll during interview
- [ ] Warning appears on tab close attempt
- [ ] Error toast on back button
- [ ] Error toast on Ctrl+W/Ctrl+Q
- [ ] Warning and recording stop on tab switch
- [ ] Recording stops when window blurs
- [ ] Navigation enabled after interview
- [ ] Works with fullscreen mode
- [ ] Works in fullscreen exit timer scenario

## Future Enhancements

1. Add toast notification when focusing back into the tab
2. Add interview pause/resume functionality
3. Add visual indicator showing interview is paused
4. Track tab switches in analytics/audit log
5. Add option to allow window minimization

