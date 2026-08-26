import React, { useCallback, useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import debounce from 'lodash/debounce';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import { downloadFileWithToast } from '../../../utils/downloadFileWithToast';
import generateQueryParams from '../../../utils/generateQueryParams';
import DownloadMenu from '../../../components/CSVDownloadMenu/CSVDownloadMenu';
import { useGetItemStockValuesQuery } from '../../../services/analyticsDashboardService/pharmacy/patientConsumptionApi';

const ItemStockValuesReports: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchInput, setSearchInput] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const debouncedSetSearch = useCallback(
    debounce((value: string) => setSearchValue(value), 300),
    [],
  );

  const { data, isLoading, isFetching } = useGetItemStockValuesQuery({
    paginate: pageSize !== -1,
    page: pageSize === -1 ? undefined : page,
    limit: pageSize === -1 ? undefined : pageSize,
    filters: {
      search: searchValue || undefined,
    },
  });

  const records = data?.data?.records || [];
  const pagination = data?.data?.pagination;
  const summary = (data?.data as any)?.summary;

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
          filters: { search: searchValue || undefined },
        });
        filename = `item_stock_values_page_${page}-${date}.csv`;
        break;
      case 'currentFilters':
        action = 'filtered data';
        params = generateQueryParams({
          paginate: false,
          filters: {
            allData: true,
            search: searchValue || undefined,
          },
        });
        filename = `item_stock_values_filtered-${date}.csv`;
        break;
      case 'allData':
        action = 'all data';
        params = generateQueryParams({
          filters: { allData: true },
        });
        filename = `item_stock_values_all-${date}.csv`;
        break;
      default:
        throw new Error('Invalid download type');
    }

    await downloadFileWithToast({
      endpoint: 'analytics/pharmacy/item-stock-values/download',
      params,
      fileName: filename,
      successMessage: `Successfully downloaded ${action}!`,
      errorMessage: `Failed to download ${action}.`,
      startMessage: `Preparing to download ${action}...`,
    });
  };

  const columns: GridColDef[] = [
    { field: 'drugName', headerName: 'Drug Name', flex: 1.4 },
    { field: 'drugCode', headerName: 'Drug Code', flex: 1 },
    { field: 'hsnCode', headerName: 'HSN', flex: 0.8 },
    { field: 'quantity', headerName: 'Qty', flex: 0.7 },
    {
      field: 'totalCost',
      headerName: 'Total Cost',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value || 0),
    },
    {
      field: 'totalMrp',
      headerName: 'Total MRP',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value || 0),
    },
  ];

  return (
    <ContentSection title="Item-wise Stock Value">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <TextField
          label="Search drug"
          size="small"
          value={searchInput}
          onChange={e => {
            setPage(1);
            setSearchInput(e.target.value);
            debouncedSetSearch(e.target.value);
          }}
        />
        <DownloadMenu handleDownload={handleDownload} />
      </Box>

      {summary && (
        <Typography variant="body2" color="text.secondary" mb={1}>
          Items: {summary.itemCount || 0} · Qty: {summary.totalQuantity || 0} ·
          Cost: {formatToIndianCurrencyFormat(summary.totalCost || 0)} · MRP:{' '}
          {formatToIndianCurrencyFormat(summary.totalMrp || 0)}
        </Typography>
      )}

      <Box mt={2} flex="1 1 auto">
        <CustomDataGrid
          autoHeight={false}
          columns={columns}
          rows={records}
          page={page}
          pageSize={pageSize}
          totalRows={pagination?.totalDocs || records.length}
          loading={isLoading || isFetching}
          getRowId={(row: any) => row.id || row.itemId}
          sx={{ height: '100%' }}
          enablePagination
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          rowHover
        />
      </Box>
    </ContentSection>
  );
};

export default ItemStockValuesReports;
