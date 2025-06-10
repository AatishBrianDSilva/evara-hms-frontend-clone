import React, { useState, useCallback } from 'react';
import { Box, TextField, MenuItem, Typography } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import debounce from 'lodash/debounce';
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import { endOfWeek, startOfWeek } from 'date-fns';
import { Visibility } from '@mui/icons-material';
import ViewReports from '../../PatientDashboard/Journey/ViewReports';
import { useGetTreatmentCycleReportsQuery } from '../../../services/analyticsDashboardService/treatment&testing/treatmentTestingApi';
import { IQueryOptions } from '../../../types/global';
import { downloadFileWithToast } from '../../../utils/downloadFileWithToast';
import generateQueryParams from '../../../utils/generateQueryParams';
import DownloadMenu from '../../../components/CSVDownloadMenu/CSVDownloadMenu';

const AnalyticsTreatmentCycle: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const [startDate, setStartDate] = useState<Date | null>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const [status, setStatus] = useState<string>('All');

  const [searchInput, setSearchInput] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

  const [isViewReportsModalOpen, setIsViewReportsModalOpen] =
    useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Debounce function for setting payment mode
  const debouncedSetStatus = useCallback(
    debounce((value: string) => {
      setStatus(value);
    }, 300),
    [],
  );

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

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPage(1);
    debouncedSetStatus(event.target.value as string);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearchInput(event.target.value);
    debouncedSetSearchValue(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
      status: status === 'All' ? undefined : status,
      search: searchValue || undefined,
    },
  };

  const { data, isLoading, isFetching } =
    useGetTreatmentCycleReportsQuery(options);

  const records = data?.data?.records || [];
  const pagination = data?.data?.pagination;
  const summary = data?.data?.summary;

  // Handle CSV download
  // const handleDownloadCSV = () => {
  //   if (records.length > 0) {
  //     const headers = [
  //       'Date',
  //       'Patient ID',
  //       'Treatment Cycle',
  //       'Doctor',
  //       'Amount',
  //       'Status',
  //     ];

  //     const formattedData = records.map(
  //       (treatmentCycle: TreatmentCycleReportsResponse) => [
  //         new Date(treatmentCycle.date).toLocaleDateString('en-In'),
  //         treatmentCycle.patientId,
  //         treatmentCycle.treatmentCycle,
  //         treatmentCycle.doctor,
  //         formatToIndianCurrencyFormat(treatmentCycle.amount),
  //         treatmentCycle.status,
  //       ],
  //     );

  //     exportToCSV([headers, ...formattedData], 'Treatment Cycle');
  //   } else {
  //     console.log('No data to export');
  //   }
  // };

  const handleDownload = async (
    downloadType: 'currentPage' | 'currentFilters' | 'allData',
  ) => {
    let params: any = {};
    let action = '';
    const date = new Date().toLocaleDateString('en-IN');
    let filename = '';

    // Define different download types and parameters
    switch (downloadType) {
      case 'currentPage':
        action = 'current page';
        params = generateQueryParams({
          paginate: true,
          page,
          limit: pageSize,
          dateRange: {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
          },
          filters: {
            search: searchValue || undefined,
            status: status === 'All' ? undefined : status,
          },
        });
        filename = `treatment_cycle_page_${page}_${date}.csv`;
        break;

      case 'currentFilters':
        action = 'filtered data';
        params = generateQueryParams({
          paginate: false,
          dateRange: {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
          },
          filters: {
            allData: true,
            search: searchValue || undefined,
            status: status === 'All' ? undefined : status,
          },
        });
        filename = `treatment_cycle_filtered_${date}.csv`;
        break;

      case 'allData':
        action = 'all data';
        params = generateQueryParams({
          filters: {
            allData: true, // only flag needed — other filters must be omitted
          },
        });
        filename = `treatment_cycle_all_${date}.csv`;
        break;

      default:
        throw new Error('Invalid download type');
    }

    // Call the download utility with toast messages
    await downloadFileWithToast({
      endpoint: 'analytics/treatments-testing/treatment-cycle-reports/download',
      params,
      fileName: filename,
      successMessage: `Successfully downloaded ${action}!`,
      errorMessage: `Failed to download ${action}.`,
      startMessage: `Preparing to download ${action}...`,
    });
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
      field: 'patientName',
      headerName: 'Patient Name',
      flex: 1,
    },
    {
      field: 'treatmentCycle',
      headerName: 'TreatmentCycle',
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
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
      getActions: params => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View Reports"
          onClick={() => handleViewReports(params.row?.files || [])}
        />,
      ],
    },
  ];

  const handleViewReports = (files: string[]) => {
    setSelectedFiles(files);
    setIsViewReportsModalOpen(true);
  };

  const closeViewReportsModal = () => {
    setIsViewReportsModalOpen(false);
  };

  return (
    <ContentSection title="Treatment-Cycle Report">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <CustomeDateRangePicker onChange={handleDateChange} />

        <TextField
          label="Status"
          sx={{ width: '150px' }}
          value={status}
          onChange={handleStatusChange}
          select
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Scheduled">Scheduled</MenuItem>
          <MenuItem value="In-Progress">Live</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        {/* Add Search Field */}
        <TextField
          label="Search"
          placeholder="Search by Patient ID, Doctor"
          variant="outlined"
          sx={{ width: '200px' }}
          value={searchInput}
          onChange={handleSearchChange}
        />

        <DownloadMenu handleDownload={handleDownload} />
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
      />

      {isViewReportsModalOpen && (
        <ViewReports
          openModal={isViewReportsModalOpen}
          onClose={closeViewReportsModal}
          files={selectedFiles}
        />
      )}

      <Box
        mt={4}
        p={2}
        width="40%"
        display="flex"
        flexDirection="column"
        ml="auto"
      >
        <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
          Summary
        </Typography>
        <Box mt={2} display="flex" flexDirection="column" gap={2} width="100%">
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="h6" fontWeight="bold">
              Total Amount
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatToIndianCurrencyFormat(summary?.totalAmount || 0)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ContentSection>
  );
};

export default AnalyticsTreatmentCycle;
