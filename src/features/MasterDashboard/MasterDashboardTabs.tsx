import React from 'react';
import useTabNavigation from '../../hooks/useTabNavigation';
import { EMasterDashboardTabPaths } from '../../types/global';
import { Box, Tab, Tabs } from '@mui/material';
import { Outlet } from 'react-router-dom';

const MasterDashboardTabs: React.FC = () => {
  const basePath = `/master`;

  const { activeTab, handleTabChange } = useTabNavigation(
    basePath,
    Object.values(EMasterDashboardTabPaths),
  );

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label="Purchase Order Tabs"
        sx={{ boxShadow: 5, borderRadius: 1, bgcolor: 'background.paper' }}
      >
        <Tab label="Local" id="purchase-order-main-tabpanel-0" />
        <Tab label="Global" id="purchase-order-main-tabpanel-1" />
        <Tab label="Service Data" id="purchase-order-main-tabpanel-2" />
      </Tabs>
      <Box display={'flex'} mt={2} overflow={'hidden'} flex={1}>
        <Outlet />
      </Box>
    </>
  );
};

export default MasterDashboardTabs;
