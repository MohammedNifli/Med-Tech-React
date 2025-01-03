import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { loginAdminSuccess } from '../../slices/adminSlice';
import ReusableLogin from '../../components/reusable/ReusableLogin';
import { toast } from 'react-toastify'
import { adminLogin } from '../../services/adminServices';

const AdminLogin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    try {
      console.log(email, password); 

      const response = await adminLogin(email,password)
      console.log(response)
 
      if (response.status === 200) {
        // Extract accessToken, refreshToken, and admin details
        const { accesToken: accessToken,_id,name,email } = response.data.data;
        

        // Ensure the tokens and admin data exist before proceeding
        if (!accessToken || !_id || !name ) {
          throw new Error('Invalid response from server');
        }

        // Prepare the admin info object
        const admin = {
          id: _id,
          name,
          email,
        };

        // Dispatch Redux action to update state
        dispatch(
          loginAdminSuccess({
              adminInfo: admin,
              token: accessToken,
          })
      );
      

        // Display success toast message and navigate to admin page
        toast.success('Logged in successfully!');
        navigate('/admin/users');
      } else if (response.status === 400) {
        toast.error('Invalid credentials, please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred, please try again.');
    }
};


  return (
    <ReusableLogin
      onSubmit={handleSubmit}
      imageSrc="/pictures/Admin-amico.png"
      title="Login as Admin"
      signUpLink=""
      forgotPasswordLink="#"
    />
  );
};

export default AdminLogin;