import React, { useState } from 'react'
import TabPanel from '../../components/Utils/TabPanel'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { AcUnit, HomeRepairService, Loop, PrecisionManufacturing, Science } from '@mui/icons-material'
import Investigations from './Investigations'
import Procedures from './Procedures'

const PatientJourneyTabs = () => {

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box>
        <Tabs
          centered
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          aria-label="Patient Secondary Tabs"
        >
          <Tab icon={<Science fontSize='small' />} iconPosition='top' label="Investigations" id='patient-secondary-tabpanel-0' />
          <Tab icon={<PrecisionManufacturing fontSize='small' />} iconPosition='top' label="Procedure" id='patient-secondary-tabpanel-1' />
          <Tab icon={<AcUnit fontSize='small' />} iconPosition='top' label="Cryo Preservation" id='patient-secondary-tabpanel-2' />
          <Tab icon={<HomeRepairService fontSize='small' />} iconPosition='top' label="Services" id='patient-secondary-tabpanel-3' />
          <Tab icon={<Loop fontSize='small' />} iconPosition='top' label="Cycle" id='patient-secondary-tabpanel-4' />
        </Tabs>
      </Box>

      <Box
        p={2}
        mt={2}
      >
        <TabPanel id="patient-secondary" value={tabValue} index={0}>
         <Investigations />
        </TabPanel>
        <TabPanel id="patient-secondary" value={tabValue} index={1}>
          <Box>
           <Procedures />
          </Box>
        </TabPanel>
        <TabPanel id="patient-secondary" value={tabValue} index={2}>
          <Box>
            <Typography variant="h6" color="text.secondary" component="div">
              Cryo Preservation
            </Typography>
          </Box>
        </TabPanel>
        <TabPanel id="patient-secondary" value={tabValue} index={3}>
          <Box>
            <Typography variant="h6" color="text.secondary" component="div">
              Services
            </Typography>
          </Box>
        </TabPanel>
        <TabPanel id="patient-secondary" value={tabValue} index={4}>
          <Box>
            <Typography variant="h6" color="text.secondary" component="div">
              Cycle
            </Typography>
          </Box>
        </TabPanel>
      </Box>
    </>
  )
}

export default PatientJourneyTabs