import React, { useCallback, useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import { endOfWeek, startOfWeek } from 'date-fns';
import debounce from 'lodash/debounce';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import { downloadFileWithToast } from '../../../utils/downloadFileWithToast';
import generateQueryParams from '../../../utils/generateQueryParams';
import DownloadMenu from '../../../components/CSVDownloadMenu/CSVDownloadMenu';
import { useGetPatientConsumptionQuery } from '../../../services/analyticsDashboardService/pharmacy/patientConsumptionApi';

const PatientConsumptionReports: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [startDate, setStartDate] = useState<Date | null>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [searchInput, setSearchInput] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const debouncedSetSearch = useCallback(
    debounce((value: string) => setSearchValue(value), 300),
    [],
  );

  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  const { data, isLoading, isFetching } = useGetPatientConsumptionQuery({
    paginate: pageSize !== -1,
    page: pageSize === -1 ? undefined : page,
    limit: pageSize === -1 ? undefined : pageSize,
    filters: {
      saleStartDate: startDate?.toISOString(),
      saleEndDate: endDate?.toISOString(),
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
          filters: {
            saleStartDate: startDate?.toISOString(),
            saleEndDate: endDate?.toISOString(),
            search: searchValue || undefined,
          },
        });
        filename = `patient_consumption_page_${page}-${date}.csv`;
        break;
      case 'currentFilters':
        action = 'filtered data';
        params = generateQueryParams({
          paginate: false,
          filters: {
            allData: true,
            saleStartDate: startDate?.toISOString(),
            saleEndDate: endDate?.toISOString(),
            search: searchValue || undefined,
          },
        });
        filename = `patient_consumption_filtered-${date}.csv`;
        break;
      case 'allData':
        action = 'all data';
        params = generateQueryParams({
          filters: { allData: true },
        });
        filename = `patient_consumption_all-${date}.csv`;
        break;
      default:
        throw new Error('Invalid download type');
    }

    await downloadFileWithToast({
      endpoint: 'analytics/pharmacy/patient-consumption/download',
      params,
      fileName: filename,
      successMessage: `Successfully downloaded ${action}!`,
      errorMessage: `Failed to download ${action}.`,
      startMessage: `Preparing to download ${action}...`,
    });
  };

  const columns: GridColDef[] = [
    { field: 'patientId', headerName: 'Patient ID', flex: 1 },
    { field: 'patientName', headerName: 'Patient Name', flex: 1.2 },
    { field: 'totalQuantity', headerName: 'Total Qty', flex: 0.8 },
    {
      field: 'totalValue',
      headerName: 'Total Value',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value || 0),
    },
    { field: 'allocationCount', headerName: 'Allocations', flex: 0.8 },
    {
      field: 'lastDate',
      headerName: 'Last Dispense',
      flex: 1,
      valueFormatter: params =>
        params.value ? new Date(params.value).toLocaleDateString('en-IN') : '—',
    },
  ];

  return (
    <ContentSection title="Patient Name-wise Consumption">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <CustomeDateRangePicker onChange={handleDateChange} />
        <TextField
          label="Search patient"
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
          Patients: {summary.patientCount || 0} · Qty:{' '}
          {summary.totalQuantity || 0} · Value:{' '}
          {formatToIndianCurrencyFormat(summary.totalValue || 0)}
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
          getRowId={(row: any) => row.id || row.patientId}
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

export default PatientConsumptionReports;
