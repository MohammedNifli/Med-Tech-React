import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin, GoogleCredentialResponse } from '@react-oauth/google';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnyAction } from '@reduxjs/toolkit';

// Type imports
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../reduxStore/store';
import {  setTokens } from '../../slices/authSlice';

// Service imports
import { loginUser } from '../../services/userServices';
import axiosInstance from '@/utils/axiosClient';

// Type Definitions
interface FormErrors {
  email?: string;
  password?: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  status: number;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      isBlocked: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

interface GoogleOAuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
  message: string;
}







const Login: React.FC = () => {
  // Typed dispatch and navigate
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const navigate = useNavigate();

  // State with explicit types
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Standard Login Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response: LoginResponse = await loginUser({ email, password });

      if (response.status === 200) {
        const { user, accessToken, refreshToken } = response.data;

        if (user.isBlocked) {
          toast.error('Your account is blocked. Please contact support.');
          setIsSubmitting(false);
          return;
        }

        const userData: UserData = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: 'user'
        };

        dispatch(
          setTokens({
            userData,
            accessToken,
            refreshToken,
            isBlocked: user.isBlocked,
          })
        );

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error('Invalid credentials!');
      }
    } catch (error: unknown) {
      console.error('Login Error:', error instanceof Error ? error.message : error);
      toast.error('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth Success Handler
  const handleGoogleSuccess = async (response: GoogleCredentialResponse): Promise<void> => {
    try {
      const res = await axiosInstance.post<GoogleOAuthResponse>('/user/auth/google', {
        token: response.credential,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (res.status < 200 || res.status >= 300) {
        throw new Error('Network response was not ok');
      }
  
      const data = res.data;
  
      const userData: UserData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: 'user',
      };
  
      dispatch(
        setTokens({
          userData,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isBlocked: false,
        })
      );
  
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
  
      toast.success(data.message);
      navigate('/');
    } catch (error: unknown) {
      console.error('Error during Google OAuth:', error instanceof Error ? error.message : error);
      toast.error('An error occurred with Google login');
    }
  };
  


  const handleGoogleFailure = (): void => {
    toast.error('Google login failed');
  };

  return (
    <div className='flex items-center justify-center bg-white w-full min-h-screen p-4 mt-2'>
      <div className='w-full max-w-5xl bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col md:flex-row'>
        {/* Image Section */}
        <div className='w-full md:w-1/2 p-4 flex items-center justify-center'>
          <img
            src="/pictures/user-login.jpg"
            alt="Login"
            className='max-w-full max-h-64 md:max-h-full object-contain'
          />
        </div>

        {/* Login Form Section */}
        <div className='w-full md:w-1/2 p-6 md:p-10'>
          <h1 className='text-center font-bold text-2xl text-gray-600 mb-6'>Login as User</h1>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-gray-700 font-medium mb-2'>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: undefined }));
                }}
                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder='Enter your email'
              />
              {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
            </div>

            <div>
              <label className='block text-gray-700 font-medium mb-2'>Password</label>
              <div className='relative'>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder='Enter your password'
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
              <div className='text-right mt-2'>
                <a href="#" className='text-sm text-blue-500 hover:underline'>Forgot Password?</a>
              </div>
            </div>

            <button 
              type='submit' 
              className='w-full bg-blue-900 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition duration-300'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Google OAuth Button */}
          <div className='mt-4 flex justify-center'>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </div>

          <div className='text-center mt-6'>
            <p className='text-sm text-gray-700'>
              Don&apos;t Have An Account? 
              <a href="/signup" className='text-blue-500 font-semibold hover:underline'> Sign Up</a>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;