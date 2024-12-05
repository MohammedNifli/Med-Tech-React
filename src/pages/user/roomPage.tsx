import React from 'react'
import { useParams } from 'react-router-dom'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt';

const roomPage:React.FC = () => {
    const {roomId}=useParams();
    const myMeeting=(element)=>{
    
        const appID= 1191722432;
        const serverSecret='3b3aee48a6a6016e963c651cd22a0fef';
        const kitToken= ZegoUIKitPrebuilt.generateKitTokenForTest(appID,serverSecret,roomId,Date.now().toString(),'Mohammed Nifli ap');
        const zc=ZegoUIKitPrebuilt.create(kitToken);
        zc.joinRoom({
            container:element,
            sharedLinks:[{
                name:'Copy Link',
                url:`http://localhost:5173/room/${roomId}`,
            }],
            scenario:{
                mode:ZegoUIKitPrebuilt.OneONoneCall
            },
            showScreenSharingButton:true,
        })


    }
  return (
    <div className='mt-24'>
       <div ref={myMeeting}/>
    </div>
  )
}

export default roomPage