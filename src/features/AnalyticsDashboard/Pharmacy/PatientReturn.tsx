import React, { useState } from 'react';
import ContentSection from '../../../components/ContentSection/ContentSection';
import { Box, Grid, TextField } from '@mui/material';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { useGetPatientReturnQuery } from '../../../services/analyticsDashboardService/pharmacy/patientReturnApi';
import { format } from 'date-fns';
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import { downloadFileWithToast } from '../../../utils/downloadFileWithToast';
import generateQueryParams from '../../../utils/generateQueryParams';
import DownloadMenu from '../../../components/CSVDownloadMenu/CSVDownloadMenu';

const PatientReturnReports: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [branch, setBranch] = useState<string>('');
  const [drugName, setDrugName] = useState<string>('');

  const [startDate, setStartDate] = useState<Date | null>(null); // For start date
  const [endDate, setEndDate] = useState<Date | null>(null); // For end date

  // Handle the date range change
  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  // Convert start and end dates to UTC date-only format for the API
  const startDateUTC = startDate;
  const endDateUTC = endDate;

  // Fetch data from the API with dynamic query parameters
  const { data, isLoading } = useGetPatientReturnQuery({
    page: pageSize === -1 ? undefined : page,
    limit: pageSize === -1 ? undefined : pageSize,
    filters: {
      branch: branch || undefined,
      drugName: drugName || undefined,
      startDate: startDateUTC || undefined,
      endDate: endDateUTC || undefined,
    },
    paginate: pageSize !== -1,
  });

  console.log('Patient Return', data);
  console.log('Branch data', setBranch);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  // const handleDownloadCSV = useCallback(() => {
  //   if (data?.data?.records && data.data.records.length > 0) {
  //     const headers = [
  //       'S No',
  //       'Branch',
  //       'Returned Date',
  //       'Patient Name',
  //       'Patient Number',
  //       'Drug Name',
  //       'Drug Code',
  //       'Quantity',
  //       'Total Value',
  //     ];

  //     const formattedData = data.data.records.map((record, index) => ({
  //       serialNumber: index + 1,
  //       branch: record.branch || '',
  //       returnedDate: record.returnedDate
  //         ? format(new Date(record.returnedDate), 'dd/MM/yyyy')
  //         : 'N/A',
  //       patientName: record.patientName || 'N/A',
  //       patientNumber: record.patientNumber || 'N/A',
  //       drugName: record.drugName || 'N/A',
  //       drugCode: record.drugCode || 'N/A',
  //       quantity: record.quantity || 0,
  //       totalValue: formatToIndianCurrencyFormat(record.totalValue || 0),
  //     }));

  //     exportToCSV([headers, ...formattedData], 'PatientReturn_Report');
  //   } else {
  //     console.log('No data to export');
  //   }
  // }, [data]);

  const handleDownload = async (
    downloadType: 'currentPage' | 'currentFilters' | 'allData',
  ) => {
    let params: any = {};
    let action = '';
    const date = new Date().toLocaleDateString('en-IN');
    let filename = '';

    switch (downloadType) {
      case 'currentPage':
        action = 'current page';
        params = generateQueryParams({
          paginate: false,
          page,
          limit: pageSize,
          filters: {
            branch: branch || undefined,
            drugName: drugName || undefined,
            startDate: startDate?.toISOString() || undefined,
            endDate: endDate?.toISOString() || undefined,
          },
        });
        filename = `patient_return_page_${page}-${date}.csv`;
        break;

      case 'currentFilters':
        action = 'filtered data';
        params = generateQueryParams({
          paginate: false,
          filters: {
            branch: branch || undefined,
            drugName: drugName || undefined,
            startDate: startDate?.toISOString() || undefined,
            endDate: endDate?.toISOString() || undefined,
          },
        });
        filename = `patient_return_filtered-${date}.csv`;
        break;

      case 'allData':
        action = 'all data';
        params = generateQueryParams({
          filters: {
            allData: true,
            branch: branch || undefined,
            drugName: drugName || undefined,
            startDate: startDate?.toISOString() || undefined,
            endDate: endDate?.toISOString() || undefined,
          },
        });
        filename = `patient_return_all-${date}.csv`;
        break;

      default:
        throw new Error('Invalid download type');
    }

    await downloadFileWithToast({
      endpoint: 'analytics/pharmacy/patient-return/download',
      params,
      fileName: filename,
      successMessage: `Successfully downloaded ${action}!`,
      errorMessage: `Failed to download ${action}.`,
      startMessage: `Preparing to download ${action}...`,
    });
  };

  // Updated columns configuration with new fields
  const columnsConfig: GridColDef[] = [
    { field: 'serialNumber', headerName: 'S No', flex: 0.5 },
    { field: 'branch', headerName: 'Branch', flex: 0.5 },
    { field: 'returnedDate', headerName: 'Returned Date', flex: 1 },
    { field: 'patientName', headerName: 'Patient Name', flex: 1 },
    { field: 'patientNumber', headerName: 'Patient Number', flex: 1 },
    { field: 'drugName', headerName: 'Drug Name', flex: 1 },
    { field: 'drugCode', headerName: 'Drug Code', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
    {
      field: 'totalValue',
      headerName: 'Total Value',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
  ];

  const rows =
    data?.data?.records.map((row, index) => ({
      id: row._id, // Using the MongoDB _id as the unique id for each row
      serialNumber: index + 1,
      branch: row.branch || '',
      returnedDate: row.returnedDate
        ? format(new Date(row.returnedDate), 'dd/MM/yyyy')
        : 'N/A',
      patientName: row.patientName || 'N/A',
      patientNumber: row.patientNumber || 'N/A',
      drugName: row.drugName || 'N/A',
      drugCode: row.drugCode || 'N/A',
      quantity: row.quantity || 0,
      totalValue: row.totalValue || 0,
    })) || [];

  const totalRows = data?.data?.pagination?.totalDocs || rows.length;

  return (
    <ContentSection title="Patient Return Report">
      <Grid
        container
        spacing={0}
        justifyContent="flex-end"
        mb={2}
        alignItems="center"
      >
        <Grid item>
          <Box display="flex" alignItems="center" gap={1}>
            <CustomeDateRangePicker onChange={handleDateChange} />

            <TextField
              label="Drug Name"
              size="small"
              variant="outlined"
              value={drugName}
              onChange={e => setDrugName(e.target.value)}
              placeholder="Enter Drug Name"
            />
            <DownloadMenu handleDownload={handleDownload} />
          </Box>
        </Grid>
      </Grid>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={rows}
          page={page}
          pageSize={pageSize}
          totalRows={totalRows}
          loading={isLoading}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          extendedPageSizeOptions={[25, 50, 100, { label: 'All', value: -1 }]}
          rowHover={true}
          getRowId={row => row.id} // Specify the unique id field
        />
      </Box>
    </ContentSection>
  );
};

export default PatientReturnReports;
