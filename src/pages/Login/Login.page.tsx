import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router';
import * as yup from 'yup';
import { LoaderButton } from '../../components/ButtonLoader/ButtonLoader';
import { AuthContainer } from '../../containers/Auth.container';
import './Login.page.css';


export const schemaNewUser = yup.object().shape({
  email: yup.string()
    .email()
    .required('Email is required'),
  password: yup.string()
    .required('Password is required')
});


export default function Login() {
  const { authenticated, signIn } = AuthContainer.useContainer();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const { handleSubmit, register, errors } = useForm<{ email: string, password: string }>({
    resolver: yupResolver(schemaNewUser)
  });

  if (authenticated) return <Redirect to='/' />;


  const onSubmit = handleSubmit(async ({ email, password }) => {
    setLoading(true);
    setError(undefined);
    try {
      await signIn(email, password);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  });

  return <div className="Login">
    <Form onSubmit={onSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group size="lg" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control autoFocus name="email" type="email" ref={register} isInvalid={Boolean(errors.email)} />
        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group size="lg" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control name="password" type="password" ref={register} isInvalid={Boolean(errors.password)} />
        <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
      </Form.Group>

      <LoaderButton block size="lg" type="submit" isLoading={loading} >
        Login
      </LoaderButton>
    </Form>
  </div>;
}
