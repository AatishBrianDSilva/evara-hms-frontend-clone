import React, { useState, useCallback } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";
import ContentSection from "../../../components/ContentSection/ContentSection";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { formatToIndianCurrencyFormat } from "../../../utils/formatToIndianCurrencyFormat";
import debounce from "lodash/debounce";
import { exportToCSV } from "../../../utils/exportCSV"; // Import the CSV utility
import { revenueBreakupResponse, useGetRevenueBreakupQuery } from "../../../services/analyticsDashboardService/billings/revenueBreakupApi";
import CustomeDateRangePicker from "../../../components/CustomDateRangePicker/CustomDateRangePicker";
import { endOfWeek, startOfWeek } from "date-fns";


const RevenueBreakupReport: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const [startDate, setStartDate] = useState<Date | null>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [endDate, setEndDate] = useState<Date | null>(endOfWeek(new Date(), { weekStartsOn: 1 }));

  const [paymentMode, setPaymentMode] = useState<string>("All");
  const [createdBy, setCreatedBy] = useState<string>("All");

  // Debounce function for setting payment mode
  const debouncedSetPaymentMode = useCallback(
    debounce((value: string) => {
      setPaymentMode(value);
    }, 300), // Adjust the delay as needed (e.g., 300 ms)
    []
  );

  // Debounce function for setting created by
  const debouncedSetCreatedBy = useCallback(
    debounce((value: string) => {
      setCreatedBy(value);
    }, 300),
    []
  );

  // Handle the date range change
  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  const handlePaymentModeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    debouncedSetPaymentMode(event.target.value as string);
  };

  const handleCreatedByChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    debouncedSetCreatedBy(event.target.value as string);
  };


  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1); // Add 1 because page in pagination is 1-based
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to page 1 when page size changes
  };

  const { data, isLoading, isFetching } = useGetRevenueBreakupQuery({
    paginate: pageSize !== -1, // Disable pagination if "All" is selected
    dateRange: {
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    },
    page: pageSize === -1 ? undefined : page, // Send undefined for page if "All" is selected
    limit: pageSize === -1 ? undefined : pageSize, // Send undefined for limit if "All" is selected
    filters: {
      paymentMode: paymentMode === "All" ? undefined : paymentMode,
      createdBy: createdBy === "All" ? undefined : createdBy,
    }
  });

  const records = data?.data?.records || [];
  const pagination = data?.data?.pagination;

  const totalBillingAmount = records.reduce((acc, record) => acc + record.totalAmount, 0);
  const totalRefunds = records.reduce((acc, record) => acc + record.totalRefunded, 0);

  // const totalRefunds = refundDetails.reduce((acc, refund) => acc + refund.refundAmount, 0);

  // Handle CSV download
  const handleDownloadCSV = () => {
    if (records.length > 0) {
      const headers = [
        "User",
        "Payment Method",
        "Billing Amount",
        "Refund Amount",
      ];

      const formattedData = records.map((refund: revenueBreakupResponse) => [
        refund.createdBy,
        refund.paymentMethod,
        formatToIndianCurrencyFormat(refund.totalAmount),
        formatToIndianCurrencyFormat(refund.totalRefunded),
      ]);

      exportToCSV([headers, ...formattedData], "Revenue Breakup");
    } else {
      console.log("No data to export");
    }
  };

  const columnsConfig: GridColDef[] = [
    {
      field: "createdBy",
      headerName: "User",
      flex: 1,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      flex: 1,
    },
    {
      field: "totalAmount",
      headerName: "Billing Amount",
      flex: 1,
      valueFormatter: (params) =>
        formatToIndianCurrencyFormat(params.value),

    },
    {
      field: "totalRefunded",
      headerName: "Refund Amount",
      flex: 1,
      valueFormatter: (params) =>
        formatToIndianCurrencyFormat(params.value),
    },

  ];

  return (
    <ContentSection title="Revenue Breakup Report">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <CustomeDateRangePicker onChange={handleDateChange} />

        <TextField
          label="Payment Mode"
          sx={{ width: "150px" }}
          value={paymentMode}
          onChange={handlePaymentModeChange}
          select
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="CreditCard">Credit Card</MenuItem>
          <MenuItem value="BankTransfer">Bank Transfer</MenuItem>
          <MenuItem value="Online">Online</MenuItem>
          <MenuItem value="UPI">UPI</MenuItem>
        </TextField>

        <TextField
          label="User"
          sx={{ width: "150px" }}
          value={createdBy}
          onChange={handleCreatedByChange}
          select
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="testAdmin">testAdmin</MenuItem>
        </TextField>

        <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
          Download CSV
        </Button>
      </Box>

      <CustomDataGrid
        autoHeight
        enablePagination={true}
        columns={columnsConfig}
        rows={records}
        page={page - 1} // Convert back to 0-based index for DataGrid
        pageSize={pageSize}
        totalRows={pagination?.totalDocs || 0} // Ensure totalRows is set from pagination
        pageCount={pageSize} // Set total pages for pagination
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={isLoading || isFetching} // Use the loading prop in DataGrid
        extendedPageSizeOptions={[25, 50, 100, { label: "All", value: -1 }]} // Add pagination options
      />

      <Box mt={2} display={"flex"} flexDirection={"column"} justifyContent="space-between" alignItems="flex-end">
        <Box>
          <Typography variant="h5">
            Summary
          </Typography>
          <Typography variant="h6">
            Total Billing: {formatToIndianCurrencyFormat(totalBillingAmount)}
          </Typography>
          <Typography variant="h6">
            Total Refund: {formatToIndianCurrencyFormat(totalRefunds)}
          </Typography>
        </Box>
      </Box>
    </ContentSection>
  );
};

export default RevenueBreakupReport;
