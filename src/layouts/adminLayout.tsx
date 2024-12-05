import React from 'react';
import { useLocation } from 'react-router-dom';
import Sider from '../components/adminSide/Sider';
import AdminHead from '../components/adminSide/adminHeader';

// Admin Layout Component
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Define routes where the header and sider should be hidden
  const hideHeaderAndSider = ['/admin/login']; 
  const shouldShowHeaderAndSider = !hideHeaderAndSider.includes(location.pathname);

  return (
    <div className="flex h-screen">
      {/* Render Sider only if it should be shown */}
      {shouldShowHeaderAndSider && <Sider />}
      <div className={`flex-1 flex flex-col overflow-hidden ${!shouldShowHeaderAndSider ? 'w-full' : ''}`}>
        {/* Render Admin Header only if it should be shown */}
        {shouldShowHeaderAndSider && <AdminHead />}
        <div className={`flex-1 overflow-auto ${shouldShowHeaderAndSider ? 'p-4' : ''}`}>
          {/* Render child components */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
