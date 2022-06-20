import { useReducer } from 'react';
import { IAuth, IUser } from '../interfaces/index';
import { stateReducer } from './AuthReducer';
import { AuthContext, UserContextProps } from './AuthContext';

const INITIAL_STATE: IAuth = {
    isAuth: false,
    user: {
        role: undefined,
        username: undefined
    }
}

interface props {
    children: JSX.Element | JSX.Element[]
}

export const AuthProvider = ({ children }: props ) => {

    const [userState, dispatch] = useReducer(stateReducer, INITIAL_STATE );

    return (
        <AuthContext.Provider value={{
            userState,
            dispatch
        }}>
            { children }
        </AuthContext.Provider>
    )
}