import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../reduxStore/store';
import {logout} from '../slices/authSlice'

interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const dispatch=useDispatch()

    const user = useSelector((state: RootState) => state.auth.user);
    const isAuthenticated = !!user; 
    const hasAccess = allowedRoles ? allowedRoles.includes(user?.role ?? '') : true; 
    const isBlocked = localStorage.getItem('isBlocked') === 'true'; // Correctly retrieving isBlocked

    // console.log('User:', user);
    // console.log('isAuthenticated:', isAuthenticated);
    // console.log('hasAccess:', hasAccess);
    // console.log('isBlocked:', isBlocked);

    if (!isAuthenticated || !hasAccess || isBlocked) {
      dispatch(logout())
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
  
export default PrivateRoute;
