import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppointmentDetailCard from "../../components/AppointmentDetailCard/AppointmentDetailCard";
import { AssignmentLate, ArrowForward } from "@mui/icons-material";
import SkeletonAppointmentDetailCard from "../../components/AppointmentDetailCard/Skeleton";
import { useGetAppointmentSummaryQuery } from "../../services/homeApi";
import { IconButton } from "@mui/material";

interface AppointmentsSectionProps {
  startDate: Date | null;
  endDate: Date | null;
}

const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({ startDate, endDate }) => {
  const {
    data: appointmentsDataInRange,
    isLoading: isAppointmentLoading,
    isFetching: isAppointmentFetching,
  } = useGetAppointmentSummaryQuery(
    {
      dateRange: {
        startDate: startDate?.toISOString() || "",
        endDate: endDate?.toISOString() || "",
      },
    },
    {
      skip: !startDate || !endDate,
    }
  );

  const loading = isAppointmentLoading || isAppointmentFetching;
  const appointments = appointmentsDataInRange?.data || [];

  const handleArrowClick = () => {
    window.location.href = "/appointments"; // Redirect to the provided link URL
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      border="1px solid"
      borderColor="#D8D8D8"
      borderRadius={4}
      height="235px" // Total height including the heading and content
      overflow="hidden"
    >
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="72px"
        bgcolor="#FFEDE2"
        px={2}
      >
        {/* Title with Icon */}
        <Box display="flex" alignItems="center" gap={1}>
          <AssignmentLate fontSize="small" /> {/* Small icon next to the title */}
          <Typography variant="h6">Upcoming Appointments</Typography>
        </Box>

        {/* Arrow Icon */}
        <IconButton size="small" color="inherit" onClick={handleArrowClick}>
          <ArrowForward fontSize="small" />
        </IconButton>
      </Box>

      {/* Content Section */}
      <Box
        display="flex"
        flexDirection="row"
        p={2}
        gap={2}
        flexGrow={1}
        overflow="auto"
        bgcolor="white"
      >
        {loading ? (
          [1, 2, 3].map((_, index) => <SkeletonAppointmentDetailCard key={index} />)
        ) : appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Box
              display="flex"
              key={appointment._id}
              justifyContent="flex-start"
              alignItems="center"
            >
              <AppointmentDetailCard
                doctorName={appointment.doctorId.firstName + " " + appointment.doctorId.lastName}
                doctorPhotoUrl={appointment.doctorId.image}
                patientName={appointment.fullName}
                patientPhoneNumber={appointment.phone}
              />
            </Box>
          ))
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flex={1}
            height={175} // Adjust height to fit nicely in the container
          >
            <Box display="flex" alignItems="center" sx={{ m: 2 }}>
              <AssignmentLate color="info" sx={{ mr: 1 }} />
              <Typography variant="body1" color="textSecondary">
                No new appointments
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AppointmentsSection;
