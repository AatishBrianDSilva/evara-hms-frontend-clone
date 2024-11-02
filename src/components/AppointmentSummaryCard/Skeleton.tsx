import * as React from 'react';
import { Box, Skeleton } from '@mui/material';

const SkeletonAppointmentSummaryCard: React.FC = () => {
  return (
    <Box
      display="flex"
      borderRadius={4}
      border="1px solid"
      borderColor="grey.300"
      p={2}
      width={250}
      height={150}
    >
      <Box display="flex" flexDirection="column" flex={1}>
        <Skeleton variant="text" width="60%" height={30} />
        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          justifyContent={'center'}
        >
          <Skeleton variant="text" width="80%" height={40} />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={1} flex={1}>
        <Skeleton variant="rectangular" height={24} width="100%" />
        <Skeleton variant="rectangular" height={24} width="100%" />
        <Skeleton variant="rectangular" height={24} width="100%" />
        <Skeleton variant="rectangular" height={24} width="100%" />
      </Box>
    </Box>
  );
};

export default SkeletonAppointmentSummaryCard;
