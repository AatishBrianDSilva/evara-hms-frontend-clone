import React, { useState, useEffect } from "react";
import ContentSection from "../../../components/ContentSection/ContentSection";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  SelectChangeEvent,
} from "@mui/material";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Visibility } from "@mui/icons-material";
import ViewPurchaseOrder from "./ViewPurchaseOrder";
import {
  EPurchaseOrderStatus,
  IPurchaseOrder,
} from "../../../types/pharmacyDashboard/purchaseOrder";
import { useGetPurchaseOrderReportQuery } from "../../../services/analyticsDashboardService/pharmacy/purchaseOrderReportApi";
import CustomeDateRangePicker from "../../../components/CustomDateRangePicker/CustomDateRangePicker";


const PurchaseOrderReport: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [vendorNameQuery, setVendorNameQuery] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<IPurchaseOrder | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<EPurchaseOrderStatus>(
    EPurchaseOrderStatus.Processed
  );

  const [startDate, setStartDate] = useState<Date | null>(null); // For start date
  const [endDate, setEndDate] = useState<Date | null>(null); // For end date

  // Handle the date range change
  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  const startDateUTC = startDate;
  const endDateUTC = endDate

  // Fetch purchase orders with filtering
  const {
    data: purchaseOrdersData,
    isLoading: purchaseOrdersLoading,
    isFetching: purchaseOrdersFetching,
    refetch,
  } = useGetPurchaseOrderReportQuery({
    paginate: true,
    page,
    limit: pageSize,
    sort: { createdAt: -1 },
    // vendorName: vendorNameQuery, // Pass vendorNameQuery to the backend request
    filters: {
      status: selectedStatus,
      vendorName: vendorNameQuery,
      saleStartDate: startDateUTC || undefined,
      saleEndDate: endDateUTC || undefined,
    },
  });

  const purchaseOrders = purchaseOrdersData?.data?.records || [];
  const purchaseOrdersPagination = purchaseOrdersData?.data?.pagination;
  const purchaseOrderLoading = purchaseOrdersLoading || purchaseOrdersFetching;

  const getRowId = (row: any) => row._id;

  useEffect(() => {
    console.log("Refetching with vendorNameQuery:", vendorNameQuery);
    refetch();
  }, [selectedStatus, vendorNameQuery, refetch]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleVendorNameQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVendorNameQuery(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent<EPurchaseOrderStatus>) => {
    setSelectedStatus(event.target.value as EPurchaseOrderStatus);
  };

  const openViewModal = (order: IPurchaseOrder) => {
    setSelectedRow(order);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedRow(undefined);
    setIsViewModalOpen(false);
  };

  const columnsConfig: GridColDef[] = [
    { field: "poNumber", headerName: "PO Number", flex: 1 },
    {
      field: "date",
      type: "date",
      headerName: "PO Date",
      flex: 1,
      valueFormatter: (params) => new Date(params.value as string).toLocaleDateString(),
    },
    {
      field: "vendor",
      headerName: "Vendor Name",
      flex: 1,
      valueGetter: (params) => params.row.vendor.name,
    },
    {
      field: "netAmount",
      headerName: "Amount",
      flex: 1,
      valueGetter: (params) => `₹ ${params.row.request.netAmount}`,
    },
    { field: "authorizedBy", headerName: "Processed By", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: GridRowParams) => [
        <Tooltip title="View" key="view">
          <GridActionsCellItem
            icon={<Visibility />}
            label="View"
            onClick={() => openViewModal(params.row)}
          />
        </Tooltip>,
      ],
    },
  ];

  return (
    <ContentSection title="Purchase Order Reports">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <FormControl variant="outlined" size="small">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={selectedStatus}
            onChange={handleStatusChange}
            style={{ minWidth: 150 }}
          >
            {Object.values(EPurchaseOrderStatus).map((status) => (
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
          label="Filter by Vendor Name"
          size="small"
          variant="outlined"
          value={vendorNameQuery}
          onChange={handleVendorNameQueryChange}
          placeholder="Enter vendor name"
        />
      </Box>
      <Box mt={2} flex={"1 1 auto"}>
        <CustomDataGrid
          autoHeight={false}
          getRowId={getRowId}
          columns={columnsConfig}
          rows={purchaseOrders}
          page={page}
          pageSize={pageSize}
          totalRows={purchaseOrdersPagination?.totalDocs || 0}
          loading={purchaseOrderLoading}
          sx={{ height: "100%" }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>
      {isViewModalOpen && (
        <ViewPurchaseOrder
          openModal={isViewModalOpen}
          onClose={closeViewModal}
          id={selectedRow?._id || ""}
        />
      )}
    </ContentSection>
  );
};

export default PurchaseOrderReport;
