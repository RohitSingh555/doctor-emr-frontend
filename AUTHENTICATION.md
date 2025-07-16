# Authentication System

## Overview

This EMR application uses JWT-based authentication with secure token management and automatic validation.

## Key Features

### 1. Token Management
- **Secure Storage**: Tokens are stored in localStorage with proper validation
- **Automatic Expiration**: Tokens are checked for expiration on app load
- **Clean Removal**: Invalid tokens are automatically cleared

### 2. Authentication Flow

#### Login Process
1. User submits credentials
2. Backend validates and returns JWT token
3. Frontend calls `/auth/me` to get user data
4. Token and user data stored in AuthContext
5. User redirected to dashboard

#### App Load Process
1. Check for existing token in localStorage
2. Validate token expiration locally
3. If valid, call `/auth/me` to verify with backend
4. If successful, restore user session
5. If failed, clear token and redirect to login

#### Logout Process
1. Clear token from localStorage
2. Reset AuthContext state
3. Redirect to login page

### 3. Security Features

#### Token Validation
- **Local Validation**: Check token expiration before API calls
- **Server Validation**: Verify token with `/auth/me` endpoint
- **Automatic Cleanup**: Remove invalid tokens immediately

#### Error Handling
- **401 Responses**: Automatically logout and redirect to login
- **Network Errors**: Graceful handling with user feedback
- **Token Expiry**: Seamless re-authentication flow

### 4. Components

#### AuthContext (`/context/AuthContext.tsx`)
- Manages authentication state
- Provides login/logout functions
- Handles token validation
- Stores user information

#### RequireAuth (`/components/RequireAuth.tsx`)
- Protects routes from unauthorized access
- Shows loading state during auth check
- Redirects to login if not authenticated

#### API Interceptors (`/services/api.ts`)
- Automatically attach tokens to requests
- Handle 401 responses globally
- Manage token cleanup

### 5. Utilities (`/utils/auth.ts`)
- `getToken()`: Safely retrieve token
- `setToken()`: Store token securely
- `removeToken()`: Clear token
- `validateToken()`: Check token validity
- `isTokenExpired()`: Check expiration

## Usage

### Protected Routes
```tsx
import RequireAuth from '../components/RequireAuth';

export default function ProtectedPage() {
  return (
    <RequireAuth>
      <YourComponent />
    </RequireAuth>
  );
}
```

### Using Auth Context
```tsx
import { useAuth } from '../context/AuthContext';

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### API Calls
```tsx
import { authAPI } from '../services/api';

// Login
const response = await authAPI.login(email, password);
const userData = await authAPI.getCurrentUser();
login(response.token, userData);

// Logout
authAPI.logout();
```

## Security Best Practices

1. **Token Validation**: Always validate tokens on app load
2. **Automatic Cleanup**: Remove invalid tokens immediately
3. **Error Handling**: Handle 401 responses globally
4. **User Feedback**: Show appropriate loading and error states
5. **Secure Storage**: Use localStorage with proper validation

## Troubleshooting

### Common Issues

1. **Login not persisting**
   - Check if token is being stored correctly
   - Verify `/auth/me` endpoint is working
   - Check browser console for errors

2. **Automatic logout**
   - Token might be expired
   - Backend might be returning 401
   - Check network connectivity

3. **Infinite redirects**
   - Check if already on login page before redirecting
   - Verify AuthContext is properly initialized

### Debug Steps

1. Check localStorage for `authToken`
2. Verify token format and expiration
3. Test `/auth/me` endpoint directly
4. Check network tab for failed requests
5. Review AuthContext state in React DevTools 