import * as React from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { ArrowForward, Assessment } from '@mui/icons-material';
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
      height="358px"
      overflow="hidden"
      bgcolor="#FFFFFF"
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

      {/* Total Amount in white box */}

      <Box px={3} pt={2} pb={1}>
        <Typography variant="h4" color="primary">
          {formatToIndianCurrencyFormat(totalAmount)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total Amount
        </Typography>
      </Box>

      {/* Spacer */}
      <Box flex={1} />

      {/* Badges: Net Amount and Refunded */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        gap={1}
        pb={3}
        pr={2}
      >
        <Chip
          size="small"
          label={`Net Amount: ${formatToIndianCurrencyFormat(netAmount)}`}
          variant="outlined"
          color="info"
          sx={{
            paddingLeft: 2,
            paddingRight: 2,
            justifyContent: 'center', // Center align the content
            fontWeight: 'bold',
          }}
        />
        <Chip
          size="small"
          label={`Refunded: ${formatToIndianCurrencyFormat(totalRefunded)}`}
          variant="outlined"
          color="error"
          sx={{
            paddingLeft: 2,
            paddingRight: 2,
            justifyContent: 'center', // Center align the content
            fontWeight: 'bold',
          }}
        />
      </Box>

      {/* Footer Link */}
      {linkUrl && linkText && (
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Typography
            component="a"
            href={linkUrl}
            variant="caption"
            color="primary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            {linkText}
            <ArrowForward fontSize="small" sx={{ ml: 0.5 }} />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AnalyticsPharmacyCard;
