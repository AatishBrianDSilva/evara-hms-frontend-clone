import React, { useState, useCallback } from "react";
import ContentSection from "../../../components/ContentSection/ContentSection";
import { Box, TextField, Button } from "@mui/material";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useGetExpiryDetailsQuery } from "../../../services/analyticsDashboardService/pharmacy/expiryDetailaApi";
import { exportToCSV } from "../../../utils/exportCSV";
import _ from "lodash";
import { format } from "date-fns";
import CustomeDateRangePicker from "../../../components/CustomDateRangePicker/CustomDateRangePicker";
import { formatToIndianCurrencyFormat } from "../../../utils/formatToIndianCurrencyFormat";

// Utility function to convert date to UTC before sending it to the API
const toUTCDateOnly = (date: Date | null, isEndDate = false) => {
  if (!date) return null;

  // Ensure the time is 00:00:00 for the start date or 23:59:59 for the end date
  const utcDate = isEndDate
    ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59))
    : new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));

  // Convert to ISO string and return only the date part
  return utcDate.toISOString().split("T")[0];
};

const ExpiryDetails: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [drugName, setDrugName] = useState<string>("");

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
  const startDateUTC = toUTCDateOnly(startDate);
  const endDateUTC = toUTCDateOnly(endDate, true);

  // Handle search input with debounce
  const handleSearchChange = useCallback(
    _.debounce((query: string) => {
      setDrugName(query);
    }, 500),
    []
  );

  // Fetch data from the API with dynamic query parameters
  const { data, isLoading } = useGetExpiryDetailsQuery({
    page,
    limit: pageSize,
    filters: {
      drugName, // Use drugName as the filter
      startDate: startDateUTC || undefined,
      endDate: endDateUTC || undefined,
    },
  });

  console.log("Expiry Details Data:", data);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleDownloadCSV = () => {
    if (data?.data?.records && data.data.records.length > 0) {
      // Define the headers for the CSV file
      const headers = [
        "S No",
        "Centre",
        "Invoice No",
        "Vendor Name",
        "Drug Category",
        "Drug Name",
        "Batch No",
        "Expiry Date",
        "Unit Cost",
        "Total Qty",
        "Sum Total Value",
      ];

      // Format the data for CSV export
      const formattedData = data.data.records.map((record) => {
        return {
          serialNumber: record.serialNumber,
          centre: record.centre || "",
          invoiceNo: record.invoiceNo || "",
          vendorName: record.vendorName || "",
          drugCategory: record.drugCategory || "",
          drugName: record.drugName || "",
          batchNo: record.batchNo || "",
          expiryDate: record.expiryDate || "",
          unitCost: record.unitCost || "",
          totalQty: record.totalQty || "",
          sumTotalValue: formatToIndianCurrencyFormat(record.sumTotalValue || ""), // Ensure 2 decimal places
        };
      });

      // Export formatted data to CSV
      exportToCSV([headers, ...formattedData], "ExpiryDetails_Report");
    } else {
      console.log("No data to export");
    }
  };

  const formatDate = (date: string) => format(new Date(date), "dd/MM/yyyy");

  const columnsConfig: GridColDef[] = [
    { field: "serialNumber", headerName: "S No", flex: 0.5 },
    { field: "centre", headerName: "Centre", flex: 1 },
    { field: "invoiceNo", headerName: "Invoice No", flex: 1 },
    { field: "vendorName", headerName: "Vendor Name", flex: 1 },
    { field: "drugCategory", headerName: "Drug Category", flex: 1 },
    { field: "drugName", headerName: "Drug Name", flex: 1 },
    { field: "batchNo", headerName: "Batch No", flex: 1 },
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    { field: "unitCost", headerName: "Unit Cost", flex: 1 },
    { field: "totalQty", headerName: "Total Qty", flex: 1 },
    {
      field: "sumTotalValue",
      headerName: "Sum Total Value",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value),
    },
  ];

  const rows = data?.data?.records || [];
  const getRowId = (row: any) => row.serialNumber;
  const totalRows = data?.data?.pagination?.totalDocs || 0;

  return (
    <ContentSection title="Expiry Details Report">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <CustomeDateRangePicker onChange={handleDateChange} />

        <TextField
          label="Drug Name"
          size="small"
          variant="outlined"
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Enter Drug Name"
        />
        <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
          Download CSV
        </Button>
      </Box>

      <Box mt={2} flex={"1 1 auto"}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={rows} // Use data from the API
          page={page}
          pageSize={pageSize}
          totalRows={totalRows} // Total rows from API pagination info
          loading={isLoading} // Show loading while data is being fetched
          getRowId={getRowId} // Provide custom id for each row
          sx={{ height: "100%" }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          rowHover={true}
        />
      </Box>
    </ContentSection>
  );
};

export default ExpiryDetails;
