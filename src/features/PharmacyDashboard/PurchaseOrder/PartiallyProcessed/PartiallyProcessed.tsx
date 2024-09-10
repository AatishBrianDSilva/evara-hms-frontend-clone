import { Visibility, Edit } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import React, { useState } from "react";
import CustomDataGrid from "../../../../components/CustomDataGrid/CustomDataGrid";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useGetPurchaseOrdersQuery } from "../../../../services/pharmacyDashboardService/purchaseOrderApi";
import { EPurchaseOrderStatus } from "../../../../types/pharmacyDashboard/purchaseOrder";
import ViewPartiallyProcessedPurchaseOrder from "./ViewPartiallyProcessedPurchaseOrder";
import EditPartiallyProcessed from "./EditPartiallyProcessed";
import { useGetDrugVendorsQuery } from "../../../../services/pharmacyDashboardService/master/drugVendorApi";
import { useGetDrugItemsQuery } from "../../../../services/pharmacyDashboardService/master/drugItemApi";

const PartiallyProcessed: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newPageSize: number) => setPageSize(newPageSize);

  const {
    data: purchaseOrdersData,
    isLoading: purchaseOrdersLoading,
    isFetching: purchaseOrdersFetching,
  } = useGetPurchaseOrdersQuery({
    paginate: true,
    page,
    limit: pageSize,
    sort: { createdAt: -1 },
    filters: { status: EPurchaseOrderStatus.Processed, itemStatus: "Pending" }, // Use the itemStatus filter
  });

  const purchaseOrders = purchaseOrdersData?.data?.records || [];
  const purchaseOrdersPagination = purchaseOrdersData?.data?.pagination;
  const purchaseOrderLoading = purchaseOrdersLoading || purchaseOrdersFetching;

  const partiallyProcessedItems = purchaseOrders.flatMap((order) =>
    order.request.items.map((item) => ({ ...item, poNumber: order.poNumber, poId: order._id }))
  );

  // Drug Items
  const { data: drugItemsData } = useGetDrugItemsQuery({
    paginate: false,
    sort: { name: 1 },
  });
  const drugItems = drugItemsData?.data?.records || [];

  // Drug Vendors
  const { data: drugVendorsData } = useGetDrugVendorsQuery({
    paginate: false,
    sort: { name: 1 },
  });
  const drugVendors = drugVendorsData?.data?.records || [];

  // Modals
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const openViewModal = (item: any) => {
    setSelectedRow(item);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setSelectedRow(null);
    setIsViewModalOpen(false);
  };

  const openEditModal = (item: any) => {
    setSelectedRow(item);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedRow(null);
    setIsEditModalOpen(false);
  };

  const columnsConfig: GridColDef[] = [
    { field: "poNumber", headerName: "PO Number", flex: 1 },
    {
      field: "itemName",
      headerName: "Item",
      flex: 1,
      valueGetter: (params) => params.row.item.name,
    },
    {
      field: "noOfPacks",
      headerName: "No of Packs",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
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
        <Tooltip title="Edit" key="edit">
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => openEditModal(params.row)}
          />
        </Tooltip>,
      ],
    },
  ];

  return (
    <Box height={"100%"} display={"flex"} flexDirection={"column"}>
      <Box mt={2} flex={"1 1 auto"}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={partiallyProcessedItems}
          getRowId={(row) => `${row.poNumber}-${row.item._id}`}
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

      {isViewModalOpen && selectedRow && (
        <ViewPartiallyProcessedPurchaseOrder
          openModal={isViewModalOpen}
          onClose={closeViewModal}
          id={selectedRow.poId}
        />
      )}

      {isEditModalOpen && selectedRow && (
        <EditPartiallyProcessed
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow.poId}
          drugItems={drugItems}
          drugVendors={drugVendors}
        />
      )}
    </Box>
  );
};

export default PartiallyProcessed;
