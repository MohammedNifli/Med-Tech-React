import { Box } from '@chakra-ui/react';
import React from 'react';
import SideDrawer from './miscellenious/SideDrawer';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxStore/store';
import MyChats from '../user/miscellenious/MyChats';
// import ChatBox from '../../pages/user/miscellenious/ChatBox';

const ChatPage: React.FC = () => {
  const role = localStorage.getItem('role') ?? '';
  
  const userId = role === 'user' 
    ? useSelector((state: RootState) => state.auth.user?._id ?? '')
    : role === 'doctor'
    ? useSelector((state: RootState) => state.doctor.doctorInfo?.docId ?? '')
    : '';
    console.log('userId',userId)

  return (
    <div className='w-full border' aria-label="Chat Page">
      {userId && <SideDrawer />}
      <Box
        display='flex'
        justifyContent='space-between'
        w='100%'
        h='91.5vh'
        p='10px'
        aria-label="Chat Layout"
      >
        {userId && <MyChats userId={userId} />}
        {/* Uncomment ChatBox when ready to implement chat functionality */}
        {/* {userId && <ChatBox />} */}
      </Box>
    </div>
  );
};

export default ChatPage;