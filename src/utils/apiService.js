import { API_BASE_URL, API_ENDPOINTS, REQUEST_TIMEOUT } from './api.config';
import TokenManager from './tokenManager';
import { handleAPIError } from './errorHandler';

// Simple fetch-based API client (no axios needed)
const makeRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const token = await TokenManager.getAccessToken();
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
      timeout: REQUEST_TIMEOUT,
    };

    if (data && method !== 'GET') {
      // Check if data is FormData (for file uploads)
      if (data instanceof FormData) {
        delete headers['Content-Type']; // Let browser set it
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }
    }

    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Request:', { method, endpoint, url });

    const response = await fetch(url, options);
    
    // Get response text first to debug
    const responseText = await response.text();
    console.log('Raw Response:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Response was:', responseText);
      throw {
        response: {
          status: response.status,
          data: { message: 'Invalid response from server: ' + responseText.substring(0, 100) },
        },
      };
    }

    // Handle 401 - Try to refresh token
    if (response.status === 401) {
      const refreshToken = await TokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(
            `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh: refreshToken }),
              timeout: REQUEST_TIMEOUT,
            }
          );
          
          const refreshText = await refreshResponse.text();
          const refreshData = JSON.parse(refreshText);
          
          if (refreshResponse.ok && refreshData.data?.access) {
            const newAccessToken = refreshData.data.access;
            await TokenManager.saveTokens(newAccessToken, refreshToken);
            
            // Retry original request with new token
            headers.Authorization = `Bearer ${newAccessToken}`;
            const retryResponse = await fetch(url, {
              ...options,
              headers,
            });
            const retryText = await retryResponse.text();
            return JSON.parse(retryText);
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          // Refresh failed, clear tokens
          await TokenManager.clearTokens();
        }
      }
    }

    if (!response.ok) {
      const error = {
        response: {
          status: response.status,
          data: responseData,
        },
      };
      throw error;
    }

    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============= AUTHENTICATION SERVICES =============

export const authService = {
  // Register
  register: async (username, email, password, passwordConfirm) => {
    try {
      const response = await makeRequest(API_ENDPOINTS.AUTH.REGISTER, 'POST', {
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      });
      
      const { data: { user, access, refresh } } = response;
      await TokenManager.saveTokens(access, refresh);
      await TokenManager.saveUserData(user);
      
      return {
        success: true,
        user,
        message: 'Registration successful!',
      };
    } catch (error) {
      return handleAPIError(error);
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await makeRequest(API_ENDPOINTS.AUTH.LOGIN, 'POST', {
        email,
        password,
      });

      const { data: { user, access, refresh } } = response;
      await TokenManager.saveTokens(access, refresh);
      await TokenManager.saveUserData(user);

      return {
        success: true,
        user,
        message: 'Login successful!',
      };
    } catch (error) {
      return handleAPIError(error);
    }
  },

  // Logout
  logout: async () => {
    try {
      const refreshToken = await TokenManager.getRefreshToken();
      if (refreshToken) {
        await makeRequest(API_ENDPOINTS.AUTH.LOGOUT, 'POST', {
          refresh: refreshToken,
        });
      }
      
      await TokenManager.clearTokens();
      
      return {
        success: true,
        message: 'Logout successful!',
      };
    } catch (error) {
      // Clear tokens even if API call fails
      await TokenManager.clearTokens();
      return handleAPIError(error);
    }
  },

  // Google Login
  googleLogin: async (idToken) => {
    try {
      const response = await makeRequest(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, 'POST', {
        id_token: idToken,
      });

      const { data: { user, access, refresh } } = response;
      await TokenManager.saveTokens(access, refresh);
      await TokenManager.saveUserData(user);

      return {
        success: true,
        user,
        message: 'Google login successful!',
      };
    } catch (error) {
      return handleAPIError(error);
    }
  },
};

// ============= PASSWORD RESET SERVICES =============

export const passwordResetService = {
  // Request OTP
  requestOTP: async (email) => {
    try {
      const response = await makeRequest(API_ENDPOINTS.PASSWORD_RESET.REQUEST_OTP, 'POST', {
        email,
      });

      return {
        success: true,
        message: response.message || 'OTP has been sent to your email.',
      };
    } catch (error) {
      return handleAPIError(error);
    }
  },

  // Verify OTP
  verifyOTP: async (email, otpCode) => {
    try {
      const response = await makeRequest(API_ENDPOINTS.PASSWORD_RESET.VERIFY_OTP, 'POST', {
        email,
        otp_code: otpCode,
      });

      const { data: { reset_token } } = response;

      return {
        success: true,
        resetToken: reset_token,
        message: 'OTP verified successfully!',
      };
    } catch (error) {
      return handleAPIError(error);
    }
  },

  // Reset Password
  resetPassword: async (resetToken, password, passwordConfirm) => {
    try {
      const response = await makeRequest(API_ENDPOINTS.PASSWORD_RESET.RESET_PASSWORD, 'POST', {
        reset_token: resetToken,
        password,
        password_confirm: passwordConfirm,
      });

      return {
        success: true,
        message: response.message || 'Password reset successfully! You can now log in with your new password.',
      };
    } catch (error) {
      return handleAPIError(error);
    }
  },
};

// ============= PROFILE SERVICES =============

export const profileService = {
  // Get Profile
  getProfile: async () => {
    try {
      const response = await makeRequest(API_ENDPOINTS.PROFILE.GET, 'GET');
      const { data } = response;

      return {
        success: true,
        profile: data,
      };
    } catch (error) {
      return handleAPIError(error);
    }
  },

  // Update Profile
  updateProfile: async (formData) => {
    try {
      const response = await makeRequest(API_ENDPOINTS.PROFILE.UPDATE, 'PUT', formData);
      const { data } = response;
      await TokenManager.saveUserData(data);

      return {
        success: true,
        profile: data,
        message: 'Profile updated successfully!',
      };
    } catch (error) {
      return handleAPIError(error);
    }
  },
};

export default { authService, passwordResetService, profileService };
