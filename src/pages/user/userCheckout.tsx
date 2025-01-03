   
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../reduxStore/store';
import axiosInstance from '@/utils/axiosClient';

    const UserCheckout = () => {
        const location=useLocation()
        const patient=location.state.patientName;
        const totalAmount=location.state.amount;
        const appointmentId=location.state.appointmentId;
        const userId=useSelector((state:RootState)=>state.auth?.user?._id)
        
        console.log("patientName",patient)
    const [, setPatientName] = useState('');
    
    const [isNameValid, setIsNameValid] = useState(true);


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPatientName(e.target.value);
        
        if (e.target.value.length > 0) {
        setIsNameValid(true);
        }
    };

    const handleCheckout = async (event: React.FormEvent) => {
            event.preventDefault();
        
            try {
             
                const amount =totalAmount; 
                const currency = 'inr';
        
                
                const response = await axiosInstance.post('/appointment/payment', {
                    amount,
                    currency,
                    appointmentId,
                    userId
                });
                 
                const { url } = response.data; 
              
                
        
               
                window.location.href = url
            } catch (error) {
                console.error('Error processing payment:', error);
            }
        };

    return (
        <div className="max-w-3xl mx-auto mt-36 p-6">
        <div className="bg-white  rounded-3xl shadow-lg p-8 border border-blue-100">
            <div className="flex justify-between">
            {/* Left Section */}
            <div className="space-y-6 flex-1">
                <div>
                <h1 className="text-2xl font-bold mb-1">Confirm & Pay</h1>
                <div className="flex items-center text-sm">
                    <span>verified doctors online now</span>
                    <span className="ml-2 text-green-500">✓</span>
                </div>
                </div>

                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Patient Name</label>
                    <input
                    type="text"
                    value={patient}
                    onChange={handleNameChange}
                    placeholder="Nifii"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isNameValid ? 'border-red-500' : ''}`}
                    />
                    {!isNameValid && <p className="text-red-500 text-xs mt-1">Patient name is required.</p>}
                </div>

                

                <div className="flex items-center space-x-2 mt-11">
                    <span className="text-lg">₹</span>
                    <span className="font-medium">{totalAmount} only/-</span>
                </div>

                <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    Continue to payment
                </button>
                </div>
            </div>

            {/* Right Section */}
            <div className="ml-8 flex-1">
                <div className="flex items-center justify-center mb-4">
                <div>
                    <img src="/pictures/user-checkout.jpg" alt="User Checkout" />
                </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-4">3X more affordable</h2>
                <p className="text-gray-600 text-center">
                Get affordable healthcare online, with fees upto 3 times lesser than in clinic fees.
                </p>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default UserCheckout;
