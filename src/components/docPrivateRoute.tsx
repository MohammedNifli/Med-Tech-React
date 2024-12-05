import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reduxStore/store'; // Adjust the import path as needed
import { logoutDoctor } from '../slices/doctorSlice';

interface DocPrivateRouteProps {
    children: React.ReactNode;
}

const DocPrivateRoute: React.FC<DocPrivateRouteProps> = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, isBlocked } = useSelector((state: RootState) => state.doctor);

    // Check if `isBlocked` is true either in Redux state or `localStorage`
    const isBlockedInStorage = localStorage.getItem('isBlocked') === 'true';
    console.log("isBlocked",isBlockedInStorage)

    useEffect(() => {
        if (!isAuthenticated || isBlocked || isBlockedInStorage) {
            dispatch(logoutDoctor());
        }
    }, [isAuthenticated, isBlocked, isBlockedInStorage, dispatch]);

    // Redirect if unauthenticated or blocked
    if (!isAuthenticated || isBlocked || isBlockedInStorage) {
        return <Navigate to="/doctor/login" replace />;
    }

    return <>{children}</>;
};

export default DocPrivateRoute;
