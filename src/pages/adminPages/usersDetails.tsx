import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useToast } from "@chakra-ui/react";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import TableComponent from '../../components/reusable/TableComponent';
import Pagination from '../../components/reusable/paginationComponent';
import { blockUser, unBlockUser } from '../../services/adminServices';
import { setBlockedState } from '../../slices/authSlice';

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
}

const api = axios.create({
    baseURL: 'http://localhost:4444',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

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
            const response = await api.get<{ fetchingAllUsers: User[] }>('/admin/users');
            setUsers(response.data.fetchingAllUsers);
            setPageItems(response.data.fetchingAllUsers);
            setError(null);
        } catch (error: unknown) {
            setError('Failed to fetch user details.');
            toast({
                title: 'Error fetching users',
                description: 'Failed to fetch user details',
                status: 'error',
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

    const handleBlockAction = async (
        userId: string,
        action: typeof blockUser | typeof unBlockUser,
        successMessage: string
    ) => {
        try {
            const response = await action(userId);
            if (response.status === 200 || response.status === 201) {
                const updatedUsers = users.map(user =>
                    user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
                );
                setUsers(updatedUsers);
                setPageItems(updatedUsers);
                dispatch(setBlockedState(!users.find(user => user._id === userId)?.isBlocked));
                toast({
                    title: 'Success',
                    description: successMessage,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to ${successMessage.toLowerCase()}`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            await fetchUserDetails();
        }
    };

    const handleUserAction = (userId: string) => {
        const user = users.find(u => u._id === userId);
        if (user) {
            if (user.isBlocked) {
                handleBlockAction(userId, unBlockUser, 'User unblocked successfully');
            } else {
                handleBlockAction(userId, blockUser, 'User blocked successfully');
            }
        }
    };

    const userColumns = useMemo(() => [
        { label: 'Name', accessor: 'name' as const },
        { label: 'Email', accessor: 'email' as const },
        { label: 'Phone', accessor: 'phone' as const },
        {
            label: 'Actions',
            isAction: true,
            action: handleUserAction,
            actionLabel: (user: User) => (user.isBlocked ? 'Unblock' : 'Block'),
            actionColorScheme: (user: User) => (user.isBlocked ? "green" : "red"),
        },
    ], [handleUserAction]);

    return (
        <div className="border rounded-lg shadow-lg overflow-hidden">
            <TableComponent
                caption="User Details"
                data={pageItems}
                columns={userColumns}
                error={error}
                isLoading={isLoading}
            />
            <Pagination
                items={users}
                pageLimit={10}
                setPageItems={setPageItems}
            />
        </div>
    );
};

export default UsersDetails;
