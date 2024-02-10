import { Box, Tab, Tabs } from '@mui/material';
import React from 'react'
import RegistrationForm from './RegistrationForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const IVFRegistration = () => {

  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className='main-container'>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} visibleScrollbar scrollButtons={true} onChange={handleChange} variant='scrollable' aria-label="basic tabs example">
            <Tab label="Patients" {...a11yProps(0)} />
            <Tab label="Donor From bank" {...a11yProps(1)} />
            <Tab label="Donor From hospital" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <RegistrationForm />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Donor From bank
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Donor From bank
        </CustomTabPanel>
      </Box>
    </div>
  )
}

export default IVFRegistration