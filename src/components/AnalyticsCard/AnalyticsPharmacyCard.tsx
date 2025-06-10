import * as React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowForward, Assessment } from '@mui/icons-material'; // Importing icons
import { formatToIndianCurrencyFormat } from '../../utils/formatToIndianCurrencyFormat';

export interface AnalyticsPharmacyCardProps {
  title: string;
  totalAmount: number;
  totalRefunded: number;
  netAmount: number;
  linkUrl?: string;
  linkText?: string;
}

const AnalyticsPharmacyCard: React.FC<AnalyticsPharmacyCardProps> = ({
  title,
  totalAmount,
  totalRefunded,
  netAmount,
  linkUrl,
  linkText,
}) => {
  const handleArrowClick = () => {
    if (linkUrl) {
      window.location.href = linkUrl;
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
      width="95%"
      overflow="hidden"
      bgcolor="#FFFFFF"
      height="358px"
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="72px"
        bgcolor="#FFEDE2"
        px={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Assessment fontSize="small" />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <IconButton size="small" onClick={handleArrowClick}>
          <ArrowForward fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <Box
        flex={1}
        px={3}
        py={2}
        display="flex"
        flexDirection="column"
        justifyContent="center" // Vertically center content
        gap={1}
      >
        <Typography variant="h5" fontWeight={600} color="primary">
          Net Amount: {formatToIndianCurrencyFormat(netAmount)}
        </Typography>
        <Typography variant="h6" fontWeight={600} color="primary">
          Total Amount: {formatToIndianCurrencyFormat(totalAmount)}
        </Typography>
        <Typography variant="h6" fontWeight={600} color="primary">
          Refunded: {formatToIndianCurrencyFormat(totalRefunded)}
        </Typography>
      </Box>

      {/* Footer */}
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
