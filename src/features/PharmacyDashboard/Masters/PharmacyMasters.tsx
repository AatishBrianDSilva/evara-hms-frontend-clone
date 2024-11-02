import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

const PharmacyMasters: React.FC = () => {
  return (
    <Box display={'flex'} flex={'1 1 auto'} height={'100%'}>
      <Outlet />
    </Box>
  );
};

export default PharmacyMasters;
