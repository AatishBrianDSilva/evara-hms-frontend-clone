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
  Skeleton,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { useGetPurchaseOrderByIdQuery } from '../../../../services/pharmacyDashboardService/purchaseOrderApi';
import { IPurchaseOrderResponse } from '../../../../types/pharmacyDashboard/purchaseOrder';

interface ViewPurchaseOrderProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface Branch {
  branchName: string;
  code: string;
  manager: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

const PurchaseOrderSkeleton = () => {
  return (
    <Box padding={2}>
      <Typography variant="h6" gutterBottom>
        <Skeleton width="30%" />
      </Typography>
      <Skeleton width="25%" height={30} />
      <Skeleton width="50%" height={30} />
      <Skeleton width="90%" height={30} />
      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        <Skeleton width="40%" />
      </Typography>
      {Array.from({ length: 2 }).map((_, index) => (
        <Box key={index} marginTop={2}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Skeleton width="80%" height={30} />
              <Skeleton width="80%" height={30} />
              <Skeleton width="80%" height={30} />
            </Grid>
            <Grid item xs={6}>
              <Skeleton width="80%" height={30} />
              <Skeleton width="80%" height={30} />
              <Skeleton width="80%" height={30} />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        <Skeleton width="50%" />
      </Typography>
      {Array.from({ length: 5 }).map((_, index) => (
        <Box key={index} marginTop={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Skeleton width="100%" height={30} />
              <Skeleton width="50%" height={30} />
              <Skeleton width="50%" height={30} />
              <Skeleton width="50%" height={30} />
            </Grid>
          </Grid>
          <Divider sx={{ my: 1 }} />
        </Box>
      ))}
    </Box>
  );
};

const ViewAndPrintPurchaseOrder: React.FC<ViewPurchaseOrderProps> = ({
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

  console.log('Current Po', purchaseOrder);

  const columns: GridColDef[] = [
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

  const PurchaseOrderDetails: React.FC<{
    purchaseOrder: IPurchaseOrderResponse;
  }> = ({ purchaseOrder }) => {
    const branch = (purchaseOrder as any).branch as Branch | null;
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Vendor
        </Typography>
        <Typography variant="h6">
          {purchaseOrder.vendor.name} ({purchaseOrder.vendor.code})
        </Typography>
        <Typography variant="h6">
          {purchaseOrder.vendor.contact.person} -{' '}
          {purchaseOrder.vendor.contact.phone}
        </Typography>
        <Typography variant="h6">
          {purchaseOrder.vendor.address.addressLine1},{' '}
          {purchaseOrder.vendor.address.city}
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* <Typography variant="h4" gutterBottom>
          Ship To & Bill To
        </Typography> */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h4" gutterBottom>
              Bill To
            </Typography>
            {branch ? (
              <>
                <Typography variant="h6">
                  {branch.branchName} ({branch.code})
                </Typography>
                <Typography variant="h6">
                  {branch.manager} - {branch.phone}
                </Typography>
                <Typography variant="h6">
                  {branch.address.street}, {branch.address.city}
                </Typography>
                <Typography variant="h6">
                  {branch.address.state} - {branch.address.zip}
                </Typography>
              </>
            ) : (
              <Typography variant="h6">Invalid Billing Data</Typography>
            )}
          </Grid>
          {/* <Divider orientation="vertical" flexItem /> */}
          <Grid item xs={6}>
            <Typography variant="h4" gutterBottom>
              Ship To
            </Typography>
            {branch ? (
              <>
                <Typography variant="h6">
                  {branch.branchName} ({branch.code})
                </Typography>
                <Typography variant="h6">
                  {branch.manager} - {branch.phone}
                </Typography>
                <Typography variant="h6">
                  {branch.address.street}, {branch.address.city}
                </Typography>
                <Typography variant="h6">
                  {branch.address.state} - {branch.address.zip}
                </Typography>
              </>
            ) : (
              <Typography variant="h6">Invalid Shipping Data</Typography>
            )}
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">PO Number</Typography>
            <Typography>{purchaseOrder?.poNumber}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Date</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Date
            </Typography>
            <Typography variant="body1">
              {purchaseOrder?.date
                ? new Date(purchaseOrder.date).toLocaleDateString('en-GB')
                : '-'}
            </Typography>{' '}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Total Amount</Typography>
            <Typography>₹{totalAmount}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">GST No</Typography>
            <Typography>{purchaseOrder?.vendor.gst}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">TIN</Typography>
            <Typography>RCHE00911B</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
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
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, pl: 10 }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>
            Total: ₹{totalAmount}
          </Typography>
        </Box>
      </Box>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            .no-print {
              display: none;
            }
            @page {
              margin: 0;
            }
            body {
              margin: 1.6cm;
            }
          }
        `}
      </style>
      <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle color={'primary'}>Purchase Order</DialogTitle>
        <DialogContent>
          {isLoadingOrder ? (
            <PurchaseOrderSkeleton />
          ) : purchaseOrder ? (
            <PurchaseOrderDetails purchaseOrder={purchaseOrder as any} />
          ) : (
            <Typography>No purchase order data available.</Typography>
          )}
        </DialogContent>
        <DialogActions className="no-print">
          <Button color="primary" onClick={handlePrint}>
            Print
          </Button>
          <Button color="primary" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewAndPrintPurchaseOrder;
