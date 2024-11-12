import React, { useCallback, useRef, useState } from 'react';
import ContentSection from '../../../components/ContentSection/ContentSection';
import { Grid, TextField } from '@mui/material';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { useGetStockSummaryQuery } from '../../../services/analyticsDashboardService/pharmacy/stockSummaryApi';
import _ from 'lodash';
import { downloadFileWithToast } from '../../../utils/downloadFileWithToast';
import DownloadMenu from '../../../components/CSVDownloadMenu/CSVDownloadMenu';

const StockSummaryReports: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [search, setSearch] = useState<string>('');

  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    scrollRef.current?.scrollTo(0, 0);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    scrollRef.current?.scrollTo(0, 0);
  };

  // Handle search input for drug name with debounce
  const handleSearch = useCallback(
    _.debounce((query: string) => {
      setSearch(query);
    }, 500),
    [],
  );

  const handleDownload = async (allData: boolean) => {
    const action = allData ? 'all data' : 'current page';
    const params = allData
      ? { allData: 'true' }
      : { search, page, limit: pageSize };

    const date = new Date().toLocaleDateString('en-IN');

    const filename = allData
      ? `stock_report-${date}.csv`
      : `stock_report_page_${params.page}-${date}.csv`;

    await downloadFileWithToast({
      endpoint: '/analytics/pharmacy/stock-summary/download',
      params,
      fileName: filename,
      successMessage: `Successfully downloaded ${action}!`,
      errorMessage: `Failed to download ${action}.`,
      startMessage: `Preparing to download ${action}...`,
    });
  };

  // Fetch data from the API with dynamic query parameters
  const { data, isLoading, isFetching } = useGetStockSummaryQuery({
    page: page,
    limit: pageSize,
    filters: {
      search,
    },
    paginate: true,
  });

  const records = data?.data?.records || [];
  const pagination = data?.data?.pagination;

  const columnsConfig: GridColDef[] = [
    { field: 'id', headerName: 'Sl.No', flex: 0.5 },
    { field: 'drugName', headerName: 'Drug Name', flex: 2 },
    { field: 'drugCode', headerName: 'Drug Code', flex: 0.5 },
    { field: 'drugCategory', headerName: 'Drug Category', flex: 1 },
    { field: 'Central', headerName: 'Central', flex: 0.5 }, // Updated to match your field names
    { field: 'OPD', headerName: 'OPD', flex: 0.5 },
    { field: 'OT', headerName: 'OT', flex: 0.5 },
    { field: 'Recovery', headerName: 'Recovery', flex: 0.5 },
    { field: 'IVF', headerName: 'IVF', flex: 0.5 },
    { field: 'Returns', headerName: 'Returns', flex: 0.5 },
    { field: 'Internal', headerName: 'Internal', flex: 0.5 },
    { field: 'totalQuantity', headerName: 'Total Quantity', flex: 1 },
  ];

  return (
    <ContentSection title="Stock Summary Report" scrollRef={scrollRef}>
      <Grid container justifyContent="flex-end" alignItems="center" mb={2}>
        <Grid item>
          <TextField
            label="Search"
            variant="outlined"
            onChange={e => handleSearch(e.target.value)}
            placeholder="Drug Name/ Code"
            sx={{ mr: 2, width: '250px' }}
          />
        </Grid>

        <Grid item>
          <DownloadMenu handleDownload={handleDownload} />
        </Grid>
      </Grid>

      <CustomDataGrid
        columns={columnsConfig}
        rows={records}
        page={page}
        pageSize={pageSize}
        totalRows={pagination?.totalDocs || 0}
        loading={isLoading || isFetching}
        enablePagination={true}
        paginationMode="server"
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        rowHover={true}
      />
    </ContentSection>
  );
};

export default StockSummaryReports;
