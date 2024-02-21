import { Box, Button, TextField } from '@mui/material'
import React from 'react'
import PatientInfo from './PatientInfo'
import TreatmentCyclesTable from './TreatmentCyclesTable'
import { GridColDef } from '@mui/x-data-grid'
import CustomDataGrid from '../../components/Table/CustomDataGrid'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Patient Name', flex: 1 },
  { field: 'status', headerName: 'Created At', flex: 1 },
  { field: 'treatment', headerName: 'Created By', flex: 1 },
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
        <CustomDataGrid
          rows={[]}
          columns={columns}
          pageSizeOptions={[5, 10]}
        />
      </div>
    </Box>
  )
}

export default TreatmentAspirationReport