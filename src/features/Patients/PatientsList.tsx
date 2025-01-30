import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import React, { useCallback, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';

import CustomDataGrid from '../../components/CustomDataGrid/CustomDataGrid';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetPatientsQuery } from '../../services/patientsApi';
import ErrorAlertWithRetry from '../../components/ErrorAlertWithRetry/ErrorAlertWithRetry';
import { setPatientId } from './patientsSlice';
import { useDispatch } from 'react-redux';
import { calculateAge } from '../../utils/calculateAge';
import { useDeletePatientMutation } from '../../services/patientsApi';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { useToast } from '../../context/ToastContext';
import EditPatient from './EditPatient';
import _ from 'lodash';
import { TextField } from '@mui/material';

const PatientsList: React.FC = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

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

  const {
    data: patients,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetPatientsQuery({
    page,
    limit: pageSize,
    searchQuery: searchQuery,
    paginate: true,
    sort: { createdAt: -1 }, // Sort by patientId in descending order
  });

  console.log('Patients list', patients);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const [deletePatient, { isLoading: isDeleteLoading }] =
    useDeletePatientMutation();

  const handleDelete = async () => {
    const promise = deletePatient(selectedRow).unwrap();
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
    { field: 'patientId', headerName: 'ID', flex: 1 }, // Adjust the flex values based on your needs
    { field: 'caseId', headerName: 'Case ID', flex: 1 },
    { field: 'firstName', headerName: 'Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'gender', headerName: 'Gender', flex: 1 },
    {
      field: 'dob',
      headerName: 'Age',
      flex: 1,
      valueGetter: params => {
        return calculateAge(params.row.dob);
      },
    },
    { field: 'mobile', headerName: 'Phone', flex: 1 },
    { field: 'referredBy', headerName: 'Referred By', flex: 1 },
    {
      field: 'createdAt',
      headerName: 'Registered On',
      type: 'date',
      flex: 1,
      valueFormatter: params =>
        new Date(params.value as string).toLocaleDateString(),
    },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
      getActions: params => {
        return [
          <IconButton
            size="small"
            key="edit"
            onClick={() => handleEditClick(params.row.patientId)}
          >
            {' '}
            <Edit sx={{ fontSize: 16 }} />{' '}
          </IconButton>,
          <IconButton
            size="small"
            key="delete"
            onClick={() => handleDeleteClick(params.row._id)}
          >
            {' '}
            <Delete sx={{ fontSize: 16 }} />{' '}
          </IconButton>,
        ];
      },
    },
  ];

  const handleRowClick = (row: any) => {
    dispatch(setPatientId(row.row.patientId));
    navigation(`/patient/${row.row.patientId}`);
  };

  // Delete Modal

  const { showPromiseToast } = useToast();

  const [selectedRow, setSelectedRow] = useState<string>('');

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (patientId: string) => {
    setIsEditModalOpen(true);
    setSelectedRow(patientId);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedRow(id);
    openDeleteModal();
  };

  const handleEditClick = (patientId: string) => {
    openEditModal(patientId);
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search Patient"
          placeholder="ID/Case-ID/Name/Phone"
          size="small"
          variant="outlined"
          onChange={e => debouncedSearchChange(e.target.value)}
          sx={{ width: '300px' }}
        />

        <Button
          variant="contained"
          startIcon={<Add />}
          color="secondary"
          onClick={() => navigation('/ivf-registration')}
        >
          Patient
        </Button>
      </Box>
      {error && <ErrorAlertWithRetry onRetry={() => refetch()} />}
      {/* Render the CustomDataGrid only if there's no error */}
      {!error && (
        <Box mt={2} flex={'1 1 auto'}>
          <CustomDataGrid
            autoHeight={false}
            columns={columnsConfig}
            rows={patients?.data?.records || []}
            page={page}
            pageSize={pageSize}
            totalRows={patients?.data?.pagination?.totalDocs || 0}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={isLoading || isFetching}
            rowHover={true}
            onRowClick={handleRowClick}
            sx={{ height: '100%' }}
            enablePagination={true}
            getRowId={row => row._id}
          />
        </Box>
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text="Patient"
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={isDeleteLoading}
        />
      )}

      {isEditModalOpen && (
        <>
          {console.log('Selected Row ID:', selectedRow)}
          <EditPatient
            openEditPatientModal={isEditModalOpen}
            onClose={closeEditModal}
            id={selectedRow}
          />
        </>
      )}
    </>
  );
};

export default PatientsList;
