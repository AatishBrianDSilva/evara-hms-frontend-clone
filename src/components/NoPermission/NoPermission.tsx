import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { ArrowBack, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NoPermission: React.FC = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/', { replace: true })
  }

  const handleGoBack = () => {
    navigate(-3)
  }

  return (
    <Box
      display="flex"
      flex={"1 1 auto"}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      boxShadow={2}
      borderRadius={1}
      bgcolor="background.paper"
    >
      <LockIcon color="error" style={{ fontSize: 60 }} />
      <Typography variant="h4" color="primary" gutterBottom>
        No Permission
      </Typography>
      <Typography variant="body1" color="textSecondary">
        You do not have the necessary role to access this page.
      </Typography>
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2} mt={2}>
        <Button color="secondary" variant="contained" startIcon={<ArrowBack />} onClick={handleGoBack} >
          Go Back
        </Button>
        <Typography variant="body1" color="textSecondary">
          or
        </Typography>
        <Button color="secondary" variant="contained" startIcon={<Home />} onClick={handleGoHome} >
          Go Home
        </Button>
      </Box>
    </Box>
  );
}

export default NoPermission;
