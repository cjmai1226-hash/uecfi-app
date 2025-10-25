import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LanguageOption = 'ilo' | 'tag';

interface LanguageContextType {
  language: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  isAltLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'prayers.variant';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageOption>('ilo');

  // Load language preference on mount
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (saved === 'alt') {
          setLanguageState('tag');
        } else {
          setLanguageState('ilo');
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };
    loadLanguagePreference();
  }, []);

  const setLanguage = async (lang: LanguageOption) => {
    try {
      const storageValue = lang === 'tag' ? 'alt' : 'base';
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, storageValue);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    isAltLanguage: language === 'tag',
  };

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
