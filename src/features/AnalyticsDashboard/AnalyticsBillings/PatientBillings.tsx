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
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import {
  EPatientBillingServiceType,
  EPatientBillingStatus,
  EPaymentMethod,
} from '../../../types/patientDashboard/billings';
import ContentSection from '../../../components/ContentSection/ContentSection';
import { useGetAnalyticsPatientBillingsQuery } from '../../../services/analyticsDashboardService/billings/analyticsPatientBillingsApi';
import { debounce } from 'lodash';
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import { endOfWeek, startOfWeek } from 'date-fns';

const PatientBillings: React.FC = () => {
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

  // Modal state
  const [open, setOpen] = useState<boolean>(false);
  const [selectedPayments, setSelectedPayments] = useState<any[]>([]);
  const [selectedBillId, setSelectedBillId] = useState<string>('');

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

  const handleSearchQuery = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
    [],
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    scrollRef.current?.scrollTo(0, 0);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    scrollRef.current?.scrollTo(0, 0);
  };

  const { data, isLoading, isFetching } = useGetAnalyticsPatientBillingsQuery({
    paginate: pageSize !== -1, // Disable pagination if "All" is selected
    page: pageSize === -1 ? undefined : page, // Send undefined for page if "All" is selected
    limit: pageSize === -1 ? undefined : pageSize, // Send undefined for limit if "All" is selected
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

  const patientBillingsData = data?.data?.records || [];
  const patientBillingsPagination = data?.data?.pagination;
  const summary = data?.data?.summary;

  const patientBillingsLoading = isLoading || isFetching;

  const handleOpen = (payments: any[], billId: string) => {
    setSelectedPayments(payments);
    setSelectedBillId(billId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPayments([]);
    setSelectedBillId('');
  };

  const columnsConfig: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date',
      type: 'date',
      flex: 0.5,
      valueFormatter: params =>
        new Date(params.value).toLocaleDateString('en-IN'),
    },
    { field: 'billingId', headerName: 'Bill No.', flex: 0.5 },
    { field: 'caseId', headerName: 'Case ID', flex: 0.5 },
    { field: 'patientCode', headerName: 'Patient ID', flex: 0.75 },
    { field: 'patientName', headerName: 'Patient Name', flex: 1 },
    { field: 'billType', headerName: 'Service', flex: 1 },
    {
      field: 'tax',
      headerName: 'Tax',
      flex: 0.5,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'subTotal',
      headerName: 'Total',
      flex: 1,
      valueGetter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'discount',
      headerName: 'Discount',
      flex: 0.5,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'totalPaid',
      headerName: 'Paid',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'totalDues',
      headerName: 'Due',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'payments',
      headerName: 'Transactions',
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: params => (
        <Tooltip title="View Transactions">
          <IconButton
            color="primary"
            onClick={() =>
              handleOpen(params.row.payments, params.row.billingId)
            }
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const getRowId = (row: any) => `${row._id}`;

  return (
    <ContentSection title="Patient Billings" scrollRef={scrollRef}>
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
          placeholder="Case ID/Patient ID/Name "
          sx={{ width: '250px' }}
        />
        {/* <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
          Download CSV
        </Button> */}
      </Box>

      <CustomDataGrid
        autoHeight={true}
        columns={columnsConfig}
        getRowId={getRowId}
        rows={patientBillingsData}
        page={page}
        pageSize={pageSize}
        totalRows={patientBillingsPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientBillingsLoading}
        sx={{ height: '100%' }}
        enablePagination={pageSize !== -1} // Disable pagination when "All" is selected
        extendedPageSizeOptions={[25, 50, 100, { label: 'All', value: -1 }]} // Add the "All" option
      />

      {/* Payments Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="payments-dialog-title"
      >
        <DialogTitle id="payments-dialog-title">
          Transactions for Bill {selectedBillId}
        </DialogTitle>
        <DialogContent dividers>
          {selectedPayments.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedPayments.map(payment => (
                  <TableRow key={payment._id}>
                    <TableCell>{payment.type}</TableCell>
                    <TableCell>
                      {formatToIndianCurrencyFormat(payment.amount)}
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      {new Date(payment.paymentDate).toLocaleDateString(
                        'en-IN',
                        {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        },
                      )}
                    </TableCell>
                    <TableCell>{payment.details || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No payments found for this bill.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Summary Section */}
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
              Total Paid
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatToIndianCurrencyFormat(summary?.payment)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="h6" fontWeight="bold">
              Total Due
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatToIndianCurrencyFormat(summary?.due)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="h6" fontWeight="bold">
              Total Discount
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatToIndianCurrencyFormat(summary?.discount)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ContentSection>
  );
};

export default PatientBillings;
