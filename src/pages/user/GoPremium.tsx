import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoPremium: React.FC = () => {

    const navigate=useNavigate()

    const handleClick=async()=>{
        console.log("hello")
        navigate('/premium-checkout')
    }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl h-auto p-8 bg-white shadow-lg border border-gray-300 rounded-lg flex flex-col md:flex-row items-start">
        {/* Left Section */}
        <div className="p-6 flex-1 md:pr-12">
          <h1 className="text-3xl font-bold text-cyan-600 mb-4 text-center md:text-left">Go Premium with Med-Tech</h1>
          <p className="text-lg font-semibold text-gray-700 mb-6 leading-relaxed text-center md:text-left">
            Unlock the exclusive benefits of our premium plan! Gain access to a
            <strong className="text-blue-600 font-bold"> one-year subscription</strong> that includes advanced features like
            <strong className="text-blue-600 font-bold  "> chatting with doctors</strong> for personalized support and consultations.
          </p>
          <ul className="list-disc font-semibold ml-6 text-gray-700 mb-6 text-center md:text-left">
            <li>Unlimited doctor consultations through chat</li>

            <li>Priority access to premium services</li>
            <li>Great chance for clear your doubts</li>
          </ul>
          <div className="flex justify-center md:justify-start">
            <button onClick={handleClick} className="px-8 py-3 font-bold text-white bg-blue-500 hover:bg-green-600 rounded-lg transition duration-200 text-lg">
              Upgrade to 1-Year Premium Plan for ₹500
            </button>
          </div>
        </div>
        {/* Right Section */}
        <div className="flex-1 p-6 md:pl-12 flex items-center justify-center">
          <img
            src="/pictures/premium.jpg"
            alt="Premium Features"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default GoPremium;