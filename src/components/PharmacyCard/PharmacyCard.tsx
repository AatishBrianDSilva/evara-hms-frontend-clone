import * as React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface PharmacyCardProps {
  title: string;
  mainValue: string | number;
  amountValue?: string | number;
  linkUrl?: string;
  linkText?: string;
}

const PharmacyCard: React.FC<PharmacyCardProps> = ({
  title,
  mainValue,
  amountValue,
  linkUrl,
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
      width={'100%'}
      height={'358px'} // Ensure total height is 358px
      overflow={'hidden'}
      border="1px solid"
      borderColor="#D8D8D8"
      bgcolor="#FFFFFF"
    >
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="72px" // Fixed height for the header
        bgcolor="#FFEDE2" // Background color for the header
        px={2}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton size="small" color="inherit" onClick={handleArrowClick}>
          <ArrowForward fontSize="small" />
        </IconButton>
      </Box>

      {/* Content Section */}
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent="center"
        p={2}
      >
        <Typography color={'primary'} variant="h3" sx={{ fontWeight: 'bold' }}>
          {mainValue}
        </Typography>
        {amountValue && (
          <Typography variant="body1" color={'textSecondary'}>
            {amountValue}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PharmacyCard;
