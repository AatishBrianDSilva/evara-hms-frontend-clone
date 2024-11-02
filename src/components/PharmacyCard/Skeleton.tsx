import * as React from 'react';
import { Box, Skeleton } from '@mui/material';

const SkeletonPharmacyCard: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderRadius={4}
      border="1px solid"
      borderColor="grey.300"
      width={250}
      height={150}
      p={2}
      overflow={'hidden'}
    >
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent="space-between"
      >
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="80%" height={40} />
        <Skeleton variant="text" width="50%" height={30} />
        <Skeleton variant="text" width="50%" height={20} />
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Skeleton variant="rectangular" width={80} height={36} />
      </Box>
    </Box>
  );
};

export default SkeletonPharmacyCard;
