import { Box, Stack, Text, Avatar } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxStore/store';
import ChatBox from './ChatBox';
import { useNavigate } from 'react-router-dom';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string | null;
}

const MyChats: React.FC = (user) => {
const userId=user?.userId 
  console.log("heloo",user.userId)
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:4444/chat/chats?id=${userId}`);
        const fetchedChats = response.data.data.map((chat: any) => ({
          id: chat._id,
          name: chat.participants[0]?.personalInfo?.name || 'Unknown',
          avatar: chat.participants[0]?.avatar || '',
          lastMessage: chat.lastMessage?.content || 'No messages yet',
        }));

        setChats(fetchedChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [userId]);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  
    console.log('Selected Chat:', chat);
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
      {/* Header */}
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

      {/* Chat List */}
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
                bg={selectedChat?.id === chat.id ? '#E2E8F0' : 'transparent'} // Highlight selected chat
                _hover={{ bg: '#F0F0F0' }}
                cursor="pointer"
                onClick={() => handleChatSelect(chat)}
              >
                <Avatar size="sm" src={chat.avatar} mr={3} />
                <Box>
                  <Text fontWeight="bold">{chat.name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {chat.lastMessage}
                  </Text>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text color="gray.500" align="center">
            Loading...
          </Text>
        )}
      </Box>

      {/* Selected Chat Details */}
      
      
    </Box>
    {selectedChat &&
   <ChatBox chatId={selectedChat} chatUser={userId}/>
    }
    
    
    </>
  );
};

export default MyChats;
