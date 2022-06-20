export interface LoginResponse {
    user: IUser
}

export interface IUser {
    role      : string | undefined
    username? : string | undefined
}


export interface IAuth {
    isAuth : boolean;
    user   : IUser
}


