import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import React from 'react';
import { useGetPurchaseOrderByIdQuery } from '../../../services/pharmacyDashboardService/purchaseOrderApi';
import { IPurchaseOrder } from '../../../types/pharmacyDashboard/purchaseOrder';

interface ViewPurchaseOrderProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

const PurchaseOrderSkeleton = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      <Skeleton width="40%" />
    </Typography>
    {[...Array(3)].map((_, index) => (
      <Skeleton key={index} height={30} style={{ marginBottom: 6 }} />
    ))}
    <Divider sx={{ my: 2 }} />

    <Typography variant="h6" gutterBottom>
      <Skeleton width="60%" />
    </Typography>
    <Grid container spacing={2}>
      {[...Array(2)].map((_, index) => (
        <Grid item xs={6} key={index}>
          {[...Array(4)].map((_, subIndex) => (
            <Skeleton key={subIndex} height={30} style={{ marginBottom: 6 }} />
          ))}
        </Grid>
      ))}
    </Grid>
    <Divider sx={{ my: 2 }} />

    <Typography variant="h6" gutterBottom>
      <Skeleton width="50%" />
    </Typography>
    {[...Array(5)].map((_, index) => (
      <Grid container key={index} spacing={2}>
        {[...Array(3)].map((_, subIndex) => (
          <Grid item xs={4} key={subIndex}>
            <Skeleton height={30} style={{ marginBottom: 6 }} />
          </Grid>
        ))}
        <Divider sx={{ my: 1, width: '100%' }} />
      </Grid>
    ))}
  </Box>
);

const ViewPurchaseOrder: React.FC<ViewPurchaseOrderProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const {
    data: purchaseOrderData,
    isLoading: isPurchaseOrderLoading,
    isFetching: isPurchaseorderFetching,
  } = useGetPurchaseOrderByIdQuery(id);
  const purchaseOrder = purchaseOrderData?.data;
  const purchaseOrderLoading =
    isPurchaseOrderLoading || isPurchaseorderFetching;

  const PurchaseOrderDetails: React.FC<{ purchaseOrder: IPurchaseOrder }> = ({
    purchaseOrder,
  }) => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Vendor Information
        </Typography>
        <Typography>
          {purchaseOrder.vendor.name} ({purchaseOrder.vendor.code})
        </Typography>
        <Typography>
          {purchaseOrder.vendor.contact.person} -{' '}
          {purchaseOrder.vendor.contact.phone}
        </Typography>
        <Typography>
          {purchaseOrder.vendor.address.addressLine1},{' '}
          {purchaseOrder.vendor.address.city}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Purchase Order Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>PO Number: {purchaseOrder.poNumber}</Typography>
            <Typography>
              Date: {new Date(purchaseOrder.date).toLocaleDateString()}
            </Typography>
            <Typography>Status: {purchaseOrder.status}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              Net Amount: ₹{purchaseOrder.request.netAmount}
            </Typography>
            <Typography>Discount: ₹{purchaseOrder.request.discount}</Typography>
            <Typography>
              Other Charges: ₹{purchaseOrder.request.otherCharges}
            </Typography>
            <Typography>
              Sub Total: ₹{purchaseOrder.request.subTotal}
            </Typography>
            <Typography>Tax: ₹{purchaseOrder.request.tax}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Items
        </Typography>
        {purchaseOrder.request.items.map((item, index) => (
          <Grid container key={index} spacing={2}>
            <Grid item xs={4}>
              <Typography>Name: {item?.item?.name}</Typography>
              <Typography>Pack Size: {item?.packSize}</Typography>
              <Typography>Quantity: {item?.quantity}</Typography>
              <Typography>MRP: ₹{item?.mrp}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Buy Price: ₹{item.buyPrice}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Tax: ₹{item.tax}</Typography>
            </Grid>
            <Divider sx={{ my: 1, width: '100%' }} />
          </Grid>
        ))}
      </Box>
    );
  };

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle color={'primary'}>Purchase Order</DialogTitle>
      <DialogContent>
        {purchaseOrderLoading || !purchaseOrder ? (
          <PurchaseOrderSkeleton />
        ) : (
          <PurchaseOrderDetails purchaseOrder={purchaseOrder} />
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
