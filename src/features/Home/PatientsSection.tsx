import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ArrowForward, AssignmentLate } from '@mui/icons-material';
import PatientSummaryCard from '../../components/PatientSummaryCard/PatientSummaryCard';
import SkeletonPatientSummaryCard from '../../components/PatientSummaryCard/Skeleton';
import { IconButton } from '@mui/material';
import PatientCard from '../../components/PatientCard/PatientCard';
import { calculateAge } from '../../utils/calculateAge';
import SkeletonPatientCard from '../../components/PatientCard/Skeleton';
import { useGetPatientSummaryQuery } from '../../services/homeApi';

interface PatientsSectionProps {
  startDate: Date | null;
  endDate: Date | null;
}

const PatientsSection: React.FC<PatientsSectionProps> = ({
  startDate,
  endDate,
}) => {
  // Fetch patients for the selected date range
  const {
    data: patientsData,
    isLoading: isPatientLoading,
    isFetching: isPatientFetching,
  } = useGetPatientSummaryQuery(
    {
      dateRange: {
        startDate: startDate?.toISOString() || '',
        endDate: endDate?.toISOString() || '',
      },
    },
    {
      skip: !startDate || !endDate,
    },
  );

  const patientSummary = patientsData?.data;
  const loading = isPatientLoading || isPatientFetching;

  const handleArrowClick = () => {
    window.location.href = '/patients';
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      overflow={'hidden'}
      width="100%"
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Patients
        </Typography>
      </Box>

      <Box
        display="flex"
        width="100%"
        height="358px" // Total height including the heading and content
        justifyContent={'space-between'}
        gap={2}
      >
        {/* First part: Patient Summary (30% width) */}
        <Box
          width="31%"
          minWidth="200px"
          display="flex"
          flexDirection="column"
          border="1px solid"
          borderColor="#D8D8D8"
          borderRadius={4}
          bgcolor="#FFFFFF"
        >
          {loading ? (
            <SkeletonPatientSummaryCard />
          ) : (
            <PatientSummaryCard
              newPatients={patientSummary?.patientCount || 0}
              newDonors={patientSummary?.donorsCount || 0}
            />
          )}
        </Box>

        {/* Second part: New Patients (65% width) */}
        <Box
          width="68%"
          display="flex"
          flexDirection="column"
          border="1px solid"
          borderColor="#D8D8D8"
          borderRadius={4} // General border radius
          overflow="hidden" // Ensures the header stays contained
        >
          {/* Header Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            height="72px"
            bgcolor="#FFEDE2" // Header background color
            px={2} // No padding in the header
          >
            {/* Title with Arrow */}
            <Typography variant="h6">New Patients</Typography>
            <IconButton size="small" color="inherit" onClick={handleArrowClick}>
              <ArrowForward fontSize="small" />
            </IconButton>
          </Box>

          <Box
            display="flex"
            flex={1}
            overflow="auto"
            flexWrap="wrap" // Allow cards to wrap to the next line
            gap={2}
            p={2}
            bgcolor="#FFFFFF"
          >
            {loading ? (
              [1, 2, 3, 4].map((_, index) => (
                <SkeletonPatientCard key={index} />
              )) // Show 4 skeleton cards during loading
            ) : patientSummary?.patients &&
              patientSummary?.patients.length > 0 ? (
              patientSummary?.patients.map(patient => (
                <Box key={patient._id} width="23%" minWidth="200px">
                  {' '}
                  {/* Each card takes up 24% width to fit 4 cards in a row */}
                  <PatientCard
                    patientId={patient.patientId}
                    profileUrl={patient.image}
                    firstName={patient.firstName}
                    lastName={patient.lastName}
                    age={calculateAge(new Date(patient.dob))}
                    gender={patient.gender}
                  />
                </Box>
              ))
            ) : (
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                flex={1}
              >
                <Box display="flex" alignItems="center" sx={{ m: 2 }}>
                  <AssignmentLate color="info" sx={{ mr: 1 }} />
                  <Typography variant="body1" color="textSecondary">
                    No new patients registered
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientsSection;
