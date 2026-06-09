// Fallback storage for development (until AsyncStorage is installed)
let inMemoryStorage = {};

let AsyncStorage;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // Fallback if package not installed
  AsyncStorage = {
    setItem: async (key, value) => {
      inMemoryStorage[key] = value;
      return Promise.resolve();
    },
    getItem: async (key) => {
      return Promise.resolve(inMemoryStorage[key] || null);
    },
    removeItem: async (key) => {
      delete inMemoryStorage[key];
      return Promise.resolve();
    },
  };
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@ai_studio_access_token',
  REFRESH_TOKEN: '@ai_studio_refresh_token',
  USER_DATA: '@ai_studio_user_data',
};

class TokenManager {
  // Save tokens
  static async saveTokens(accessToken, refreshToken) {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
      ]);
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }

  // Get access token
  static async getAccessToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  }

  // Get refresh token
  static async getRefreshToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
      return null;
    }
  }

  // Save user data
  static async saveUserData(userData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  // Get user data
  static async getUserData() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  // Clear all tokens and user data
  static async clearTokens() {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated() {
    try {
      const token = await this.getAccessToken();
      return !!token;
    } catch {
      return false;
    }
  }
}

export default TokenManager;
