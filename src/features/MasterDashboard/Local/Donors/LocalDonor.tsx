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
import Delete from '@mui/icons-material/Delete';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { useToast } from '../../../../context/ToastContext';
import _ from 'lodash';
import {
  useDeleteDonorMutation,
  useGetdonorQuery,
} from '../../../../services/donorApi';
import EditDonor from './EditDonor';

interface RowType {
  _id: string;
}

const LocalDonor: React.FC = () => {
  const { showPromiseToast } = useToast();

  const [selectedRow, setSelectedRow] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Debounce the search handling
  const debouncedSearchChange = useCallback(
    _.debounce(handleSearchChange, 500),
    [handleSearchChange], // Ensure that handleSearchChange is stable
  );

  const {
    data: donors,
    isLoading,
    isFetching,
    isError,
  } = useGetdonorQuery({
    paginate: false,
    filters: { isAdmin: true, isActive: true },
    searchQuery,
  });

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  if (isError) {
    return <div>Error fetching donors</div>;
  }

  const donorsData = donors?.data?.records || [];

  // console.log("Donor Data", donorsData);

  const getRowId = (row: RowType) => row._id;

  const columnsConfig: GridColDef[] = [
    { field: 'donorId', headerName: 'Donor ID', flex: 1 },

    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: params =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    { field: 'gender', headerName: 'Gender', flex: 1 },
    { field: 'mobile', headerName: 'Mobile', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
    { field: 'state', headerName: 'State', flex: 1 },
    { field: 'nationality', headerName: 'Nationality', flex: 1 },
    { field: 'occupation', headerName: 'Occupation', flex: 1 },
    { field: 'religion', headerName: 'Religion', flex: 1 },

    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => handleEditClick(row._id)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDeleteClick(row._id)}
          />,
        ];
      },
    },
  ];

  const [deleteDonor, { isLoading: DeleteLoading }] = useDeleteDonorMutation();

  const handleDelete = async () => {
    const promise = deleteDonor(selectedRow).unwrap();

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
    const donorIndex = donorsData.findIndex(donor => donor._id === id);
    if (donorIndex !== -1) {
      const donorId = donorsData[donorIndex].donorId;
      setSelectedRow(donorId);
      openEditModal();
    }
  };

  const handleDeleteClick = (id: string) => {
    const donorIndex = donorsData.findIndex(donor => donor._id === id);
    if (donorIndex !== -1) {
      const donorId = donorsData[donorIndex].donorId;
      setSelectedRow(donorId);
      openDeleteModal();
    }
  };

  const handleButtonClick = () => {
    window.location.href = '/ivf-registration/donor-bank';
  };

  return (
    <ContentSection title="Donors">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Name/Mobile"
          size="small"
          variant="outlined"
          onChange={e => debouncedSearchChange(e.target.value)}
        />

        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          // disabled={}
          onClick={handleButtonClick}
        >
          Add Donor
        </Button>
      </Box>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={donorsData}
          loading={isLoading || isFetching}
          sx={{ height: '100%' }}
          getRowId={getRowId}
        />
      </Box>

      {isEditModalOpen && selectedRow && (
        <EditDonor
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text="this Donor"
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={DeleteLoading}
        />
      )}
    </ContentSection>
  );
};

export default LocalDonor;
