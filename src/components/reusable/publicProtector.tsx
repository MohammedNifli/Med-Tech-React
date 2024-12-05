// src/components/PrivateRoute.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reduxStore/store'; // Adjust based on your store file location

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  dispatch({ type: 'AUTHENTICATION_CHECK' });
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  console.log('middle ware invoked :',isAuthenticated)


return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
