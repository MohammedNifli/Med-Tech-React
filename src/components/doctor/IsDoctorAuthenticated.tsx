import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxStore/store';

interface IsAuthenticatedRouteProps {
  children: React.ReactNode;
}

const IsAuthenticatedRoute: React.FC<IsAuthenticatedRouteProps> = ({ children }) => {

  const user = useSelector((state: RootState) => state.doctor.doctorInfo);
  const isAuthenticated=useSelector((state:RootState)=>state.doctor.isAuthenticated)


  console.log('User:', user);


  if (isAuthenticated) {
    return <Navigate to="/doctor/home" replace />;
  }

  return <>{children}</>;
};


export default IsAuthenticatedRoute;
