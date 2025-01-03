
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserLayout from './layouts/userLayout';
import DoctorLayout from './layouts/doctorLayout';
import AdminLayout from './layouts/adminLayout';
import userRoutes from './routes/userRoutes';
import doctorRoutes from './routes/doctorRoutes';
import adminRoutes from './routes/adminRoute';
import PrivateRoute from './components/user/privateRoute'; 
import DocPrivateRoute from './components/doctor/doctorPrivateRoute';
// import IsAuthenticatedRoute from '../src/components/IsAuthenticatedRoute';
import UserLogin from './pages/user/Login';  // Import User Login Component
import DoctorLogin from './pages/doctor/docLogin'; // Import Doctor Login Component
import AdminLogin from './pages/adminPages/AdminLogin'; // Import Admin Login Component





// Helper function to render routes dynamically
// Helper function to render routes dynamically
const renderRoutes = <T extends { path: string; element: React.ReactNode; private?: boolean; allowedRoles?: string[] }>(
  routes: T[],
  Layout: React.ComponentType<{ children: React.ReactNode }>
) => {
  return routes.map(({ path, element, private: isPrivate, allowedRoles }) => (
    <Route
      key={path}
      path={path}
      element={
        isPrivate ? (
          allowedRoles?.includes('doctor') ? ( // Check if the allowedRoles includes 'doctor'
            <DocPrivateRoute>
              <Layout>{element}</Layout>
            </DocPrivateRoute>
          ) : (
            <PrivateRoute allowedRoles={allowedRoles}>
              <Layout>{element}</Layout>
            </PrivateRoute>
          )
        ) : (
          <Layout>{element}</Layout>
        )
      }
    />
  ));
};


const App: React.FC = () => (
  <Routes>
    {/* User Routes */}
    {renderRoutes(userRoutes, UserLayout)}

    {/* Doctor Routes */}
    {renderRoutes(doctorRoutes, DoctorLayout)} {/* Pass DocPrivateRoute for private doctor routes */}

    {/* Admin Routes */}
    {renderRoutes(adminRoutes, AdminLayout)}

    {/* Protect User Login Route */}
    <Route
      path="/login"
      element={
          <UserLogin />    
      }
    />

    {/* Protect Doctor Login Route */}
    <Route
      path="/doctor/login"
      element={
        
          <DoctorLogin />
        
      }
    />

    {/* Protect Admin Login Route */}
    <Route
      path="/admin/login"
      element={
        
          <AdminLogin />
       
      }
    />

    {/* 404 Route */}
    <Route path="*" element={<UserLayout><div>404 - Not Found</div></UserLayout>} />
  </Routes>
);

export default App;
