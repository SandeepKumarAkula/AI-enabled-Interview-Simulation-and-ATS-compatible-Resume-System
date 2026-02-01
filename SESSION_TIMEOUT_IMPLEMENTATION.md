# Session Timeout Implementation - Complete Guide

## 🎯 Overview

Implemented automatic session timeout with user-friendly warning system:
- **Session Duration**: 1 hour from login
- **Warning Time**: 5 minutes before expiry
- **User Actions**: Continue (extend) or End session
- **Auto-logout**: If no action taken when timer reaches 0

## 🔧 Implementation Details

### 1. **JWT Token Configuration** ([app/api/auth/login/route.ts](app/api/auth/login/route.ts))

Changed token expiry from 30 days to 1 hour:

```typescript
const issuedAt = Math.floor(Date.now() / 1000)
const token = jwt.sign(
  { sub: user.id, role: user.role, iat: issuedAt }, 
  JWT_SECRET, 
  { expiresIn: '1h' } // 1 hour session
)

// Cookie also set to 1 hour
res.cookies.set('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60, // 1 hour in seconds
  sameSite: 'lax'
})

// Return session expiry to client
return NextResponse.json({ 
  token, 
  user: { ... },
  sessionExpiry: issuedAt + 3600 // Unix timestamp
})
```

### 2. **Session Extension API** ([app/api/auth/extend-session/route.ts](app/api/auth/extend-session/route.ts))

New endpoint to extend session by 1 hour:

```typescript
POST /api/auth/extend-session

Response:
{
  "success": true,
  "sessionExpiry": 1738483200 // New expiry timestamp
}
```

**Security**:
- Validates current token before extending
- Issues new JWT with fresh 1-hour expiry
- Updates HttpOnly cookie automatically

### 3. **Session Timeout Monitor** ([components/session-timeout-monitor.tsx](components/session-timeout-monitor.tsx))

Client-side component that:
- Monitors session expiry time (stored in localStorage)
- Shows warning popup 5 minutes before expiry
- Displays countdown timer
- Handles user actions (extend or logout)

**Features**:
- ✅ Countdown timer in MM:SS format
- ✅ Beautiful modal with warning icon
- ✅ Two clear action buttons
- ✅ Auto-logout when timer reaches 0
- ✅ Listens to auth-changed events
- ✅ Persists across page refreshes

**Popup UI**:
```
┌─────────────────────────────────┐
│        ⚠️                       │
│   Session Expiring Soon         │
│                                 │
│   Your session will expire in   │
│         4:32                    │
│   Would you like to continue?   │
│                                 │
│  [End Session] [Continue]       │
│                                 │
│  Clicking "Continue" extends    │
│  your session for another hour  │
└─────────────────────────────────┘
```

### 4. **Login Integration** ([app/auth/login/login-client.tsx](app/auth/login/login-client.tsx))

Stores session expiry after successful login:

```typescript
if (data.sessionExpiry) {
  window.localStorage.setItem('sessionExpiry', String(data.sessionExpiry))
}
```

### 5. **Layout Integration** ([app/layout.tsx](app/layout.tsx))

Added monitor to root layout for global coverage:

```tsx
<SessionTimeoutMonitor />
```

## 📊 User Flow

```
User logs in
    ↓
JWT issued with 1-hour expiry
    ↓
Session expiry stored in localStorage
    ↓
Monitor schedules warning timer (55 minutes)
    ↓
--- 55 minutes pass ---
    ↓
Warning popup appears (5 minutes remaining)
    ↓
Countdown starts: 5:00 → 4:59 → 4:58...
    ↓
User has 3 options:

1️⃣ Click "Continue Session"
   → Calls /api/auth/extend-session
   → New JWT issued with +1 hour
   → Warning dismissed
   → New timer scheduled
   → User continues working

2️⃣ Click "End Session"
   → Calls /api/auth/logout
   → Clears all storage
   → Redirects to login

3️⃣ Do nothing (ignore warning)
   → Timer counts down: 4:59... 3:00... 1:00... 0:00
   → Auto-logout triggered
   → Redirects to login with reason=session-ended
```

## ⚙️ Technical Specifications

### Session Timing
- **Total Duration**: 3600 seconds (1 hour)
- **Warning Trigger**: 3300 seconds after login (55 minutes)
- **Warning Duration**: 300 seconds (5 minutes)
- **Countdown Interval**: 1 second updates

### Storage
- **Key**: `sessionExpiry`
- **Value**: Unix timestamp (seconds)
- **Location**: `localStorage`
- **Cleared on**: Logout, session end

### Timers
- **Warning Timer**: `setTimeout` to show popup
- **Countdown Timer**: `setInterval` for second-by-second updates
- **Cleanup**: All timers cleared on unmount or logout

### API Endpoints

**Extend Session**:
```bash
curl -X POST https://your-app.com/api/auth/extend-session \
  -H "Cookie: token=YOUR_JWT" \
  --cookie-jar - --cookie -
```

