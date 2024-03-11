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

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useFormik } from 'formik';
import { DatePicker } from '@mui/x-date-pickers';
import { format, eachDayOfInterval, endOfMonth, startOfMonth, isSameMonth, isBefore } from 'date-fns';
import { useTheme } from '@mui/material';


interface Doctor {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

const doctors: Doctor[] = [
  { id: 1, name: 'Dr. Smith' },
  { id: 2, name: 'Dr. Johnson' },
];

const branches: Branch[] = [
  { id: 1, name: 'Main Branch' },
  { id: 2, name: 'East Branch' },
];

const StyledScrollBox = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    height: '2px',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: `inset 0 0 6px ${theme.palette.divider}`,
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.secondary.light,
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
}));


const Appointment: React.FC = () => {

  const theme = useTheme();

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string[]>([]);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Simulated timeslots for demonstration
  const timeslots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'
  ];

  // Splitting timeslots into AM and PM for rendering
  const amTimeslots = timeslots.filter(timeslot => timeslot.endsWith('AM'));
  const pmTimeslots = timeslots.filter(timeslot => timeslot.endsWith('PM'));

  useEffect(() => {
    const today = new Date();
    let start: Date;

    // Check if the selected month is the same as the current month and year
    if (isSameMonth(selectedMonth, today) && isBefore(startOfMonth(selectedMonth), today)) {
      start = today;
    } else {
      start = startOfMonth(selectedMonth);
    }

    const end: Date = endOfMonth(selectedMonth);
    const range: string[] = eachDayOfInterval({ start, end }).map(day => format(day, 'yyyy-MM-dd'));
    setDateRange(range);
    formik.setFieldValue('date', format(start, 'yyyy-MM-dd'));
  }, [selectedMonth]);

  useLayoutEffect(() => {
    const updateScrollState = () => {
      if (scrollRef.current) {
        const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        setCanScrollRight(scrollRef.current.scrollLeft < maxScrollLeft);
      }
    };

    updateScrollState(); // Call on initial mount

    window.addEventListener('resize', updateScrollState); // Adjust on window resize to account for responsive changes
    return () => window.removeEventListener('resize', updateScrollState);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        setScrollPosition(scrollRef.current.scrollLeft);
        setCanScrollRight(scrollRef.current.scrollLeft < maxScrollLeft);
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    // Execute once to ensure accurate initial state
    handleScroll();

    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, [dateRange]);

  const handleMonthChange = (value: Date | null) => {
    if (value) setSelectedMonth(value);
  };

  const formik = useFormik({
    initialValues: {
      doctor: '',
      branch: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    onSubmit: values => {
      console.log('Form data', values);
      // Place your submission logic here
    },
  });

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  // Function to set selected timeslot in formik and local state
  const handleTimeslotSelection = (timeslot: string) => {
    setSelectedTimeslot(timeslot);
    formik.setFieldValue('timeslot', timeslot);
  };

  // Function to find doctor and branch names by ID
  const findDoctorNameById = (id: string) => doctors.find(doctor => doctor.id.toString() === id)?.name || 'N/A';
  const findBranchNameById = (id: string) => branches.find(branch => branch.id.toString() === id)?.name || 'N/A';

  return (
    <ContentSection title="Appointments" icon={<CalendarMonth />}>
      <Box component={"form"} height={"100%"} onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <DatePicker
              views={['month']}
              label="Select Month"
              minDate={new Date()}
              value={selectedMonth}
              onChange={handleMonthChange}
              slots={{ textField: TextField }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Select Doctor"
              name="doctor"
              value={formik.values.doctor}
              onChange={formik.handleChange}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Select Branch"
              name="branch"
              value={formik.values.branch}
              onChange={formik.handleChange}
            >
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Box mt={2} mx={1} gap={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton color='primary' onClick={scrollLeft} disabled={scrollPosition === 0}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <StyledScrollBox
            ref={scrollRef}
          >
            <Stack direction="row" spacing={4} px={2} py={2}>
              {dateRange.map((date, index) => (
                <Button
                  color='secondary'
                  key={index}
                  variant={formik.values.date === date ? 'contained' : 'outlined'}
                  onClick={() => formik.setFieldValue('date', date)}
                >
                  {format(new Date(date), 'dd E')}
                </Button>
              ))}
            </Stack>
          </StyledScrollBox>
          <IconButton color='primary' onClick={scrollRight} disabled={!canScrollRight}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
        <Box px={8} mt={6} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"flex-start"}>
          {/* Render AM timeslots */}

          <Typography variant="button" color={"secondary"} gutterBottom>
            Select a Timeslot
          </Typography>
          <Box mt={2}>
            {formik.values.date && amTimeslots.length > 0 && (
              <Box mt={1}>
                <Typography variant="button" color={"text.secondary"} align='center'>
                  Morning
                </Typography>
                <Stack flexWrap={"wrap"} mt={2} direction="row" gap={2}>
                  {amTimeslots.map(timeslot => (
                    <Button
                      key={timeslot}
                      variant={selectedTimeslot === timeslot ? 'contained' : 'outlined'}
                      onClick={() => setSelectedTimeslot(timeslot)}
                    >
                      {timeslot}
                    </Button>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>

          {/* Render PM timeslots */}
          <Box mt={4}>
            {formik.values.date && pmTimeslots.length > 0 && (
              <Box mt={1}>
                <Typography variant="button" color={"text.secondary"} align='center'>
                  Afternoon
                </Typography>
                <Stack flexWrap={"wrap"} mt={2} direction="row" gap={2}>
                  {pmTimeslots.map(timeslot => (
                    <Button
                      key={timeslot}
                      variant={selectedTimeslot === timeslot ? 'contained' : 'outlined'}
                      onClick={() => setSelectedTimeslot(timeslot)}
                    >
                      {timeslot}
                    </Button>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>

          {/* Confirm appointment with summary */}
          {formik.values.date && selectedTimeslot && (
            <Box display={"flex"} alignSelf={"center"} mt={4}>
              <Box p={2} m={2} border={`1px solid ${theme.palette.secondary.light}`} borderRadius={1}>
                <Typography variant="button" color={"secondary"} gutterBottom>
                  Appointment Summary
                </Typography>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} sm={6}>
                    <Typography color={"text.secondary"}><strong>Date:</strong> {format(new Date(formik.values.date), 'PP')}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography color={"text.secondary"}><strong>Timeslot:</strong> {selectedTimeslot}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography color={"text.secondary"}><strong>Doctor:</strong> {findDoctorNameById(formik.values.doctor)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography color={"text.secondary"}><strong>Branch:</strong> {findBranchNameById(formik.values.branch)}</Typography>
                  </Grid>
                </Grid>
                <Stack direction="row" spacing={2} mt={2} justifyContent="center">
                  <Button variant="contained" color="primary" type="submit">
                    Confirm Appointment
                  </Button>
                </Stack>
              </Box>
            </Box>
          )}
        </Box>

      </Box>
    </ContentSection>
  );
};

export default Appointment;
