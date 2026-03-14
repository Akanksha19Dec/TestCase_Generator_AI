import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TestCase, LLMProvider, AppState } from '../types';

interface AppContextType {
  state: AppState;
  setRequirement: (requirement: string) => void;
  setSelectedProvider: (provider: LLMProvider) => void;
  setApiKey: (apiKey: string) => void;
  setTestCases: (testCases: TestCase[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    requirement: '',
    selectedProvider: 'openai',
    apiKey: '',
    testCases: [],
    loading: false,
    error: null,
  });

  const setRequirement = (requirement: string) => {
    setState((prev) => ({ ...prev, requirement }));
  };

  const setSelectedProvider = (selectedProvider: LLMProvider) => {
    setState((prev) => ({ ...prev, selectedProvider }));
  };

  const setApiKey = (apiKey: string) => {
    setState((prev) => ({ ...prev, apiKey }));
  };

  const setTestCases = (testCases: TestCase[]) => {
    setState((prev) => ({ ...prev, testCases }));
  };

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setRequirement,
        setSelectedProvider,
        setApiKey,
        setTestCases,
        setLoading,
        setError,
        clearError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
