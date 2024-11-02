import React from 'react';
import { Drawer, List, Typography } from '@mui/material';
import NestedList, { NestedListItem } from './NestedList';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import WalletIcon from '@mui/icons-material/Wallet';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';

const PharmacySidebar: React.FC = () => {
  const menuItems: NestedListItem[] = [
    {
      icon: CorporateFareIcon,
      primaryText: 'Masters',
      children: [
        {
          icon: FiberManualRecordIcon,
          primaryText: 'Drug Item',
          path: '/pharmacy/masters/drug-item',
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: 'Drug Types',
          path: '/pharmacy/masters/drug-types',
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: 'Drug Categories',
          path: '/pharmacy/masters/drug-categories',
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: 'Drug Manufacturer',
          path: '/pharmacy/masters/drug-manufacturer',
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: 'Drug Supplier',
          path: '/pharmacy/masters/drug-vendors',
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: 'Drug Locations',
          path: '/pharmacy/masters/drug-locations',
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: 'Tax Brackets',
          path: '/pharmacy/masters/tax-brackets',
        },
      ],
    },
    {
      icon: WalletIcon,
      primaryText: 'Purchase Order',
      path: '/pharmacy/purchase-order',
    },
    {
      icon: InventoryIcon,
      primaryText: 'Orders',
      path: '/pharmacy/orders',
    },
    {
      icon: LabelImportantIcon,
      primaryText: 'Internal Consumption',
      path: '/pharmacy/internal-consumption',
    },
    {
      icon: ReceiptIcon,
      primaryText: 'Vendor Invoices',
      path: '/pharmacy/invoices',
    },
    {
      icon: InventoryIcon,
      primaryText: 'Stocks',
      path: '/pharmacy/stocks',
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          top: '65px',
          left: '6px',
          height: 'calc(100vh - 80px)',
          boxSizing: 'border-box',
          borderRadius: 1,
        },
      }}
      PaperProps={{
        elevation: 2,
      }}
    >
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <Typography
            textAlign={'center'}
            variant="button"
            color={'primary'}
            fontSize={20}
            p={1}
            component="div"
            id="nested-list-subheader"
          >
            PHARMACY
          </Typography>
        }
      >
        <NestedList items={menuItems} />
      </List>
    </Drawer>
  );
};

export default PharmacySidebar;
