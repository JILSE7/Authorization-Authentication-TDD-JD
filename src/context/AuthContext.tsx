import { createContext, Dispatch } from "react";
import { IAuth } from '../interfaces/index';
import { UserAction } from "./AuthReducer";



export type UserContextProps = {
    userState: IAuth;
    dispatch: Dispatch<UserAction>
} 


export const AuthContext = createContext<UserContextProps>({} as UserContextProps );