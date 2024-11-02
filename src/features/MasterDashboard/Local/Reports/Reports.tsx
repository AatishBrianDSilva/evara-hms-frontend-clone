import React, { useState } from 'react';
import ContentSection from '../../../../components/ContentSection/ContentSection';
import { Box, Button } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';

import Delete from '@mui/icons-material/Delete';

import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import {
  useDeleteDrugItemMutation,
  useGetDrugItemsQuery,
} from '../../../../services/pharmacyDashboardService/master/drugItemApi';
import { useToast } from '../../../../context/ToastContext';
import _ from 'lodash';
import { useGetTaxBracketsQuery } from '../../../../services/pharmacyDashboardService/master/taxBracketApi';
import { useGetDrugCategoriesQuery } from '../../../../services/pharmacyDashboardService/master/drugCategoryApi';
import { useGetDrugTypesQuery } from '../../../../services/pharmacyDashboardService/master/drugTypeApi';
import { useGetDrugManufacturersQuery } from '../../../../services/pharmacyDashboardService/master/drugManufacturerApi';

import EditReports from './EditReports';
import AddReports from './AddReports';
const Reports: React.FC = () => {
  const { showPromiseToast } = useToast();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const [selectedRow, setSelectedRow] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const referralDoctorData = [
    {
      id: '1',
      'Doctor name': 'Dr. John Doe',
      'Contact number ': '1234567890',
      category: { city: 'New York' },
      type: { speciality: 'Cardiology' },
    },
    {
      id: '2',
      'Doctor name': 'Dr. Jane Smith',
      'Contact number ': '9876543210',
      category: { city: 'Los Angeles' },
      type: { speciality: 'Pediatrics' },
    },
    {
      id: '3',
      'Doctor name': 'Dr. Michael Johnson',
      'Contact number ': '4567890123',
      category: { city: 'Chicago' },
      type: { speciality: 'Orthopedics' },
    },
  ];

  const {
    data: drugCategoriesData,
    isLoading: drugCategoriesLoading,
    isFetching: drugCategoriesFetching,
  } = useGetDrugCategoriesQuery({
    paginate: false,
    sort: { name: 1 },
  });
  const drugCategories = drugCategoriesData?.data?.records || [];

  const {
    data: drugTypesData,
    isLoading: drugTypesloading,
    isFetching: drugTypesFetching,
  } = useGetDrugTypesQuery({
    paginate: false,
    sort: { name: 1 },
  });
  const drugTypes = drugTypesData?.data?.records || [];

  const {
    data: drugManufacturersData,
    isLoading: drugManufacturersLoading,
    isFetching: drugManufacturersFetching,
  } = useGetDrugManufacturersQuery({
    paginate: false,
    sort: { name: 1 },
  });
  const drugManufacturers = drugManufacturersData?.data?.records || [];

  const {
    data: taxRatesData,
    isLoading: taxRatesLoading,
    isFetching: taxRatesFetching,
  } = useGetTaxBracketsQuery({
    paginate: false,
    sort: { taxRate: 1 },
  });
  const taxRates = taxRatesData?.data?.records || [];
  const addDrugItemLoading =
    drugCategoriesLoading ||
    drugCategoriesFetching ||
    taxRatesLoading ||
    taxRatesFetching ||
    drugTypesloading ||
    drugTypesFetching ||
    drugManufacturersLoading ||
    drugManufacturersFetching;

  const {
    data: drugItemData,
    isLoading: drugItemLoading,
    isFetching: drugItemFetching,
  } = useGetDrugItemsQuery({
    paginate: true,
    page: page,
    limit: pageSize,
  });

  const drugItemsPagination = drugItemData?.data?.pagination;
  const drugItemsLoading = drugItemLoading || drugItemFetching;

  const [deleteDrugItem, { isLoading }] = useDeleteDrugItemMutation();
  const handleDelete = async () => {
    const promise = deleteDrugItem(selectedRow).unwrap();

    showPromiseToast(promise, {
      loading: 'Deleting...',
      success: data => data || 'Deleted Successfully',
      error: data => data || 'Failed to Delete',
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }

    closeDeleteModal();
  };

  const columnsConfig: GridColDef[] = [
    {
      field: 'Doctor name',
      headerName: 'Doctor Name',
      flex: 1,
      valueFormatter: params => _.upperFirst(params.value),
    },
    { field: 'Contact number ', headerName: 'Contact number ', flex: 1 },
    {
      field: 'City',
      headerName: 'City',
      flex: 1,
      valueGetter: params => params.row.category.city,
    },
    {
      field: 'Speciality',
      headerName: 'Speciality',
      flex: 1,
      valueGetter: params => params.row.type?.speciality,
      valueFormatter: params => _.upperFirst(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            disabled={addDrugItemLoading}
            icon={<Edit />}
            label="Edit"
            onClick={() => handleEditClick(row.id)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDeleteClick(row.id)}
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

  // Edit Modal
  const openEditModal = () => {
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Delete Modal
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEditClick = (id: string) => {
    setSelectedRow(id);
    openEditModal();
  };

  const handleDeleteClick = (id: string) => {
    setSelectedRow(id);
    openDeleteModal();
  };

  return (
    <ContentSection title="Drug Item">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          disabled={addDrugItemLoading}
          onClick={openAddModal}
        >
          Add Report
        </Button>
      </Box>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={referralDoctorData}
          page={page}
          pageSize={pageSize}
          totalRows={drugItemsPagination?.totalDocs || 0}
          loading={drugItemsLoading}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      {isAddModalOpen && (
        <AddReports
          openModal={isAddModalOpen}
          onClose={closeAddModal}
          drugCategories={drugCategories}
          drugTypes={drugTypes}
          drugManufacturers={drugManufacturers}
          taxRates={taxRates}
        />
      )}

      {isEditModalOpen && (
        <EditReports
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow}
          drugCategories={drugCategories}
          drugTypes={drugTypes}
          drugManufacturers={drugManufacturers}
          taxRates={taxRates}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text="this Drug Item"
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={isLoading}
        />
      )}
    </ContentSection>
  );
};

export default Reports;
