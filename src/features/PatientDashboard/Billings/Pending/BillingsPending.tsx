import Box from '@mui/material/Box';
import React, { useState } from 'react';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';

import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { Button, Chip, Skeleton, Tooltip } from '@mui/material';
import { DiscountTwoTone, Print } from '@mui/icons-material';
import { useGetBillingsQuery } from '../../../../services/patientDashboardService/billings/billingApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import ProcessPendingModal from './ProcessPendingModal';
import PrintPending from './PrintPending';
import EditPending from './EditPending';
import { formatToIndianCurrencyFormat } from '../../../../utils/formatToIndianCurrencyFormat';
import { EPatientBillingStatus } from '../../../../types/patientDashboard/billings';
import { usePrint } from '../../../../context/PrintPDFContext';
import { sortColumnWithStringPrefix } from '../../../../utils/column';

interface RowType {
  _id: string;
}

const BillingsPending: React.FC = () => {
  const { fetchAndPrintPdf } = usePrint();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const { patient } = useSelector((state: RootState) => state.patients);

  const { user } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, isFetching } = useGetBillingsQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      sort: {
        createdAt: -1,
      },
      filters: {
        patientCode: patient?.patientId,
        status: EPatientBillingStatus.Pending,
      },
    },
    {
      skip: !patient?.patientId,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );
  const patientBillingsPending = data?.data?.records || [];
  const patientBillingSummary = data?.data?.summary || {};
  const patientBillingsPagination = data?.data?.pagination;
  const patientBillingsLoading = isLoading || isFetching;

  const getRowId = (row: RowType) => row._id;

  // // Delete investigation
  // const [deletePendingBillings, { isLoading: isDeleteLoading }] =
  //   useDeleteBillingMutation();

  // const handleDelete = async () => {
  //   const id = selectedRow.id;
  //   const promise = deletePendingBillings(id).unwrap();

  //   showPromiseToast(promise, {
  //     loading: 'Deleting Bill...',
  //     success: () => 'Bill deleted successfully',
  //     error: () => 'Error deleting Bill',
  //   });

  //   try {
  //     await promise;
  //   } catch (error) {
  //     console.error('Error deleting bill', error);
  //   }
  //   // closeDeleteModal();
  // };

  const columnsConfig: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date',
      type: 'date',
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
      field: 'billingId',
      headerName: 'Bill No.',
      flex: 1,
      sortComparator: sortColumnWithStringPrefix,
    },
    {
      field: 'billType',
      headerName: 'Category',
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'tax',
      headerName: 'Tax',
      flex: 1,
      valueFormatter: params =>
        params.value ? formatToIndianCurrencyFormat(params.value) : 'NA',
    },
    {
      field: 'subTotal',
      headerName: 'Total',
      flex: 1,
      valueGetter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'discount',
      headerName: 'Discount',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'totalPaid',
      headerName: 'Paid',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'totalDues',
      headerName: 'Due',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
      getActions: params => {
        const row = params.row;
        if (row.totalDues === row.grandTotal) {
          return [
            <Tooltip title="Apply Discount">
              <GridActionsCellItem
                icon={<DiscountTwoTone />}
                label="Edit"
                onClick={() => openEditModal(row)}
              />
            </Tooltip>,
            // <GridActionsCellItem
            //   icon={<Delete />}
            //   label="Delete"
            //   onClick={() => openDeleteModal(row)}
            // />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<Print />}
            label="Print"
            onClick={() => fetchAndPrintPdf(row._id)}
            // onClick={() => openPrintModal(row)}
          />,
          <Tooltip title="Apply Discount">
            <GridActionsCellItem
              icon={<DiscountTwoTone />}
              label="Edit"
              onClick={() => openEditModal(row)}
            />
          </Tooltip>,
          // <GridActionsCellItem
          //   icon={<Delete />}
          //   label="Delete"
          //   onClick={() => openDeleteModal(row)}
          // />,
        ];
      },
    },
  ];

  const [selectedRow, setSelectedRow] = useState<any | undefined>();
  const [checkedRows, setCheckedRows] = useState<(string | number)[]>([]);

  const [isProcessModalOpen, setIsProcessModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Process Modal
  const openProcessModal = () => {
    setIsProcessModalOpen(true);
  };
  const closeProcessModal = () => {
    setIsProcessModalOpen(false);
  };

  // Edit Modal
  const openEditModal = (row: any) => {
    setSelectedRow(row);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedRow(undefined);
    setIsEditModalOpen(false);
  };

  // Delete Modal
  // const openDeleteModal = (row: any) => {
  //   setSelectedRow(row);
  //   setIsDeleteModalOpen(true);
  // };
  // const closeDeleteModal = () => {
  //   setSelectedRow(undefined);
  //   setIsDeleteModalOpen(false);
  // };

  // const openPrintModal = (row: any) => {
  //   setSelectedRow(row);
  //   setIsPrintModalOpen(true);
  // };
  const closePrintModal = () => {
    setSelectedRow(undefined);
    setIsPrintModalOpen(false);
  };

  return (
    <Box p={2} display={'flex'} flexDirection={'column'} flex={1}>
      {patientBillingsLoading ? (
        <Box
          display={'flex'}
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Skeleton width={125} height={35} variant="rounded" />
          <Skeleton width={125} height={30} variant="rounded" />
          <Skeleton width={125} height={30} variant="rounded" />
          <Skeleton width={125} height={30} variant="rounded" />
        </Box>
      ) : (
        <Box
          display={'flex'}
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Chip
            label={
              'Amount: ' +
              formatToIndianCurrencyFormat(patientBillingSummary.amount)
            }
            color="primary"
          />
          <Chip
            label={
              'Payment: ' +
              formatToIndianCurrencyFormat(patientBillingSummary.payment)
            }
            color="primary"
          />
          <Chip
            label={
              'Discount: ' +
              formatToIndianCurrencyFormat(patientBillingSummary.discount)
            }
            color="primary"
          />
          <Chip
            label={
              'Due: ' + formatToIndianCurrencyFormat(patientBillingSummary.due)
            }
            color="primary"
          />
        </Box>
      )}

      <CustomDataGrid
        autoHeight={true}
        columns={columnsConfig}
        rows={patientBillingsPending}
        getRowId={getRowId}
        page={page}
        pageSize={pageSize}
        totalRows={patientBillingsPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientBillingsLoading}
        sx={{ height: '100%' }}
        enablePagination={true}
        checkboxSelection={true}
        onSelectionChange={newSelection => setCheckedRows(newSelection)}
      />

      <Box
        display={'flex'}
        justifyContent="flex-end"
        alignItems="center"
        mt={3}
      >
        <Button
          variant="contained"
          color="primary"
          disabled={
            checkedRows.length === 0 || !!(user && user.role === 'doctor')
          }
          onClick={openProcessModal}
        >
          Pay
        </Button>
      </Box>

      {isProcessModalOpen && (
        <ProcessPendingModal
          openModal={isProcessModalOpen}
          onClose={closeProcessModal}
          ids={checkedRows.map(row => row.toString())}
        />
      )}

      {isEditModalOpen && (
        <EditPending
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow._id}
        />
      )}

      {isPrintModalOpen && (
        <PrintPending
          openModal={isPrintModalOpen}
          onClose={closePrintModal}
          id={selectedRow._id}
        />
      )}

      {/* {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text={`${selectedRow?.billingId}`}
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={isDeleteLoading}
        />
      )} */}
    </Box>
  );
};

export default BillingsPending;
