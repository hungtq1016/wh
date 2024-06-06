//create mobile context and provider main func is when system on mobile toggle aside menu
'use client'
import React, { ForwardRefExoticComponent, RefAttributes, SVGProps, createContext, useContext, useState } from 'react';

interface INavigation {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & RefAttributes<SVGSVGElement>>;
  current: boolean
}

interface AsideState {
  isMobile: boolean;
  navigation: INavigation[];
}

interface AsideAction {
  type: 'TOGGLE_MOBILE' | 'SET_NAVIGATION';
  payload?: any;
}

interface AsideContextProps {
  asideState: AsideState;
  asideDispatch: React.Dispatch<AsideAction>;
}

const init_state = {
  asideState: {
    isMobile: false,
    navigation: []
  },
  asideDispatch: () => null
};

const AsideContext = React.createContext<AsideContextProps>(init_state);

export const MobileProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [navigation, setNavigation] = useState<INavigation[]>([]);

  const toggleMobile = () => {
    setIsMobile(!isMobile);
  };

  return (
    <AsideContext.Provider value={{ isMobile, navigation, toggleMobile, setNavigation }}>
      {children}
    </AsideContext.Provider>
  );
};

export const useAside = () => {
  const context = useContext(AsideContext);
  if (!context) {
    throw new Error('useAside must be used within a MobileProvider');
  }
  return context;
};