import React from 'react';
import { CheckCircleIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessfulPage: React.FC = () => {
  const navigate=useNavigate()

  const handelViewappointments=async()=>{
    navigate('/appointments')

  }
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-3xl">
        <div className="flex items-center justify-center mb-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mr-4" />
          <h2 className="text-3xl font-bold">Payment Successful</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-xl font-medium mb-4">Thank you for your purchase!</p>
            <p className="text-gray-600 mb-8">
              Your payment was processed successfully. We've sent a confirmation email with the details of your order.
            </p>
            <div className="flex justify-end">
              <button onClick={handelViewappointments} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mr-2">
                View Appointments
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded">
                Return to Home
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img src="/pictures/pay-success.jpg" alt="Payment successful illustration" className="w-full max-w-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessfulPage;