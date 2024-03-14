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
import { IDoctor } from '../../types/types'


const AppointmentsList: React.FC = () => {

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data, error, isLoading, isFetching, refetch } = useGetDoctorsQuery({})

  const doctors: IDoctor[] = data?.data || [];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const columnsConfig: GridColDef[] = [
    { field: 'time', headerName: 'Time', flex: 1 }, // Adjust the flex values based on your needs
    { field: 'patient', headerName: 'Patient', flex: 1, },
    { field: 'doctor', headerName: 'Doctor', flex: 1 },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    { field: 'notes', headerName: 'Notes', flex: 1 },
    { field: 'reportedAt', headerName: 'Reported At', flex: 1 },
    // { field: 'createdAt', headerName: 'Registered On', type: 'date', flex: 1, valueFormatter: (params) => new Date(params.value as string).toLocaleDateString() },
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
          <DatePicker label="Date" format='dd/MM/yyyy' slots={TextField} slotProps={{ textField: { fullWidth: true } }} />
        </Grid>
        <Grid item xs={12} md={2}>
          <Autocomplete
            options={doctors}
            getOptionLabel={(doctor) => doctor.firstName + " " + doctor.lastName}
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
      {error && <ErrorAlertWithRetry onRetry={() => refetch()} />}
      {/* Render the CustomDataGrid only if there's no error */}
      {!error && (
        <Box mt={2} flex={"1 1 auto"}>
          <CustomDataGrid
            autoHeight={false}
            columns={columnsConfig}
            rows={[]}
            page={page}
            pageSize={pageSize}
            totalRows={0}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={isLoading || isFetching}
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