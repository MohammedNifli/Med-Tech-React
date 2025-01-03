// Doctor components
import React from 'react';
import DocLogin from '../pages/doctor/docLogin';
import DoctorSignup from '../pages/doctor/doctorSignUp';
import ApplyApproval from '../pages/doctor/applyStatus';
import Application from '../pages/doctor/Application';
import Slot from '../pages/doctor/Slot';
import DoctorOTPPage from '../pages/doctor/docOtp';
import IsAuthenticatedRoute from '../components/doctor/IsDoctorAuthenticated';
import Chat from '../pages/user/ChatPage'
import AppointmentList from '../pages/doctor/appointmentList';
import Dashboard from '../pages/doctor/Dashboard';
import DoctorWallet from '../pages/doctor/doctorWallet';
import DoctorHomePage from '../pages/doctor/doctorHomePage';

interface RouteConfig {
    path: string; 
    element: React.ReactElement; 
    private?: boolean; 
    allowedRoles?:string[];
}

// Doctor Routes configuration
const doctorRoutes: RouteConfig[] = [
    { path: '/doctor/login', element: <IsAuthenticatedRoute><DocLogin /></IsAuthenticatedRoute>, private: false,allowedRoles:['doctor'] }, 
    { path: '/doctor/signup', element: <DoctorSignup /> , private: false,allowedRoles:['doctor'] }, 
    { path: '/doctor/approval', element: <ApplyApproval />, private: true,allowedRoles:['doctor'] }, 
    { path: '/doctor/apply', element: <Application />, private: true,allowedRoles:['doctor'] }, 
    { path: '/doctor/slot', element: <Slot />, private: true,allowedRoles:['doctor'] }, 
    { path: '/doctor/otp', element: <DoctorOTPPage />, private: false,allowedRoles:['doctor'] } ,
    { path: '/doctor/chat', element: <Chat />, private: false},
    { path: '/doctor/appointments', element: <AppointmentList/>, private: false},
    { path: '/doctor/dashboard', element: <Dashboard/>, private: false},
    { path: '/doctor/wallet', element: <DoctorWallet/>, private: false},
    { path: '/doctor/home', element: <DoctorHomePage/>, private: false,allowedRoles:['doctor']}

];

export default doctorRoutes; 
