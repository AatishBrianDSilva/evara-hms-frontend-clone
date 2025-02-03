import React, { useCallback, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import ContentSection from '../../../components/ContentSection/ContentSection';
import AddInternalConsumption from './AddInternalConsumption';
import { useGetStocksQuery } from '../../../services/pharmacyDashboardService/stocksApi';
import { useGetInternalConsumptionsQuery } from '../../../services/pharmacyDashboardService/internalConsumptionApi';
import _ from 'lodash';

interface InternalConsumptionRecord {
  _id: string;
  icNumber: string;
  date: Date;
  quantity: number;
  notes: string;
  drugLocation: string;
  drugName: string;
  batchNo: string;
  transferredBy: string;
  patientName: string;
}

const InternalConsumption: React.FC = () => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const {
    data: internalConsumptionData,
    isLoading: internalConsumptionLoading,
    isFetching: internalConsumptionFetching,
  } = useGetInternalConsumptionsQuery({
    paginate: true,
    page,
    limit: pageSize,
    sort: { updatedAt: -1 },
    searchQuery,
  });

  console.log('Internal Consumption API Response:', internalConsumptionData);

  const internalConsumptionsLoading =
    internalConsumptionLoading || internalConsumptionFetching;

  // Extract and use data directly without memoization
  const internalConsumptions =
    internalConsumptionData?.data?.records.map((record, index) => ({
      ...record,
      uniqueRowKey: `${record.icNumber}-${record.batchNo}-${record.drugName || 'no-drugName'}-${index}`,
    })) || [];

  console.log('Transformed Internal Consumption Data:', internalConsumptions);

  const openTransferModal = () => {
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

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

  // Generate a unique row ID using icNumber, batchNo, and drugName
  const getRowId = (row: InternalConsumptionRecord) => row.uniqueRowKey;

  const columns: GridColDef[] = [
    {
      field: 'drugLocation',
      headerName: 'Drug Location',
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
      valueFormatter(params) {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: 'drugName',
      headerName: 'Drug Name',
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      field: 'batchNo',
      headerName: 'Batch No',
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      field: 'patientName',
      headerName: 'Patient Name',
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      flex: 2,
      minWidth: 200,
      maxWidth: 300,
    },
    {
      field: 'transferredBy',
      headerName: 'Transferred By',
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
    },
  ];

  // Fetch stocks for adding new consumption records
  const { data: stocksData } = useGetStocksQuery();
  const stocks = stocksData?.data || [];

  return (
    <ContentSection title="Internal Consumption">
      <Box display="flex" justifyContent="end" alignItems="center" gap={2}>
        <TextField
          label="Search"
          placeholder="Item Name, Batch Number"
          size="small"
          variant="outlined"
          onChange={e => debouncedSearchChange(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={openTransferModal}>
          + Add Item
        </Button>
      </Box>

      <Box mt={2} flex={'1 1 auto'} width="100%">
        <CustomDataGrid
          autoHeight={false}
          columns={columns}
          rows={internalConsumptions}
          getRowId={getRowId}
          page={page}
          pageSize={pageSize}
          totalRows={internalConsumptionData?.data?.pagination?.totalDocs || 0}
          loading={internalConsumptionsLoading}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      {isTransferModalOpen && (
        <AddInternalConsumption
          open={isTransferModalOpen}
          onClose={closeTransferModal}
          pharmacyStock={stocks}
        />
      )}
    </ContentSection>
  );
};

export default InternalConsumption;
