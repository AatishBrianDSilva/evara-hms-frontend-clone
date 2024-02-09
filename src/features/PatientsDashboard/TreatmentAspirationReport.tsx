import { Box, Button, TextField } from '@mui/material'
import React from 'react'
import PatientInfo from './PatientInfo'
import TreatmentCyclesTable from './TreatmentCyclesTable'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Patient Name', width: 600 },
  { field: 'status', headerName: 'Created At', width: 600 },
  { field: 'treatment', headerName: 'Created By', width: 600 },
];

const TreatmentAspirationReport: React.FC = () => {
  return (
    <Box className='main-container' gap={2} p={2}>
      <PatientInfo />
      <TreatmentCyclesTable />
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
        <Button variant='contained' sx={{ width: 'fit-content' }}>
          Add New
        </Button>
        <TextField label="Search Patient Name" />
      </Box>
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

export default TreatmentAspirationReport