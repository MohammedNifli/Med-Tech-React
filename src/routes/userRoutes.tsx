// User components
import React from 'react';
import Home from '../pages/user/Home';
import Signup from '../pages/user/Signup';
import Login from '../pages/user/Login';
import UserOTPPage from '../pages/user/Otp';
import Search from '../pages/user/Search';
import Profile from '../components/userProfile';
import Docdetails from '../pages/user/Docdetails';
import IsAuthenticatedRoute from '../components/IsAuthenticatedRoute';
import PateintDetails from '../pages/user/patientDetails';
import Consult from '../pages/user/consult';
import UserCheckout from '../pages/user/userCheckout';
import PaymentSuccessfulPage from '../pages/user/paymentSuccesfulPage';
import PaymentFailurePage from '../pages/user/paymentFailiurePage';
import VideoCall from '../pages/user/videoCall';
import RoomPage from '../pages/user/roomPage';
import ApointmentList from '../pages/user/appointmentList';
import OnlineConsultations from '../pages/user/OnlineConsultations';
import PaymentList from '../pages/user/paymentPage'
import OfflineConsultation from '../pages/user/OfflineConsultation';
import ChatPage from '../pages/user/ChatPage';
import BookingPage from '../pages/user/BookingPage';
// import CheckoutForm from '../checkout';
// import PaymentPage from '../pages/user/paymentPage';
// Define a TypeScript interface for route configurations
interface RouteConfig {
    path: string; // The URL path for the route
    element: React.ReactElement; // The component to render for this route
    private?: boolean; // Optional boolean to indicate if the route is private
    allowedRoles?: string[];
}

// User Routes configuration
const userRoutes: RouteConfig[] = [
  { path: '/', element: <Home />, private: true, allowedRoles: ['user'] }, // Accessible by users and admins
  { path: '/signup', element: <IsAuthenticatedRoute><Signup /></IsAuthenticatedRoute> ,allowedRoles: ['user']}, // Public route for Signup
  { path: '/login', element: <IsAuthenticatedRoute><Login /></IsAuthenticatedRoute>,allowedRoles: ['user'] }, // Public route for Login
  { path: '/otp', element: <UserOTPPage /> }, // Public route for OTP verification
  { path: '/search', element: <Search />, private: true, allowedRoles: ['user'] }, // Private route for users only
  { path: '/profile', element: <Profile />, private: true, allowedRoles: ['user'] }, // Private route for user profile
  { path: '/pro-view', element: <Docdetails />, private: true, allowedRoles: ['user'] }, // Accessible by users and admins
  { path: '/consult', element: <Consult/> , allowedRoles: ['user'] },
  { path: '/patient', element: <PateintDetails/> , allowedRoles: ['user'] },
  { path: '/checkout', element: <UserCheckout/> , allowedRoles: ['user'] },
  { path: '/success', element: <PaymentSuccessfulPage/> , allowedRoles: ['user'] },
  { path: '/cancel', element: <PaymentFailurePage/> , allowedRoles: ['user'] },
  { path: '/video', element: <VideoCall/> , allowedRoles: ['user'] },
  { path: '/room/:roomId', element: <RoomPage/> , allowedRoles: ['user'] },
  { path: '/appointments', element: <ApointmentList/> , allowedRoles: ['user'] },
  { path: '/online-consultations', element: <OnlineConsultations/> , allowedRoles: ['user'] },
  { path: '/payment-list', element: <PaymentList/> , allowedRoles: ['user'] },
  { path: '/offline-consultations', element: <OfflineConsultation/> , allowedRoles: ['user'] },
  { path: '/chat', element: <ChatPage/> , allowedRoles: ['user'] },
  { path: '/book/:id', element: <BookingPage/> ,private:true, allowedRoles: ['user'] },

];

export default userRoutes;
