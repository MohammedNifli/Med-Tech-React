
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "@/utils/axiosClient";

const PatientDetails: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const appointmentId = location.state?.Id;
  console.log('appointmentId',appointmentId)

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .required("Full name is required"),
  
    email: Yup.string()
      .email("Please enter a valid email format")
      .matches(/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i, "Please enter a valid email")
      .required("Email is required"),
  
    dateOfBirth: Yup.date()
      .max(new Date(Date.now() - 1000 * 60 * 60 * 24 * 365), "You must be at least one year old")
      .required("Date of birth is required"),
  
    age: Yup.number()
      .typeError("Age must be a number")
      .integer("Age must be an integer")
      .positive("Age must be a positive number")
      .min(1, "Age must be at least 1")
      .max(120, "Age cannot be more than 120")
      .required("Age is required")
      .test(
        "age-dob-match",
        "Age does not match the date of birth",
        function (value) {
          const { dateOfBirth } = this.parent;
          if (dateOfBirth) {
            const birthDate = new Date(dateOfBirth);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              calculatedAge--;
            }
            return calculatedAge === value;
          }
          return true;
        }
      ),
  
    gender: Yup.string()
      .oneOf(["Male", "Female", "Other"], "Select a valid gender")
      .required("Gender is required"),
  
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
  
    streetAddress: Yup.string()
      .min(5, "Street address must be at least 5 characters")
      .max(100, "Street address cannot exceed 100 characters")
      .required("Street address is required"),
  
    city: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "City name can only contain letters and spaces")
      .min(2, "City must be at least 2 characters")
      .max(50, "City cannot exceed 50 characters")
      .required("City is required"),
  
    state: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "State name can only contain letters and spaces")
      .min(2, "State must be at least 2 characters")
      .max(50, "State cannot exceed 50 characters")
      .required("State is required"),
  
    country: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Country name can only contain letters and spaces")
      .min(2, "Country must be at least 2 characters")
      .max(50, "Country cannot exceed 50 characters")
      .required("Country is required"),
  });
  
  
  

  const handleSubmit = async (values: unknown) => {
    try {
 
      const response = await axiosInstance.post(
        "/patient/add",
        { formData: values },
        { withCredentials: true }
      );

      if (response.status === 201&&appointmentId) {
      
        const patientId = response.data?.newPatient?._id;


        try {
          const updateResponse = await axiosInstance.post(
            "/appointment/update",
            { patientId, appointmentId },
            { withCredentials: true }
          );

          console.log("updateResponse",updateResponse)
      
          toast.success("Patient data saved");

          setTimeout(() => {
            navigate("/consult", { state: { appointmentId } });
          }, 500);
  
        } catch (updateError) {
          toast.error("Failed to update appointment with patient data");
          console.error("Error updating appointment:", updateError);
        }
      } else {
        toast.error("Failed to save patient data. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while saving patient data");
      console.error("Error saving patient data:", error);
    }
  };

  return (
    <div className="flex justify-center items-center mt-24 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="mt-10 mb-10 w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-center text-black text-2xl font-semibold mb-4">Patient Details</h2>

        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="w-full md:w-1/2 h-full mb-4 md:mb-0 md:pr-4">
            <Formik
              initialValues={{
                name: "",
                email: "",
                dateOfBirth: "",
                age: "",
                gender: "",
                phone: "",
                streetAddress: "",
                city: "",
                state: "",
                country: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-black text-sm mb-1">Full Name</label>
                  <Field name="name" type="text" className="w-full p-2 border rounded-md" placeholder="Enter your full name" />
                  <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-black text-sm mb-1">Email</label>
                  <Field name="email" type="email" className="w-full p-2 border rounded-md" placeholder="Enter your email" />
                  <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                </div>

                {/* DOB Field */}
                <div>
                  <label className="block text-black text-sm mb-1">Date of Birth</label>
                  <Field name="dateOfBirth" type="date" className="w-full p-2 border rounded-md" />
                  <ErrorMessage name="dateOfBirth" component="div" className="text-red-600 text-sm" />
                </div>

                {/* Age and Gender Fields */}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-black text-sm mb-1">Age</label>
                    <Field name="age" type="number" className="w-full p-2 border rounded-md" placeholder="Age" />
                    <ErrorMessage name="age" component="div" className="text-red-600 text-sm" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-black text-sm mb-1">Gender</label>
                    <Field name="gender" as="select" className="w-full p-2 border rounded-md">
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className="text-red-600 text-sm" />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-black text-sm mb-1">Phone</label>
                  <Field name="phone" type="tel" className="w-full p-2 border rounded-md" placeholder="Enter your phone number" />
                  <ErrorMessage name="phone" component="div" className="text-red-600 text-sm" />
                </div>

                {/* Address Fields */}
                <div>
                  <label className="block text-black text-sm mb-1">Street Address</label>
                  <Field name="streetAddress" type="text" className="w-full p-2 border rounded-md" placeholder="Enter street address" />
                  <ErrorMessage name="streetAddress" component="div" className="text-red-600 text-sm" />
                </div>

                {/* City, State, and Country Fields */}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-black text-sm mb-1">City</label>
                    <Field name="city" type="text" className="w-full p-2 border rounded-md" placeholder="Enter city" />
                    <ErrorMessage name="city" component="div" className="text-red-600 text-sm" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-black text-sm mb-1">State</label>
                    <Field name="state" type="text" className="w-full p-2 border rounded-md" placeholder="Enter state" />
                    <ErrorMessage name="state" component="div" className="text-red-600 text-sm" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-black text-sm mb-1">Country</label>
                    <Field name="country" type="text" className="w-full p-2 border rounded-md" placeholder="Enter country" />
                    <ErrorMessage name="country" component="div" className="text-red-600 text-sm" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="bg-blue-500 text-white font-sans font-bold px-16 py-2 rounded-md">
                    Save
                  </button>
                </div>
              </Form>
            </Formik>
          </div>

          <div className="w-full md:w-1/2 h-full flex justify-center">
            <img src="/pictures/patient-details.jpg" alt="Patient Details" className="w-full max-w-xs md:max-w-sm rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
