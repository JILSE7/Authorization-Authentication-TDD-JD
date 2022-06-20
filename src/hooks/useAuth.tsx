import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';


export const useAuth = () => {
    const {userState, dispatch} = useContext(AuthContext);
    
    

    return {
    
        userState,
        dispatch
    }
}
