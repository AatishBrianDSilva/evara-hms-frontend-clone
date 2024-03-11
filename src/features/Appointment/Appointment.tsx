import React, { useEffect, useState } from 'react';
import ContentSection from '../../components/ContentSection/ContentSection';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import { useFormik } from 'formik';
import { DatePicker } from '@mui/x-date-pickers';
import { format, eachDayOfInterval, endOfMonth, startOfMonth, isSameMonth, isBefore } from 'date-fns';

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

const Appointment: React.FC = () => {

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [dateRange, setDateRange] = useState<string[]>([]);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

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
  }, [selectedMonth]);

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
    }
  };

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
      handleScroll(); // Initialize state based on initial scroll position
    }

    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, [dateRange]); // dateRange affects the scrollWidth



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

  return (
    <ContentSection title="Appointments" icon={<CalendarMonth />}>
      <form onSubmit={formik.handleSubmit} >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <DatePicker
              views={['month', 'year']}
              label="Month"
              minDate={new Date()}
              value={selectedMonth}
              onChange={handleMonthChange}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="Doctor" name="doctor" value={formik.values.doctor} onChange={formik.handleChange}>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="Branch" name="branch" value={formik.values.branch} onChange={formik.handleChange}>
              {branches.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Box mt={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button variant="contained" onClick={scrollLeft} disabled={scrollPosition === 0} sx={{ flexShrink: 0 }}>&lt;</Button>
          <Box
            ref={scrollRef}
            sx={{
              margin: '0 8px', // Provide some spacing around the scrollable Box
              overflowX: 'auto',
              padding: '8px 0',
            }}
          >
            <Stack direction="row" spacing={4}>
              {dateRange.map((date, index) => (
                <Button
                  key={index}
                  variant={formik.values.date === date ? 'contained' : 'outlined'}
                  onClick={() => formik.setFieldValue('date', date)}
                  sx={{ margin: '0 8px' }} // Keeps spacing between buttons
                >
                  {format(new Date(date), 'dd E')}
                </Button>
              ))}
            </Stack>
          </Box>
          <Button variant="contained" onClick={scrollRight} disabled={canScrollRight} sx={{ flexShrink: 0 }}>&gt;</Button>
        </Box>
      </form>
    </ContentSection>
  );
};

export default Appointment;
