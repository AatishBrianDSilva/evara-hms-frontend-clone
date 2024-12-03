import React, { useCallback, useState } from 'react';
import ContentSection from '../../../../components/ContentSection/ContentSection';
import { Box, Button, Grid, TextField } from '@mui/material';
import { Add, CheckCircle, Circle, Edit } from '@mui/icons-material';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
// import Delete from "@mui/icons-material/Delete";
// import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  useGetGlobalBranchsQuery,
  // useDeleteGlobalBranchMutation,
} from '../../../../services/masterDashboardService/global/globalBranch';
// import { useToast } from "../../../../context/ToastContext";
import _ from 'lodash';
import AddBranch from './AddBranch';
import EditBranch from './EditBranch';
interface RowType {
  _id: string;
}

const Branch: React.FC = () => {
  // const { showPromiseToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = useCallback((query: string) => {
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
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const {
    data: BranchData,
    isLoading: BranchLoading,
    isFetching: BranchFetching,
  } = useGetGlobalBranchsQuery({
    paginate: false,
    filters: { isAdmin: true },
    searchQuery,
  });

  const Branchs = BranchData?.data || [];

  console.log('Branch Data', Branchs);

  const getRowId = (row: RowType) => row._id;

  const columnsConfig: GridColDef[] = [
    { field: 'code', headerName: 'Branch Code', flex: 1 },
    {
      field: 'branchName',
      headerName: 'Branch Name',
      flex: 1,
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 1,
      valueGetter(params) {
        return params.row.address?.city;
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
            disabled={BranchLoading}
            icon={<Edit />}
            label="Edit"
            onClick={() => handleEditClick(row._id)}
          />,
          // <GridActionsCellItem
          //   icon={<Delete />}
          //   label="Delete"
          //   onClick={() => handleDeleteClick(row._id)}
          // />,
        ];
      },
    },
  ];

  // const [deleteBranch, { isLoading: DeleteLoading }] = useDeleteGlobalBranchMutation();

  // const handleDelete = async () => {
  //   const promise = deleteBranch(selectedRow).unwrap();

  //   showPromiseToast(promise, {
  //     loading: "Deleting...",
  //     success: (data) => data || "Deleted Successfully",
  //     error: (data) => data || "Failed to Delete",
  //   });

  //   try {
  //     await promise;
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   closeDeleteModal();
  // };

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
  // const openDeleteModal = () => {
  //   setIsDeleteModalOpen(true);
  // };

  // const closeDeleteModal = () => {
  //   setIsDeleteModalOpen(false);
  // };

  const handleEditClick = (id: string) => {
    setSelectedRow(id);
    openEditModal();
  };

  // const handleDeleteClick = (id: string) => {
  //   setSelectedRow(id);
  //   // openDeleteModal();
  // };

  return (
    <ContentSection title="Branchs">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Name/Code"
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
          Add Branch
        </Button>
      </Box>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={Branchs}
          loading={BranchLoading || BranchFetching}
          sx={{ height: '100%' }}
          getRowId={getRowId}
        />
      </Box>

      {isAddModalOpen && (
        <AddBranch openModal={isAddModalOpen} onClose={closeAddModal} />
      )}

      {isEditModalOpen && (
        <EditBranch
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow}
        />
      )}

      {/* {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text="this branch"
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={DeleteLoading}
        />
      )} */}
    </ContentSection>
  );
};

export default Branch;
