import React, { useContext } from 'react';
import Alert from 'react-bootstrap/Alert';
import Collapse from 'react-bootstrap/Collapse';

import { FlashProviderContext } from '../contexts/FlashProvider';


const FlashMessage = () => {
  const contextValue = useContext(FlashProviderContext);

  if (!contextValue) {
    // Handle the case where the context value is undefined
    return null; // You can return null or any other fallback UI
  }

  const { flashMessage, visible, hideFlash } = contextValue

  return (
    <Collapse in={visible}>
      <div>
        <Alert variant={flashMessage.type || 'info'} dismissible onClose={hideFlash} data-visible={visible}>
          {flashMessage.message}
        </Alert>
      </div>
    </Collapse>
  );
};

export default FlashMessage;