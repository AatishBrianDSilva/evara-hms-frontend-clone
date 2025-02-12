import React, { useCallback, useState } from 'react';
import { Box, TextField } from '@mui/material';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import _ from 'lodash';
import { useGetBatchWisePaginatedStocksQuery } from '../../../services/pharmacyDashboardService/stocksApi';
import ContentSection from '../../../components/ContentSection/ContentSection';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';

const STOCK_LOCATIONS = [
  'OPD Pharmacy',
  'OT Pharmacy',
  'Central Pharmacy',
  'IVF Pharmacy',
  'Internal Stock',
  'Recovery Pharmacy',
];

interface LocationQuantities {
  [key: string]: number; // Dynamic keys with number values
  Other: number;
}

const Stocks: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // API call for fetching batch-wise stocks
  const {
    data: stocksData,
    isLoading: stocksLoading,
    isFetching: stocksFetching,
  } = useGetBatchWisePaginatedStocksQuery({
    paginate: true,
    page,
    limit: pageSize,
    sort: { updatedAt: -1 },
    searchQuery,
  });

  const stocks = stocksData?.data?.records || [];
  const pagination = stocksData?.data?.pagination;
  const loading = stocksLoading || stocksFetching;

  console.log('Batchwise Data', stocksData);

  // Search handling with debounce
  const handleSearchChange = useCallback((query: string) => {
    setPage(1); // Reset to page 1
    setSearchQuery(query);
  }, []);

  const debouncedSearchChange = useCallback(
    _.debounce(handleSearchChange, 500),
    [handleSearchChange],
  );

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newPageSize: number) =>
    setPageSize(newPageSize);

  // Helper to organize quantities by location
  const getLocationQuantities = (
    quantityAtLocation: any[],
  ): LocationQuantities => {
    const locationData: Record<string, number> = {};
    let otherQuantity = 0;

    STOCK_LOCATIONS.forEach(location => {
      locationData[location] = 0; // Initialize all defined locations
    });

    quantityAtLocation.forEach(({ locationName, quantity }) => {
      if (STOCK_LOCATIONS.includes(locationName)) {
        locationData[locationName] += quantity;
      } else {
        otherQuantity += quantity; // Accumulate quantities for 'Other'
      }
    });

    return { ...locationData, Other: otherQuantity };
  };

  // Define the columns for the DataGrid
  const columnsConfig: GridColDef[] = [
    { field: 'batchNo', headerName: 'Batch Number', flex: 1 },
    { field: 'itemName', headerName: 'Item Name', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      flex: 1,
      valueFormatter: params => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
      },
    },
    ...STOCK_LOCATIONS.map(location => ({
      field: location,
      headerName: location,
      flex: 1,
      valueGetter: (params: { row: { quantityAtLocation: any[] } }) =>
        getLocationQuantities(params.row.quantityAtLocation)[location] || 0,
    })),
    {
      field: 'Other',
      headerName: 'Other',
      flex: 1,
      valueGetter: params =>
        getLocationQuantities(params.row.quantityAtLocation).Other,
    },
    {
      field: 'sellPrice',
      headerName: 'Sell Price',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    { field: 'totalQuantity', headerName: 'Total Quantity', flex: 1 },
  ];

  return (
    <ContentSection title="Stocks">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Item Name, Batch Number"
          size="small"
          variant="outlined"
          onChange={e => debouncedSearchChange(e.target.value)}
        />
      </Box>

      {/* Data Grid */}
      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={stocks}
          getRowId={row => `${row.batchNo}-${row.itemName}-${row.expiryDate}`}
          page={page}
          pageSize={pageSize}
          totalRows={pagination?.totalDocs || 0}
          loading={loading}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>
    </ContentSection>
  );
};

export default Stocks;
