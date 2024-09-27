import React, { useState } from "react";
import ContentSection from "../../../components/ContentSection/ContentSection";
import { Box, Button, Grid } from "@mui/material";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useGetInternalConsumptionReportQuery } from "../../../services/analyticsDashboardService/pharmacy/internalConsumptionReportApi";
import { exportToCSV } from "../../../utils/exportCSV";
import _ from "lodash";
import CustomDatePicker from "../../../components/CustomDatePicker/CustomDatePicker";
import { format } from "date-fns";

const InternalConsumptionReports: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Adjust page to 1 if pageSize is set to "All" (value -1)
  if (pageSize === -1 && page !== 1) {
    setPage(1);
  }

  // Fetch data from the API with dynamic query parameters
  const { data, isLoading } = useGetInternalConsumptionReportQuery({
    page: pageSize === -1 ? undefined : page, // If "All" is selected, remove page parameter
    limit: pageSize === -1 ? undefined : pageSize, // If "All" is selected, remove limit parameter
    filters: {
      allocDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined, // Allocation date filter
    },
    paginate: pageSize !== -1, // Set pagination to false if "All" is selected
  });

  console.log("Internal Consumption Data:", data);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    if (newPageSize !== -1) {
      setPage(1); // Reset to page 1 when changing page size
    }
  };

  const handleDownloadCSV = () => {
    if (data?.data?.records && data.data.records.length > 0) {
      // Define the headers for the CSV file
      const headers = [
        "S No",
        "Centre",
        "Pharmacy Drug Name",
        "Pharmacy Drug Code",
        "Location Name",
        "Location Code",
        "Category",
        "Category Code",
        "Qty",
        "Unit Cost",
        "Total Cost",
        "Tax",
        "Total Tax",
        "Alloc Date",
        "Added By",
        "Remarks",
      ];

      // Format the data with date fields in dd/MM/yyyy format
      const formattedData = data.data.records.map((record) => ({
        serialNumber: record.serialNumber,
        centre: record.centre || "",
        pharmacyDrugName: record.pharmacyDrugName || "",
        pharmacyDrugCode: record.pharmacyDrugCode || "",
        locationName: record.locationName || "",
        locationCode: record.locationCode || "",
        category: record.category || "",
        categoryCode: record.categoryCode || "",
        quantity: record.quantity || "",
        unitCost: record.unitCost || "",
        totalCost: record.totalCost || "",
        tax: record.tax || "",
        totalTax: record.totalTax || "",
        allocDate: record.allocDate ? format(new Date(record.allocDate), "dd/MM/yyyy") : "",
        addedBy: record.addedBy || "",
        remarks: record.remarks || "",
      }));

      // Export formatted data to CSV
      exportToCSV([headers, ...formattedData], "InternalConsumption_Report");
    } else {
      console.log("No data to export");
    }
  };

  const formatDate = (date: string) => format(new Date(date), "dd/MM/yyyy");

  const columnsConfig: GridColDef[] = [
    { field: "serialNumber", headerName: "S No", flex: 0.5 },
    { field: "centre", headerName: "Centre", flex: 1 },
    { field: "pharmacyDrugName", headerName: "Pharmacy Drug Name", flex: 1 },
    { field: "pharmacyDrugCode", headerName: "Pharmacy Drug Code", flex: 1 },
    { field: "locationName", headerName: "Location Name", flex: 1 },
    { field: "locationCode", headerName: "Location Code", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "categoryCode", headerName: "Category Code", flex: 1 },
    { field: "quantity", headerName: "Qty", flex: 1 },
    { field: "unitCost", headerName: "Unit Cost", flex: 1 },
    { field: "totalCost", headerName: "Total Cost", flex: 1 },
    { field: "tax", headerName: "Tax", flex: 1 },
    { field: "totalTax", headerName: "Total Tax", flex: 1 },
    {
      field: "allocDate",
      headerName: "Alloc Date",
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    { field: "addedBy", headerName: "Added By", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 },
  ];

  const rows = data?.data?.records || [];
  const getRowId = (row: any) => row.serialNumber;
  const totalRows = data?.data?.pagination?.totalDocs || rows.length;

  return (
    <ContentSection title="Internal Consumption Report">
      <Grid container spacing={2} justifyContent="flex-end" mb={2}>
        <Grid item xs={12} md={2}>
          <CustomDatePicker
            label="Alloc Date"
            value={selectedDate}
            onChange={(newValue) => {
              if (newValue) {
                setSelectedDate(newValue);
              }
            }}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
            Download CSV
          </Button>
        </Grid>
      </Grid>

      <Box mt={2} flex={"1 1 auto"}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={rows}
          page={page}
          pageSize={pageSize}
          totalRows={totalRows}
          loading={isLoading}
          getRowId={getRowId}
          sx={{ height: "100%" }}
          enablePagination={true}
          paginationMode="server" // Optional: Use "server" or "client"
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          extendedPageSizeOptions={[25, 50, 100, { label: "All", value: -1 }]} // Custom page sizes with "All" option
          rowHover={true}
        />
      </Box>
    </ContentSection>
  );
};

export default InternalConsumptionReports;
