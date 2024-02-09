import { Box, Button, Checkbox, FormControlLabel, MenuItem, Tab, Tabs, TextField, Typography } from '@mui/material'
import React from 'react'
import CustomTable from '../../components/Table/Table'
import { GridColDef } from '@mui/x-data-grid';
import PatientInfo from './PatientInfo';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import TreatmentCyclesTable from './TreatmentCyclesTable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const biopsyColumn: GridColDef[] = [
  { field: 'id', headerName: 'PCR Tube ID', width: 150 },
  { field: 'status', headerName: 'Embryo ID/Cycle ID	', width: 200 },
  { field: 'treatment', headerName: 'No.of Cells Biopsied	', width: 200 },
  {
    field: 'startDate',
    headerName: 'Embryo Cell Stage(Day 3/Day 5)	',
    width: 200,
  },
  {
    field: 'attempt',
    headerName: 'Embryo Grade(Low/High)',
    width: 200,
  },
  {
    field: 'createdAt',
    headerName: 'Nucleus Seen(Y/N)',
    width: 200,
  },
  {
    field: 'createdBy',
    headerName: 'Cell Integrity Intact(I)/Lysed(L)',
    width: 200,
  },
  {
    field: "reason",
    headerName: "Comments",
    sortable: false,
    width: 200,
  }
];
const planDetailsColumn: GridColDef[] = [
  { field: 'id', headerName: 'Phase', width: 150 },
  { field: 'status', headerName: 'Dow	', width: 200 },
  { field: 'treatment', headerName: 'Date', width: 200 },
  {
    field: 'startDate',
    headerName: 'Day)	',
    width: 200,
  },
  {
    field: 'attempt',
    headerName: 'Type',
    width: 200,
  },
  {
    field: 'createdAt',
    headerName: 'Event',
    width: 200,
  },
  {
    field: 'createdBy',
    headerName: 'Result/Dose',
    width: 200,
  },
  {
    field: "reason",
    headerName: "Remarks",
    sortable: false,
    width: 200,
  }
];


function a11yProps(index: number) {
  return {
    id: `treatment-cycle-tab-${index}`,
    'aria-controls': `treatment-cycle-tabpanel-${index}`,
  };
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`treatment-cycle-tabpanel-${index}`}
      aria-labelledby={`treatment-cycle-tab-${index}`}
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

