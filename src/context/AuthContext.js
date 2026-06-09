import React, { createContext, useState, useContext, useEffect } from 'react';
import TokenManager from '../utils/tokenManager';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await TokenManager.isAuthenticated();
      const userData = await TokenManager.getUserData();
      
      setIsAuthenticated(isAuth);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await TokenManager.clearTokens();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const setAuthUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    logout,
    setAuthUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
