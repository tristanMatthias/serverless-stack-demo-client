import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router';
import * as yup from 'yup';
import { LoaderButton } from '../../components/ButtonLoader/ButtonLoader';
import { NewUser, SignupContainer } from '../../containers/Signup.container';


export const schemaNewUser = yup.object().shape({
  email: yup.string()
    .email()
    .required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});


export const FormSignup = () => {
  const [loading, setLoading] = useState(false);
  const { signup, newUser } = SignupContainer.useContainer();
  const [error, setError] = useState<string>();

  const { handleSubmit, register, errors, setValue } = useForm<NewUser>({
    resolver: yupResolver(schemaNewUser)
  });

  if (newUser) return <Redirect to="/verify" />;


  const onSubmit = handleSubmit(async fields => {
    setLoading(true);

    try {
      await signup(fields);
    } catch (e) {
      setError(e.message);
      setValue('password', '');
      setValue('confirmPassword', '');
    }

    setLoading(false);
  });


  return <Form onSubmit={onSubmit}>
    {error && <Alert variant="danger">{error}</Alert>}
    <Form.Group controlId="email" size="lg">
      <Form.Label>Email</Form.Label>
      <Form.Control name="email" autoFocus type="email" ref={register} isInvalid={Boolean(errors.email)} />
      <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
    </Form.Group>

    <Form.Group controlId="password" size="lg">
      <Form.Label>Password</Form.Label>
      <Form.Control name="password" type="password" ref={register} isInvalid={Boolean(errors.password)} />
      <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
    </Form.Group>

    <Form.Group controlId="confirmPassword" size="lg">
      <Form.Label>Confirm Password</Form.Label>
      <Form.Control name="confirmPassword" type="password" ref={register} isInvalid={Boolean(errors.confirmPassword)} />
      <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
    </Form.Group>

    <LoaderButton
      block
      size="lg"
      type="submit"
      variant="success"
      isLoading={loading}
      // disabled={!formState.isValid}
    > Signup </LoaderButton>
  </Form>;
};
