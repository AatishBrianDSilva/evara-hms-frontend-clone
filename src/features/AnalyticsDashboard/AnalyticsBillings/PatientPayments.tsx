import Box from '@mui/material/Box';
import React, { useState, useCallback, useRef } from 'react';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import {
  EPatientBillingServiceType,
  EPatientBillingStatus,
  EPaymentMethod,
} from '../../../types/patientDashboard/billings';
import ContentSection from '../../../components/ContentSection/ContentSection';
import { useGetAnalyticsPatientPaymentsQuery } from '../../../services/analyticsDashboardService/billings/analyticsPatientPaymentsApi';
import { debounce } from 'lodash';
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import { endOfWeek, startOfWeek } from 'date-fns';
import { downloadFileWithToast } from '../../../utils/downloadFileWithToast';
import DownloadMenu from '../../../components/CSVDownloadMenu/CSVDownloadMenu';
import generateQueryParams from '../../../utils/generateQueryParams';

const PatientPayments: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [selectedStatus, setSelectedStatus] = useState<
    EPatientBillingStatus | 'All'
  >('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<EPaymentMethod | 'All'>(
    'All',
  );
  const [selectedBillType, setSelectedBillType] = useState<
    EPatientBillingServiceType | 'All'
  >('All');
  const [startDate, setStartDate] = useState<Date | null>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  // Convert dates to ISO strings for the API
  const startDateUTC = startDate;
  const endDateUTC = endDate;

  const handleSearchQuery = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
    [],
  );

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    scrollRef.current?.scrollTo(0, 0);
  };

  const { data, isLoading, isFetching } = useGetAnalyticsPatientPaymentsQuery({
    paginate: false,
    page: page,
    limit: pageSize,
    dateRange: {
      startDate: startDateUTC?.toISOString(),
      endDate: endDateUTC?.toISOString(),
    },
    filters: {
      status: selectedStatus === 'All' ? undefined : selectedStatus,
      searchQuery,
      paymentMethod: selectedMethod === 'All' ? undefined : selectedMethod,
      billType: selectedBillType === 'All' ? undefined : selectedBillType,
    },
  });

  // Map over data to add a unique identifier for each row
  const patientPaymentsData = (data?.data?.records || []).map(
    (row: any, index: number) => ({
      ...row,
      uniqueId: `${row._id}-${index}`,
    }),
  );

  const patientPaymentsPagination = data?.data?.pagination;
  // const summary = data?.data?.summary; // Commented out as not used

  console.log('Patient Payments Data:', data);

  const patientPaymentsLoading = isLoading || isFetching;

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
          dateRange: {
            startDate: startDateUTC?.toISOString(),
            endDate: endDateUTC?.toISOString(),
          },
          filters: {
            status: selectedStatus === 'All' ? undefined : selectedStatus,
            searchQuery,
            paymentMethod:
              selectedMethod === 'All' ? undefined : selectedMethod,
            billType: selectedBillType === 'All' ? undefined : selectedBillType,
          },
        });
        filename = `patient_payments_page_${page}-${date}.csv`;
        break;

      case 'currentFilters':
        action = 'filtered data';
        params = generateQueryParams({
          paginate: false,
          dateRange: {
            startDate: startDateUTC?.toISOString(),
            endDate: endDateUTC?.toISOString(),
          },
          filters: {
            allData: true, // <-- Add this line
            status: selectedStatus === 'All' ? undefined : selectedStatus,
            searchQuery,
            paymentMethod:
              selectedMethod === 'All' ? undefined : selectedMethod,
            billType: selectedBillType === 'All' ? undefined : selectedBillType,
          },
        });
        filename = `patient_payments_filtered-${date}.csv`;
        break;

      case 'allData':
        action = 'all data';
        params = generateQueryParams({
          filters: {
            allData: true, // only flag needed — other filters must be omitted
          },
        });
        filename = `patient_payments_all-${date}.csv`;
        break;

      default:
        throw new Error('Invalid download type');
    }

    await downloadFileWithToast({
      endpoint: 'analytics/billings/patient-payments/download',
      params,
      fileName: filename,
      successMessage: `Successfully downloaded ${action}!`,
      errorMessage: `Failed to download ${action}.`,
      startMessage: `Preparing to download ${action}...`,
    });
  };

  // Use the uniqueId property as the row key.
  const getRowId = (row: any) => row.uniqueId;

  const columnsConfig: GridColDef[] = [
    {
      field: 'paymentDate',
      headerName: 'Payment Date',
      flex: 0.6,
      valueFormatter: params => {
        const row = params.id ? params.api.getRow(params.id) || {} : {};
        // Use paymentDate if present; otherwise fallback to createdAt
        const effectiveDate = params.value || row.createdAt;
        return effectiveDate
          ? new Date(effectiveDate).toLocaleDateString('en-IN')
          : '';
      },
    },
    { field: 'billingId', headerName: 'Bill No.', flex: 0.6 },
    { field: 'caseId', headerName: 'Case ID', flex: 0.5 },
    { field: 'patientCode', headerName: 'Patient ID', flex: 0.6 },
    { field: 'patientName', headerName: 'Patient Name', flex: 0.6 },
    { field: 'billType', headerName: 'Service', flex: 0.5 },
    {
      field: 'billAmount',
      headerName: 'Bill Amount',
      flex: 0.5,
      valueGetter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'taxableValue',
      headerName: 'Taxable Value',
      flex: 0.5,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'tax',
      headerName: 'Tax',
      flex: 0.5,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },

    {
      field: 'discount',
      headerName: 'Discount',
      flex: 0.5,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'totalValue',
      headerName: 'Subtotal',
      flex: 0.5,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'subTotal',
      headerName: 'Net Payable',
      flex: 0.5,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'paymentAmount',
      headerName: 'Payment Amount',
      flex: 0.5,
      valueFormatter: params => {
        const row = params.id ? params.api.getRow(params.id) || {} : {};
        // Use paymentAmount if available; otherwise fallback to amount
        const effectiveAmount =
          params.value !== undefined ? params.value : row.amount;
        return formatToIndianCurrencyFormat(effectiveAmount);
      },
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
      flex: 0.5,
    },
    {
      field: 'paymentDetails',
      headerName: 'Payment Details',
      flex: 0.5,
    },
  ];

  return (
    <ContentSection title="Patient Payments" scrollRef={scrollRef}>
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <CustomeDateRangePicker onChange={handleDateChange} />
        <FormControl variant="outlined" size="small">
          <InputLabel>Service</InputLabel>
          <Select
            label="Bill Type"
            value={selectedBillType}
            onChange={event => {
              setSelectedBillType(
                event.target.value as EPatientBillingServiceType,
              );
            }}
            style={{ minWidth: 150 }}
          >
            <MenuItem key={'All'} value={'All'}>
              All
            </MenuItem>
            {Object.values(EPatientBillingServiceType).map(type => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small">
          <InputLabel>Payment Method</InputLabel>
          <Select
            label="Payment Method"
            value={selectedMethod}
            onChange={event => {
              setSelectedMethod(event.target.value as EPaymentMethod);
            }}
            style={{ minWidth: 150 }}
          >
            <MenuItem key={'All'} value={'All'}>
              All
            </MenuItem>
            {Object.values(EPaymentMethod).map(method => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={selectedStatus}
            onChange={event => {
              setSelectedStatus(event.target.value as EPatientBillingStatus);
            }}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="All">All</MenuItem>
            {Object.values(EPatientBillingStatus).map(status => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Search"
          size="small"
          variant="outlined"
          onChange={event => handleSearchQuery(event.target.value)}
          placeholder="Case ID/Patient ID/Name"
          sx={{ width: '250px' }}
        />
        <DownloadMenu handleDownload={handleDownload} />
      </Box>

      <CustomDataGrid
        autoHeight={true}
        columns={columnsConfig}
        getRowId={getRowId}
        rows={patientPaymentsData}
        page={page}
        pageSize={pageSize}
        totalRows={patientPaymentsPagination?.totalDocs || 0}
        loading={patientPaymentsLoading}
        sx={{ height: '100%' }}
        enablePagination={true}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </ContentSection>
  );
};

export default PatientPayments;
