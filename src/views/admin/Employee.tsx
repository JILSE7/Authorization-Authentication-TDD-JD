import { Button, Container } from "@mui/material"
import { useContext } from "react"
import { Header } from "../../components/AppBar"
import { AuthContext } from "../../context/AuthContext"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export const Employee = () => {

  const {userState} = useContext(AuthContext)
  const {role, username} = userState.user;
  return (
    <Container>
      <Header username={username!}/>
      <div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
      <h1>Employee</h1>
        <div>
          {
            role === 'admin' && <Button  variant='outlined' color='secondary'  startIcon={<DeleteOutlineIcon/>}>Delete</Button>
          }
            
        </div>
      </div>

      
    </Container>
  )
}

