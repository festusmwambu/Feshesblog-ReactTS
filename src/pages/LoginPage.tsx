import React, { useState, useEffect, useRef, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Body from '../components/Body';
import InputField from '../components/InputField';
import { useUserProviderContext } from '../contexts/UserProvider';
import { useFlashProviderContext } from '../contexts/FlashProvider';



const LoginPage = () => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const usernameField = useRef<HTMLInputElement | null>(null);
  const passwordField = useRef<HTMLInputElement | null>(null);
  const { login } = useUserProviderContext();
  const flash = useFlashProviderContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (usernameField.current) {
      usernameField.current.focus();
    }
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const username = usernameField.current?.value || "";
    const password = passwordField.current?.value || "";
    const errors: { [key: string]: string } = {};

    if (!username) {
      errors.username = 'Username must not be empty.';
    }

    if (!password) {
      errors.password = 'Password must not be empty.';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const result = await login(username, password);
    if (result === false) {
      flash("Invalid username or password", "danger");
    } else if (result === true) {
      let next = '/';

      if (location.state && location.state.next) {
        next = location.state.next;
      }

      navigate(next);
    }

    console.log(`You entered ${username}:${password}`);
  };

  return (
    <Body>
      <h1>Login</h1>
      <Form onSubmit={onSubmit}>
        <InputField name="username" label="Username or email address" error={formErrors.username || ""} fieldRef={usernameField} />
        <InputField name="password" label="Password" type="password" error={formErrors.password || ""} fieldRef={passwordField} />
        <Button variant="primary" type="submit">Login</Button>
      </Form>
      <hr />
      <p>Forgot your password? You can <Link to="/reset-request">reset it</Link>.</p>
      <p>Don&apos;t have an account? <Link to="/register">Register here</Link>!</p>
    </Body>
  );
};

export default LoginPage;