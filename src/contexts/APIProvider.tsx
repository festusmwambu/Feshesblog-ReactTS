import React, { createContext, useContext, useCallback, useMemo, ReactNode } from 'react';

import FeshesblogAPIClient, { FeshesblogAPIClientType } from '../FeshesblogAPIClient';
import { useFlashProviderContext } from './FlashProvider';



interface APIProviderContextProps extends FeshesblogAPIClientType {
  // Define the methods and properties you want to expose from the API context
  // For example, you might have methods like `get`, `post`, `put`, etc.
  // and other API-related properties.
}

export const APIProviderContext = createContext<APIProviderContextProps | undefined>(undefined);


interface APIProviderProps {
  children: ReactNode;
}

const APIProvider = ({ children }: APIProviderProps ) => {
  const flash = useFlashProviderContext();
  
  const onError = useCallback(() => { // Update the error callback argument type
    flash('An unexpected error has occurred. Please try again.', 'danger');
  }, [flash]);

  // Create an API instance using the provided constructor function
  const api = useMemo(() => FeshesblogAPIClient(onError), [onError]);

  return (
    <APIProviderContext.Provider value={api}>
      {children}
    </APIProviderContext.Provider>
    );
};

export const useAPIProviderContext = () => {
  const context = useContext(APIProviderContext);

  if (!context) {
    throw new Error("useAPIProviderContext must be used within APIProvider");
  }

  return context;
};

export default APIProvider;

