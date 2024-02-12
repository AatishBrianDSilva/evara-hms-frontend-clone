import React from 'react'
import PatientInfo from './PatientInfo'
import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material'
import TreatmentCyclesTable from './TreatmentCyclesTable'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import { GridColDef } from '@mui/x-data-grid'
import { VisuallyHiddenInput } from '../../components/Utils/VisuallyHiddenInput'
import SemenAnalysisTable from '../../components/SemenAnalysisTable/SemenAnalysisTable';
import useResponsiveColumns from '../../hooks/useResponsiveColumn';
import CustomDataGrid from '../../components/Table/CustomDataGrid';

const columnsConfig: GridColDef[] = [
  { field: 'date', headerName: 'Date', type: 'date', flex: 1 },
  { field: 'time', headerName: 'Time Of Collection', type: 'time', flex: 1 },
  { field: 'createdBy', headerName: 'Created By', flex: 1 },
  { field: 'createdAt', headerName: 'Created At', type: 'date', flex: 1 },
  { field: 'modifiedBy', headerName: 'Modified By', flex: 1 },
  { field: 'modifiedAt', headerName: 'Modified At', type: 'date', flex: 1 },
  { field: 'action', headerName: 'Action', flex: 1 },
]

const AndrologySemenAnalysis: React.FC = () => {

  const columns = useResponsiveColumns(columnsConfig)

  return (
    <div className='main-container'>
      <PatientInfo />

      <TreatmentCyclesTable />

      <Typography variant='h6' sx={{ mt: 2, mb: 2 }}>Semen Analysis </Typography>

      <Box display={"flex"} gap={2} mb={2} >
        <Button variant='outlined' color='primary' sx={{ width: 'fit-content' }}>
          Add Semen
        </Button>
        <Button variant='contained' color='secondary' sx={{ width: 'fit-content' }}>
          Export
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <CustomDataGrid
          rows={[]}
          columns={columns}

          pageSizeOptions={[5, 10]}
        />
      </Box>
      {/* Add Semen Form */}
      <Typography variant='h6' sx={{ mb: 2 }}>Add Semen</Typography>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <DatePicker label="Date" value={new Date()} sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Sperm DFI" name='sperm-dfi' sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TimePicker label="Time of sample received at hospital" value={null} sx={{ width: '100%' }} />
        </Grid>
      </Grid>

      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Place of Collection" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TimePicker label="Time Of Collection" value={null} sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TimePicker label="Time Of Evaluation" value={null} sx={{ width: '100%' }} />
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
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>Physical Assessment</Typography>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Sperm Conc.(millions / ml)" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Pus Cells" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="RBC" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Agglutination" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Total Ejaculate(millions)" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Fructose" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Epithelial Cells" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Live" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Dead" fullWidth />
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

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>Upload Images & Description</Typography>
      <Grid container spacing={2} marginBottom={2} >
        <Grid item xs={12}>
          {/* Upload image button */}
          <Button component="label" variant="outlined" sx={{ width: 'fit-content' }} startIcon={<CloudUploadIcon />}>
            Upload Images
            <VisuallyHiddenInput onChange={() => { }} type="file" accept="image/*" />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <TextField label="Description" multiline minRows={2} fullWidth />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>Reference Values For Semen Analysis</Typography>
      <SemenAnalysisTable />

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>Disclaimer</Typography>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={12} md={12}>
          <TextField label="Disclaimer" value={"Basic Semen Analysis reveals sub fertile samples. To further to evaluate the cause of subfertile semen sample, DNA fragmentation index is recommended."} multiline minRows={2} fullWidth />
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

export default AndrologySemenAnalysis