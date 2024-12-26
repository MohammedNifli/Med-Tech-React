import React from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaUserInjured,
  FaChartLine,
  FaWallet,
  FaVideo,
  FaClinicMedical,
  FaClock,
  FaLaptopMedical,
  FaUserClock,
  FaChartBar,
  FaHospital,
  FaLock,
  FaShieldAlt,
  FaUserMd,
  FaBrain,
  FaCertificate,
  FaHandHoldingMedical,
  FaMobile,
  FaStethoscope,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxStore/store";
import { useNavigate } from "react-router-dom";

const DoctorHomePage: React.FC = () => {
    const navigate=useNavigate()
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const doctorName = useSelector(
    (state: RootState) => state.doctor.doctorInfo?.name
  );
  console.log("doctorName", doctorName);

  const handleSubmit=async()=>{
    navigate('/doctor/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto"
      >
        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center relative">
            {/* Left Section */}
            <div className="w-full md:w-1/2 p-8 md:p-16 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="z-10 relative"
              >
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
                  Welcome to <span className="text-blue-600">MedTech</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  Your comprehensive healthcare platform for managing practice,
                  connecting with patients, and delivering exceptional care.
                </p>
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-2xl text-lg font-medium"
                    onClick={handleSubmit}
                  >
                    View Dashboard
                  </motion.button>
                </div>
              </motion.div>
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-transparent opacity-30"></div>
                <div className="absolute w-20 h-20 rounded-full bg-blue-400 opacity-30 top-10 left-10 animate-pulse"></div>
                <div className="absolute w-28 h-28 rounded-full bg-blue-300 opacity-20 bottom-20 right-10 animate-pulse"></div>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[600px]">
              <img
                src="/pictures/stethoscope.jpg"
                alt="Medical Equipment"
                className="absolute inset-0 w-full h-full object-cover rounded-r-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-800/20 to-transparent mix-blend-overlay"></div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-10 left-10 bg-white rounded-lg shadow-md p-6 max-w-xs"
              >
                <p className="text-sm text-gray-600 font-medium">
                  &quot;Empowering healthcare professionals to deliver top-notch
                  care.&quot;
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg mt-12 overflow-hidden"
        >
          <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <h2 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
              About MedTech Platform
            </h2>
            <p className="text-xl font-semibold opacity-90 leading-relaxed">
              Secure, Efficient, and Integrated Healthcare Management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Consultations Section */}
            <motion.div
              {...fadeInUp}
              className="flex flex-col md:flex-row gap-8 bg-blue-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <img
                    src="/pictures/hybrid.jpg"
                    alt="Consultation Methods"
                    className="w-full h-64 object-cover rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <FaUserMd className="w-7 h-7 text-blue-600" />
                  <h3 className="text-2xl font-bold tracking-tight">
                    Consultation Modes
                  </h3>
                </div>
              </div>
              <div className="md:w-1/2 space-y-6">
                <p className="text-lg font-medium text-gray-700">
                  Comprehensive consultation options:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <FaVideo className="w-5 h-5 text-blue-600" />
                    <span className="text-base font-medium">
                      HD Video Consultations
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaHospital className="w-5 h-5 text-blue-600" />
                    <span className="text-base font-medium">
                      In-Clinic Appointments
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaLaptopMedical className="w-5 h-5 text-blue-600" />
                    <span className="text-base font-medium">
                      Hybrid care option
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Data Privacy Section */}
            <motion.div
              {...fadeInUp}
              className="flex flex-col md:flex-row gap-8 bg-green-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <img
                    src="/pictures/dataprivacy.png"
                    alt="Data Privacy"
                    className="w-full h-64 object-cover rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <FaLock className="w-7 h-7 text-green-600" />
                  <h3 className="text-2xl font-bold tracking-tight">
                    Data Privacy
                  </h3>
                </div>
              </div>
              <div className="md:w-1/2 space-y-6">
                <p className="text-lg font-medium text-gray-700">
                  Enterprise-grade security features:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <FaShieldAlt className="w-5 h-5 text-green-600" />
                    <span className="text-base font-medium">
                      HIPAA Compliant Storage
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaLock className="w-5 h-5 text-green-600" />
                    <span className="text-base font-medium">
                      End-to-End Encryption
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaUserMd className="w-5 h-5 text-green-600" />
                    <span className="text-base font-medium">
                      Access Control
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Practice Analytics Section */}
            <motion.div
              {...fadeInUp}
              className="flex flex-col md:flex-row gap-8 bg-purple-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <img
                    src="/pictures/analysis.jpg"
                    alt="Practice Analytics"
                    className="w-full h-64 object-cover rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <FaChartLine className="w-7 h-7 text-purple-600" />
                  <h3 className="text-2xl font-bold tracking-tight">
                    Practice Analytics
                  </h3>
                </div>
              </div>
              <div className="md:w-1/2 space-y-6">
                <p className="text-lg font-medium text-gray-700">
                  Data-driven insights:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <FaChartBar className="w-5 h-5 text-purple-600" />
                    <span className="text-base font-medium">
                      Performance Metrics
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaChartLine className="w-5 h-5 text-purple-600" />
                    <span className="text-base font-medium">
                      Patient Flow Analysis
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaClinicMedical className="w-5 h-5 text-purple-600" />
                    <span className="text-base font-medium">
                      Revenue Insights
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Smart Scheduling Section */}
            <motion.div
              {...fadeInUp}
              className="flex flex-col md:flex-row gap-8 bg-blue-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <img
                    src="/pictures/smart-scheduling.png"
                    alt="Smart Scheduling"
                    className="w-full h-64 object-cover rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <FaCalendarAlt className="w-7 h-7 text-yellow-600" />
                  <h3 className="text-2xl font-bold tracking-tight">
                    Smart Scheduling
                  </h3>
                </div>
              </div>
              <div className="md:w-1/2 space-y-6">
                <p className="text-lg font-medium text-gray-700">
                  Intelligent appointment management:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <FaClock className="w-5 h-5 text-yellow-600" />
                    <span className="text-base font-medium">
                      AI-Powered Slot Allocation
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaUserClock className="w-5 h-5 text-yellow-600" />
                    <span className="text-base font-medium">
                      Waitlist Management
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCalendarAlt className="w-5 h-5 text-yellow-600" />
                    <span className="text-base font-medium">
                      Multi-Location Support
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <FaCalendarAlt className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Schedule Management
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Set availability, manage appointments, and sync with your personal
              calendar. Handle scheduling conflicts and emergency slots with
              ease.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <FaUserInjured className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Patient Records
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Access complete medical histories, track treatment progress, and
              manage prescriptions. Maintain detailed documentation with secure
              storage.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <FaChartLine className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Analytics</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor practice growth, patient satisfaction scores, and
              treatment outcomes. Generate insights for improving care quality.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="bg-yellow-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <FaWallet className="h-7 w-7 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Wallet & Payments
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Track earnings, manage consultation fees, and handle online
              payments securely. View detailed financial reports and statements.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg mt-12 overflow-hidden"
      >
        <div className="p-8 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
          <h2 className="text-3xl font-bold mb-4">
            MedTech&apos;s Vision for Healthcare
          </h2>
          <p className="text-xl opacity-90">
            Revolutionizing Healthcare Through Technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          <div className="bg-blue-50 rounded-xl p-6 hover:shadow-lg transition-duration-300">
            <FaBrain className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-3">AI-Powered Diagnostics</h3>
            <p className="text-gray-700">
              Leveraging artificial intelligence to enhance diagnostic accuracy
              and speed, enabling faster and more precise patient care
              decisions.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 hover:shadow-lg transition-duration-300">
            <FaMobile className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-3">Seamless Integration</h3>
            <p className="text-gray-700">
              Connecting healthcare providers with patients through intuitive
              mobile and web platforms, streamlining communication and care
              delivery.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 hover:shadow-lg transition-duration-300">
            <FaHandHoldingMedical className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-3">Comprehensive Care</h3>
            <p className="text-gray-700">
              Providing end-to-end solutions for patient management, from
              appointment scheduling to follow-up care and long-term health
              monitoring.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Doctor Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg mt-12 overflow-hidden"
      >
        <div className="p-8 bg-gradient-to-br from-green-600 to-green-800 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Why Doctors Choose MedTech
          </h2>
          <p className="text-xl opacity-90">
            Your Path to Enhanced Practice Management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Getting Started
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FaCertificate className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Simple Verification</h4>
                  <p className="text-gray-600">
                    Easy documentation upload and quick verification process for
                    medical credentials
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaUserClock className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Flexible Scheduling</h4>
                  <p className="text-gray-600">
                    Set your own availability and manage appointments on your
                    terms
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaChartLine className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Practice Growth</h4>
                  <p className="text-gray-600">
                    Tools and insights to expand your practice and enhance
                    patient care
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Requirements Checklist
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <FaStethoscope className="text-green-600" />
                <span>Valid Medical License</span>
              </li>
              <li className="flex items-center gap-3">
                <FaUserMd className="text-green-600" />
                <span>Professional Profile Photo</span>
              </li>
              <li className="flex items-center gap-3">
                <FaCertificate className="text-green-600" />
                <span>Specialty Certifications</span>
              </li>
              <li className="flex items-center gap-3">
                <FaHandHoldingMedical className="text-green-600" />
                <span>Practice Details</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      <footer className="bg-gray-900 text-white mt-12 rounded-2xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-blue-400">MedTech</h4>
              <p className="text-gray-400">
                Transforming healthcare through innovative technology solutions.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>For Doctors</li>
                <li>For Patients</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <FaPhone className="text-blue-400" />
                  <span>+91 8943737227</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-400" />
                  <span>helpandsupport@medtech.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-400" />
                  <span>123 Healthcare Ave, Medical District</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Newsletter</h4>
              <p className="text-gray-400">
                Stay updated with our latest features and updates.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white w-full"
                />
                {/* <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button> */}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 py-6 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} MedTech. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DoctorHomePage;
