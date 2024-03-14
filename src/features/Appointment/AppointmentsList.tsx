import Box from '@mui/material/Box'
import React, { useState } from 'react'
import CustomDataGrid from '../../components/Table/CustomDataGrid'
import Add from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Autocomplete from '@mui/material/Autocomplete'

import { GridColDef } from '@mui/x-data-grid'
import { DatePicker } from '@mui/x-date-pickers'

import Edit from '@mui/icons-material/Edit'

import ErrorAlertWithRetry from '../../components/ErrorAlertWithRetry/ErrorAlertWithRetry'
import BookAppointment from '../Appointment/BookAppointment'
import { useGetDoctorsQuery } from '../../services/doctorsApi'
import { IAppointment, IDoctor, IPagination } from '../../types/types'
import { useGetAppointmentsQuery } from '../../services/appointmentsApi'

const AppointmentsList: React.FC = () => {

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);

  // Fetch all the doctors
  const { data, error: doctorError, isLoading, isFetching, refetch: refetchDoctors } = useGetDoctorsQuery({})
  const doctors: IDoctor[] = data?.data || [];

  // Fetch all the appointments
  const { data: appointmenetData, error: appointmentError, isLoading: isAppointmentLoading, isFetching: isAppointmentFetching, refetch: refetchAppointment } = useGetAppointmentsQuery({
    filters: {
      date: selectedDate.toISOString(),
      doctorId: selectedDoctor?._id
    }
  }, {
    skip: !selectedDate
  })
  const appointments: IAppointment[] = appointmenetData?.data?.records || [];
  const appointmentsPagination: IPagination = appointmenetData?.data?.pagination || {};
  const appointmentLoading = isAppointmentLoading || isAppointmentFetching;

  const error = appointmentError || doctorError;

  const retry = () => {
    refetchAppointment();
    refetchDoctors();
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const columnsConfig: GridColDef[] = [
    // { field: 'date', headerName: 'Date', flex: 1, type: 'date', valueFormatter: (params) => new Date(params.value as string).toLocaleDateString() },
    { field: 'time', headerName: 'Time', flex: 1 },
    { field: 'fullName', headerName: 'Patient', flex: 1, },
    { field: 'doctor', headerName: 'Doctor', flex: 1, valueGetter: (params) => params.row.doctorId?.firstName + " " + params.row.doctorId?.lastName },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    { field: 'notes', headerName: 'Notes', flex: 1 },
    { field: 'reportedTime', headerName: 'Reported Time', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions', headerName: 'Actions', flex: 1, type: 'actions', getActions: (params) => {
        return [
          <IconButton size='small' key="edit" onClick={() => console.log('Edit', params.id)}> <Edit sx={{ fontSize: 16 }} /> </IconButton>,
        ]
      }
    }
  ];

  const handleRowClick = (_: any) => {
  }

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Grid container gap={2}>
        <Grid item xs={12} md={2}>
          <DatePicker
            label="Date"
            format='dd/MM/yyyy'
            value={selectedDate}
            onChange={(newValue) => newValue && setSelectedDate(newValue)}
            slots={TextField}
            slotProps={{ textField: { fullWidth: true } }} />
        </Grid>
        <Grid item xs={12} md={2}>
          <Autocomplete
            options={doctors}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={selectedDoctor}
            onChange={(_, newValue) => {
              setSelectedDoctor(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Doctor"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading || isFetching ? <CircularProgress color="primary" size={20} /> : null}
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
        <TextField label="Search" size="small" variant="outlined" />
        <Button variant="contained" startIcon={<Add />} color="secondary" onClick={openModal}>
          Appointment
        </Button>
      </Box>
      {error && <ErrorAlertWithRetry onRetry={() => retry()} />}
      {/* Render the CustomDataGrid only if there's no error */}
      {!error && (
        <Box mt={2} flex={"1 1 auto"}>
          <CustomDataGrid
            autoHeight={false}
            columns={columnsConfig}
            rows={appointments}
            page={page}
            pageSize={pageSize}
            totalRows={appointmentsPagination.totalDocs || 0}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={appointmentLoading}
            rowHover={true}
            onRowClick={handleRowClick}
            sx={{ height: "100%" }}
            enablePagination={true}
          />
        </Box>
      )}

      {isModalOpen && (
        <BookAppointment openModal={isModalOpen} onClose={closeModal} />
      )}
    </>
  )
}

export default AppointmentsList