import { createContext, useContext, useCallback, useMemo } from 'react';
import FeshesblogApiClient from '../FeshesblogApiClient';
import { useFlash } from './FlashProvider';

export const ApiContext = createContext();

export default function ApiProvider({ children }) {
  const flash = useFlash();
  const onError = useCallback(() => {
    flash('An unexpected error has occurred. Please try again.', 'danger');
  }, [flash]);
  const api = useMemo(() => new FeshesblogApiClient(onError), [onError]);

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
    );
}

export function useApi() {
  return useContext(ApiContext);
}

