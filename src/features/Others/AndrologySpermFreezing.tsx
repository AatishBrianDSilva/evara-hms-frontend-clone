import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react'
import TreatmentCyclesTable from './TreatmentCyclesTable'
import PatientInfo from './PatientInfo'
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';
import CustomTimePicker from '../../components/CustomDatePicker/CustomTimePicker';

const AndrologySpermFreezing: React.FC = () => {
  return (
    <div className='main-container'>
      <PatientInfo />

      <TreatmentCyclesTable />

      <Typography variant='h6' sx={{ mt: 2, mb: 2 }}>Sperm Freezing </Typography>

      <Box display={"flex"} gap={2} mb={2} >

        <Button variant='contained' sx={{ width: 'fit-content' }}>
          Export
        </Button>
      </Box>

      {/* Add Semen Form */}
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <CustomDatePicker label="Date" value={new Date()} sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Sperm DFI" name='sperm-dfi' sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTimePicker label="Time of sample received at hospital" value={null} sx={{ width: '100%' }} />
        </Grid>
      </Grid>

      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Place of Collection" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTimePicker label="Time Of Collection" value={null} sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTimePicker label="Time Of Evaluation" value={null} sx={{ width: '100%' }} />
        </Grid>
      </Grid>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Days of Abstinence" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Volume" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Spillage" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Appearance" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Liquefaction" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Viscosity" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="PH" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Color" select fullWidth>
            <MenuItem value="Dr. A">Dr. A</MenuItem>
            <MenuItem value="Dr. B">Dr. B</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>Sperm Motility</Typography>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Rapid Progressive Grade A" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Slow Progressive Grade B" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Non Progressive Grade C" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Immotile Grade D" fullWidth />
        </Grid>
      </Grid>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Impression" select fullWidth>
            <MenuItem value="Dr. A">Dr. A</MenuItem>
            <MenuItem value="Dr. B">Dr. B</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>Morphology Assessment</Typography>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Normal Forms" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Head Defects" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Over All Defects" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Mid Piece And Neck Defects" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Cytoplasmic Droplets" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Tail Defects" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Defects InHead,Mid Piece-Neck & Tail" fullWidth />
        </Grid>
      </Grid>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Impression" select fullWidth>
            <MenuItem value="Dr. A">Dr. A</MenuItem>
            <MenuItem value="Dr. B">Dr. B</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>Advanced Sperm Fertilization Parameter Assessment</Typography>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="HOS(Hypo-Osmotic Swelling)" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Acrosome Intactness(AI)" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Zona Binding Potential Of Sperm As Per AI Testing" fullWidth />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>Final Semen Analysis & Advanced Sperm Assessment</Typography>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={6}>
          <TextField label="Analysis" multiline minRows={2} fullWidth />
        </Grid>
      </Grid>

      <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2} mb={2} >
        <Button variant='contained' color='primary' sx={{ width: 'fit-content' }}>
          Save
        </Button>
        <Button variant='contained' color='secondary' sx={{ width: 'fit-content' }}>
          Cancel
        </Button>
      </Box>
    </div>
  )
}

export default AndrologySpermFreezing