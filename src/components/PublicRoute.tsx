import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserProviderContext } from '../contexts/UserProvider';



interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user } = useUserProviderContext();

  if (user === undefined) {
    return null;
  }
  else if (user) {
    return <Navigate to="/" />
  }
  else {
    return children;
  }
};

export default PublicRoute;