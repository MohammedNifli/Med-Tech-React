import { Box } from '@chakra-ui/react'
import React from 'react'
import SideDrawer from './miscellenious/SideDrawer'
import { useSelector } from 'react-redux'
import { RootState } from '../../reduxStore/store'
import MyChats from '../user/miscellenious/MyChats'
import ChatBox from './miscellenious/ChatBox'


const ChatPage :React.FC = () => {
  const role=localStorage.getItem('role')
  console.log('role',role)
  let userr=''
  if(role=='user'){
    userr=useSelector((state:RootState)=>state.auth.user?._id)
    
  }else if(role=='doctor'){
    userr=useSelector((state:RootState)=>state.doctor.doctorInfo?.docId)
  }
  
    console.log("user",userr)
  return (
    <div className='w-full border '>
        {userr && <SideDrawer/>}
        <Box
        display='flex'
        justifyContent='space-between'
        w='100%'
        h='91.5vh'
        p='10px'
        >
            {userr && <MyChats userId={userr} />}
            {/* {user && <ChatBox/>} */}
            
            
        </Box>

       
    </div>
  )
}

export default ChatPage