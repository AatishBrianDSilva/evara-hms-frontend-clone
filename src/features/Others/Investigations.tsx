import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TreatmentCyclesTable from './TreatmentCyclesTable';
import PatientInfo from './PatientInfo';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CustomDataGrid from '../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { VisuallyHiddenInput } from '../../components/Utils/VisuallyHiddenInput';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';

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

const DTFemaleUltraSoundScanColumn: GridColDef[] = [
  { field: 'scan_type', headerName: 'Scan Type', flex: 1 },
  { field: 'impression', headerName: 'Impression', flex: 1 },
  { field: 'done_on', headerName: 'Done On', flex: 1 },
  { field: 'done_by', headerName: 'Done By', flex: 1 },
  { field: 'view', headerName: 'View', flex: 1 },
  { field: 'delete', headerName: 'Delete', flex: 1 },
];

const DTFemaleBaseLineFollicularMonitoringColumn: GridColDef[] = [
  { field: 'lmp', headerName: 'LMP', flex: 1 },
  { field: 'date', headerName: 'Date', flex: 1 },
  { field: 'day', headerName: 'Day', flex: 1 },
  { field: 'right', headerName: 'Right', flex: 1 },
  { field: 'left', headerName: 'Left', flex: 1 },
  { field: 'et', headerName: 'ET', flex: 1 },
  { field: 'doctor_remarks', headerName: 'Doctor Remarks', flex: 1 },
  { field: 'action', headerName: 'Action', flex: 1 },
  { field: 'print', headerName: 'Print', flex: 1 },
];
const DTFelmaleEndrometrialAssementColumn: GridColDef[] = [
  { field: 'date', headerName: 'Date', flex: 1 },
  { field: 'indication', headerName: 'Indication', flex: 1 },
  { field: 'impression', headerName: 'Impression', flex: 1 },
  { field: 'remarks', headerName: 'Remarks', flex: 1 },
  { field: 'done_by', headerName: 'Done By', flex: 1 },
  { field: 'view', headerName: 'View', flex: 1 },
  { field: 'delete', headerName: 'Delete', flex: 1 },
];
const DTFelmaleEarlyPregancnyScanReportColumn: GridColDef[] = [
  { field: 'sacn_type', headerName: 'Scan Type', flex: 1 },
  { field: 'impression', headerName: 'Impression', flex: 1 },
  { field: 'done_on', headerName: 'Done On', flex: 1 },
  { field: 'done_by', headerName: 'Done By', flex: 1 },
  { field: 'view', headerName: 'View', flex: 1 },
  { field: 'delete', headerName: 'Delete', flex: 1 },
];

