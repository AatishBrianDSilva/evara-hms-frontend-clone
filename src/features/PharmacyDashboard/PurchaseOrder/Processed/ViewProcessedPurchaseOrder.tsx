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
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { useGetPurchaseOrderByIdQuery } from "../../../../services/pharmacyDashboardService/purchaseOrderApi";
import { IPurchaseOrder } from "../../../../types/pharmacyDashboard/purchaseOrder";

interface ViewProcessedPurchaseOrderProps {
  openModal: boolean;
  onClose: () => void;
  id: string; // response._id
  purchaseOrderId: string; // purchaseOrder._id
}

interface IPurchaseOrderWithResponses extends IPurchaseOrder {
  responses: any[];
}

const ViewProcessedPurchaseOrder: React.FC<ViewProcessedPurchaseOrderProps> = ({
  openModal,
  onClose,
  id,
  purchaseOrderId,
}) => {
  const {
    data: purchaseOrderData,
    isLoading,
    isFetching,
  } = useGetPurchaseOrderByIdQuery(purchaseOrderId);
  const purchaseOrder = purchaseOrderData?.data;
  const isLoadingOrder = isLoading || isFetching;

  // console.log("Processed PO", purchaseOrder);

  // Find the specific response using response._id
  const response = (purchaseOrder as IPurchaseOrderWithResponses)?.responses?.find(
    (res: any) => res._id === id
  );
  // console.log("Response", response);

  // Check if purchaseOrder and response items are defined
  const rows =
    response?.items?.map((item: any, index: number) => {
      const noOfPacks = item.noOfPacks ?? 0;
      const buyPrice = item.buyPrice ?? 0;
      const discount = item.discount ?? 0;
      const taxPercentage = item.tax ?? 0;

      // Calculate total amount before tax
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
        description: item.item?.name || "-",
        noOfPacks: noOfPacks || "-",
        packSize: item.packSize || "-",
        totalQuantity: item.quantity || "-",
        free: item.freeQuantity || "-",
        rate: item.mrpPerPack || "-",
        amount: buyPrice || "-",
        tax: taxPercentage,
        batchNo: item.batchNo || "-",
        discount: discount || "-",
        totalAmount: totalBeforeTax.toFixed(2),
        mrp: Math.round(totalWithTax), // Updated calculation with tax and discount applied
      };
    }) || [];

  const totalAmount = (
    rows.reduce((acc: any, row: any) => acc + parseFloat(row.mrp), 0) +
    (response?.otherCharges || 0)
  ).toFixed(2);

  const columns: GridColDef[] = [
    { field: "id", headerName: "#", flex: 0.5 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "noOfPacks", headerName: "Quantity", flex: 1 },

    { field: "free", headerName: "Free Qty", flex: 1 },

    { field: "amount", headerName: "Rate", flex: 1 },

    { field: "totalAmount", headerName: "Amount", flex: 1 },
    { field: "discount", headerName: "Discount(%)", flex: 1 },
    { field: "tax", headerName: "Tax(%)", flex: 1 },
    { field: "mrp", headerName: "Total", flex: 1 },
  ];

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle color={"primary"}>Purchase Order Details</DialogTitle>
      <DialogContent>
        {isLoadingOrder ? (
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
        ) : (
          <Box>
            <Typography variant="h4" gutterBottom>
              {purchaseOrder?.poNumber}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Date
                </Typography>
                <Typography variant="body1">
                  {purchaseOrder?.date
                    ? new Date(purchaseOrder.date).toLocaleDateString("en-GB")
                    : "-"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Total Amount</Typography>
                <Typography>₹{Math.round(totalAmount)}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Status</Typography>
                <Typography>{purchaseOrder?.status}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Vendor Name</Typography>
                <Typography>{purchaseOrder?.vendor.name}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Created By</Typography>
                <Typography>{purchaseOrder?.createdBy}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Authorized By</Typography>
                <Typography>{purchaseOrder?.authorizedBy}</Typography>
              </Grid>
              {response?.invoiceNumber && (
                <Grid item xs={12} md={4}>
                  <Typography variant="h6">Invoice Number</Typography>
                  <Typography>{response.invoiceNumber}</Typography>
                </Grid>
              )}
            </Grid>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Purchase Order Details
            </Typography>
            <div style={{ width: "100%" }}>
              <DataGrid rows={rows} columns={columns} disableColumnMenu hideFooter autoHeight />
            </div>
          </Box>
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

export default ViewProcessedPurchaseOrder;
