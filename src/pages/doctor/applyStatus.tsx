import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxStore/store";
import { useNavigate } from "react-router-dom";
import { doctorApprovalStatus } from "../../services/doctorServices";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

const ApplyApproval: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const doctorAuth = useSelector((state: RootState) => state.doctor);
  const docId: string = doctorAuth.doctorInfo?.docId as string;
  const doctorName = doctorAuth.doctorInfo?.name || "Doctor";

  useEffect(() => {
    const doctorStatus = async () => {
      try {
        const response = await doctorApprovalStatus(docId);
        if (response.status === 200) {
          setStatus(response.data?.fetchDoctorStatus);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaded(true);
      }
    };
    doctorStatus();
  }, [docId]);

  const getStatusIcon = () => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="w-10 h-10 text-green-500 animate-pulse" />;
      case "Pending":
        return <Clock className="w-10 h-10 text-yellow-500 animate-spin-slow" />;
      case "Not Applied":
        return <XCircle className="w-10 h-10 text-red-500 animate-bounce" />;
      default:
        return null;
    }
  };

  const getStatusStyles = () => {
    switch (status) {
      case "Verified":
        return "bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-300 shadow-green-200";
      case "Pending":
        return "bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 border-yellow-300 shadow-yellow-200";
      case "Not Applied":
        return "bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 border-red-300 shadow-red-200";
      default:
        return "bg-gray-50 border-gray-300";
    }
  };

  const handleClick = () => {
    navigate("/doctor/apply");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-indigo-50 p-4 sm:p-10">
      <Card
        className={`max-w-7xl mx-auto backdrop-blur-lg bg-white/90 shadow-2xl transition-all duration-700 ease-in-out transform ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <CardContent className="p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Left Content Section */}
            <div className="flex-1 space-y-6 lg:space-y-10">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-text">
                  Welcome, Dr. {doctorName}!
                </h1>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  Enhance your practice with{" "}
                  <span className="font-semibold text-blue-600">MedTech</span>. Join our platform to provide
                  seamless healthcare solutions and deliver exceptional care to your patients through verified
                  and trusted digital tools.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-xl sm:text-3xl font-bold text-gray-800">Account Status</h2>
                <div
                  className={`flex items-center space-x-4 sm:space-x-6 p-4 sm:p-8 rounded-2xl border transition-all duration-500 shadow-lg ${getStatusStyles()}`}
                >
                  <div className="p-2 sm:p-4 bg-white rounded-full shadow-md">{getStatusIcon()}</div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="font-medium text-gray-600">Current Status</p>
                    <p
                      className={`text-xl sm:text-2xl font-extrabold ${
                        status === "Not Applied"
                          ? "text-red-600"
                          : status === "Pending"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                </div>

                {status === "Not Applied" && (
                  <div className="space-y-4 sm:space-y-8">
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                      Begin your verification process to unlock exclusive features and accept online
                      appointments from patients looking for your expertise.
                    </p>
                    <button
                      onClick={handleClick}
                      className="group w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl
                      hover:from-blue-700 hover:to-blue-900 transform transition-all duration-300 
                      focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-2xl"
                    >
                      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                        <span className="text-sm sm:text-lg font-semibold">Start Verification Process</span>
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-2 transition-transform" />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Image Section */}
            {status !== "Verified" && (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg transform transition-all duration-700 hover:scale-105">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
                    <img
                      src="/pictures/right-wrong.jpg"
                      alt="Verification Required"
                      className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplyApproval;
