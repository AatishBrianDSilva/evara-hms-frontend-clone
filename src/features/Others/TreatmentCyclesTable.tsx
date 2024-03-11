import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { GridColDef } from '@mui/x-data-grid'
import React from 'react'
import CustomDataGrid from '../../components/Table/CustomDataGrid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Cycle ID', width: 200 },
  { field: 'status', headerName: 'Status', width: 200 },
  { field: 'treatment', headerName: 'Treatment', width: 200 },
  {
    field: 'startDate',
    headerName: 'Start Date',
    type: 'date',
    width: 200,
  },
  {
    field: 'attempt',
    headerName: 'Attempt',
    sortable: false,
    width: 200,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 200,
  },
  {
    field: 'createdBy',
    headerName: 'Created By',
    width: 200,
  },
  {
    field: "reason",
    headerName: "Reason",
    sortable: false,
    width: 200,
  }
];

const TreatmentCyclesTable: React.FC = () => {
  return (
    <>
      <Typography variant='h6' sx={{ mt: 4, mb: 2 }}>Treatment Cycles</Typography>
      <Button variant='outlined' sx={{ width: 'fit-content' }}>
        Export
      </Button>
      <Box sx={{ mt: 1 }}>
        <CustomDataGrid
          rows={[]}
          columns={columns}
        />
      </Box>
    </>


  )
}

export default TreatmentCyclesTable