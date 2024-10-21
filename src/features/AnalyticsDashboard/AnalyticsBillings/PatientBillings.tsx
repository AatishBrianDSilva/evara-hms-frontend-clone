import Box from "@mui/material/Box";
import React, { useState, useEffect, useCallback } from "react";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { formatToIndianCurrencyFormat } from "../../../utils/formatToIndianCurrencyFormat";
import { EPatientBillingStatus } from "../../../types/patientDashboard/billings";
import ContentSection from "../../../components/ContentSection/ContentSection";
import { useGetAnalyticsPatientBillingsQuery } from "../../../services/analyticsDashboardService/billings/analyticsPatientBillingsApi";
import { debounce } from "lodash";
import CustomeDateRangePicker from "../../../components/CustomDateRangePicker/CustomDateRangePicker";

interface RowType {
  _id: string;
}

enum EPaymentMethod {
  Cash = "Cash",
  CreditCard = "CreditCard",
  BankTransfer = "BankTransfer",
  Online = "Online",
  UPI = "UPI",
}

// Utility function to convert date to UTC before sending it to the API
const toUTCDateOnly = (date: Date | null, isEndDate = false) => {
  if (!date) return null;

  const utcDate = isEndDate
    ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59))
    : new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));

  return utcDate.toISOString().split("T")[0];
};

const PatientBillings: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [selectedStatus, setSelectedStatus] = useState<EPatientBillingStatus>(
    EPatientBillingStatus.Paid
  );
  const [patientIdQuery, setPatientIdQuery] = useState<string>("");
  const [patientNameQuery, setPatientNameQuery] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedMethod, setSelectedMethod] = useState<EPaymentMethod | "">("");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Handle the date range change
  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  // Convert start and end dates to UTC date-only format for the API
  const startDateUTC = toUTCDateOnly(startDate);
  const endDateUTC = toUTCDateOnly(endDate, true);

  const debounceSetSearchQuery = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  useEffect(() => {
    const queryParts = [];
    if (patientIdQuery) queryParts.push(`patientCode:${patientIdQuery}`);
    if (patientNameQuery) queryParts.push(`patientName:${patientNameQuery}`);
    if (selectedMethod) queryParts.push(`paymentMethod:${selectedMethod}`);
    const combinedQuery = queryParts.join(" ");

    debounceSetSearchQuery(combinedQuery);
    setPage(1);

    return () => {
      debounceSetSearchQuery.cancel();
    };
  }, [patientIdQuery, patientNameQuery, selectedMethod, debounceSetSearchQuery]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleStatusChange = (event: SelectChangeEvent<EPatientBillingStatus>) => {
    setSelectedStatus(event.target.value as EPatientBillingStatus);
  };

  const handlePatientIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPatientIdQuery(event.target.value);
  };

  const handlePatientNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPatientNameQuery(event.target.value);
  };

  const handleMethodChange = (event: SelectChangeEvent<EPaymentMethod | "">) => {
    setSelectedMethod(event.target.value as EPaymentMethod);
  };

  const { data, isLoading, isFetching } = useGetAnalyticsPatientBillingsQuery(
    {
      paginate: true,
      page,
      limit: pageSize,
      filters: {
        status: selectedStatus,
        searchQuery,
        saleStartDate: startDateUTC || undefined,
        saleEndDate: endDateUTC || undefined,
        paymentMethod: selectedMethod,
      },
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const patientBillingsData = data?.data?.records || [];
  const patientBillingsPagination = data?.data?.pagination;
  const patientBillingsLoading = isLoading || isFetching;

  console.log("Patient billing", patientBillingsData);
  // Utility function to round values to two decimal places
  const roundToTwo = (num: any) => Math.round(num * 100) / 100;

  // Update the calculation of totalPaid and totalDues with rounding
  const totalPaid = patientBillingsData.reduce(
    (sum, row) => roundToTwo(sum + roundToTwo((row as any).paymentAmount)),
    0
  );

  const totalDues = patientBillingsData.reduce(
    (sum, row) => roundToTwo(sum + roundToTwo((row as any).totalDues)),
    0
  );

  const columnsConfig: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Created At",
      type: "date",
      flex: 1,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    { field: "patientCode", headerName: "Patient ID", flex: 1 },
    { field: "patientName", headerName: "Patient Name", flex: 1 },
    { field: "billingId", headerName: "Bill No.", flex: 1 },
    // {
    //   field: "amount",
    //   headerName: "Amount",
    //   flex: 1,
    //   valueFormatter: (params) => formatToIndianCurrencyFormat(params.value),
    // },
    {
      field: "tax",
      headerName: "Tax",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: "subTotal",
      headerName: "Total",
      flex: 1,
      valueGetter: (params) => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: "discount",
      headerName: "Discount",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: "totalPaid",
      headerName: "Paid",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: "totalDues",
      headerName: "Due",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value),
    },
    { field: "paymentMethod", headerName: "Method", flex: 1 },
    { field: "paymentAmount", headerName: "Payment Amount", flex: 1 },
  ];

  const getRowId = (row: RowType & { paymentMethod: string }) => `${row._id}-${row.paymentMethod}`;

  return (
    <ContentSection title="Patient Billings">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        {/* Dropdown for Billing Status */}
        <FormControl variant="outlined" size="small">
          <InputLabel>Payment Method</InputLabel>
          <Select
            label="Payment Method"
            value={selectedMethod}
            onChange={handleMethodChange}
            style={{ minWidth: 150 }}
          >
            {Object.values(EPaymentMethod).map((method) => (
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
            onChange={handleStatusChange}
            style={{ minWidth: 150 }}
          >
            {Object.values(EPatientBillingStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <CustomeDateRangePicker onChange={handleDateChange} />
        <TextField
          label="Search by Patient ID"
          size="small"
          variant="outlined"
          onChange={handlePatientIdChange}
          placeholder="Enter patient ID"
        />
        <TextField
          label="Search by Patient Name"
          size="small"
          variant="outlined"
          onChange={handlePatientNameChange}
          placeholder="Enter patient name"
        />
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
        sx={{ height: "100%" }}
        enablePagination={true}
      />

      {/* Summary Section */}
      <Box mt={4} p={2} width="40%" display="flex" flexDirection="column" ml="auto">
        <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
          Summary
        </Typography>
        <Box mt={2} display="flex" flexDirection="column" gap={2} width="100%">
          {/* <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="h6" fontWeight="bold">
              Total Amount
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatToIndianCurrencyFormat(totalAmount)}
            </Typography>
          </Box> */}
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="h6" fontWeight="bold">
              Total Paid
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatToIndianCurrencyFormat(totalPaid)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="h6" fontWeight="bold">
              Total Due
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatToIndianCurrencyFormat(totalDues)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ContentSection>
  );
};

export default PatientBillings;
