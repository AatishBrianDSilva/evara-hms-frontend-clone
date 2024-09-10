import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { formatToIndianCurrencyFormat } from "../../../utils/formatToIndianCurrencyFormat";
import { EPatientBillingStatus } from "../../../types/patientDashboard/billings";
import ContentSection from "../../../components/ContentSection/ContentSection";
import { useGetAnalyticsPatientBillingsQuery } from "../../../services/analyticsDashboardService/billings/analyticsPatientBillingsApi";

interface RowType {
  _id: string;
}

const PatientBillings: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [selectedStatus, setSelectedStatus] = useState<EPatientBillingStatus>(
    EPatientBillingStatus.Paid
  );
  const [patientIdQuery, setPatientIdQuery] = useState<string>(""); // For searching by patient ID
  const [patientNameQuery, setPatientNameQuery] = useState<string>(""); // For searching by patient name
  const [searchQuery, setSearchQuery] = useState<string>(""); // Combined search query

  // Combine search terms into a single searchQuery
  useEffect(() => {
    const queryParts = [];
    if (patientIdQuery) {
      queryParts.push(`patientCode:${patientIdQuery}`);
    }
    if (patientNameQuery) {
      queryParts.push(`patientName:${patientNameQuery}`);
    }
    setSearchQuery(queryParts.join(" "));
  }, [patientIdQuery, patientNameQuery]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1); // Adjust for 1-based page index
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

  // Fetch billings data with filters applied
  const { data, isLoading, isFetching } = useGetAnalyticsPatientBillingsQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      filters: {
        status: selectedStatus,
        searchQuery: searchQuery, // Use the combined searchQuery
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

  console.log("Patient Billing Data", patientBillingsData);

  const columnsConfig: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Date",
      type: "date",
      flex: 1,
      valueFormatter(params) {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "patientCode",
      headerName: "Patient ID",
      flex: 1,
    },
    {
      field: "patientName",
      headerName: "Patient Name",
      flex: 1,
    },
    {
      field: "billingId",
      headerName: "Bill No.",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value),
    },
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
  ];

  const getRowId = (row: RowType) => row._id;

  return (
    <ContentSection title="Patient Billings">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        {/* Dropdown for Billing Status */}
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
    </ContentSection>
  );
};

export default PatientBillings;
