import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginDoctorSuccess, logoutDoctor } from '../../slices/doctorSlice';
import ReusableLogin from '../../components/reusable/ReusableLogin';
import { toast } from 'react-toastify';
import { doctorLogin } from '../../services/doctorServices';

const DocLogin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    try {
        const response = await doctorLogin(email, password);
        console.log("Response:", response);

        if (response.status === 201) {
            const { id, name, specialization, refreshToken, accessToken, isBlocked } = response.data;
            const localBlock=localStorage.getItem('isBlocked')=='true';

            if (isBlocked==true || localBlock==true) {
                // Dispatch logout action and show error message for blocked account
                dispatch(logoutDoctor());
                toast.error('Your account is blocked. Please contact support.');
                return;
            }

            const doctor = {
                docId: id,
                name,
                email,
                specialization,
            };

            // Dispatch login success action with doctor info and tokens
            dispatch(
                loginDoctorSuccess({
                    doctorInfo: doctor,
                    accessToken,
                    refreshToken,
                    isBlocked,
                })
            );

            toast.success('Logged in successfully!');
            navigate('/doctor/approval');
        } else if (response.status === 400) {
            toast.error('Invalid credentials, please try again.');
        }
    } catch (error) {
        console.error('Login Error:', error);
        toast.error('An error occurred during login, please try again.');
    }
};

  

  return (
    <ReusableLogin
      onSubmit={handleSubmit}
      imageSrc="/pictures/login-logo.jpg"
      title="Login as Doctor"
      signUpLink="/doctor/signup"
      forgotPasswordLink="#"
    />
  );
};

export default DocLogin;
