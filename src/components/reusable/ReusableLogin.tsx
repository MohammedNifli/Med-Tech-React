import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  imageSrc: string;
  title: string;
  signUpLink: string;
  forgotPasswordLink?: string;
}

const ReusableLogin: React.FC<LoginProps> = ({
  onSubmit,
  imageSrc,
  title,
  signUpLink,
  forgotPasswordLink,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

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
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      await onSubmit(email, password);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred, please try again.');
    }
  };

  return (
    <div className='flex items-center justify-center bg-white w-full min-h-screen p-4'>
      <div className='w-full max-w-5xl bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col md:flex-row'>
        {/* Image Section */}
        <div className='w-full md:w-1/2 p-4 flex items-center justify-center'>
          <img
            src={imageSrc}
            alt="Login"
            className='max-w-full max-h-64 md:max-h-full object-contain'
          />
        </div>

        {/* Login Form Section */}
        <div className='w-full md:w-1/2 p-6 md:p-10'>
          <h1 className='text-center font-arial font-bold text-2xl text-gray-600 mb-6'>{title}</h1>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-gray-700 font-medium mb-2'>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: undefined }); // Clear error on change
                }}
                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder='Enter your email'
              />
              {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
            </div>

            <div>
              <label className='block text-gray-700 font-medium mb-2'>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: undefined }); // Clear error on change
                }}
                className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder='Enter your password'
              />
              {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
              {forgotPasswordLink && (
                <div className='text-right mt-2'>
                  <a href={forgotPasswordLink} className='text-sm text-blue-500 hover:underline'>Forgot Password?</a>
                </div>
              )}
            </div>

            <button type='submit' className='w-full bg-blue-900 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition duration-300'>
              Login
            </button>
          </form>

          <div className='text-center mt-6'>
            <p className='text-sm text-gray-700'>Don&apos;t Have Any Account Yet? 
              <a href={signUpLink} className='text-blue-500 font-semibold hover:underline'> Sign Up</a>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ReusableLogin;
