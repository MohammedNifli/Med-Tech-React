// Admin components
import React from 'react';
import UsersDetails from '../pages/adminPages/usersDetails';
import DoctorsDetails from '../pages/adminPages/doctorsDetails';
import AdminLogin from '../pages/adminPages/AdminLogin';
import ViewDoctor from '../pages/adminPages/viewDoctor';
import Dashboard from '../pages/adminPages/dashborads/Dashboard'
import DocDashboard from '@/pages/adminPages/dashborads/docDashboard';
import PatientDashboard from '@/pages/adminPages/dashborads/patientDashboard';
import AppointmentPage from '@/pages/adminPages/AppointmentPage'
import PatientListing from '@/pages/adminPages/patientListing';
import AmountSettingDash from '../pages/adminPages/dashborads/amountSetting'

// Define a TypeScript interface for route configurations
interface RouteConfig {
    path: string; 
    element: React.ReactElement; 
    private?: boolean; 
    allowedRoles?: string[]; 
}

// Admin Routes configuration
const adminRoutes: RouteConfig[] = [
    { path: '/admin/users', element: <UsersDetails />, allowedRoles: ['admin'] }, 
    { path: '/admin/doctors', element: <DoctorsDetails />, allowedRoles: ['admin'] }, 
    { path: '/admin/login', element: <AdminLogin />, allowedRoles: ['admin'] }, 
    { path: '/admin/approval/:id', element: <ViewDoctor />, allowedRoles: ['admin'] } ,
    { path: '/admin/dashboard', element: <Dashboard />, allowedRoles: ['admin'] } ,
    { path: '/admin/doctor/dash', element: <DocDashboard doctors={[]} />, allowedRoles: ['admin'] } ,
    { path: '/admin/patient/dash', element: <PatientDashboard />, allowedRoles: ['admin'] } ,
    { path: '/admin/appointment', element: <AppointmentPage />, allowedRoles: ['admin'] },
    { path: '/admin/patients', element: <PatientListing />, allowedRoles: ['admin'] },
    { path: '/admin/amount', element: <AmountSettingDash />, allowedRoles: ['admin'] }

];

export default adminRoutes; 
