import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FaKey } from "react-icons/fa6";
import { useSelector } from "react-redux";

import { RootState } from "../../reduxStore/store";
import { ToastContainer, toast } from "react-toastify";
import { applyForApproval } from "../../services/doctorServices";
import PasswordModal from "../../components/doctorSide/passwordModal";
import { uploadFileToS3 } from "../../utils/s3Upload";
import { profile } from "console";

interface FormData {
  name: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  specialization: string;
  qualification: string;
  degree: string;
  institution: string;
  year: string;
  experience: string;
  licenseNumber: string;
  languages: string;
  clinicName: string;
  clinicAddress: string;
  clinicContact: string;
  onlineConsultation: boolean;
  offlineConsultation: boolean;
  onlineConsultationFee: string;
  offlineConsultationFee: string;
}

interface FormErrors {
  [key: string]: string;
}

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  options?: string[];
  value?: string;
  checked?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  multiple?: boolean;
}

const Application: React.FC = () => {
  // const [image, setImage] = useState('');

  const doctorAuth = useSelector((state: RootState) => state.doctor);
  const docId = doctorAuth.doctorInfo?.docId as string;
  console.log("docId", docId);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    specialization: "",
    qualification: "",
    degree: "",
    institution: "",
    year: "",
    experience: "",
    licenseNumber: "",
    languages: "",
    clinicName: "",
    clinicAddress: "",
    clinicContact: "",
    onlineConsultation: false,
    offlineConsultation: false,
    onlineConsultationFee: "",
    offlineConsultationFee: "",
  });

  const [licenseFiles, setLicenseFiles] = useState<File[] | null>(null);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedLicenseFiles, setSelectedLicenseFiles] = useState<string[]>(
    []
  );
  const [selectedCertificateFiles, setSelectedCertificateFiles] = useState<
    string[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile,setProfileImageFile]=useState('')

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }, []);
  

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(file);
  
        // Set file metadata (name and type) to the state
        setProfileImageFile({
          name: file.name, // The name of the file
          type: file.type, // The MIME type of the file
        });
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }, []);
  
  // UseEffect to log the file metadata
  useEffect(() => {
    if (profileImageFile) {
      console.log("File metadata:", profileImageFile); // Logs name and type
    }
  }, [profileImageFile]);

  useEffect(() => {
    if (profileImage) {
      console.log("File metadata:", profileImageFile); // Logs name and type
    }
  }, [profileImage]);
  
  
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setImage(URL.createObjectURL(e.target.files[0]));
  //   }
  // };

  const handleLicenseFileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setLicenseFiles(filesArray);
      setSelectedLicenseFiles(filesArray.map((file) => file.name)); // Update names for display

      // Optionally create previews as shown above
    }
  };

  const validateFormData = (data: FormData): FormErrors => {
    const errors: FormErrors = {};

    // Personal Information Validation
    if (!data.name?.trim()) {
      errors.name = "Name is required";
    } else if (data.name.length < 2) {
      errors.name = "Name must be at least 2 characters long";
    } else if (data.name.length > 50) {
      errors.name = "Name must not exceed 50 characters";
    }

    if (!data.gender) {
      errors.gender = "Gender is required";
    } else if (!["Male", "Female", "Other"].includes(data.gender)) {
      errors.gender = "Please select a valid gender";
    }

    if (!data.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    } else if (!isValidDate(data.dateOfBirth)) {
      errors.dateOfBirth = "Please enter a valid date of birth";
    }

    if (!data.email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(data.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!data.phone) {
      errors.phone = "Phone number is required";
    } else if (!isValidPhone(data.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    // Address Validation
    if (!data.street?.trim()) {
      errors.street = "Street address is required";
    }

    if (!data.city?.trim()) {
      errors.city = "City is required";
    }

    if (!data.state?.trim()) {
      errors.state = "State is required";
    }

    if (!data.country?.trim()) {
      errors.country = "Country is required";
    }

    if (!data.postalCode) {
      errors.postalCode = "Postal code is required";
    } else if (!isValidPostalCode(data.postalCode)) {
      errors.postalCode = "Please enter a valid postal code";
    }

    // Professional Information Validation
    if (!data.specialization?.trim()) {
      errors.specialization = "Specialization is required";
    }

    if (!data.degree?.trim()) {
      errors.degree = "Degree is required";
    }

    if (!data.institution?.trim()) {
      errors.institution = "Institution is required";
    }

    if (!data.year) {
      errors.year = "Year is required";
    } else if (!isValidYear(data.year)) {
      errors.year = "Please enter a valid year between 1950 and current year";
    }

    if (data.experience !== undefined && data.experience !== "") {
      const exp = Number(data.experience);
      if (isNaN(exp) || exp < 0) {
        errors.experience = "Experience must be a positive number";
      }
    }

    if (!data.licenseNumber?.trim()) {
      errors.licenseNumber = "License number is required";
    }

    // File Validation
    if (data.licenseFiles && data.licenseFiles.length > 0) {
      Array.from(data.licenseFiles).forEach((file, index) => {
        if (!isValidFileType(file)) {
          errors[`licenseFiles_${index}`] =
            "Invalid file type. Please upload JPG, PNG or PDF";
        }
        if (!isValidFileSize(file)) {
          errors[`licenseFiles_${index}`] = "File size must not exceed 5MB";
        }
      });
    }

    if (data.certificates && data.certificates.length > 0) {
      Array.from(data.certificates).forEach((file, index) => {
        if (!isValidFileType(file)) {
          errors[`certificates_${index}`] =
            "Invalid file type. Please upload JPG, PNG or PDF";
        }
        if (!isValidFileSize(file)) {
          errors[`certificates_${index}`] = "File size must not exceed 5MB";
        }
      });
    }

    if (!data.languages?.trim()) {
      errors.languages = "Languages are required";
    }

    // Practice Information Validation
    if (!data.clinicName?.trim()) {
      errors.clinicName = "Clinic/Hospital name is required";
    }

    if (!data.clinicAddress?.trim()) {
      errors.clinicAddress = "Clinic address is required";
    }

    if (!data.clinicContact?.trim()) {
      errors.clinicContact = "Clinic contact is required";
    } else if (!isValidPhone(data.clinicContact)) {
      errors.clinicContact = "Please enter a valid clinic contact number";
    }

    // Consultation Mode Validation
    if (!data.onlineConsultation && !data.offlineConsultation) {
      errors.consultationMode = "Please select at least one consultation mode";
    }

    // Financial Information Validation
    if (data.onlineConsultation) {
      if (!data.onlineConsultationFee) {
        errors.onlineConsultationFee = "Online consultation fee is required";
      } else if (Number(data.onlineConsultationFee) < 0) {
        errors.onlineConsultationFee = "Fee cannot be negative";
      }
    }

    if (data.offlineConsultation) {
      if (!data.offlineConsultationFee) {
        errors.offlineConsultationFee = "Offline consultation fee is required";
      } else if (Number(data.offlineConsultationFee) < 0) {
        errors.offlineConsultationFee = "Fee cannot be negative";
      }
    }

    return errors;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  };

  const isValidDate = (date: string): boolean => {
    const dateObj = new Date(date);
    const currentDate = new Date();
    return (
      dateObj instanceof Date &&
      !isNaN(dateObj.getTime()) &&
      dateObj < currentDate
    );
  };

  const isValidPostalCode = (postalCode: string): boolean => {
    // Modify regex based on your country's postal code format
    const postalCodeRegex = /^[0-9]{6}$/;
    return postalCodeRegex.test(postalCode);
  };

  const isValidYear = (year: number | string): boolean => {
    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();
    return yearNum >= 1950 && yearNum <= currentYear;
  };

  const isValidFileType = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    return allowedTypes.includes(file.type);
  };

  const isValidFileSize = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  };

  const handleCertificatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setCertificates(filesArray);
      setSelectedCertificateFiles(filesArray.map((file) => file.name)); // Update names for display
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateFormData(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const dataToSend = {
      personalInfo: {
        name: formData.name,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,

        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
        },
      },
      professionalInfo: {
        specialization: formData.specialization,
        qualifications: [
          {
            degree: formData.degree,
            institution: formData.institution,
            year: formData.year,
          },
        ],
        licenseNumber: formData.licenseNumber,
        languages: formData.languages,
        experience: formData.experience,
      },
      practiceInfo: {
        consultationModes: {
          online: formData.onlineConsultation,
          offline: formData.offlineConsultation,
        },
        clinics: [
          {
            name: formData.clinicName,
            address: formData.clinicAddress,
            contact: formData.clinicContact,
          },
        ],
      },
      financialInfo: {
        consultationFees: {
          online: formData.onlineConsultationFee,
          offline: formData.offlineConsultationFee,
        },
      },
      accountStatus: {
        isActive: true,
        verificationStatus: "Pending",
      },
    };

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(dataToSend));

      if (profileImage) {
        // Access file name and type directly from profileImageFile
        const fileName = profileImageFile?.name; // Access name property
        const fileType = profileImageFile?.type; // Access type property
        console.log('files', fileName, fileType);
      
        try {
          // Request the presigned URL from your backend
          const presignedUrlResponse = await axios.post(
            "http://localhost:4444/doctor/presigned-url",
            { fileName, fileType },
            {withCredentials:true}
          );
      
          console.log('presignedUrrrrl', presignedUrlResponse.data); // Logs the presigned URL
          const presignedUrl=presignedUrlResponse.data.presignedUrl
          const uploadImage=await uploadFileToS3(presignedUrl,profileImage)
          console.log("ipload image",uploadImage)

          const s3FileUrl = presignedUrl.split('?')[0];
          console.log("sefile presinged url",s3FileUrl)
      
          // You can use the presigned URL to upload the image (commented out part)
          formDataToSend.append('profile', s3FileUrl);
        } catch (error) {
          console.error("Error fetching presigned URL:", error);
        }
      }
      

      if (licenseFiles) {
        licenseFiles.forEach((file) => {
          formDataToSend.append("licenses", file); // Append actual files for form data
        });
      }
      
      certificates.forEach((cert) => {
        formDataToSend.append("certificates", cert); // Append actual certificate files
      });
      
      // Prepare files for generating presigned URLs
      const files = [
        ...certificates.map((cert) => ({ fileName: cert.name, fileType: cert.type })),
        ...licenseFiles.map((file) => ({ fileName: file.name, fileType: file.type })),
      ];
      
      // Request presigned URLs for all files
      const presignedUrlsFunction = await axios.post(
        "http://localhost:4444/doctor/presigned-urls",
        { files },
        { withCredentials: true }
      );
      
      const presignedUrls = presignedUrlsFunction.data.presignedUrls; // Array of presigned URLs
      console.log("Presigned URLs:", presignedUrls);
      
      // Upload all files to S3
      const allFiles = [...certificates, ...licenseFiles];
      const uploadPromises = allFiles.map((file, index) => {
        return uploadFileToS3(presignedUrls[index], file);
      });
      
      await Promise.all(uploadPromises); // Ensure all uploads are complete
      console.log("All files uploaded");
      
      // Match uploaded URLs with their respective categories
      const licenseUrls = presignedUrls.slice(certificates.length); // For license files
      const certificateUrls = presignedUrls.slice(0, certificates.length); // For certificate files
      
      // Append the uploaded file URLs to formDataToSend
      licenseUrls.forEach((url:unknown) => {
        const pre_url=url.split('?')[0]
        formDataToSend.append("licenses", pre_url) 
        console.log('license pre_url',pre_url)



      });
      certificateUrls.forEach((url:unknown) => {
        const pre_url=url.split('?')[0]
        formDataToSend.append("certificates", pre_url)
        console.log('certificates pre_url',pre_url)
      }
    );
      
      console.log("FormData prepared with URLs:", formDataToSend);
      

      const response = await applyForApproval(docId, formDataToSend);
      if (response.statusText === "OK") {
        toast.success("Your application has been submitted");
      } else {
        toast.error("Application submission failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error submitting form:",
          error.response?.data || error.message
        );
        toast.error("Error submitting application");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };
  const handlePasswordChangeClick = () => {
    setIsModalOpen(true); // Open the modal when clicking "Change Password"
  };

  //password changingfunction
  const handleSavePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      console.log("hello", currentPassword, newPassword, confirmPassword);
      const response = await axios.post(
        "http://localhost:4444/doctor/password",
        {
          docId,
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Password changed successfully:", response.data);
      if (response.status == 200) {
        toast.success("password changed succesfully");
      } else {
        toast.error("passwor is not updated");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    type = "text",
    options = [],
    value,
    checked,
    onChange,
    error,
    multiple,
  }) => (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-gray-600 font-semibold">
        {label}
      </label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`border rounded-md px-2 py-2 ${
            error ? "border-red-600" : "border-gray-900"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "checkbox" ? (
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="mt-2"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          multiple={multiple}
          className={`border rounded-md px-2 py-2 ${
            error ? "border-red-600" : "border-gray-900"
          }`}
          placeholder={`Enter ${label}`}
        />
      )}
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  );

  return (
    <div className="ml-4 sm:ml-12 md:ml-24 lg:ml-32 xl:ml-40 mr-4 sm:mr-12 mt-6 ">
      <ToastContainer />
      <div className="border border-black bg-white p-6 max-w-5xl shadow-lg rounded-md">
        <div className="text-left shadow-md mb-6 h-24 border border-b-black rounded">
          <h1 className="px-2 py-2 text-xl font-bold text-gray-900">Profile</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex space-x-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center relative overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-400">+ Add Photo</span>
              )}
              <input
                type="file"
                name="profile"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex flex-col ml-24">
                <label htmlFor="name" className="text-gray-600 font-semibold">
                  *Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name" // Added id for accessibility
                  value={formData.name}
                  onChange={handleChange}
                  className={`border w-72 border-gray-900 rounded-md px-2 py-2 ${
                    errors.name ? "border-red-600" : "" // Change border color if there's an error
                  }`}
                  placeholder="Enter Name"
                />
                {errors.name && (
                  <span className="text-red-600 text-sm">{errors.name}</span> // Display error message
                )}
              </div>
              <button
                type="button"
                onClick={handlePasswordChangeClick}
                className="mt-6 bg-blue-600 text-white w-48 rounded-md font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 hover:scale-105 transition-all duration-300"
              >
                <span>Change Password</span>
                <FaKey className="text-white" />
              </button>

              <PasswordModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSavePassword}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
            <div className="grid grid-cols-3 gap-6">
              <InputField
                label="Gender"
                name="gender"
                type="select"
                options={["Male", "Female", "Other"]}
                value={formData.gender}
                onChange={handleChange}
              />
              <InputField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email} // Error message for Email
              />

              <InputField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Address</h2>
            <div className="grid grid-cols-3 gap-6">
              <InputField
                label="Street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                error={errors.street}
              />
              <InputField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
              />
              <InputField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={errors.state}
              />
              <InputField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={errors.country}
              />
              <InputField
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                error={errors.postalCode}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              Professional Information
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <InputField
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                error={errors.specialization}
              />
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Qualification
                </h3>
              </div>
              <InputField
                label="Degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                error={errors.degree}
              />
              <InputField
                label="Institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                error={errors.institution}
              />

              <InputField
                label="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                error={errors.year}
              />
              <InputField
                label="Experience (years)"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                error={errors.experience}
              />
              <InputField
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                error={errors.licenseNumber}
              />
              <InputField
                label="License Files"
                name="licenseFiles"
                type="file"
                onChange={handleLicenseFileChange}
                multiple
              />
              {selectedLicenseFiles.length > 0 && (
                <div>
                  <h4>Selected License Files:</h4>
                  <ul>
                    {selectedLicenseFiles.map((fileName, index) => (
                      <li key={index}>{fileName}</li>
                    ))}
                  </ul>
                </div>
              )}
              <InputField
                label="Certificates"
                name="certificates"
                type="file"
                onChange={handleCertificatesChange}
                multiple
              />
              {selectedCertificateFiles.length > 0 && (
                <div>
                  <h4>Selected Certificate Files:</h4>
                  <ul>
                    {selectedCertificateFiles.map((fileName, index) => (
                      <li key={index}>{fileName}</li>
                    ))}
                  </ul>
                </div>
              )}
              <InputField
                label="Languages"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                error={errors.languages}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Practice Information</h2>
            <div className="grid grid-cols-3 gap-6">
              <InputField
                label="Clinic/Hospital Name"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                error={errors.clinicName}
              />
              <InputField
                label="Address"
                name="clinicAddress"
                value={formData.clinicAddress}
                onChange={handleChange}
                error={errors.clinicAddress}
              />
              <InputField
                label="Contact Number"
                name="clinicContact"
                value={formData.clinicContact}
                onChange={handleChange}
                error={errors.clinicContact}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Consultation Modes</h2>
            <div className="grid grid-cols-3 gap-6">
              <InputField
                label="Online"
                name="onlineConsultation"
                type="checkbox"
                checked={formData.onlineConsultation}
                onChange={handleChange}
                error={errors.onlineConsultation}
              />
              <InputField
                label="Offline"
                name="offlineConsultation"
                type="checkbox"
                checked={formData.offlineConsultation}
                onChange={handleChange}
                error={errors.offlineConsultation}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              Financial Information
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <InputField
                label="Online Consultation Fee"
                name="onlineConsultationFee"
                type="number"
                value={formData.onlineConsultationFee}
                onChange={handleChange}
                error={errors.onlineConsultationFee}
              />
              onlineConsultationFee
              <InputField
                label="Offline Consultation Fee"
                name="offlineConsultationFee"
                type="number"
                value={formData.offlineConsultationFee}
                onChange={handleChange}
                error={errors.offlineConsultationFee}
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-md"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// const InputField = ({
//   label,
//   name,
//   type = "text",
//   options = [],
//   value,
//   checked,
//   onChange,
//   error,
// }) => (
//   <div className="flex flex-col">
//     <label htmlFor={name} className="text-gray-600 font-semibold">
//       {label}
//     </label>
//     {type === "select" ? (
//       <select
//         id={name}
//         name={name}
//         value={value}
//         onChange={onChange}
//         className={`border rounded-md px-2 py-2 ${error ? 'border-red-600' : 'border-gray-900'}`}
//       >
//         <option value="">Select {label}</option>
//         {options.map((option, index) => (
//           <option key={index} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     ) : type === "checkbox" ? (
//       <input
//         id={name}
//         name={name}
//         type="checkbox"
//         checked={checked}
//         onChange={onChange}
//         className="mt-2"
//       />
//     ) : (
//       <input
//         id={name}
//         name={name}
//         type={type}
//         value={value}
//         onChange={onChange}
//         className={`border rounded-md px-2 py-2 ${error ? 'border-red-600' : 'border-gray-900'}`}
//         placeholder={`Enter ${label}`}
//       />
//     )}
//     {error && <span className="text-red-600 text-sm">{error}</span>} {/* Display error message */}
//   </div>
// );

export default Application;
