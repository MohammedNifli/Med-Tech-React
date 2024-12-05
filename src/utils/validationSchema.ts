import * as Yup from 'yup';

const validationSchema = Yup.object({
  // Personal Information
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),

  // Address
  street: Yup.string().required('Street address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  postalCode: Yup.string()
    .required('Postal code is required')
    .matches(/^[0-9]{6}$/, 'Postal code must be 6 digits'),

  // Professional Information
  specialization: Yup.string().required('Specialization is required'),
  degree: Yup.string().required('Degree is required'),
  institution: Yup.string().required('Institution is required'),
  year: Yup.number()
    .required('Year is required')
    .min(1950, 'Year must be after 1950')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  experience: Yup.number()
    .required('Experience is required')
    .min(0, 'Experience cannot be negative')
    .max(70, 'Please enter a valid experience'),
  licenseNumber: Yup.string()
    .required('License number is required')
    .min(5, 'License number must be at least 5 characters'),
  languages: Yup.string().required('Languages are required'),

  // Practice Information
  clinicName: Yup.string().required('Clinic name is required'),
  clinicAddress: Yup.string().required('Clinic address is required'),
  clinicContact: Yup.string()
    .required('Clinic contact is required')
    .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits'),

  // Consultation Modes
  onlineConsultation: Yup.boolean(),
  offlineConsultation: Yup.boolean()
    .test(
      'at-least-one-consultation',
      'At least one consultation mode must be selected',
      function (value) {
        return value || this.parent.onlineConsultation;
      }
    ),

  // Financial Information
  onlineConsultationFee: Yup.string().when('onlineConsultation', {
    is: true,
    then: () => Yup.string()
      .required('Online consultation fee is required')
      .matches(/^\d+$/, 'Must be a valid number'),
  }),
  offlineConsultationFee: Yup.string().when('offlineConsultation', {
    is: true,
    then: () => Yup.string()
      .required('Offline consultation fee is required')
      .matches(/^\d+$/, 'Must be a valid number'),
  }),
});

export default validationSchema;