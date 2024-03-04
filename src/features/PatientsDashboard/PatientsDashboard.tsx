import { AppBar, Avatar, Box, Button, Collapse, Grid, IconButton, MenuItem, Paper, Step, StepContent, StepLabel, Stepper, Tab, Tabs, TextField, Tooltip, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import ContentSection from '../../components/ContentSection/ContentSection';
import { AcUnit, Add, Edit, ExpandLessOutlined, ExpandMoreOutlined, Healing, HomeRepairService, Loop, Moving, PrecisionManufacturing, Receipt, Restore, Science, Summarize, SwapHoriz, TextSnippet } from '@mui/icons-material';
import { CalendarIcon, DatePicker } from '@mui/x-date-pickers';
import { FileUploadAndPreview } from '../../components/FileUploadAndPreview/FileUploadAndPreview';
// import { setSelectedPatientId } from '../Patients/patientsSlice';
// import { useDispatch } from 'react-redux';

// Dummy data defined within the same file for demonstration
interface Profile {
  patientId: string;
  caseId: string;
  name: string;
  age: number;
  city: string;
  image: string;
  phone: string;
  occupation: string;
  address: string;
  dob: string; // Date of Birth
  gender: string;
  maritalStatus: string;
  motherTongue: string;
  insurance: string;
  marketingSource: string;
  referrer: string;
  upcomingAppointment?: string;
  lastAppointment?: string;
  createdAt: string;
  donor?: Profile
}

// Define the donor profile
const donor: Profile = {
  patientId: "RH-003",
  caseId: "RH-CASE-123",
  name: "Chris Taylor",
  age: 35,
  city: "Los Angeles",
  image: "https://source.unsplash.com/1600x900/?person",
  phone: "555-123-4567",
  occupation: "Entrepreneur",
  address: "789 West Street, Suite 10",
  dob: "1988-03-15",
  gender: "Male",
  maritalStatus: "Married",
  motherTongue: "English",
  insurance: "GlobalCare",
  marketingSource: "Health Fair",
  referrer: "Community Clinic",
  upcomingAppointment: "2024-04-20",
  lastAppointment: "2024-02-15",
  createdAt: "2023-01-01",
};

const patient: Profile = {
  patientId: "RH-001",
  caseId: "RH-CASE-123",
  name: "Alex Smith",
  age: 29,
  city: "New York",
  image: "https://source.unsplash.com/1600x900/?man",
  phone: "123-456-7890",
  occupation: "Software Developer",
  address: "123 Main St, Apartment 4B",
  dob: "1994-05-22",
  gender: "Male",
  maritalStatus: "Single",
  motherTongue: "English",
  insurance: "HealthPlus",
  marketingSource: "Online Ad",
  referrer: "Dr. John Doe",
  upcomingAppointment: "12th Dec 2021",
  lastAppointment: "12th Nov 2021",
  createdAt: "12th Nov 2021",
  donor: donor
};

const partner: Profile = {
  patientId: "RH-002",
  caseId: "RH-CASE-123", // Shared case ID with patient
  name: "Jamie Doe",
  age: 27,
  city: "New York",
  image: "https://source.unsplash.com/1600x900/?woman",
  phone: "987-654-3210",
  occupation: "Graphic Designer",
  address: "456 Side St, Suite 8A",
  dob: "1996-08-15",
  gender: "Female",
  maritalStatus: "Married",
  motherTongue: "Spanish",
  insurance: "MediCare",
  marketingSource: "Friend Referral",
  referrer: "Alex Smith",
  upcomingAppointment: "12th Dec 2021",
  lastAppointment: "",
  createdAt: "12th Nov 2021",
  // donor: donor
};


interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
  id: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, id, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${id}-tabpanel-${index}`}
      aria-labelledby={`${id}-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}


