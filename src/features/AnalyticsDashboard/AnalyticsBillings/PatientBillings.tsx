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
  Button,
} from "@mui/material";
import { formatToIndianCurrencyFormat } from "../../../utils/formatToIndianCurrencyFormat";
import { EPatientBillingStatus } from "../../../types/patientDashboard/billings";
import ContentSection from "../../../components/ContentSection/ContentSection";
import { useGetAnalyticsPatientBillingsQuery } from "../../../services/analyticsDashboardService/billings/analyticsPatientBillingsApi";
import { debounce } from "lodash";
import CustomeDateRangePicker from "../../../components/CustomDateRangePicker/CustomDateRangePicker";
import { exportToCSV } from "../../../utils/exportCSV"; // Import the CSV utility

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

enum EBillType {
  Investigation = "Investigation",
  Procedure = "Procedure",
  Pharmacy = "Pharmacy",
  Service = "Service",
  CryoPreservation = "Cryo Preservation",
  TreatmentCycle = "Treatment Cycle",
  Package = "Package",
}

const PatientBillings: React.FC = () => {
  const [page, setPage] = useState<number>(1); // Ensure the page is set correctly
  const [pageSize, setPageSize] = useState<number>(25); // Default to 25 rows per page
  const [selectedStatus, setSelectedStatus] = useState<EPatientBillingStatus | "">(
    ""
  );
  const [patientIdQuery, setPatientIdQuery] = useState<string>("");
  const [patientNameQuery, setPatientNameQuery] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedMethod, setSelectedMethod] = useState<EPaymentMethod | "">("");
  const [selectedBillType, setSelectedBillType] = useState<EBillType | "">("");

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
  const startDateUTC = startDate;
  const endDateUTC = endDate

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
    if (selectedBillType) queryParts.push(`billType:${selectedBillType}`);

    const combinedQuery = queryParts.join(" ");

    debounceSetSearchQuery(combinedQuery);
    setPage(1); // Reset page to 1 on query change

    return () => {
      debounceSetSearchQuery.cancel();
    };
  }, [patientIdQuery, patientNameQuery, selectedMethod, selectedBillType, debounceSetSearchQuery]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
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
      paginate: pageSize !== -1, // Disable pagination if "All" is selected
      page: pageSize === -1 ? undefined : page, // Send undefined for page if "All" is selected
      limit: pageSize === -1 ? undefined : pageSize, // Send undefined for limit if "All" is selected
      filters: {
        status: selectedStatus,
        searchQuery,
        saleStartDate: startDateUTC || undefined,
        saleEndDate: endDateUTC || undefined,
        paymentMethod: selectedMethod,
        billType: selectedBillType,
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

  // Calculate the total discount
  const processedBillingIds = new Set<string>();
  const totalDiscount = patientBillingsData.reduce((sum, row) => {
    const billingId = (row as any).billingId;
    // Check if the discount for this billing ID has already been added
    if (!processedBillingIds.has(billingId)) {
      processedBillingIds.add(billingId); // Mark this billing ID as processed
      return roundToTwo(sum + roundToTwo((row as any).discount));
    }
    return sum;
  }, 0);

  // Handle CSV download
  const handleDownloadCSV = () => {
    if (patientBillingsData.length > 0) {
      const headers = [
        "Bill No",
        "Patient ID",
        "Patient Name",
        "Service",
        "Tax",
        "Total",
        "Discount",
        "Paid",
        "Due",
        "Payment Method",
        "Payment Amount",
        "Created At",
      ];

      const formattedData = patientBillingsData.map((record: any) => [
        record.billingId,
        record.patientCode,
        record.patientName,
        record.billType,
        formatToIndianCurrencyFormat(record.tax),
        formatToIndianCurrencyFormat(record.subTotal),
        formatToIndianCurrencyFormat(record.discount),
        formatToIndianCurrencyFormat(record.totalPaid),
        formatToIndianCurrencyFormat(record.totalDues),
        record.paymentMethod,
        formatToIndianCurrencyFormat(record.paymentAmount),
        new Date(record.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      ]);

      exportToCSV([headers, ...formattedData], "PatientBillings_Report");
    } else {
      console.log("No data to export");
    }
  };

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
    { field: "billType", headerName: "Service", flex: 1 },
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
    {
      field: "paymentAmount",
      headerName: "Payment Amount",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value),
    },
  ];

  const getRowId = (row: RowType & { paymentMethod: string }) => `${row._id}-${row.paymentMethod}`;

  return (
    <ContentSection title="Patient Billings">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <FormControl variant="outlined" size="small">
          <InputLabel>Service</InputLabel>
          <Select
            label="Bill Type"
            value={selectedBillType}
            onChange={(event: SelectChangeEvent<EBillType | "">) => {
              setSelectedBillType(event.target.value as EBillType);
            }}
            style={{ minWidth: 150 }}
          >
            {Object.values(EBillType).map((type) => (
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
            <MenuItem value="">All</MenuItem>
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
        <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
          Download CSV
        </Button>
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
        enablePagination={pageSize !== -1} // Disable pagination when "All" is selected
        extendedPageSizeOptions={[25, 50, 100, { label: "All", value: -1 }]} // Add the "All" option
      />

      {/* Summary Section */}
      <Box mt={4} p={2} width="40%" display="flex" flexDirection="column" ml="auto">
        <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
          Summary
        </Typography>
        <Box mt={2} display="flex" flexDirection="column" gap={2} width="100%">
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
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="h6" fontWeight="bold">
              Total Discount
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatToIndianCurrencyFormat(totalDiscount)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ContentSection>
  );
};

export default PatientBillings;
