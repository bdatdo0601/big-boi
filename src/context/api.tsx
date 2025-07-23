import { Client, generateClient } from '@aws-amplify/api';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { useAuth } from './auth';

interface ApiContextType {
  client: Client;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const client = useMemo(() => generateClient({ authMode: user ? 'userPool' : 'identityPool' }), [user]);

  return <ApiContext.Provider value={{ client }}>{children}</ApiContext.Provider>;
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
