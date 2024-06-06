//create mobile context and provider main func is when system on mobile toggle aside menu
'use client'
import React, { ForwardRefExoticComponent, RefAttributes, SVGProps, createContext, useContext, useReducer, useState } from 'react';

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
  type: 'TOGGLE_MOBILE' | 'SET_NAVIGATION' | 'UPDATE_ACTIVE';
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

export const AsideContext = React.createContext<AsideContextProps>({
  asideState: init_state,
  asideDispatch: () => {},
});

const AsideReducer = (state: AsideState, action: AsideAction): AsideState => {
  switch (action.type) {
    case 'TOGGLE_MOBILE':
      return { ...state, isMobile: !state.isMobile };
    case 'SET_NAVIGATION':
      return { ...state, navigation: action.payload };
    case 'UPDATE_ACTIVE':
      return { ...state, navigation: state.navigation.map((nav: INavigation) => ({ ...nav, current: nav.href === action.payload })) };
    default:
      return state;
  }
}

export const AsideProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [asideState, asideDispatch] = useReducer(AsideReducer, init_state);

  return (
    <AsideContext.Provider value={{ asideState, asideDispatch }}>
      {children}
    </AsideContext.Provider>
  );
};
