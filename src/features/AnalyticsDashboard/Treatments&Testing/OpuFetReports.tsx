import React, { useState, useCallback } from 'react';
import { Box, TextField, MenuItem, Typography } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import debounce from 'lodash/debounce';
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Visibility } from '@mui/icons-material';
import ViewReports from '../../PatientDashboard/Journey/ViewReports';
import { useGetOpuFetReportsQuery } from '../../../services/analyticsDashboardService/treatment&testing/treatmentTestingApi';
import { IQueryOptions } from '../../../types/global';

type ReportKind = 'OPUReport' | 'EmbryoTransferReport';

interface Props {
  reportType: ReportKind;
  title: string;
}

const AnalyticsOpuFetReports: React.FC<Props> = ({ reportType, title }) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const [startDate, setStartDate] = useState<Date | null>(
    startOfMonth(new Date()),
  );
  const [endDate, setEndDate] = useState<Date | null>(endOfMonth(new Date()));

  const [status, setStatus] = useState<string>('All');
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

  const [isViewReportsModalOpen, setIsViewReportsModalOpen] =
    useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const debouncedSetStatus = useCallback(
    debounce((value: string) => {
      setStatus(value);
    }, 300),
    [],
  );

  const debouncedSetSearchValue = useCallback(
    debounce((value: string) => {
      setSearchValue(value);
    }, 300),
    [],
  );

  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  const options: IQueryOptions & { reportType: ReportKind } = {
    paginate: pageSize !== -1,
    page: pageSize === -1 ? undefined : page,
    limit: pageSize === -1 ? undefined : pageSize,
    dateRange: {
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    },
    filters: {
      status: status === 'All' ? undefined : status,
      search: searchValue || undefined,
    },
    reportType,
  };

  const { data, isLoading, isFetching } = useGetOpuFetReportsQuery(options);

  const records = data?.data?.records || [];
  const pagination = data?.data?.pagination;
  const summary = data?.data?.summary;

  const columnsConfig: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      valueFormatter: params =>
        new Date(params.value).toLocaleDateString('en-IN'),
    },
    { field: 'month', headerName: 'Month (IST)', flex: 1 },
    { field: 'patientId', headerName: 'Patient ID', flex: 1 },
    { field: 'patientName', headerName: 'Patient Name', flex: 1 },
    { field: 'cycleName', headerName: 'Cycle', flex: 1 },
    { field: 'cycleNo', headerName: 'Cycle No', flex: 0.7 },
    { field: 'doctor', headerName: 'Doctor', flex: 1 },
    { field: 'reportName', headerName: 'Report', flex: 1 },
    { field: 'reportStatus', headerName: 'Report Status', flex: 1 },
    { field: 'cycleStatus', headerName: 'Cycle Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      type: 'actions',
      getActions: params => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View Files"
          onClick={() => {
            setSelectedFiles(params.row?.files || []);
            setIsViewReportsModalOpen(true);
          }}
        />,
      ],
    },
  ];

  return (
    <ContentSection title={title}>
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <CustomeDateRangePicker onChange={handleDateChange} />
        <TextField
          label="Cycle Status"
          sx={{ width: '150px' }}
          value={status}
          onChange={e => {
            setPage(1);
            debouncedSetStatus(e.target.value);
          }}
          select
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Scheduled">Scheduled</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In-Progress">In-Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>
        <TextField
          label="Search"
          placeholder="Patient / Doctor"
          variant="outlined"
          sx={{ width: '200px' }}
          value={searchInput}
          onChange={e => {
            setPage(1);
            setSearchInput(e.target.value);
            debouncedSetSearchValue(e.target.value);
          }}
        />
      </Box>

      <CustomDataGrid
        autoHeight={false}
        enablePagination={true}
        columns={columnsConfig}
        rows={records}
        page={page}
        pageSize={pageSize}
        getRowId={row => row._id}
        totalRows={pagination?.totalDocs || 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={isLoading || isFetching}
      />

      {isViewReportsModalOpen && (
        <ViewReports
          openModal={isViewReportsModalOpen}
          onClose={() => setIsViewReportsModalOpen(false)}
          files={selectedFiles}
        />
      )}

      <Box
        mt={4}
        p={2}
        width="40%"
        display="flex"
        flexDirection="column"
        ml="auto"
      >
        <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
          Summary
        </Typography>
        <Box mt={2} display="flex" flexDirection="column" gap={2} width="100%">
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="h6" fontWeight="bold">
              Total Reports
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {summary?.totalCount || 0}
            </Typography>
          </Box>
          {(summary?.byMonth || []).map(
            (m: { month: string; count: number }) => (
              <Box
                key={m.month}
                display="flex"
                justifyContent="space-between"
                width="100%"
              >
                <Typography variant="body1">{m.month}</Typography>
                <Typography variant="body1" color="textSecondary">
                  {m.count}
                </Typography>
              </Box>
            ),
          )}
        </Box>
      </Box>
    </ContentSection>
  );
};

export const AnalyticsOpuReports: React.FC = () => (
  <AnalyticsOpuFetReports reportType="OPUReport" title="Monthly OPU Report" />
);

export const AnalyticsFetReports: React.FC = () => (
  <AnalyticsOpuFetReports
    reportType="EmbryoTransferReport"
    title="Monthly FET (Embryo Transfer) Report"
  />
);

export default AnalyticsOpuFetReports;
