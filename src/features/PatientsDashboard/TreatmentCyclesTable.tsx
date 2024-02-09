import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React from 'react'

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
      <Button variant='contained' sx={{ width: 'fit-content' }}>
        Export
      </Button>
      <Box sx={{ mt: 1 }}>
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
      </Box>
    </>


  )
}

export default TreatmentCyclesTable