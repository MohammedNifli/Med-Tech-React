import React, { useEffect, useState } from "react";
import { Star, X, Eye, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

import Sidebar from "../../components/user/Sider";
import { RootState } from "../../reduxStore/store";
import {
  addFeedBackAndRating,
  fetchedFeedbackAndRating,
  fetchingAllOfflineAppointments
  
  
} from "../../services/userServices";


// Types
interface Consultation {
  _id: string;
  doctorDetails: {
    personalInfo: {
      name: string;
      phone: string;
      address: string;
    };
    financialInfo: {
      consultationFees: {
        offline: number;
      };
    };
  };
  appointmentDate: string;
  status: string;
  doctorId: string;
  patientId: string;
  userId: string;
  appointmentTime: string;
  hasFeedback?: boolean;
  feedback?: {
    rating: number;
    comment: string;
  };
}

interface ViewFeedback {
  rating: number;
  comment: string;
}

const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const OfflineConsultation: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
const [viewFeedback, setViewFeedback] = useState<ViewFeedback | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId) return;

      try {
        const fetchedAppointments = await fetchingAllOfflineAppointments(
          userId
        );
        console.log("Fetched Appointments:", fetchedAppointments);

        const formattedAppointments = (
          fetchedAppointments?.data?.fetchAppointments || []
        ).map((appointment: { appointmentDate: string; }) => ({
          ...appointment,
          appointmentDate: formatDate(appointment.appointmentDate), // Assuming formatDate is a function that formats the date
        }));
        console.log("froemattedAppoin", formattedAppointments);

        setConsultations(formattedAppointments);
        console.log("bhpooo", consultations);
      } catch (error) {
        console.error("Error loading appointments:", error);
        toast.error("Failed to load appointments");
      }
    };

    fetchAppointments();
  }, [userId]);

  const handleFeedback = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setShowModal(true);
  };

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

 const handleViewFeedback = async (consultation: Consultation) => {
     try {
      //  setDocId(consultation.doctorId);
      //  setPatientId(consultation.patientId);
      //  setUserId(consultation.userId);

      console.log('.............../////////',consultation.userId,
        consultation.patientId,
        consultation.doctorId)
 
       const response = await fetchedFeedbackAndRating(
         consultation.userId,
         consultation.patientId,
         consultation.doctorId
       );
 
       if (response.data?.fetchedFeedbackAndRating) {
         setViewFeedback({
           rating: response.data.fetchedFeedbackAndRating.rating || 0,
           comment: response.data.fetchedFeedbackAndRating.feedback || "",
         });
         setShowViewModal(true);
       } else {
         toast.error("No feedback found");
       }
     } catch (error) {
       console.error("Error fetching feedback:", error);
       toast.error("Failed to load feedback");
     }
   };

  const handleSaveFeedback = async () => {
    if (!selectedConsultation) return;

    try {
      const response = await addFeedBackAndRating(
        selectedConsultation.doctorId,
        selectedConsultation.userId,
        selectedConsultation.patientId,
        comment,
        rating
      );

      if (response.status === 201) {
        toast.success("Feedback added successfully");
        setConsultations((prevConsultations) =>
          prevConsultations.map((consultation) =>
            consultation._id === selectedConsultation._id
              ? {
                  ...consultation,
                  hasFeedback: true,
                  feedback: { rating, comment },
                }
              : consultation
          )
        );
      } else {
        toast.error("Failed to add feedback");
      }
    } catch (error) {
      console.error("Error adding feedback:", error);
      toast.error("Error adding feedback");
    }

    setShowModal(false);
    setRating(0);
    setComment("");
  };

  const ViewFeedbackModal: React.FC = () => {
    const [editableRating, setEditableRating] = useState(
      viewFeedback?.rating || 0
    );
    const [editableComment, setEditableComment] = useState(
      viewFeedback?.comment || ""
    );

    const handleSaveUpdatedFeedback = async () => {
      if (!selectedConsultation) return;

      try {
        const response = await addFeedBackAndRating(
          selectedConsultation.doctorId,
          selectedConsultation.userId,
          selectedConsultation.patientId,
          editableComment,
          editableRating
        );

        if (response.status === 201) {
          toast.success("Feedback updated successfully");
          setConsultations((prevConsultations) =>
            prevConsultations.map((consultation) =>
              consultation._id === selectedConsultation._id
                ? {
                    ...consultation,
                    hasFeedback: true,
                    feedback: {
                      rating: editableRating,
                      comment: editableComment,
                    },
                  }
                : consultation
            )
          );
        } else {
          toast.error("Failed to update feedback");
        }
      } catch (error) {
        console.error("Error updating feedback:", error);
        toast.error("Error updating feedback");
      }

      setShowViewModal(false);
    };

    const handleDeleteFeedback = async () => {
      if (!selectedConsultation) return;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/feedback/${selectedConsultation._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          toast.success("Feedback deleted successfully");
          setConsultations((prevConsultations) =>
            prevConsultations.map((consultation) =>
              consultation._id === selectedConsultation._id
                ? {
                    ...consultation,
                    hasFeedback: false,
                    feedback: undefined,
                  }
                : consultation
            )
          );
        } else {
          toast.error("Failed to delete feedback");
        }
      } catch (error) {
        console.error("Error deleting feedback:", error);
        toast.error("Error deleting feedback");
      }

      setShowViewModal(false);
    };

    if (!showViewModal || !viewFeedback) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Feedback Details</h3>
            <button
              onClick={() => setShowViewModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col items-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Rating</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setEditableRating(star)}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= editableRating ? "text-yellow-500" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Comment</p>
            <textarea
              className="w-full p-3 bg-gray-50 rounded-lg resize-none"
              value={editableComment}
              onChange={(e) => setEditableComment(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleSaveUpdatedFeedback}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleDeleteFeedback}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash className="w-5 h-5" /> Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-24 mb-10">
      <ToastContainer />
      <div className="w-full h-screen flex flex-row">
        <div className="w-1/6">
          <Sidebar />
        </div>
        <div className="w-5/6 h-screen bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Offline Consultations</h1>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      DOCTOR NAME
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      SCHEDULED ON
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      PHONE
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      PRICE
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      STATUS
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {consultations.map((consultation) => (
                    <tr key={consultation._id}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        Dr. {consultation.doctorDetails.personalInfo.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {consultation.appointmentDate}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {consultation.doctorDetails.personalInfo.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {
                          consultation.doctorDetails.financialInfo
                            .consultationFees.offline
                        }
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {consultation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {/* Join Button: Only accessible if the status is "confirmed" */}

                          {/* Rate & Feedback Button: Only accessible if there's no feedback yet */}
                          {consultation.hasFeedback ? (
                            // Show the "View" button if feedback exists
                            <button
                              onClick={() => handleViewFeedback(consultation)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4 mr-1.5" />
                              View
                            </button>
                          ) : consultation.status === "completed" ? (
                            // Show the "Rate & Feedback" button if status is "completed"
                            <button
                              onClick={() => handleFeedback(consultation)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              Rate & Feedback
                            </button>
                          ) : (
                            // Show a disabled "Rate & Feedback" button when conditions are not met
                            <button
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-300 cursor-not-allowed border border-gray-300 rounded-lg"
                              disabled
                            >
                              Rate & Feedback
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {consultations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">
                  No consultations scheduled
                </p>
              </div>
            )}
          </div>

          {/* Feedback Modal */}
          {showModal && selectedConsultation && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Add Feedback</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col items-center mb-4">
                  <p className="text-sm text-gray-600 mb-2">Rating</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className={`w-8 h-8 cursor-pointer ${
                          star <= rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Comment</p>
                  <textarea
                    className="w-full p-3 bg-gray-50 rounded-lg resize-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={handleSaveFeedback}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View Feedback Modal */}
          <ViewFeedbackModal />
        </div>
      </div>
    </div>
  );
};

export default OfflineConsultation;
