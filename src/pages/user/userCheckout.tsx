    import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../reduxStore/store';

    const UserCheckout = () => {
        const location=useLocation()
        const patient=location.state.patientName;
        const totalAmount=location.state.amount;
        const appointmentId=location.state.appointmentId;
        const userId=useSelector((state:RootState)=>state.auth?.user?._id)
        
        console.log("patientName",patient)
    const [patientName, setPatientName] = useState('');
    // const [couponCode, setCouponCode] = useState('');
    // const [showCouponModal, setShowCouponModal] = useState(false);
    const [isNameValid, setIsNameValid] = useState(true);

    // const handleCouponCodeToggle = () => {
    //     setShowCouponModal(!showCouponModal);
    // };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPatientName(e.target.value);
        // Simple validation (could be extended further)
        if (e.target.value.length > 0) {
        setIsNameValid(true);
        }
    };

    // const handleCheckout = () => {
    //     if (patientName.length === 0) {
    //     setIsNameValid(false);
    //     return;
    //     }
    //     // Proceed to payment logic
    //     console.log("Proceeding to payment with patient:", patientName);
    // };

    const handleCheckout = async (event: React.FormEvent) => {
            event.preventDefault();
        
            try {
                // Define the amount (in paise) and currency
                const amount =totalAmount; // 6000Amount in paise (e.g., 5000 for INR 50.00)
                const currency = 'inr';
        
                // Call your backend to create a payment session
                const response = await axios.post('http://localhost:4444/appointment/payment', {
                    amount,
                    currency,
                    appointmentId,
                    userId
                });
                 
                const { url } = response.data; // Get the URL from the response
                console.log(response)
                console.log("Redirecting to Stripe Checkout:", url);
        
                // Redirect to the Stripe Checkout session
                window.location.href = url; // Redirect to the Stripe Checkout page
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

                {/* <div>
                    <button onClick={handleCouponCodeToggle} className="text-blue-500 text-sm hover:underline">
                    Have a coupon code?
                    </button>
                    {showCouponModal && (
                    <div className="mt-4">
                        <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    )}
                </div> */}

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