const DTMaleSemenAnalysisColumn: GridColDef[] = [
  { field: 'processed_by', headerName: 'Processed By', flex: 1 },
  { field: 'processed_on', headerName: 'Processed On', flex: 1 },
  { field: 'view', headerName: 'View', flex: 1 },
  { field: 'delete', headerName: 'Delete', flex: 1 },
];
const DTMaleSpermDFIColumn: GridColDef[] = [
  { field: 'patient_name', headerName: 'Patient Name', flex: 1 },
  { field: 'created_at', headerName: 'Created At', flex: 1 },
  { field: 'created_by', headerName: 'Created By', flex: 1 },
];

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

  const renderFemaleEarlyPregancnyScanReport = () => {
    return (
      <>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={2}
        >
          <Button variant="contained" sx={{ width: 'fit-content' }}>
            Add New
          </Button>
          <TextField label="Search" />
        </Box>

        <CustomDataGrid
          rows={[]}
          columns={DTFelmaleEarlyPregancnyScanReportColumn}
          pageSizeOptions={[5, 10]}
        />
      </>
    );
  };

  const renderFemaleEndrometrialAssement = () => {
    return (
      <>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={2}
        >
          <Button variant="contained" sx={{ width: 'fit-content' }}>
            Add New
          </Button>
          <TextField label="Search" />
        </Box>

        <CustomDataGrid
          rows={[]}
          columns={DTFelmaleEndrometrialAssementColumn}
          pageSizeOptions={[5, 10]}
        />
      </>
    );
  };

  const renderFemaleBaseLineFollicularMonitoring = () => {
    return (
      <>
        <Box
          gap={2}
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}
          mb={2}
        >
          <Button variant="contained" sx={{ width: 'fit-content' }}>
            Add Follicular Tracking
          </Button>
          <CustomDatePicker label="Start Date" />
          <CustomDatePicker label="End Date" />
        </Box>

        <CustomDataGrid
          rows={[]}
          columns={DTFemaleBaseLineFollicularMonitoringColumn}
          pageSizeOptions={[5, 10]}
        />
      </>
    );
  };

  const renderFemaleUltraSoundScan = () => {
    return (
      <>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={2}
        >
          <Button variant="contained" sx={{ width: 'fit-content' }}>
            Add New
          </Button>
          <TextField label="Search" />
        </Box>

        <CustomDataGrid
          rows={[]}
          columns={DTFemaleUltraSoundScanColumn}
          pageSizeOptions={[5, 10]}
        />

        <Typography variant="subtitle1" mb={2} mt={2}>
          Baseline Scan
        </Typography>
        <Grid container gap={2}>
          <Grid item xs={12} md={6} lg={2}>
            <TextField fullWidth select label="Scan Type">
              <MenuItem value="baseline scan">Baseline Scan</MenuItem>
              <MenuItem value="sono hysterogram">Sono Hysterogram</MenuItem>
              <MenuItem value="baseline scan and sono hysterogram">
                Baseline Scan and Sono Hysterogram
              </MenuItem>
              <MenuItem value="pelvic organ scan">Pelvic Organ Scan</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <CustomDatePicker label="LMP Date" />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <CustomDatePicker label="Requested Date" />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <CustomDatePicker label="Date Of Scan" />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <TextField label="Day Of Cycle" fullWidth />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" mt={2}>
          Pelvis
        </Typography>
        <Grid container direction={'column'} mb={2}>
          <Grid item xs={12} md={6} lg={6}>
            <FormControlLabel
              label="TransAbdominal"
              control={
                <Checkbox
                  id="register-isPatientSurrogate-id"
                  name="isPatientSurrogate"
                />
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <FormControlLabel
              label="Transvaginal Sonography"
              control={
                <Checkbox
                  id="register-isPatientSurrogate-id"
                  name="isPatientSurrogate"
                />
              }
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth select label="Uterus Appeared">
              <MenuItem>A</MenuItem>
              <MenuItem>B</MenuItem>
              <MenuItem>C</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField multiline fullWidth label="Description" />
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Uterus Measurement (cm)" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Anterior Wall" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Posterior Wall" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Uterus Volume" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Uterocervical length measured (cm)" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Uterine length measured (cm)" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Cervical length measured (cm)" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField multiline fullWidth label="Myometrium" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField multiline fullWidth label="Cavity echo appeared" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              multiline
              fullWidth
              label="Endometrial thickness measuring"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField multiline fullWidth label="Any Other Pathology" />
          </Grid>
        </Grid>

        <Typography variant="subtitle1">Right ovary</Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={12} lg={12}>
            <FormControlLabel
              label=" Not Visualized"
              control={
                <Checkbox
                  id="register-isPatientSurrogate-id"
                  name="isPatientSurrogate"
                />
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Volume" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Right Ovary Measurement (cm)" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Right Ovary Small Follicles" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField multiline fullWidth label="Right Ovary AFC" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Right Dominant follicle/Cyst " />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Accessibility" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField multiline fullWidth label="Right Adnexa" />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" mt={2}>
          Left ovary
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={12} lg={12}>
            <FormControlLabel
              label=" Not Visualized"
              control={
                <Checkbox
                  id="register-isPatientSurrogate-id"
                  name="isPatientSurrogate"
                />
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Volume" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Left Ovary Measurement (cm)" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Left Ovary Small Follicles" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField multiline fullWidth label="Left Ovary AFC" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Left Dominant follicle/Cyst " />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Accessibility" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField multiline fullWidth label="Left Adnexa" />
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6} lg={4}>
            <TextField multiline fullWidth label="Impression" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth select label="Doctor Name">
              <MenuItem>A</MenuItem>
              <MenuItem>B</MenuItem>
              <MenuItem>C</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField multiline fullWidth label="Doctor Remarks" />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Upload Images & Description
        </Typography>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12}>
            {/* Upload image button */}
            <Button
              component="label"
              variant="outlined"
              sx={{ width: 'fit-content' }}
              startIcon={<CloudUploadIcon />}
            >
              Upload Images
              <VisuallyHiddenInput
                onChange={() => {}}
                type="file"
                accept="image/*"
              />
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField label="Description" multiline minRows={2} fullWidth />
          </Grid>
        </Grid>
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={2}
        >
          <Button variant="contained">Save</Button>
          <Button variant="contained" color="secondary">
            Cancel
          </Button>
        </Box>
      </>
    );
  };

  const renderFemaleLabReports = () => {
    return (
      <Box>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Button variant="text">+ Add test</Button>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField label="Blood Group Typing" fullWidth />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Hb" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Platelets" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="FBS" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Lipid Profile" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="HbA1C" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="HIV" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="HbSAg" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="HCV" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="FSH" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="LH" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Prolactin" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="TSH" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="AMH" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="HPLC" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="S.Creatine" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Urine Culture" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="OGTT" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="KARYOTYPING" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="CUE" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="VITAMIN D" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Estradiol (E2)" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="BSR" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="RBC" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="TLC" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="NEUTROPHILS" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="LUMPHOCYTES" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="CBC" />
          </Grid>
        </Grid>
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={2}
          mt={2}
        >
          <Button variant="contained">Save</Button>
          <Button variant="contained" color="secondary">
            Print
          </Button>
        </Box>
      </Box>
    );
  };

  const renderMaleLabReports = () => {
    return (
      <Box>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Button variant="text">+ Add test</Button>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField label="Blood Group Typing" fullWidth />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Hb" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Platelets" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="FBS" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Lipid Profile" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="HbA1C" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="HIV" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="HbSAg" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="HCV" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="FSH" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="LH" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Prolactin" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="TSH" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="AMH" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="HPLC" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="S.Creatine" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Urine Culture" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="OGTT" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="KARYOTYPING" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="CUE" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="VITAMIN D" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="Estradiol (E2)" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="BSR" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="RBC" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="TLC" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="NEUTROPHILS" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="LUMPHOCYTES" />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField fullWidth label="CBC" />
          </Grid>
        </Grid>
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={2}
          mt={2}
        >
          <Button variant="contained">Save</Button>
          <Button variant="contained" color="secondary">
            Print
          </Button>
        </Box>
      </Box>
    );
  };

  const renderMaleSemenAnalysis = () => {
    return (
      <>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={2}
        >
          <Button variant="contained" sx={{ width: 'fit-content' }}>
            Add New
          </Button>
        </Box>

        <CustomDataGrid
          rows={[]}
          columns={DTMaleSemenAnalysisColumn}
          pageSizeOptions={[5, 10]}
        />
      </>
    );
  };

  const renderMaleSpermDFI = () => {
    return (
      <>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={2}
        >
          <Button variant="contained" sx={{ width: 'fit-content' }}>
            Add New
          </Button>
        </Box>

        <CustomDataGrid
          rows={[]}
          columns={DTMaleSpermDFIColumn}
          pageSizeOptions={[5, 10]}
        />
      </>
    );
  };

  return (
    <div className="main-container">
      <Box sx={{ marginTop: 1 }}>
        <PatientInfo />
      </Box>

      <TreatmentCyclesTable />

      <Box mt={2} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="investigations-tabs"
          variant="scrollable"
        >
          <Tab
            label="Female"
            id="investigations-tab-0"
            aria-controls="investigations-tabpanel-0"
          />
          <Tab
            label="Male"
            id="investigations-tab-1"
            aria-controls="investigations-tabpanel-1"
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={nestedValue}
            onChange={handleNestedChange}
            aria-label="nested-tabs"
            variant="scrollable"
          >
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
          {renderFemaleLabReports()}
        </CustomTabPanel>
        <CustomTabPanel value={nestedValue} index={1}>
          {/* Content for Nested Tab 2 */}
          {renderFemaleUltraSoundScan()}
        </CustomTabPanel>
        <CustomTabPanel value={nestedValue} index={2}>
          {/* Content for Nested Tab 1 */}
          {renderFemaleBaseLineFollicularMonitoring()}
        </CustomTabPanel>
        <CustomTabPanel value={nestedValue} index={3}>
          {/* Content for Nested Tab 2 */}
          {renderFemaleEndrometrialAssement()}
        </CustomTabPanel>
        <CustomTabPanel value={nestedValue} index={4}>
          {/* Content for Nested Tab 2 */}
          {renderFemaleEarlyPregancnyScanReport()}
        </CustomTabPanel>
        {/* Add more CustomTabPanel for additional nested content */}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={nestedValue}
            onChange={handleNestedChange}
            aria-label="nested-tabs"
            variant="scrollable"
          >
            <Tab label="Lab Reports" />
            <Tab label="Semen Analysis" />
            <Tab label="Sperm DFI" />
          </Tabs>
        </Box>
        {/* Content for nested tabs */}
        <CustomTabPanel value={nestedValue} index={0}>
          {/* Content for Nested Tab 1 */}
          {renderMaleLabReports()}
        </CustomTabPanel>
        <CustomTabPanel value={nestedValue} index={1}>
          {/* Content for Nested Tab 2 */}
          {renderMaleSemenAnalysis()}
        </CustomTabPanel>
        <CustomTabPanel value={nestedValue} index={2}>
          {/* Content for Nested Tab 1 */}
          {renderMaleSpermDFI()}
        </CustomTabPanel>
        {/* Add more CustomTabPanel for additional nested content */}
      </CustomTabPanel>
    </div>
  );
};

export default Investigations;
