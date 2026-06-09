# 🔐 Google Sign-In Setup Guide

## Step 1: Google OAuth Credentials حاصل کریں

### Web Console پر جائیں:
1. https://console.cloud.google.com/ کھولیں
2. **New Project** بنائیں (نام: "AI Studio")
3. **Google+ API** enable کریں
4. **OAuth 2.0 Consent Screen** setup کریں

### Client IDs بنائیں:

#### Web Client ID:
1. **Credentials** → **Create Credential** → **OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Authorized origins:
   ```
   http://localhost:19000
   http://localhost:19001
   http://localhost:8081
   https://yourdomain.com
   ```
4. Authorized redirect URIs:
   ```
   http://localhost:19000/callback
   http://localhost:19001/callback
   https://yourdomain.com/callback
   ```
5. Copy کریں: **Web Client ID**

#### Android Client ID:
1. Create another **OAuth 2.0 Client ID**
2. Application type: **Android**
3. Package name: `com.aistudio.app` (یا آپ کا slug)
4. **Get SHA-1 fingerprint**: 
   ```bash
   eas credentials
   # یا
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
5. Copy کریں: **Android Client ID**

#### iOS Client ID:
1. Create another **OAuth 2.0 Client ID**
2. Application type: **iOS**
3. Bundle ID: `com.aistudio.app` (app.json slug سے match کریں)
4. Copy کریں: **iOS Client ID**

---

## Step 2: App میں Client IDs Set کریں

### `app.json` میں update کریں:
```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosClientId": "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
          "androidClientId": "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
          "webClientId": "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
        }
      ]
    ]
  }
}
```

### `src/utils/googleAuth.js` میں update کریں:
```javascript
const GOOGLE_CONFIG = {
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
};
```

---

## Step 3: Backend میں Google Login Endpoint

آپ کے Django میں `/api/accounts/google-login/` endpoint ہے۔ یہ کام کرتا ہے:

```
POST /api/accounts/google-login/

Body:
{
  "id_token": "google_id_token_from_frontend"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "access": "jwt_token",
    "refresh": "jwt_token"
  }
}
```

**مہم**: Backend میں **Google Verification** ہونی چاہیے:
- ID Token verify کریں
- Email سے existing user تلاش کریں
- نہ ملا تو نیا user بنائیں
- Tokens return کریں

---

## Step 4: Test کریں

### Expo Go میں:
```bash
npm start
# Scan QR code with Expo Go
# Click "Google Sign-In" button
```

### Android Build:
```bash
eas build --platform android
# یہ SHA-1 fingerprint لے گا خودکار
```

### iOS Build:
```bash
eas build --platform ios
```

---

## Functions Available:

### Login:
```javascript
import { googleSignIn } from '../utils/googleAuth';

const result = await googleSignIn();
if (result.success) {
  // Login successful, navigate
} else {
  // Show error: result.message
}
```

### Sign-Up:
```javascript
import { googleSignUp } from '../utils/googleAuth';

const result = await googleSignUp();
if (result.success) {
  // Account created
}
```

### Sign-Out:
```javascript
import { signOutGoogle } from '../utils/googleAuth';

const result = await signOutGoogle();
```

---

## Troubleshooting:

### "Unable to locate package" error:
```bash
expo prebuild --clean
npm start
```

### "Invalid ID Token":
- Client IDs غلط ہیں - double-check کریں
- Google OAuth consent screen complete کریں

### Android issues:
- SHA-1 fingerprint Google Console میں register ہونی چاہیے
- Package name `app.json` slug سے match کرنی چاہیے

### iOS issues:
- Bundle ID match ہونی چاہیے
- Provisioning Profile updated ہونی چاہیے

---

## Setup Summary:

✅ `app.json` - plugins اور client IDs add کریں  
✅ `googleAuth.js` - client IDs اپڈیٹ کریں  
✅ Backend - Google token verification implement کریں  
✅ Screens - Google buttons already integrated ہیں  

**Done! 🎉**
