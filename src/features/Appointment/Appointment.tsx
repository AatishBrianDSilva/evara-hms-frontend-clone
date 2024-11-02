import React from 'react';
import ContentSection from '../../components/ContentSection/ContentSection';

import CalendarMonth from '@mui/icons-material/CalendarMonth';

import AppointmentsList from './AppointmentsList';

const Appointment: React.FC = () => {
  return (
    <ContentSection title="Appointments" icon={<CalendarMonth />}>
      <AppointmentsList />
    </ContentSection>
  );
};

export default Appointment;
