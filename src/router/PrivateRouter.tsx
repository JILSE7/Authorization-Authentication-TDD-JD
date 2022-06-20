import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import React from 'react';

interface IProps {
    children  : any;
    isAuth    : boolean,
    role      :string
    allowRole : string[]
}

const PrivateRoute = ({children, isAuth, role, allowRole}:IProps) => {

    return isAuth && allowRole.includes(role) ?  children : <Navigate to={"/login"}/>

}

export default PrivateRoute