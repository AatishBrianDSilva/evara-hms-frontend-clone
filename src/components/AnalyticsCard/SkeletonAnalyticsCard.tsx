import { Box, Skeleton } from '@mui/material';

const SkeletonAnalyticsCard: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderRadius={4}
      border="1px solid"
      borderColor="#D8D8D8"
      // flex={1} // Ensures the skeleton card takes equal space in a flexbox layout
      height="358px" // Full height
      overflow="hidden"
      bgcolor="#FFFFFF"
      minWidth="350px"
    >
      {/* Header Section Skeleton */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="72px"
        bgcolor="#FFEDE2"
        px={2}
      >
        {/* Title Skeleton */}
        <Box display="flex" alignItems="center" gap={1}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={100} height={24} />
        </Box>

        {/* Arrow Skeleton */}
        <Skeleton variant="circular" width={24} height={24} />
      </Box>

      {/* Main Content Skeleton */}
      <Box display="flex" justifyContent="space-between" flex={1} p={2}>
        {/* Main Value Skeleton */}
        <Box display="flex" flexDirection="column" flex={2}>
          <Skeleton variant="text" width={120} height={40} />
        </Box>

        {/* Badges Skeleton */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          flex={1}
          gap={1}
        >
          {[1, 2].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={32}
              width="100%"
            />
          ))}
        </Box>
      </Box>

      {/* Payment Badges Skeleton */}
      <Box mt={2} px={2}>
        <Skeleton variant="rectangular" width="100%" height={32} />
        <Skeleton variant="rectangular" width="100%" height={32} />
      </Box>
    </Box>
  );
};
export { SkeletonAnalyticsCard };