**Login** (returns sessionExpiry):
```bash
curl -X POST https://your-app.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

Response:
```json
{
  "token": "eyJhbGc...",
  "user": { "id": "...", "email": "...", "name": "...", "role": "..." },
  "sessionExpiry": 1738483200
}
```

## 🧪 Testing

### Test Case 1: Normal Flow
1. Login to your account
2. Wait 55 minutes (or modify code for testing: change `5 * 60` to `10` for 10-second warning)
3. See warning popup appear
4. Click "Continue Session"
5. ✅ **Expected**: Popup closes, session extended by 1 hour

### Test Case 2: Auto Logout
1. Login to your account
2. Trigger warning (modify timing for faster testing)
3. Don't click anything
4. Wait for countdown to reach 0:00
5. ✅ **Expected**: Auto-logout, redirected to login

### Test Case 3: Manual End
1. Login to your account
2. Trigger warning popup
3. Click "End Session"
4. ✅ **Expected**: Immediate logout, redirected to login

### Test Case 4: Multiple Extensions
1. Login
2. Wait for warning (1st time)
3. Click "Continue Session"
4. Wait another 55 minutes for warning (2nd time)
5. Click "Continue Session" again
6. ✅ **Expected**: Can extend indefinitely as long as user interacts

### Test Case 5: Page Refresh
1. Login
2. Navigate around the app
3. Refresh the page (F5)
4. Wait for warning time
5. ✅ **Expected**: Warning still appears (persisted in localStorage)

### Quick Testing (Development)

Modify timing for faster testing in [components/session-timeout-monitor.tsx](components/session-timeout-monitor.tsx):

```typescript
// Change from 5 minutes to 10 seconds
const timeUntilWarning = timeUntilExpiry - 10 // Testing: 10 seconds before expiry
setTimeRemaining(10) // Testing: 10 second countdown
```

And in [app/api/auth/login/route.ts](app/api/auth/login/route.ts):

```typescript
// Change from 1 hour to 1 minute for testing
{ expiresIn: '1m' } // Testing: 1 minute session
sessionExpiry: issuedAt + 60 // Testing: 1 minute
```

**Remember to revert these changes after testing!**

## 🔐 Security Considerations

### ✅ Secure Implementation
- JWT stored in HttpOnly cookie (not accessible via JavaScript)
- Session expiry validated server-side on every request
- No sensitive data in localStorage (only expiry timestamp)
- Token refresh requires valid current token

### ⚠️ Attack Scenarios Handled
1. **Token Theft**: HttpOnly cookie prevents XSS access
2. **Session Hijacking**: 1-hour expiry limits damage window
3. **CSRF**: SameSite=lax cookie attribute
4. **Replay Attacks**: Each extension issues new token with new signature

### 🛡️ Best Practices
- ✅ Server validates token before extending
- ✅ Client-side timer is UI-only (not security boundary)
- ✅ Actual expiry enforced by JWT expiration
- ✅ Middleware blocks expired tokens

## 📱 User Experience

### Visual Design
- Modal overlay with semi-transparent backdrop
- Yellow warning icon (⚠️) for attention
- Large, readable countdown timer
- Two clear action buttons with color coding:
  - Gray/white: "End Session" (secondary)
  - Green gradient: "Continue Session" (primary)
- Informative footer text explaining extension

### Accessibility
- Modal is keyboard accessible
- Clear visual hierarchy
- High contrast text
- Descriptive button labels
- Auto-focus on modal appearance

### Mobile Responsive
- Centered modal works on all screen sizes
- Buttons stack vertically on small screens
- Touch-friendly button sizes

## 🐛 Troubleshooting

### Issue: Warning never appears

**Cause**: sessionExpiry not stored in localStorage
**Solution**: 
- Check browser console for errors
- Verify login returns `sessionExpiry` in response
- Check if localStorage is available (not in private browsing)

### Issue: Warning appears immediately after login

**Cause**: Session expiry time is in the past or too soon
**Solution**:
- Verify server and client clocks are synchronized
- Check JWT_SECRET is consistent across servers
- Ensure `expiresIn: '1h'` in login route

### Issue: Continue button doesn't work

**Cause**: Extend session API failing
**Solution**:
- Check browser console for network errors
- Verify `/api/auth/extend-session` endpoint exists
- Check JWT_SECRET environment variable
- Verify cookie is being sent with request

### Issue: Countdown jumps or freezes

**Cause**: Tab was backgrounded (browser throttles timers)
**Solution**: This is expected browser behavior. When tab becomes active again, visibility change listener revalidates auth immediately.

## 🔄 Future Enhancements

### Optional Features (Not Implemented)

1. **Server-side session tracking**:
   - Store active sessions in Redis
   - Track last activity timestamp
   - Enable multi-device session management

2. **Configurable timeout**:
   - Admin panel to set session duration
   - Different timeouts for different roles
   - User preference for session length

3. **Activity-based extension**:
   - Auto-extend on user activity (clicks, typing)
   - No need for explicit "Continue" click
   - Still show notification of extension

4. **Session analytics**:
   - Track average session duration
   - Log extension frequency
   - Identify optimal timeout values

## 📝 Environment Variables

No new environment variables required. Uses existing:

```env
NEXTAUTH_SECRET=your-secret-key-here
# OR
JWT_SECRET=your-secret-key-here
```

## ✅ Deployment Checklist

- [x] Login API updated with 1-hour expiry
- [x] Extend session API created
- [x] Session monitor component added
- [x] Monitor integrated in layout
- [x] Login stores sessionExpiry in localStorage
- [x] Logout clears sessionExpiry
- [x] Test in development environment
- [x] Test with actual 1-hour wait (or adjusted timing)
- [x] Verify warning appears at 55 minutes
- [x] Verify countdown works
- [x] Verify both buttons work
- [x] Test page refresh persistence
- [ ] Deploy to Vercel
- [ ] Test in production environment

---

**Implementation Date**: February 1, 2026  
**Session Duration**: 1 hour  
**Warning Time**: 5 minutes before expiry  
**Status**: ✅ **COMPLETE**
