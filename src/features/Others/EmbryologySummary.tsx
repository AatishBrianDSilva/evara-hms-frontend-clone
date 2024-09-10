import React from 'react'
import TreatmentCyclesTable from './TreatmentCyclesTable'
import PatientInfo from './PatientInfo'
import CustomDataGrid from '../../components/CustomDataGrid/CustomDataGrid'
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { GridColDef } from '@mui/x-data-grid'

const summaryColumn: GridColDef[] = [
  { field: 'cycleId', headerName: 'Cycle Id', flex: 1 },
  { field: 'createdBy', headerName: 'Created By', flex: 1 },
  { field: 'createdAt', headerName: 'Created At', type: 'date', flex: 1, editable: true },
]


const EmbryologySummary: React.FC = () => {

  return (
    <div className='main-container'>
      <PatientInfo />

      <TreatmentCyclesTable />

      <Typography variant='subtitle1' sx={{ mb: 1, mt: 2 }}>
        Summary
      </Typography>

      <Box display={"flex"} gap={2} mb={2} >
        <Button variant='outlined' color='primary' sx={{ width: 'fit-content' }}>
          Add Summary
        </Button>
        <Button variant='outlined' color='secondary' sx={{ width: 'fit-content' }}>
          Export
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <CustomDataGrid
          rows={[]}
          columns={summaryColumn}
          pageSizeOptions={[5, 10]}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <TextField label="Surgeon" fullWidth select>
            <MenuItem value="Dr. John Doe">Dr. John Doe</MenuItem>
            <MenuItem value="Dr. John Doe">Dr. Jane Doe</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextField label="Embryologist-1" fullWidth select>
            <MenuItem value="Dr. John Doe">Dr. John Doe</MenuItem>
            <MenuItem value="Dr. John Doe">Dr. Jane Doe</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextField label="Embryologist-2" fullWidth select>
            <MenuItem value="Dr. John Doe">Dr. John Doe</MenuItem>
            <MenuItem value="Dr. John Doe">Dr. Jane Doe</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextField label="Incubator" fullWidth />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextField label="Machine Number" fullWidth />
        </Grid>
      </Grid>
      <Box mt={2} display={"flex"} alignItems={"center"} gap={2}>
        <Button variant='outlined' size='small' startIcon={<AddIcon />}>Add more</Button>
        <Button variant='outlined' color='secondary' size='small' startIcon={<CancelIcon />}>Cancel</Button>
      </Box>

      <Typography variant='subtitle1' sx={{ mt: 2 }}>
        D-0
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Quality" fullWidth select >
            <MenuItem value="Good">Good</MenuItem>
            <MenuItem value="Fair">Poor</MenuItem>
            <MenuItem value="Poor">Average</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Typography variant='subtitle1' sx={{ mt: 2 }}>
        D-1
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Grade" fullWidth select >
            <MenuItem value="g1">G-1</MenuItem>
            <MenuItem value="g2">G-2</MenuItem>
            <MenuItem value="g3">G-3</MenuItem>
            <MenuItem value="g4">G-4</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Comment" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="2PN" fullWidth select >
            <MenuItem value="present">Present</MenuItem>
            <MenuItem value="absent">Absent</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Typography variant='subtitle1' sx={{ mt: 2 }}>
        D-2
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Cells" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Frag %" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Grade" fullWidth select >
            <MenuItem value="g1">G-1</MenuItem>
            <MenuItem value="g2">G-2</MenuItem>
            <MenuItem value="g3">G-3</MenuItem>
            <MenuItem value="g4">G-4</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Typography variant='subtitle1' sx={{ mt: 2 }}>
        D-3
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Cells" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Compaction" fullWidth select >
            <MenuItem value="present">Present</MenuItem>
            <MenuItem value="absent">Absent</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Size" fullWidth select >
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Frag %" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Grade" fullWidth select >
            <MenuItem value="g1">G-1</MenuItem>
            <MenuItem value="g2">G-2</MenuItem>
            <MenuItem value="g3">G-3</MenuItem>
            <MenuItem value="g4">G-4</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Typography variant='subtitle1' sx={{ mt: 2 }}>
        D-4
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Cells" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Frag %" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Grade" fullWidth select >
            <MenuItem value="g1">G-1</MenuItem>
            <MenuItem value="g2">G-2</MenuItem>
            <MenuItem value="g3">G-3</MenuItem>
            <MenuItem value="g4">G-4</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Typography variant='subtitle1' sx={{ mt: 2 }}>
        D-5
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Grade" fullWidth select >
            <MenuItem value="g1">G-1</MenuItem>
            <MenuItem value="g2">G-2</MenuItem>
            <MenuItem value="g3">G-3</MenuItem>
            <MenuItem value="g4">G-4</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="ICM" fullWidth select >
            <MenuItem value="g1">G-1</MenuItem>
            <MenuItem value="g2">G-2</MenuItem>
            <MenuItem value="g3">G-3</MenuItem>
            <MenuItem value="g4">G-4</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Te" fullWidth select >
            <MenuItem value="g1">G-1</MenuItem>
            <MenuItem value="g2">G-2</MenuItem>
            <MenuItem value="g3">G-3</MenuItem>
            <MenuItem value="g4">G-4</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Comment" fullWidth />
        </Grid>
      </Grid>

      <Typography variant='subtitle1' sx={{ mt: 2 }}>
        D-6
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Grade" fullWidth select >
            <MenuItem value="g1">G-1</MenuItem>
            <MenuItem value="g2">G-2</MenuItem>
            <MenuItem value="g3">G-3</MenuItem>
            <MenuItem value="g4">G-4</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="ICM" fullWidth select >
            <MenuItem value="g1">G-1</MenuItem>
            <MenuItem value="g2">G-2</MenuItem>
            <MenuItem value="g3">G-3</MenuItem>
            <MenuItem value="g4">G-4</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Te" fullWidth select >
            <MenuItem value="g1">G-1</MenuItem>
            <MenuItem value="g2">G-2</MenuItem>
            <MenuItem value="g3">G-3</MenuItem>
            <MenuItem value="g4">G-4</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Comment" fullWidth />
        </Grid>
      </Grid>

      <Box mt={2} display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
        <Button variant='outlined' size='small'>Submit</Button>
        <Button variant='outlined' color='secondary' size='small' >Cancel</Button>
      </Box>
    </div>
  )

}

export default EmbryologySummary