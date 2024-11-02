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
  useGetDoctorsQuery,
  useDeleteDoctorMutation,
} from '../../../../services/doctorsApi';
import AddGlobalConsultant from './AddGlobalConsultantDoctor';
import EditGlobalConsultant from './EditGlobalConsultantDoctor';

interface RowType {
  _id: string;
}

const GlobalConsultantDoctor: React.FC = () => {
  const { showPromiseToast } = useToast();

  const [selectedRow, setSelectedRow] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
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
    data: DoctorData,
    isLoading: DoctorLoading,
    isFetching: DoctorFetching,
  } = useGetDoctorsQuery({
    paginate: false,
    filters: { isAdmin: true, isGlobal: true },
    searchQuery,
  });

  const Doctors = DoctorData?.data?.records || [];

  // console.log("Doctor Data", Doctors);

  const getRowId = (row: RowType) => row._id;

  const columnsConfig: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'Doctor Name',
      flex: 1,
      renderCell: params => `${params.row.firstName} ${params.row.lastName}`, // Render the full name
    },
    { field: 'mobile', headerName: 'Contact number ', flex: 1 },
    {
      field: 'city',
      headerName: 'City',
      flex: 1,
    },
    {
      field: 'speciality',
      headerName: 'Speciality',
      flex: 1,
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

  const [deleteUser, { isLoading: DeleteLoading }] = useDeleteDoctorMutation();

  const handleDelete = async () => {
    const promise = deleteUser(selectedRow).unwrap();

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
    <ContentSection title="Consultant Doctors">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Name/Number/Speciality"
          size="small"
          variant="outlined"
          onChange={e => debouncedSearchChange(e.target.value)}
        />

        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          // disabled={}
          onClick={openAddModal}
        >
          Add Consultant Doctors
        </Button>
      </Box>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={Doctors}
          loading={DoctorLoading || DoctorFetching}
          sx={{ height: '100%' }}
          getRowId={getRowId}
        />
      </Box>

      {isAddModalOpen && (
        <AddGlobalConsultant
          openModal={isAddModalOpen}
          onClose={closeAddModal}
        />
      )}

      {isEditModalOpen && (
        <EditGlobalConsultant
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text="this Doctor"
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={DeleteLoading}
        />
      )}
    </ContentSection>
  );
};

export default GlobalConsultantDoctor;
