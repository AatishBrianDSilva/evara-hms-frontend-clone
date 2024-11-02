import React, { useEffect, useState, useCallback } from 'react';
import { Box, TextField, Button } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import { useGetRefundReportsQuery } from '../../../services/analyticsDashboardService/billings/refundReports';
import ViewReports from '../../PatientDashboard/Journey/ViewReports';
import { Visibility } from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { exportToCSV } from '../../../utils/exportCSV'; // Import the CSV utility

interface RowType {
  _id: string;
  refundDate: string;
  refundAmount: number;
  reason: string;
  method: string;
  patientCode: string;
  patientName: string;
  files: string[]; // For storing the uploaded invoice files
}

const RefundsReport: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [searchPatientId, setSearchPatientId] = useState<string>(''); // Patient ID filter
  const [searchPatientName, setSearchPatientName] = useState<string>(''); // Patient name filter
  const [searchQuery, setSearchQuery] = useState<string>(''); // Combined search query
  const [isViewInvoicesModalOpen, setIsViewInvoicesModalOpen] =
    useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Debounce the search query to avoid too many requests
  const debounceSetSearchQuery = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
    [],
  );

  // Handle filtering changes and search query
  useEffect(() => {
    const queryParts = [];
    if (searchPatientId) queryParts.push(`patientCode:${searchPatientId}`);
    if (searchPatientName) queryParts.push(`patientName:${searchPatientName}`);
    const combinedQuery = queryParts.join(' ');
    debounceSetSearchQuery(combinedQuery);
    setPage(1); // Reset to page 1 on search query change
    return () => debounceSetSearchQuery.cancel();
  }, [searchPatientId, searchPatientName, debounceSetSearchQuery]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1); // Add 1 because page in pagination is 1-based
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to page 1 when page size changes
  };

  const { data, isLoading, isFetching } = useGetRefundReportsQuery({
    paginate: pageSize !== -1, // Disable pagination if "All" is selected
    page: pageSize === -1 ? undefined : page, // Send undefined for page if "All" is selected
    limit: pageSize === -1 ? undefined : pageSize, // Send undefined for limit if "All" is selected
    filters: {
      searchQuery,
    },
    sort: {
      createdAt: -1, // Sort refunds by created date
    },
  });

  const refundPagination = (data?.message as any)?.pagination;

  // Map the refund data for CustomDataGrid
  const refundDetails: RowType[] =
    (data?.message as any)?.records?.map((refund: any) => ({
      _id: refund._id,
      refundDate: refund.refundDetails?.refundDate || refund.createdAt,
      refundAmount: refund.refundDetails?.refundAmount || 0,
      reason: refund.refundDetails?.reason || 'N/A',
      method: refund.refundDetails?.method || 'N/A',
      patientCode: refund.patientCode || 'N/A',
      patientName: refund.patientName || 'N/A', // Add patientName
      files: refund.refundDetails?.files || [],
    })) || [];

  // const totalRefunds = refundDetails.reduce((acc, refund) => acc + refund.refundAmount, 0);

  const handleViewInvoices = (files: string[]) => {
    setSelectedFiles(files);
    setIsViewInvoicesModalOpen(true);
  };

  const closeViewInvoicesModal = () => {
    setIsViewInvoicesModalOpen(false);
  };

  // Handle CSV download
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

      const formattedData = refundDetails.map((refund: RowType) => [
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
    } else {
      console.log('No data to export');
    }
  };

  const columnsConfig: GridColDef[] = [
    {
      field: 'refundDate',
      headerName: 'Refund Date',
      type: 'date',
      flex: 1,
      valueFormatter: params => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
    },
    {
      field: 'patientCode',
      headerName: 'Patient Code',
      flex: 1,
    },
    {
      field: 'patientName',
      headerName: 'Patient Name',
      flex: 1,
    },
    {
      field: 'refundAmount',
      headerName: 'Refund Amount',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'reason',
      headerName: 'Reason for Refund',
      flex: 2,
      valueFormatter(params) {
        return params.value || 'N/A';
      },
    },
    {
      field: 'method',
      headerName: 'Payment Method',
      flex: 1,
    },
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
    <ContentSection title="Refunds Report">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <TextField
          label="Search by Patient ID"
          size="small"
          variant="outlined"
          onChange={e => setSearchPatientId(e.target.value)}
          placeholder="Enter patient ID"
        />
        <TextField
          label="Search by Patient Name"
          size="small"
          variant="outlined"
          onChange={e => setSearchPatientName(e.target.value)}
          placeholder="Enter patient name"
        />
        <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
          Download CSV
        </Button>
      </Box>

      <CustomDataGrid
        autoHeight
        enablePagination={true}
        columns={columnsConfig}
        rows={refundDetails}
        getRowId={(row: RowType) => row._id} // Specify custom row ID
        page={page - 1} // Convert back to 0-based index for DataGrid
        pageSize={pageSize}
        totalRows={refundPagination?.totalDocs || 0} // Ensure totalRows is set from pagination
        pageCount={refundPagination?.totalPages || 1} // Set total pages for pagination
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={isLoading || isFetching} // Use the loading prop in DataGrid
        extendedPageSizeOptions={[25, 50, 100, { label: 'All', value: -1 }]} // Add pagination options
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
