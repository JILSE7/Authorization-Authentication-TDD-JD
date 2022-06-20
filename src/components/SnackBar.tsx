import { Alert, Snackbar } from '@mui/material'
import { FC } from 'react';

interface IProps {
    isOpen: boolean;
    message: string;
    handleClose: () => void;
}

export const SnackBar:FC<IProps> = ({isOpen, message , handleClose}) => {
  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
       <Alert severity="error">{message}</Alert>
      </Snackbar>
  )
}
