import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

interface OTPComponentProps {
  onSubmit: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  imageSrc: string;
  heading?: string;
  otpLength?: number;
  timerDuration?: number;
}

const OTPComponent: React.FC<OTPComponentProps> = ({
  onSubmit,
  onResend,
  imageSrc,
  heading = "Enter OTP",
  otpLength = 4,
  timerDuration = 60
}) => {
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    await onSubmit(otpCode);
  };

  useEffect(() => {
    if (timeLeft === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const resetTimer = async () => {
    setTimeLeft(timerDuration);
    await onResend();
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100">
    <ToastContainer/>
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full mx-4">
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-indigo-50">
          <img src={imageSrc} alt="OTP Illustration" className="max-w-full h-auto" />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">{heading}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el!)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
            <div className="text-center">
              {timeLeft > 0 ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-indigo-600 font-medium">Resend OTP in {timeLeft}s</span>
                </div>
              ) : (
                <button
                  onClick={resetTimer}
                  className="text-indigo-600 hover:text-indigo-800 underline focus:outline-none font-medium"
                  type="button"
                >
                  Resend OTP
                </button>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPComponent;