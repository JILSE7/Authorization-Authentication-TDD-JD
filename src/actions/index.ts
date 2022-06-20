import { UserAction } from '../context/AuthReducer';


export const startLogin  = (role:string, username:string):UserAction => ({type: 'login', payload: {isAuth:true, role, username}});

export const startlogOut = ():UserAction => ({type: 'logout'});