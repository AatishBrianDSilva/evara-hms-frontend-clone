import React, { useCallback, useState } from 'react';
import ContentSection from '../../../components/ContentSection/ContentSection';
import { Box, Button, Grid, TextField } from '@mui/material';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { useGetDrugsAndVendorQuery } from '../../../services/analyticsDashboardService/pharmacy/drugsAndVendorApi';
import { exportToCSV } from '../../../utils/exportCSV';
import _ from 'lodash';

const DrugsAndVendorReports: React.FC = () => {
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
  const { data, isLoading } = useGetDrugsAndVendorQuery({
    page: pageSize === -1 ? undefined : page, // If "All" is selected, remove page parameter
    limit: pageSize === -1 ? undefined : pageSize, // If "All" is selected, remove limit parameter
    filters: {
      drugName,
    },
    paginate: pageSize !== -1, // Set pagination to false if "All" is selected
  });

  console.log('Drugs and Vendor Data:', data);

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
        'Drug Category',
        'Category Code',
        'Drug Type',
        'Type Code',
        'Drug Company',
        'Company Code',
        'Drug Name',
        'Generic Name',
        'Drug Code',
        'HSN Code',
        'Qty Per Pack',
        'Tax',
      ];

      // Format the data for CSV export
      const formattedData = data.data.records.map(record => {
        return {
          serialNumber: record.serialNumber,
          drugCategory: record.drugCategory || '',
          categoryCode: record.categoryCode || '',
          drugType: record.drugType || '',
          typeCode: record.typeCode || '',
          drugCompany: record.drugCompany || '',
          companyCode: record.companyCode || '',
          drugName: record.drugName || '',
          genericName: record.genericName || '',
          drugCode: record.drugCode || '',
          hsnCode: record.hsnCode || '',
          qtyPerPack: record.qtyPerPack || '',
          tax: record.tax || '',
        };
      });

      // Export formatted data to CSV
      exportToCSV([headers, ...formattedData], 'DrugsAndVendor_Report');
    } else {
      console.log('No data to export');
    }
  };

  const columnsConfig: GridColDef[] = [
    { field: 'serialNumber', headerName: 'S No', flex: 0.5 },
    { field: 'drugCategory', headerName: 'Drug Category', flex: 1 },
    { field: 'categoryCode', headerName: 'Category Code', flex: 1 },
    { field: 'drugType', headerName: 'Drug Type', flex: 1 },
    { field: 'typeCode', headerName: 'Type Code', flex: 1 },
    { field: 'drugCompany', headerName: 'Drug Company', flex: 1 },
    { field: 'companyCode', headerName: 'Company Code', flex: 1 },
    { field: 'drugName', headerName: 'Drug Name', flex: 1 },
    { field: 'genericName', headerName: 'Generic Name', flex: 1 },
    { field: 'drugCode', headerName: 'Drug Code', flex: 1 },
    { field: 'hsnCode', headerName: 'HSN Code', flex: 1 },
    { field: 'qtyPerPack', headerName: 'Qty Per Pack', flex: 1 },
    { field: 'tax', headerName: 'Tax', flex: 1 },
  ];

  const rows = data?.data?.records || [];
  const getRowId = (row: any) => row.serialNumber;
  const totalRows = data?.data?.pagination?.totalDocs || rows.length;

  return (
    <ContentSection title="Drugs and Vendors Report">
      <Grid container justifyContent="flex-end" alignItems="center" mb={2}>
        <Grid item>
          <TextField
            label="Drug Name"
            size="small"
            variant="outlined"
            onChange={e => handleNameChange(e.target.value)}
            placeholder="Enter Drug Name"
            sx={{ marginRight: 1 }} // Add margin to the right of the TextField
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

export default DrugsAndVendorReports;
