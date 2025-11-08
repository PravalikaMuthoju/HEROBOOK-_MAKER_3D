import { useState, useEffect, useCallback } from 'react';
import { AppSettings } from '../types';

const SETTINGS_KEY = 'heroBookSettings';

const defaultSettings: AppSettings = {
  theme: 'light',
  enableAnimations: true,
  generationQuality: 'normal',
  enableSounds: false,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      const parsed = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
      // Basic validation to prevent hydration with old settings
      if (!['light', 'dark', 'black'].includes(parsed.theme)) {
          parsed.theme = 'light';
      }
      return parsed;
    } catch (error) {
      console.error("Could not load settings from localStorage", error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Could not save settings to localStorage", error);
    }

    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'black');

    if (settings.theme === 'dark' || settings.theme === 'black') {
        root.classList.add('dark');
        if (settings.theme === 'black') {
            root.classList.add('black');
        }
    } else {
        root.classList.add('light');
    }
    
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return { settings, updateSettings };
};
