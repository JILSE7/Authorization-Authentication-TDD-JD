import { Link } from "react-router-dom";
import { Employee } from "./Employee"
import { useAuth } from '../../hooks/useAuth';
import { Header } from "../../components/AppBar";
import { Container } from "@mui/system";
import { Button } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';


interface IProps {
  username: string
}

const AdminPage = () => {
    const {userState} = useAuth();
    const {username} = userState.user
  return (
    <Container>
      <Header username={username!}/>
      <div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
        <h1>Admin Page</h1>
        <div>
          <Link to={'/employee'}  style={{textDecoration: 'none'}}>
            <Button  variant='outlined' color='secondary'  startIcon={<ArrowRightAltIcon/>}>Employee</Button>
          </Link>
        </div>
      </div>

      
    </Container>
    
  )
}


export {
  AdminPage,
  Employee
}
