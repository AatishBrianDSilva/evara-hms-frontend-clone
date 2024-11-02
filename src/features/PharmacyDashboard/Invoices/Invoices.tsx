import React, { useState } from 'react';
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

interface RowType {
  _id: string;
}

const Invoices: React.FC = () => {
  // const patient = useSelector((state: RootState) => state.patients.patient);

  const { fetchAndPrintPdf } = usePrint();

  //   console.log("Patient Data", patient);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const {
    data: pharmacyInvoicesData,
    isLoading: pharmacyInvoicesLoading,
    isFetching: pharmacyInvoicesFetching,
  } = useGetInvoicesQuery();

  // const purchaseOrdersPagination = purchaseOrdersData?.data?.pagination;
  const pharmacyInvoiceLoading =
    pharmacyInvoicesLoading || pharmacyInvoicesFetching;

  console.log('Orders', pharmacyInvoicesData);

  const data = pharmacyInvoicesData?.data;

  const rows = data ? data : []; // Accessing records if data exists, otherwise setting an empty array

  const getRowId = (row: RowType) => row._id;

  // Columns configuration for the data grid
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
      valueFormatter(params) {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
        return `${day}/${month}/${year}`;
      },
    },

    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellClassName: 'actions',
      // custom actions for the actions column
      getActions: (params: GridRowParams) => {
        const row = params.row;
        console.log('row', row);

        return [
          <GridActionsCellItem
            icon={<Visibility />}
            label="Print"
            onClick={() => fetchAndPrintPdf(row?._id, 'invoice', 'pharmacy')}
            // onClick={() => handlePrint(row?.response?.invoice[0])}
          />,
        ];
      },
    },
  ];

  return (
    <ContentSection title="Invoices">
      <Box display="flex" justifyContent="flex-end" gap={2}></Box>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columns}
          rows={rows}
          page={page}
          pageSize={pageSize}
          getRowId={getRowId}
          loading={pharmacyInvoiceLoading}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sx={{ height: '100%' }}
        />
      </Box>
    </ContentSection>
  );
};

export default Invoices;
