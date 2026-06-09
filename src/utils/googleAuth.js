import * as WebBrowser from 'expo-web-browser';
import { authService } from './apiService';
import TokenManager from './tokenManager';

const WEB_CLIENT_ID = '1072704095672-c02vvqepduh5g0htcenpo8nen9cn7hsu.apps.googleusercontent.com';
const REDIRECT_URI = 'https://auth.expo.io/@tahashehzad/ai-studio-app/callback';
const BACKEND_URL = 'https://aeb4-124-29-239-159.ngrok-free.app/api';

export const useGoogleAuth = () => {
  const handleGoogleAuth = async () => {
    try {
      // Build Google OAuth URL
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${WEB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid%20profile%20email&access_type=offline&prompt=consent`;

      // Open in browser
      const result = await WebBrowser.openAuthSessionAsync(
        googleAuthUrl,
        REDIRECT_URI
      );

      if (result.type === 'success') {
        const { url } = result;

        // Extract code from callback URL
        const match = url.match(/code=([^&]+)/);
        if (!match) {
          return {
            success: false,
            message: 'Authorization code not found',
          };
        }

        const authCode = match[1];
        console.log('Google Auth Code:', authCode);

        // Send code to backend to exchange for token
        try {
          const response = await fetch(`${BACKEND_URL}/accounts/google-login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: authCode,
              redirect_uri: REDIRECT_URI,
            }),
          });

          const data = await response.json();

          if (data.success) {
            // Save tokens
            await TokenManager.saveTokens(
              data.data.access,
              data.data.refresh
            );

            // Save user data
            await TokenManager.saveUserData(data.data.user);

            return {
              success: true,
              user: data.data.user,
              message: 'Google login successful',
            };
          } else {
            return {
              success: false,
              message: data.message || 'Backend error',
            };
          }
        } catch (backendError) {
          console.error('Backend Error:', backendError);
          return {
            success: false,
            message: 'Could not connect to backend',
          };
        }
      } else if (result.type === 'cancel') {
        return {
          success: false,
          message: 'Cancelled',
        };
      } else if (result.type === 'dismiss') {
        return {
          success: false,
          message: 'Cancelled',
        };
      }

      return {
        success: false,
        message: 'An error occurred',
      };
    } catch (error) {
      console.error('Google WebView Auth Error:', error);
      return {
        success: false,
        message: 'Error: ' + error.message,
      };
    }
  };

  return { handleGoogleAuth };
};
