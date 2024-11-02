import { Add, Edit, Print } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import EditPurchaseOrderDraft from './EditDraft';
import AddPurchaseOrderDraft from './AddDraft';
import { useGetDrugItemsQuery } from '../../../../services/pharmacyDashboardService/master/drugItemApi';
import { useGetDrugVendorsQuery } from '../../../../services/pharmacyDashboardService/master/drugVendorApi';
import {
  useEditPurchaseOrderStatusMutation,
  useGetPurchaseOrdersQuery,
} from '../../../../services/pharmacyDashboardService/purchaseOrderApi';
import { useToast } from '../../../../context/ToastContext';
import {
  EPurchaseOrderStatus,
  IPurchaseOrder,
} from '../../../../types/pharmacyDashboard/purchaseOrder';
import _ from 'lodash';
import { usePrint } from '../../../../context/PrintPDFContext';

const Draft: React.FC = () => {
  const { showPromiseToast } = useToast();

  const { fetchAndPrintPdf } = usePrint();

  // Drug Items
  const {
    data: drugItemsData,
    isLoading: drugItemsLoading,
    isFetching: drugItemsFetching,
  } = useGetDrugItemsQuery({
    paginate: false,
    sort: { name: 1 },
    filters: { status: 'Active' }, // Send only "Active" status
  });
  const drugItems = drugItemsData?.data?.records || [];

  // Drug Vendors
  const {
    data: drugVendorsData,
    isLoading: drugVendorsLoading,
    isFetching: drugVendorsFetching,
  } = useGetDrugVendorsQuery({
    paginate: false,
    sort: { name: 1 },
    filters: { status: 'Active' }, // Send only "Active" status
  });

  const drugVendors = drugVendorsData?.data?.records || [];

  console.log('Drug Items', drugItems);

  const addButtonLoading =
    drugItemsLoading ||
    drugItemsFetching ||
    drugVendorsFetching ||
    drugVendorsLoading;

  // Purchase Orders
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = React.useState(25);

  const handleSearchChange = useCallback((query: string) => {
    setPage(1); // Reset the page
    setSearchQuery(query);
  }, []);

  // Debounce the search handling
  const debouncedSearchChange = useCallback(
    _.debounce(handleSearchChange, 500),
    [handleSearchChange], // Ensure that handleSearchChange is stable
  );
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
    filters: { status: EPurchaseOrderStatus.Draft },
    searchQuery: searchQuery,
  });
  const purchaseOrders = purchaseOrdersData?.data?.records || [];
  const purchaseOrdersPagination = purchaseOrdersData?.data?.pagination;
  const purchaseOrderLoading = purchaseOrdersLoading || purchaseOrdersFetching;

  console.log("Draft PO's", purchaseOrders);

  // Approve/Reject Purchase Order
  const [updatePurchaseOrderStatus, { isLoading }] =
    useEditPurchaseOrderStatusMutation();
  const handleUpdatePurchaseOrderStatus = async (status: string) => {
    const id = selectedRow?._id;
    console.log('Selected Row:', selectedRow);

    if (id) {
      const promise = updatePurchaseOrderStatus({ id, status }).unwrap();

      showPromiseToast(promise, {
        loading: 'Updating Purchase Order Status',
        success: msg => msg || 'Purchase Order Status Updated Successfully',
        error: msg => msg || 'Error in updating Purchase Order Status',
      });

      try {
        await promise;
      } catch (error) {
        console.error(error);
      }
      closeRejectModal();
      closeApproveModal();
    }
  };

  // Modals
  const [selectedRow, setSelectedRow] = useState<IPurchaseOrder>();
  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  // const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Approve Modal
  const openApproveModal = (order: IPurchaseOrder) => {
    setSelectedRow(order);
    setIsApproveModalOpen(true);
  };
  const closeApproveModal = () => {
    setSelectedRow(undefined);
    setIsApproveModalOpen(false);
  };

  // Reject Modal
  const openRejectModal = (order: IPurchaseOrder) => {
    setSelectedRow(order);
    setIsRejectModalOpen(true);
  };
  const closeRejectModal = () => {
    setSelectedRow(undefined);
    setIsRejectModalOpen(false);
  };

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
  // const openViewModal = (order: IPurchaseOrder) => {
  //   setSelectedRow(order);
  //   setIsViewModalOpen(true);
  // };
  // const closeViewModal = () => {
  //   setSelectedRow(undefined);
  //   setIsViewModalOpen(false);
  // };

  // Add Modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const columnsConfig: GridColDef[] = [
    { field: 'poNumber', headerName: 'PO Number', flex: 1.5 },
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
      field: 'itemName',
      headerName: 'Item Name',
      flex: 1,
      valueGetter: params =>
        params.row.request.items.map((item: any) => item.item?.name).join(', '),
    },

    {
      field: 'packSize',
      headerName: 'Pack Size',
      flex: 1,
      valueGetter: params =>
        params.row.request.items.map((item: any) => item.packSize).join(', '),
    },

    {
      field: 'packs',
      headerName: 'Packs',
      flex: 1,
      valueGetter: params =>
        params.row.request.items.map((item: any) => item.noOfPacks).join(', '),
    },

    {
      field: 'freeQty',
      headerName: 'Free Quantity',
      flex: 1,
      valueGetter: params =>
        params.row.request.items
          .map((item: any) => item.freeQuantity)
          .join(', '),
    },

    {
      field: 'cost',
      headerName: 'cost',
      flex: 1,
      valueGetter: params =>
        params.row.request.items.map((item: any) => item.buyPrice).join(', '),
    },

    {
      field: 'mrp',
      headerName: 'MRP',
      flex: 1,
      valueGetter: params =>
        params.row.request.items.map((item: any) => item.mrpPerPack).join(', '),
    },

    // {
    //   field: "tax",
    //   headerName: "Tax",
    //   flex: 1,
    //   valueGetter: (params) => params.row.request.items.map((item: any) => item.tax).join(", "),
    // },

    {
      field: 'netAmount',
      headerName: 'Total',
      flex: 1,
      valueGetter: params => params.row.request.netAmount,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const row = params.row;
        const actions = [
          <Tooltip title="Approve">
            <GridActionsCellItem
              icon={<CheckCircle />}
              label="Approve"
              onClick={() => openApproveModal(row)}
            />
          </Tooltip>,
          <Tooltip title="Reject">
            <GridActionsCellItem
              icon={<Cancel />}
              label="Reject"
              onClick={() => openRejectModal(row)}
            />
          </Tooltip>,
          <Tooltip title="Edit">
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              onClick={() => openEditModal(row)}
            />
          </Tooltip>,
        ];

        // Add Print action only if report field exists
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

  // const columnsConfig: GridColDef[] = [
  //   {
  //     field: "date",
  //     type: "date",
  //     headerName: "Date",
  //     flex: 1,
  //     valueFormatter: (params) => new Date(params.value as string).toLocaleDateString(),
  //   },
  //   { field: "vendor", headerName: "Vendor", flex: 1, valueGetter: (params) => params.value.name },
  //   { field: "item", headerName: "Item", flex: 1, valueGetter: (params) => params.value.name },
  //   { field: "quantityPerPack", headerName: "Quantity/Pack", flex: 1 },
  //   { field: "noOfPacks", headerName: "Packs", flex: 1 },
  //   { field: "freeQuantity", headerName: "Free Qty", flex: 1 },
  //   { field: "mrp", headerName: "MRP", flex: 1, valueGetter: (params) => `₹ ${params.value}` },
  //   { field: "cost", headerName: "Rate", flex: 1, valueGetter: (params) => `₹ ${params.value}` },
  //   { field: "tax", headerName: "Tax", flex: 1, valueGetter: (params) => `${params.value}%` },
  //   {
  //     field: "totalAmount",
  //     headerName: "Total",
  //     flex: 1,
  //     valueGetter: (params) => `₹ ${params.value}`,
  //   },
  //   {
  //     field: "actions",
  //     headerName: "Actions",
  //     flex: 1,
  //     type: "actions",
  //     getActions: (params: GridRowParams) => {
  //       const row = params.row;
  //       return [
  //         <Tooltip title="Approve">
  //           <GridActionsCellItem
  //             icon={<CheckCircle />}
  //             label="Approve"
  //             onClick={() => openApproveModal(row)}
  //           />
  //         </Tooltip>,
  //         <Tooltip title="Reject">
  //           <GridActionsCellItem
  //             icon={<Cancel />}
  //             label="Reject"
  //             onClick={() => openRejectModal(row)}
  //           />
  //         </Tooltip>,
  //         <Tooltip title="Edit">
  //           <GridActionsCellItem icon={<Edit />} label="Edit" onClick={() => openEditModal(row)} />
  //         </Tooltip>,
  //         <Tooltip title="View">
  //           <GridActionsCellItem
  //             icon={<Visibility />}
  //             label="View"
  //             onClick={() => openViewModal(row)}
  //           />
  //         </Tooltip>,
  //       ];
  //     },
  //   },
  // ];

  return (
    <Box height={'100%'} display={'flex'} flexDirection={'column'}>
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="ID"
          size="small"
          variant="outlined"
          onChange={e => debouncedSearchChange(e.target.value)}
        />
        <Button
          disabled={addButtonLoading}
          variant="contained"
          startIcon={<Add />}
          color="secondary"
          onClick={openAddModal}
        >
          Create
        </Button>
      </Box>

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
      {isApproveModalOpen && (
        <Dialog
          open={isApproveModalOpen}
          onClose={closeApproveModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle color={'primary'}>Approve Draft</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to approve {selectedRow?.poNumber}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={closeApproveModal}>
              Cancel
            </Button>
            <Button
              color="success"
              disabled={isLoading}
              onClick={() =>
                handleUpdatePurchaseOrderStatus(EPurchaseOrderStatus.Approved)
              }
            >
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <Dialog
          open={isRejectModalOpen}
          onClose={closeRejectModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle color={'primary'}>Reject Draft</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to reject {selectedRow?.poNumber}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={closeRejectModal}>
              Cancel
            </Button>
            <Button
              color="error"
              disabled={isLoading}
              onClick={() =>
                handleUpdatePurchaseOrderStatus(EPurchaseOrderStatus.Rejected)
              }
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditPurchaseOrderDraft
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow?._id || ''}
          drugItems={drugItems}
          drugVendors={drugVendors}
        />
      )}

      {/* View Modal */}
      {/* {isViewModalOpen && (
        <ViewPurchaseOrder
          openModal={isViewModalOpen}
          onClose={closeViewModal}
          id={selectedRow?._id || ""}
        />
      )} */}

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddPurchaseOrderDraft
          openModal={isAddModalOpen}
          onClose={closeAddModal}
          drugItems={drugItems}
          drugVendors={drugVendors}
        />
      )}
    </Box>
  );
};

export default Draft;
