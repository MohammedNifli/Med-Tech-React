import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import {
  Box,
  VStack,
  HStack,
  Input,
  Select,
  Button,
  Text,
  Image,
  FormControl,
  FormLabel,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { fetchingProfileDetaills, updateUserProfile } from "../services/userServices";
import axiosInstance from "../utils/axiosClient";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import axios from "axios";
import {uploadFileToS3} from '../utils/s3Upload'

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  photo?: File | null;
}

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    photo: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toast = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user._id) {
        try {
          setIsLoading(true);
          const response = await fetchingProfileDetaills(user._id);
          const fetchedData = response?.data?.userProfile || {};
          setProfileData({
            name: fetchedData.name || "",
            email: fetchedData.email || "",
            phone: fetchedData.phone || "",
            gender: fetchedData.gender || "",
            photo: fetchedData.photo || null,
          });
          if (fetchedData.photo) setPhotoPreview(fetchedData.photo);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast({
            title: "Failed to load profile",
            description: "Please try again later.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      if (user?._id) {
        const formData = new FormData();
        formData.append("name", profileData.name);
        formData.append("email", profileData.email);
        formData.append("phone", profileData.phone);
        formData.append("gender", profileData.gender);
        // if (profileData.photo) formData.append("photo", profileData.photo);
      const fileType=profileData.photo?.type
      const fileName=profileData.photo?.name;
      
      const presignedUrlResponse=await axios.post('http://localhost:4444/user/presigned-url',{fileType,fileName})
      console.log('presignedUrl',presignedUrlResponse)

      const presignedUrl=presignedUrlResponse.data?.presignedUrl
      console.log("urlll",presignedUrl)
      
      const uploadImage=await uploadFileToS3(presignedUrl,profileData.photo)
      console.log('uploaded image in the s3',uploadImage)

      const s3FileUrl = presignedUrl.split('?')[0];
      
       formData.append('photo',s3FileUrl)

        const response = await updateUserProfile(user._id, formData);
        if (response.status === 200) {
          toast({
            title: "Profile updated",
            description: "Your changes have been saved successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const response = await axiosInstance.post('/user/password', {
        userId: user?._id,
        ...passwordData,
      });

      if (response.status === 200) {
        toast({
          title: "Password updated",
          description: "Your password has been changed successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Password update failed.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Update failed",
        description: "Failed to update password. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  const toggleShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (isLoading) {
    return (
      <Box textAlign="center" mt={8}>
        Loading...
      </Box>
    );
  }

  return (
    <Box maxW="2xl" mx="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white" mt={32} mb={24}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Your Profile
      </Text>

      <HStack spacing={4} mb={6}>
        <Box w="24" h="24" borderRadius="full" bg="gray.200" display="flex" alignItems="center" justifyContent="center" overflow="hidden">
          {photoPreview ? <Image src={photoPreview} alt="Profile" objectFit="cover" w="full" h="full" /> : <Text color="gray.400">No Photo</Text>}
        </Box>
        <Button as="label" colorScheme="blue" cursor="pointer">
          Change Photo
          <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
        </Button>
      </HStack>

      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input value={profileData.name} onChange={(e) => handleChange("name", e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={profileData.email} onChange={(e) => handleChange("email", e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Phone</FormLabel>
          <Input type="tel" value={profileData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Gender</FormLabel>
          <Select value={profileData.gender} onChange={(e) => handleChange("gender", e.target.value)}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </FormControl>
      </VStack>

      <HStack justifyContent="space-between" mt={8}>
        <Button variant="outline" onClick={onOpen}>
          Change Password
        </Button>
        <Button colorScheme="blue" onClick={handleSaveChanges} isLoading={isSaving}>
          Save Changes
        </Button>
      </HStack>

      {/* Change Password Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {["currentPassword", "newPassword", "confirmPassword"].map((field, idx) => (
              <FormControl key={idx} mt={idx === 0 ? 0 : 4}>
                <FormLabel>{field === "currentPassword" ? "Current Password" : field === "newPassword" ? "New Password" : "Confirm New Password"}</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword[field as keyof typeof showPassword] ? "text" : "password"}
                    value={passwordData[field as keyof typeof passwordData]}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                  />
                  <InputRightElement width="3rem">
                    <Button h="1.75rem" size="sm" onClick={() => toggleShowPassword(field as keyof typeof showPassword)}>
                      {showPassword[field as keyof typeof showPassword] ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handlePasswordChange}>
              Save Password
            </Button>
            <Button variant="ghost" onClick={onClose} ml={2}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserProfile;
