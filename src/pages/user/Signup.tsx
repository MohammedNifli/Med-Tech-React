import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  GoogleCredentialResponse } from '@react-oauth/google';

// Service imports
import { userSignUp } from '../../services/userServices';

// Type Definitions
interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}

interface SignupResponse {
  status: number;
  data: {
    user?: {
      _id: string;
    };
    message?: string;
  };
}

const Signup: React.FC = () => {
  const navigate = useNavigate();

  // Typed state management
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Validation Function
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Change Handler with Typed Event
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ 
      ...prevData, 
      [name]: value 
    }));

    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  // Google OAuth Success Handler
  const handleGoogleSuccess = async (response: GoogleCredentialResponse): Promise<void> => {
    try {
      const res = await fetch('http://localhost:4444/user/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });
      
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await res.json();
      
      toast.success(data.message);
      navigate('/');
    } catch (error: unknown) {
      console.error('Error during Google OAuth:', error instanceof Error ? error.message : error);
      toast.error('An error occurred with Google signup');
    }
  };

  console.log('handleGoogleSuccess',handleGoogleSuccess)

  // Google OAuth Failure Handler
  const handleGoogleFailure = (): void => {
    toast.error('Google signup failed');
  };
  console.log('handleGoogleFailure',handleGoogleFailure)

  // Submit Handler
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response: SignupResponse = await userSignUp(formData);
       
      if (response.status === 201) {
        toast.success('Signup successful! Sending OTP...');
        
        // Send OTP
        const otpResponse = await axios.post('https://med-tech.site:4444/otp/send', { 
          email: formData.email 
        });

        console.log('otper',otpResponse)

        // Create Wallet
        const userId = response.data.user?._id;
        if (userId) {
          const walletResponse = await axios.post(
            `https://med-tech.site:4444/wallet/create?id=${userId}`
          );

          if (walletResponse.status === 201) {
            console.log('Wallet created successfully');
          }
        }

        // Navigate to OTP verification
        navigate('/otp', { 
          state: { 
            email: formData.email 
          } 
        });
      } else {
        toast.error(`Signup failed: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error: unknown) {
      console.error('Error during signup:', error);
      
      if (axios.isAxiosError(error)) {
        // Handle Axios specific errors
        toast.error(error.response?.data?.message || 'An error occurred during signup');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-2 sm:p-4 md:p-6 mt-12">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Image */}
          <div className="w-full lg:w-1/2 p-4 lg:p-8 flex items-center justify-center">
            <img
              src="/pictures/user-signup.jpg"
              alt="User Sign Up"
              className="w-full h-48 sm:h-64 md:h-80 lg:h-full object-cover lg:object-contain"
            />
          </div>

          {/* Right side - Sign Up Form */}
          <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 mb-2 text-center lg:text-left">
              User&apos;s Sign up
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 text-center lg:text-left">
              Hey, enter your details to create your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Enter your name"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                />
                {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Enter your email"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                />
                {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  onChange={handleChange}
                  value={formData.phone}
                  placeholder="Enter your phone"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                />
                {errors.phone && <div className="text-red-600 text-sm">{errors.phone}</div>}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    placeholder="Password"
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <div className="text-red-600 text-sm">{errors.password}</div>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base lg:text-lg font-semibold hover:bg-blue-800 transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center mt-6 text-xs sm:text-sm md:text-base text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-900 font-semibold hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;