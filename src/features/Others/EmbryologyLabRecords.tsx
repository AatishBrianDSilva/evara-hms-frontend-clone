import React from 'react'
import PatientInfo from './PatientInfo'
import TreatmentCyclesTable from './TreatmentCyclesTable'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomDataGrid from '../../components/CustomDataGrid/CustomDataGrid'
import { GridColDef } from '@mui/x-data-grid'

const column: GridColDef[] = [
  { field: 'cycleNo', headerName: 'Cycle No', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
  { field: 'treatment', headerName: 'Treatment', flex: 1 },
  { field: 'startDate', headerName: 'Start Date', flex: 1 },
  { field: 'doneOn', headerName: 'Done On', flex: 1 },
  { field: 'doneBy', headerName: 'Done By', flex: 1 },
  { field: 'reason', headerName: 'Reason', flex: 1 },
  { field: 'view', headerName: 'View', type: 'actions', flex: 1 },
]

const EmbryologyLabRecords: React.FC = () => {
  return (
    <div className='main-container'>
      <PatientInfo />

      <TreatmentCyclesTable />

      <Typography variant='h6' mt={2}>
        Lab Records
      </Typography>

      <Box sx={{ mt: 2 }}>
        <CustomDataGrid
          rows={[]}
          columns={column}
        />
      </Box>
    </div>
  )
}

export default EmbryologyLabRecords