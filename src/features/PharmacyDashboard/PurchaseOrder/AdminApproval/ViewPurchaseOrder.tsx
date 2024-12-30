import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  Grid,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { useGetPurchaseOrderByIdQuery } from '../../../../services/pharmacyDashboardService/purchaseOrderApi';
import { IPurchaseOrder } from '../../../../types/pharmacyDashboard/purchaseOrder';

interface ViewPurchaseOrderProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface Branch {
  branchName: string;
  code: string;
  manager: string;
  phone: string;
  address: Address;
}

const isBranch = (branch: any): branch is Branch => {
  return (
    branch &&
    typeof branch === 'object' &&
    'branchName' in branch &&
    'code' in branch
  );
};

const isAddress = (address: any): address is Address => {
  return address && typeof address === 'object' && 'street' in address;
};

const ViewPurchaseOrder: React.FC<ViewPurchaseOrderProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const {
    data: purchaseOrderData,
    isLoading,
    isFetching,
  } = useGetPurchaseOrderByIdQuery(id);
  const purchaseOrder = purchaseOrderData?.data;
  const isLoadingOrder = isLoading || isFetching;

  const columns = [
    { field: 'id', headerName: '#', flex: 0.5 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'noOfPacks', headerName: 'Quantity', flex: 1 },

    { field: 'free', headerName: 'Free Qty', flex: 1 },

    { field: 'amount', headerName: 'Rate', flex: 1 },

    { field: 'totalAmount', headerName: 'Amount', flex: 1 },
    { field: 'discount', headerName: 'Discount(%)', flex: 1 },
    { field: 'tax', headerName: 'Tax(%)', flex: 1 },
    { field: 'mrp', headerName: 'Total', flex: 1 },
  ];
  const rows =
    purchaseOrder?.request.items.map((item, index) => {
      const noOfPacks = item.noOfPacks ?? 0;
      const buyPrice = item.buyPrice ?? 0;
      const discount = item.discount ?? 0;
      const taxPercentage = item.tax ?? 0;

      // Calculate the total amount before tax
      const totalBeforeTax = noOfPacks * buyPrice;

      // Apply discount
      const discountAmount = (totalBeforeTax * discount) / 100;
      const totalAfterDiscount = totalBeforeTax - discountAmount;

      // Apply tax
      const taxAmount = (totalAfterDiscount * taxPercentage) / 100;

      // Final total with tax included
      const totalWithTax = totalAfterDiscount + taxAmount;

      return {
        id: index + 1,
        description: item.item?.name || '-',
        noOfPacks: noOfPacks || '-',
        packSize: item.packSize || '-',
        totalQuantity: item.quantity || '-',
        free: item.freeQuantity || '-',
        rate: item.mrpPerPack || '-',
        amount: buyPrice || '-',
        tax: taxPercentage || '-',
        discount: discount || '-',
        totalAmount: totalBeforeTax.toFixed(2) || '-',

        mrp: totalWithTax.toFixed(2) || '-',
      };
    }) || [];

  const totalAmount = purchaseOrder?.request.netAmount || '-';

  const PurchaseOrderDetails: React.FC<{ purchaseOrder: IPurchaseOrder }> = ({
    purchaseOrder,
  }) => {
    const branch = isBranch(purchaseOrder.branch) ? purchaseOrder.branch : null;
    const shipToAddress = purchaseOrder.isDifferentAddress
      ? purchaseOrder.newAddress
      : branch?.address;

    return (
      <Box sx={{ padding: 3 }}>
        {/* Vendor Details */}
        <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
          Vendor
        </Typography>
        <Typography variant="body1">
          {purchaseOrder.vendor.name} ({purchaseOrder.vendor.code})
        </Typography>
        <Typography variant="body1">
          {purchaseOrder.vendor.contact.person} -{' '}
          {purchaseOrder.vendor.contact.phone}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {purchaseOrder.vendor.address.addressLine1},{' '}
          {purchaseOrder.vendor.address.city}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Bill To and Ship To Details */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
              Bill To
            </Typography>
            {branch ? (
              <>
                <Typography variant="body1">
                  {branch.branchName} ({branch.code})
                </Typography>
                <Typography variant="body1">
                  {branch.manager} - {branch.phone}
                </Typography>
                <Typography variant="body1">
                  {branch.address.street}, {branch.address.city}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {branch.address.state} - {branch.address.zip}
                </Typography>
              </>
            ) : (
              <Typography variant="body1">Invalid Billing Data</Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
              Ship To
            </Typography>
            {isAddress(shipToAddress) ? (
              <>
                <Typography variant="body1">{shipToAddress.street}</Typography>
                <Typography variant="body1">{shipToAddress.city}</Typography>
                <Typography variant="body1" gutterBottom>
                  {shipToAddress.state} - {shipToAddress.zip}
                </Typography>
              </>
            ) : (
              <Typography variant="body1">Invalid Shipping Data</Typography>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Purchase Order Information */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              PO Number
            </Typography>
            <Typography variant="body1">{purchaseOrder?.poNumber}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Date
            </Typography>
            <Typography variant="body1">
              {purchaseOrder?.date
                ? new Date(purchaseOrder.date).toLocaleDateString('en-GB')
                : '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Total Amount
            </Typography>
            <Typography variant="body1">₹{totalAmount}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              GST No
            </Typography>
            <Typography variant="body1">{purchaseOrder?.vendor.gst}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              TIN
            </Typography>
            <Typography>RCHE00911B</Typography>{' '}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Purchase Order Details Table */}
        <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
          Purchase Order Details
        </Typography>
        <div style={{ width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            hideFooter
            autoHeight
          />
        </div>

        {/* Total */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Total: ₹{totalAmount}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
      </Box>
    );
  };

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle color="primary">Purchase Order</DialogTitle>
      <DialogContent>
        {isLoadingOrder ? (
          <Typography>Loading...</Typography>
        ) : purchaseOrder ? (
          <PurchaseOrderDetails purchaseOrder={purchaseOrder} />
        ) : (
          <Typography>No purchase order data available.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewPurchaseOrder;
