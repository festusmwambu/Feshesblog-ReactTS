import React, { useState, useEffect, useRef, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Body from '../components/Body';
import InputField from '../components/InputField';
import { useAPIProviderContext } from '../contexts/APIProvider';
import { useFlashProviderContext } from '../contexts/FlashProvider';


const ChangePasswordPage = () => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const oldPasswordField = useRef<HTMLInputElement | null>(null);
  const passwordField = useRef<HTMLInputElement | null>(null);
  const password2Field = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const api = useAPIProviderContext();
  const flash = useFlashProviderContext();

  useEffect(() => {
    if (oldPasswordField.current) {
      oldPasswordField.current.focus();
    }
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (passwordField.current?.value !== password2Field.current?.value) {
        setFormErrors({ password2: "New passwords don't match" });
    } else {
      const response = await api.put('/me', {
        old_password: oldPasswordField.current?.value,
        password: passwordField.current?.value
      });

      if (response.ok) {
        setFormErrors({});
        flash('Your password has been updated.', 'success');
        navigate('/me');
      } else {
        setFormErrors(response.body.errors.json);
      }
    }
  };

  return (
    <Body sidebar>
      <h1>Change Your Password</h1>
      <Form onSubmit={onSubmit}>
        <InputField name="oldPassword" label="Old Password" type="password" error={formErrors.old_password} fieldRef={oldPasswordField} />
        <InputField name="password" label="New Password" type="password" error={formErrors.password} fieldRef={passwordField} />
        <InputField name="password2" label="New Password Again" type="password" error={formErrors.password2} fieldRef={password2Field} />
        <Button variant="primary" type="submit">Change Password</Button>
      </Form>
    </Body>
  );
};

export default ChangePasswordPage;