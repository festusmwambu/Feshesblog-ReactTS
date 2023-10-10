import React from 'react';
import Body from '../components/Body';
import Posts from '../components/Posts';

const FeedPage = () => {
  return (
    <Body sidebar>
      <Posts write={true} />
    </Body>
  );
};

export default FeedPage;