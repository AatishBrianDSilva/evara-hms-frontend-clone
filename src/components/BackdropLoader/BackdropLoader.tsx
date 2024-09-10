import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'

interface IBackdropLoaderProps {
  open: boolean;
  handleClose?: () => void;
}

const BackdropLoader: React.FC<IBackdropLoaderProps> = ({ open, handleClose }) => {
  return (
    <Backdrop
      sx={{ color: (theme) => theme.palette.primary.main, zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export default BackdropLoader