const PatientsDashboard: React.FC = () => {
  // const dispatch = useDispatch();
  const theme = useTheme();
  const [isSwapped, setIsSwapped] = useState(false);
  const [detailsTabValue, setDetailsTabValue] = useState(0);
  const [patientMainTabValue, setPatientMainTabValue] = useState(0);
  const [patientSecondaryTabValue, setPatientSecondaryTabValue] = useState(0);
  const [showPatientsTab, setShowPatientsTab] = useState(false);

  const handleAddPartner = () => {
    console.log("Add Partner Modal Open");
  };

  const handleSwap = () => {
    setIsSwapped(!isSwapped); // Toggle the swapped state
  };

  const handleDetailsTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setDetailsTabValue(newValue);
  };

  const handleMainTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setPatientMainTabValue(newValue);
  };
  const handleSecondaryTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setPatientSecondaryTabValue(newValue);
  };

  const toggleShowPatientsTab = () => {
    setShowPatientsTab(!showPatientsTab);
  }

  // Determine which profile to show based on isSwapped state
  const primaryProfile: Profile = isSwapped && partner ? partner : patient;
  const secondaryProfile: Profile | undefined = isSwapped && partner ? patient : partner;

  const cardStyle = {
    display: 'flex', // Use flex to layout children
    flex: 1,
    justifyContent: 'space-between', // This centers the contents
    alignItems: 'center', // Align items vertically
    elevation: 1,
    border: `1px solid ${theme.palette.secondary.light}`, // Optional: if you want to maintain the card-like appearance
    position: 'relative', // For positioning context
    p: 2, // Padding on the x-axis
    borderRadius: '4px', // Optional: if you want to maintain the card-like appearance
    height: '100px'
  }

  const renderPatientInfo = () => (
    <Box height={160}>
      <Grid container spacing={2}>
        {/* Column 1: Patient Image */}
        <Grid display={"flex"} justifyContent={"center"} alignItems={"center"} item xs={3}>
          <Avatar
            alt="Patient Image"
            src={primaryProfile.image}
            style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid', borderColor: theme.palette.secondary.light }}
          />
        </Grid>

        {/* Column 2: Basic Information */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Name:</strong> {primaryProfile.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Phone:</strong> {primaryProfile.phone}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Occupation:</strong> {primaryProfile.occupation}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Address:</strong> {primaryProfile.address}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>City:</strong> {primaryProfile.city}</Typography>
        </Grid>

        {/* Column 3: Demographic Information */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>DOB:</strong> {primaryProfile.dob}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Gender:</strong> {primaryProfile.gender}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Marital Status:</strong> {primaryProfile.maritalStatus}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Mother Tongue:</strong> {primaryProfile.motherTongue}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Insurance:</strong> {primaryProfile.insurance}</Typography>
        </Grid>

        {/* Column 4: Source Information */}
        <Grid item xs={3} style={{ position: 'relative' }}>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Marketing Source:</strong> {primaryProfile.marketingSource}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Referrer:</strong> {primaryProfile.referrer}</Typography>
          <Tooltip title="Edit Patient">
            <IconButton color='secondary' style={{ position: 'absolute', top: 0, right: 0 }}>
              <Edit fontSize='small' />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  )

  const renderDonorInfo = () => {
    if (!primaryProfile.donor) {
      return (
        <Box height={160} display={"flex"} justifyContent={"center"} alignItems={"center"} gap={20}>
          <TextField
            select
            label="Donor"
            color='primary'
            variant="outlined"
            sx={{ width: 200 }}
          >
            <MenuItem>Donor 1</MenuItem>
            <MenuItem>Donor 2</MenuItem>
            <MenuItem>Donor 3</MenuItem>
            <MenuItem>Donor 4</MenuItem>
          </TextField>
          <Button variant="contained" color="secondary">Add Donor</Button>
        </Box >
      )
    }
    return (<Box height={160}>
      <Grid container spacing={2}>
        {/* Column 1: Patient Image */}
        <Grid display={"flex"} justifyContent={"center"} alignItems={"center"} item xs={3}>
          <Avatar
            alt="Patient Image"
            src={primaryProfile?.donor.image}
            style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid', borderColor: theme.palette.secondary.light }}
          />
        </Grid>

        {/* Column 2: Basic Information */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Name:</strong> {primaryProfile?.donor.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Phone:</strong> {primaryProfile?.donor.phone}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Occupation:</strong> {primaryProfile?.donor.occupation}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Address:</strong> {primaryProfile?.donor.address}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>City:</strong> {primaryProfile?.donor.city}</Typography>
        </Grid>

        {/* Column 3: Demographic Information */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>DOB:</strong> {primaryProfile?.donor.dob}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Gender:</strong> {primaryProfile?.donor.gender}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Marital Status:</strong> {primaryProfile?.donor.maritalStatus}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Mother Tongue:</strong> {primaryProfile?.donor.motherTongue}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Insurance:</strong> {primaryProfile?.donor.insurance}</Typography>
        </Grid>

        {/* Column 4: Source Information */}
        <Grid item xs={3} style={{ position: 'relative' }}>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Marketing Source:</strong> {primaryProfile?.donor.marketingSource}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div"><strong>Referrer:</strong> {primaryProfile?.donor.referrer}</Typography>
          <Tooltip title="Edit Donor">
            <IconButton color='secondary' style={{ position: 'absolute', top: 0, right: 0 }}>
              <Edit fontSize='small' />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>)
  }

  const renderJourney = () => {
    return (
      <Box>
        <Box>
          <Tabs
            centered
            value={patientSecondaryTabValue}
            onChange={handleSecondaryTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            aria-label="Patient Secondary Tabs"
          >
            <Tab icon={<Science fontSize='small' />} iconPosition='top' label="Investigations" id='patient-secondary-tabpanel-0' />
            <Tab icon={<PrecisionManufacturing fontSize='small' />} iconPosition='top' label="Procedure" id='patient-secondary-tabpanel-1' />
            <Tab icon={<AcUnit fontSize='small' />} iconPosition='top' label="Cryo Preservation" id='patient-secondary-tabpanel-2' />
            <Tab icon={<HomeRepairService fontSize='small' />} iconPosition='top' label="Services" id='patient-secondary-tabpanel-3' />
            <Tab icon={<Loop fontSize='small' />} iconPosition='top' label="Cycle" id='patient-secondary-tabpanel-4' />
          </Tabs>
        </Box>

        <Box
          p={2}
          mt={2}
        >
          <TabPanel id="patient-secondary" value={patientSecondaryTabValue} index={0}>
            <Box>
              <Typography variant="h6" color="text.secondary" component="div">
                Investigations
              </Typography>
            </Box>
          </TabPanel>
          <TabPanel id="patient-secondary" value={patientSecondaryTabValue} index={1}>
            <Box>
              <Typography variant="h6" color="text.secondary" component="div">
                Procedure
              </Typography>
            </Box>
          </TabPanel>
          <TabPanel id="patient-secondary" value={patientSecondaryTabValue} index={2}>
            <Box>
              <Typography variant="h6" color="text.secondary" component="div">
                Cryo Preservation
              </Typography>
            </Box>
          </TabPanel>
          <TabPanel id="patient-secondary" value={patientSecondaryTabValue} index={3}>
            <Box>
              <Typography variant="h6" color="text.secondary" component="div">
                Services
              </Typography>
            </Box>
          </TabPanel>
          <TabPanel id="patient-secondary" value={patientSecondaryTabValue} index={4}>
            <Box>
              <Typography variant="h6" color="text.secondary" component="div">
                Cycle
              </Typography>
            </Box>
          </TabPanel>
        </Box>
      </Box>
    )
  }

  const renderNotes = () => {
    return (
      <Box>
        <Typography variant="h6" color="text.secondary" component="div">
          Patient Notes
        </Typography>
      </Box>
    )
  }

  const renderHistory = () => {

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
      setActiveStep(0);
    };

    return (
      <Box>
        <Box mt={2} boxShadow={2} p={2} borderRadius={2} height={'200px'}>
          <Typography color={"secondary"} variant='button'>Synopsis</Typography>
        </Box>

        <Box padding={2} mt={2}>
          <Stepper activeStep={activeStep} orientation='vertical'>
            <Step key={0}>
              <StepLabel sx={{ color: 'red' }} >Medical History</StepLabel>
              <StepContent sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Married Life" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Infertility" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Duration of Infertility" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Consanguineous Marriage" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Contraception" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="No. Of Pregnancies" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Previous Infertilty Treatments" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Notes" multiline fullWidth />
                  </Grid>
                </Grid>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      size='small'
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Continue
                    </Button>
                    <Button
                      disabled={true}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step key={1}>
              <StepLabel>Menstrual and Ovulation History</StepLabel>
              <StepContent sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={2}>
                    <DatePicker label="LMP Date" sx={{ width: '100%' }} />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Age at Menarche" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Menstrual Regularity" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Menstrual Bleeding" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Longest Cycle Duration" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Shortest Cycle Duration" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Period Duration" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="IMB" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="PCB" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Dyspareunia" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Discharge PV" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Passage of Clots" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Galactorrhoea" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Hirsutism" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Visual Disturbances" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Dysmenorrhoea" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Weight Gain Loss" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Urinary / Bowel Problems" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Notes" multiline fullWidth />
                  </Grid>
                </Grid>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      size='small'
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Continue
                    </Button>
                    <Button
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step key={2}>
              <StepLabel>Coital History</StepLabel>
              <StepContent sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Frequency Coitus" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Fertile Period Knowledge" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Notes" multiline fullWidth />
                  </Grid>
                </Grid>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      size='small'
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Continue
                    </Button>
                    <Button
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step key={3}>
              <StepLabel>History of disease with a possible adverse effect on Ferility</StepLabel>
              <StepContent sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Diabetes" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Thyroid Disease" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Tuberculosis" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Other Diseases" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Notes" multiline fullWidth />
                  </Grid>
                </Grid>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      size='small'
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Continue
                    </Button>
                    <Button
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step key={4}>
              <StepLabel>Other factors with a possible adverse effect on Fertility</StepLabel>
              <StepContent sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Environmental Effects" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Smoking" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Alcohol" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="HIV Risk Factors" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Previous Medical Treatments" multiline fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Allergies" multiline fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Surgical History" multiline fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Family History" multiline fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Notes" multiline fullWidth />
                  </Grid>
                </Grid>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      size='small'
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Continue
                    </Button>
                    <Button
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step key={5}>
              <StepLabel>General Physical Examination</StepLabel>
              <StepContent sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Height" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Weight" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField disabled label="BMI" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="BP" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Chest" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="CVS" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="I/P/E" multiline fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="I/P/E 2" multiline fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField label="Hair Distribution Score" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="General Examination" multiline fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Breast Development" multiline fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Galactorrhoea" multiline fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Breast Lumps" multiline fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Lymph Nodes" multiline fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Pelvic Examination" multiline fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Notes" multiline fullWidth />
                  </Grid>
                </Grid>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      size='small'
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Continue
                    </Button>
                    <Button
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step key={6}>
              <StepLabel>Investigations</StepLabel>
              <StepContent sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>CBP (Complete Blood Picture)</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Estradiol (E2)</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>HCV (Hepatitis C)</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>HIV I & II (Elisa)</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>HbsAg (CMIA)</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Random Blood Sugar (RBS)</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>TSH (Thyroid Stimulating Hormone)</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>VDRL STS Test</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Prolactin</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Sperm DNA Assessment	</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Blood Group & RH Typing</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>ESR</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Rubella IgG	</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>FSH</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>LH</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Pap Smear</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Progesterone</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>AMH</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Karyotyping Chromosomal Analysis Couple	</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>CA 125</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Vitamin D</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Histopathology Small (Endomen Tissue)</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>TB PCR</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Bacterial Viginosis</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} gap={2}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                      <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>LH (IVF Package)</Typography>
                      <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                      <TextField label="Result" fullWidth />
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      size='small'
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Continue
                    </Button>
                    <Button
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step key={7}>
              <StepLabel>Summary</StepLabel>
              <StepContent sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Impression" multiline minRows={2} fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Treatment Plan" multiline minRows={2} fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField label="Summary" multiline minRows={2} fullWidth />
                  </Grid>
                </Grid>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      size='small'
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Sumbit
                    </Button>
                    <Button
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
          {activeStep === 8 && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>Medical History Taken</Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Reset
              </Button>
            </Paper>
          )}
        </Box>

        <Box padding={2}>
          <Typography variant='body1'>Upload Medical Documents</Typography>
          <Box mt={2}>
            <FileUploadAndPreview handleUpload={() => { }} />
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <ContentSection title="Patient Dashboard">
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={2}>
        {/* Card 1 */}
        <Box boxShadow={5} sx={{ ...cardStyle }}>
          {/* First Column for Images */}
          <Box position={"relative"}>
            {secondaryProfile && (
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  position: 'absolute',
                  border: '1px solid',
                  borderColor: 'secondary.light',
                  right: '-28px',
                  bottom: '5px',
                  zIndex: 1,
                }}
                src={secondaryProfile.image}
                alt={`${secondaryProfile.name} profile`}
              />
            )}
            <Avatar
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: 'secondary.light',
                position: 'relative',
                zIndex: 2,
              }}
              src={primaryProfile.image}
              alt={`${primaryProfile.name} profile`}
            />
            {!partner ? (
              <Tooltip title="Add Partner">
                <IconButton
                  onClick={handleAddPartner}
                  sx={{
                    position: 'absolute',
                    right: -8,
                    bottom: -8,
                    backgroundColor: 'transparent',
                    zIndex: 3,
                  }}
                >
                  <Add
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: 'secondary.main',
                    }}
                    fontSize="small"
                    color="secondary" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Swap Patient">
                <IconButton
                  onClick={handleSwap}
                  sx={{
                    position: 'absolute',
                    right: -8,
                    bottom: -8,
                    backgroundColor: 'transparent',
                    zIndex: 3,
                  }}
                  color='secondary'
                >
                  <SwapHoriz
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: 'secondary.main',
                    }}
                    fontSize="small"
                    color="secondary" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Second Column for Text */}
          <Box display={"flex"} flexDirection={"column"}>
            <Typography component="div" variant="h5">
              {primaryProfile.name}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" component="div">
              <strong>Age: </strong>{primaryProfile.age}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              <strong>City:</strong> {primaryProfile.city}
            </Typography>
          </Box>

          {/* Third Column for Expand Icon Button */}
          <Box >
            <IconButton onClick={toggleShowPatientsTab}>
              {!showPatientsTab ? <ExpandMoreOutlined fontSize="medium" color="secondary" /> : <ExpandLessOutlined fontSize="medium" color="secondary" />}
            </IconButton>
          </Box>
        </Box>
        {/* Card 2 */}
        <Box boxShadow={5} sx={{ ...cardStyle }}>
          {/* First Column for Images */}
          <Box display={"flex"} flexDirection={"column"}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  <strong>Upcoming Appointment:</strong> {primaryProfile.upcomingAppointment}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  <strong>Last Appointment:</strong> {primaryProfile.lastAppointment ? primaryProfile.lastAppointment : "NA"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* Card 3 */}
        <Box boxShadow={5} sx={{ ...cardStyle }}>
          {/* First Column for Images */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                <strong>Case ID:</strong> {primaryProfile.caseId}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                <strong>Patient ID:</strong> {primaryProfile.patientId}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                <strong>Reg. Date:</strong> {primaryProfile.createdAt}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                <strong>Source:</strong> {primaryProfile.marketingSource}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* Detials Tab Section */}
      <Collapse in={showPatientsTab} timeout="auto" unmountOnExit>
        <Box boxShadow={5} mt={2} border={`1px solid ${theme.palette.secondary.light}`} borderRadius={"4px"}>
          <AppBar position="static" color='transparent'>
            <Tabs
              value={detailsTabValue}
              onChange={handleDetailsTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="fullWidth"
              aria-label="Patient Details Tabs"
            >
              <Tab label="Patient" id='patient-detials-tabpanel-0' />
              <Tab label="Donor" id='patient-detials-tabpanel-1' />
            </Tabs>
          </AppBar>
          <Box p={2}>
            <TabPanel id="patient-detials" value={detailsTabValue} index={0}>
              {renderPatientInfo()}
            </TabPanel>
            <TabPanel id="patient-detials" value={detailsTabValue} index={1}>
              {renderDonorInfo()}
            </TabPanel>
          </Box>
        </Box>
      </Collapse>
      {/* Main Tab Section */}
      <Box boxShadow={5} mt={2} border={`1px solid ${theme.palette.secondary.light}`} borderRadius={1}>
        <Tabs
          centered
          value={patientMainTabValue}
          onChange={handleMainTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          aria-label="Patient Main Tabs"
          sx={{ boxShadow: 3 }}
        >
          <Tab icon={<Moving fontSize='small' />} iconPosition='start' label="Journey" id='patient-main-tabpanel-0' />
          <Tab icon={<TextSnippet fontSize='small' />} iconPosition='start' label="Notes" id='patient-main-tabpanel-1' />
          <Tab icon={<Restore fontSize='small' />} iconPosition='start' label="History" id='patient-main-tabpanel-2' />
          <Tab icon={<CalendarIcon fontSize='small' />} iconPosition='start' label="Appointment" id='patient-main-tabpanel-3' />
          <Tab icon={<Healing fontSize='small' />} iconPosition='start' label="Pharmacy" id='patient-main-tabpanel-4' />
          <Tab icon={<Summarize fontSize='small' />} iconPosition='start' label="Report" id='patient-main-tabpanel-5' />
          <Tab icon={<Receipt fontSize='small' />} iconPosition='start' label="Billings" id='patient-main-tabpanel-6' />
        </Tabs>
      </Box>

      <Box
        p={2}
        mt={2}
        borderRadius={1}
        boxShadow={20}
        border={`1px solid ${theme.palette.secondary.light}`}
        minHeight={260}
      >
        <TabPanel id="patient-main" value={patientMainTabValue} index={0}>
          {renderJourney()}
        </TabPanel>
        <TabPanel id="patient-main" value={patientMainTabValue} index={1}>
          {renderNotes()}
        </TabPanel>
        <TabPanel id="patient-main" value={patientMainTabValue} index={2}>
          {renderHistory()}
        </TabPanel>

        {/* Additional TabPanels if necessary */}
      </Box>
    </ContentSection>
  )
}

export default PatientsDashboard