import React, { useCallback, useState } from 'react';
import { Box } from '@mui/material';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import { Visibility } from '@mui/icons-material';
import { useGetInvoicesQuery } from '../../../services/pharmacyDashboardService/invoiceApi';
import { usePrint } from '../../../context/PrintPDFContext';
import ContentSection from '../../../components/ContentSection/ContentSection';
import _ from 'lodash';

interface InvoiceRecord {
  _id: string;
  purchaseOrderId: string;
  invoiceNumber: string;
  createdAt: string;
  totalAmount: number;
  vendorName: string;
}

const Invoices: React.FC = () => {
  const { fetchAndPrintPdf } = usePrint();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [searchQuery] = useState<string>('');

  const {
    data: pharmacyInvoicesData,
    isLoading,
    isFetching,
  } = useGetInvoicesQuery({
    page,
    limit: pageSize,
    searchQuery,
  });

  const loading = isLoading || isFetching;

  const rows = pharmacyInvoicesData?.data?.records || [];
  interface Pagination {
    totalDocs: number;
    [key: string]: any; // Add other properties if needed
  }

  const pagination: Pagination = pharmacyInvoicesData?.data?.pagination || {
    totalDocs: 0,
  };
  const rowCount = pagination?.totalDocs || 0;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newSize: number) => setPageSize(newSize);

  const getRowId = (row: InvoiceRecord) => row._id;

  const columns: GridColDef[] = [
    {
      field: 'purchaseOrderId',
      headerName: 'Purchase Order No',
      flex: 1,
    },
    {
      field: 'invoiceNumber',
      headerName: 'Invoice Number',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      valueFormatter: params => {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
    },
    {
      field: 'vendorName',
      headerName: 'Vendor Name',
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<Visibility />}
            label="Print"
            onClick={() => fetchAndPrintPdf(row?._id, 'invoice', 'pharmacy')}
          />,
        ];
      },
    },
  ];

  return (
    <ContentSection title="Invoices">
      <Box mt={2} flex="1 1 auto" width="100%">
        <CustomDataGrid
          autoHeight={false}
          columns={columns}
          rows={rows}
          getRowId={getRowId}
          page={page}
          pageSize={pageSize}
          totalRows={rowCount}
          loading={loading}
          enablePagination
          paginationMode="server"
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sx={{ height: '100%' }}
        />
      </Box>
    </ContentSection>
  );
};

export default Invoices;
