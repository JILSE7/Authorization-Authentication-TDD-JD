
import { Box, Button, CircularProgress, Container, CssBaseline, Stack, TextField } from "@mui/material"
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { SnackBar } from "../../components/SnackBar";
import { loginFetch } from "../../services";
import { LoginResponse } from '../../interfaces/index';
import { useNavigate } from "react-router-dom";
import { validateRegex } from '../../utils/regex';
import { useAuth } from '../../hooks/useAuth';
import { startLogin } from '../../actions/index';



const initialState = {email: '', password: ''}

export const Login = () => {
  const {dispatch, userState} = useAuth();

  const navigate = useNavigate();
  const [emailValidationMessage, setValidationMessage] = useState(initialState);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [openSnack, setOpenSnack] = useState<{isOpen:boolean, message: string}>({isOpen: false, message: ''});


  const email = useRef<HTMLInputElement | null>(null);
  const pass = useRef<HTMLInputElement | null>(null);

  const validate = useCallback((key:any, value:string, key2?:any, value2?:string) => setValidationMessage((prev) => ({...prev, [key]:value, [key2]:value2})),[],)
  
  const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
    try {
      setisLoading(true);
      e.preventDefault();
      setValidationMessage(initialState);
      if(!email.current?.value && !pass.current?.value) return validate('email', 'The email is required','password', 'The password is required');
      if(!email.current?.value)return validate('email', 'The email is required');
      if(!pass.current?.value) return validate('password', 'The password is required');
      if(!validateRegex(true, email.current?.value!) && !validateRegex(false, pass.current?.value!))return;
      
      const response = await loginFetch(email.current?.value, pass.current?.value);
      
      if(!response.ok) throw response;
      
      const {user}:LoginResponse = await response.json();
      
      dispatch(startLogin(user.role!, user.username!)); 
      
    } catch (error:any) {
      const {message} =  await error.json();
      console.log(message);
      
      setOpenSnack({isOpen:true, message });

    } finally{
      setTimeout(() => {
        setisLoading(false);
      }, 1000);

    }
    
  };

  const handleClose = useCallback(() => setOpenSnack((prev) => ({...prev, isOpen:false, message: ''})),[]);

  const onBlurEmail =  useCallback(() => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if(!regex.test(email.current?.value!))return validate('email', 'the email is invalid');
    setValidationMessage(initialState);
  },[validate],);
  
  
  const onBlurInput = (key:string, messageError: string) => {
    if(!pass.current?.value) return validate(key, messageError);
    
    const passwordRulesRegex = /^(?=.{8,})(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/

    if(!passwordRulesRegex.test(pass.current?.value)) return validate(key, 'Verify the password, please try again');

    setValidationMessage(initialState);
  };


  if(userState.user.role && !isLoading){
    setTimeout(() => {
      navigate(userState.user.role === 'admin' ? '/admin':'/employee', {replace:false});
    }, 500);
  }
  
  return (
    <div style={{width: '100vw', height: '100vh',display:'flex', alignItems: 'center', justifyContent:'center', flexDirection: 'column'}}>
        <h1>Login</h1>
            
            <form onSubmit={(e) => handleSubmit(e)} style={{display:'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center',width: '300px', height: '300px'}}>
            <TextField 
              label={'email'} 
              id={'name'}
              inputRef={email}  
              type={'email'}  
              helperText={emailValidationMessage.email} 
              onBlur={onBlurEmail} 
              margin={'normal'}
              
            />
            <TextField 
              label={'password'} 
              name={'password'} 
              type={'password'} 
              inputRef={pass} 
              helperText={emailValidationMessage.password} 
              onBlur={() => onBlurInput('password', 'The password is required')}  
              margin={'normal'}
            />  
            <Button disabled={isLoading} type="submit">Send</Button>
          </form>
          
         { 
            isLoading && (
                      <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                        <CircularProgress color="secondary"  data-testid="loading_indicator"/>
                        <CircularProgress color="success"    data-testid="loading_indicator"/>
                        <CircularProgress color="inherit"    data-testid="loading_indicator"/>
                      </Stack>
            )
          } 


          
          <SnackBar isOpen={openSnack.isOpen} message={openSnack.message} handleClose={handleClose}/>

    </div>
    
  )
}

