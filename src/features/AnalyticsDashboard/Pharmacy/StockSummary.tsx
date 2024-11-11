import React, { useCallback, useState } from 'react';
import ContentSection from '../../../components/ContentSection/ContentSection';
import { Box, Button, Grid, TextField } from '@mui/material';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { useGetStockSummaryQuery } from '../../../services/analyticsDashboardService/pharmacy/stockSummaryApi';
import { exportToCSV } from '../../../utils/exportCSV';
import _ from 'lodash';

const StockSummaryReports: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [drugName, setDrugName] = useState<string>('');

  // Handle search input for drug name with debounce
  const handleNameChange = useCallback(
    _.debounce((query: string) => {
      setDrugName(query);
    }, 500),
    [],
  );

  // Fetch data from the API with dynamic query parameters
  const { data, isLoading } = useGetStockSummaryQuery({
    page: pageSize === -1 ? undefined : page, // If "All" is selected, remove page parameter
    limit: pageSize === -1 ? undefined : pageSize, // If "All" is selected, remove limit parameter
    filters: {
      drugName, // Filter by drug name
    },
    paginate: pageSize !== -1, // Set pagination to false if "All" is selected
  });

  console.log('Stock Summary Data:', data);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) newPage = 1; // Ensure page doesn't go below 1
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleDownloadCSV = () => {
    if (data?.data?.records && data.data.records.length > 0) {
      // Define the headers for the CSV file
      const headers = [
        'S No',
        'Centre',
        'Drug Category',
        // "Drug Cat Code",
        'Drug Name',
        'Drug Code',
        'Central',
        'OPD',
        'OT',
        'Recovery',
        'IVF',
        'Returns',
        'Internal',
        // "Staging",
        // "Other",
        'Total Qty',
      ];

      // Format the data for CSV export
      const formattedData = data.data.records.map(record => ({
        serialNumber: record.serialNumber || 'N/A',
        centre: record.centre || 'N/A',
        drugCategory: record.drugCategory || 'N/A',
        // drugCatCode: record.drugCatCode || "N/A",
        drugName: record.drugName || 'N/A',
        drugCode: record.drugCode || 'N/A',
        Central: record.Central || 0, // Use field names exactly as they appear in your data
        OPD: record.OPD || 0,
        OT: record.OT || 0,
        Recovery: record.Recovery || 0,
        IVF: record.IVF || 0,
        Returns: record.Returns || 0,
        Internal: record.Internal || 0,
        // Staging: record.Staging || 0,
        // Other: record.Other || 0,
        totalQty: record.totalQty || 0,
      }));

      // Export formatted data to CSV
      exportToCSV([headers, ...formattedData], 'StockSummary_Report');
    } else {
      console.log('No data to export');
    }
  };

  const columnsConfig: GridColDef[] = [
    { field: 'serialNumber', headerName: 'S No', flex: 0.5 },
    { field: 'centre', headerName: 'Centre', flex: 1 },
    { field: 'drugCategory', headerName: 'Drug Category', flex: 1 },
    // { field: "drugCatCode", headerName: "Drug Cat Code", flex: 1 },
    { field: 'drugName', headerName: 'Drug Name', flex: 1 },
    { field: 'drugCode', headerName: 'Drug Code', flex: 1 },
    { field: 'Central', headerName: 'Central', flex: 1 }, // Updated to match your field names
    { field: 'OPD', headerName: 'OPD', flex: 1 },
    { field: 'OT', headerName: 'OT', flex: 1 },
    { field: 'Recovery', headerName: 'Recovery', flex: 1 },
    { field: 'IVF', headerName: 'IVF', flex: 1 },
    { field: 'Returns', headerName: 'Returns', flex: 1 },
    { field: 'Internal', headerName: 'Internal', flex: 1 },
    // { field: "Staging", headerName: "Staging", flex: 1 },
    // { field: "Other", headerName: "Other", flex: 1 },
    { field: 'totalQty', headerName: 'Total Qty', flex: 1 },
  ];

  const rows =
    data?.data?.records.map(record => ({
      serialNumber: record.serialNumber || 'N/A',
      centre: record.centre || 'N/A',
      drugCategory: record.drugCategory || 'N/A',
      drugCatCode: record.drugCatCode || 'N/A',
      drugName: record.drugName || 'N/A',
      drugCode: record.drugCode || 'N/A',
      Central: record.Central || 0, // Ensure these match exactly to the field names in your data
      OPD: record.OPD || 0,
      OT: record.OT || 0,
      Recovery: record.Recovery || 0,
      IVF: record.IVF || 0,
      Returns: record.Returns || 0,
      Internal: record.Internal || 0,
      Staging: record.Staging || 0,
      Other: record.Other || 0,
      totalQty: record.totalQty || 0,
    })) || [];

  const getRowId = (row: any) => row.serialNumber; // Use serialNumber as unique id for rows
  const totalRows = data?.data?.pagination?.totalDocs || rows.length;

  return (
    <ContentSection title="Stock Summary Report">
      <Grid container justifyContent="flex-end" alignItems="center" mb={2}>
        <Grid item>
          <TextField
            label="Drug Name"
            size="small"
            variant="outlined"
            onChange={e => handleNameChange(e.target.value)}
            placeholder="Enter Drug Name"
            sx={{ mr: 2 }} // Adjust margin as needed for spacing
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadCSV}
          >
            Download CSV
          </Button>
        </Grid>
      </Grid>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={rows} // Use data from the API
          page={page}
          pageSize={pageSize}
          totalRows={totalRows} // Total rows from API pagination info
          loading={isLoading} // Show loading while data is being fetched
          getRowId={getRowId} // Provide custom id for each row
          sx={{ height: '100%' }}
          enablePagination={true}
          paginationMode="server" // Optional: Use "server" or "client"
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          extendedPageSizeOptions={[25, 50, 100, { label: 'All', value: -1 }]} // Custom page sizes with "All" option
          rowHover={true}
        />
      </Box>
    </ContentSection>
  );
};

export default StockSummaryReports;
