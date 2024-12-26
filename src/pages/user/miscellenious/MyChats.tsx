import { Box, Stack, Text, Avatar } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosClient';
import ChatBox from './ChatBox';
import { useLocation } from 'react-router-dom';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string | null;
  role: string;
  participants: Array<{ _id: string; personalInfo?: { name: string }; name?: string; avatar?: string; role?: string }>;
}

interface MyChatsProps {
  userId: string;
}

const MyChats: React.FC<MyChatsProps> = ({ userId }) => {
  const location = useLocation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get(`/chat/chats?id=${userId}`);
        const fetchedChats =
          response?.data?.data?.map(
            (chat: {
              participants: Array<{ _id: string; personalInfo?: { name: string }; name?: string; avatar?: string; role?: string }>;
              lastMessage?: { content: string };
              _id: string;
            }) => {
              const opponent = chat.participants.find(
                (participant) => participant._id !== userId
              );

              const name = opponent?.personalInfo?.name || opponent?.name || '';
              const avatar = opponent?.avatar || '';
              const lastMessage = chat.lastMessage?.content || 'No messages yet';
              const role = opponent?.role || 'user';

              return {
                id: chat._id,
                name,
                avatar,
                lastMessage,
                role,
              };
            }
          ) || [];

        if (fetchedChats.length === 0) {
          const participants: string[] = [];
          const { userId: stateUserId } = location.state as { userId?: string } || {};
          const { docId } = location.state as { docId?: string } || {};

          if (stateUserId) participants.push(stateUserId);
          if (docId) participants.push(docId);

          try {
            const createdRoom = await axiosInstance.post('/chat/create', { participants });

            if (createdRoom.data) {
              const newChatResponse = await axiosInstance.get(`/chat/chats?id=${userId}`);
              const newFetchedChats =
                newChatResponse?.data?.data?.map(
                  (chat: {
                    participants: Array<{ _id: string; personalInfo?: { name: string }; name?: string; avatar?: string; role?: string }>;
                    lastMessage?: { content: string };
                    _id: string;
                  }) => {
                    const opponent = chat.participants.find(
                      (participant) => participant._id !== userId
                    );

                    return {
                      id: chat._id,
                      name: opponent?.personalInfo?.name || 'Unknown',
                      avatar: opponent?.avatar || '',
                      lastMessage: chat.lastMessage?.content || 'No messages yet',
                      role: opponent?.role || 'user',
                    };
                  }
                ) || [];
              setChats(newFetchedChats);
            }
          } catch (createRoomError) {
            console.error('Error creating chat room:', createRoomError);
          }
        } else {
          setChats(fetchedChats);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [userId, location.state]);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  return (
    <>
      <Box
        display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: '100%', md: '31%' }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: '28px', md: '30px' }}
          fontFamily="sans-serif"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
        </Box>

        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="auto"
        >
          {chats.length > 0 ? (
            <Stack>
              {chats.map((chat) => (
                <Box
                  key={chat.id}
                  display="flex"
                  alignItems="center"
                  p={2}
                  mb={2}
                  borderRadius="md"
                  bg={selectedChat?.id === chat.id ? '#E2E8F0' : 'transparent'}
                  _hover={{ bg: '#F0F0F0' }}
                  cursor="pointer"
                  onClick={() => handleChatSelect(chat)}
                >
                  <Avatar size="sm" src={chat.avatar} mr={3} />
                  <Box>
                    <Text fontWeight="bold">
                      {chat.name}
                      {chat.role === 'doctor' && (
                        <Text as="span" ml={2} fontSize="xs" color="green.500">
                          (Doctor)
                        </Text>
                      )}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {chat.lastMessage}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <Text color="gray.500" align="center">
              No chats available
            </Text>
          )}
        </Box>
      </Box>

      {selectedChat && (
        <ChatBox chatId={{ id: selectedChat.id }} chatUser={userId} />
      )}
    </>
  );
};

export default MyChats;
