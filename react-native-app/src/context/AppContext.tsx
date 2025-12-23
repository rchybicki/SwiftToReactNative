import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RssSource } from '../models/types';
import { getSettings, setSettings } from '../services/settings';

interface AppContextType {
  selectedSource: RssSource | null;
  setSelectedSource: (source: RssSource | null) => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedSource, setSelectedSourceState] = useState<RssSource | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved source on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const source = await getSettings();
        setSelectedSourceState(source);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const setSelectedSource = async (source: RssSource | null) => {
    await setSettings(source);
    setSelectedSourceState(source);
  };

  return (
    <AppContext.Provider value={{ selectedSource, setSelectedSource, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
