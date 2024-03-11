import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react'
import PatientInfo from './PatientInfo'
import TreatmentCyclesTable from './TreatmentCyclesTable'
import { GridColDef } from '@mui/x-data-grid'
import CustomDataGrid from '../../components/Table/CustomDataGrid'

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
      <Button variant='outlined' sx={{ width: 'fit-content' }}>
        Export
      </Button>
      <div style={{ width: '100%' }}>
        <CustomDataGrid
          rows={[]}
          columns={columns}
        />
      </div>
    </Box>
  )
}

export default TreatmentDrugs