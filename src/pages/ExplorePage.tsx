import React from 'react';
import Body from '../components/Body';
import Posts from '../components/Posts';

const ExplorePage = () => {
  return (
    <Body sidebar>
      <Posts content="explore" />
    </Body>
  );
};

export default ExplorePage;