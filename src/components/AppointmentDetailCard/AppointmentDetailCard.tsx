import * as React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import { stringAvatar } from '../../utils/avatar';

interface AppointmentDetailCardProps {
  doctorName: string;
  doctorPhotoUrl?: string;
  patientName: string;
  patientPhoneNumber: string;
}

const AppointmentDetailCard: React.FC<AppointmentDetailCardProps> = ({
  doctorName,
  doctorPhotoUrl,
  patientName,
  patientPhoneNumber,
}) => {

  const image_sx = {
    height: 56,
    width: 56,
    border: '2px solid',
    borderColor: 'secondary.main'
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      borderRadius={4}
      border="1px solid"
      borderColor="grey.300"
      p={2}
      width={300}
      height={75}
    >
      <Avatar {...stringAvatar(doctorName, image_sx)} src={doctorPhotoUrl} />
      <Box display="flex" flexDirection="column">
        <Box display="flex" alignItems="center" mt={1}>
          <Typography variant="subtitle1">{doctorName}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mt={1}>
          <PersonIcon fontSize="small" color='info' sx={{ mr: 1 }} />
          <Typography variant="body2">{patientName}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mt={1}>
          <PhoneIcon fontSize="small" color='info' sx={{ mr: 1 }} />
          <Typography variant="body2">{patientPhoneNumber}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AppointmentDetailCard;
