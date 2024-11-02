import * as React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowForward, Assessment } from '@mui/icons-material'; // Importing icons

export interface AnalyticsPharmacyCardProps {
  title: string;
  mainValue: string | number;
  linkUrl?: string;
  linkText?: string;
}

const AnalyticsPharmacyCard: React.FC<AnalyticsPharmacyCardProps> = ({
  title,
  mainValue,
  linkUrl,
  linkText,
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
      <Box display="flex" alignItems="center" flex={1} pl={3}>
        {/* Main Value - Centered and Larger Size */}
        <Typography
          color="primary"
          variant="h3"
          align="center"
          sx={{ fontWeight: 'bold' }}
        >
          {mainValue}
        </Typography>
      </Box>

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

export default AnalyticsPharmacyCard;
