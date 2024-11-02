import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import styled from '@mui/material/styles/styled';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from 'date-fns';
import { useGetDoctorsQuery } from '../../services/doctorsApi';
import { useGetUpcomingAppointmentsQuery } from '../../services/appointmentApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import {
  setSelectedDate,
  setSelectedDoctor,
  setSelectedTimeslot,
} from './appointmentSlice';
import { IAppointment } from '../../types/appointment';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';
import { getAvailableTimeslots } from '../../utils/appointmentUtilities';
import FieldAutocomplete from '../../components/FieldAutoComplete/FieldAutoComplete';

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

interface DateDoctorSelectionProps {
  handleNext: () => void;
}

const DateDoctorSelection: React.FC<DateDoctorSelectionProps> = ({
  handleNext,
}) => {
  const dispatch = useDispatch();
  const { selectedDate, selectedTimeslot, selectedDoctor } = useSelector(
    (state: RootState) => state.appointments,
  );

  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Fetch doctors for the doctor selection
  const {
    data: doctorData,
    isLoading: doctorLoading,
    isFetching: doctorFetching,
  } = useGetDoctorsQuery({});
  const doctors = doctorData?.data?.records || [];

  // Fetch upcoming appointments for the selected doctor and date
  const {
    data: upcomingAppointmentsData,
    isLoading: upcomingAppointmentsLoading,
    isFetching: upcomingAppointmentsFetching,
  } = useGetUpcomingAppointmentsQuery(
    {
      filters: {
        doctorId: selectedDoctor?._id,
        date: selectedDate,
      },
    },
    {
      skip: !selectedDoctor || !selectedDate,
    },
  );
  const upcomingAppointments: IAppointment[] =
    upcomingAppointmentsData?.data || [];
  const appointmentLoading =
    upcomingAppointmentsLoading || upcomingAppointmentsFetching;

  // Filter out booked timeslots
  const bookedTimeslots = upcomingAppointments.map(
    appointment => appointment.time,
  );

  const { availableAMTimeslots, availablePMTimeslots } = useMemo(
    () => getAvailableTimeslots(bookedTimeslots, new Date(selectedDate)),
    [bookedTimeslots, selectedDate],
  );

  useEffect(() => {
    const today = new Date();
    let start: Date;

    // Check if the selected month is the same as the current month and year
    if (
      isSameMonth(selectedMonth, today) &&
      isBefore(startOfMonth(selectedMonth), today)
    ) {
      start = today;
    } else {
      start = startOfMonth(selectedMonth);
    }

    const end: Date = endOfMonth(selectedMonth);
    const range: string[] = eachDayOfInterval({ start, end }).map(day =>
      format(day, 'yyyy-MM-dd'),
    );
    setDateRange(range);

    dispatch(setSelectedDate(new Date(range[0]).toISOString()));
  }, [selectedMonth, dispatch]);

  const handleMonthChange = (value: Date | null) => {
    if (value) setSelectedMonth(value);
  };

  const handleDateSelection = useCallback(
    (date: string) => () => {
      const timePart = selectedTimeslot
        ? selectedTimeslot.split(' ')[0]
        : '00:00';
      const [year, month, day] = date.split('-');
      const [hours, minutes] = timePart.split(':');

      // Create a new Date object with the correct year, month, day, hours, and minutes
      const selectedDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is zero-indexed
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
      );

      // const testDate = new Date(selectedDateTime);
      // console.log(testDate);

      // Adjust the selected date and time by adding 5 hours and 30 minutes
      selectedDateTime.setHours(selectedDateTime.getHours() + 5);
      selectedDateTime.setMinutes(selectedDateTime.getMinutes() + 30);

      dispatch(setSelectedDate(selectedDateTime.toISOString()));
      dispatch(setSelectedTimeslot(null));
    },
    [dispatch, selectedTimeslot, setSelectedDate],
  );

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
        const maxScrollLeft =
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
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
        const maxScrollLeft =
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
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

  const renderAppointmentTimeslots = () => {
    return (
      <>
        {/* Render AM timeslots */}

        <Typography variant="button" color={'secondary'} gutterBottom>
          Select a Timeslot
        </Typography>
        <Box mt={2}>
          {availableAMTimeslots.length > 0 && (
            <Box mt={1}>
              <Typography
                variant="button"
                color={'text.secondary'}
                align="center"
              >
                Morning
              </Typography>
              <Stack flexWrap={'wrap'} mt={2} direction="row" gap={2}>
                {availableAMTimeslots.map(timeslot => (
                  <Button
                    disabled={!timeslot.available || !selectedDoctor}
                    key={timeslot.timeslot}
                    variant={
                      selectedTimeslot === timeslot.timeslot
                        ? 'contained'
                        : 'outlined'
                    }
                    onClick={() =>
                      dispatch(setSelectedTimeslot(timeslot.timeslot))
                    }
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
              <Typography
                variant="button"
                color={'text.secondary'}
                align="center"
              >
                Afternoon
              </Typography>
              <Stack flexWrap={'wrap'} mt={2} direction="row" gap={2}>
                {availablePMTimeslots.map(timeslot => (
                  <Button
                    disabled={!timeslot.available || !selectedDoctor}
                    key={timeslot.timeslot}
                    variant={
                      selectedTimeslot === timeslot.timeslot
                        ? 'contained'
                        : 'outlined'
                    }
                    onClick={() =>
                      dispatch(setSelectedTimeslot(timeslot.timeslot))
                    }
                  >
                    {timeslot.timeslot}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </>
    );
  };

  return (
    <>
      <Box p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <CustomDatePicker
              views={['month']}
              label="Month"
              minDate={new Date()}
              value={selectedMonth}
              onChange={handleMonthChange}
              format="MMMM" //Shows only months
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FieldAutocomplete
              label="Doctor"
              options={doctors}
              getOptionLabel={option =>
                `${option.firstName} ${option.lastName}`
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={selectedDoctor}
              onChange={newValue => {
                dispatch(setSelectedDoctor(newValue));
              }}
              loading={doctorLoading || doctorFetching}
            />
          </Grid>
        </Grid>
        <Box
          mt={2}
          gap={4}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <IconButton
            color="primary"
            onClick={scrollLeft}
            disabled={scrollPosition === 0}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <StyledScrollBox ref={scrollRef}>
            <Stack direction="row" spacing={4} px={2} py={2}>
              {dateRange.map((date, index) => {
                const selected = isSameDay(
                  new Date(selectedDate),
                  new Date(date),
                );
                return (
                  <Button
                    color="secondary"
                    key={index}
                    disabled={!selectedDoctor}
                    variant={selected ? 'contained' : 'outlined'}
                    onClick={handleDateSelection(date)}
                  >
                    {format(new Date(date), 'dd E')}
                  </Button>
                );
              })}
            </Stack>
          </StyledScrollBox>
          <IconButton
            color="primary"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
        <Box
          height={'50vh'}
          px={1}
          mt={2}
          flexDirection={'column'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={appointmentLoading ? 'center' : 'flex-start'}
        >
          {appointmentLoading ? (
            <CircularProgress />
          ) : (
            renderAppointmentTimeslots()
          )}
        </Box>
      </Box>
      <Button
        variant="contained"
        size="small"
        disabled={!selectedDate || !selectedDoctor || !selectedTimeslot}
        onClick={handleNext}
        sx={{ mt: 1, mr: 1 }}
      >
        Continue
      </Button>
    </>
  );
};

export default DateDoctorSelection;
