import {
  Healing,
  Moving,
  Receipt,
  Restore,
  Summarize,
  TextSnippet,
} from '@mui/icons-material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTheme } from '@mui/material';
import { CalendarIcon } from '@mui/x-date-pickers';
import { Outlet, useParams } from 'react-router-dom';
import useTabNavigation from '../../hooks/useTabNavigation';
import { EPatientTabPaths } from '../../types/global';

const PatientMainTab = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();

  const basePath = `/patient/${id}`;
  const { activeTab, handleTabChange } = useTabNavigation(
    basePath,
    Object.values(EPatientTabPaths),
  );

  return (
    <Box display={'flex'} flexDirection={'column'} flex={1}>
      <Box
        my={2}
        border={`1px solid ${theme.palette.secondary.light}`}
        borderRadius={1}
      >
        <Tabs
          centered
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          aria-label="Patient Main Tabs"
          sx={{ boxShadow: 3 }}
        >
          <Tab
            icon={<Moving fontSize="small" />}
            iconPosition="start"
            label="Journey"
            id="patient-main-tabpanel-0"
          />
          <Tab
            icon={<TextSnippet fontSize="small" />}
            iconPosition="start"
            label="Notes"
            id="patient-main-tabpanel-1"
          />
          <Tab
            icon={<Restore fontSize="small" />}
            iconPosition="start"
            label="History"
            id="patient-main-tabpanel-2"
          />
          <Tab
            icon={<CalendarIcon fontSize="small" />}
            iconPosition="start"
            label="Appointment"
            id="patient-main-tabpanel-3"
          />
          <Tab
            icon={<Healing fontSize="small" />}
            iconPosition="start"
            label="Pharmacy"
            id="patient-main-tabpanel-4"
          />
          <Tab
            icon={<Summarize fontSize="small" />}
            iconPosition="start"
            label="Report"
            id="patient-main-tabpanel-5"
          />
          <Tab
            icon={<Receipt fontSize="small" />}
            iconPosition="start"
            label="Billings"
            id="patient-main-tabpanel-6"
          />
        </Tabs>
      </Box>

      <Box
        p={2}
        borderRadius={1}
        display={'flex'}
        flexDirection={'column'}
        border={`1px solid ${theme.palette.secondary.light}`}
        flex={'1 1 auto'}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default PatientMainTab;
