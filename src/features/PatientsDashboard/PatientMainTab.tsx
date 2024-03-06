import { Healing, Moving, Receipt, Restore, Summarize, TextSnippet } from '@mui/icons-material';
import { Box, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { CalendarIcon } from '@mui/x-date-pickers';
import React, { useState } from 'react'
import TabPanel from '../../components/Utils/TabPanel';
import History from './History';
import Notes from './Notes';
import PatientJourneyTabs from './PatientJourneyTabs';

const PatientMainTab
  = () => {
    const theme = useTheme()
    const [patientMainTabValue, setPatientMainTabValue] = useState(0);

    const handleMainTabChange = (_: React.SyntheticEvent, newValue: number) => {
      setPatientMainTabValue(newValue);
    };

    return (
      <>
        {/* Main Tab Section */}
        <Box my={2} border={`1px solid ${theme.palette.secondary.light}`} borderRadius={1}>
          <Tabs
            centered
            value={patientMainTabValue}
            onChange={handleMainTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            aria-label="Patient Main Tabs"
            sx={{ boxShadow: 3 }}
          >
            <Tab icon={<Moving fontSize='small' />} iconPosition='start' label="Journey" id='patient-main-tabpanel-0' />
            <Tab icon={<TextSnippet fontSize='small' />} iconPosition='start' label="Notes" id='patient-main-tabpanel-1' />
            <Tab icon={<Restore fontSize='small' />} iconPosition='start' label="History" id='patient-main-tabpanel-2' />
            <Tab icon={<CalendarIcon fontSize='small' />} iconPosition='start' label="Appointment" id='patient-main-tabpanel-3' />
            <Tab icon={<Healing fontSize='small' />} iconPosition='start' label="Pharmacy" id='patient-main-tabpanel-4' />
            <Tab icon={<Summarize fontSize='small' />} iconPosition='start' label="Report" id='patient-main-tabpanel-5' />
            <Tab icon={<Receipt fontSize='small' />} iconPosition='start' label="Billings" id='patient-main-tabpanel-6' />
          </Tabs>
        </Box>

        <Box
          p={2}
          borderRadius={1}
          border={`1px solid ${theme.palette.secondary.light}`}
          flex={"1 1 auto"}
        >
          <TabPanel id="patient-main" value={patientMainTabValue} index={0}>
            <PatientJourneyTabs />
          </TabPanel>
          <TabPanel id="patient-main" value={patientMainTabValue} index={1}>
            <Notes />
          </TabPanel>
          <TabPanel id="patient-main" value={patientMainTabValue} index={2}>
            <History />
          </TabPanel>

          {/* Additional TabPanels if necessary */}
        </Box>
      </>
    )
  }

export default PatientMainTab
