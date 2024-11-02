import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';

import { Outlet } from 'react-router-dom';
import useTabNavigation from '../../../hooks/useTabNavigation';
import { EInternalOrdersTabPaths } from '../../../types/global';

const InternalOrdersTabs: React.FC = () => {
  const basePath = `/pharmacy/orders`;
  const { activeTab, handleTabChange } = useTabNavigation(
    basePath,
    Object.values(EInternalOrdersTabPaths),
  );

  return (
    <>
      <Box my={2}>
        <Tabs
          centered
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="Orders Tabs"
          sx={{ boxShadow: 5, borderRadius: 1 }}
        >
          <Tab label="Draft" id="order-main-tabpanel-0" />
          <Tab label="Approved" id="order-main-tabpanel-1" />
          <Tab label="Rejected" id="order-main-tabpanel-2" />
          <Tab label="Processed" id="order-main-tabpanel-5" />
        </Tabs>
      </Box>

      <Box py={2} borderRadius={1} flex={'1 1 auto'}>
        <Outlet />
      </Box>
    </>
  );
};

export default InternalOrdersTabs;
