import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxStore/store';

interface IsAuthenticatedRouteProps {
  children: React.ReactNode;
}

const IsAuthenticatedRoute: React.FC<IsAuthenticatedRouteProps> = ({ children }) => {
  console.log('>>>>>>>>')
  const user = useSelector((state: RootState) => state.doctor.doctorInfo);
  const isAuthenticated=useSelector((state:RootState)=>state.doctor.isAuthenticated)


  console.log('User:', user);
  console.log('Is Authenticated:', isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/doctor/approval" replace />;
  }

  return <>{children}</>;
};


export default IsAuthenticatedRoute;
