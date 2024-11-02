import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {
  AcUnit,
  HomeRepairService,
  Loop,
  PrecisionManufacturing,
  Science,
  NoteAdd,
  Timeline,
  LocalHospital,
} from '@mui/icons-material';
import { EJourneyTabPaths } from '../../../types/global';
import { Outlet, useParams } from 'react-router-dom';
import useTabNavigation from '../../../hooks/useTabNavigation';

const PatientJourneyTabs = () => {
  const { id } = useParams<{ id: string }>();

  const basePath = `/patient/${id}/journey`;
  const { activeTab, handleTabChange } = useTabNavigation(
    basePath,
    Object.values(EJourneyTabPaths),
  );

  return (
    <>
      <Tabs
        centered
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="Patient Secondary Tabs"
      >
        <Tab
          icon={<Timeline fontSize="small" />}
          iconPosition="top"
          label="TimeLine"
          id="patient-secondary-tabpanel-0"
        />

        <Tab
          icon={<Science fontSize="small" />}
          iconPosition="top"
          label="Investigations"
          id="patient-secondary-tabpanel-1"
        />

        <Tab
          icon={<LocalHospital fontSize="small" />}
          iconPosition="top"
          label="Packages"
          id="patient-secondary-tabpanel-2"
        />

        <Tab
          icon={<NoteAdd fontSize="small" />}
          iconPosition="top"
          label="Advice"
          id="patient-secondary-tabpanel-3"
        />

        <Tab
          icon={<PrecisionManufacturing fontSize="small" />}
          iconPosition="top"
          label="Procedure"
          id="patient-secondary-tabpanel-4"
        />
        <Tab
          icon={<AcUnit fontSize="small" />}
          iconPosition="top"
          label="Cryo Preservation"
          id="patient-secondary-tabpanel-5"
        />
        <Tab
          icon={<HomeRepairService fontSize="small" />}
          iconPosition="top"
          label="Services"
          id="patient-secondary-tabpanel-6"
        />
        <Tab
          icon={<Loop fontSize="small" />}
          iconPosition="top"
          label="Cycle"
          id="patient-secondary-tabpanel-7"
        />
      </Tabs>

      <Box p={2} display={'flex'} flexDirection={'column'} flex={1}>
        <Outlet />
      </Box>
    </>
  );
};

export default PatientJourneyTabs;
