import React, { useEffect, useState, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import TableComponent, {
  TableColumn,
} from "../../components/reusable/TableComponent";
import Pagination from "../../components/reusable/paginationComponent";
import { blockUser, unBlockUser } from "../../services/adminServices";
import { setBlockedState } from "../../slices/authSlice";
import axiosInstance from "@/utils/axiosClient";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
}

const UsersDetails: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pageItems, setPageItems] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();

  const fetchUserDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<{ fetchingAllUsers: User[] }>(
        "/admin/users"
      );
      const fetchedUsers = response.data.fetchingAllUsers || [];
      setUsers(fetchedUsers);
      setPageItems(fetchedUsers.slice(0, 10)); // Initial pagination setup
      setError(null);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details.");
      toast({
        title: "Error fetching users",
        description: "Failed to fetch user details",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleBlockAction = useCallback(
    async (
      userId: string,
      action: typeof blockUser | typeof unBlockUser,
      successMessage: string
    ) => {
      try {
        const response = await action(userId);
        if (response.status === 200 || response.status === 201) {
          const updatedUsers = users.map((user) =>
            user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
          );
          setUsers(updatedUsers);
          setPageItems(updatedUsers.slice(0, 10)); // Update current page view
          const userToUpdate = users.find((user) => user._id === userId);
          dispatch(setBlockedState(!userToUpdate?.isBlocked));
          toast({
            title: "Success",
            description: successMessage,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (err) {
        console.error(
          `Error updating user block status for ID: ${userId}`,
          err
        );
        toast({
          title: "Error",
          description: `Failed to ${successMessage.toLowerCase()}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        await fetchUserDetails();
      }
    },
    [users, fetchUserDetails, dispatch, toast]
  );

  const handleUserAction = useCallback(
    (userId: string) => {
      const user = users.find((u) => u._id === userId);
      if (user) {
        if (user.isBlocked) {
          handleBlockAction(userId, unBlockUser, "User unblocked successfully");
        } else {
          handleBlockAction(userId, blockUser, "User blocked successfully");
        }
      }
    },
    [users, handleBlockAction]
  );

  // Typing the columns correctly for the TableComponent
  const userColumns: TableColumn<User>[] = [
    { label: "Name", accessor: "name" },
    { label: "Email", accessor: "email" },
    { label: "Phone", accessor: "phone" },
    {
      label: "Actions",
      isAction: true,
      action: handleUserAction,
      actionLabel: (user) => (user.isBlocked ? "Unblock" : "Block"),
      actionColorScheme: (user) => (user.isBlocked ? "green" : "red"),
    },
  ];

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden">
      <TableComponent<User>
        caption="User Details"
        data={pageItems}
        columns={userColumns}
        error={error}
        isLoading={isLoading}
      />

      <Pagination items={users} pageLimit={10} setPageItems={setPageItems} />
    </div>
  );
};

export default UsersDetails;
