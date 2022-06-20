//React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminPage, Employee, Login } from '../views';

import PrivateRoute from './PrivateRouter';
import { useAuth } from '../hooks/useAuth';


const AppRouter = ({fakeAuth}:{fakeAuth?:boolean}) => {

  const {userState} = useAuth()
  
  return (
    <BrowserRouter basename = {process.env.PUBLIC_URL} >
        
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path="/admin" element={
                 <PrivateRoute isAuth={fakeAuth? fakeAuth :  userState?.isAuth} role={userState.user.role!} allowRole={['admin']}>
                    <AdminPage />
                 </PrivateRoute>
            }/>
            <Route path="/employee" element={
                 <PrivateRoute isAuth={fakeAuth? fakeAuth :  userState?.isAuth} role={userState.user.role!} allowRole={['user', 'admin']}>
                    <Employee />
                 </PrivateRoute>
            }/>
        </Routes>
    
    </BrowserRouter>
  )
}

export default AppRouter