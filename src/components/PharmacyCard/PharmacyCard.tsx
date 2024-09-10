import * as React from 'react';
import { Box, Typography, Link, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface PharmacyCardProps {
  title: string;
  mainValue: string | number;
  amountValue?: string | number;
  additionalText?: string;
  linkUrl: string;
  linkText: string;
}

const PharmacyCard: React.FC<PharmacyCardProps> = ({
  title,
  mainValue,
  amountValue,
  additionalText,
  linkUrl,
  linkText,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderRadius={4}
      border="1px solid"
      borderColor="primary.main"
      width={250}
      height={150}
      p={2}
      overflow={'hidden'}
    >
      <Box display="flex" flexDirection="column" flex={1} justifyContent="space-between">
        <Typography variant="h6" color={"secondary"}>{title}</Typography>
        <Typography color={"primary"} variant="h4">{mainValue}</Typography>
        {amountValue && (
          <Typography variant="body1" color={"textSecondary"}>{amountValue}</Typography>
        )}
        {additionalText && (
          <Typography variant="body1" color={"textSecondary"}>{additionalText}</Typography>
        )}
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="text"
          color="primary"
          endIcon={<ArrowForward />}
          component={Link}
          href={linkUrl}
        >
          {linkText}
        </Button>
      </Box>
    </Box>
  );
};

export default PharmacyCard;
