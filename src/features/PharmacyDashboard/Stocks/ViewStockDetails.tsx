import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Skeleton, Typography } from '@mui/material'
import React from 'react'
import { useGetStockByIdQuery } from '../../../services/pharmacyDashboardService/stocksApi'
import StockDetails from './StockDetails';

interface ViewStockProps {
  openModal: boolean
  onClose: () => void,
  id: string,
}

const StockSkeleton = () => (
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


const ViewStock: React.FC<ViewStockProps> = ({ openModal, onClose, id }) => {

  const { data: StockData, isLoading: isStockLoading, isFetching: isStockFetching } = useGetStockByIdQuery(id)
  const stock = StockData?.data
  const stockLoading = isStockLoading || isStockFetching

  console.log("🚀 ~ stocks:", stock);

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle color={"primary"}>Stock Details</DialogTitle>
      <DialogContent>
        {stockLoading || !stock ? <StockSkeleton /> : <StockDetails stock={stock} />}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )

}

export default ViewStock