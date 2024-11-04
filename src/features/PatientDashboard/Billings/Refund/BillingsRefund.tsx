import Box from '@mui/material/Box';
import React, { useState } from 'react';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import {
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Skeleton,
  Typography,
} from '@mui/material';
import { Info, Print, Visibility } from '@mui/icons-material';
import { useGetRefundsQuery } from '../../../../services/patientDashboardService/billings/billingApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { formatToIndianCurrencyFormat } from '../../../../utils/formatToIndianCurrencyFormat';
import ViewReports from '../../Journey/ViewReports';
import { usePrint } from '../../../../context/PrintPDFContext';

const BillingsRefund: React.FC = () => {
  const { fetchAndPrintPdf } = usePrint(); // Adding usePrint to handle the printing

  const [isViewInvoicesModalOpen, setIsViewInvoicesModalOpen] =
    useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const { patient } = useSelector((state: RootState) => state.patients);

  const { data, isLoading, isFetching } = useGetRefundsQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      filters: {
        patientCode: patient?.patientId,
      },
      sort: {
        createdAt: -1,
      },
    },
    {
      skip: !patient?.patientId,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  const patientBillingsRefund = data?.data?.records || [];
  const summary = data?.data?.summary;
  const patientBillingsPagination = data?.data?.pagination;
  const patientBillingsLoading = isLoading || isFetching;

  const handleViewInvoices = (files: string[]) => {
    setSelectedFiles(files);
    setIsViewInvoicesModalOpen(true);
  };

  const closeViewInvoicesModal = () => {
    setIsViewInvoicesModalOpen(false);
  };

  const columnsConfig: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date',
      type: 'date',
      flex: 1,
      valueFormatter(params) {
        return new Date(params.value).toLocaleDateString('en-IN');
      },
    },
    {
      field: 'billingId',
      headerName: 'Bill ID',
      flex: 1,
      valueFormatter(params) {
        return params.value.billingId;
      },
    },
    {
      field: 'billType',
      headerName: 'Bill Type',
      flex: 1,
      valueGetter(params) {
        const row = params.row;
        return row.billingId.billType;
      },
    },
    {
      field: 'items',
      headerName: 'Items',
      flex: 1,
      renderCell: params => {
        const row = params.row;
        const items = row.refundDetails.items;
        const [anchorEl, setAnchorEl] = useState(null);

        const handlePopoverOpen = (event: any) => {
          setAnchorEl(event.currentTarget);
        };

        const handlePopoverClose = () => {
          setAnchorEl(null);
        };

        const open = Boolean(anchorEl);

        return (
          <Box display="flex" alignItems="center">
            <Box>{items.length}</Box>
            <IconButton
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
              aria-owns={open ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
              size="small"
              style={{ marginLeft: '8px' }}
            >
              <Info fontSize="small" sx={{ fontSize: '16px' }} />
            </IconButton>
            <Popover
              id="mouse-over-popover"
              sx={{
                pointerEvents: 'none',
              }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <Box p={2}>
                <Typography variant="subtitle1">Item Details</Typography>
                <List>
                  {items.map((item: any, index: number) => (
                    <ListItem key={item.id || index}>
                      <ListItemText
                        primary={`${item.itemName || 'N/A'} (Batch: ${item.batchNo || 'N/A'})`}
                        secondary={`Quantity: ${item.qtyToRefund}, Amount: ${formatToIndianCurrencyFormat(item.amountToRefund)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Popover>
          </Box>
        );
      },
    },
    {
      field: 'method',
      headerName: 'Method',
      flex: 1,
      valueGetter: params => {
        const row = params.row;
        return row.refundDetails.method;
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      valueGetter: params => {
        const row = params.row;
        return formatToIndianCurrencyFormat(row.refundDetails.refundAmount);
      },
    },
    {
      field: 'reason',
      headerName: 'Reason',
      flex: 1,
      valueGetter: params => {
        const row = params.row;
        return row.refundDetails.reason;
      },
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
            icon={<Visibility />}
            label="View Invoices"
            onClick={() => handleViewInvoices(row.refundDetails.files)}
          />,
          <GridActionsCellItem
            icon={<Print />}
            label="Print"
            onClick={() => fetchAndPrintPdf(row._id)} // Using fetchAndPrintPdf to print the required invoice
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
          justifyContent="flex-start"
          alignItems="center"
          mb={3}
        >
          <Skeleton width={125} height={35} variant="rounded" />
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
              'Total Refunds: ' +
              formatToIndianCurrencyFormat(summary?.totalRefunded)
            }
            color="primary"
          />
        </Box>
      )}

      <CustomDataGrid
        autoHeight={true}
        columns={columnsConfig}
        rows={patientBillingsRefund}
        page={page}
        pageSize={pageSize}
        totalRows={patientBillingsPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientBillingsLoading}
        sx={{ height: '100%' }}
        enablePagination={true}
      />

      {isViewInvoicesModalOpen && (
        <ViewReports
          openModal={isViewInvoicesModalOpen}
          onClose={closeViewInvoicesModal}
          files={selectedFiles}
        />
      )}
    </Box>
  );
};

export default BillingsRefund;
