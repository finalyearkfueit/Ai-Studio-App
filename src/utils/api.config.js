// API Configuration
export const API_BASE_URL = 'https://auth-production-f0ea.up.railway.app/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/accounts/register/',
    LOGIN: '/accounts/login/',
    LOGOUT: '/accounts/logout/',
    REFRESH_TOKEN: '/accounts/token/refresh/',
    GOOGLE_LOGIN: '/accounts/google-login/',
  },
  
  // Password Reset
  PASSWORD_RESET: {
    REQUEST_OTP: '/accounts/forgot-password/',
    VERIFY_OTP: '/accounts/verify-otp/',
    RESET_PASSWORD: '/accounts/reset-password/',
  },
  
  // Profile
  PROFILE: {
    GET: '/accounts/profile/',
    UPDATE: '/accounts/profile/update/',
  },
};

// Request timeout (in milliseconds)
export const REQUEST_TIMEOUT = 30000;

// Retry configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds
};
