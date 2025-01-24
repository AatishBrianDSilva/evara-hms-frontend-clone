import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, TextField, Button } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import { useGetRefundReportsQuery } from '../../../services/analyticsDashboardService/billings/refundReports';
import ViewReports from '../../PatientDashboard/Journey/ViewReports';
import { Visibility } from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { exportToCSV } from '../../../utils/exportCSV';

const RefundsReport: React.FC = () => {
  const [page, setPage] = useState<number>(1); // 1-based pagination
  const [pageSize, setPageSize] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isViewInvoicesModalOpen, setIsViewInvoicesModalOpen] =
    useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Debounce the search query to avoid excessive API calls
  const debounceSetSearchQuery = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setPage(1); // Reset to the first page on search query change
    }, 500),
    [],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounceSetSearchQuery(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    console.log('Changing to page:', newPage + 1); // Log the correct 1-based page
    setPage(newPage + 1); // Convert 0-based DataGrid page to 1-based API page
    scrollRef.current?.scrollTo(0, 0);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to the first page when page size changes
    scrollRef.current?.scrollTo(0, 0);
  };

  const { data, isLoading, isFetching } = useGetRefundReportsQuery({
    paginate: true,
    page,
    limit: pageSize,
    filters: { searchQuery },
    sort: { createdAt: -1 },
  });

  useEffect(() => {
    console.log('Query Params Sent to API:', {
      paginate: true,
      page,
      limit: pageSize,
      filters: { searchQuery },
      sort: { createdAt: -1 },
    });
  }, [page, pageSize, searchQuery]);

  const refundPagination = data?.message?.pagination;
  const refundDetails =
    data?.message?.records.map((refund: any) => ({
      _id: refund._id,
      refundDate: refund.refundDetails?.refundDate || refund.createdAt,
      refundAmount: refund.refundDetails?.refundAmount || 0,
      reason: refund.refundDetails?.reason || 'N/A',
      method: refund.refundDetails?.method || 'N/A',
      patientCode: refund.patientCode || 'N/A',
      patientName: refund.patientName || 'N/A',
      files: refund.refundDetails?.files || [],
    })) || [];

  const handleViewInvoices = (files: string[]) => {
    setSelectedFiles(files);
    setIsViewInvoicesModalOpen(true);
  };

  const closeViewInvoicesModal = () => {
    setIsViewInvoicesModalOpen(false);
  };

  const handleDownloadCSV = () => {
    if (refundDetails.length > 0) {
      const headers = [
        'Refund Date',
        'Patient Code',
        'Patient Name',
        'Refund Amount',
        'Reason',
        'Payment Method',
      ];
      const formattedData = refundDetails.map(refund => [
        new Date(refund.refundDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        refund.patientCode,
        refund.patientName,
        formatToIndianCurrencyFormat(refund.refundAmount),
        refund.reason,
        refund.method,
      ]);
      exportToCSV([headers, ...formattedData], 'Refunds_Report');
    }
  };

  const columnsConfig: GridColDef[] = [
    {
      field: 'refundDate',
      headerName: 'Refund Date',
      type: 'date',
      flex: 1,
      valueFormatter: params =>
        new Date(params.value).toLocaleDateString('en-GB'),
    },
    { field: 'patientCode', headerName: 'Patient Code', flex: 1 },
    { field: 'patientName', headerName: 'Patient Name', flex: 1 },
    {
      field: 'refundAmount',
      headerName: 'Refund Amount',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    { field: 'reason', headerName: 'Reason for Refund', flex: 2 },
    { field: 'method', headerName: 'Payment Method', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
      getActions: params => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View Invoices"
          onClick={() => handleViewInvoices(params.row.files)}
        />,
      ],
    },
  ];

  return (
    <ContentSection title="Refunds Report" scrollRef={scrollRef}>
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <TextField
          label="Search by Patient ID/Name"
          size="small"
          variant="outlined"
          onChange={handleSearchChange}
          placeholder="Enter Patient ID or Name"
          sx={{ width: 250 }}
        />
        <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
          Download CSV
        </Button>
      </Box>
      <CustomDataGrid
        autoHeight
        columns={columnsConfig}
        rows={refundDetails}
        getRowId={row => row._id}
        page={page - 1} // Convert 1-based to 0-based for DataGrid
        pageSize={pageSize}
        totalRows={refundPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={isLoading || isFetching}
        enablePagination
        extendedPageSizeOptions={[25, 50, 100, { label: 'All', value: -1 }]}
      />
      {isViewInvoicesModalOpen && (
        <ViewReports
          openModal={isViewInvoicesModalOpen}
          onClose={closeViewInvoicesModal}
          files={selectedFiles}
        />
      )}
    </ContentSection>
  );
};

export default RefundsReport;
