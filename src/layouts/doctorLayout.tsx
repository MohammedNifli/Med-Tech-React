import React from 'react';
import { useLocation } from 'react-router-dom';
import SideComponent from '../components/doctorSide/sideComponent';
import DocHeader from '../components/doctorSide/Header';

// Doctor Layout Component
const DoctorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Get the current location to determine which route is active
    const location = useLocation();

    // Define routes where the sidebar should not be shown
    const hideSidebarRoutes = ['/doctor/login', '/doctor/signup', '/doctor/otp','/doctor/chat','/doctor/home'];
    
    // Determine whether to show the sidebar based on the current route
    const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Fixed header at the top */}
            <DocHeader onMenuClick={()=>{}}/>

            <div className={`flex flex-1 pt-16  ${!shouldShowSidebar ? 'justify-center' : ''}`}>
                {/* Render the sidebar if it should be shown */}
                {shouldShowSidebar && <SideComponent />}
                
                <main className="flex-1 p-4">
                    {/* Adjust margins based on whether the sidebar is visible */}
                    <div className={`mt-4  ${shouldShowSidebar ? '' : ''}`}>
                        {children} {/* Render the child components here */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;
