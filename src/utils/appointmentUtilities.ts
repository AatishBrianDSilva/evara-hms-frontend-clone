export type Timeslot = {
  timeslot: string;
  available: boolean;
};

export const amTimeslots: string[] = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
];
export const pmTimeslots: string[] = [
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
];

// Function to check if a timeslot is before the current time
export const isTimeslotPast = (
  timeslot: string,
  selectedDate: Date,
): boolean => {
  if (!(selectedDate instanceof Date && !isNaN(selectedDate.valueOf()))) {
    throw new Error('Invalid date provided');
  }

  // Ensure we format the date part correctly
  const datePart = selectedDate.toDateString();

  // Create the Date object with a more reliable formatting approach
  const dateTimeString = `${datePart} ${timeslot}`;
  const selectedDateWithTime = new Date(dateTimeString);

  // Debugging to see the result of our date-time string
  console.log('DateTime String:', dateTimeString); // Check the output here
  console.log('Selected Date With Time:', selectedDateWithTime); // Check the output here

  const currentDate = new Date();
  return selectedDateWithTime < currentDate;
};

export const calculateAvailableTimeslots = (
  timeslots: string[],
  bookedTimeslots: string[],
  selectedDate: Date,
): Timeslot[] => {
  return timeslots.map(timeslot => ({
    timeslot,
    available:
      !bookedTimeslots.includes(timeslot) &&
      !isTimeslotPast(timeslot, selectedDate),
  }));
};

export const getAvailableTimeslots = (
  bookedTimeslots: string[],
  selectedDate: Date,
): { availableAMTimeslots: Timeslot[]; availablePMTimeslots: Timeslot[] } => {
  return {
    availableAMTimeslots: calculateAvailableTimeslots(
      amTimeslots,
      bookedTimeslots,
      selectedDate,
    ),
    availablePMTimeslots: calculateAvailableTimeslots(
      pmTimeslots,
      bookedTimeslots,
      selectedDate,
    ),
  };
};
