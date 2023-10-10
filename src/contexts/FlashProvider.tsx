import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';


interface FlashProviderContextProps {
  flashMessage: {
    message: string;
    type: string;
  };
  visible: boolean;
  hideFlash: () => void;
  flash: (message: string, type: string, duration?: number) => void;
}

export const FlashProviderContext = createContext<FlashProviderContextProps | undefined>(undefined);


interface FlashProviderProps {
  children: ReactNode;
}

const FlashProvider = ({ children }: FlashProviderProps) => {
  const [flashMessage, setFlashMessage] = useState({ message: "", type: ""});

  const [visible, setVisible] = useState(false);

  const hideFlash = useCallback(() => {
    setVisible(false);
  }, []);

  const flash = useCallback((message: string, type: string, duration = 10) => {
    let flashTimer: NodeJS.Timeout | undefined;

    if (flashTimer) {
      clearTimeout(flashTimer);
      flashTimer = undefined;
    }

    setFlashMessage({message, type});

    setVisible(true);

    if (duration) {
      flashTimer = setTimeout(hideFlash, duration * 1000);
    }
  }, [hideFlash]);

  return (
    <FlashProviderContext.Provider value={{flashMessage, visible, hideFlash, flash}}>
      {children}
    </FlashProviderContext.Provider>
  );
};

export const useFlashProviderContext = () => {
  const context = useContext(FlashProviderContext);

  if (!context) {
    throw new Error("useFlashProviderContext must be used within FlashProvider");
  }

  return context.flash;
};

export default FlashProvider;

