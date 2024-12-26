import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const VideoCall: React.FC = () => {
    const [value, setValue] = useState<string>(''); // Define type for value
    const navigate = useNavigate();

    const handleJoinRoom = useCallback(() => {
        if (value.trim()) {
            const uniqueId = uuidv4(); // Generate a new unique ID here
            navigate(`/room/${uniqueId}`);
        } else {
            alert("Please enter a room code");
        }
    }, [navigate, value]);

    return (
        <div className='mt-52'>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder='Enter Room code'
                className="border rounded-sm px-2 py-1"
            />
            <button onClick={handleJoinRoom} className='bg-blue-700 text-white rounded-sm px-2 py-1 ml-2'>
                Join
            </button>
        </div>
    );
};

export default VideoCall;
