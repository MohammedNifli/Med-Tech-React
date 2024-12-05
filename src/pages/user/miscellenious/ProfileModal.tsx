import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useDisclosure,Text } from "@chakra-ui/react";

const ProfileModal: React.FC<UserProfileModalProps> = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children && <span onClick={onOpen}>{children}</span>}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize='30px'
          fontFamily='sans-serif'
          display='flex'
          justifyContent='center'
          >{user?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <img src={user?.pic} alt={`Profile Pic`} />
            <Text>{user?.name}</Text>
            <Text>Email: {user?.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
