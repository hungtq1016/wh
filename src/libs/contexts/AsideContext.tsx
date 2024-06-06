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
  isMobile: false,
  navigation: []
};

const AsideContext = React.createContext<AsideContextProps>({
  asideState: init_state,
  asideDispatch: () => {},
});

export const MobileProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [asideState, asideDispatch] = useState<AsideState>(init_state);
  

  return (
    <AsideContext.Provider value={{  }}>
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