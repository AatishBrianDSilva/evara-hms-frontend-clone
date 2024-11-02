import React from 'react';
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
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useGetInternalOrderByIdQuery } from '../../../services/pharmacyDashboardService/internalOrderApi';

interface ViewInternalOrderProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

// const ItemBox = styled(Box)(({ theme }) => ({
//   marginBottom: theme.spacing(2),
//   padding: theme.spacing(2),
//   border: `1px solid ${theme.palette.grey[300]}`,
//   borderRadius: theme.shape.borderRadius,
// }));

// const BatchBox = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(1),
//   border: `1px solid ${theme.palette.grey[300]}`,
//   borderRadius: theme.shape.borderRadius,
//   margin: `${theme.spacing(1)} 0`,
//   backgroundColor: theme.palette.background.paper,
// }));

const InternalOrderSkeleton = () => {
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

const ViewInternalOrder: React.FC<ViewInternalOrderProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const theme = useTheme();

  const {
    data: internalOrderData,
    isLoading,
    isFetching,
  } = useGetInternalOrderByIdQuery(id);
  const internalOrder = internalOrderData?.data;
  const isLoadingOrder = isLoading || isFetching;

  const columns = [
    { field: 'itemName', headerName: 'Item', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
    { field: 'batchId', headerName: 'Batch ID', flex: 1 },
    { field: 'deductedQuantity', headerName: 'Deducted Quantity', flex: 1 },
    { field: 'transferFrom', headerName: 'Transfer From', flex: 1 },
    { field: 'transferTo', headerName: 'Transfer To', flex: 1 },
    { field: 'notes', headerName: 'Notes', flex: 1 },
  ];

  const rows =
    internalOrder?.items.flatMap((item, index) =>
      item?.batches.map((batch, batchIndex) => ({
        id: `${index + 1}-${batchIndex + 1}`,
        itemName: item?.item.item.name,
        quantity: item?.quantity,
        batchId: batch?.batchId,
        deductedQuantity: batch?.deductedQuantity,
        transferFrom: item.transferFrom?.location?.location,
        transferTo: item.transferTo?.location,
        notes: item?.notes || 'No notes',
      })),
    ) || [];

  console.log(internalOrder);

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        Internal Order Details
      </DialogTitle>
      <DialogContent sx={{ p: theme.spacing(3) }}>
        {isLoadingOrder ? (
          <InternalOrderSkeleton />
        ) : internalOrder ? (
          <Box pt={2}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: theme.palette.secondary.main }}
            >
              Order Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography>IO Number: {internalOrder.ioNumber}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>
                  Date: {new Date(internalOrder.date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>Status: {internalOrder.status}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>Branch ID: {internalOrder.branchId}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>Created By: {internalOrder.createdBy}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>
                  Authorized By:{' '}
                  {internalOrder.authorizedBy || 'Not yet authorized'}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />

            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: theme.palette.secondary.main }}
            >
              Items Details
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
            {/*
            {internalOrder.items.map((item, index) => (
              <ItemBox key={index}>
                <Typography>Item: {item?.item.item.name}</Typography>
                <Typography>Quantity: {item?.quantity}</Typography>
                {item?.batches.map((batch, batchIndex) => (
                  <BatchBox key={batchIndex}>
                    <Typography>Batch ID: {batch?.batchId}</Typography>
                    <Typography>Deducted Quantity: {batch?.deductedQuantity}</Typography>
                  </BatchBox>
                ))}
                <Typography>Transfer From: {item.transferFrom?.location?.location}</Typography>
                <Typography>Transfer To: {item.transferTo?.location}</Typography>
                <Typography>Note: {item?.notes || 'No notes'}</Typography>
                <Divider sx={{ my: 1 }} />
              </ItemBox>
            ))}
            */}
          </Box>
        ) : (
          <Typography>No order data available.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ backgroundColor: theme.palette.background.default }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewInternalOrder;
