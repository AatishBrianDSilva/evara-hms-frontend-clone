import { Box, Button, Stack } from '@mui/material';
import React from 'react';

interface AppointmentConfirmationProps {
  onReset: () => void;
  onClose: (value: boolean) => void;
}

const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({ onReset, onClose }) => {
  // Your implementation here
  return (
    <Box p={2}>
      <Stack direction="row" spacing={2} mt={2}>
        <Button size='small' variant="contained" color="primary" onClick={() => onClose(false)}>
          Close
        </Button>
        <Button size='small' variant="contained" color="secondary" onClick={onReset}>
          Book Again
        </Button>
      </Stack>
    </Box>
  );
};

export default AppointmentConfirmation;
