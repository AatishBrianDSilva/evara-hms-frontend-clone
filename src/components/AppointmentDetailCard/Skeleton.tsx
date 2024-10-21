import * as React from "react";
import { Box, Skeleton, Avatar } from "@mui/material";

const SkeletonAppointmentDetailCard: React.FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      borderRadius={4}
      border="1px solid"
      borderColor="grey.300"
      p={2}
      width={300}
      height={75}
    >
      {/* Avatar Skeleton */}
      <Skeleton variant="circular" width={56} height={56}>
        <Avatar />
      </Skeleton>

      {/* Text Skeletons */}
      <Box display="flex" flexDirection="column" ml={2} width="100%">
        {/* Doctor's Name Skeleton */}
        <Skeleton variant="text" width="80%" height={24} />

        {/* Patient Name Skeleton */}
        <Box display="flex" alignItems="center" mt={1}>
          <Skeleton variant="rectangular" width="20px" height="20px" sx={{ mr: 1 }} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>

        {/* Patient Phone Number Skeleton */}
        <Box display="flex" alignItems="center" mt={1}>
          <Skeleton variant="rectangular" width="20px" height="20px" sx={{ mr: 1 }} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
      </Box>
    </Box>
  );
};
export default SkeletonAppointmentDetailCard;
