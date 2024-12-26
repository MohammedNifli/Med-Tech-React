import {
  Box,
  Menu,
  Button,
  Tooltip,
  Text,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  Drawer,
  DrawerOverlay,
  DrawerHeader,
  useDisclosure,
  DrawerContent,
  DrawerBody,
  Input,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxStore/store";
import ProfileModal from "./ProfileModal";

import { toast, ToastContainer } from "react-toastify";

const SideDrawer: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Drawer control

  // State for managing search results
  const [search, setSearch] = useState<string>("");
  const [, setSearchResult] = useState<string[]>([]);
  const [, setLoading] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearch(query);

    if (!query.trim()) {
      toast.error("Please enter something in search", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setLoading(true);

    // Simulating an API call for search results
    setTimeout(() => {
      setSearchResult([]); // Update this with real data once implemented
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }}>Search User</Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="sans-serif">
          Med-Tech
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={''}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem>Back to Home</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* Drawer for searching users */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <ToastContainer />
            <DrawerHeader borderBottomWidth="1px">Search Users..</DrawerHeader>
            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input
                  placeholder="Search by name or email"
                  mr={2}
                  value={search}
                  onChange={handleSearchChange}
                />
                <Button onClick={() => handleSearchChange}>
                  Go
                </Button>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default SideDrawer;
