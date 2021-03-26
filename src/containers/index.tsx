import React from 'react';
import { AuthContainer } from './Auth.container';
import { NotesContainer } from './Notes.container';
import { SignupContainer } from './Signup.container';

export const ContainerProviders: React.FC = ({ children }) =>
  <AuthContainer.Provider>
    <SignupContainer.Provider>
      <NotesContainer.Provider>
        {children}
      </NotesContainer.Provider>
    </SignupContainer.Provider>
  </AuthContainer.Provider>;
