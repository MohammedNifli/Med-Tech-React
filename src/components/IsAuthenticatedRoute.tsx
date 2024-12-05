import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxStore/store';

interface IsAuthenticatedRouteProps {
  children: React.ReactNode;
}

const IsAuthenticatedRoute: React.FC<IsAuthenticatedRouteProps> = ({ children }) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  console.log('User:', user);
  console.log('Is Authenticated:', isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};


export default IsAuthenticatedRoute;
