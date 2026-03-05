import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  // Load settings from localStorage or use defaults
  const loadSettings = () => {
    const stored = localStorage.getItem('mentorlink_settings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
    return {
      darkMode: false,
      security: {
        twoFactor: false,
        passwordChange: false,
        loginAlerts: true,
        sessionPermission: true,
        dataSharing: false,
      },
      location: {
        shareLocation: true,
        autoDetect: false,
        showOnProfile: true,
        currentLocation: '',
        timezone: 'UTC-5',
      },
      account: {
        emailNotifications: true,
        profileVisibility: true,
        allowMessages: true,
        showActivity: false,
        email: '',
        username: '',
      },
      notifications: {
        email: true,
        push: false,
        sms: false,
        mentorshipRequests: true,
        sessionReminders: true,
        messages: true,
      },
    };
  };

  const [settings, setSettings] = useState(loadSettings);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mentorlink_settings', JSON.stringify(settings));

    // Apply dark mode to body
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [settings]);

  // Initialize dark mode on mount
  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    setSettings(prev => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  };

  const updateSecurity = (key, value) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value,
      },
    }));
  };

  const updateLocation = (key, value) => {
    setSettings(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [key]: value,
      },
    }));
  };

  const updateAccount = (key, value) => {
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        [key]: value,
      },
    }));
  };

  const updateNotifications = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const resetSettings = () => {
    const defaults = loadSettings();
    setSettings(defaults);
    localStorage.removeItem('mentorlink_settings');
  };

  const value = {
    settings,
    toggleDarkMode,
    updateSecurity,
    updateLocation,
    updateAccount,
    updateNotifications,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
