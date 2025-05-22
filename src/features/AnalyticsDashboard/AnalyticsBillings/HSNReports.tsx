import React, { useState, useCallback, useRef } from 'react';
import { Box, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { debounce } from 'lodash';
import { endOfWeek, startOfWeek } from 'date-fns';

import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import DownloadMenu from '../../../components/CSVDownloadMenu/CSVDownloadMenu';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import generateQueryParams from '../../../utils/generateQueryParams';
import { downloadFileWithToast } from '../../../utils/downloadFileWithToast';
import { useGetHSNReportsQuery } from '../../../services/analyticsDashboardService/billings/hsnReportApi';

const HSNReports: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      setStartDate(ranges.selection.startDate || null);
      setEndDate(ranges.selection.endDate || null);
    }
  };

  const handleSearchQuery = useCallback(
    debounce((query: string) => setSearchQuery(query), 500),
    [],
  );

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    scrollRef.current?.scrollTo(0, 0);
  };

  const { data, isLoading, isFetching } = useGetHSNReportsQuery({
    paginate: true,
    page,
    limit: pageSize,
    searchQuery,
    dateRange: {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    },
  });

  console.log('HSN Data', data);

  const hsnRows = data?.data?.records || [];
  const pagination = data?.data?.pagination;
  const loading = isLoading || isFetching;

  const handleDownload = async (
    downloadType: 'currentPage' | 'currentFilters' | 'allData',
  ) => {
    const date = new Date().toLocaleDateString('en-IN');
    let params: any = {};
    let filename = '';

    switch (downloadType) {
      case 'currentPage':
        params = generateQueryParams({
          paginate: false,
          page,
          limit: pageSize,
          dateRange: {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
          },
          filters: {
            searchQuery,
          },
        });
        filename = `hsn_report_page_${page}_${date}.csv`;
        break;

      case 'currentFilters':
        params = generateQueryParams({
          paginate: false,
          dateRange: {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
          },
          filters: {
            searchQuery,
          },
        });
        filename = `hsn_report_filtered_${date}.csv`;
        break;

      case 'allData':
        params = generateQueryParams({
          filters: {
            allData: true,
            searchQuery,
          },
          dateRange: {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
          },
        });
        filename = `hsn_report_all_${date}.csv`;
        break;
    }

    await downloadFileWithToast({
      endpoint: 'analytics/billings/hsn-report/download',
      params,
      fileName: filename,
      successMessage: `Downloaded ${downloadType} successfully!`,
      errorMessage: `Failed to download ${downloadType}.`,
      startMessage: `Preparing to download ${downloadType}...`,
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'hsnCode',
      headerName: 'HSN Code',
      flex: 1,
      valueGetter: params => params.row.hsnCode || '-', // ✅ fallback if missing
    },
    {
      field: 'drugName',
      headerName: 'Drug Name',
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
    },
    {
      field: 'taxableValue',
      headerName: 'Taxable Value',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'rateOfTax',
      headerName: 'Tax Rate (%)',
      flex: 1,
    },
    {
      field: 'cgst',
      headerName: 'CGST',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'sgst',
      headerName: 'SGST',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'netTaxableValue',
      headerName: 'Net Taxable Value',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: 'invoiceValue',
      headerName: 'Invoice Value',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
  ];

  const rowsWithUniqueIds = hsnRows.map((row, index) => ({
    ...row,
    _rowId: `hsn-${index}`,
  }));

  return (
    <ContentSection title="HSN Report" scrollRef={scrollRef}>
      <Box
        display="flex"
        justifyContent="flex-end" // 🔄 Aligns to the right
        alignItems="center"
        mb={2}
        gap={2}
        flexWrap="wrap"
      >
        <CustomeDateRangePicker onChange={handleDateChange} />
        <TextField
          label="Search"
          size="small"
          variant="outlined"
          onChange={e => handleSearchQuery(e.target.value)}
          placeholder="Search by HSN Code"
          sx={{ width: 300 }}
        />
        <DownloadMenu handleDownload={handleDownload} />
      </Box>

      <CustomDataGrid
        autoHeight
        columns={columns}
        loading={loading}
        rows={rowsWithUniqueIds}
        getRowId={row => row._rowId}
        page={page}
        pageSize={pageSize}
        totalRows={pagination?.totalDocs || 0}
        enablePagination
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </ContentSection>
  );
};

export default HSNReports;
