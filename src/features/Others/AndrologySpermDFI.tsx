import React from 'react';
import PatientInfo from './PatientInfo';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TreatmentCyclesTable from './TreatmentCyclesTable';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { VisuallyHiddenInput } from '../../components/Utils/VisuallyHiddenInput';

const AndrologySpermDFI: React.FC = () => {
  return (
    <div className='main-container'>
      <Box sx={{ marginTop: 1 }}>
        <PatientInfo />
      </Box>

      <TreatmentCyclesTable />

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>Sperm DNA Integrity Test</Typography>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <DatePicker label="Date of Test" value={new Date()} sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TimePicker label="Time of Collection" value={null} sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TimePicker label="Time of Evaluation" value={null} sx={{ width: '100%' }} />
        </Grid>
      </Grid>

      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Sperm Count" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Sperm Motility" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Liquefaction" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Abstinence" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Volume" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="No of Sperms Counted" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="No of Sperms With halo (Normal)" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="No of Sperms Without halo (Fragmented)" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="DFI %" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Embryologist" select fullWidth>
            <MenuItem value="Dr. A">Dr. A</MenuItem>
            <MenuItem value="Dr. B">Dr. B</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField multiline maxRows={2} minRows={2} label="DNA Fragmentation" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="SDF Level Method" multiline maxRows={2} minRows={2} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Comments" multiline maxRows={2} minRows={2} fullWidth />
        </Grid>
      </Grid>
      <Grid container spacing={2} marginBottom={2} >
        <Grid item xs={12}>
          {/* Upload image button */}
          <Button component="label" variant="outlined" sx={{ width: 'fit-content' }} startIcon={<CloudUploadIcon />}>
            Upload Images
            <VisuallyHiddenInput onChange={() => { }} type="file" accept="image/*" />
          </Button>
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
    </div >
  );
};

export default AndrologySpermDFI;
