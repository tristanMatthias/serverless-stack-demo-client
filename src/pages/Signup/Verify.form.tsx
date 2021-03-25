import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { LoaderButton } from '../../components/ButtonLoader/ButtonLoader';
import { SignupContainer } from '../../containers/Signup.container';
import { onError } from '../../libs/errorLib';
import { useQueryParam } from '../../libs/useQueryParam.hook';


export const schemaNewUser = yup.object().shape({
  code: yup.string().required('Code is required')
});


export const FormVerify = () => {
  const [loading, setLoading] = useState(false);
  const { verify, email: signupEmail } = SignupContainer.useContainer();
  const qsEmail = useQueryParam('email');

  const email = signupEmail || qsEmail;
  if (!email) return <Alert variant="danger">Unknown email</Alert>;


  const { handleSubmit, register, errors, setError } = useForm<{code: string}>({
    resolver: yupResolver(schemaNewUser)
  });


  const onSubmit = handleSubmit(async fields => {
    setLoading(true);

    try {
      await verify(email, fields.code);
    } catch (e) {
      onError(e);
      setError('code', e);
    }

    setLoading(false);
  });


  return <Form onSubmit={onSubmit}>
    <Form.Group controlId="code" size="lg">
      <Form.Label>Confirmation Code</Form.Label>
      <Form.Control name="code" autoFocus type="tel" ref={register} isInvalid={Boolean(errors.code)} />
      {!errors.code && <Form.Text muted>Please check your email for the code.</Form.Text>}
      <Form.Control.Feedback type="invalid">{errors.code?.message}</Form.Control.Feedback>
    </Form.Group>

    <LoaderButton
      block
      size="lg"
      type="submit"
      variant="success"
      isLoading={loading}
    > Verify </LoaderButton>
  </Form>;
};
