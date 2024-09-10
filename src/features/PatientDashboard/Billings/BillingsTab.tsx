import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React from "react";

import { Outlet, useParams } from "react-router-dom";
import useTabNavigation from "../../../hooks/useTabNavigation";
import { EBillingsTabPaths } from "../../../types/global";

const BillingsTab: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const basePath = `/patient/${id}/billings`;
  const { activeTab, handleTabChange } = useTabNavigation(
    basePath,
    Object.values(EBillingsTabPaths)
  );

  return (
    <>
      <Tabs
        centered
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="Billings Tabs"
      >
        <Tab iconPosition="top" label="Estimation" id="billings-tabpanel-0" />
        <Tab iconPosition="top" label="Pending" id="billings-tabpanel-1" />
        {/* <Tab iconPosition="top" label="Advance" id="billings-tabpanel-2" /> */}
        <Tab iconPosition="top" label="Paid" id="billings-tabpanel-4" />
        <Tab iconPosition="top" label="Refund" id="billings-tabpanel-3" />
        {/* <Tab iconPosition="top" label="Archived" id="billings-tabpanel-5" /> */}
        {/* <Tab iconPosition="top" label="Transactions" id="billings-tabpanel-6" /> */}
      </Tabs>

      <Box p={2} display={"flex"} flexDirection={"column"} flex={1}>
        <Outlet />
      </Box>
    </>
  );
};

export default BillingsTab;
