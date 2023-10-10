import React, { useState, useEffect, useRef, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import Body from '../components/Body';
import InputField from '../components/InputField';
import { useAPIProviderContext } from '../contexts/APIProvider';
import { useFlashProviderContext } from '../contexts/FlashProvider';



const ResetPage = () => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const passwordField = useRef<HTMLInputElement | null>(null);
  const password2Field = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { search } = useLocation();
  const api = useAPIProviderContext();
  const flash = useFlashProviderContext();
  const token = new URLSearchParams(search).get("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      passwordField.current?.focus();
    }
  }, [token, navigate]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (passwordField.current?.value !== password2Field.current?.value) {
        setFormErrors({ password2: "New passwords don't match" });
    } else {
      const response = await api.put('/tokens/reset', {
        token,
        new_password: passwordField.current?.value
      });

      if (response.ok) {
        setFormErrors({});
        flash('Your password has been reset.', 'success');
        navigate('/login');
      } else {
        if (response.body.errors.json.new_password) {
          setFormErrors(response.body.errors.json);
        } else {
          flash('Password could not be reset. Please try again.', 'danger');
          navigate('/reset-request');
        }
      }
    }
  };

  return (
    <Body>
      <h1>Reset Your Password</h1>
      <Form onSubmit={onSubmit}>
        <InputField name="password" label="New Password" type="password" error={formErrors.password} fieldRef={passwordField} />
        <InputField name="password2" label="New Password Again" type="password" error={formErrors.password2} fieldRef={password2Field} />
        <Button variant="primary" type="submit">Reset Password</Button>
      </Form>
    </Body>
  );
};

export default ResetPage;