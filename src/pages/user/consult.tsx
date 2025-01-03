import React, { useEffect, useState } from 'react';

// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axiosClient';

interface Patient{
  name:string;
  phone:string;
  email:string
}

const Consult: React.FC = () => {
  const navigate=useNavigate()
  const location=useLocation()
  const appointmentId = location.state?.appointmentId as string;
  console.log("patientId",appointmentId)


  
 const[patientName,setPatientName]=useState('')
  const [patientDetails,setPatientDetails]=useState<Patient |undefined>();
  const [amount,setAmount]=useState(0)

  const [,setPhoneNumber]=useState<string|''>('')
  const [,setEmail]=useState<string|''>('')
  

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     try {
//         // Define the amount (in paise) and currency
//         const amount = 5000; // Amount in paise (e.g., 5000 for INR 50.00)
//         const currency = 'inr';

//         // Call your backend to create a payment session
//         const response = await axios.post('http://localhost:4444/appointment/payment', {
//             amount,
//             currency,
//         });

//         const { url } = response.data; // Get the URL from the response
//         console.log("Redirecting to Stripe Checkout:", url);

//         // Redirect to the Stripe Checkout session
//         window.location.href = url; // Redirect to the Stripe Checkout page
//     } catch (error) {
//         console.error('Error processing payment:', error);
//     }
// };

useEffect(() => {
  // Make sure patientId exists before making the request
  if (appointmentId) {
    axiosInstance
      .get(`/appointment/get-details/?id=${appointmentId}`) // Use dynamic URL here
      .then((response) => {
        console.log(response);
        setPatientDetails(response.data?.patientDetails)
        setPatientName(response?.data?.patientDetails?.name)
        setAmount(response?.data?.amount)
        // Handle your response data, e.g., set state
      })
      .catch((error) => {
        console.error("Error fetching patient details:", error);
      });
  }
}, [appointmentId]); 

const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      navigate('/checkout',{state:{patientName,amount,appointmentId}})
      

}

  return (
    <div className="flex justify-center items-center mt-24 px-4 sm:px-6 lg:px-8">
      <div className="mt-10 mb-10 w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-center text-black text-2xl font-semibold mb-4">Consultation Details</h2>

        {/* Flex container for form and image */}
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Form Section */}
          <div className="w-full md:w-1/2 h-full mb-4 md:mb-0 md:pr-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Patient Name */}
              <div>
                <label className="block text-black text-sm mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientDetails?.name}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-black text-sm mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={patientDetails?.email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-black text-sm mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={patientDetails?.phone}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              {/* Card Element for Stripe */}
             

              {/* Continue Button */}
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 h-full flex justify-center">
            <img 
              src="/pictures/verified.jpg" 
              alt="Consultation" 
              className="w-full max-w-xs md:max-w-sm rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Consult;
