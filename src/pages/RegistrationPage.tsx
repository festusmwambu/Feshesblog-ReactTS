import React, { useState, useEffect, useRef, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useAPIProviderContext } from '../contexts/APIProvider';
import { useFlashProviderContext } from '../contexts/FlashProvider';
import Body from '../components/Body';
import InputField from '../components/InputField';




const RegistrationPage = () => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const usernameField = useRef<HTMLInputElement | null>(null);
  const emailField = useRef<HTMLInputElement | null>(null);
  const passwordField = useRef<HTMLInputElement | null>(null);
  const password2Field = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const api = useAPIProviderContext();
  const flash = useFlashProviderContext();

  useEffect(() => {
    if (usernameField.current) {
      usernameField.current.focus();
    }
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (passwordField.current?.value !== password2Field.current?.value) {
      setFormErrors({ password2: "Passwords don't match" });
    } else {
      const response = await api.post('/users', {
        username: usernameField.current?.value,
        email: emailField.current?.value,
        password: passwordField.current?.value
      });

      if (!response.ok) {
        setFormErrors(response.body.errors.json);
      } else {
        setFormErrors({});
        flash('You have successfully registered!', 'success');
        navigate('/login');
      }
    }
  };

  return (
    <Body>
      <h1>Register</h1>
      <Form onSubmit={onSubmit}>
        <InputField name="username" label="Username" error={formErrors.username} fieldRef={usernameField} />
        <InputField name="email" label="Email address" error={formErrors.email} fieldRef={emailField} />
        <InputField name="password" label="Password" type="password" error={formErrors.password} fieldRef={passwordField} />
        <InputField name="password2" label="Password again" type="password" error={formErrors.password2} fieldRef={password2Field} />
        <Button variant="primary" type="submit">Register</Button>
      </Form>
    </Body>
  );
};

export default RegistrationPage;