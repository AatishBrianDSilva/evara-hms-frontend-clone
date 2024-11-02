import React, { useCallback, useState } from 'react';
import ContentSection from '../../../../components/ContentSection/ContentSection';
import { Box, Button, Grid, TextField } from '@mui/material';
import { Add, CheckCircle, Circle, Edit, Password } from '@mui/icons-material';
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
import AddUser from './AddUser';
import EditUser from './EditUser';
import {
  useGetGlobalUsersQuery,
  useDeleteGlobalUserMutation,
} from '../../../../services/masterDashboardService/global/globalUser';
import ChangePassword from './ChangePassword';

interface RowType {
  _id: string;
}

const User: React.FC = () => {
  const { showPromiseToast } = useToast();

  const [selectedRow, setSelectedRow] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState<boolean>(false);

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
    data: UserData,
    isLoading: UserLoading,
    isFetching: UserFetching,
  } = useGetGlobalUsersQuery({
    paginate: false,
    filters: { isAdmin: true },
    searchQuery,
  });

  const Users = UserData?.data || [];

  // console.log("User Data", Users);

  const getRowId = (row: RowType) => row._id;

  const columnsConfig: GridColDef[] = [
    {
      field: 'branchId',
      headerName: 'Branch Name',
      flex: 1,
    },
    { field: 'username', headerName: 'User Name', flex: 1 },
    {
      field: 'email',
      headerName: 'User Email',
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'User Phone',
      flex: 1,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      valueGetter: params => {
        return _.upperFirst(params.value);
      },
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 1,
      valueGetter: params => (params.value ? 'Active' : 'Inactive'),
    },

    {
      field: 'stage',
      headerName: 'Is Active',
      renderCell(params) {
        return (
          <Grid container>
            {params.row.isActive ? (
              <CheckCircle color="success" />
            ) : (
              <Circle color="warning" />
            )}
          </Grid>
        );
      },
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
          <GridActionsCellItem
            icon={<Password />}
            label="Change Password"
            onClick={() => handleChangePasswordClick(row._id)}
          />,
        ];
      },
    },
  ];

  const [deleteUser, { isLoading: DeleteLoading }] =
    useDeleteGlobalUserMutation();

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
  // Password Modal
  const openChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };
  const closeChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  const handleEditClick = (id: string) => {
    setSelectedRow(id);
    openEditModal();
  };

  const handleDeleteClick = (id: string) => {
    setSelectedRow(id);
    openDeleteModal();
  };

  const handleChangePasswordClick = (id: string) => {
    setSelectedRow(id);
    openChangePasswordModal();
  };

  return (
    <ContentSection title="Users">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Name/Email/Phone/Role"
          size="small"
          variant="outlined"
          onChange={e => debouncedSearchChange(e.target.value)}
        />

        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          disabled={false}
          onClick={openAddModal}
        >
          Add User
        </Button>
      </Box>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={Users}
          loading={UserLoading || UserFetching}
          sx={{ height: '100%' }}
          getRowId={getRowId}
        />
      </Box>

      {isAddModalOpen && (
        <AddUser openModal={isAddModalOpen} onClose={closeAddModal} />
      )}

      {isEditModalOpen && (
        <EditUser
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text="this User"
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={DeleteLoading}
        />
      )}

      {isChangePasswordModalOpen && (
        <ChangePassword
          openModal={isChangePasswordModalOpen}
          onClose={closeChangePasswordModal}
          id={selectedRow}
        />
      )}
    </ContentSection>
  );
};

export default User;
