import React, { useState, useCallback, useRef } from 'react';
import { Box, TextField } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import { useGetRefundReportsQuery } from '../../../services/analyticsDashboardService/billings/refundReports';
import ViewReports from '../../PatientDashboard/Journey/ViewReports';
import { Visibility } from '@mui/icons-material';
import debounce from 'lodash/debounce';
import generateQueryParams from '../../../utils/generateQueryParams';
import { downloadFileWithToast } from '../../../utils/downloadFileWithToast';
import DownloadMenu from '../../../components/CSVDownloadMenu/CSVDownloadMenu';

interface RowType {
  _id: string;
  refundDate: string;
  refundAmount: number;
  reason: string;
  method: string;
  patientCode: string;
  patientName: string;
  files: string[];
}

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
      console.log('Setting search query:', query); // Log search query
      setSearchQuery(query);
    }, 500),
    [],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Search input changed:', event.target.value); // Log input change
    debounceSetSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (newPage: number) => {
    console.log('Changing to page:', newPage); // Log page change
    setPage(newPage);
    scrollRef.current?.scrollTo(0, 0); // Scroll to top on page change
  };

  const handlePageSizeChange = (newPageSize: number) => {
    console.log('Changing page size to:', newPageSize); // Log page size change
    setPageSize(newPageSize);
    // setPage(1); // Reset to first page when page size changes
    scrollRef.current?.scrollTo(0, 0);
  };

  const { data, isLoading, isFetching } = useGetRefundReportsQuery({
    paginate: true,
    page,
    limit: pageSize,
    filters: { searchQuery },
    sort: { createdAt: -1 },
  });

  // useEffect(() => {
  //   console.log('Query Params Sent to API:', {
  //     paginate: true,
  //     page,
  //     limit: pageSize,
  //     filters: { searchQuery },
  //     sort: { createdAt: -1 },
  //   });
  // }, [page, pageSize, searchQuery]);

  const refundPagination = (data as any)?.message?.pagination;
  const refundDetails: RowType[] =
    (data as any)?.message?.records.map((refund: any) => ({
      _id: refund._id,
      refundDate: refund.refundDetails?.refundDate || refund.createdAt,
      refundAmount: refund.refundDetails?.refundAmount || 0,
      reason: refund.refundDetails?.reason || 'N/A',
      method: refund.refundDetails?.method || 'N/A',
      patientCode: refund.patientCode || 'N/A',
      patientName: refund.patientName || 'N/A',
      files: refund.refundDetails?.files || [],
    })) || [];

  console.log('API Response:', data); // Log the full API response
  console.log('Pagination Data:', refundPagination); // Log pagination details

  const handleViewInvoices = (files: string[]) => {
    console.log('Viewing invoices for files:', files); // Log files to view
    setSelectedFiles(files);
    setIsViewInvoicesModalOpen(true);
  };

  const closeViewInvoicesModal = () => {
    console.log('Closing view invoices modal'); // Log modal close
    setIsViewInvoicesModalOpen(false);
  };

  // const handleDownloadCSV = () => {
  //   console.log('Downloading CSV'); // Log CSV download
  //   if (refundDetails.length > 0) {
  //     const headers = [
  //       'Refund Date',
  //       'Patient Code',
  //       'Patient Name',
  //       'Refund Amount',
  //       'Reason',
  //       'Payment Method',
  //     ];
  //     const formattedData = refundDetails.map(refund => [
  //       new Date(refund.refundDate).toLocaleDateString('en-GB', {
  //         day: '2-digit',
  //         month: '2-digit',
  //         year: 'numeric',
  //       }),
  //       refund.patientCode,
  //       refund.patientName,
  //       formatToIndianCurrencyFormat(refund.refundAmount),
  //       refund.reason,
  //       refund.method,
  //     ]);
  //     exportToCSV([headers, ...formattedData], 'Refunds_Report');
  //   }
  // };

  const handleDownload = async (
    downloadType: 'currentPage' | 'currentFilters' | 'allData',
  ) => {
    let params: any = {};
    let action = '';
    const date = new Date().toLocaleDateString('en-IN');
    let filename = '';

    switch (downloadType) {
      case 'currentPage':
        action = 'current page';
        params = generateQueryParams({
          paginate: false,
          page,
          limit: pageSize,
          filters: { searchQuery },
        });
        filename = `refunds_page_${page}-${date}.csv`;
        break;

      case 'currentFilters':
        action = 'filtered data';
        params = generateQueryParams({
          paginate: false,
          filters: { searchQuery },
        });
        filename = `refunds_filtered-${date}.csv`;
        break;

      case 'allData':
        action = 'all data';
        params = generateQueryParams({
          filters: { allData: true, searchQuery },
        });
        filename = `refunds_all-${date}.csv`;
        break;

      default:
        throw new Error('Invalid download type');
    }

    await downloadFileWithToast({
      endpoint: 'analytics/billings/refund-reports/download',
      params,
      fileName: filename,
      successMessage: `Successfully downloaded ${action}!`,
      errorMessage: `Failed to download ${action}.`,
      startMessage: `Preparing to download ${action}...`,
    });
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
        <DownloadMenu handleDownload={handleDownload} />
      </Box>
      <CustomDataGrid
        autoHeight
        columns={columnsConfig}
        rows={refundDetails}
        getRowId={(row: RowType) => row._id}
        page={page - 1}
        pageSize={pageSize}
        totalRows={refundPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={isLoading || isFetching}
        enablePagination
        useUpdatedPagination
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
