import { IAuth, IUser } from "../interfaces";



export type UserAction = { type: 'login', payload: {role:string, isAuth: boolean, username:string} } | { type: 'logout'};


export const stateReducer = ( state: IAuth, action: UserAction ): IAuth => {

    switch ( action.type ) {
        case 'login':
            return {
                ...state,
                isAuth: action.payload.isAuth,
                user: {
                    role : action.payload.role,
                    username: action.payload.username
                }
            }

        case 'logout': 
            return {
                ...state,
                isAuth: false,
                user: {
                    role: undefined
                }
            }

            
        default:
            return state;
    }

}