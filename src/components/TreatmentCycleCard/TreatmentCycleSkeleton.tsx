import { Box, Skeleton, useTheme } from '@mui/material';

const TreatmentCycleCardSkeleton = () => {
  const theme = useTheme();

  // Helper function to generate multiple skeletons
  const renderSkeletonItems = (count: number) => {
    return [...Array(count)].map((_, index) => (
      <Box key={index} display="flex" flex={2} alignItems="center" gap={1}>
        <Skeleton variant="rounded" width="100%" height={20} />
      </Box>
    ));
  };

  return (
    <Box
      width={'60%'}
      border={1}
      borderRadius={1}
      borderColor={theme.palette.secondary.main}
    >
      <Box
        gap={2}
        p={2}
        display={'flex'}
        alignItems={'center'}
        borderBottom={2}
        borderColor={theme.palette.secondary.main}
      >
        <Box
          display={'flex'}
          flex={1}
          justifyContent={'flex-start'}
          alignItems={'center'}
        >
          <Skeleton variant="rounded" width={'50%'} height={20} />
        </Box>
        <Box
          display={'flex'}
          flex={3}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Skeleton variant="rounded" width={'50%'} height={20} />
        </Box>
        <Box display={'flex'} flex={1} justifyContent={'flex-end'} gap={1}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="rounded" width={'50%'} height={20} />
        </Box>
      </Box>

      {[...Array(4)].map((_, index) => (
        <Box
          key={index}
          p={2}
          display={'flex'}
          alignItems={'center'}
          borderBottom={1}
          borderColor={theme.palette.secondary.main}
        >
          <Box display={'flex'} alignItems={'center'} flex={1} gap={1}>
            <Skeleton variant="circular" width="10%" height={20} />
            <Skeleton variant="rounded" width="50%" height={20} />
          </Box>
          {renderSkeletonItems(1)}
          <Box
            display={'flex'}
            flex={1}
            justifyContent={'flex-end'}
            alignItems={'center'}
          >
            <Skeleton variant="rounded" width={'50%'} height={20} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TreatmentCycleCardSkeleton;
