import React, { useState, useMemo } from 'react';
import ContentSection from '../../../components/ContentSection/ContentSection';
import { Box, TextField } from '@mui/material';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import _ from 'lodash';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import { IPatientPharmacy } from '../../../types/patientDashboard/patientPharmacy';
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import { useGetPharmacyReportQuery } from '../../../services/analyticsDashboardService/pharmacy/PharmacyReportApi';

interface IAggregatedPatientPharmacy extends IPatientPharmacy {
  patientDetails?: {
    fullName?: string;
  };
}

const PharmacyReport: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [searchDrugName, setSearchDrugName] = useState<string>('');
  const [searchPatientID, setSearchPatientID] = useState<string>('');
  const [searchFullName, setSearchFullName] = useState<string>('');

  const [startDate, setStartDate] = useState<Date | null>(null); // For start date
  const [endDate, setEndDate] = useState<Date | null>(null); // For end date

  // Handle the date range change
  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  // Convert start and end dates to UTC date-only format for the API
  const startDateUTC = startDate;
  const endDateUTC = endDate;

  // Fetch data from the backend
  const { data: pharmacyData, isLoading: pharmacyLoading } =
    useGetPharmacyReportQuery({
      filters: {
        saleStartDate: startDateUTC || undefined, // Use the converted UTC date
        saleEndDate: endDateUTC || undefined, // Use the converted UTC date
      },
    });

  const allPharmacy = pharmacyData?.data?.records || [];

  console.log('All Pharmacy data', allPharmacy);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleSearchDrugNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchDrugName(event.target.value);
  };

  const handleSearchPatientIDChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchPatientID(event.target.value);
  };

  const handleSearchFullNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchFullName(event.target.value);
  };

  // Filter data based on search input
  const filteredPharmacy = useMemo(() => {
    return allPharmacy.filter((record: IAggregatedPatientPharmacy) => {
      const drugName = record.item?.stock?.item?.name?.toLowerCase() || '';
      const patientID = record.patient?.toLowerCase() || '';
      const fullName = record.patientDetails?.fullName?.toLowerCase() || '';

      return (
        drugName.includes(searchDrugName.toLowerCase()) &&
        patientID.includes(searchPatientID.toLowerCase()) &&
        fullName.includes(searchFullName.toLowerCase())
      );
    });
  }, [allPharmacy, searchDrugName, searchPatientID, searchFullName]);

  // Define columns configuration for the DataGrid
  const columnsConfig: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Drug Name',
      flex: 1,
      valueGetter: params =>
        _.upperFirst(params.row.item?.stock?.item?.name) || 'N/A',
    },
    {
      field: 'patient',
      headerName: 'Patient ID',
      flex: 1,
    },
    {
      field: 'patientName',
      headerName: 'Patient Name',
      flex: 1,
      valueGetter: params =>
        _.upperFirst(params.row.patientDetails?.fullName) || 'N/A',
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      flex: 1,
      valueFormatter(params) {
        return new Date(params.value).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
    },
    {
      field: 'totalQuantity',
      headerName: 'Quantity',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Total Sales Value',
      flex: 1,
      valueGetter: params => {
        // TODO: Remove fallback to item.stock.sellPrice once totalItemPrice is always available
        return formatToIndianCurrencyFormat(
          params.row.totalItemPrice || params.row.item?.stock?.sellPrice || 0
        ) || 'N/A';
      },
    },
  ];

  return (
    <ContentSection title="Pharmacy Reports">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <CustomeDateRangePicker onChange={handleDateChange} />

        <TextField
          label="Filter by Drug Name"
          size="small"
          variant="outlined"
          onChange={handleSearchDrugNameChange}
          placeholder="Enter drug name"
        />
        <TextField
          label="Filter by Patient ID"
          size="small"
          variant="outlined"
          onChange={handleSearchPatientIDChange}
          placeholder="Enter patient ID"
        />
        <TextField
          label="Filter by Patient Name"
          size="small"
          variant="outlined"
          onChange={handleSearchFullNameChange}
          placeholder="Enter full name"
        />
      </Box>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={filteredPharmacy} // Use filtered data here
          page={page}
          pageSize={pageSize}
          totalRows={filteredPharmacy.length}
          loading={pharmacyLoading}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          rowHover={true}
        />
      </Box>
    </ContentSection>
  );
};

export default PharmacyReport;
