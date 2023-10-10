import React, { useState, useEffect, useRef, FormEvent } from 'react';
import Stack from "react-bootstrap/Stack";
import Image from "react-bootstrap/Image";
import Form from 'react-bootstrap/Form';

import { useAPIProviderContext } from '../contexts/APIProvider';
import { useUserProviderContext } from '../contexts/UserProvider';
import InputField from './InputField';
import { PostData } from './Posts';



interface WriteProps {
  showPost: (post: PostData) => void;
}

const Write = ({ showPost }: WriteProps) => {
  const [formErrors, setFormErrors] = useState<{ text?: string }>({});
  const textField = useRef<HTMLInputElement | null>(null);
  const api = useAPIProviderContext();
  const { user } = useUserProviderContext();

  useEffect(() => {
    if (textField.current) {
      textField.current.focus();
    }
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (textField.current) {
      const response = await api.post("/posts", {
        text: textField.current.value
      });

      if (response.ok) {
        showPost(response.body);
        textField.current.value = '';
      } else {
        if (response.body.errors) {
          setFormErrors(response.body.errors.json);
        }
      }
    }
  };

  return (
    <Stack direction="horizontal" gap={3} className="Write">
      <Image src={user?.avatar_url + '&s=64'} roundedCircle />
      <Form onSubmit={onSubmit}>
        <InputField name="text" placeholder="What's on your mind?" error={formErrors.text || ""} fieldRef={textField} />
      </Form>
    </Stack>
  );
};

export default Write;