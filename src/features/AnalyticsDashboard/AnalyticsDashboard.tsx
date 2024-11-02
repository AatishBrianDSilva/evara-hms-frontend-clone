import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import AnalyticsSidebar from '../../components/SideBar/AnalyticsSidebar';

const AnalyticsDashboard: React.FC = () => {
  return (
    <Box display={'flex'} flex={1}>
      <AnalyticsSidebar />
      <Box display={'flex'} width={'100%'} flex={'1 1 auto'}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;
