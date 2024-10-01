import { Box, Skeleton } from "@mui/material";

const SkeletonAnalyticsCard: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderRadius={4}
      border="1px solid"
      borderColor="grey.300"
      flex={1}
      width={250}
      height={200}
      p={2}
      overflow="hidden"
    >
      <Box display="flex" justifyContent="space-between" flex={1}>
        <Box display="flex" flexDirection="column" flex={2}>
          <Skeleton variant="text" width="60%" height={30} />
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            flex={1}
            flexWrap="wrap"
          >
            <Skeleton variant="text" width="80%" height={40} />
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="flex-start" flex={1} gap={1}>
          {[0, 1, 2].map((index) => (
            <Skeleton variant="rectangular" height={24} key={index} />
          ))}
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Skeleton variant="rectangular" width={80} height={36} />
      </Box>
    </Box>
  );
};

export { SkeletonAnalyticsCard };
