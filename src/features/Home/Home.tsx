import { HomeOutlined } from "@mui/icons-material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import ContentSection from "../../components/ContentSection/ContentSection";

import AnalyticsSection from "./AnalyticsSection";
import AppointmentsSection from "./AppointmentsSection";
import { Divider } from "@mui/material";
import CustomeDateRangePicker from "../../components/CustomDateRangePicker/CustomDateRangePicker";
import { RangeKeyDict } from "react-date-range";
import { endOfWeek, startOfWeek } from "date-fns";
import PatientsSection from "./PatientsSection";
import PharmacySection from "./PharmacySection";

const toUTC = (date: Date | null, isEndDate = false) => {
  if (!date) return null;

  if (isEndDate) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59));
  } else {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
  }
};
const Home: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [endDate, setEndDate] = useState<Date | null>(endOfWeek(new Date(), { weekStartsOn: 1 }));

  const handleDateChange = (ranges: RangeKeyDict) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  const startDateUTC = toUTC(startDate);
  const endDateUTC = toUTC(endDate, true);

  console.log("Home -> startDate", startDateUTC);
  console.log("Home -> endDate", endDateUTC);

  return (
    <ContentSection title="Home" icon={<HomeOutlined />}>
      <Box display="flex" justifyContent="flex-end">
        <CustomeDateRangePicker onChange={handleDateChange} />
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <AnalyticsSection startDate={startDateUTC} endDate={endDateUTC} />

        <Divider />

        <AppointmentsSection startDate={startDateUTC} endDate={endDateUTC} />

        <Divider />

        <PatientsSection startDate={startDateUTC} endDate={endDateUTC} />

        <Divider />

        <PharmacySection startDate={startDateUTC} endDate={endDateUTC} />
      </Box>
    </ContentSection>
  );
};

export default Home;
