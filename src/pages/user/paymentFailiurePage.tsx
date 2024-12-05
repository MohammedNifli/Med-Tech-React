import React from 'react';
import { XCircleIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentFailurePage: React.FC = () => {
  const navigate =useNavigate()
  const handlePayment=async()=>{
    navigate('/payment-list')
  }
  return (
    <div className=" mt-24 flex items-center justify-center min-h-screen px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <XCircleIcon className="h-16 w-16 text-red-500 mr-4" />
          <h2 className="text-3xl font-bold">Payment Failed</h2>
        </div>
        <p className="text-xl font-medium mb-4">Oops, something went wrong.</p>
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Please try your payment again or contact us for assistance.
        </p>
        <div className="flex justify-center mb-8">
          <img src="/pictures/payment-fail.png" alt="Payment failure illustration" className="w-full max-w-xs" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
            Try Again
          </button>
          <button onClick={handlePayment} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded">
            continue Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;