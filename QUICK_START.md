# Quick Start - API Integration

## Step 1: Install AsyncStorage (فوری)

```bash
npm install @react-native-async-storage/async-storage
```

## Step 2: Update App.js

Replace your App.js with this:

```javascript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';

function MainApp() {
  const { isDarkMode } = useTheme();
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
```

## Step 3: Update RootNavigator.js

Add authentication check in your navigation:

```javascript
import { useAuth } from '../context/AuthContext';

export default function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <SplashScreen />; // Your splash screen
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        // Main app screens
        <BottomTabNavigator />
      ) : (
        // Auth screens
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
```

## Step 4: Test the Integration

### Test Login:
1. Go to AuthScreen
2. Enter your Django account email & password
3. Click "Log In"
4. Should navigate to MainTabs on success

### Test Registration:
1. Go to SignupScreen
2. Fill in: username, email, password, confirm password
3. Click "Sign Up"
4. Should create account and log in

### Test Password Reset:
1. Go to ForgotScreen
2. Enter email
3. Click "Send Reset Link"
4. Get OTP from email
5. Enter OTP in OTPScreen
6. Set new password in ResetPasswordScreen
7. Login with new password

### Test Profile:
1. After login, go to ProfileScreen
2. Should see your profile data
3. Click "Log Out Account" to test logout

---

## 🔧 Troubleshooting

### "AsyncStorage not found"
```bash
npm install @react-native-async-storage/async-storage
expo install @react-native-async-storage/async-storage
```

### API requests failing
- Check base URL in `src/utils/api.config.js`
- Verify Django server is running
- Check network connectivity
- Look at error message for details

### Token not saving
- Verify AsyncStorage is installed
- Check phone storage permissions
- Clear app data and try again

### Login always fails
- Verify email and password are correct
- Check Django user exists
- Look at Django logs

---

## 📱 API Services Available

All in `src/utils/apiService.js`:

```javascript
// Authentication
import { authService } from '../utils/apiService';
await authService.login(email, password);
await authService.register(username, email, password, confirmPassword);
await authService.logout();
await authService.googleLogin(idToken);

// Password Reset
import { passwordResetService } from '../utils/apiService';
await passwordResetService.requestOTP(email);
await passwordResetService.verifyOTP(email, otpCode);
await passwordResetService.resetPassword(resetToken, password, confirmPassword);

// Profile
import { profileService } from '../utils/apiService';
await profileService.getProfile();
await profileService.updateProfile(formData);
```

---

## 🌍 Environment Variables (Optional)

Create `.env` file in project root:

```
API_BASE_URL=https://aeb4-124-29-239-159.ngrok-free.app/api
REQUEST_TIMEOUT=30000
```

Then update `api.config.js`:

```javascript
export const API_BASE_URL = process.env.API_BASE_URL || '...';
```

---

## ✅ Integration Checklist

- [ ] Install AsyncStorage
- [ ] Update App.js with AuthProvider
- [ ] Update RootNavigator with auth check
- [ ] Test login
- [ ] Test registration
- [ ] Test password reset
- [ ] Test profile loading
- [ ] Test logout
- [ ] Test token auto-refresh (wait for token to expire)

---

## 🎯 Next Steps

1. **Google OAuth**: Add Google Sign-In integration
2. **Profile Update**: Add image upload and edit profile
3. **Rate Limiting**: Implement request rate limiting
4. **Offline Support**: Cache API responses
5. **Error Analytics**: Track API errors for debugging

---

اب آپ کا app مکمل طور پر Django API کے ساتھ integrated ہے! 🚀

