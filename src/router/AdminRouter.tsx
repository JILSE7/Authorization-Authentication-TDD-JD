import { Route, Routes } from "react-router-dom"
import { AdminPage, Employee } from "../views"



const AdminRouter = () => {
    return (
        
        <Routes>
            <Route path="/">
                <Route path="admin" element={<AdminPage/>}/>
                <Route path="employee" element={<Employee/>}/>
            </Route>
        </Routes>
        
    )
}


export default AdminRouter;