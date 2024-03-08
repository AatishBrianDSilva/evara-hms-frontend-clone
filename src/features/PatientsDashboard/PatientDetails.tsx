import { Add, Edit, ExpandLessOutlined, ExpandMoreOutlined, SwapHoriz } from '@mui/icons-material'
import { AppBar, Avatar, Box, Button, Collapse, Grid, IconButton, MenuItem, Tab, Tabs, TextField, Tooltip, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import AddPartner from './AddPartner';
import TabPanel from '../../components/Utils/TabPanel';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import EditPatient from './EditPatient';

const PatientDetails: React.FC = () => {

  const theme = useTheme();
  const navigate = useNavigate()

  const { patient, partner, case: patientCase } = useSelector((state: RootState) => state.patients)

  const [showPatientsTab, setShowPatientsTab] = useState(false);
  const [detailsTabValue, setDetailsTabValue] = useState(0);
  const [openAddPartnerModal, setOpenAddPartnerModal] = useState(false);
  const [openEditPatientModal, setOpenEditPatientModal] = useState(false);

  const handleSwap = () => {
    if (!partner) return
    navigate(`/patients/${partner.patientId}`)
  }

  const toggleShowPatientsTab = () => {
    setShowPatientsTab(!showPatientsTab);
  }

  const handleAddPartner = () => {
    setOpenAddPartnerModal(true);
  };

  const handleEditPartner = () => {
    setOpenEditPatientModal(true);
  };

  const handleDetailsTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setDetailsTabValue(newValue);
  };

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


  if (!patient) return null


  const renderPatientInfo = () => (
    <Box height={160}>
      <Grid container spacing={2}>
        {/* Column 1: Patient Image */}
        <Grid display={"flex"} justifyContent={"center"} alignItems={"center"} item xs={3}>
          <Avatar
            alt="Patient Image"
            src={patient.image}
            style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid', borderColor: theme.palette.secondary.light }}
          />
        </Grid>

        {/* Column 2: Basic Information */}
        <Grid item xs={3}>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Name:</strong> {patient.firstName} {patient.lastName}</Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Phone:</strong> {patient.mobile}</Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Occupation:</strong> {patient.occupation}</Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Address:</strong> {patient.addressLine1}{"\n"}{patient.addressLine2} </Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>City:</strong> {patient.city}</Typography>
        </Grid>

        {/* Column 3: Demographic Information */}
        <Grid item xs={3}>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>DOB:</strong> {new Date(patient.dob).toLocaleDateString()}</Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Gender:</strong> {patient.gender}</Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Marital Status:</strong> {patient.maritalStatus}</Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Mother Tongue:</strong> {patient.motherTounge}</Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Insurance:</strong> {patient.insuranceSponsorName}</Typography>
        </Grid>

        {/* Column 4: Source Information */}
        <Grid item xs={3} style={{ position: 'relative' }}>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Marketing Source:</strong> {patient.marketingSource}</Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Referrer:</strong> {patient.referredBy}</Typography>
          <Tooltip title="Edit Patient">
            <IconButton color='secondary' style={{ position: 'absolute', top: 0, right: 0 }} onClick={handleEditPartner}>
              <Edit fontSize='small' />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  )

  const renderDonorInfo = () => {
    if (!patient.donor) {
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
            src={patient?.donor.image}
            style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid', borderColor: theme.palette.secondary.light }}
          />
        </Grid>

        {/* Column 2: Basic Information */}
        <Grid item xs={3}>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Name:</strong> {patient?.donor.name}</Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Age:</strong> {patient?.donor.age}</Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>DOB:</strong> {patient?.donor.dob}</Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div"><strong>Gender:</strong> {patient?.donor.gender}</Typography>
        </Grid>
      </Grid>
    </Box>)
  }


  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={2}>
        {/* Card 1 */}
        <Box sx={{ ...cardStyle }}>
          {/* First Column for Images */}
          <Box position={"relative"}>
            {partner && (
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  position: 'absolute',
                  border: '1px solid',
                  borderColor: 'secondary.light',
                  right: '-44px',
                  bottom: '5px',
                  zIndex: 1,
                }}
                src={partner?.image}
                alt={`${partner?.firstName} profile`}
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
              src={patient?.image}
              alt={`${patient?.firstName} profile`}
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
            <Typography component="div" variant="subtitle1">
              {`${patient?.firstName} ${patient?.lastName}`}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" component="div">
              <strong>Age: </strong>{patient?.age}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" component="div">
              <strong>City:</strong> {patient?.city}
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
        <Box sx={{ ...cardStyle }}>
          {/* First Column for Images */}
          <Box display={"flex"} flexDirection={"column"}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" component="div">
                  <strong>Upcoming Appointment:</strong> {patient.appointment?.upcomingAppointment || "NA"}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" component="div">
                  <strong>Last Appointment:</strong> {patient.appointment?.lastAppointment || "NA"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* Card 3 */}
        <Box sx={{ ...cardStyle }}>
          {/* First Column for Images */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" component="div">
                <strong>Case ID:</strong> {patientCase?.caseId}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" component="div">
                <strong>Patient ID:</strong> {patient?.patientId}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" component="div">
                <strong>Reg. Date:</strong> {new Date(patient?.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" component="div">
                <strong>Source:</strong> {patient?.marketingSource}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Detials More Details Section */}
      <Collapse in={showPatientsTab} timeout="auto" unmountOnExit>
        <Box mt={2} border={`1px solid ${theme.palette.secondary.light}`} borderRadius={"4px"}>
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

      {/* Add Partner Modal */}
      <AddPartner openAddPartnerModal={openAddPartnerModal} onClose={setOpenAddPartnerModal} />

      <EditPatient openEditPatientModal={openEditPatientModal} onClose={setOpenEditPatientModal} />
    </>

  )
}

export default PatientDetails