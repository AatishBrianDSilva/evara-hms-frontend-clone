import Box from '@mui/material/Box';
import React, { useState } from 'react';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';

import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { Chip, Skeleton, Tooltip } from '@mui/material';
import { Edit, Payment, Print } from '@mui/icons-material';
import { useGetBillingsQuery } from '../../../../services/patientDashboardService/billings/billingApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { formatToIndianCurrencyFormat } from '../../../../utils/formatToIndianCurrencyFormat';
import { EPatientBillingStatus } from '../../../../types/patientDashboard/billings';
import { usePrint } from '../../../../context/PrintPDFContext';
import { sortColumnWithStringPrefix } from '../../../../utils/column';
import CreateRefund from './createRefund';
import EditBill from './editBill';

interface RowType {
  _id: string;
}

const BillingsPaid: React.FC = () => {
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
        status: EPatientBillingStatus.Paid,
      },
    },
    {
      skip: !patient?.patientId,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );
  const patientBillingsPaid = data?.data?.records || [];
  const patientBillingSummary = data?.data?.summary || {};
  const patientBillingsPagination = data?.data?.pagination;
  const patientBillingsLoading = isLoading || isFetching;

  const getRowId = (row: RowType) => row._id;

  const [selectedRow, setSelectedRow] = useState<any | undefined>();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);

  // Edit Modal
  const openEditModal = (row: any) => {
    setSelectedRow(row);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedRow(undefined);
    setIsEditModalOpen(false);
  };
  const openRefundModal = (row: any) => {
    setSelectedRow(row);
    setIsRefundModalOpen(true);
  };
  const closeRefundModal = () => {
    setSelectedRow(undefined);
    setIsRefundModalOpen(false);
  };

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
        return [
          <Tooltip title="Edit Bill">
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              onClick={() => openEditModal(row)}
            />
          </Tooltip>,
          <Tooltip title="Apply Refund">
            <GridActionsCellItem
              icon={<Payment />}
              label="Refund"
              onClick={() => openRefundModal(row)}
            />
          </Tooltip>,
          <GridActionsCellItem
            icon={<Print />}
            label="Print"
            onClick={() => fetchAndPrintPdf(row._id)}
            // onClick={() => openPrintModal(row)}
          />,
        ];
      },
    },
  ];

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
        rows={patientBillingsPaid}
        getRowId={getRowId}
        page={page}
        pageSize={pageSize}
        totalRows={patientBillingsPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientBillingsLoading}
        sx={{ height: '100%' }}
        enablePagination={true}
      />

      {isRefundModalOpen && (
        <CreateRefund
          openModal={isRefundModalOpen}
          onClose={closeRefundModal}
          id={selectedRow._id}
        />
      )}
      {isEditModalOpen && (
        <EditBill
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow._id}
        />
      )}
    </Box>
  );
};

export default BillingsPaid;
