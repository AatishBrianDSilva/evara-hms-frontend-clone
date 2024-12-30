import {
  AddCircle,
  Circle,
  Edit,
  Print,
  Visibility,
} from '@mui/icons-material';
import { Box, Grid, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import { useGetDrugItemsQuery } from '../../../../services/pharmacyDashboardService/master/drugItemApi';
import { useGetDrugVendorsQuery } from '../../../../services/pharmacyDashboardService/master/drugVendorApi';
import { useGetPurchaseOrdersQuery } from '../../../../services/pharmacyDashboardService/purchaseOrderApi';
import {
  EPurchaseOrderStatus,
  IPurchaseOrder,
} from '../../../../types/pharmacyDashboard/purchaseOrder';
import ViewPurchaseOrder from './ViewPurchaseOrder';
import { usePrint } from '../../../../context/PrintPDFContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import UpdateRejectedPurchaseOrder from './UpdateRejectedPurchaseOrder';
import EditApprovalPending from './EditApprovalPending';

const Ordered: React.FC = () => {
  // const { showPromiseToast } = useToast()

  const { user } = useSelector((state: RootState) => ({
    user: state.auth.user,
  }));

  const isAdmin = user?.role === 'admin';

  const { fetchAndPrintPdf } = usePrint();

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
  // const addButtonLoading = drugItemsLoading || drugItemsFetching || drugVendorsFetching || drugVendorsLoading

  // Purchase Orders
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const {
    data: purchaseOrdersData,
    isLoading: purchaseOrdersLoading,
    isFetching: purchaseOrdersFetching,
  } = useGetPurchaseOrdersQuery({
    paginate: true,
    page,
    limit: pageSize,
    sort: { createdAt: -1 },
    filters: {
      status: [
        EPurchaseOrderStatus.WaitingForApproval,
        EPurchaseOrderStatus.RejectedByAdmin,
      ],
    },
  });

  const purchaseOrders = purchaseOrdersData?.data?.records || [];
  const purchaseOrdersPagination = purchaseOrdersData?.data?.pagination;
  const purchaseOrderLoading = purchaseOrdersLoading || purchaseOrdersFetching;

  console.log("Orders PO's", purchaseOrders);

  // Modals
  const [selectedRow, setSelectedRow] = useState<IPurchaseOrder>();

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isRejectedOrderModalOpen, setIsRejectedOrderModalOpen] =
    useState(false);
  // const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)

  // Edit Modal
  const openEditModal = (order: IPurchaseOrder) => {
    setSelectedRow(order);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedRow(undefined);
    setIsEditModalOpen(false);
  };

  // View Modal
  const openViewModal = (order: IPurchaseOrder) => {
    setSelectedRow(order);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setSelectedRow(undefined);
    setIsViewModalOpen(false);
  };

  //Edit Rejected po modal
  const openRejectedOrderModal = (order: IPurchaseOrder) => {
    setSelectedRow(order);
    setIsRejectedOrderModalOpen(true);
  };

  const closeRejectedOrderModal = () => {
    setSelectedRow(undefined);
    setIsRejectedOrderModalOpen(false);
  };

  const columnsConfig: GridColDef[] = [
    { field: 'poNumber', headerName: 'PO Number', flex: 1 },
    {
      field: 'date',
      type: 'date',
      headerName: 'PO Date',
      flex: 1,
      valueFormatter(params) {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: 'vendor',
      headerName: 'Vendor Name',
      flex: 1,
      valueGetter: params => params.value?.name,
    },
    {
      field: 'items',
      headerName: 'Item',
      flex: 1,
      valueGetter: params =>
        params.row.request.items.map((item: any) => item.item?.name).join(', '),
    },
    {
      field: 'netAmount',
      headerName: 'Net Amount',
      flex: 1,
      valueGetter: params => params.row.request.netAmount,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: params => {
        const status = params.value;

        return (
          <Grid container justifyContent="start" alignItems="center">
            <Tooltip
              title={
                status === EPurchaseOrderStatus.WaitingForApproval
                  ? 'Waiting for Approval'
                  : status === EPurchaseOrderStatus.RejectedByAdmin
                    ? 'Rejected by Admin'
                    : 'Unknown Status'
              }
            >
              {status === EPurchaseOrderStatus.WaitingForApproval ? (
                <Circle sx={{ color: 'warning.main' }} />
              ) : status === EPurchaseOrderStatus.RejectedByAdmin ? (
                <Circle sx={{ color: 'error.main' }} />
              ) : (
                <Circle sx={{ color: 'text.primary' }} />
              )}
            </Tooltip>
          </Grid>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const row = params.row;
        const actions = [
          row.status === 'RejectedByAdmin' ? (
            <Tooltip title="Edit Rejected PO">
              <GridActionsCellItem
                icon={<Edit />}
                label="Edit"
                onClick={() => openRejectedOrderModal(row)} // Open UpdateRejectedPurchaseOrder modal
              />
            </Tooltip>
          ) : (
            <Tooltip
              title={isAdmin ? 'Admin Approval' : 'Only admins can approve'}
            >
              <span>
                <GridActionsCellItem
                  icon={<AddCircle />}
                  label="Add"
                  onClick={() => isAdmin && openEditModal(row)} // Prevent click if not admin
                  disabled={!isAdmin} // Disable for non-admin
                  sx={{
                    opacity: isAdmin ? 1 : 0.5, // Make it visually dull for non-admins
                    pointerEvents: isAdmin ? 'auto' : 'none', // Prevent mouse events for disabled
                  }}
                />
              </span>
            </Tooltip>
          ),
          <Tooltip title="View">
            <GridActionsCellItem
              icon={<Visibility />}
              label="View"
              onClick={() => openViewModal(row)}
            />
          </Tooltip>,
        ];

        // Add Print action if report field exists
        if (row.report) {
          actions.push(
            <Tooltip title="Print">
              <GridActionsCellItem
                icon={<Print />}
                label="Print"
                onClick={() =>
                  fetchAndPrintPdf(row._id, 'POInvoice', 'pharmacy')
                }
              />
            </Tooltip>,
          );
        }

        return actions;
      },
    },
  ];

  return (
    <Box height={'100%'} display={'flex'} flexDirection={'column'}>
      {/* Render the CustomDataGrid only if there's no error */}

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={purchaseOrders}
          page={page}
          pageSize={pageSize}
          totalRows={purchaseOrdersPagination?.totalDocs || 0}
          loading={purchaseOrderLoading}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditApprovalPending
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow?._id || ''}
          drugItems={drugItems}
          drugVendors={drugVendors}
        />
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <ViewPurchaseOrder
          openModal={isViewModalOpen}
          onClose={closeViewModal}
          id={selectedRow?._id || ''}
        />
      )}

      {isRejectedOrderModalOpen && (
        <UpdateRejectedPurchaseOrder
          openModal={isRejectedOrderModalOpen}
          onClose={closeRejectedOrderModal}
          id={selectedRow?._id || ''}
          drugItems={drugItems}
          drugVendors={drugVendors}
        />
      )}
    </Box>
  );
};

export default Ordered;
