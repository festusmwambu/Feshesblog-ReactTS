import React, { ReactNode } from 'react';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';

import Sidebar from './Sidebar';
import FlashMessage from './FlashMessage';



interface BodyProps {
  sidebar?: boolean;
  children?: ReactNode;
}

const Body = ({ sidebar, children }: BodyProps) => {
  return (
    <Container>
      <Stack direction="horizontal" className="Body">
        {sidebar && <Sidebar />}
        <Container className="Content">
          <FlashMessage />
          {children}
        </Container>
      </Stack>
    </Container>
  );
};

export default Body;