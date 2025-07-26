// src/pages/master/PatientList.tsx

import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { GridColDef } from '@mui/x-data-grid';

import {
  useGetPatientsListQuery,
  IListArgs,
} from '../../../../services/masterDashboardService/local/patientListApi';
// import { IPatient } from '../../../../types/patient';
import ContentSection from '../../../../components/ContentSection/ContentSection';
import DownloadMenu from '../../../../components/CSVDownloadMenu/CSVDownloadMenu';
import CustomeDateRangePicker from '../../../../components/CustomDateRangePicker/CustomDateRangePicker';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';

import generateQueryParams from '../../../../utils/generateQueryParams';
import { downloadFileWithToast } from '../../../../utils/downloadFileWithToast';

const branchOptions = [
  { label: 'All', value: 'All' },
  { label: 'Kanpur', value: 'KN' },
  { label: 'Lucknow', value: 'LK' },
  { label: 'Ranchi', value: 'RA' },
  { label: 'Jhansi', value: 'JH' },
];

const PatientList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState<string>('All');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const apiOptions = useMemo<IListArgs>(
    () => ({
      page,
      limit: pageSize,
      dateRange: {
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
      },
      filters: {
        searchQuery: search || undefined,
        branch: branch !== 'All' ? branch : undefined,
        allData: false,
      },
    }),
    [page, pageSize, search, branch, dateRange],
  );

  const { data, isLoading, isFetching } = useGetPatientsListQuery(apiOptions);
  const rows = data?.data?.records || [];
  const total = data?.data?.pagination.totalDocs || 0;

  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      setDateRange({
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate,
      });
      setPage(1);
    }
  };

  const handleDownload = async (
    mode: 'currentPage' | 'currentFilters' | 'allData',
  ) => {
    let opts: IListArgs;

    if (mode === 'currentPage') {
      // Paginate with current filters
      opts = {
        page: apiOptions.page,
        limit: apiOptions.limit,
        dateRange: apiOptions.dateRange,
        filters: {
          ...apiOptions.filters!,
          allData: false,
        },
      };
    } else if (mode === 'currentFilters') {
      // All rows matching current filters (no pagination)
      opts = {
        // omit page & limit
        dateRange: apiOptions.dateRange,
        filters: {
          searchQuery: apiOptions.filters!.searchQuery,
          branch: apiOptions.filters!.branch,
          allData: true,
        },
      };
    } else {
      // mode === 'allData': literally every patient in the clinic
      opts = {
        // no pagination, no dateRange, no search/branch
        filters: {
          allData: true,
        },
      };
    }

    const params = generateQueryParams(opts as any);
    const date = new Date().toLocaleDateString('en-IN');
    const filename = `patients_${mode}_${date}.csv`;

    await downloadFileWithToast({
      endpoint: 'master/patient/download',
      params,
      fileName: filename,
      startMessage: `Preparing ${mode} download…`,
      successMessage: `Downloaded ${mode} successfully!`,
      errorMessage: `Failed to download ${mode}.`,
      useMasterApi: true,
    });
  };

  const columns: GridColDef[] = [
    { field: 'patientId', headerName: 'ID', flex: 1 },
    { field: 'caseId', headerName: 'Case ID', flex: 1 },
    { field: 'branchId', headerName: 'Branch', flex: 1 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: params => `${params.row.firstName} ${params.row.lastName}`,
    },
    { field: 'gender', headerName: 'Gender', flex: 1 },
    {
      field: 'dob',
      headerName: 'DOB',
      flex: 1,
      valueFormatter: p =>
        new Date(p.value as string).toLocaleDateString('en-IN'),
    },
    { field: 'mobile', headerName: 'Phone', flex: 1 },
    {
      field: 'createdAt',
      headerName: 'Registered On',
      flex: 1,
      valueFormatter: p =>
        new Date(p.value as string).toLocaleDateString('en-IN'),
    },
    { field: 'status', headerName: 'Status', flex: 1 },
  ];

  return (
    <ContentSection title="Patient List">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <TextField
          label="Search"
          size="small"
          placeholder="ID, Case ID, Name, Phone"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Branch</InputLabel>
          <Select
            label="Branch"
            value={branch}
            onChange={e => {
              setBranch(e.target.value);
              setPage(1);
            }}
          >
            {branchOptions.map(o => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <CustomeDateRangePicker onChange={handleDateChange} />

        <DownloadMenu handleDownload={handleDownload} />
      </Box>

      <Box flex="1 1 auto">
        <CustomDataGrid
          rows={rows}
          columns={columns}
          page={page}
          pageSize={pageSize}
          totalRows={total}
          loading={isLoading || isFetching}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          getRowId={r => r._id}
          enablePagination
        />
      </Box>
    </ContentSection>
  );
};

export default PatientList;
