# Login Persistence Fix - Debug Report

## Problem Summary
User reported that after login, the session appeared successful but upon page refresh, the user was logged out again.

## Root Cause Analysis

### Primary Issue: Non-existent `/auth/me` Endpoint
The authentication context was calling `authService.getCurrentUser()` during initialization, which attempted to hit the `/api/v1/auth/me` endpoint. This endpoint **does not exist** in the backend API (not documented in bilet-api-detail.md).

**Flow breakdown:**
1. User logs in successfully → token + user stored in localStorage
2. `router.push("/")` navigates to dashboard
3. Page refresh or navigation triggers AuthProvider initialization
4. `initAuth()` calls `getCurrentUser()` → hits non-existent `/auth/me`
5. Backend returns 401/404 error
6. Axios interceptor catches the error and clears localStorage
7. User gets redirected to login page

### Secondary Issues Fixed:
1. **Global state synchronization**: Removed unnecessary global state variables that were causing complexity
2. **React Strict Mode double initialization**: Added `useRef` to prevent double initialization
3. **Import typo**: Fixed `bileleme.types` → `biletleme.types`

## Solution Implemented

### 1. Removed Backend Verification on Init
Changed the authentication initialization strategy from "verify with backend" to "trust the token until it fails":

**Before:**
```typescript
// Load from localStorage
setUser(parsedUser);

// Then verify with backend
const backendUser = await authService.getCurrentUser(); // ❌ Fails!
// If fails, clear everything
```

**After:**
```typescript
// Just load from localStorage and trust the token
const parsedUser = JSON.parse(storedUser);
setUser(parsedUser);
// Token will be validated when actually making API calls
```

### 2. Simplified State Management
- Removed global state variables (`globalUser`, `globalIsLoading`)
- Removed problematic sync useEffect that compared object references
- Added `initRef` to prevent double initialization in React Strict Mode

### 3. Token Validation Strategy
The new approach relies on:
- **Optimistic loading**: Trust localStorage on page load
- **Lazy validation**: Token is validated when making actual API calls
- **Automatic cleanup**: Axios 401 interceptor handles invalid tokens by clearing storage and redirecting to login

## Files Modified

### [`src/contexts/auth-context.tsx`](src/contexts/auth-context.tsx)
- Removed global state sync mechanism
- Simplified `initAuth()` to only read from localStorage
- Added `useRef` for initialization tracking
- Fixed import typo

### [`src/lib/api/services/auth.service.ts`](src/lib/api/services/auth.service.ts)
- Kept `/api/v1/login` endpoint (confirmed working by user)
- `getCurrentUser()` still exists but only used explicitly via `refreshUser()`

## How It Works Now

### Login Flow:
1. User submits credentials
2. `/api/v1/login` returns `{ user, token, token_type }`
3. Token stored in localStorage (`auth_token`)
4. User stored in localStorage (`user`)
5. Navigate to dashboard

### Page Refresh Flow:
1. AuthProvider mounts
2. Read token and user from localStorage
3. If both exist, set user state immediately
4. Set `isLoading = false`
5. Dashboard renders

### Token Expiry Handling:
1. User makes an API request (e.g., fetch events)
2. Axios interceptor adds `Authorization: Bearer {token}` header
3. If token expired, backend returns 401
4. Axios response interceptor catches 401
5. Clears localStorage and redirects to `/login`

## Testing Recommendations

1. **Test login**: Should work and stay logged in after page refresh
2. **Test with expired token**: Should automatically log out on first API call
3. **Test logout**: Should clear all storage and redirect to login
4. **Test with no token**: Should redirect to login immediately

## Backend Considerations

If backend team wants to add user verification on page load, they should:
1. Create `/api/v1/auth/me` endpoint that returns current user
2. Uncomment the verification logic in `initAuth()`
3. Ensure endpoint handles Bearer token auth correctly

## Commit Message
```
fix(auth): resolve login persistence issue by removing backend verification on init

- Removed getCurrentUser() call during initialization
- Trust localStorage token until it fails (lazy validation)
- Simplified state management by removing global state sync
- Added useRef to prevent double initialization in React Strict Mode
- Fixed import typo: bileleme.types → biletleme.types

The /auth/me endpoint doesn't exist in backend, causing 401 errors
that cleared localStorage on every page refresh. Now token is validated
lazily when making actual API calls, with axios interceptor handling
401s by clearing storage and redirecting to login.
```
