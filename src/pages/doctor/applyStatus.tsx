// import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxStore/store";
import { Navigate, useNavigate } from "react-router-dom";
import { doctorApprovalStatus } from "../../services/doctorServices";

const ApplyApproval: React.FC = () => {
  const navigate=useNavigate()
  const [status, setStatus] = useState("");
  const doctorAuth = useSelector((state: RootState) => state.doctor);
  const docId:string = doctorAuth.doctorInfo?.docId as string;
  console.log("docId", docId);

  useEffect(() => {
    const doctorStatus = async () => {
      try {
        const response = await doctorApprovalStatus(docId)
        console.log(response.data?.fetchDoctorStatus);
        if (response.status == 200) {
          setStatus(response.data?.fetchDoctorStatus);
          
        }
      } catch (error) {
        console.log(error);
      }
    };

    doctorStatus();
  }, []);


  const handleClick=()=>{
    navigate('/doctor/apply')
  }
  return (
    <div className="flex justify-center bg-slate-100">
  {/* Main content container */}
  <div className="flex flex-col items-center w-1/2 p-6 shadow-lg rounded-lg">
    {/* Image Section */}
    <div className="mb-6">
      <img
        src="/pictures/right-wrong.jpg"
        alt="Right and Wrong"
        className="object-contain w-full h-auto rounded"
      />
    </div>

    {/* Status Section */}
    <div className="flex mt-2 mb-4">
      <div
        className={`flex text-lg font-semibold text-center border p-2 rounded ${
          status === "Not Applied"
            ? "text-red-700"
            : status === "Pending"
            ? "text-red-400"
            : status === "Verified"
            ? "text-green-700"
            : ""
        }`}
      >
        Your status is:
        <p className="ml-2">{status}</p>
      </div>

      {status === "Not Applied" && (
        <button onClick={handleClick} className="ml-2 bg-blue-800 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-all">
          Apply For Approval
        </button>
      )}
    </div>

    {/* Button Section */}
  </div>
</div>

  );
};

export default ApplyApproval;
