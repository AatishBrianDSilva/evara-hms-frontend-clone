import React, { useEffect, useLayoutEffect, useState } from 'react';
import ContentSection from '../../components/ContentSection/ContentSection';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Typography from '@mui/material/Typography';
import styled from '@mui/material/styles/styled';


import { useFormik } from 'formik';
import { DatePicker } from '@mui/x-date-pickers';
import { format, eachDayOfInterval, endOfMonth, startOfMonth, isSameMonth, isBefore } from 'date-fns';
import { useTheme } from '@mui/material';
import AppointmentsList from './AppointmentsList';


const Appointment: React.FC = () => {

  return (
    <ContentSection title="Appointments" icon={<CalendarMonth />}>
      <AppointmentsList />
    </ContentSection>
  );
};

export default Appointment;
