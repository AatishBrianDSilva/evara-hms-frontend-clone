import React from 'react';
import ContentSection from '../../../components/ContentSection/ContentSection';
import { Box } from '@mui/material';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import { useGetStockValuesQuery } from '../../../services/pharmacyDashboardService/stockValuesApi';

interface StockRow {
  locationId: string;
  location: string;
  totalCost: number;
  totalMrp: number;
}

const StockValues: React.FC = () => {
  // Fetch all stock values without pagination
  const { data, isLoading } = useGetStockValuesQuery({ paginate: false });

  console.log('Stock Values', data);

  // Filter out any location with zero cost AND zero MRP
  const rows: StockRow[] = (data?.data?.records || []).filter(
    row => row.totalCost > 0 || row.totalMrp > 0,
  );

  const columns: GridColDef[] = [
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      field: 'totalCost',
      headerName: 'Total Cost',
      flex: 1,
      valueFormatter: params =>
        formatToIndianCurrencyFormat(params.value as number),
    },
    {
      field: 'totalMrp',
      headerName: 'MRP',
      flex: 1,
      valueFormatter: params =>
        formatToIndianCurrencyFormat(params.value as number),
    },
  ];

  return (
    <ContentSection title="Stock Values">
      <Box mt={2} flex="1 1 auto">
        <CustomDataGrid
          autoHeight
          rows={rows}
          columns={columns}
          loading={isLoading}
          getRowId={(row: StockRow) => row.locationId}
          rowHover
          hideFooter
        />
      </Box>
    </ContentSection>
  );
};

export default StockValues;
