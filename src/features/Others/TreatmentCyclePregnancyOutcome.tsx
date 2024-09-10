import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react'
import PatientInfo from './PatientInfo'
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';

const TreatmentCyclePregnancyOutcome: React.FC = () => {
  return (
    <Box className='main-container' gap={2} p={2}>
      <PatientInfo />

      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} md={2} lg={10}>
          <Typography variant='subtitle1'>Attempts:</Typography>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Treatment Cycle" value="" fullWidth select>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
          </TextField>
        </Grid>
      </Grid>


      <Grid container flexDirection={"column"} gap={2} mt={2}>
        <Grid item xs={12}>
          <Typography variant='subtitle1'>Treatment Cycle/Pregnancy Outcome</Typography>
        </Grid>
        <Grid item container spacing={2} alignItems={"center"}>
          <Grid item xs={6} md={3} >
            <CustomDatePicker label="Day Of Outcome" />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField label="No Of Babies" value="" fullWidth />
          </Grid>
        </Grid>
        <Grid item container spacing={2} alignItems={"center"}>
          <Grid item xs={4} md={3}>
            <TextField label="Gestation At Delivery(wks)" value="" fullWidth />
          </Grid>
          <Grid item xs={4} md={3}>
            <TextField label="Gestation At Delivery(days)" value="" fullWidth />
          </Grid>
          <Grid item xs={4} md={3}>
            <TextField label="Hospital" value="" fullWidth />
          </Grid>
        </Grid>
        <Grid item xs={12} md={9}>
          <TextField label="Comments" value="" multiline rows={2} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel label="Birthday Message Reminder" control={<Checkbox />} />
        </Grid>
      </Grid>

      <Divider />

      <Grid container flexDirection={"column"} gap={2} mt={2}>
        <Grid item container spacing={2}>
          <Grid item xs={6} md={3}>
            <TextField label="Surname" value="" fullWidth />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField label="Name" value="" fullWidth />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField label="Sex" value="" fullWidth select>
              <MenuItem value="male">male</MenuItem>
              <MenuItem value="female">female</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item xs={6} md={3}>
            <TextField label="City" value="" fullWidth />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField label="District" value="" fullWidth />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField label="Country" value="" fullWidth />
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField label="Method Of Delivery" value="" select fullWidth>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Pregnancy Complications" value="" select fullWidth>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Labour Complications" value="" select fullWidth>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField label="Outcome" value="" select fullWidth>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Complications Of Birth" value="" select fullWidth>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Birth defects" value="" select fullWidth>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField label="Obstetrician" value="" select fullWidth>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' sx={{ width: 'fit-content' }}> Save </Button>
        </Grid>
      </Grid>
    </Box>

  )
}

export default TreatmentCyclePregnancyOutcome