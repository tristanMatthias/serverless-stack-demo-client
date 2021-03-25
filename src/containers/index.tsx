import React from 'react';
import { AuthContainer } from './Auth.container';
import { SignupContainer } from './Signup.container';

export const ContainerProviders: React.FC = ({ children }) =>
  <AuthContainer.Provider>
    <SignupContainer.Provider>
      {children}
    </SignupContainer.Provider>
  </AuthContainer.Provider>;
