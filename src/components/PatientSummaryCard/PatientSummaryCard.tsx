import * as React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface PatientSummaryCardProps {
  newPatients: number;
  newDonors: number;
}

const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  newPatients,
  newDonors,
}) => {
  const handleArrowClick = () => {
    window.location.href = '/appointments'; // Redirect to the provided link URL
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderRadius={4}
      width={'100%'}
      height={'100%'}
      overflow="hidden"
    >
      {/* Header Section with title and arrow */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="72px"
        bgcolor="#FFEDE2"
        px={2}
      >
        <Typography variant="h6" color="secondary">
          Summary
        </Typography>

        {/* Arrow Icon */}
        <IconButton size="small" color="inherit" onClick={handleArrowClick}>
          <ArrowForward fontSize="small" />
        </IconButton>
      </Box>

      {/* Content Section */}
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent={'center'}
        p={2}
        gap={5}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography color="primary" sx={{ fontWeight: 'bold' }} variant="h5">
            New Patients:
          </Typography>
          <Typography
            variant="h5"
            color={'primary'}
            align={'left'}
            sx={{ fontWeight: 'bold' }}
          >
            {newPatients}
          </Typography>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography color="primary" sx={{ fontWeight: 'bold' }} variant="h5">
            New Donors:
          </Typography>
          <Typography
            variant="h5"
            color={'primary'}
            align={'left'}
            sx={{ fontWeight: 'bold' }}
          >
            {newDonors}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientSummaryCard;
