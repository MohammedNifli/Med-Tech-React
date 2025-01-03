// PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxStore/store'; // Adjust the import according to your file structure

const PrivateRoute: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.doctor.isAuthenticated); // Check if doctor is authenticated

  return isAuthenticated ? <Outlet /> : <Navigate to="/doctor/login" />; // Render Outlet or redirect to login
};

export default PrivateRoute;
