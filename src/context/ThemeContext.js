import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const colors = {
    background: isDarkMode ? '#0B0A10' : '#F9FAFB',
    card: isDarkMode ? '#151324' : '#FFFFFF',
    cardLight: isDarkMode ? '#1E1B3A' : '#F3F4F6',
    text: isDarkMode ? '#FFFFFF' : '#111827',
    textSecondary: isDarkMode ? '#9A98B0' : '#4B5563',
    textMuted: isDarkMode ? '#686687' : '#9CA3AF',
    border: isDarkMode ? '#24223A' : '#E5E7EB',
    
    // Neon accents stay vibrant in both themes but can have small adjustments
    primary: '#8B5CF6',
    secondary: '#EC4899',
    accent: '#FF79C6',
    cyan: '#8BE9FD',
    green: '#50FA7B',
    red: '#FF5555',
    orange: '#FFB86C',
    white: isDarkMode ? '#FFFFFF' : '#111827',
  };

  const gradients = {
    primary: ['#8B5CF6', '#EC4899'],
    secondary: ['#3B82F6', '#8B5CF6'],
    accent: ['#FF79C6', '#BD93F9', '#8BE9FD'],
    button: ['#7C3AED', '#DB2777'],
    dark: isDarkMode ? ['#0B0A10', '#1C1A30'] : ['#F9FAFB', '#F3F4F6'],
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors, gradients }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
