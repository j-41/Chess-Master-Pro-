import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { soundManager } from '../audio/SoundManager';

export type BoardTheme = 'green' | 'brown' | 'blue' | 'purple' | 'ice' | 'wood' | 'marble' | 'neon';
export type PieceSet = 'standard' | 'neo' | 'alpha';
export type AppTheme = 'dark' | 'light';

export interface CustomBoardColors {
  light: string;
  dark: string;
  lightHighlight: string;
  darkHighlight: string;
}

export interface Settings {
  appTheme: AppTheme;
  boardTheme: BoardTheme;
  pieceSet: PieceSet;
  soundEnabled: boolean;
  soundVolume: number;
  showCoordinates: boolean;
  showLegalMoves: boolean;
  showLastMove: boolean;
  animationSpeed: 'none' | 'fast' | 'normal' | 'slow';
  autoQueen: boolean;
  confirmResign: boolean;
  boardFlipped: boolean;
  moveMethod: 'both' | 'drag' | 'click';
  customBoardColors: CustomBoardColors | null;
  showEvalBar: boolean;
}

const defaultSettings: Settings = {
  appTheme: 'dark',
  boardTheme: 'green',
  pieceSet: 'standard',
  soundEnabled: true,
  soundVolume: 0.5,
  showCoordinates: true,
  showLegalMoves: true,
  showLastMove: true,
  animationSpeed: 'normal',
  autoQueen: false,
  confirmResign: true,
  boardFlipped: false,
  moveMethod: 'both',
  customBoardColors: null,
  showEvalBar: true,
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('chessmaster_settings');
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return defaultSettings;
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.appTheme);
  }, [settings.appTheme]);

  // Apply board theme
  useEffect(() => {
    if (settings.customBoardColors) {
      document.documentElement.style.setProperty('--board-light', settings.customBoardColors.light);
      document.documentElement.style.setProperty('--board-dark', settings.customBoardColors.dark);
      document.documentElement.style.setProperty('--board-light-highlight', settings.customBoardColors.lightHighlight);
      document.documentElement.style.setProperty('--board-dark-highlight', settings.customBoardColors.darkHighlight);
      document.documentElement.removeAttribute('data-board-theme');
    } else {
      document.documentElement.setAttribute('data-board-theme', settings.boardTheme);
      document.documentElement.style.removeProperty('--board-light');
      document.documentElement.style.removeProperty('--board-dark');
      document.documentElement.style.removeProperty('--board-light-highlight');
      document.documentElement.style.removeProperty('--board-dark-highlight');
    }
  }, [settings.boardTheme, settings.customBoardColors]);

  // Apply sound settings
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
    soundManager.setVolume(settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  // Save settings on every change
  useEffect(() => {
    try {
      localStorage.setItem('chessmaster_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
