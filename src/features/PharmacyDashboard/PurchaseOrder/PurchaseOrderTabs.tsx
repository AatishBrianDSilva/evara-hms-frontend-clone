import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';

import { Outlet } from 'react-router-dom';
import useTabNavigation from '../../../hooks/useTabNavigation';
import { EPurchaseOrderTabPaths } from '../../../types/global';

const PurchaseOrderTabs: React.FC = () => {
  const basePath = `/pharmacy/purchase-order`;
  const { activeTab, handleTabChange } = useTabNavigation(
    basePath,
    Object.values(EPurchaseOrderTabPaths),
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
          aria-label="Purchase Order Tabs"
          sx={{ boxShadow: 5, borderRadius: 1 }}
        >
          <Tab label="Draft" id="purchase-order-main-tabpanel-0" />
          <Tab label="Approved" id="purchase-order-main-tabpanel-1" />
          <Tab label="Rejected" id="purchase-order-main-tabpanel-2" />
          <Tab label="Ordered" id="purchase-order-main-tabpanel-3" />
          <Tab label="Admin Approval" id="purchase-order-main-tabpanel-4" />
          <Tab
            label="Partially processed"
            id="purchase-order-main-tabpanel-5"
          />
          <Tab label="Processed" id="purchase-order-main-tabpanel-6" />
        </Tabs>
      </Box>

      <Box py={2} borderRadius={1} flex={'1 1 auto'}>
        <Outlet />
      </Box>
    </>
  );
};

export default PurchaseOrderTabs;
