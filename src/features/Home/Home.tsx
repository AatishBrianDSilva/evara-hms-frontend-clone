import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import React, { useState } from "react";
import AnalyticsSection from "./AnalyticsSection";
import AppointmentsSection from "./AppointmentsSection";
import { Typography } from "@mui/material";
import CustomeDateRangePicker from "../../components/CustomDateRangePicker/CustomDateRangePicker";
import { RangeKeyDict } from "react-date-range";
import { endOfWeek, startOfWeek } from "date-fns";
import PatientsSection from "./PatientsSection";
import PharmacySection from "./PharmacySection";

const Home: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [endDate, setEndDate] = useState<Date | null>(endOfWeek(new Date(), {
    weekStartsOn: 1
  }));

  const handleDateChange = (ranges: RangeKeyDict) => {
    if (ranges.selection) {
      setStartDate(ranges.selection.startDate ?? null);
      setEndDate(ranges.selection.endDate ?? null);
    }
  };


  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: "1 1 auto",
        maxWidth: "100%",
      }}
    >
      <Paper
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          backgroundColor: "#f6f6f6",
        }}
      >
        <Box
          padding={2}
          sx={{ display: "flex", flexDirection: "column", flex: "1 1 auto", overflow: "auto" }}
        >
          {/* Flexbox layout for Summary - Full width with even width cards */}
          <Box display="flex" flexDirection="column" width="100%" gap={2} pb={2}>
            {/* Summary Section - Full width */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Summary
              </Typography>
              <CustomeDateRangePicker onChange={handleDateChange} />
            </Box>

            {/* Analytics Section with evenly spaced cards */}
            <Box display="flex" justifyContent="space-between" gap={2}>
              <AnalyticsSection startDate={startDate} endDate={endDate} />
            </Box>
          </Box>
          {/* <Divider sx={{ my: 2 }} /> */}
          {/* Appointments Section - Full width */}
          <Box display="flex" flexDirection="column" width="100%" gap={2} pb={2}>
            {/* <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Upcoming Appointments
            </Typography> */}
            <AppointmentsSection startDate={startDate} endDate={endDate} />
          </Box>
          {/* <Divider sx={{ my: 2 }} /> */}
          {/* Other sections (Patients and Pharmacy) */}
          <Box display="flex" flexDirection="column" gap={2}>
            <PatientsSection startDate={startDate} endDate={endDate} />
            {/* <Divider /> */}
            <PharmacySection startDate={startDate} endDate={endDate} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
