import { Visibility } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import React, { useState } from "react";
import CustomDataGrid from "../../../../components/CustomDataGrid/CustomDataGrid";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";

import { useGetInternalOrdersQuery } from "../../../../services/pharmacyDashboardService/internalOrderApi";
import {
  EInternalOrderStatus,
  IInternalOrder,
} from "../../../../types/pharmacyDashboard/internalOrder";
import ViewInternalOrder from "../ViewInternalOrder";

const ProcessInternalOrder: React.FC = () => {
  // Internal Orders
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };
  const {
    data: internalOrdersData,
    isLoading: internalOrdersLoading,
    isFetching: internalOrdersFetching,
  } = useGetInternalOrdersQuery({
    paginate: true,
    page,
    limit: pageSize,
    sort: { createdAt: -1 },
    filters: { status: EInternalOrderStatus.Processed },
  });
  const internalOrders = internalOrdersData?.data?.records || [];
  const internalOrdersPagination = internalOrdersData?.data?.pagination;
  const internalOrderLoading = internalOrdersLoading || internalOrdersFetching;

  console.log("Processed Orders", internalOrders);

  // Modals
  const [selectedRow, setSelectedRow] = useState<IInternalOrder>();
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  // View Modal
  const openViewModal = (order: IInternalOrder) => {
    setSelectedRow(order);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setSelectedRow(undefined);
    setIsViewModalOpen(false);
  };

  const columnsConfig: GridColDef[] = [
    { field: "ioNumber", headerName: "IO Number", flex: 1 },
    {
      field: "date",
      type: "date",
      headerName: "IO Date",
      flex: 1,
      valueFormatter(params) {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: "items",
      headerName: "Items",
      flex: 1,
      valueGetter: (params) => `${params.row.items?.length}`,
    },
    { field: "createdBy", headerName: "Transferred By", flex: 1 },
    {
      field: "transferFrom",
      headerName: "Transfer From",
      flex: 1,
      valueGetter: (params) => `${params.row.items[0]?.transferFrom?.location?.location || ""}`,
    },
    {
      field: "transferTo",
      headerName: "Transfer To",
      flex: 1,
      valueGetter: (params) => `${params.row.items[0]?.transferTo?.location || ""}`,
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <Tooltip title="View">
            <GridActionsCellItem
              icon={<Visibility />}
              label="View"
              onClick={() => openViewModal(row)}
            />
          </Tooltip>,
        ];
      },
    },
  ];

  return (
    <Box height={"100%"} display={"flex"} flexDirection={"column"}>
      {/* Render the CustomDataGrid only if there's no error */}

      <Box mt={2} flex={"1 1 auto"}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={internalOrders}
          page={page}
          pageSize={pageSize}
          totalRows={internalOrdersPagination?.totalDocs || 0}
          loading={internalOrderLoading}
          sx={{ height: "100%" }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      {/* View Modal */}
      {isViewModalOpen && (
        <ViewInternalOrder
          openModal={isViewModalOpen}
          onClose={closeViewModal}
          id={selectedRow?._id || ""}
        />
      )}
    </Box>
  );
};

export default ProcessInternalOrder;
