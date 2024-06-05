//create mobile context and provider main func is when system on mobile toggle aside menu
'use client'
import React, { createContext, useContext, useState } from 'react';

interface MobileContextProps {
  isMobile: boolean;
  toggleMobile: () => void;
}

const init_state = {
    isMobile: false,
    toggleMobile: () => {},
};

const MobileContext = React.createContext<MobileContextProps>(init_state);

export const MobileProvider = ({ children }:{children:React.ReactNode}) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const toggleMobile = () => {
        setIsMobile(!isMobile);
    };

    return (
        <MobileContext.Provider value={{ isMobile, toggleMobile }}>
            {children}
        </MobileContext.Provider>
    );
};

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
};