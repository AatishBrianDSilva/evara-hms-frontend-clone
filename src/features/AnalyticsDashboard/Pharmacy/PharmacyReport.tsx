import React, { useState } from 'react';
import ContentSection from '../../../components/ContentSection/ContentSection';
import { Box } from '@mui/material';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import _ from 'lodash';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import { useGetPharmacyReportQuery } from '../../../services/analyticsDashboardService/pharmacy/PharmacyReportApi';

const PharmacyReport: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

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
      page: pageSize === -1 ? undefined : page, // If "All" is selected, remove page parameter
      limit: pageSize === -1 ? undefined : pageSize, // If "All" is selected, remove limit parameter

      paginate: pageSize !== -1, // Set pagination to false if "All" is selected
    });

  const allPharmacy = pharmacyData?.data?.records || [];
  const totalRows =
    pharmacyData?.data?.pagination?.totalDocs || allPharmacy.length;

  console.log('All Pharmacy data', pharmacyData);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

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
        return (
          formatToIndianCurrencyFormat(params.row.totalItemPrice || 0) || 'N/A'
        );
      },
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      flex: 1,
      valueGetter: params =>
        params.row.item?.details?.[0]?.expiryDate
          ? new Date(params.row.item.details[0].expiryDate).toLocaleDateString(
              'en-GB',
              {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              },
            )
          : 'N/A',
    },
    {
      field: 'hsnCode',
      headerName: 'HSN Code',
      flex: 1,
      valueGetter: params => params.row.item?.stock?.item?.hsnCode || 'N/A',
    },
    {
      field: 'batchNumber',
      headerName: 'Batch Number',
      flex: 1,
      valueGetter: params =>
        params.row.item?.details?.[0]?.batchNumber || 'N/A',
    },
  ];

  return (
    <ContentSection title="Pharmacy Reports">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <CustomeDateRangePicker onChange={handleDateChange} />
      </Box>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={allPharmacy} // Use filtered data here
          page={page}
          pageSize={pageSize}
          totalRows={totalRows}
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
