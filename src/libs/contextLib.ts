import { useContext, createContext } from 'react';

export interface IAppContext {
  isAuthenticated: boolean
  userHasAuthenticated?(authed: boolean): void;
}


export const AppContext = createContext<IAppContext>({
  isAuthenticated: false
});

export function useAppContext() {
  return useContext(AppContext);
}
