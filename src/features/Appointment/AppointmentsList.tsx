import Box from '@mui/material/Box';
import React, { useCallback, useState } from 'react';
import CustomDataGrid from '../../components/CustomDataGrid/CustomDataGrid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import { Add, Edit, Delete, TaskAlt } from '@mui/icons-material';

import { GridColDef } from '@mui/x-data-grid';

import ErrorAlertWithRetry from '../../components/ErrorAlertWithRetry/ErrorAlertWithRetry';
import BookAppointment from '../Appointment/BookAppointment';
import { useGetDoctorsQuery } from '../../services/doctorsApi';
import {
  useDeleteAppointmentMutation,
  useGetAppointmentsQuery,
} from '../../services/appointmentApi';
import { useDispatch } from 'react-redux';
import { resetAppointment } from './appointmentSlice';
import { IAppointment } from '../../types/appointment';
import { IDoctor } from '../../types/doctor';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { useToast } from '../../context/ToastContext';
import EditAppointment from './EditAppointment';
import EditAppointmentStatus from './EditAppointmentStatus';
import { format } from 'date-fns';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const AppointmentsList: React.FC = () => {
  const dispatch = useDispatch();

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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] =
    useState<boolean>(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);

  // Fetch all the doctors
  const {
    data,
    error: doctorError,
    isLoading,
    isFetching,
    refetch: refetchDoctors,
  } = useGetDoctorsQuery({});
  const doctors = data?.data?.records || [];

  // Fetch all the appointments
  const {
    data: appointmentData,
    error: appointmentError,
    isLoading: isAppointmentLoading,
    isFetching: isAppointmentFetching,
    refetch: refetchAppointment,
  } = useGetAppointmentsQuery(
    {
      filters: {
        date: selectedDate.toISOString(),
        doctorId: selectedDoctor?._id,
      },
      searchQuery: searchQuery,
    },
    {
      skip: !selectedDate,
    },
  );
  const appointments = appointmentData?.data?.records || [];

  const appointmentsPagination = appointmentData?.data?.pagination;
  const appointmentLoading = isAppointmentLoading || isAppointmentFetching;

  const error = appointmentError || doctorError;

  const [deleteAppointment, { isLoading: isDeleteLoading }] =
    useDeleteAppointmentMutation();

  const handleDelete = async () => {
    const promise = deleteAppointment(selectedRow).unwrap();
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

  const retry = () => {
    refetchAppointment();
    refetchDoctors();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const columnsConfig: GridColDef[] = [
    // { field: 'date', headerName: 'Date', flex: 1, type: 'date', valueFormatter: (params) => new Date(params.value as string).toLocaleDateString() },
    { field: 'time', headerName: 'Time', flex: 1 },
    {
      field: 'fullName',
      headerName: 'Patient',
      flex: 1,
      renderCell: params => {
        const hasPatientId = !!params.row.patientId; // Check if patientId exists
        return (
          <Typography
            variant="subtitle2"
            fontSize={12}
            component={hasPatientId ? Link : 'span'}
            to={hasPatientId ? `/patient/${params.row.patientId}` : '#'}
            style={{ textDecoration: hasPatientId ? 'underline' : 'none' }}
          >
            {params.value}
          </Typography>
        );
      },
    },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    {
      field: 'doctor',
      headerName: 'Doctor',
      flex: 1,
      valueGetter: params =>
        params.row.doctorId?.firstName + ' ' + params.row.doctorId?.lastName,
    },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    { field: 'notes', headerName: 'Notes', flex: 1 },
    {
      field: 'reportedTime',
      headerName: 'Reported Time',
      flex: 1,
      valueFormatter: params =>
        params.value ? format(params.value, 'hh:mm aa') : '',
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
            onClick={() => {
              setSelectedAppointment(params.row);
              setIsEditModalOpen(true);
            }}
          >
            <Edit sx={{ fontSize: 16 }} />
          </IconButton>,
          <IconButton
            size="small"
            key="update-status"
            onClick={() => {
              setSelectedAppointment(params.row);
              setIsEditStatusModalOpen(true);
            }}
          >
            <TaskAlt sx={{ fontSize: 16 }} />
          </IconButton>,
          <IconButton
            size="small"
            key="delete"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <Delete sx={{ fontSize: 16 }} />
          </IconButton>,
        ];
      },
    },
    {
      field: 'stage',
      headerName: 'Stage',
      align: 'center',
      renderCell(params) {
        return <Grid container>{renderStatusCircle(params.row.status)}</Grid>;
      },
    },
  ];

  const handleRowClick = (_: any) => {};

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    dispatch(resetAppointment());
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedAppointment(null);
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

  const closeStatusModal = () => {
    setIsEditStatusModalOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedRow(id);
    openDeleteModal();
  };

  const renderStatusCircle = (status: string) => {
    let color: string;

    switch (status) {
      case 'Scheduled':
        color = '#EF988D';
        break;
      case 'Reported':
        color = '#CAC891';
        break;
      case 'Completed':
        color = '#3DA02C';
        break;
      case 'Cancelled':
        color = '#FF0000';
        break;
      default:
        color = '#fff'; // Default color
    }

    return (
      <div
        style={{
          width: 15,
          height: 15,
          borderRadius: '50%',
          backgroundColor: color,
          // margin: "auto",
        }}
      />
    );
  };

  return (
    <>
      <Grid container gap={2}>
        <Grid item xs={12} md={2}>
          <CustomDatePicker
            label="Date"
            value={selectedDate}
            onChange={newValue => newValue && setSelectedDate(newValue)}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Autocomplete
            options={doctors}
            getOptionLabel={option => `${option.firstName} ${option.lastName}`}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={selectedDoctor}
            onChange={(_, newValue) => {
              setSelectedDoctor(newValue);
            }}
            renderInput={params => (
              <TextField
                {...params}
                fullWidth
                label="Doctor"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading || isFetching ? (
                        <CircularProgress color="primary" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            loading={isLoading || isFetching}
            loadingText="Loading doctors..."
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Patient/Phone"
          size="small"
          variant="outlined"
          onChange={e => debouncedSearchChange(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          color="secondary"
          onClick={openModal}
        >
          Appointment
        </Button>
      </Box>
      {error && <ErrorAlertWithRetry onRetry={() => retry()} />}
      {/* Render the CustomDataGrid only if there's no error */}
      {!error && (
        <Box mt={2} flex={'1 1 auto'}>
          <CustomDataGrid
            autoHeight={false}
            columns={columnsConfig}
            rows={appointments}
            page={page}
            pageSize={pageSize}
            totalRows={appointmentsPagination?.totalDocs || 0}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={appointmentLoading}
            onRowClick={handleRowClick}
            sx={{ height: '100%' }}
            enablePagination={true}
          />
        </Box>
      )}

      {isModalOpen && (
        <BookAppointment openModal={isModalOpen} onClose={closeModal} />
      )}

      {isEditModalOpen && selectedAppointment && (
        <EditAppointment
          openModal={isEditModalOpen}
          onClose={closeModal}
          id={selectedAppointment?._id}
          doctors={doctors}
        />
      )}
      {isEditStatusModalOpen && selectedAppointment && (
        <EditAppointmentStatus
          openModal={isEditStatusModalOpen}
          onClose={closeStatusModal}
          id={selectedAppointment?._id}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text="Appointment"
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={isDeleteLoading}
        />
      )}
    </>
  );
};

export default AppointmentsList;
