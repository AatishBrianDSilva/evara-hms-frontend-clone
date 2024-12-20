import {
  Add,
  Edit,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  SwapHoriz,
} from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import React, { useState } from 'react';
import AddPartner from './AddPartner';
import TabPanel from '../../../components/Utils/TabPanel';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useLocation, useNavigate } from 'react-router-dom';
import EditPatient from './EditPatient';
import { useGetdonorQuery } from '../../../services/donorApi';
import { useAssignCaseToDonorMutation } from '../../../services/donorApi';
import { useToast } from '../../../context/ToastContext';
import FieldAutocomplete from '../../../components/FieldAutoComplete/FieldAutoComplete';
import { IDonor } from '../../../types/donor';

interface DonorsResponse {
  data: {
    records: IDonor[];
  };
}

interface DonorData {
  donorId: string;
}

const PatientDetails: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { showPromiseToast } = useToast();

  const {
    patient,
    partner,
    case: patientCase,
  } = useSelector((state: RootState) => state.patients);

  // const defaultSelectedDonorId = "defaultDonorId";
  const [selectedDonorId, setSelectedDonorId] = useState<DonorData | undefined>(
    patientCase?.donorId ? { donorId: patientCase?.donorId } : undefined,
  );

  const [showPatientsTab, setShowPatientsTab] = useState(false);
  const [detailsTabValue, setDetailsTabValue] = useState(0);
  const [openAddPartnerModal, setOpenAddPartnerModal] = useState(false);
  const [openEditPatientModal, setOpenEditPatientModal] = useState(false);

  const { data: donors = { data: { records: [] } } } = useGetdonorQuery({
    filters: {
      isActive: true,
      isAdmin: false || true,
    },
  });

  // const donorsData = (donors as DonorsResponse)?.data?.records || [];

  const [assignCaseToDonorMutation] = useAssignCaseToDonorMutation();

  const handleAssignDonor = async (selectedDonorId: any) => {
    // console.log("Assigning donor with ID:", selectedDonorId.donorId);
    // console.log("To case with ID:", patientCase?.caseId);

    const payload = {
      id: selectedDonorId.donorId,
      donorId: selectedDonorId.donorId,
      caseId: patientCase?.caseId || '',
    };

    // Log the payload
    // console.log("Payload to be submitted:", payload);

    const promise = assignCaseToDonorMutation(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Assigning donor...',
      success: () => 'Donor assigned successfully',
      error: data => data || 'Error assigning donor to case',
    });

    try {
      const response = await promise;
      console.log(response);
      navigate(0);
    } catch (error) {
      console.error('Error assigning donor to case', error);
    }
  };

  const handleSwap = () => {
    if (!partner) return;
    const path = location.pathname.split('/');
    const dynamicPath = path.slice(3, path.length).join('/');
    navigate(`/patient/${partner.patientId}/${dynamicPath}`);
  };

  const toggleShowPatientsTab = () => {
    setShowPatientsTab(!showPatientsTab);
  };

  const handleAddPartner = () => {
    setOpenAddPartnerModal(true);
  };

  const handleEditPartner = () => {
    setOpenEditPatientModal(true);
  };

  const handleDetailsTabChange = (
    _: React.SyntheticEvent,
    newValue: number,
  ) => {
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
    height: '100px',
  };

  if (!patient) return null;

  const renderPatientInfo = () => (
    <Box height={160}>
      <Grid container spacing={2}>
        {/* Column 1: Patient Image */}
        <Grid
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          item
          xs={3}
        >
          <Avatar
            alt="Patient Image"
            src={patient.image}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: theme.palette.secondary.light,
            }}
          />
        </Grid>

        {/* Column 2: Basic Information */}
        <Grid item xs={3}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            <strong>Name:</strong> {patient.firstName} {patient.lastName}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            <strong>Phone:</strong> {patient.mobile}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            <strong>Occupation:</strong> {patient.occupation}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            <strong>Address:</strong> {patient.addressLine1}
            {'\n'}
            {patient.addressLine2}{' '}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            <strong>City:</strong> {patient.city}
          </Typography>
        </Grid>

        {/* Column 3: Demographic Information */}
        <Grid item xs={3}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            <strong>DOB:</strong> {new Date(patient.dob).toLocaleDateString()}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            <strong>Gender:</strong> {patient.gender}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            <strong>Marital Status:</strong> {patient.maritalStatus}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            <strong>Mother Tongue:</strong> {patient.motherTounge}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            <strong>Insurance:</strong> {patient.insuranceSponsorName}
          </Typography>
        </Grid>

        {/* Column 4: Source Information */}
        <Grid item xs={3} style={{ position: 'relative' }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            <strong>Marketing Source:</strong> {patient.marketingSource}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            <strong>Referrer:</strong> {patient.referredBy}
          </Typography>
          <Tooltip title="Edit Patient">
            <IconButton
              color="secondary"
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={handleEditPartner}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );

  const renderDonorInfo = () => {
    if (!patientCase?.donorId) {
      return (
        <Box
          height={160}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={20}
        >
          <Grid item xs={12} sm={10} lg={10}>
            <FieldAutocomplete
              label="Donor"
              options={donors.data?.records || []}
              isOptionEqualToValue={(option, value) =>
                option.donorId === value.donorId
              }
              getOptionLabel={option =>
                `${option.firstName} ${option.lastName}`
              }
              value={selectedDonorId}
              onChange={value => setSelectedDonorId(value?.donorId || '')}
            />
          </Grid>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleAssignDonor(selectedDonorId)}
          >
            Add Donor
          </Button>
        </Box>
      );
    }
    return (
      <Box height={160}>
        <Grid container spacing={2}>
          {/* Column 1: Patient Image */}
          <Grid
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            item
            xs={3}
          >
            <Avatar
              alt="Patient Image"
              src={patient?.donor.image}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '2px solid',
                borderColor: theme.palette.secondary.light,
              }}
            />
          </Grid>

          {/* Column 2: Basic Information */}
          <Grid item xs={3}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
            >
              <strong>Name:</strong>{' '}
              {patient?.donor.firstName + ' ' + patient.donor.lastName}{' '}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
            >
              <strong>Age:</strong> {patient?.donor.age}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
            >
              <strong>DOB:</strong> {patient?.donor.dob}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
            >
              <strong>Gender:</strong> {patient?.donor.gender}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        gap={2}
      >
        {/* Card 1 */}
        <Box sx={{ ...cardStyle }}>
          {/* First Column for Images */}
          <Box position={'relative'}>
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
                    color="secondary"
                  />
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
                  color="secondary"
                >
                  <SwapHoriz
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: 'secondary.main',
                    }}
                    fontSize="small"
                    color="secondary"
                  />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Second Column for Text */}
          <Box display={'flex'} flexDirection={'column'}>
            <Typography component="div" variant="subtitle1">
              {`${patient?.firstName} ${patient?.lastName}`}
            </Typography>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
            >
              <strong>Age: </strong>
              {patient?.age}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
            >
              <strong>City:</strong> {patient?.city}
            </Typography>
          </Box>

          {/* Third Column for Expand Icon Button */}
          <Box>
            <IconButton onClick={toggleShowPatientsTab}>
              {!showPatientsTab ? (
                <ExpandMoreOutlined fontSize="medium" color="secondary" />
              ) : (
                <ExpandLessOutlined fontSize="medium" color="secondary" />
              )}
            </IconButton>
          </Box>
        </Box>
        {/* Card 2 */}
        <Box sx={{ ...cardStyle }}>
          {/* First Column for Images */}
          <Box display={'flex'} flexDirection={'column'}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  component="div"
                >
                  <strong>Upcoming Appointment:</strong>{' '}
                  {patient.appointment?.upcomingAppointment || 'NA'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  component="div"
                >
                  <strong>Last Appointment:</strong>{' '}
                  {patient.appointment?.lastAppointment || 'NA'}
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
              <Typography
                variant="subtitle2"
                color="text.secondary"
                component="div"
              >
                <strong>Case ID:</strong> {patientCase?.caseId}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                component="div"
              >
                <strong>Patient ID:</strong> {patient?.patientId}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                component="div"
              >
                <strong>Reg. Date:</strong>{' '}
                {new Date(patient?.createdAt).toLocaleDateString()}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                component="div"
              >
                <strong>Source:</strong> {patient?.marketingSource}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Detials More Details Section */}
      <Collapse in={showPatientsTab} timeout="auto" unmountOnExit>
        <Box
          mt={2}
          border={`1px solid ${theme.palette.secondary.light}`}
          borderRadius={'4px'}
        >
          <AppBar position="static" color="transparent">
            <Tabs
              value={detailsTabValue}
              onChange={handleDetailsTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="fullWidth"
              aria-label="Patient Details Tabs"
            >
              <Tab label="Patient" id="patient-detials-tabpanel-0" />
              <Tab label="Donor" id="patient-detials-tabpanel-1" />
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
      <AddPartner
        openAddPartnerModal={openAddPartnerModal}
        onClose={setOpenAddPartnerModal}
      />

      <EditPatient
        openEditPatientModal={openEditPatientModal}
        onClose={setOpenEditPatientModal}
      />
    </>
  );
};

export default PatientDetails;
