import React, { useEffect, useState } from "react";
import {
  Video,
  Eye,
  Star,
  X,
  Clock,
  Calendar,
  User,
  PhoneCall,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { Trash } from "lucide-react";

import Sidebar from "../../components/user/Sider";
import {
  addFeedBackAndRating,
  fetchedFeedbackAndRating,
  fetchingAllOnlineAppointments,
} from "../../services/userServices";
import { RootState } from "../../reduxStore/store";

// Types
interface Consultation {
  _id: string;
  doctorDetails: {
    personalInfo: {
      name: string;
      phone: string;
    };
    financialInfo: {
      consultationFees: {
        online: number;
      };
    };
  };
  appointmentDate: string;
  status: string;
  doctorId: string;
  patientId: string;
  userId: string;
  startTime: string;
  endTime: string;
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

const OnlineConsultations: React.FC = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const uniqueId = uuidv4();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewFeedback, setViewFeedback] = useState<ViewFeedback | null>(null);
  const [docId, setDocId] = useState("");
  const [UserId, setUserId] = useState("");
  const [patientId, setPatientId] = useState("");

  const [checkAlready, setCheckAlready] = useState("");

  const [prevComment, setPrevComment] = useState("");
  const [prevStar, setPrevStar] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId) return;

      try {
        const fetchedAppointments = await fetchingAllOnlineAppointments(userId);
        console.log("fethcedAppointment>>>", fetchAppointments);
        const formattedAppointments = fetchedAppointments.map(
          (appointment) => ({
            ...appointment,
            appointmentDate: formatDate(appointment.appointmentDate),
          })
        );
        setConsultations(formattedAppointments);
      } catch (error) {
        console.error("Error loading appointments:", error);
        toast.error("Failed to load appointments");
      }
    };

    fetchAppointments();
  }, [userId]);

  const handleFeedback = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setDocId(consultation.doctorId);
    setUserId(consultation.userId);
    setPatientId(consultation.patientId);
    setShowModal(true);
  };

  const handleJoin = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setShowJoinModal(true);
  };

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleViewFeedback = async (consultation: Consultation) => {
    try {
      setDocId(consultation.doctorId);
      setPatientId(consultation.patientId);
      setUserId(consultation.userId);

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
    try {
      console.log(UserId, patientId, docId, comment, rating);
      const response = await addFeedBackAndRating(
        UserId,
        patientId,
        docId,
        comment,
        rating
      );
      if (response.status === 201) {
        toast.success("Feedback added successfully");
        // Update the local state to reflect the new feedback
        setConsultations((prevConsultations) =>
          prevConsultations.map((consultation) =>
            consultation._id === selectedConsultation?._id
              ? {
                  ...consultation,
                  hasFeedback: true,
                  feedback: { rating, comment },
                }
              : consultation
          )
        );
      } else if (response.status == 409) {
        toast.error("feedaback is already added");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error adding feedback");
    }

    setShowModal(false);
    setRating(0);
    setComment("");
    setPatientId("");
    setUserId("");
    setDocId("");
  };

  const videoCall = () => {
    navigate(`/room/${uniqueId}`);
  };

  const ViewFeedbackModal: React.FC = () => {
    // Assume showViewModal, setShowViewModal, and viewFeedback are passed as props or from context.
    const [editableRating, setEditableRating] = useState(3);
    const [editableComment, setEditableComment] = useState("hi");

    const handleStarClick = (star: number) => {
      setEditableRating(star); // Update the rating when a star is clicked
    };

    const handleSaveFeedback = () => {
      // Save the updated feedback (add your save logic here)
      console.log("Saved feedback:", {
        rating: editableRating,
        comment: editableComment,
      });
      setShowViewModal(false); // Close modal after saving
    };

    const handleDeleteFeedback = () => {
      // Logic for deleting feedback
      console.log("Feedback deleted");
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

          {/* Editable Rating Section */}
          <div className="flex flex-col items-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Rating</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= editableRating ? "text-yellow-500" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Editable Comment Section */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Comment</p>
            <textarea
              className="w-full p-3 bg-gray-50 rounded-lg resize-none"
              value={viewFeedback.comment}
              onChange={(e) => setEditableComment(e.target.value)}
            />
          </div>

          {/* Footer with Save and Delete buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleSaveFeedback}
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

  const JoinConsultationModal: React.FC<{
    showJoinModal: boolean;
    setShowJoinModal: (show: boolean) => void;
    selectedConsultation: Consultation | null;
  }> = ({ showJoinModal, setShowJoinModal, selectedConsultation }) => {
    if (!showJoinModal || !selectedConsultation) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowJoinModal(false)}
        />

        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
          <button
            onClick={() => setShowJoinModal(false)}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Join Consultation
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Your virtual consultation is ready to begin
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Dr. {selectedConsultation.doctorDetails.personalInfo.name}
                </h4>
                <p className="text-sm text-gray-500">
                  <PhoneCall className="w-4 h-4 inline mr-1" />
                  {selectedConsultation.doctorDetails.personalInfo.phone}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Start Time
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900 pl-8">
                  {selectedConsultation.startTime}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">
                    End Time
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900 pl-8">
                  {selectedConsultation.endTime}
                </p>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                Quick Guidelines
              </h5>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Ensure stable internet connection</li>
                <li>• Test your camera and microphone</li>
                <li>• Find a quiet, well-lit space</li>
                <li>• Keep your medical records handy</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-3 mt-8">
            <button
              onClick={() => setShowJoinModal(false)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={videoCall}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <Video className="w-5 h-5" />
              <span>Join Session</span>
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
        <div className="w-5/6 h-screen bg-white p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Online Consultations
            </h1>
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
                            .consultationFees.online
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
                          <button
                            onClick={() => handleJoin(consultation)}
                            disabled={consultation.status !== "confirmed"} // Disable if not confirmed
                            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium  ${
                              consultation.status === "confirmed"
                                ? "text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                : "text-gray-500 bg-gray-300 cursor-not-allowed rounded-sm"
                            }`}
                          >
                            <Video className="w-4 h-4 mr-1.5 " />
                            Join
                          </button>

                          {/* Rate & Feedback Button: Only accessible if there's no feedback yet */}
                          {consultation.hasFeedback ? (
                            <button
                              onClick={() => handleViewFeedback(consultation)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4 mr-1.5" />
                              View
                            </button>
                          ) : (
                            consultation.status === "completed" && (
                              <button
                                onClick={() => handleFeedback(consultation)}
                                disabled={consultation.status==='confimed'} // Disable if not confirmed
                                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium ${
                                  consultation.status === "completed"
                                    ? "text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                    : "text-gray-500 bg-gray-300 cursor-not-allowed"
                                }`}
                              >
                                Rate & Feedback
                              </button>
                            )
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

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">
                    Rate Your Experience
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex justify-center mb-4">
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
                <textarea
                  className="w-full h-24 p-3 border rounded-lg mb-4 resize-none"
                  placeholder="Add your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  onClick={handleSaveFeedback}
                  className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Feedback
                </button>
              </div>
            </div>
          )}

          <JoinConsultationModal
            showJoinModal={showJoinModal}
            setShowJoinModal={setShowJoinModal}
            selectedConsultation={selectedConsultation}
          />

          <ViewFeedbackModal />
        </div>
      </div>
    </div>
  );
};

export default OnlineConsultations;
