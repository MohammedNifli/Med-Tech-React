import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reduxStore/store'; 
import { logoutDoctor } from '../slices/doctorSlice';

interface DocPrivateRouteProps {
    children: React.ReactNode;
}

const DocPrivateRoute: React.FC<DocPrivateRouteProps> = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, isBlocked } = useSelector((state: RootState) => state.doctor);

    
    const isBlockedInStorage = localStorage.getItem('isBlocked') === 'true';
    console.log("isBlocked",isBlockedInStorage)

    useEffect(() => {
        if (!isAuthenticated || isBlocked || isBlockedInStorage) {
            dispatch(logoutDoctor());
        }
    }, [isAuthenticated, isBlocked, isBlockedInStorage, dispatch]);

   
    if (!isAuthenticated || isBlocked || isBlockedInStorage) {
        return <Navigate to="/doctor/login" replace />;
    }

    return <>{children}</>;
};

export default DocPrivateRoute;
