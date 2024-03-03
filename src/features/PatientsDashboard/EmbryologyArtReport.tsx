import { Box, Button, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material'
import React from 'react'
import CustomDataGrid from '../../components/Table/CustomDataGrid'
import PatientInfo from './PatientInfo'
import TreatmentCyclesTable from './TreatmentCyclesTable'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import { VisuallyHiddenInput } from '../../components/Utils/VisuallyHiddenInput'
import { GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'patientName', headerName: 'Patient Name', flex: 1 },
  { field: 'createdAt', headerName: 'Created At', flex: 1 },
  { field: 'createdBy', headerName: 'Created By', flex: 1 },
]

const EmbryologyArtReport: React.FC = () => {
  return (
    <div className='main-container'>
      <PatientInfo />

      <TreatmentCyclesTable />

      <Typography variant='h6' mt={2}>
        ART Report
      </Typography>

      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={2} mt={2}>
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Button variant='outlined' sx={{ width: 'fit-content' }}>
            Add New
          </Button>
          <Button variant='outlined' color='secondary' sx={{ width: 'fit-content' }}>
            Export
          </Button>
        </Box>
        <TextField label="Search" />
      </Box>

      <Box>
        <CustomDataGrid
          rows={[]}
          columns={columns}
          pageSizeOptions={[5, 10]}
        />
      </Box>

      <Grid container spacing={2} mt={2} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Consultant Doctor" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Embryologist-1" fullWidth select >
            <MenuItem value="1">Embryologist-1</MenuItem>
            <MenuItem value="2">Embryologist-2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Embryologist-2" fullWidth select >
            <MenuItem value="1">Embryologist-1</MenuItem>
            <MenuItem value="2">Embryologist-2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Gynaecologist-1" fullWidth select >
            <MenuItem value="1">Embryologist-1</MenuItem>
            <MenuItem value="2">Embryologist-2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Gynaecologist-2" fullWidth select >
            <MenuItem value="1">Embryologist-1</MenuItem>
            <MenuItem value="2">Embryologist-2</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Divider />

      <Grid container spacing={2} mt={1} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Reason fo ART" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Female Factor" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Male Factor" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Stimulation Protocol" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <DatePicker label="Date Of Stimulation" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="E2 on the day of hCG" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <DatePicker label="Trigger / Thaw Date" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TimePicker label="Trigger / Thaw Time" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <DatePicker label="Egg Collection Date" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TimePicker label="Egg Collection Time" sx={{ width: '100%' }} />
        </Grid>
      </Grid>

      <Divider />

      <Grid container spacing={2} mt={1} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="No Of OOCYTES" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="OOCYTES Quality" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="OOCYTES Injected" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Sperm Parameters" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="OOCYTES Fertilized" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <DatePicker label="Date Of Transfer" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="No.of Embryos Transferred" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Quality of Embryos Transferred" fullWidth select >
            <MenuItem value="1">Embryologist-1</MenuItem>
            <MenuItem value="2">Embryologist-2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Transfer Comments" fullWidth multiline />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="No.of Embryos Frozen" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Embryos Discarded" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <DatePicker label="Embryo Freezing Done On" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <DatePicker label="Vitrification of Maintenance of embryos will expire on" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="No Of Embryos" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="No Of Cryoleafs" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <DatePicker label="Vitrification of Maintenance of embryos will expire on" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Laser Hatching" fullWidth select >
            <MenuItem value="1">Embryologist-1</MenuItem>
            <MenuItem value="2">Embryologist-2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Procedure Done" fullWidth select >
            <MenuItem value="1">Embryologist-1</MenuItem>
            <MenuItem value="2">Embryologist-2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Renewal Before" fullWidth />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Typography variant='subtitle1' color={"GrayText"} mt={2}>
            If you fail to communicate Regarding extension of freezing, your embryos will be discarded within 1 week , without any further communication written Email  or Telephonic.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
            Upload
            <VisuallyHiddenInput onChange={() => { }} type="file" accept="image/*" />
          </Button>
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          <TextField label="Description" multiline fullWidth />
        </Grid>
      </Grid>

      <Box>

      </Box>
      <Divider />
      <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mt={2}>
        <Button variant='outlined' sx={{ width: 'fit-content' }}>
          Submit
        </Button>
        <Button variant='outlined' color='secondary' sx={{ width: 'fit-content' }}>
          Cancel
        </Button>
      </Box>
    </div>
  )
}

export default EmbryologyArtReport