import React from 'react';
import { Box, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const NoPermission: React.FC = () => (
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
  </Box>
);

export default NoPermission;
