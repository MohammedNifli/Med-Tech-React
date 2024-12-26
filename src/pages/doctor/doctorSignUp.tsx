import axios from "axios";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { doctorSignUp } from "../../services/doctorServices";

const DoctorSignUp: React.FC = () => {
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = yup.object({
    name: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Name must only contain letters and spaces")
    .required("Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    password: yup.string().min(6, "Password should be at least 6 characters long").required("Password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('values',values)
        const response = await doctorSignUp(values.name,values.email,values.phone,values.password);
        console.log('hohooo',response.data.doctor._id)
        if (response.status === 201) {

          toast.success("Registered successfully!");
          await axios.post("http://localhost:4444/otp/doctor/send", { email: values.email });
        
          navigate("/doctor/otp", { state: { email: values.email, doctorId: response.data.doctor._id } });


        } else if (response.status === 400) {
          toast.error("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Error occurred during registration", error);
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-2 sm:p-4 md:p-6">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Image */}
          <div className="w-full lg:w-1/2 p-4 lg:p-8 flex items-center justify-center">
            <img
              src="/pictures/sginup.jpg"
              alt="Doctor Sign Up"
              className="w-full h-48 sm:h-64 md:h-80 lg:h-full object-cover lg:object-contain"
            />
          </div>

          {/* Right side - Sign Up Form */}
          <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 mb-2 text-center lg:text-left">
              Doctor&apos;s Sign up
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 text-center lg:text-left">
              Hey, enter your details to create your account
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <input
                  type="text"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  placeholder="Enter your name"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-600 text-sm">{formik.errors.name}</div>
                ) : null}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder="Enter your email"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-600 text-sm">{formik.errors.email}</div>
                ) : null}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  placeholder="Enter your phone"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <div className="text-red-600 text-sm">{formik.errors.phone}</div>
                ) : null}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="Password"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-600 text-sm">{formik.errors.password}</div>
                ) : null}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base lg:text-lg font-semibold hover:bg-blue-800 transition duration-300"
              >
                Sign Up
              </button>
            </form>

            <p className="text-center mt-6 text-xs sm:text-sm md:text-base text-gray-600">
              Already have an account?{" "}
              <a href="/doctor/login" className="text-blue-900 font-semibold hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default DoctorSignUp;
