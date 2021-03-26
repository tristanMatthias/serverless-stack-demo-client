import Auth from '@aws-amplify/auth';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { createContainer } from 'unstated-next';
import { onError } from '../libs/errorLib';

export const AuthContainer = createContainer(() => {
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const loadSession = async () => {
    setIsAuthenticating(true);

    try {
      await Auth.currentSession();
      setAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') return;
      onError(e);
    }

    setIsAuthenticating(false);
  };

  const signIn = async (email: string, password: string) => {
    const login = await Auth.signIn(email, password);
    if (login) setAuthenticated(true);
    else setAuthenticated(false);
  };

  const signOut = async () => {
    await Auth.signOut();
    setAuthenticated(false);
    history.push('/login');
  };

  return { signIn, signOut, authenticated, isAuthenticating, loadSession };
});
