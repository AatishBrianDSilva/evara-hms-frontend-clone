import React, { useState, useCallback } from 'react';
import { Box, TextField, MenuItem, Typography } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import debounce from 'lodash/debounce';
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useGetProcedureMonthlyStatsQuery } from '../../../services/analyticsDashboardService/treatment&testing/treatmentTestingApi';
import { IQueryOptions } from '../../../types/global';

const AnalyticsProcedureMonthlyStats: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(
    startOfMonth(new Date()),
  );
  const [endDate, setEndDate] = useState<Date | null>(endOfMonth(new Date()));

  const [status, setStatus] = useState<string>('All');
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

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

  const options: IQueryOptions = {
    dateRange: {
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    },
    filters: {
      status: status === 'All' ? undefined : status,
      search: searchValue || undefined,
    },
  };

  const { data, isLoading, isFetching } =
    useGetProcedureMonthlyStatsQuery(options);

  const records = data?.data?.records || [];
  const summary = data?.data?.summary;

  const columnsConfig: GridColDef[] = [
    { field: 'month', headerName: 'Month (IST)', flex: 1 },
    { field: 'procedure', headerName: 'Procedure', flex: 2 },
    { field: 'count', headerName: 'Count', flex: 1 },
    {
      field: 'totalAmount',
      headerName: 'Total Amount (list price)',
      flex: 1,
      valueFormatter: params => formatToIndianCurrencyFormat(params.value),
    },
  ];

  return (
    <ContentSection title="Procedure-wise Monthly Statistics">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <CustomeDateRangePicker onChange={handleDateChange} />
        <TextField
          label="Status"
          sx={{ width: '150px' }}
          value={status}
          onChange={e => debouncedSetStatus(e.target.value)}
          select
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Scheduled">Scheduled</MenuItem>
          <MenuItem value="In-Progress">Live</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>
        <TextField
          label="Search procedure"
          variant="outlined"
          sx={{ width: '200px' }}
          value={searchInput}
          onChange={e => {
            setSearchInput(e.target.value);
            debouncedSetSearchValue(e.target.value);
          }}
        />
      </Box>

      <CustomDataGrid
        autoHeight={false}
        enablePagination={false}
        columns={columnsConfig}
        rows={records}
        getRowId={row => row.id}
        loading={isLoading || isFetching}
      />

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
              Total Procedures
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {summary?.totalCount || 0}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="h6" fontWeight="bold">
              Total Amount (list price)
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatToIndianCurrencyFormat(summary?.totalAmount || 0)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ContentSection>
  );
};

export default AnalyticsProcedureMonthlyStats;
