import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice.tsx';
import authreducer from '../slices/authSlice.tsx'
// import doctorReducer from "../slices/doctorSlice.tsx";
import docReducer from '../slices/doctorSlice.tsx';
import adminReducer from '../slices/adminSlice.tsx'



export const store=configureStore({
    reducer:{
        auth:authreducer,
        user:userReducer,
        doctor:docReducer,
        admin:adminReducer,
        
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;