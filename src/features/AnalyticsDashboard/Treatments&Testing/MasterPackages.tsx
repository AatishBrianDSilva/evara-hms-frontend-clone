import React, { useState, useCallback } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import debounce from 'lodash/debounce';
import { exportToCSV } from '../../../utils/exportCSV'; // Import the CSV utility
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import { endOfWeek, startOfWeek } from 'date-fns';
import {
  MasterPackagesReportResponse,
  useGetMasterPackageReportsQuery,
} from '../../../services/analyticsDashboardService/treatment&testing/treatmentTestingApi';
import { IQueryOptions } from '../../../types/global';
import PopoverCell from '../../../components/PopoverCell/PopoverCell';

const AnalyticsMasterPackages: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const [startDate, setStartDate] = useState<Date | null>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const [searchInput, setSearchInput] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

  // Debounce function for setting search value
  const debouncedSetSearchValue = useCallback(
    debounce((value: string) => {
      setSearchValue(value);
    }, 300),
    [],
  );

  // Handle the date range change
  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearchInput(event.target.value);
    debouncedSetSearchValue(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Add 1 because page in pagination is 1-based
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const options: IQueryOptions = {
    paginate: pageSize !== -1,
    dateRange: {
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    },
    page: pageSize === -1 ? undefined : page,
    limit: pageSize === -1 ? undefined : pageSize,
    filters: {
      search: searchValue || undefined,
    },
  };

  const { data, isLoading, isFetching } =
    useGetMasterPackageReportsQuery(options);

  const records = data?.data?.records || [];
  const pagination = data?.data?.pagination;

  // Handle CSV download
  const handleDownloadCSV = () => {
    if (records.length > 0) {
      const headers = [
        'Name',
        'Created Date',
        'Gender',
        'Investigations',
        'Procedures',
        'Cryo-Preservations',
        'Services',
        'Treatments',
        'Price',
      ];

      const formattedData = records.map(
        (Package: MasterPackagesReportResponse) => [
          Package.name,
          new Date(Package.createdAt).toLocaleDateString('en-In'),
          Package.gender,
          Package.investigations,
          Package.procedures,
          Package.cryoPreservations,
          Package.services,
          Package.treatmentCycles,
          formatToIndianCurrencyFormat(Package.price),
        ],
      );

      exportToCSV([headers, ...formattedData], 'Master Packages');
    } else {
      console.log('No data to export');
    }
  };

  const columnsConfig: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1,
      valueFormatter: params =>
        new Date(params.value as string).toLocaleDateString('en-In'),
    },
    {
      field: 'gender',
      headerName: 'Gender',
      flex: 1,
    },
    {
      field: 'investigations',
      headerName: 'Investigations',
      flex: 1,
      renderCell: params => {
        const value = (params.value as string) || 'N/A';

        return (
          <PopoverCell
            popoverContent={
              <div>
                {value.split(', ').map((item, index) => (
                  <Typography key={index} variant="body2">
                    {item}
                  </Typography>
                ))}
              </div>
            }
          >
            {value}
          </PopoverCell>
        );
      },
    },
    {
      field: 'procedures',
      headerName: 'Procedures',
      flex: 1,
      renderCell: params => {
        const value = (params.value as string) || 'N/A';

        return (
          <PopoverCell
            popoverContent={
              <div>
                {value.split(', ').map((item, index) => (
                  <Typography key={index} variant="body2">
                    {item}
                  </Typography>
                ))}
              </div>
            }
          >
            {value}
          </PopoverCell>
        );
      },
    },
    {
      field: 'cryoPreservations',
      headerName: 'Cryo Preservations',
      flex: 1,
      renderCell: params => {
        const value = (params.value as string) || 'N/A';

        return (
          <PopoverCell
            popoverContent={
              <div>
                {value.split(', ').map((item, index) => (
                  <Typography key={index} variant="body2">
                    {item}
                  </Typography>
                ))}
              </div>
            }
          >
            {value}
          </PopoverCell>
        );
      },
    },
    {
      field: 'services',
      headerName: 'Services',
      flex: 1,
      renderCell: params => {
        const value = (params.value as string) || 'N/A';

        return (
          <PopoverCell
            popoverContent={
              <div>
                {value.split(', ').map((item, index) => (
                  <Typography key={index} variant="body2">
                    {item}
                  </Typography>
                ))}
              </div>
            }
          >
            {value}
          </PopoverCell>
        );
      },
    },
    {
      field: 'treatmentCycles',
      headerName: 'Treatments',
      flex: 1,
      renderCell: params => {
        const value = (params.value as string) || 'N/A';

        return (
          <PopoverCell
            popoverContent={
              <div>
                {value.split(', ').map((item, index) => (
                  <Typography key={index} variant="body2">
                    {item}
                  </Typography>
                ))}
              </div>
            }
          >
            {value}
          </PopoverCell>
        );
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      valueFormatter: params =>
        formatToIndianCurrencyFormat(params.value as number),
    },
  ];

  return (
    <ContentSection title="Master Packages Report">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <CustomeDateRangePicker onChange={handleDateChange} />

        {/* Add Search Field */}
        <TextField
          label="Search"
          placeholder="Search by name"
          variant="outlined"
          sx={{ width: '200px' }}
          value={searchInput}
          onChange={handleSearchChange}
        />

        <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
          Download CSV
        </Button>
      </Box>

      <CustomDataGrid
        autoHeight={false}
        enablePagination={true}
        columns={columnsConfig}
        rows={records}
        page={page}
        pageSize={pageSize}
        getRowId={row => row._id}
        totalRows={pagination?.totalDocs || 0} // Ensure totalRows is set from pagination
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={isLoading || isFetching} // Use the loading prop in DataGrid
        extendedPageSizeOptions={[25, 50, 100, { label: 'All', value: -1 }]} // Add pagination options
      />
    </ContentSection>
  );
};

export default AnalyticsMasterPackages;
