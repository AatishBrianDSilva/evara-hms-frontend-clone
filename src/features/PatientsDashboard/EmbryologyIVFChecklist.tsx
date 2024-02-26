import React from 'react'
import PatientInfo from './PatientInfo'
import TreatmentCyclesTable from './TreatmentCyclesTable'
import { Box, Button, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material'
import CustomDataGrid from '../../components/Table/CustomDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { DatePicker } from '@mui/x-date-pickers'

const columns: GridColDef[] = [
  { field: 'patientName', headerName: 'Patient Name', flex: 1 },
  { field: 'createdAt', headerName: 'Created At', flex: 1 },
  { field: 'createdBy', headerName: 'Created By', flex: 1 },
]

const EmbryologyIVFChecklist: React.FC = () => {
  return (
    <div className='main-container'>
      <PatientInfo />

      <TreatmentCyclesTable />

      <Typography variant='h6' mt={2}>
        IVF Checklist
      </Typography>

      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={2} mt={2}>
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Button variant='outlined' sx={{ width: 'fit-content' }}>
            Add IVF
          </Button>
          <Button variant='outlined' color='secondary' sx={{ width: 'fit-content' }}>
            Export
          </Button>
        </Box>
        <TextField label="Search" />
      </Box>

      <Box mb={2}>
        <CustomDataGrid
          rows={[]}
          columns={columns}
        // pageSizeOptions={[5, 10]}
        />
      </Box>

      <Typography variant='subtitle1'>
        Daily Checklist
      </Typography>

      <Grid container spacing={2} mt={2} mb={2}>
        <Grid item xs={12} md={6} lg={2}>
          <TextField label="Patient" select fullWidth >
            <MenuItem value="1">Patient-1</MenuItem>
            <MenuItem value="2">Patient-2</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6} lg={4}>
          <TextField label="Is Female History Sheet Completed" select fullWidth >
            <MenuItem value="1">Yes</MenuItem>
            <MenuItem value="2">No</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6} lg={4}>
          <TextField label="Is Male History Sheet Completed" select fullWidth >
            <MenuItem value="1">Yes</MenuItem>
            <MenuItem value="2">No</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Divider />

      <Typography variant='subtitle2' mt={2}>
        Female Tests
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Blood Group" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Rubella IgG" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Blood Sugar" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="HIV" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="HbSAg" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="VDRL" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="HCV" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="FSH" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="LH" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="TSH" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Prolactin" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="E2" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Eb-TB-PCR" fullWidth />
        </Grid>
      </Grid>

      <Divider />

      <Typography variant='subtitle2' mt={2}>
        Male Tests
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Blood Group" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="HIV" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="HbSAg" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="VDRL" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="HCV" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Semen Analysis" fullWidth />
        </Grid>
      </Grid>

      <Divider />

      <Typography variant='subtitle2' mt={2}>
        Consent
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="IVF/ICSI" select fullWidth >
            <MenuItem value="1">Yes</MenuItem>
            <MenuItem value="2">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Embryo Freezing" select fullWidth >
            <MenuItem value="1">Yes</MenuItem>
            <MenuItem value="2">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <DatePicker label="Sperm Freezing Back Up (Optional)" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <DatePicker label="Cx Length/Uterine Length" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextField label="Embryologist To Be Informed About The Timing Of hCG" select fullWidth >
            <MenuItem value="1">Yes</MenuItem>
            <MenuItem value="2">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextField label="Anaesthist To Be Informed For Anesthesia" select fullWidth >
            <MenuItem value="1">Yes</MenuItem>
            <MenuItem value="2">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextField label="Blood Reports (Day-2, Day-6, Day-10)" select fullWidth >
            <MenuItem value="1">Yes</MenuItem>
            <MenuItem value="2">No</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mt={2}>
        <Button variant='outlined' sx={{ width: 'fit-content' }}>
          Submit
        </Button>
        <Button variant='outlined' color='secondary' sx={{ width: 'fit-content' }}>
          Cancel
        </Button>
      </Box>

    </div >
  )
}

export default EmbryologyIVFChecklist