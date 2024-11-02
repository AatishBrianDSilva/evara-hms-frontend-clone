import React from 'react';
import PharmacySidebar from '../../components/SideBar/PharmacySidebar';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const PharmacyDashboard: React.FC = () => {
  return (
    <Box display={'flex'} flex={1}>
      <PharmacySidebar />
      <Box display={'flex'} width={'100%'} flex={'1 1 auto'}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default PharmacyDashboard;
