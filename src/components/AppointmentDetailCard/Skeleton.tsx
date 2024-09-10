import * as React from 'react';
import { Box, Skeleton, Avatar } from '@mui/material';

const SkeletonAppointmentDetailCard: React.FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      borderRadius={4}
      border="1px solid"
      borderColor="grey.300"
      p={2}
      m={1}
      width={300}
      height={75}
    >
      <Skeleton variant="circular">
        <Avatar />
      </Skeleton>
      <Box display="flex" flexDirection="column" ml={2} flex={1}>
        <Skeleton variant="text" width="80%" height={24} />
        <Box display="flex" alignItems="center" mt={1}>
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
        <Box display="flex" alignItems="center" mt={1}>
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
      </Box>
    </Box>
  );
};

export default SkeletonAppointmentDetailCard
