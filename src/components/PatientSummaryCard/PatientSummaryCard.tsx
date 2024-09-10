import * as React from 'react';
import { Box, Typography } from '@mui/material';

interface PatientSummaryCardProps {
  newPatients: number;
  newDonors: number;
}

const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  newPatients,
  newDonors,
}) => {
  return (
    <Box
      display="flex"
      borderRadius={4}
      border="1px solid"
      borderColor="primary.main"
      p={2}
      width={250}
      height={150}
    >
      <Box display="flex" flexDirection="column" flex={1}>
        <Typography variant="h6" color="secondary">Summary</Typography>
        <Box display="flex" flexDirection="column" flex={1} justifyContent={"center"}>
          <Box display={"flex"} justifyContent={'space-between'} alignItems={'center'}>
            <Typography color="secondary">New Patient:</Typography><Typography variant="h5" color={"primary"} align={'left'}>{newPatients}</Typography>
          </Box>
          <Box display={"flex"} justifyContent={'space-between'} alignItems={'center'}>
            <Typography color="secondary">New Donor:</Typography><Typography variant="h5" color={"primary"} align={'left'}>{newDonors}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientSummaryCard;
