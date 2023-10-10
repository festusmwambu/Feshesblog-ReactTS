import React, { useState, useEffect, useRef, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Body from '../components/Body';
import InputField from '../components/InputField';
import { useAPIProviderContext } from '../contexts/APIProvider';
import { useFlashProviderContext } from '../contexts/FlashProvider';



const ResetRequestPage = () => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const emailField = useRef<HTMLInputElement | null>(null);
  const api = useAPIProviderContext();
  const flash = useFlashProviderContext();

  useEffect(() => {
    emailField.current?.focus();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const email = emailField.current?.value;
    if (!email) {
      return; // No need to proceed if no email is provided
    }

    const response = await api.post('/tokens/reset', {
      email: emailField.current?.value,
    });

    if (!response.ok) {
      setFormErrors(response.body.errors.json);
    } else {
      emailField.current!.value = "";

      setFormErrors({});
      flash(
        'You will receive an email with instructions ' +
        'to reset your password.', 'info'
      );
    }
  };

  return (
    <Body>
      <h1>Reset Your Password</h1>
      <Form onSubmit={onSubmit}>
        <InputField name="email" label="Email Address" error={formErrors.email} fieldRef={emailField} />
        <Button variant="primary" type="submit">Reset Password</Button>
      </Form>
    </Body>
  );
};

export default ResetRequestPage;