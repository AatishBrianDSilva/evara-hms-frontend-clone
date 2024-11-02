import React from 'react';
import { Card, CardContent, Typography, Divider, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IPaginatedPharmacyStock } from '../../../types/pharmacyDashboard/stocks';

interface StockDetailsProps {
  stock: IPaginatedPharmacyStock;
}

const StockDetails: React.FC<StockDetailsProps> = ({ stock }) => {
  const columns = [
    { field: 'index', headerName: '#', flex: 0.3 },
    { field: 'batchNo', headerName: 'Batch No', flex: 1 },
    { field: 'expiryDate', headerName: 'Expiry Date', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
  ];

  const rows = stock.batches.flatMap((batch, batchIndex) =>
    batch.locations.map((location, locIndex) => ({
      id: `${batchIndex}-${locIndex}`,
      index: batchIndex + 1,
      batchNo: batch.batchNo,
      expiryDate: new Date(batch.expiryDate).toLocaleDateString(),
      location: location.location.location,
      quantity: location.quantity,
    })),
  );

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {stock.item.name} - {stock.item?.type?.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Code: {stock.item.code} | HSN: {stock.item.hsnCode}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Pack Size: {stock.item.packSize} | Category:{' '}
          {stock.item.category.name}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6" pt={2} pb={2}>
          {' '}
          Stock Details
        </Typography>
        <Box sx={{ width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            hideFooter
            autoHeight
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StockDetails;
