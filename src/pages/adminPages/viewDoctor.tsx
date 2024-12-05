import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  approveApplication,
  rejectApplication,
} from "../../services/adminServices";

interface DoctorProfile {
  personalInfo?: {
    name: string;
    phone: string;
  };
  professionalInfo?: {
    specialization: string;
    certificates?: string[]; // Array of certificate images
    licenseFile?: string; // Single license image
  };
  accountStatus?: {
    verificationStatus: string;
  };
}

const ViewDoctor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [profileData, setProfileData] = useState<DoctorProfile | null>(null);
  const [clinicDetails, setClinicDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[] | null>(null); // Array of selected images for certificates or single license image

  const fetchDoctorData = useCallback(async () => {
    try {
      const response = await axios.get<{ doctorProfile: DoctorProfile }>(
        `http://localhost:4444/doctor/profile?id=${id}`,
        { withCredentials: true }
      );
      setClinicDetails(response.data?.doctorProfile?.practiceInfo?.clinics || []);
      setProfileData(response.data.doctorProfile);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchDoctorData();
  }, [fetchDoctorData]);

  const handleApprove = useCallback(async () => {
    try {
      await approveApplication(id as string);
      fetchDoctorData();
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  }, [id, fetchDoctorData]);

  const handleReject = useCallback(async () => {
    try {
      await rejectApplication(id as string);
      fetchDoctorData();
    } catch (error) {
      console.error("Error rejecting doctor:", error);
    }
  }, [id, fetchDoctorData]);

  const openModal = (documents: string[] | string) => {
    setSelectedDocuments(Array.isArray(documents) ? documents : [documents]); // Ensure selectedDocuments is always an array
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDocuments(null);
  };

  const renderActionButtons = () => {
    const status = profileData?.accountStatus?.verificationStatus;
    if (status === "verified") {
      return (
        <>
          <button
            onClick={() => navigate("/admin/doctors")}
            className="bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            disabled
          >
            Approved
          </button>
        </>
      );
    } else if (status === "rejected") {
      return (
        <button className="bg-red-500 text-white px-4 py-2 rounded-md" disabled>
          Rejected
        </button>
      );
    } else {
      return (
        <>
          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Reject
          </button>
          <button
            onClick={handleApprove}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Approve
          </button>
        </>
      );
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border border-white shadow-xl w-full h-auto p-6">
      {/* Doctor Details Card */}
      <div className="border border-white shadow-md w-3/6 h-64 bg-white mx-3 flex">
        <div className="w-1/3 h-5/6 mt-6 ml-5 mr-3 shadow-lg">
          <img
            src="/api/placeholder/300/400"
            alt={profileData.personalInfo?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-2/3 bg-white border border-white h-5/6 mt-12 ml-3 flex flex-col space-y-3">
          <p className="text-lg font-bold">
            Name: {profileData.personalInfo?.name}
          </p>
          <p>Qualifications: {profileData.professionalInfo?.specialization}</p>
          <p>
            Status:{" "}
            <span className="text-green-500">
              {profileData.accountStatus?.verificationStatus}
            </span>
          </p>
          <p>Phone: {profileData.personalInfo?.phone}</p>
        </div>
      </div>

      {/* Document and Actions Section */}
      {!showModal && (
        <div className="border border-gray-300 bg-gray-50 shadow-md mt-3 mx-3 w-3/4">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="text-left p-3 font-semibold">Document</th>
                <th className="text-left p-5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-3">
                  <div className="font-semibold">Certificates</div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => openModal(profileData.professionalInfo?.certificates?.map((img)=>img.file) || [])}
                    className="bg-blue-600 rounded px-4 py-2 text-white font-semibold"
                  >
                    View
                  </button>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3">
                  <div className="font-semibold">License</div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => openModal(profileData.professionalInfo?.licenseFile || "")}
                    className="bg-blue-600 rounded px-4 py-2 text-white font-semibold"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Viewing Documents */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-1/2">
            <h2 className="text-lg font-semibold mb-4">Document View</h2>
            {selectedDocuments && selectedDocuments.length > 0 ? (
              selectedDocuments.map((doc, index) => (
                <img
                  key={index}
                  src={doc}
                  alt={`Document ${index + 1}`}
                  className="w-full h-auto mb-4"
                />
              ))
            ) : (
              <p>No document available.</p>
            )}
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Clinic Address Section with Buttons */}
      {!showModal && (
        <div className="border-white bg-white shadow-md border w-full h-auto mt-2 mx-2 p-4 rounded-lg relative">
          <h1 className="text-xl font-bold mb-4 text-gray-700">Clinic Address</h1>
          {clinicDetails.map((item, ind) => (
            <div key={ind} className="mb-4">
              <h2 className="text-lg font-semibold text-blue-700">{item.name}</h2>
              <p className="text-md text-gray-600">Location: {item.address}</p>
            </div>
          ))}
          <div className="absolute bottom-4 right-4 space-x-2">
            {renderActionButtons()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDoctor;
