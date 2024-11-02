import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';
import React from 'react';

interface PatientInfoItemProps {
  title: string;
  value: string | number;
  clickable?: string;
  onclick?: () => void;
}

const data = {
  image:
    'https://t3.ftcdn.net/jpg/02/33/46/24/240_F_233462402_Fx1yke4ng4GA8TJikJZoiATrkncvW6Ib.jpg',
  name: 'Mrs. CHAMPA HALDER',
  dob: '01-01-1995',
  age: 29,
  phone: '954421212',
  email: '',
  gender: 'Female',
  patientId: 'GD699',
  marketingPerson: 'None',
  partner: 'G786/PRABITHA DEVI',
  partnerDob: '26-01-2001',
  partnerAge: '23',
  partnerPhone: '4568791235',
  partnerEmail: 'abc@1231.com',
  financial: 'Self Pay',
  referredBy: 'Other - NA',
  gametes: '',
};

const PatientInfoItem: React.FC<PatientInfoItemProps> = ({
  title,
  value,
  clickable,
  onclick,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="body2" color="textSecondary">
        <strong>{title}</strong>
        {clickable && (
          <Button
            sx={{ ml: 1 }}
            color="secondary"
            size="small"
            onClick={onclick}
          >
            {clickable}
          </Button>
        )}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
};

const PatientInfo: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        gap: 2,
        mt: 2,
        bgcolor: 'background.paper',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: isMobile ? '100%' : 'auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <img
          src={data.image}
          alt="Patient"
          style={{ width: '100%', maxWidth: '100px', borderRadius: '4px' }}
        />
        <Button variant="text" color="secondary">
          Book Appointment
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <PatientInfoItem title="Name:" value={data.name} />
        <PatientInfoItem
          title="DOB / Age:"
          value={`${data.dob} / ${data.age}`}
        />
        <PatientInfoItem title="Phone / Email:" value={data.phone} />
        <PatientInfoItem title="Gender:" value={data.gender} />
        <PatientInfoItem title="Patient Id:" value={data.patientId} />
        <PatientInfoItem
          title="Marketing Person:"
          value={data.marketingPerson}
        />
        <Button variant="text" color="secondary">
          Print Sticker
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <PatientInfoItem
          title="Partner:"
          clickable="Add / Edit"
          value={data.partner}
        />
        <PatientInfoItem
          title="Partner DOB / Age:"
          value={`${data.partnerDob} / ${data.partnerAge}`}
        />
        <PatientInfoItem title="Partner Phone:" value={data.partnerPhone} />
        <PatientInfoItem title="Financial:" value={data.financial} />
        <PatientInfoItem title="Referred By:" value={data.referredBy} />
        <PatientInfoItem
          title="Gametes:"
          clickable="Add Gametes"
          value={data.gametes}
        />
        <Button variant="text" color="secondary">
          Print Label
        </Button>
      </Box>
      <Box
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
      >
        <Button variant="text" color="secondary">
          Add Alert
        </Button>
        <Box
          sx={{
            bgcolor: theme.palette.primary.light,
            color: 'white',
            p: 1,
            borderRadius: 2,
          }}
        >
          <Typography>Alerts</Typography>
        </Box>
        <Button variant="text" color="secondary">
          Add Notes
        </Button>
        <Box
          sx={{
            bgcolor: theme.palette.primary.light,
            color: 'white',
            p: 1,
            borderRadius: 2,
          }}
        >
          <Typography>Notes</Typography>
          <ul style={{ margin: 0, paddingLeft: theme.spacing(2) }}>
            <li>Male Issues</li>
            <li>Female Issues</li>
          </ul>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientInfo;
