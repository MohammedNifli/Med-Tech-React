import React, { useEffect, useState } from 'react';
import { Box, Text, Input, Button, Avatar, HStack } from '@chakra-ui/react';
import axiosInstance from '../../../utils/axiosClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxStore/store';
import io,  {Socket } from 'socket.io-client';

const socket: Socket = io.connect('http://localhost:4444');

interface Message {
  _id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
}



const ChatBox: React.FC<{ chatId: { id: string },chatUser:{id:string} }> = ({ chatId ,chatUser}) => {
  const userId = chatUser


  console.log('chatUsre',chatUser)
  console.log('userID',userId)
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [toUserId, setToUserId] = useState<string | null>(null);
  const [recieveId,setRecieveId]=useState<string | null>('')



  useEffect(() => {
    if (userId) {
      socket.emit('register', userId); // Inform backend of the user
    }
  }, [userId]);

  useEffect(() => {
  socket.on('message_received', (msg) => {
    console.log('New message received:', msg);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        _id: `${Math.random()}`, // Generate unique ID or use actual message ID
        sender: msg.senderId,
        avatar: 'https://via.placeholder.com/150',
        content: msg.content,
        timestamp: new Date(msg.timestamp).toLocaleTimeString(),
      },
    ]);
  });

  return () => {
    socket.off('message_received');
  };
}, []);


  useEffect(() => {
    const fetchToUser = async () => {
      try {
        const response = await axiosInstance.get(
          `http://localhost:4444/chat/single-chat?chatId=${chatId.id}`
        );
        console.log('response', response);
        console.log('userId', userId);

        const participants = response.data.fetchedChatById.participants;
        const toUser = participants.find((participant) => participant !== userId);
        console.log('toooUser', toUser);


        // Set the state to update the toUserId
        setToUserId(toUser);

      } catch (error) {
        console.error('Error fetching recipient user:', error);
      }
    };

    fetchToUser();
  }, [chatId.id, userId]);

  // New useEffect to log the updated toUserId
  useEffect(() => {
    console.log("Updated toUserId:", toUserId);
  }, [toUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(
          `http://localhost:4444/message/conversations?chatId=${chatId.id}`
        );
        const fetchedMessages = response.data.loadedMessages.map((msg: any) => ({
          _id: msg._id,
          sender: msg.sender,
          avatar: 'https://via.placeholder.com/150',
          content: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));
        setMessages(fetchedMessages);
        socket.emit('join_chat',chatId.id)
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
  
    const messageData = {
      senderId: userId,
      recipientId: toUserId, // Ensure `toUserId` is correctly set
      content: newMessage,
    };
  
    try {
      // Save the message to the server/database
     const resp= await axiosInstance.post('http://localhost:4444/message/add', {
        chatId: chatId.id,
        sender: userId,
        content: newMessage,
      });
      if(resp.status>200){
        await axiosInstance.post('http://localhost:4444/chat/last-message',{chatId:chatId.id,senderId:userId})

      }
      
      
  
      // Emit the message to the backend
      socket.emit('send_message', messageData);
  
      // Update local state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: `${Math.random()}`, // Replace with actual unique ID if available
          sender: userId,
          avatar: 'https://via.placeholder.com/150',
          content: newMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
  
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  return (
    <Box
      display="flex"
      flexDir="column"
      justifyContent="space-between"
      bg="white"
      w="100%"
      h="100%"
      borderRadius="lg"
      borderWidth="1px"
      p={4}
    >
      {/* Chat Header */}
      <Box bg="gray.100" p={3} borderRadius="md" fontWeight="bold" textAlign="center" fontSize="lg" mb={3}>
        Chat with {toUserId || 'Loading...'}
      </Box>

      {/* Chat Messages */}
      <Box flex="1" overflowY="auto" display="flex" flexDir="column" gap={4} mb={3} px={2}>
        {messages.map((msg) => (
          <HStack key={msg._id} alignSelf={msg.sender === userId ? 'flex-end' : 'flex-start'} spacing={3}>
            {msg.sender !== userId && <Avatar size="sm" src={msg.avatar} name={msg.sender} />}
            <Box
              bg={msg.sender === userId ? 'blue.100' : 'gray.100'}
              p={3}
              borderRadius="lg"
              maxW="100%"
            >
              <Text fontSize="sm">{msg.content}</Text>
              <Text fontSize="xs" color="gray.500" textAlign="right">
                {msg.timestamp}
              </Text>
            </Box>
            {msg.sender === userId && <Avatar size="sm" src={msg.avatar} name={msg.sender} />}
          </HStack>
        ))}
      </Box>

      {/* Message Input */}
      <HStack spacing={3}>
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          aria-label="Type your message"
        />
        <Button type='submit' colorScheme="blue" onClick={handleSendMessage}>
          Send
        </Button>
      </HStack>
    </Box>
  );
};

export default ChatBox;
