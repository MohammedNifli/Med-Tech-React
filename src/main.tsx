import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ChakraProvider } from '@chakra-ui/react';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { store } from './reduxStore/store.tsx';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Access the Google Client ID from environment variables
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
console.log(googleClientId);

// Load your Stripe publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string); // Replace with your Stripe key

// Render the app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <GoogleOAuthProvider clientId={googleClientId}>
          <Provider store={store}>
            <Elements stripe={stripePromise}>
              <App />
            </Elements>
          </Provider>
        </GoogleOAuthProvider>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>
);
