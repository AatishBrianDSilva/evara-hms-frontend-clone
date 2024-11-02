import Box from '@mui/material/Box';
import React, { useState } from 'react';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';

import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { Chip, Skeleton } from '@mui/material';
import { Print } from '@mui/icons-material';
import { useGetBillingsQuery } from '../../../../services/patientDashboardService/billings/billingApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import PrintInvoice from '../PrintInvoice';
import { formatToIndianCurrencyFormat } from '../../../../utils/formatToIndianCurrencyFormat';

interface RowType {
  _id: string;
}

const BillingsTransactions: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const { patient, case: patientCase } = useSelector(
    (state: RootState) => state.patients,
  );

  const { data, isLoading, isFetching } = useGetBillingsQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      filters: {
        patientCode: patient?.patientId,
      },
    },
    {
      skip: !patient?.patientId,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );
  const patientBillingsTransactions = data?.data?.records || [];
  const patientBillingSummary = data?.data?.summary || {};
  const patientBillingsPagination = data?.data?.pagination;
  const patientBillingsLoading = isLoading || isFetching;

  const getRowId = (row: RowType) => row._id;

  const columnsConfig: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date',
      type: 'date',
      flex: 1,
      valueFormatter(params) {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: 'billingId',
      headerName: 'Bill No.',
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
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
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
      field: 'totalRefunded',
      headerName: 'Refunded',
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
          <GridActionsCellItem
            icon={<Print />}
            label="Print"
            onClick={() => openPrintModal(row)}
          />,
        ];
      },
    },
  ];

  const [selectedRow, setSelectedRow] = useState<any | undefined>();

  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  const openPrintModal = (row: any) => {
    setSelectedRow(row);
    setIsPrintModalOpen(true);
  };
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
        rows={patientBillingsTransactions}
        page={page}
        getRowId={getRowId}
        pageSize={pageSize}
        totalRows={patientBillingsPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientBillingsLoading}
        sx={{ height: '100%' }}
        enablePagination={true}
      />

      {isPrintModalOpen && (
        <PrintInvoice
          openModal={isPrintModalOpen}
          onClose={closePrintModal}
          id={selectedRow._id}
          patient={patient!}
          patientCase={patientCase!}
        />
      )}
    </Box>
  );
};

export default BillingsTransactions;
