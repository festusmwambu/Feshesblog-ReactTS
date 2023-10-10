import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, SetStateAction, Dispatch } from 'react';

import { useAPIProviderContext } from './APIProvider';


interface User {
  [x: string]: string;
  username: string;
  // Define the user properties here
  // For example: id, username, email, etc.
}

interface UserProviderContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>> // Use Dispatch to set the state.
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const UserProviderContext = createContext<UserProviderContextProps | undefined>(undefined);


interface UserProviderProps {
  // Define the user properties here.
  // For example: id, username, email, etc.
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null); // Initialize with null
  const api = useAPIProviderContext();

  useEffect(() => {
    (async () => {
      if (api.isAuthenticated()) {
        const response = await api.get('/me');

        setUser(response.ok ? response.body : null);
      } else {
        setUser(null);
      }
    })();
  }, [api]);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const response = await api.login(username, password);

    if (response.ok) {
      const userResponse = await api.get('/me');

      setUser(userResponse.ok ? userResponse.body : null);

      // Return true for successful login
      return true; // Return true for successful login
    } else {
      return false; // Return false for failed login
    }
  }, [api]);

  const logout = useCallback(async () => {
    await api.logout();

    setUser(null);
  }, [api]);

  return (
    <UserProviderContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserProviderContext.Provider>
  );
}

export const useUserProviderContext = () => {
  const context = useContext(UserProviderContext);

  if (!context) {
    throw new Error("useUserProviderContext must be used within UserProvider");
  }

  return context;
}

export default UserProvider;