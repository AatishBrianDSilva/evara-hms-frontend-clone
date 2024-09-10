import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Link } from '@mui/material';
// import AppointmentSummaryCard from '../../components/AppointmentSummaryCard/AppointmentSummaryCard';
import AppointmentDetailCard from '../../components/AppointmentDetailCard/AppointmentDetailCard';
import { ArrowForward, AssignmentLate } from '@mui/icons-material';
// import SkeletonAppointmentSummaryCard from '../../components/AppointmentSummaryCard/Skeleton';
import SkeletonAppointmentDetailCard from '../../components/AppointmentDetailCard/Skeleton';
import { useGetAppointmentSummaryQuery } from '../../services/homeApi';

interface AppointmentsSectionProps {
  startDate: Date | null;
  endDate: Date | null;
}

const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({
  startDate,
  endDate,
}) => {

  const { data: appointmentsDataInRange, isLoading: isAppointmentLoading, isFetching: isAppointmentFetching } =
    useGetAppointmentSummaryQuery(
      {
        dateRange: {
          startDate: startDate?.toISOString() || '',
          endDate: endDate?.toISOString() || '',
        },
      },
      {
        skip: !startDate || !endDate,
      }
    );

  const loading = isAppointmentLoading || isAppointmentFetching;

  console.log("AppointmentsSection -> appointmentsDataInRange", appointmentsDataInRange)

  const appointments = appointmentsDataInRange?.data || [];

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="button" color="primary">Upcoming Appointments</Typography>
      </Box>

      <Box
        display={"flex"}
        border="1px solid"
        overflow={"auto"}
        borderColor="primary.main"
        borderRadius={4}
        p={2}
        height={150}
        gap={2}
      >

        {loading ? (
          [1, 2, 3].map((_, index) => (
            <SkeletonAppointmentDetailCard key={index} />
          ))
        ) : appointments && appointments.length > 0 ? (
          appointments.map(appointment => (
            <Box display="flex" key={appointment._id} justifyContent={"center"} alignItems={"center"}>
              <AppointmentDetailCard
                doctorName={appointment.doctorId.firstName + ' ' + appointment.doctorId.lastName}
                doctorPhotoUrl={appointment.doctorId.image}
                patientName={appointment.fullName}
                patientPhoneNumber={appointment.phone}
              />
            </Box>
          ))
        ) : (
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flex={1} height={175}>
            <Box display="flex" alignItems="center" sx={{ m: 2 }}>
              <AssignmentLate color="info" sx={{ mr: 1 }} />
              <Typography variant="body1" color="textSecondary">
                No new appointments
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="text"
          color="primary"
          endIcon={<ArrowForward />}
          component={Link}
          href={"/appointments"}
        >
          View All
        </Button>
      </Box>
    </Box>
  );
};

export default AppointmentsSection;

// const noOfAppointments = appointments?.length || 0;
// const scheduledAppointments = appointments?.filter(a => a.status === 'Scheduled').length || 0;
// const reportedAppointments = appointments?.filter(a => a.status === 'Reported').length || 0;
// const completedAppointments = appointments?.filter(a => a.status === 'Completed').length || 0;
// const cancelledAppointments = appointments?.filter(a => a.status === 'Cancelled').length || 0;

{/* {loading ? (
  <SkeletonAppointmentSummaryCard />
) : (
  <AppointmentSummaryCard
    noOfAppointments={noOfAppointments}
    scheduledAppointments={scheduledAppointments}
    reportedAppointments={reportedAppointments}
    completedAppointments={completedAppointments}
    cancelledAppointments={cancelledAppointments}
  />
)} */}