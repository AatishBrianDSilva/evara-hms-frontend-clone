import { Box, Button, IconButton, TextField } from '@mui/material'
import React from 'react'
// import { DatePicker } from '@mui/x-date-pickers'
import { GridColDef } from '@mui/x-data-grid'
// import { setSelectedPatientId } from './patientsSlice'
// import { useDispatch } from 'react-redux'
import CustomDataGrid from '../../components/Table/CustomDataGrid'
import { Add, Delete, Edit } from '@mui/icons-material'
import ContentSection from '../../components/ContentSection/ContentSection'
import { useNavigate } from 'react-router-dom'
import { useGetPatientsQuery } from '../../services/patientsApi'
import ErrorAlertWithRetry from '../../components/ErrorAlertWithRetry/ErrorAlertWithRetry'

const PatientsList: React.FC = () => {

  // const dispatch = useDispatch();
  const navigation = useNavigate();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);

  const { data: patients, error, isLoading, isFetching, refetch } = useGetPatientsQuery({
    page,
    limit: pageSize,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const columnsConfig: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 }, // Adjust the flex values based on your needs
    { field: 'firstName', headerName: 'Name', flex: 1, },
    { field: 'gender', headerName: 'Gender', flex: 1 },
    { field: 'age', headerName: 'Age', flex: 1 },
    { field: 'mobile', headerName: 'Phone', flex: 1 },
    { field: 'referredBy', headerName: 'Referred By', flex: 1 },
    { field: 'createdAt', headerName: 'Registered On', type: 'date', flex: 1, valueFormatter: (params) => new Date(params.value as string).toLocaleDateString() },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions', headerName: 'Actions', flex: 1, type: 'actions', getActions: (params) => {
        return [
          <IconButton size='small' key="edit" onClick={() => console.log('Edit', params.id)}> <Edit sx={{ fontSize: 16 }} /> </IconButton>,
          <IconButton size='small' key="delete" onClick={() => console.log('delete', params.id)}> <Delete sx={{ fontSize: 16 }} /> </IconButton>
        ]
      }
    }
  ];

  return (
    <ContentSection title="Patients" titleSx={{ justifyContent: 'space-between' }}>
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField label="Search" size="small" variant="outlined" />
        <Button variant="contained" startIcon={<Add />} color="secondary" onClick={() => navigation("/ivf-registration")}>
          Add Patient
        </Button>
      </Box>
      {error && <ErrorAlertWithRetry onRetry={() => refetch()} />}
      {/* Render the CustomDataGrid only if there's no error */}
      {!error && (
        <Box mt={2} flex={"1 1 auto"}>
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
            onRowClick={(row) => navigation(`/patients/${row.row.id}`)}
            sx={{ height: "100%" }}
          />
        </Box>
      )}
    </ContentSection>
  )
}

export default PatientsList