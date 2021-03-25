import { Auth } from 'aws-amplify';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import React, { FormEventHandler, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import { LoaderButton } from '../components/LoaderButton';
import { useAppContext } from '../libs/contextLib';
import { onError } from '../libs/errorLib';
import { useFormFields } from '../libs/hooksLib';
import './Signup.css';

// export interface NewUser {
//   email: string;
//   password: string;
//   confirmPassword: string;
//   confirmationCode: string;
// }

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: ''
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState<ISignUpResult>();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.email.length > 0
      && fields.password.length > 0
      && fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  const handleSubmit: FormEventHandler = async event => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const user = await Auth.signUp({
        username: fields.email,
        password: fields.password
      });
      setIsLoading(false);
      setNewUser(user);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  const handleConfirmationSubmit: FormEventHandler = async event => {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated!(true);
      history.push('/');

    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode" size="lg">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <Form.Text muted>Please check your email for the code.</Form.Text>
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </Form>
    );
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password" size="lg">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" size="lg">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </Form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
