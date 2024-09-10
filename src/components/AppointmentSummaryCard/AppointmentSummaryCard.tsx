import * as React from 'react';
import { Box, Typography, Chip } from '@mui/material';

interface AppointmentSummaryCardProps {
  noOfAppointments: number;
  scheduledAppointments: number;
  reportedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

const AppointmentSummaryCard: React.FC<AppointmentSummaryCardProps> = ({
  noOfAppointments,
  scheduledAppointments,
  reportedAppointments,
  completedAppointments,
  cancelledAppointments,
}) => {
  return (
    <Box
      display="flex"
      borderRadius={4}
      border="1px solid"
      borderColor="primary.main"
      p={2}
      width={250}
      height={150}
    >
      <Box display="flex" flexDirection="column" flex={1}>
        <Typography variant="h6" color="secondary">Summary</Typography>
        <Box display="flex" flexDirection="column" flex={1} justifyContent={"center"}>
          <Typography variant="h4" color={"primary"}>{noOfAppointments}</Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={1} flex={1} >
        <Chip size='small' variant='outlined' label={`Scheduled: ${scheduledAppointments}`} color="primary" />
        <Chip size='small' variant='outlined' label={`Reported: ${reportedAppointments}`} color="secondary" />
        <Chip size='small' variant='outlined' label={`Completed: ${completedAppointments}`} color="success" />
        <Chip size='small' variant='outlined' label={`Cancelled: ${cancelledAppointments}`} color="error" />
      </Box>
    </Box>
  );
};

export default AppointmentSummaryCard;
