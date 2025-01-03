import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/user/Header';
import Footer from '../components/user/Footer';

// Helper function to check if a route matches a pattern like '/pro-view/:id'
const matchesDynamicRoute = (route: string, path: string) => {
  // If the route is exactly the same, return true
  if (route === path) return true;

  // Convert dynamic routes (e.g., '/pro-view/:id') to regex
  const regex = new RegExp('^' + route.replace(/:\w+/g, '\\w+') + '$');
  return regex.test(path);
};

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Define routes where the footer should be hidden
  const hideFooterRoutes = ['/login', '/signup', '/otp', '/chat', '/pro-view/:id','/book/:id','/premium','/premium-checkout','/user/success','/find','/profile'];

  // Check if the current route matches any route in hideFooterRoutes
  const shouldShowFooter = !hideFooterRoutes.some(route => matchesDynamicRoute(route, location.pathname));

  // Define routes where both header and footer should be hidden
  const hideHeaderAndFooter = ['/chat'];
  const shouldShowHeader = !hideHeaderAndFooter.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
        {shouldShowFooter && <Footer />}
      </div>
    </>
  );
};

export default UserLayout;
