import { Visibility } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
// import CheckCircle from '@mui/icons-material/CheckCircle'
// import Cancel from '@mui/icons-material/Cancel'
// import { useGetDrugItemsQuery } from '../../../../services/pharmacyDashboardService/master/drugItemApi'
// import { useGetDrugVendorsQuery } from '../../../../services/pharmacyDashboardService/master/drugVendorApi'
import { useGetPurchaseOrdersQuery } from '../../../../services/pharmacyDashboardService/purchaseOrderApi';
// import { useToast } from '../../../../context/ToastContext'
import {
  EPurchaseOrderStatus,
  IPurchaseOrder,
} from '../../../../types/pharmacyDashboard/purchaseOrder';
import ViewPurchaseOrder from '../ViewPurchaseOrder';

const Rejected: React.FC = () => {
  // const { showPromiseToast } = useToast()

  // // Drug Items
  // const { data: drugItemsData, isLoading: drugItemsLoading, isFetching: drugItemsFetching } = useGetDrugItemsQuery({
  //   paginate: false,
  //   sort: { name: 1 }
  // })
  // const drugItems = drugItemsData?.data?.records || []

  // // Drug Vendors
  // const { data: drugVendorsData, isLoading: drugVendorsLoading, isFetching: drugVendorsFetching } = useGetDrugVendorsQuery({
  //   paginate: false,
  //   sort: { name: 1 }
  // })
  // const drugVendors = drugVendorsData?.data?.records || []
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
    filters: { status: EPurchaseOrderStatus.Rejected },
  });
  const purchaseOrders = purchaseOrdersData?.data?.records || [];
  const purchaseOrdersPagination = purchaseOrdersData?.data?.pagination;
  const purchaseOrderLoading = purchaseOrdersLoading || purchaseOrdersFetching;

  // // Approve/Reject Purchase Order
  // const [updatePurchaseOrderStatus, { isLoading }] = useEditPurchaseOrderStatusMutation()
  // const handleUpdatePurchaseOrderStatus = async (status: string) => {

  //   const id = selectedRow?._id

  //   if (id) {
  //     const promise = updatePurchaseOrderStatus({ id, status }).unwrap()

  //     showPromiseToast(promise, {
  //       loading: 'Updating Purchase Order Status',
  //       success: (msg) => msg || 'Purchase Order Status Updated Successfully',
  //       error: (msg) => msg || 'Error in updating Purchase Order Status'
  //     })

  //     try {
  //       await promise
  //     } catch (error) {
  //       console.error(error)
  //     }
  //     closeRejectModal()
  //     closeApproveModal()
  //   }
  // }

  // Modals
  const [selectedRow, setSelectedRow] = useState<IPurchaseOrder>();
  // const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false)
  // const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false)
  // const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  // const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)

  // Approve Modal
  // const openApproveModal = (order: IPurchaseOrder) => {
  //   setSelectedRow(order)
  //   setIsApproveModalOpen(true)
  // }
  // const closeApproveModal = () => {
  //   setSelectedRow(undefined)
  //   setIsApproveModalOpen(false)
  // }

  // Reject Modal
  // const openRejectModal = (order: IPurchaseOrder) => {
  //   setSelectedRow(order)
  //   setIsRejectModalOpen(true)
  // }
  // const closeRejectModal = () => {
  //   setSelectedRow(undefined)
  //   setIsRejectModalOpen(false)
  // }

  // Edit Modal
  // const openEditModal = (order: IPurchaseOrder) => {
  //   setSelectedRow(order)
  //   setIsEditModalOpen(true)
  // }
  // const closeEditModal = () => {
  //   setSelectedRow(undefined)
  //   setIsEditModalOpen(false)
  // }

  // View Modal
  const openViewModal = (order: IPurchaseOrder) => {
    setSelectedRow(order);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setSelectedRow(undefined);
    setIsViewModalOpen(false);
  };

  // Add Modal
  // const openAddModal = () => {
  //   setIsAddModalOpen(true)
  // }
  // const closeAddModal = () => {
  //   setIsAddModalOpen(false)
  // }

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
      valueGetter: params => params.value.name,
    },

    {
      field: 'netAmount',
      headerName: 'Amount',
      flex: 1,
      valueGetter: params => `₹ ${params.row.request.netAmount}`,
    },
    { field: 'createdBy', headerName: 'Created By', flex: 1 },
    { field: 'authorizedBy', headerName: 'Rejected By', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          // <Tooltip title="Approve">
          //   <GridActionsCellItem
          //     icon={<CheckCircle />}
          //     label="Approve"
          //     onClick={() => openApproveModal(row)}
          //   />
          // </Tooltip>,
          // <Tooltip title="Reject">
          //   <GridActionsCellItem
          //     icon={<Cancel />}
          //     label="Reject"
          //     onClick={() => openRejectModal(row)}
          //   />
          // </Tooltip>,
          // <Tooltip title="Edit">
          //   <GridActionsCellItem
          //     icon={<Edit />}
          //     label="Edit"
          //     onClick={() => openEditModal(row)}
          //   />
          // </Tooltip>,
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
    <Box height={'100%'} display={'flex'} flexDirection={'column'}>
      {/* <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField label="Search" size="small" variant="outlined" />
        <Button disabled={addButtonLoading} variant="contained" startIcon={<Add />} color="secondary" onClick={openAddModal}>
          Create
        </Button>
      </Box> */}

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

      {/* Approve Modal */}
      {/* {isApproveModalOpen && (
        <Dialog open={isApproveModalOpen} onClose={closeApproveModal} maxWidth="sm" fullWidth>
          <DialogTitle color={"primary"}>Approve Rejected</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to approve {selectedRow?.poNumber}?</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={closeApproveModal}>Cancel</Button>
            <Button color="primary" disabled={isLoading} onClick={() => handleUpdatePurchaseOrderStatus(EPurchaseOrderStatus.Rejected)}>Approve</Button>
          </DialogActions>
        </Dialog>
      )} */}

      {/* Reject Modal */}
      {/* {isRejectModalOpen && (
        <Dialog open={isRejectModalOpen} onClose={closeRejectModal} maxWidth="sm" fullWidth>
          <DialogTitle color={"primary"}>Reject Rejected</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to reject {selectedRow?.poNumber}?</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={closeRejectModal}>Cancel</Button>
            <Button color="primary" disabled={isLoading} onClick={() => handleUpdatePurchaseOrderStatus(EPurchaseOrderStatus.Rejected)}>Reject</Button>
          </DialogActions>
        </Dialog>
      )} */}

      {/* View Modal */}
      {isViewModalOpen && (
        <ViewPurchaseOrder
          openModal={isViewModalOpen}
          onClose={closeViewModal}
          id={selectedRow?._id || ''}
        />
      )}
    </Box>
  );
};

export default Rejected;
