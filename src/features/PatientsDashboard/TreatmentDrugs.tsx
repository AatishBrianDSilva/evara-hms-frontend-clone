import { Box, Button, TextField, Typography } from '@mui/material'
import React from 'react'
import PatientInfo from './PatientInfo'
import TreatmentCyclesTable from './TreatmentCyclesTable'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Patient Name', width: 600 },
  { field: 'status', headerName: 'Created At', width: 600 },
  { field: 'treatment', headerName: 'Created By', width: 600 },
];

const TreatmentDrugs: React.FC = () => {
  return (
    <Box className='main-container' gap={2} p={2}>
      <PatientInfo />
      <TreatmentCyclesTable />
      <Typography variant='h6' sx={{ mt: 4, mb: 2 }}>Treatment Drugs</Typography>
      <Button variant='contained' sx={{ width: 'fit-content' }}>
        Export
      </Button>
      <div style={{ width: '100%' }}>
        <DataGrid
          rows={[]}
          columns={columns}
          autoHeight
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </div>
    </Box>
  )
}

export default TreatmentDrugs