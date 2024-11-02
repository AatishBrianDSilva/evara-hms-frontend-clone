import React, { useCallback, useState } from 'react';
import ContentSection from '../../../../components/ContentSection/ContentSection';
import { Box, Button, TextField } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import AddDrugManufacturer from './AddDrugManufacturer';
import Delete from '@mui/icons-material/Delete';
import EditDrugManufacturer from './EditDrugManufacturer';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import {
  useDeleteDrugManufacturerMutation,
  useGetDrugManufacturersQuery,
} from '../../../../services/pharmacyDashboardService/master/drugManufacturerApi';
import { useToast } from '../../../../context/ToastContext';
import { useGetDrugCategoriesQuery } from '../../../../services/pharmacyDashboardService/master/drugCategoryApi';
import { useGetTaxBracketsQuery } from '../../../../services/pharmacyDashboardService/master/taxBracketApi';
import _ from 'lodash';

const DrugManufacturer: React.FC = () => {
  const { showPromiseToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = React.useState(25);

  const handleSearchChange = useCallback((query: string) => {
    setPage(1); // Reset the page
    setSearchQuery(query);
  }, []);

  // Debounce the search handling
  const debouncedSearchChange = useCallback(
    _.debounce(handleSearchChange, 500),
    [handleSearchChange], // Ensure that handleSearchChange is stable
  );

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
    data: taxRatesData,
    isLoading: taxRatesLoading,
    isFetching: taxRatesFetching,
  } = useGetTaxBracketsQuery({
    paginate: false,
    sort: { taxRate: 1 },
  });
  const taxRates = taxRatesData?.data?.records || [];

  const addDrugManufactureLoading =
    drugCategoriesLoading ||
    drugCategoriesFetching ||
    taxRatesLoading ||
    taxRatesFetching;

  const {
    data: drugManufacturerData,
    isLoading: drugManufacturerLoading,
    isFetching: drugManufacturerFetching,
  } = useGetDrugManufacturersQuery({
    paginate: true,
    page: page,
    limit: pageSize,
    searchQuery: searchQuery,
    sort: { location: 1 },
  });
  const drugManufacturers = drugManufacturerData?.data?.records || [];
  const drugManufacturersPagination = drugManufacturerData?.data?.pagination;
  const drugManufacturersLoading =
    drugManufacturerLoading || drugManufacturerFetching;

  const [deleteDrugManufacturer, { isLoading }] =
    useDeleteDrugManufacturerMutation();
  const handleDelete = async () => {
    const promise = deleteDrugManufacturer(selectedRow).unwrap();

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
    { field: 'name', headerName: 'Manufacturer Name', flex: 2 },
    {
      field: 'person',
      headerName: 'Contact Person',
      flex: 1,
      valueGetter(params) {
        return `${params.row.contact.person}`;
      },
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      valueGetter(params) {
        return `${params.row.contact.phone}`;
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      valueGetter(params) {
        return `${params.row.contact.email}`;
      },
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 2,
      valueGetter(params) {
        return `${params.row.address.city}, ${params.row.address.state}`;
      },
    },
    {
      field: 'taxRate',
      headerName: 'Tax Rate',
      flex: 1,
      valueGetter(params) {
        return `${params.row?.taxRate?.taxRate}`;
      },
    },
    // {
    //   field: 'category', headerName: 'Category', flex: 2, valueGetter(params) {
    //     return params.row.category.map((category: any) => category.name).join(', ')
    //   }
    // },
    { field: 'status', headerName: 'Status', flex: 0.5 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
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
    <ContentSection title="Drug Manufacturer">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Name"
          size="small"
          variant="outlined"
          onChange={e => debouncedSearchChange(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          disabled={addDrugManufactureLoading}
          color="primary"
          onClick={openAddModal}
        >
          Add Item
        </Button>
      </Box>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={drugManufacturers}
          page={page}
          pageSize={pageSize}
          totalRows={drugManufacturersPagination?.totalDocs || 0}
          loading={drugManufacturersLoading}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      {isAddModalOpen && (
        <AddDrugManufacturer
          openModal={isAddModalOpen}
          onClose={closeAddModal}
          drugCategories={drugCategories}
          taxRates={taxRates}
        />
      )}

      {isEditModalOpen && (
        <EditDrugManufacturer
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow}
          drugCategories={drugCategories}
          taxRates={taxRates}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text="Drug Manufacturer"
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={isLoading}
        />
      )}
    </ContentSection>
  );
};

export default DrugManufacturer;
