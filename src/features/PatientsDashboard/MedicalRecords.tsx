import React from 'react'
import TreatmentCyclesTable from './TreatmentCyclesTable'
import PatientInfo from './PatientInfo'
import { Box, Button, Divider, Grid, IconButton, MenuItem, Paper, Tab, Tabs, TextField, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid';
import { Clear, Check } from "@mui/icons-material"
import { DateTimePicker } from '@mui/x-date-pickers';
import useResponsiveColumns from '../../hooks/useResponsiveColumn';
import CustomDataGrid from '../../components/Table/CustomDataGrid';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const medicalRecordsColumnConfig: GridColDef[] = [
  { field: 'subject', headerName: 'Subject', flex: 1 },
  { field: 'description', headerName: 'Description', flex: 1 },
  { field: 'createdBy', headerName: 'Created By', flex: 1 },
  { field: 'createdAt', headerName: 'Created At', type: 'date', flex: 1 },
  { field: 'modifiedBy', headerName: 'Modified By', flex: 1 },
  { field: 'modifiedAt', headerName: 'Modified At', type: 'date', flex: 1 },
]

const physicalCharColumnsConfig: GridColDef[] = [
  { field: 'id', headerName: 'S.No', flex: 1 },
  { field: 'body_temp', headerName: 'Body Temperature', flex: 1 },
  { field: 'heart_rate', headerName: 'Heart Rate', flex: 1 },
  { field: 'bp', headerName: 'BP', flex: 1 },
  { field: 'height', headerName: 'Height (Meter)', flex: 1 },
  { field: 'weight', headerName: 'Weight (Kg)', flex: 1 },
  { field: 'bmi', headerName: 'BMI', flex: 1 },
  { field: 'createdAt', headerName: 'Created At', type: 'date', flex: 1 },
  { field: 'modifiedAt', headerName: 'Modified At', type: 'date', flex: 1 },
]

function a11yProps(index: number) {
  return {
    id: `medical-records-tab-${index}`,
    'aria-controls': `medical-records-tabpanel-${index}`,
  };
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`medical-records-tabpanel-${index}`}
      aria-labelledby={`medical-records-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MedicalRecords: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const medicalRecordsColumn = useResponsiveColumns(medicalRecordsColumnConfig);
  const physicalCharColumns = useResponsiveColumns(physicalCharColumnsConfig);

  const renderPhysicalCharactertistics = () => {
    return (
      <Box>
        <Box display={"flex"} gap={2} mb={2} >
          <Button variant='contained' color='primary' sx={{ width: 'fit-content' }}>
            Add Record
          </Button>
          <Button variant='contained' color='secondary' sx={{ width: 'fit-content' }}>
            Convertor
          </Button>
        </Box>
        <Box sx={{ mb: 2 }}>
          <CustomDataGrid
            rows={[]}
            columns={physicalCharColumns}


            pageSizeOptions={[5, 10]}
          />
        </Box>

        <Typography variant='subtitle1'>
          Add New Record
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              id="body_temp"
              label="Body Temperature"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              id="heart_rate"
              label="Heart Rate"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              id="bp"
              label="BP"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              id="height"
              label="Height (Meter)"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              id="weight"
              label="Weight (Kg)"
              fullWidth
            />
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1}>
            <IconButton color='success' aria-label='Add record'>
              <Check />
            </IconButton>

          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1}>
            <IconButton color='error' aria-label='Cancel'>
              <Clear />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const renderMedicalRecords = () => {
    return (
      <Box>
        <Box display={"flex"} gap={2} mb={2} >
          <Button variant='outlined' color='primary' sx={{ width: 'fit-content' }}>
            Add Record
          </Button>
          <Button variant='outlined' color='secondary' sx={{ width: 'fit-content' }}>
            Export
          </Button>
        </Box>
        <Box sx={{ mb: 2 }}>
          <CustomDataGrid
            rows={[]}
            columns={medicalRecordsColumn}


            pageSizeOptions={[5, 10]}
          />
        </Box>
        {addMedicalRecord()}
      </Box>
    )
  }


  const addMedicalRecord = () => {
    return (
      <>
        <Typography variant='subtitle1' mb={2}>
          Add New Record
        </Typography>

        {/* Date and Time Picker */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}> {/* Adjusted for full width on all screen sizes */}
            <DateTimePicker
              label="Date and Time"
              value={new Date()}
              onChange={() => { }}
              sx={{ width: '100%' }}
            />
          </Grid>
        </Grid>

        {/* Subject */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} lg={4}> {/* Responsive adjustments */}
            <TextField
              id="subject"
              label="Subject"
              select
              fullWidth
            >
              <MenuItem value="1">Subject 1</MenuItem>
              <MenuItem value="2">Subject 2</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Descriptions */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} lg={6}>
            <TextField
              multiline
              minRows={2}
              id="description"
              label="Description"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              multiline
              minRows={2}
              id="pri-sec-male-female-couple-married-in"
              label="Primary / Secondary Male Female Couple Married In"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Male Issues */}
        <Typography variant='subtitle1' color={"textSecondary"} mb={1}>
          Male Issues
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item container gap={2} xs={12} lg={6}>
            <TextField id="male-issues-age" label="Age" fullWidth />
            <TextField id="male-issues-bmi" label="BMI" fullWidth />
            <TextField multiline minRows={2} id="male-issues-sa" label="SA" fullWidth />
          </Grid>
        </Grid>

        {/* Female Issues */}
        <Typography variant='subtitle1' color={"textSecondary"} mb={1}>
          Female Issues
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item container gap={2} xs={12} lg={6}>
            <TextField id="female-issues-age" label="Age" fullWidth />
            <TextField id="female-issues-bmi" label="BMI" fullWidth />
            <TextField multiline minRows={2} id="female-issues-amh" label="AMH" fullWidth />
            <TextField multiline minRows={2} id="female-issues-3dscan" label="3D Scan" fullWidth />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Additional Sections */}
        {['Previous Cycles', 'Plan', 'Review'].map((label, index) => (
          <Grid container spacing={2} mb={2} key={index}>
            <Grid item xs={12} lg={6}>
              <TextField
                multiline
                minRows={2}
                id={label.toLowerCase().replace(/\s+/g, '-')}
                label={label}
                fullWidth
              />
            </Grid>
          </Grid>
        ))}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
          <Button variant='contained' sx={{ width: 'fit-content' }}>
            Save
          </Button>
          <Button variant='contained' color='secondary' sx={{ width: 'fit-content' }}>
            Cancel
          </Button>
        </Box>
      </>
    );
  };

  const renderDonorCharactertistics = () => {
    // Dummy data for demonstration
    const donorData = {
      donorId: '12345',
      gender: 'Male',
      age: 35,
      maritalStatus: 'Single',
      identityType: 'Passport',
      issuedCountry: 'CountryX',
      referralType: 'Online Form',
      detailsOfDeath: 'N/A',
      hivHbsAg: 'Negative',
      bloodGroup: 'O+',
      heightWeight: '180cm / 80kg',
      education: 'Bachelor’s Degree',
      facialFeatures: 'Oval face, no distinguishing marks',
      skinTone: 'Medium',
      build: 'Athletic',
      seriousDisease: 'None',
      habits: 'Non-smoker, occasional drinker',
      donorName: 'John Doe',
      dob: '1988-01-01',
      mobile: '+123456789',
      identityNumber: 'A1B2C3D4',
      email: 'johndoe@example.com',
      interpreter: 'N/A',
      remarks: 'None',
      gameteDetail: 'N/A',
      complexion: 'Fair',
      rhAntibody: 'Negative',
      hairColor: 'Brown',
      eyeColor: 'Blue',
      healthLooks: 'Good',
      congenitalDeformities: 'None',
      familyMemberDisease: 'None',
      chronicIllness: 'None',
      geneticallyAcquiredDisease: 'None',
      address: '123 Main St, City, CountryX'
    };

    return (
      <Box sx={{ flexGrow: 1, padding: 3 }}>

        <Grid container spacing={2}>
          {/* Personal Details */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" component="h2">
                Personal Details
              </Typography>
              <Typography variant="body1">Donor ID: {donorData.donorId}</Typography>
              <Typography variant="body1">Name: {donorData.donorName}</Typography>
              <Typography variant="body1">Gender/Age: {donorData.gender} / {donorData.age}</Typography>
              <Typography variant="body1">DOB: {donorData.dob}</Typography>
              <Typography variant="body1">Marital Status: {donorData.maritalStatus}</Typography>
              {/* Add more fields as needed */}
            </Paper>
          </Grid>

          {/* Medical Details */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" component="h2">
                Medical Details
              </Typography>
              <Typography variant="body1">Blood Group: {donorData.bloodGroup}</Typography>
              <Typography variant="body1">HIV&HBsAg: {donorData.hivHbsAg}</Typography>
              {/* Add more fields as needed */}
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" component="h2">
                Contact Information
              </Typography>
              <Typography variant="body1">Mobile: {donorData.mobile}</Typography>
              <Typography variant="body1">E-mail: {donorData.email}</Typography>
              {/* Add more fields as needed */}
            </Paper>
          </Grid>

          {/* Add more Grid items for other sections as needed */}
        </Grid>
      </Box>
    );
  };

  return (
    <div className="main-container">
      <Box sx={{ marginTop: 1 }}>
        <PatientInfo />
      </Box>

      <TreatmentCyclesTable />

      <Box mt={2} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} visibleScrollbar variant='scrollable' onChange={handleChange} aria-label="medical-records-tabs">
          <Tab label="Medical Records" {...a11yProps(0)} />
          <Tab label="Physical Characteristics" {...a11yProps(1)} />
          <Tab label="Donor Characteristics" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {renderMedicalRecords()}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {renderPhysicalCharactertistics()}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {renderDonorCharactertistics()}
      </CustomTabPanel>
    </div>
  )
}

export default MedicalRecords