import React, { ReactNode } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useUserProviderContext } from '../contexts/UserProvider';



interface PrivateRouteProps {
  children: ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useUserProviderContext();
  const location = useLocation();

  if (user === undefined) {
    return null;
  }
  else if (user) {
    return children;
  }
  else {
    const url = location.pathname + location.search + location.hash;
    return <Navigate to="/login" state={{next: url}} />
  }
};

export default PrivateRoute;