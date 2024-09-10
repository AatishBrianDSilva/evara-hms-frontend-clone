import * as React from 'react';
import { Box, Skeleton, Avatar } from '@mui/material';

const SkeletonPatientCard: React.FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      borderRadius={4}
      border="1px solid"
      borderColor="grey.300"
      p={2}
      width={300}
      sx={{ '&:hover': { boxShadow: 3 } }}
    >
      <Box display="flex" flex={1} justifyContent="center" alignItems="center">
        <Skeleton variant="circular">
          <Avatar />
        </Skeleton>
      </Box>
      <Box display="flex" flexDirection="column" flex={2} ml={2}>
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="50%" height={20} />
      </Box>
    </Box>
  );
};

export default SkeletonPatientCard;
