import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FontSizeOption = 'small' | 'medium' | 'large' | 'extra-large';

interface FontSizeContextType {
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
  getFontSizeValue: () => number;
  getLineHeight: () => number;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

const FONT_SIZE_STORAGE_KEY = '@font_size_preference';

const fontSizeValues = {
  small: 15,
  medium: 17,
  large: 19,
  'extra-large': 22,
};

const lineHeightValues = {
  small: 22,
  medium: 26,
  large: 28,
  'extra-large': 32,
};

interface FontSizeProviderProps {
  children: ReactNode;
}

export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSizeOption>('medium');

  // Load font size preference on mount
  useEffect(() => {
    const loadFontSizePreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(FONT_SIZE_STORAGE_KEY);
        if (saved && Object.keys(fontSizeValues).includes(saved)) {
          setFontSizeState(saved as FontSizeOption);
        }
      } catch (error) {
        console.error('Failed to load font size preference:', error);
      }
    };
    loadFontSizePreference();
  }, []);

  const setFontSize = async (size: FontSizeOption) => {
    try {
      await AsyncStorage.setItem(FONT_SIZE_STORAGE_KEY, size);
      setFontSizeState(size);
    } catch (error) {
      console.error('Failed to save font size preference:', error);
    }
  };

  const getFontSizeValue = () => fontSizeValues[fontSize];
  const getLineHeight = () => lineHeightValues[fontSize];

  const contextValue: FontSizeContextType = {
    fontSize,
    setFontSize,
    getFontSizeValue,
    getLineHeight,
  };

  return <FontSizeContext.Provider value={contextValue}>{children}</FontSizeContext.Provider>;
};

export const useFontSize = (): FontSizeContextType => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
