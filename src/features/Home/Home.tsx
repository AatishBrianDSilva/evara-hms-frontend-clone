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

const Home: React.FC = () => {


  const [startDate, setStartDate] = useState<Date | null>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState<Date | null>(endOfWeek(new Date(), { weekStartsOn: 1 }));

  const handleDateChange = (ranges: RangeKeyDict) => {
    if (ranges.selection) {
      if (ranges.selection.startDate) setStartDate(ranges.selection.startDate);
      if (ranges.selection.endDate) setEndDate(ranges.selection.endDate);
    }
  };

  console.log("Home -> startDate", startDate)
  console.log("Home -> endDate", endDate)

  return (
    <ContentSection title="Home" icon={<HomeOutlined />}>
      <Box display="flex" justifyContent="flex-end" >
        <CustomeDateRangePicker
          onChange={handleDateChange}
        />
      </Box>

      <Box display="flex" flexDirection="column" gap={2} >

        <AnalyticsSection startDate={startDate} endDate={endDate} />

        <Divider />

        <AppointmentsSection startDate={startDate} endDate={endDate} />

        <Divider />

        <PatientsSection startDate={startDate} endDate={endDate} />

        <Divider />

        <PharmacySection startDate={startDate} endDate={endDate} />
      </Box>
    </ContentSection>
  );
};

export default Home;
