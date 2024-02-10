import React from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import TreatmentCyclesTable from './TreatmentCyclesTable';
import PatientInfo from './PatientInfo';

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
      id={`medical-records-tabpanel-${index}`}
      aria-labelledby={`medical-records-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box my={2} mx={1}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Investigations: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const [nestedValue, setNestedValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setNestedValue(0);
  };

  const handleNestedChange = (_: React.SyntheticEvent, newValue: number) => {
    setNestedValue(newValue);
  };

  const renderFemaleUltraSoundScan = () => {
    return (
      <div></div>
    )
  }

  return (
    <div className="main-container">
      <Box sx={{ marginTop: 1 }}>
        <PatientInfo />
      </Box>

      <TreatmentCyclesTable />

      <Box mt={2} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="investigations-tabs" variant="scrollable">
          <Tab label="Female" id="investigations-tab-0" aria-controls="investigations-tabpanel-0" />
          <Tab label="Male" id="investigations-tab-1" aria-controls="investigations-tabpanel-1" />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={nestedValue} onChange={handleNestedChange} aria-label="nested-tabs" variant="scrollable">
            <Tab label="Lab Reports" />
            <Tab label="Ultra Sound Scan" />
            <Tab label="Base Line Follicular Mointoring" />
            <Tab label="Endometrial Assessment" />
            <Tab label="Early Pregnancy Scan Report" />
          </Tabs>
        </Box>
        {/* Content for nested tabs */}
        <CustomTabPanel value={nestedValue} index={0}>
          {/* Content for Nested Tab 1 */}
          <Typography>Lab Reports</Typography>
        </CustomTabPanel>
        <CustomTabPanel value={nestedValue} index={1}>
          {/* Content for Nested Tab 2 */}
          {renderFemaleUltraSoundScan()}
        </CustomTabPanel>
        <CustomTabPanel value={nestedValue} index={2}>
          {/* Content for Nested Tab 1 */}
          <Typography>Base Line Follicular Mointoring</Typography>
        </CustomTabPanel>
        <CustomTabPanel value={nestedValue} index={3}>
          {/* Content for Nested Tab 2 */}
          <Typography>Endometrial Assessment</Typography>
        </CustomTabPanel>
        <CustomTabPanel value={nestedValue} index={4}>
          {/* Content for Nested Tab 2 */}
          <Typography>Early Pregnancy Scan Report</Typography>
        </CustomTabPanel>
        {/* Add more CustomTabPanel for additional nested content */}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={nestedValue} onChange={handleNestedChange} aria-label="nested-tabs" variant="scrollable">
            <Tab label="Lab Reports" />
            <Tab label="Semen Analysis" />
            <Tab label="Sperm DFI" />
          </Tabs>
        </Box>
        {/* Content for nested tabs */}
        <CustomTabPanel value={nestedValue} index={0}>
          {/* Content for Nested Tab 1 */}
          <Typography>Lab Reports</Typography>
        </CustomTabPanel>
        <CustomTabPanel value={nestedValue} index={1}>
          {/* Content for Nested Tab 2 */}
          <Typography>Semen Analysis</Typography>
        </CustomTabPanel>
        <CustomTabPanel value={nestedValue} index={2}>
          {/* Content for Nested Tab 1 */}
          <Typography>Sperm DFI</Typography>
        </CustomTabPanel>
        {/* Add more CustomTabPanel for additional nested content */}
      </CustomTabPanel>
    </div>
  );
};

export default Investigations;
