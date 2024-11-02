import { Add, Visibility } from '@mui/icons-material';
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
import AddInternalOrderDraft from './AddDraft';

import {
  useApproveInternalOrderMutation,
  useGetInternalOrdersQuery,
  useRejectInternalOrderMutation,
} from '../../../../services/pharmacyDashboardService/internalOrderApi';
import { useToast } from '../../../../context/ToastContext';
import {
  EInternalOrderStatus,
  IInternalOrder,
} from '../../../../types/pharmacyDashboard/internalOrder';
import ViewInternalOrder from '../ViewInternalOrder';
import { useGetStocksQuery } from '../../../../services/pharmacyDashboardService/stocksApi';
import { useGetDrugLocationsQuery } from '../../../../services/pharmacyDashboardService/master/drugLocationApi';
import _ from 'lodash';

const DraftInternalOrder: React.FC = () => {
  const { showPromiseToast } = useToast();

  // Pharmacy Stocks
  const {
    data: stocksData,
    isLoading: stocksLoading,
    isFetching: stocksFetching,
  } = useGetStocksQuery();
  const stocks = stocksData?.data || [];

  const {
    data: drugLocationsData,
    isLoading: drugLocationsLoading,
    isFetching: drugLocationsFetching,
  } = useGetDrugLocationsQuery({
    paginate: false,
    sort: { name: 1 },
  });
  const drugLocations = drugLocationsData?.data?.records || [];

  const addButtonLoading =
    stocksFetching ||
    stocksLoading ||
    drugLocationsLoading ||
    drugLocationsFetching;

  // Internal Orders
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
    data: internalOrdersData,
    isLoading: internalOrdersLoading,
    isFetching: internalOrdersFetching,
  } = useGetInternalOrdersQuery({
    paginate: true,
    page,
    limit: pageSize,
    sort: { createdAt: -1 },
    searchQuery,
    filters: { status: EInternalOrderStatus.Draft },
  });
  const internalOrders = internalOrdersData?.data?.records || [];
  const internalOrdersPagination = internalOrdersData?.data?.pagination;
  const internalOrderLoading = internalOrdersLoading || internalOrdersFetching;

  // Approve/Reject Internal Order
  const [approveInternalOrder, { isLoading: isApprovalLoading }] =
    useApproveInternalOrderMutation();
  const [rejectInternalOrder, { isLoading: isRejectionLoading }] =
    useRejectInternalOrderMutation();

  const handleApproveInternalOrder = async () => {
    const id = selectedRow?._id;

    if (id) {
      const promise = approveInternalOrder(id).unwrap();

      showPromiseToast(promise, {
        loading: 'Approving Internal Order Status',
        success: msg => msg || 'Internal Order Approved Successfully',
        error: msg => msg || 'Error in updating Internal Order Status',
      });

      try {
        await promise;
      } catch (error) {
        console.error(error);
      }
      closeApproveModal();
    }
  };

  const handleRejectInternalOrder = async () => {
    const id = selectedRow?._id;

    if (id) {
      const promise = rejectInternalOrder(id).unwrap();

      showPromiseToast(promise, {
        loading: 'Rejecting Internal Order Status',
        success: msg => msg || 'Internal Order Rejected Successfully',
        error: msg => msg || 'Error in updating Internal Order Status',
      });

      try {
        await promise;
      } catch (error) {
        console.error(error);
      }
      closeRejectModal();
    }
  };

  // Modals
  const [selectedRow, setSelectedRow] = useState<IInternalOrder>();
  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  // const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Approve Modal
  const openApproveModal = (order: IInternalOrder) => {
    setSelectedRow(order);
    setIsApproveModalOpen(true);
  };
  const closeApproveModal = () => {
    setSelectedRow(undefined);
    setIsApproveModalOpen(false);
  };

  // Reject Modal
  const openRejectModal = (order: IInternalOrder) => {
    setSelectedRow(order);
    setIsRejectModalOpen(true);
  };
  const closeRejectModal = () => {
    setSelectedRow(undefined);
    setIsRejectModalOpen(false);
  };

  // // Edit Modal
  // const openEditModal = (order: IInternalOrder) => {
  //   setSelectedRow(order)
  //   setIsEditModalOpen(true)
  // }
  // const closeEditModal = () => {
  //   setSelectedRow(undefined)
  //   setIsEditModalOpen(false)
  // }

  // View Modal
  const openViewModal = (order: IInternalOrder) => {
    setSelectedRow(order);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setSelectedRow(undefined);
    setIsViewModalOpen(false);
  };

  // Add Modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const columnsConfig: GridColDef[] = [
    { field: 'ioNumber', headerName: 'IO Number', flex: 1 },
    {
      field: 'date',
      type: 'date',
      headerName: 'IO Date',
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
      field: 'items',
      headerName: 'Items',
      flex: 1,
      valueGetter: params => `${params.row.items?.length}`,
    },
    { field: 'createdBy', headerName: 'Created By', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
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
          rows={internalOrders}
          page={page}
          pageSize={pageSize}
          totalRows={internalOrdersPagination?.totalDocs || 0}
          loading={internalOrderLoading}
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
          <DialogTitle color={'primary'}>Approve Order</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to approve {selectedRow?.ioNumber}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={closeApproveModal}>
              Cancel
            </Button>
            <Button
              color="success"
              disabled={isApprovalLoading}
              onClick={handleApproveInternalOrder}
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
          <DialogTitle color={'primary'}>Reject Order</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to reject {selectedRow?.ioNumber}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={closeRejectModal}>
              Cancel
            </Button>
            <Button
              color="error"
              disabled={isRejectionLoading}
              onClick={handleRejectInternalOrder}
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Edit Modal */}
      {/* {isEditModalOpen && (<EditInternalOrderDraft openModal={isEditModalOpen}
        onClose={closeEditModal}
        id={selectedRow?._id || ""}
        pharmacyStocks={stocks}
        drugLocations={drugLocations}
      />)} */}

      {/* View Modal */}
      {isViewModalOpen && (
        <ViewInternalOrder
          openModal={isViewModalOpen}
          onClose={closeViewModal}
          id={selectedRow?._id || ''}
        />
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddInternalOrderDraft
          openModal={isAddModalOpen}
          onClose={closeAddModal}
          pharmacyStock={stocks}
          drugLocations={drugLocations}
        />
      )}
    </Box>
  );
};

export default DraftInternalOrder;
