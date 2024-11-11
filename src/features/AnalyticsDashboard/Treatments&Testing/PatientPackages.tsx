import React, { useState, useCallback } from 'react';
import { Box, TextField, Button } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import debounce from 'lodash/debounce';
import { exportToCSV } from '../../../utils/exportCSV'; // Import the CSV utility
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import { endOfWeek, startOfWeek } from 'date-fns';
import {
  PatientPackagesReportResponse,
  useGetPatientPackageReportsQuery,
} from '../../../services/analyticsDashboardService/treatment&testing/treatmentTestingApi';
import { IQueryOptions } from '../../../types/global';

const AnalyticsPatientPackages: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const [startDate, setStartDate] = useState<Date | null>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const [searchInput, setSearchInput] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

  // Debounce function for setting search value
  const debouncedSetSearchValue = useCallback(
    debounce((value: string) => {
      setSearchValue(value);
    }, 300),
    [],
  );

  // Handle the date range change
  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearchInput(event.target.value);
    debouncedSetSearchValue(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Add 1 because page in pagination is 1-based
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const options: IQueryOptions = {
    paginate: pageSize !== -1,
    dateRange: {
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    },
    page: pageSize === -1 ? undefined : page,
    limit: pageSize === -1 ? undefined : pageSize,
    filters: {
      search: searchValue || undefined,
    },
  };

  const { data, isLoading, isFetching } =
    useGetPatientPackageReportsQuery(options);

  const records = data?.data?.records || [];
  const pagination = data?.data?.pagination;

  // Handle CSV download
  const handleDownloadCSV = () => {
    if (records.length > 0) {
      const headers = [
        'Date',
        'Patient ID',
        'Package',
        'Doctor',
        'Amount',
        'Status',
      ];

      const formattedData = records.map(
        (Package: PatientPackagesReportResponse) => [
          new Date(Package.date).toLocaleDateString('en-In'),
          Package.patientId,
          Package.package,
          Package.doctor,
          formatToIndianCurrencyFormat(Package.amount),
          Package.status,
        ],
      );

      exportToCSV([headers, ...formattedData], 'Patient Packages');
    } else {
      console.log('No data to export');
    }
  };

  const columnsConfig: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      valueFormatter: params =>
        new Date(params.value).toLocaleDateString('en-In'),
    },
    {
      field: 'patientId',
      headerName: 'Patient ID',
      flex: 1,
    },
    {
      field: 'package',
      headerName: 'Package',
      flex: 1,
    },
    {
      field: 'doctor',
      headerName: 'Doctor',
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
  ];

  return (
    <ContentSection title="Patient Packages Report">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <CustomeDateRangePicker onChange={handleDateChange} />

        {/* Add Search Field */}
        <TextField
          label="Search"
          placeholder="Search by Patient ID, Doctor"
          variant="outlined"
          sx={{ width: '200px' }}
          value={searchInput}
          onChange={handleSearchChange}
        />

        <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
          Download CSV
        </Button>
      </Box>

      <CustomDataGrid
        autoHeight={false}
        enablePagination={true}
        columns={columnsConfig}
        rows={records}
        page={page}
        pageSize={pageSize}
        getRowId={row => row._id}
        totalRows={pagination?.totalDocs || 0} // Ensure totalRows is set from pagination
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={isLoading || isFetching} // Use the loading prop in DataGrid
        extendedPageSizeOptions={[25, 50, 100, { label: 'All', value: -1 }]} // Add pagination options
      />
    </ContentSection>
  );
};

export default AnalyticsPatientPackages;
