import { Print, Visibility } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import { useGetProcessedPurchaseOrdersQuery } from '../../../../services/pharmacyDashboardService/purchaseOrderApi';
import {
  EPurchaseOrderStatus,
  IPurchaseOrder,
} from '../../../../types/pharmacyDashboard/purchaseOrder';
import ViewProcessedPurchaseOrder from './ViewProcessedPurchaseOrder';
import { usePrint } from '../../../../context/PrintPDFContext';

const Processed: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const { fetchAndPrintPdf } = usePrint();

  const {
    data: purchaseOrdersData,
    isLoading: purchaseOrdersLoading,
    isFetching: purchaseOrdersFetching,
  } = useGetProcessedPurchaseOrdersQuery({
    paginate: true,
    page,
    limit: pageSize,
    sort: { createdAt: -1 },
    filters: { status: EPurchaseOrderStatus.Processed },
  });

  const purchaseOrders = purchaseOrdersData?.data?.records || [];
  const purchaseOrdersPagination = purchaseOrdersData?.data?.pagination;
  const purchaseOrderLoading = purchaseOrdersLoading || purchaseOrdersFetching;

  console.log('Processed PO', purchaseOrders);

  const [selectedRow, setSelectedRow] = useState<IPurchaseOrder | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  const openViewModal = (order: IPurchaseOrder) => {
    setSelectedRow(order);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedRow(null);
    setIsViewModalOpen(false);
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
      valueGetter: params => params.row.vendor?.name || 'N/A',
    },
    {
      field: 'netAmount',
      headerName: 'Amount',
      flex: 1,
      valueGetter: params => `₹ ${params.row.response?.netAmount || 0}`,
    },
    { field: 'createdBy', headerName: 'Created By', flex: 1 },
    { field: 'authorizedBy', headerName: 'Processed By', flex: 1 },
    {
      field: 'invoiceNumber',
      headerName: 'Invoice Number',
      flex: 1,
      valueGetter: params => params.row.response?.invoiceNumber || 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const row = params.row;
        const actions = [
          <Tooltip title="View" key="view">
            <GridActionsCellItem
              icon={<Visibility />}
              label="View"
              onClick={() => openViewModal(row)}
            />
          </Tooltip>,
        ];

        // Add Print action if report exists
        if (row.report) {
          actions.push(
            <Tooltip title="Print" key="print">
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

        if (row.reportKey) {
          actions.push(
            <Tooltip title="Print Processed Report" key="print-processed">
              <GridActionsCellItem
                icon={<Print />}
                label="Print Processed Report"
                onClick={() =>
                  fetchAndPrintPdf(
                    row._id, // Purchase Order ID
                    'POInvoiceProcessed',
                    'pharmacy',
                    row.reportKey, // Pass the report key
                  )
                }
              />
            </Tooltip>,
          );
        }

        return actions;
      },
    },
  ];

  const rows = purchaseOrders.flatMap(
    (order: IPurchaseOrder) =>
      order.responses?.map((response: any, index: number) => ({
        ...order, // Include top-level fields
        ...response, // Include response-level fields
        id: response._id || `${order._id}-response-${index}`, // Unique ID for each response
        parentId: order._id, // Add parent PO ID
        reportKey: response.report?.key || '', // Extract the report key
        netAmount: response.netAmount, // Response-specific amount
        invoiceNumber: response.invoiceNumber, // Response-specific invoice number
      })) || [],
  );

  return (
    <Box height={'100%'} display={'flex'} flexDirection={'column'}>
      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={rows}
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

      {isViewModalOpen && selectedRow && (
        <ViewProcessedPurchaseOrder
          openModal={isViewModalOpen}
          onClose={closeViewModal}
          id={selectedRow._id} // Use response._id for modal data
          purchaseOrderId={selectedRow.parentId} // Pass the purchase order's _id
        />
      )}
    </Box>
  );
};

export default Processed;
