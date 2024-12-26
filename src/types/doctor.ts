

export  interface Doctor {
    // Personal Information
    personalInfo: {
      name: string;
      gender: 'Male' | 'Female' | 'Other';
      profilePicture?: string;
      dateOfBirth?: Date;
      email: string;
      password: string;
      phone: string;
      address: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
      };
    };
  
    // Professional Information
    professionalInfo: {
      specialization: string;
      qualifications: {
        degree: string;
        institution: string;
        year: number;
      }[];
      experience?: number;
      licenseNumber: string;
      licenseFile: {
        title: string;
        file: string; // Path or URL to the uploaded license file
      }[];
      certificates: {
        title: string;
        file: string; // Path or URL to the uploaded certificate file
      }[];
      languages: string[];
    };
  
    // Practice Information
    practiceInfo: {
      clinics: {
        name: string;
        address: string;
        contactNumber: string;
      }[];
      consultationModes: {
        online: boolean;
        offline: boolean;
        chat:boolean
      };
    };
  
    // Financial Information
    financialInfo: {
      consultationFees: {
        online?: number;
        offline?: number;
      };
    };
  
    // Account Status
    accountStatus: {
      isActive: boolean;
      verificationStatus: 'Pending' | 'Verified' | 'Rejected' | 'Not Applied';
    };
  
    // Authentication Information
    authentication: {
      password: string;
    };


    rating:number;
    reviews:[];
  
    // Other fields
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;

  }
  