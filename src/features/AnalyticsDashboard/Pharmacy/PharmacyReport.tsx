import React, { useState } from 'react';
import ContentSection from '../../../components/ContentSection/ContentSection';
import { Box } from '@mui/material';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import _ from 'lodash';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import CustomeDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import { useGetPharmacyReportQuery } from '../../../services/analyticsDashboardService/pharmacy/PharmacyReportApi';
import { downloadFileWithToast } from '../../../utils/downloadFileWithToast';
import generateQueryParams from '../../../utils/generateQueryParams';
import DownloadMenu from '../../../components/CSVDownloadMenu/CSVDownloadMenu';

const PharmacyReport: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = (ranges: any) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  const { data: pharmacyData, isLoading: pharmacyLoading } =
    useGetPharmacyReportQuery({
      filters: {
        saleStartDate: startDate?.toISOString() || undefined,
        saleEndDate: endDate?.toISOString() || undefined,
      },
      page: pageSize === -1 ? undefined : page,
      limit: pageSize === -1 ? undefined : pageSize,
      paginate: pageSize !== -1,
    });

  const allPharmacy = pharmacyData?.data?.records || [];
  const totalRows =
    pharmacyData?.data?.pagination?.totalDocs || allPharmacy.length;

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
          },
        });
        filename = `pharmacy_report_page_${page}-${date}.csv`;
        break;
      case 'currentFilters':
        action = 'filtered data';
        params = generateQueryParams({
          paginate: false,
          filters: {
            allData: true,
            saleStartDate: startDate?.toISOString(),
            saleEndDate: endDate?.toISOString(),
          },
        });
        filename = `pharmacy_report_filtered-${date}.csv`;
        break;
      case 'allData':
        action = 'all data';
        params = generateQueryParams({
          filters: { allData: true },
        });
        filename = `pharmacy_report_all-${date}.csv`;
        break;
      default:
        throw new Error('Invalid download type');
    }

    await downloadFileWithToast({
      endpoint: 'analytics/pharmacy/pharmacy-report/download',
      params,
      fileName: filename,
      successMessage: `Successfully downloaded ${action}!`,
      errorMessage: `Failed to download ${action}.`,
      startMessage: `Preparing to download ${action}...`,
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

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
        <DownloadMenu handleDownload={handleDownload} />
      </Box>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={allPharmacy}
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
