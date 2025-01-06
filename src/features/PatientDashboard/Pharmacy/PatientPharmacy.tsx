import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import Add from '@mui/icons-material/Add';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import { Visibility } from '@mui/icons-material';
import AddPatientPharmacy from './AddPatientPharmacy';
import { useGetPatientPharmacysQuery } from '../../../services/patientDashboardService/patientPharmacyApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useGetStocksQuery } from '../../../services/pharmacyDashboardService/stocksApi';
import ViewPatientPharmacy from './ViewPatientPharmacy';
import Delete from '@mui/icons-material/Delete';
import DeletePatientPharmacy from './DeletePatientPharmacy';
import { IPatientPharmacy } from '../../../types/patientDashboard/patientPharmacy';

const PatientPharmacy: React.FC = () => {
  const patient = useSelector((state: RootState) => state.patients.patient);
  const patientId = patient?.patientId || '';

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const [selectedRow, setSelectedRow] = useState<
    IPatientPharmacy | undefined
  >();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const {
    data: patientPharmacyData,
    isLoading,
    isFetching,
  } = useGetPatientPharmacysQuery(
    {
      options: {
        paginate: true,
        page: page,
        limit: pageSize,
      },
      id: patientId,
    },
    {
      skip: !patientId,
    },
  );

  const patientPharmacy = patientPharmacyData?.data?.records || [];
  const patientPagination = patientPharmacyData?.data?.pagination;
  const PatientPharmacyLoading = isLoading || isFetching;

  // Pharmacy Stocks
  const {
    data: stocksData,
    isLoading: stocksLoading,
    isFetching: stocksFetching,
  } = useGetStocksQuery();
  const stocks = stocksData?.data || [];

  const addPatientPharmacyLoading = stocksLoading || stocksFetching;

  // Columns configuration for the data grid
  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      type: 'date',

      valueFormatter(params) {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: 'item',
      headerName: 'Items',
      flex: 1,
      valueGetter(params) {
        return params.row?.item?.stock?.item?.name;
      },
    },
    {
      field: 'totalQuantity',
      headerName: 'Quantity',
      flex: 1,
    },
    {
      field: 'doctor',
      headerName: 'Doctor',
      flex: 1,
      valueGetter(params) {
        return (
          params.row?.doctor?.firstName + ' ' + params.row?.doctor?.lastName
        );
      },
    },
    {
      field: 'allocatedBy',
      headerName: 'Allocated By',
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellClassName: 'actions',
      // custom actions for the actions column
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<Visibility />}
            label="Print"
            onClick={() => openViewModal(row)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => openDeleteModal(row)}
          />,
        ];
      },
    },
  ];

  // Add Modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // View Modal
  const openViewModal = (order: IPatientPharmacy) => {
    setSelectedRow(order);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setSelectedRow(undefined);
    setIsViewModalOpen(false);
  };

  // Delete Modal
  const openDeleteModal = (order: IPatientPharmacy) => {
    setSelectedRow(order);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedRow(undefined);
    setIsDeleteModalOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" flex={1} p={2}>
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          disabled={addPatientPharmacyLoading}
          onClick={openAddModal}
        >
          Add Item
        </Button>
      </Box>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columns}
          rows={patientPharmacy}
          page={page}
          pageSize={pageSize}
          totalRows={patientPagination?.totalDocs || 0}
          loading={PatientPharmacyLoading}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      {isAddModalOpen && (
        <AddPatientPharmacy
          openModal={isAddModalOpen}
          onClose={closeAddModal}
          pharmacyStocks={stocks}
          patientId={patientId}
        />
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <ViewPatientPharmacy
          openModal={isViewModalOpen}
          onClose={closeViewModal}
          id={selectedRow?._id || ''}
        />
      )}

      {isDeleteModalOpen && (
        <DeletePatientPharmacy
          openModal={isDeleteModalOpen}
          onClose={closeDeleteModal}
          id={selectedRow?._id || ''}
          name={selectedRow?.item?.stock?.item?.name || ''}
          quantity={selectedRow?.totalQuantity || 0}
        />
      )}
    </Box>
  );
};

export default PatientPharmacy;