const TreatmentCycles: React.FC = () => {

  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const addNewCycle = () => {
    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} visibleScrollbar variant='scrollable' onChange={handleChange} aria-label="treatment-cycles-tabs">
            <Tab label="Intended Treatment" {...a11yProps(0)} />
            <Tab label="Gametes" {...a11yProps(1)} />
            <Tab label="PSG / PGD" {...a11yProps(2)} />
            <Tab label="Treatment Plan" {...a11yProps(3)} />
            <Tab label="Endometrial Monitoring" {...a11yProps(4)} />
            <Tab label="Plan Details" {...a11yProps(5)} />
            <Tab label="Summary" {...a11yProps(6)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {renderIntendedTreatment()}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {renderGametes()}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {renderPsgPgd()}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          {renderTreatmentPlan()}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          {renderTreatmentPlan()}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
          {renderPlanDetails()}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={6}>
        </CustomTabPanel>
      </>
    )
  }

  const renderIntendedTreatment = () => {
    return (
      <Box display={"flex"} justifyContent={"space-evenly"} alignItems={"flex-start"} gap={4}>
        <Box display={"flex"} flex={1} flexDirection={"column"} justifyContent={"flex-start"} alignContent={"flex-start"} gap={2}>
          <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Treatment Details</Typography>
          <TextField id="partner" label="Partner" select value="" >
            <MenuItem value="Mr">Absdcef - 123</MenuItem>
            <MenuItem value="Mrs">Xysad - 897</MenuItem>
            <MenuItem value="Miss">Zyfdf - 154</MenuItem>
          </TextField>
          <TextField id="doctor" label="Doctor" select value="" >
            <MenuItem value="Mr">Absdcef - 123</MenuItem>
            <MenuItem value="Mrs">Xysad - 897</MenuItem>
            <MenuItem value="Miss">Zyfdf - 154</MenuItem>
          </TextField>
          <TextField id="doctor" label="Treatments" select value="" >
            <MenuItem value="Mr">Absdcef - 123</MenuItem>
            <MenuItem value="Mrs">Xysad - 897</MenuItem>
            <MenuItem value="Miss">Zyfdf - 154</MenuItem>
          </TextField>
          <DateTimePicker
            label="Est. start of treatment"
            value={null}
            onChange={() => { }}
          />
          <TextField id="attempts" label="Attempts" value="" />
          <TextField id="female-factor" label="Female Factor" select value="" >
            <MenuItem value="Mr">Absdcef - 123</MenuItem>
            <MenuItem value="Mrs">Xysad - 897</MenuItem>
            <MenuItem value="Miss">Zyfdf - 154</MenuItem>
          </TextField>
          <TextField id="male-factor" label="Male Factor" select value="" >
            <MenuItem value="Mr">Absdcef - 123</MenuItem>
            <MenuItem value="Mrs">Xysad - 897</MenuItem>
            <MenuItem value="Miss">Zyfdf - 154</MenuItem>
          </TextField>
          <FormControlLabel label="Treatment at other center" control={<Checkbox
            id='register-intepreter-id'
            name="Treatment at other center"
            value={true}
            onChange={() => { }}
          />} />
          <TextField multiline maxRows={2} minRows={2} label="Other Center Detail" value="" />
        </Box>
        <Box display={"flex"} flex={1} flexDirection={"column"} gap={2}>
          <Box display={"flex"} flex={1} flexDirection={"column"} gap={2}>
            <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Treatment Plan Usage</Typography>
            <TextField id="treatment-plan-usage" label="Treatment Usage Plan" select value="">
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField multiline maxRows={2} minRows={2} label="Remarks" value="" />
            <TextField label="Previous Cycles Count" />
          </Box>
          <Box display={"flex"} flex={1} flexDirection={"column"} gap={2}>
            <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Sentinel Dates</Typography>
            <Box display={"flex"} justifyContent={"space-between"} gap={2}>
              <Box display={"flex"} flex={1} flexDirection={"column"} gap={2}>
                <DatePicker
                  label="Start of follicular phase (LMP)"
                  value={null}
                  format='dd/MM/yyyy'
                  onChange={() => { }}
                />
                <DatePicker
                  label="Baseline scan"
                  value={null}
                  format='dd/MM/yyyy'
                  onChange={() => { }}
                />
                <DatePicker
                  label="Start date of stim medications"
                  value={null}
                  format='dd/MM/yyyy'
                  onChange={() => { }}
                />
              </Box>
              <Box marginTop={1}>
                <Button variant='contained' sx={{ width: 'fit-content' }}>
                  Day 1
                </Button>
              </Box>
            </Box>
            <DateTimePicker
              label="Trigger Date"
              value={null}
              format='dd/MM/yyyy'
              onChange={() => { }}
            />
            <DateTimePicker
              label="Egg Collection Date"
              value={null}
              format='dd/MM/yyyy'
              onChange={() => { }}
            />
            <DateTimePicker
              label="IUI Date"
              value={null}
              format='dd/MM/yyyy'
              onChange={() => { }}
            />
            <DateTimePicker
              label="LPS Date"
              value={null}
              format='dd/MM/yyyy'
              onChange={() => { }}
            />
            <DateTimePicker
              label="Embryo Transfer Date"
              value={null}
              format='dd/MM/yyyy'
              onChange={() => { }}
            />
            <DateTimePicker
              label="Pregnancy Test Date"
              value={null}
              format='dd/MM/yyyy'
              onChange={() => { }}
            />
          </Box>
        </Box>
      </Box>
    )
  }

  const renderGametes = () => {
    return (
      <Box display={"flex"} flexDirection={"column"} justifyContent={"space-evenly"} gap={4}>
        {/* 1st row */}
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} gap={4}>

          <Box display={"flex"} flex={1} flexDirection={"column"} gap={2} >
            <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Gametes Egg 1</Typography>
            <TextField id="gamete-name-eggs-1" label="Gamete Name" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="gamete-source-eggs-1" label="Gamete Source" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="source-verified-eggs-1" label="Source Verified" select value="" >
              <MenuItem value="yes">yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField id="procedure-eggs-1" label="Procedure" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
          </Box>

          <Box display={"flex"} flex={1} flexDirection={"column"} gap={2}>
            <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Gametes Egg 2</Typography>
            <TextField id="gamete-name-eggs-2" label="Gamete Name" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="gamete-source-eggs-2" label="Gamete Source" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="source-verified-eggs-2" label="Source Verified" select value="" >
              <MenuItem value="yes">yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField id="procedure-eggs-2" label="Procedure" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
          </Box>

        </Box>

        {/* 2nd row */}
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} gap={4}>

          <Box display={"flex"} flex={1} flexDirection={"column"} gap={2} >
            <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Gametes Sperm 1</Typography>
            <TextField id="gamete-name-sperm-1" label="Gamete Name" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="gamete-source-sperm-1" label="Gamete Source" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="source-verified-sperm-1" label="Source Verified" select value="" >
              <MenuItem value="yes">yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField id="procedure-sperm-1" label="Procedure" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
          </Box>

          <Box display={"flex"} flex={1} flexDirection={"column"} gap={2}>
            <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Gametes Sperm 2</Typography>
            <TextField id="gamete-name-sperm-2" label="Gamete Name" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="gamete-source-sperm-2" label="Gamete Source" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="source-verified-sperm-2" label="Source Verified" select value="" >
              <MenuItem value="yes">yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField id="procedure-sperm-2" label="Procedure" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
          </Box>

        </Box>

        {/* 3rd row */}
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} gap={4}>

          <Box display={"flex"} flex={1} flexDirection={"column"} gap={2} >
            <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Gametes Embryo</Typography>
            <TextField id="sperm-source-embryo" label="Sperm Source" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="egg-source-embryo" label="Egg Source" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="source-verified-embryo" label="Source Verified" select value="" >
              <MenuItem value="yes">yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField id="procedure-embryo" label="Procedure" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
          </Box>

          <Box display={"flex"} flex={1} flexDirection={"column"} gap={2}>
            <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Surrogate</Typography>
            <TextField id="surrogate-source" label="Surrogate Source" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="source-verified-eggs-2" label="Source Verified" select value="" >
              <MenuItem value="yes">yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField id="procedure-eggs-2" label="Procedure" select value="" >
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
          </Box>

        </Box>

        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={4}>
          <Button variant='contained' sx={{ width: 'fit-content', mt: 2, mb: 2 }}>
            Submit
          </Button>
        </Box>
      </Box >
    )
  }

  const renderPsgPgd = () => {
    return (
      <Box display={"flex"} flexDirection={"column"} justifyContent={"flex-start"} gap={2}>
        {/* 1st row */}
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} gap={4}>
          <TextField id="karyotype" label="Karyotype" fullWidth select value="" >
            <MenuItem value="yes">Absdcef - 123</MenuItem>
            <MenuItem value="no">Xysad - 897</MenuItem>
          </TextField>
        </Box>

        {/* 2nd row */}
        <Typography variant='subtitle1' mt={4} mb={2}>Clinical Reason(S) for Referral: Please Tick the Appropriate Choice(s)</Typography>
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} gap={4}>
          <Box display={"flex"} flex={1} flexDirection={"column"} gap={1} >
            <FormControlLabel sx={{ color: "grey.600" }} label="Screening for Chromosomal Aneuploidies" control={<Checkbox
              color='secondary'
              id='register-intepreter-id'
              name="Screening for Chromosomal Aneuploidies"
              value={true}
              onChange={() => { }}
            />} />
            <FormControlLabel sx={{ color: "grey.600" }} label="Organic Azoospermia" control={<Checkbox
              id='register-intepreter-id'
              name="Organic Azoospermia"
              value={true}
              onChange={() => { }}
            />} />
            <FormControlLabel sx={{ color: "grey.600" }} label="Organic Oligospermia" control={<Checkbox
              id='register-intepreter-id'
              name="Organic Oligospermia"
              value={true}
              onChange={() => { }}
            />} />
            <FormControlLabel sx={{ color: "grey.600" }} label="Sperm Donor" control={<Checkbox
              id='register-intepreter-id'
              name="Sperm Donor"
              value={true}
              onChange={() => { }}
            />} />
            <FormControlLabel sx={{ color: "grey.600" }} label="Male Infertility,Unspecified" control={<Checkbox
              id='register-intepreter-id'
              name="Male Infertility,Unspecified"
              value={true}
              onChange={() => { }}
            />} />
            <FormControlLabel sx={{ color: "grey.600" }} label="Spem Aneuploidy" control={<Checkbox
              id='register-intepreter-id'
              name="Spem Aneuploidy"
              value={true}
              onChange={() => { }}
            />} />
          </Box>

          <Box display={"flex"} flex={1} flexDirection={"column"} gap={1} >
            <FormControlLabel sx={{ color: "grey.600" }} label="Elevated Maternal Age(>v35 Years)" control={<Checkbox
              id='register-intepreter-id'
              name="Elevated Maternal Age(>v35 Years)"
              value={true}
              onChange={() => { }}
            />} />
            <FormControlLabel sx={{ color: "grey.600" }} label="Primary Ovarian Failure" control={<Checkbox
              id='register-intepreter-id'
              name="Primary Ovarian Failure"
              value={true}
              onChange={() => { }}
            />} />
            <FormControlLabel sx={{ color: "grey.600" }} label="Poor Obstetric/Reproductive History,First Trimester" control={<Checkbox
              id='register-intepreter-id'
              name="Poor Obstetric/Reproductive History,First Trimester"
              value={true}
              onChange={() => { }}
            />} />
            <FormControlLabel sx={{ color: "grey.600" }} label="Egg (Oocyte Donor)" control={<Checkbox
              id='register-intepreter-id'
              name="Egg (Oocyte Donor)r"
              value={true}
              onChange={() => { }}
            />} />
            <FormControlLabel sx={{ color: "grey.600" }} label="Female Infertility,Unspecified" control={<Checkbox
              id='register-intepreter-id'
              name="Female Infertility,Unspecified"
              value={true}
              onChange={() => { }}
            />} />
            <FormControlLabel sx={{ color: "grey.600" }} label="Other" control={<Checkbox
              id='register-intepreter-id'
              name="Other"
              value={true}
              onChange={() => { }}
            />} />
          </Box>
        </Box>
        <TextField multiline maxRows={2} minRows={2} label="If Others(Then Please Specify)" value="" />


        {/* 3rd row */}
        <Typography variant='h6' sx={{ mt: 4, mb: 2 }}>Biopsy Information</Typography>
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} gap={4}>
          <Box display={"flex"} flex={1} flexDirection={"column"} gap={2} >
            <TextField id="no-of-biopsies" label="No of Biopsies" value="" />
            <TextField id="sperm-source-embryo" label="Biopsy Method" select value="" >
              <MenuItem value="Mr">Laser</MenuItem>
              <MenuItem value="Mrs">Acid Tryodes</MenuItem>
              <MenuItem value="Miss">Mechanical</MenuItem>
            </TextField>
            <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Day of Biopsy:</Typography>
            <FormControlLabel sx={{ color: "grey.600" }} label="Day 3-Blastomere" control={<Checkbox
              id='register-intepreter-id'
              name="Day 3-Blastomere"
              value={true}
              onChange={() => { }}
            />} />
            <FormControlLabel sx={{ color: "grey.600" }} label="Day 5-Trophectoderm" control={<Checkbox
              id='register-intepreter-id'
              name="Day 5-Trophectoderm"
              value={true}
              onChange={() => { }}
            />} />
            <TextField id="source-verified-embryo" label="Biopsy Performed By" select value="" >
              <MenuItem value="yes">yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <DatePicker
              label="Biopsy Date"
              value={null}
              format='dd/MM/yyyy'
              onChange={() => { }}
            />
            <DateTimePicker
              label="Planned Date/Time of Embryo Transfer"
              value={null}
              format='dd/MM/yyyy'
              onChange={() => { }}
            />
            <TextField id="source-verified-embryo" label="All Embryos will be cryopreserved for future use(Y/N)" select value="" >
              <MenuItem value="yes">yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField id="source-verified-embryo" label="Results Needed for Fresh Embryo Transfer (Y/N)" select value="" >
              <MenuItem value="yes">yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField multiline maxRows={2} minRows={2} label="Result" value="" />

          </Box>

          <Box display={"flex"} flex={1} flexDirection={"column"} gap={2}>

          </Box>

        </Box>

        <Typography variant='subtitle1' sx={{ mt: 4, mb: 2, textDecorationLine: 'underline' }}>To Be Filled By Embryologist</Typography>
        <Button variant='contained' sx={{ width: 'fit-content', mt: 2, mb: 2 }}>
          Add Row
        </Button>
        <CustomTable columns={biopsyColumn} rows={[]} />

        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={4}>
          <Button variant='contained' color='info' sx={{ width: 'fit-content', mt: 2, mb: 2 }}>
            Save
          </Button>
          <Button variant='contained' sx={{ width: 'fit-content', mt: 2, mb: 2 }}>
            logo Print
          </Button>
          <Button variant='contained' color='info' sx={{ width: 'fit-content', mt: 2, mb: 2 }}>
            Print
          </Button>
        </Box>
      </Box >
    )
  }

  const renderTreatmentPlan = () => {
    return (
      <Box display={"flex"} justifyContent={"flex-start"} gap={2}>
        <Box display={"flex"} flex={2} flexDirection={"column"} gap={1}>
          <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Sentinel Dates</Typography>
          <DatePicker
            label="Treatment plan assigned"
            value={new Date()}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DatePicker
            label="Menstr.day1 before downreg"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DatePicker
            label="Baseline scan"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DatePicker
            label="Start of follicular phase (LMP)"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DatePicker
            label="Start date of stim medications"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DateTimePicker
            label="Trigger Date"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DateTimePicker
            label="Egg collection Date"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DateTimePicker
            label="IUI Date"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DatePicker
            label="LPS"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DateTimePicker
            label="Thaw date"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DateTimePicker
            label="Embryo transfer date"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DatePicker
            label="Pregnancy test"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DatePicker
            label="Clinical pregnancy date"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DatePicker
            label="Estimate delivery date"
            value={null}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
        </Box>
        <Box display={"flex"} flex={1} flexDirection={"column"} gap={1} marginInline={4}>
          <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Events</Typography>
          <FormControlLabel sx={{ color: "grey.600" }} label="Complications" control={<Checkbox
            color='secondary'
            id='register-intepreter-id'
            name="Complications"
            value={true}
            onChange={() => { }}
          />} />
          <FormControlLabel sx={{ color: "grey.600" }} label="Hospitalized" control={<Checkbox
            id='register-intepreter-id'
            name="Hospitalized"
            value={true}
            onChange={() => { }}
          />} />
          <FormControlLabel sx={{ color: "grey.600" }} label="Cycle cancelled" control={<Checkbox
            id='register-intepreter-id'
            name="Cycle cancelled"
            value={true}
            onChange={() => { }}
          />} />
          <FormControlLabel sx={{ color: "grey.600" }} label="No embryos transferred" control={<Checkbox
            id='register-intepreter-id'
            name="No embryos transferred"
            value={true}
            onChange={() => { }}
          />} />
          <FormControlLabel sx={{ color: "grey.600" }} label="Treatment completed" control={<Checkbox
            id='register-intepreter-id'
            name="Treatment completed"
            value={true}
            onChange={() => { }}
          />} />
          <FormControlLabel sx={{ color: "grey.600" }} label="Cycle completed" control={<Checkbox
            id='register-intepreter-id'
            name="Cycle completed"
            value={true}
            onChange={() => { }}
          />} />
          <FormControlLabel sx={{ color: "grey.600" }} label="Delivered" control={<Checkbox
            id='register-intepreter-id'
            name="Delivered"
            value={true}
            onChange={() => { }}
          />} />
          <FormControlLabel sx={{ color: "grey.600" }} label="Miscarriage" control={<Checkbox
            id='register-intepreter-id'
            name="Miscarriage"
            value={true}
            onChange={() => { }}
          />} />
          <FormControlLabel sx={{ color: "grey.600" }} label="Extopic Pregnancy" control={<Checkbox
            id='register-intepreter-id'
            name="Extopic Pregnancy"
            value={true}
            onChange={() => { }}
          />} />
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={4}>
            <Button variant='contained' sx={{ width: 'fit-content', mt: 2, mb: 2 }}>
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }

  const renderPlanDetails = () => {
    return (
      <Box display={"flex"} flexDirection={"column"} justifyContent={"flex-start"} gap={2}>
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <Button variant='contained' sx={{ width: 'fit-content' }}>
            Insert/Edit Treatment Plan
          </Button>
          <DatePicker
            label="Start Date"
            value={new Date()}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <DatePicker
            label="End Date"
            value={new Date()}
            format='dd/MM/yyyy'
            onChange={() => { }}
          />
          <Button variant='contained' color="error" sx={{ width: 'fit-content' }}>
            Print
          </Button>
        </Box>
        <CustomTable columns={planDetailsColumn} rows={[]} />
      </Box>
    )
  }

  return (
    <div className='main-container'>
      <Box sx={{ marginTop: 1 }}>
        <PatientInfo />
      </Box>

      <TreatmentCyclesTable />
      <Button variant='contained' sx={{ width: 'fit-content', mt: 2, mb: 2 }}>
        Add Treatment Cycle
      </Button>

      {addNewCycle()}

    </div>
  )
}

export default TreatmentCycles