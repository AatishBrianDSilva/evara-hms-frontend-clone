import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import styled from '@mui/material/styles/styled';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useFormik } from 'formik';
import { DatePicker } from '@mui/x-date-pickers';
import { format, eachDayOfInterval, endOfMonth, startOfMonth, isSameMonth, isBefore, isSameDay } from 'date-fns';
import { Autocomplete, CircularProgress, Modal, Step, StepContent, StepLabel, Stepper } from '@mui/material';
import { AppointmentValidationSchema } from '../../utils/yup';
import { useGetDoctorsQuery } from '../../services/doctorsApi';
import { IAppointment, IDoctor } from '../../types/types';
import { useAddAppointmentMutation, useGetUpcomingAppointmentsQuery } from '../../services/appointmentsApi';
import { useToast } from '../../context/ToastContext';

const amTimeslots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
const pmTimeslots = ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'
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

interface BookAppointmentProps {
  openModal: boolean;
  onClose: (value: boolean) => void;
}

const BookAppointment: React.FC<BookAppointmentProps> = ({ openModal, onClose }) => {

  const { showPromiseToast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString());
  const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const [dateRange, setDateRange] = useState<string[]>([]);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Fetch doctors for the doctor selection
  const { data: doctorData, isLoading: doctorLoading, isFetching: doctorFetching } = useGetDoctorsQuery({})
  const doctors: IDoctor[] = doctorData?.data || [];

  // Fetch upcoming appointments for the selected doctor and date
  const { data: upcomingAppointmentsData, isLoading: upcomingAppointmentsLoading, isFetching: upcomingAppointmentsFetching } = useGetUpcomingAppointmentsQuery({
    filters: {
      doctorId: selectedDoctor?._id,
      date: selectedDate
    },
  }, {
    skip: !selectedDoctor || !selectedDate
  })
  const upcomingAppointments: IAppointment[] = upcomingAppointmentsData?.data || [];
  console.log('Upcoming appointment', upcomingAppointmentsData);
  const appointmentLoading = upcomingAppointmentsLoading || upcomingAppointmentsFetching;

  // Filter out booked timeslots
  const bookedTimeslots = upcomingAppointments.map((appointment) => appointment.time);
  const availableAMTimeslots = useMemo(() => {
    return amTimeslots.map(timeslot => ({
      timeslot,
      available: !bookedTimeslots.includes(timeslot)
    }));
  }, [amTimeslots, bookedTimeslots]);
  const availablePMTimeslots = useMemo(() => {
    return pmTimeslots.map(timeslot => ({
      timeslot,
      available: !bookedTimeslots.includes(timeslot)
    }));
  }, [pmTimeslots, bookedTimeslots]);


  // Mutation to add an appointment
  const [addAppointment, { isLoading: isSchedulingAppointment }] = useAddAppointmentMutation();

  const handleSubmit = async (values: any) => {

    const appointmentData = {
      doctorId: selectedDoctor?._id,
      date: selectedDate,
      time: selectedTimeslot,
      fullName: values.fullName,
      phone: values.phone,
      city: values.city,
      reason: values.reason,
      mode: values.mode,
      source: values.source,
      notes: values.notes,
    }

    const promise = addAppointment(appointmentData).unwrap();

    showPromiseToast(promise, {
      loading: 'Scheduling Appointment',
      success: (response) => response.message || 'Appointment Scheduled Successfully',
      error: (err) => `Error: ${err.response?.data?.message || 'Failed to schedule appointment'}`
    });

    try {
      await promise;
      handleNext()
    } catch (error: any) {
      console.error('Failed to schedule appointment', error);
    }
  };

  // Set the date range for the selected month
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
    setSelectedDate(new Date(range[0]).toISOString());
  }, [selectedMonth]);

  const handleMonthChange = (value: Date | null) => {
    if (value) setSelectedMonth(value);
  };

  // Function to handle date selection
  const handleDateSelection = useCallback((date: string) => () => {
    setSelectedDate(new Date(date).toISOString());
    setSelectedTimeslot(null);
  }, [setSelectedDate, setSelectedTimeslot]);

  // Scroll functionality for date range
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

  // Formik form state and validation
  const formik = useFormik({
    initialValues: {
      fullName: '',
      phone: '',
      city: '',
      reason: '',
      mode: '',
      source: '',
      notes: '',
    },
    validationSchema: AppointmentValidationSchema, // Pass the validation schema to Formik
    onSubmit: handleSubmit,
  });

  // Functions to handle the next step in the stepper
  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [setActiveStep]);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, [setActiveStep]);

  const handleReset = useCallback(() => {
    setActiveStep(0);
    formik.resetForm();
    setSelectedDoctor(null);
    setSelectedTimeslot(null);
  }, [setActiveStep, formik]);

  const renderAppointmentTimeslots = () => {
    return (
      <>
        {/* Render AM timeslots */}

        <Typography variant="button" color={"secondary"} gutterBottom>
          Select a Timeslot
        </Typography>
        <Box mt={2}>
          {availableAMTimeslots.length > 0 && (
            <Box mt={1}>
              <Typography variant="button" color={"text.secondary"} align='center'>
                Morning
              </Typography>
              <Stack flexWrap={"wrap"} mt={2} direction="row" gap={2}>
                {availableAMTimeslots.map(timeslot => (
                  <Button
                    disabled={!timeslot.available || !selectedDoctor}
                    key={timeslot.timeslot}
                    variant={selectedTimeslot === timeslot.timeslot ? 'contained' : 'outlined'}
                    onClick={() => setSelectedTimeslot(timeslot.timeslot)}
                  >
                    {timeslot.timeslot}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        {/* Render PM timeslots */}
        <Box mt={4}>
          {availablePMTimeslots.length > 0 && (
            <Box mt={1}>
              <Typography variant="button" color={"text.secondary"} align='center'>
                Afternoon
              </Typography>
              <Stack flexWrap={"wrap"} mt={2} direction="row" gap={2}>
                {availablePMTimeslots.map(timeslot => (
                  <Button
                    disabled={!timeslot.available || !selectedDoctor}
                    key={timeslot.timeslot}
                    variant={selectedTimeslot === timeslot.timeslot ? 'contained' : 'outlined'}
                    onClick={() => setSelectedTimeslot(timeslot.timeslot)}
                  >
                    {timeslot.timeslot}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </>
    )
  }

  return (
    <Modal open={openModal} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        height: '86vh',
        overflowY: 'auto',
        borderRadius: 1,
        boxShadow: 5,
        px: 8,
        py: 5,
        bgcolor: 'background.paper',
      }}>
        <Typography variant="h6" align='center' gutterBottom>
          Book Appointment
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Stepper activeStep={activeStep} orientation='vertical'>
            <Step key={0}>
              <StepLabel> <Typography variant="button" color={"secondary"} gutterBottom>
                Date & Doctor Selection
              </Typography></StepLabel>
              <StepContent>
                <Box p={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <DatePicker
                        views={['month']}
                        label="Month"
                        minDate={new Date()}
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        slots={{ textField: TextField }}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        id="doctor-select-autocomplete"
                        options={doctors}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        value={selectedDoctor}
                        onChange={(_, newValue) => {
                          setSelectedDoctor(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Doctor"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {doctorLoading || doctorFetching ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Box mt={2} gap={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <IconButton color='primary' onClick={scrollLeft} disabled={scrollPosition === 0}>
                      <ArrowBackIosNewIcon />
                    </IconButton>
                    <StyledScrollBox
                      ref={scrollRef}
                    >
                      <Stack direction="row" spacing={4} px={2} py={2}>
                        {dateRange.map((date, index) => {
                          const selected = isSameDay(new Date(selectedDate), new Date(date));
                          return (
                            <Button
                              color='secondary'
                              key={index}
                              disabled={!selectedDoctor}
                              variant={selected ? 'contained' : 'outlined'}
                              onClick={handleDateSelection(date)}
                            >
                              {format(new Date(date), 'dd E')}
                            </Button>
                          )
                        })}
                      </Stack>
                    </StyledScrollBox>
                    <IconButton color='primary' onClick={scrollRight} disabled={!canScrollRight}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </Box>
                  <Box height={"50vh"} px={1} mt={2} flexDirection={"column"} display={"flex"} justifyContent={"center"} alignItems={appointmentLoading ? "center" : "flex-start"}>
                    {appointmentLoading ?
                      <CircularProgress />
                      : renderAppointmentTimeslots()}
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  size='small'
                  disabled={!selectedDate || !selectedDoctor || !selectedTimeslot}
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Continue
                </Button>
              </StepContent>
            </Step>
            <Step key={1}>
              <StepLabel> <Typography variant="button" color={"secondary"} gutterBottom>
                Appointment Details
              </Typography></StepLabel>
              <StepContent >
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} sm={3} lg={3}>
                    <TextField label="Doctor" fullWidth disabled value={selectedDoctor ? `${selectedDoctor?.firstName} ${selectedDoctor?.lastName}` : ""} />
                  </Grid>
                  <Grid item xs={12} sm={3} lg={3}>
                    <TextField label="Date" fullWidth disabled value={format(selectedDate, "MMM io y")} />
                  </Grid>
                  <Grid item xs={12} sm={3} lg={3}>
                    <TextField label="Time" fullWidth disabled value={selectedTimeslot ? selectedTimeslot : ""} />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={4}>
                    <TextField
                      label="Full Name"
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                      helperText={formik.touched.fullName && formik.errors.fullName}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={4}>
                    <TextField
                      label="Phone"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      error={formik.touched.phone && Boolean(formik.errors.phone)}
                      helperText={formik.touched.phone && formik.errors.phone}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={4}>
                    <TextField
                      label="City"
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      error={formik.touched.city && Boolean(formik.errors.city)}
                      helperText={formik.touched.city && formik.errors.city}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={4}>
                    <TextField
                      select
                      name="reason"
                      label="Reason"
                      value={formik.values.reason}
                      onChange={formik.handleChange}
                      error={formik.touched.reason && Boolean(formik.errors.reason)}
                      helperText={formik.touched.reason && formik.errors.reason} fullWidth >
                      <MenuItem value="Consultation">First-Consultation</MenuItem>
                      <MenuItem value="Checkup">Checkup</MenuItem>
                      <MenuItem value="Treatment">Treatment</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4} lg={4}>
                    <TextField
                      select
                      name='mode'
                      label="Mode"
                      value={formik.values.mode}
                      onChange={formik.handleChange}
                      error={formik.touched.mode && Boolean(formik.errors.mode)}
                      helperText={formik.touched.mode && formik.errors.mode}
                      fullWidth >
                      <MenuItem value="In-Person">In-Person</MenuItem>
                      <MenuItem value="Online">Online</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4} lg={4}>
                    <TextField
                      select
                      name='source'
                      label="Source"
                      value={formik.values.source}
                      onChange={formik.handleChange}
                      error={formik.touched.source && Boolean(formik.errors.source)}
                      helperText={formik.touched.source && formik.errors.source}
                      fullWidth >
                      <MenuItem value="Referral">Referral</MenuItem>
                      <MenuItem value="Walk-in">Walk-in</MenuItem>
                      <MenuItem value="Online">Online</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <TextField
                      multiline
                      name='notes'
                      label="Notes"
                      fullWidth
                      value={formik.values.notes}
                      onChange={formik.handleChange}
                      error={formik.touched.notes && Boolean(formik.errors.notes)}
                      helperText={formik.touched.notes && formik.errors.notes}
                    />
                  </Grid>
                </Grid>
                <Stack direction="row" spacing={2} mt={2}>
                  <Button size='small' disabled={isSchedulingAppointment} variant="contained" color="primary" type='submit'>
                    Confirm
                  </Button>
                  <Button size='small' disabled={isSchedulingAppointment} variant="contained" color="secondary" onClick={handleBack}>
                    Back
                  </Button>
                </Stack>
              </StepContent>
            </Step>
            <Step key={2}>
              <StepLabel> <Typography variant="button" color={"secondary"} gutterBottom>
                Appointment Confirmed
              </Typography></StepLabel>
              <StepContent>
                <Box p={2}>
                  <Stack direction="row" spacing={2} mt={2}>
                    <Button size='small' variant="contained" color="primary" onClick={() => onClose(false)}>
                      Close
                    </Button>
                    <Button size='small' variant="contained" color="secondary" onClick={handleReset}>
                      Book Again
                    </Button>
                  </Stack>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </form>
      </Box>
    </Modal>
  )
}

export default BookAppointment