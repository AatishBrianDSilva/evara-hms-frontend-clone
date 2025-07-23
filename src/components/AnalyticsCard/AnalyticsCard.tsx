import * as React from 'react';
import { Box, Typography, Chip, Button, Grid, IconButton } from '@mui/material';
import { ArrowForward, Assessment } from '@mui/icons-material'; // Importing icons

interface BadgeData {
  color: string;
  count: number | string;
  label: string;
}

export interface AnalyticsCardProps {
  title: string;
  mainValue: string | number;
  linkUrl?: string;
  linkText?: string;
  badgesData?: BadgeData[];
  paymentBadgesData?: BadgeData[];
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  mainValue,
  linkUrl,
  linkText,
  badgesData = [],
  paymentBadgesData = [],
}) => {
  const handleArrowClick = () => {
    if (linkUrl) {
      window.location.href = linkUrl; // Redirect to the provided link URL
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderRadius={4}
      border="1px solid"
      borderColor="#D8D8D8"
      flex={1}
      width={'95%'}
      overflow={'hidden'}
      bgcolor="#FFFFFF"
      height="358px" // Full height
    >
      {/* Header Section with Icon and Arrow */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="72px"
        bgcolor="#FFEDE2"
        px={2}
      >
        {/* Title with Icon */}
        <Box display="flex" alignItems="center" gap={1}>
          <Assessment fontSize="small" /> {/* Small icon next to the title */}
          <Typography variant="h6">{title}</Typography>
        </Box>

        {/* Arrow Icon */}
        <IconButton size="small" color="inherit" onClick={handleArrowClick}>
          <ArrowForward fontSize="small" />
        </IconButton>
      </Box>

      {/* Content Section */}
      <Box display="flex" justifyContent="space-between" flex={1} p={2}>
        {/* Main Value */}
        <Box display="flex" flexDirection="column" flex={1}>
          <Typography color="primary" variant="h4">
            {mainValue}
          </Typography>
        </Box>

        {/* Badges */}
        {badgesData.length > 0 && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            flex={1}
            gap={1}
          >
            {badgesData.map((badge, index) => (
              <Chip
                key={index}
                size="small"
                variant="outlined"
                color={badge.color as any}
                label={
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={'space-between'}
                  >
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {badge.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {badge.count}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Payment Badges */}
      {paymentBadgesData.length > 0 && (
        <Box mt={2} px={2} pb={3}>
          <Grid container spacing={1}>
            {paymentBadgesData.map((badge, index) => (
              <Grid item xs={6} key={index}>
                <Chip
                  size="small"
                  variant="outlined"
                  color={badge.color as any}
                  sx={{
                    width: '100%', // Ensure the Chip takes full width
                    paddingLeft: 2,
                    paddingRight: 2,
                    justifyContent: 'center', // Center align the content
                  }}
                  label={
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ width: '100%' }} // Ensure the Box inside the Chip also takes full width
                    >
                      <Typography
                        variant="body2"
                        sx={{ mr: 1, fontWeight: 'bold' }}
                      >
                        {badge.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {badge.count}
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Link Button */}
      {linkUrl && linkText && (
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            variant="text"
            color="primary"
            endIcon={<ArrowForward />}
            href={linkUrl}
          >
            {linkText}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AnalyticsCard;
