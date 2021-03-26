import Auth from '@aws-amplify/auth';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { createContainer } from 'unstated-next';
import * as yup from 'yup';
import { onError } from '../libs/errorLib';


export const schemaNewUser = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().email().required()
});


export interface NewUser {
  email: string;
  password: string;
  confirmPassword: string;
}


export const SignupContainer = createContainer(() => {
  const history = useHistory();
  const [newUserDetails, setNewUserDetails] = useState<NewUser>();
  const [newUser, setNewUser] = useState(false);
  const [verified, setVerified] = useState(false);


  const signup = async (user: NewUser) => {
    setNewUserDetails(user);

    try {
      await Auth.signUp({
        username: user.email,
        password: user.password
      });
      setNewUser(true);

    } catch (e) {
      // User already signed up, but potentially hasn't verified
      if (e.code === 'UsernameExistsException') {
        // Resend verification
        await Auth.resendSignUp(user.email);
        setNewUser(true);

      } else {
        onError(e);
        throw e;
      }

    }
  };


  const verify = async (email: string, code: string) => {
    await Auth.confirmSignUp(email, code);

    // User verified straight after verification
    if (newUserDetails) {
      const { password } = newUserDetails;
      await Auth.signIn(email, password);
      history.push('/');
      // User refreshed or closed page between signup and verification
    } else history.push('/login');

    setVerified(true);
  };


  return {
    newUser,
    signup,
    verified,
    verify,
    email: newUserDetails?.email
  };
});
