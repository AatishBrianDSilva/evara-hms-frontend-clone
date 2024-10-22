import React from "react";
import { Drawer, List, Typography } from "@mui/material";
import NestedList, { NestedListItem } from "./NestedList";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const AnalyticsSidebar: React.FC = () => {
  const menuItems: NestedListItem[] = [
    // {
    //   icon: CorporateFareIcon,
    //   primaryText: "Appointment",
    //   children: [
    //     {
    //       icon: FiberManualRecordIcon,
    //       primaryText: "Previous Appointment",
    //       path: "/analytics/appointment/previous-appointment",
    //     },
    //     {
    //       icon: FiberManualRecordIcon,
    //       primaryText: "Upcoming Appointment",
    //       path: "/analytics/appointment/upcoming-appointment",
    //     },
    //   ],
    // },
    // {
    //   icon: CorporateFareIcon,
    //   primaryText: "Patient",
    //   children: [
    //     {
    //       icon: FiberManualRecordIcon,
    //       primaryText: "Patients",
    //       path: "/analytics/patient/patients",
    //     },
    //     {
    //       icon: FiberManualRecordIcon,
    //       primaryText: "Donors",
    //       path: "/analytics/patient/donors",
    //     },
    //   ],
    // },
    // {
    //   icon: CorporateFareIcon,
    //   primaryText: "Treatment",
    //   children: [
    //     {
    //       icon: FiberManualRecordIcon,
    //       primaryText: "Treatment History",
    //       path: "/analytics/treatment/history",
    //     },
    //   ],
    // },
    {
      icon: CorporateFareIcon,
      primaryText: "Billings",
      children: [
        {
          icon: FiberManualRecordIcon,
          primaryText: "Patient Billings",
          path: "/analytics/billings/Patientbillings",
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: "Refund Reports",
          path: "/analytics/billings/RefundReports",
        },
        // {
        //   icon: FiberManualRecordIcon,
        //   primaryText: "Billings Transactions",
        //   path: "/analytics/billings/BillingsTransactions",
        // },
      ],
    },
    {
      icon: CorporateFareIcon,
      primaryText: "Pharmacy",
      children: [
        // {
        //   icon: FiberManualRecordIcon,
        //   primaryText: "Expiring Pharmacy Stocks",
        //   path: "/analytics/pharmacy/expiring-stocks",
        // },
        {
          icon: FiberManualRecordIcon,
          primaryText: "Pharmacy Reports",
          path: "/analytics/pharmacy/pharmacy-reports",
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: "Purchase Order Reports",
          path: "/analytics/pharmacy/purchase-order-reports",
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: "Sale By Schedule",
          path: "/analytics/pharmacy/sale-by-schedule-reports",
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: "Internal Consumption",
          path: "/analytics/pharmacy/internal-consumption-reports",
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: "Drugs And Vendors",
          path: "/analytics/pharmacy/drugs-and-vendors-reports",
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: "Patient Return",
          path: "/analytics/pharmacy/patient-return-reports",
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: "Stock Summary",
          path: "/analytics/pharmacy/stock-summary-reports",
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: "Expiry Details",
          path: "/analytics/pharmacy/expiry-details",
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: "Critical Stocks",
          path: "/analytics/pharmacy/critical-stocks",
        },
      ],
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          top: "65px",
          left: "6px",
          height: "calc(100vh - 80px)",
          boxSizing: "border-box",
          borderRadius: 1,
        },
      }}
      PaperProps={{
        elevation: 2,
      }}
    >
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <Typography
            textAlign="center"
            variant="button"
            color="primary"
            fontSize={20}
            p={1}
            component="div"
            id="nested-list-subheader"
          >
            Analytics
          </Typography>
        }
      >
        <NestedList items={menuItems} />
      </List>
    </Drawer>
  );
};

export default AnalyticsSidebar;
