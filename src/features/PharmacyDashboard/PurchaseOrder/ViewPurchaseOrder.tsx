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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useGetPurchaseOrderByIdQuery } from "../../../services/pharmacyDashboardService/purchaseOrderApi";
import { IPurchaseOrder } from "../../../types/pharmacyDashboard/purchaseOrder";

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
  return branch && typeof branch === "object" && "branchName" in branch && "code" in branch;
};

const isAddress = (address: any): address is Address => {
  return address && typeof address === "object" && "street" in address;
};

const PurchaseOrderSkeleton = () => {
  return <Box padding={2}>{/* Skeleton content */}</Box>;
};

const ViewPurchaseOrder: React.FC<ViewPurchaseOrderProps> = ({ openModal, onClose, id }) => {
  const { data: purchaseOrderData, isLoading, isFetching } = useGetPurchaseOrderByIdQuery(id);
  const purchaseOrder = purchaseOrderData?.data;
  const isLoadingOrder = isLoading || isFetching;

  console.log("Current PO", purchaseOrderData);

  const columns = [
    { field: "id", headerName: "#", flex: 0.5 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "noOfPacks", headerName: "No of Packs", flex: 1 },
    { field: "packSize", headerName: "Pack Size", flex: 1 },
    { field: "free", headerName: "Free Qty", flex: 1 },
    { field: "rate", headerName: "Rate/Pack", flex: 1 },
    { field: "amount", headerName: "MRP/Pack", flex: 1 },
    { field: "tax", headerName: "Tax(%)", flex: 1 },
    { field: "mrp", headerName: "Total", flex: 1 },
  ];

  const rows =
    purchaseOrder?.request.items.map((item, index) => {
      const mrp = item.mrp || 0;
      const taxPercentage = item.tax || 0;
      const taxAmount = (mrp * taxPercentage) / 100;
      const totalValue = mrp + taxAmount;

      return {
        id: index + 1,
        description: item.item?.name || "-",
        noOfPacks: item.noOfPacks || "-",
        packSize: item.packSize || "-",
        free: item.freeQuantity || "-",
        rate: item.mrpPerPack || "-",
        amount: item.buyPrice || "-",
        tax: taxPercentage,
        mrp: totalValue.toFixed(2),
      };
    }) || [];

  const totalAmount = purchaseOrder?.request.netAmount || "-";

  const PurchaseOrderDetails: React.FC<{ purchaseOrder: IPurchaseOrder }> = ({ purchaseOrder }) => {
    const branch = isBranch(purchaseOrder.branch) ? purchaseOrder.branch : null;
    const shipToAddress = purchaseOrder.isDifferentAddress
      ? purchaseOrder.newAddress
      : branch?.address;

    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Vendor
        </Typography>
        <Typography variant="h6">
          {purchaseOrder.vendor.name} ({purchaseOrder.vendor.code})
        </Typography>
        <Typography variant="h6">
          {purchaseOrder.vendor.contact.person} - {purchaseOrder.vendor.contact.phone}
        </Typography>
        <Typography variant="h6">
          {purchaseOrder.vendor.address.addressLine1}, {purchaseOrder.vendor.address.city}
        </Typography>
        <Divider sx={{ my: 2 }} />

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
          <Grid item xs={6}>
            <Typography variant="h4" gutterBottom>
              Ship To
            </Typography>
            {isAddress(shipToAddress) ? (
              <>
                {/* <Typography variant="h6">{purchaseOrder.newAddress?.branchName}</Typography> */}
                <Typography variant="h6">{shipToAddress.street}</Typography>
                <Typography variant="h6">{shipToAddress.city}</Typography>
                <Typography variant="h6">
                  {shipToAddress.state} - {shipToAddress.zip}
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
            <Typography>{new Date(purchaseOrder?.date).toLocaleDateString()}</Typography>
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
            <Typography>{purchaseOrder?.vendor.gst}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Purchase Order Details
        </Typography>
        <div style={{ width: "100%" }}>
          <DataGrid rows={rows} columns={columns} disableColumnMenu hideFooter autoHeight />
        </div>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, pl: 10 }}>
          <Typography sx={{ fontWeight: "bold" }}>Total: ₹{totalAmount}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Company TIN: {purchaseOrder.vendor.gst}</Typography>
      </Box>
    );
  };

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle color={"primary"}>Purchase Order</DialogTitle>
      <DialogContent>
        {isLoadingOrder ? (
          <PurchaseOrderSkeleton />
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
