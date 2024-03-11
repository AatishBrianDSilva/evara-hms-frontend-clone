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
import React from 'react'
import { GridColDef } from '@mui/x-data-grid';
import PatientInfo from './PatientInfo';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import TreatmentCyclesTable from './TreatmentCyclesTable';
import CustomDataGrid from '../../components/Table/CustomDataGrid';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const biopsyColumn: GridColDef[] = [
  { field: 'id', headerName: 'PCR Tube ID', flex: 1 },
  { field: 'status', headerName: 'Embryo ID/Cycle ID	', flex: 1 },
  { field: 'treatment', headerName: 'No.of Cells Biopsied	', flex: 1 },
  {
    field: 'startDate',
    headerName: 'Embryo Cell Stage(Day 3/Day 5)	',
    flex: 1,
  },
  {
    field: 'attempt',
    headerName: 'Embryo Grade(Low/High)',
    flex: 1,
  },
  {
    field: 'createdAt',
    headerName: 'Nucleus Seen(Y/N)',
    flex: 1,
  },
  {
    field: 'createdBy',
    headerName: 'Cell Integrity Intact(I)/Lysed(L)',
    flex: 1,
  },
  {
    field: "reason",
    headerName: "Comments",
    sortable: false,
    flex: 1,
  }
];

const planDetailsColumn: GridColDef[] = [
  { field: 'id', headerName: 'Phase', flex: 1 },
  { field: 'status', headerName: 'Dow	', flex: 1 },
  { field: 'treatment', headerName: 'Date', flex: 1 },
  {
    field: 'startDate',
    headerName: 'Day	',
    flex: 1,
  },
  {
    field: 'attempt',
    headerName: 'Type',
    flex: 1,
  },
  {
    field: 'createdAt',
    headerName: 'Event',
    flex: 1,
  },
  {
    field: 'createdBy',
    headerName: 'Result/Dose',
    flex: 1,
  },
  {
    field: "reason",
    headerName: "Remarks",
    sortable: false,
    flex: 1,
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
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Treatment Details</Typography>
          <Grid container direction="column" gap={2}>
            <TextField id="partner" label="Partner" select fullWidth>
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="doctor" label="Doctor" select fullWidth>
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="treatments" label="Treatments" select fullWidth>
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <DateTimePicker label="Est. start of treatment" value={null} onChange={() => { }} sx={{ width: '100%' }} />
            <TextField id="attempts" label="Attempts" fullWidth />
            <TextField id="female-factor" label="Female Factor" select fullWidth>
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField id="male-factor" label="Male Factor" select fullWidth>
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <FormControlLabel
              control={<Checkbox id='treatment-other-center' name="Treatment at other center" value={true} onChange={() => { }} />}
              label="Treatment at other center"
            />
            <TextField multiline maxRows={2} minRows={2} label="Other Center Detail" fullWidth />
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant='subtitle1' sx={{ mb: 2 }}>Treatment Plan Usage</Typography>
          <Grid container direction="column" gap={2}>
            <TextField id="treatment-plan-usage" label="Treatment Usage Plan" select fullWidth>
              <MenuItem value="Mr">Absdcef - 123</MenuItem>
              <MenuItem value="Mrs">Xysad - 897</MenuItem>
              <MenuItem value="Miss">Zyfdf - 154</MenuItem>
            </TextField>
            <TextField multiline maxRows={2} minRows={2} label="Remarks" fullWidth />
            <TextField label="Previous Cycles Count" fullWidth />

            <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Sentinel Dates</Typography>
            <Button variant='contained' sx={{ width: 'fit-content' }}>
              Day 1
            </Button>
            <DatePicker label="Start of follicular phase (LMP)" value={null} onChange={() => { }} sx={{ width: '100%' }} />
            <DatePicker label="Baseline scan" value={null} onChange={() => { }} sx={{ width: '100%' }} />
            <DatePicker label="Start date of stim medications" value={null} onChange={() => { }} sx={{ width: '100%' }} />
            <DateTimePicker label="Trigger Date" value={null} onChange={() => { }} sx={{ width: '100%' }} />
            <DateTimePicker label="Egg Collection Date" value={null} onChange={() => { }} sx={{ width: '100%' }} />
            <DateTimePicker label="IUI Date" value={null} onChange={() => { }} sx={{ width: '100%' }} />
            <DateTimePicker label="LPS Date" value={null} onChange={() => { }} sx={{ width: '100%' }} />
            <DateTimePicker label="Embryo Transfer Date" value={null} onChange={() => { }} sx={{ width: '100%' }} />
            <DateTimePicker label="Pregnancy Test Date" value={null} onChange={() => { }} sx={{ width: '100%' }} />
          </Grid>
        </Grid>
      </Grid>
    );
  };


  const renderGametes = () => {
    return (
      (<Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={4} direction="column">
          {/* 1st row - Gametes Egg 1 & 2 */}
          <Grid item container spacing={4}>
            {[1, 2].map((value) => (
              <Grid item xs={12} md={6} container spacing={2} direction="column" key={`egg-${value}`}>
                <Grid item>
                  <Typography variant='subtitle1'>{`Gametes Egg ${value}`}</Typography>
                </Grid>
                {['Gamete Name', 'Gamete Source', 'Source Verified', 'Procedure'].map((field, index) => (
                  <Grid item key={index}>
                    <TextField
                      fullWidth
                      id={`gamete-${field.toLowerCase().replace(/\s+/g, '-')}-eggs-${value}`}
                      label={field}
                      select
                      value=""
                    >
                      <MenuItem value="Mr">Absdcef - 123</MenuItem>
                      <MenuItem value="Mrs">Xysad - 897</MenuItem>
                      <MenuItem value="Miss">Zyfdf - 154</MenuItem>
                    </TextField>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>

          {/* 2nd row - Gametes Sperm 1 & 2 */}
          <Grid item container spacing={4}>
            {[1, 2].map((value) => (
              <Grid item xs={12} md={6} container spacing={2} direction="column" key={`sperm-${value}`}>
                <Grid item>
                  <Typography variant='subtitle1'>{`Gametes Sperm ${value}`}</Typography>
                </Grid>
                {['Gamete Name', 'Gamete Source', 'Source Verified', 'Procedure'].map((field, index) => (
                  <Grid item key={index}>
                    <TextField
                      fullWidth
                      id={`gamete-${field.toLowerCase().replace(/\s+/g, '-')}-sperm-${value}`}
                      label={field}
                      select
                      value=""
                    >
                      <MenuItem value="Mr">Absdcef - 123</MenuItem>
                      <MenuItem value="Mrs">Xysad - 897</MenuItem>
                      <MenuItem value="Miss">Zyfdf - 154</MenuItem>
                    </TextField>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>

          {/* 3rd row - Gametes Embryo & Surrogate */}
          <Grid item container spacing={4}>
            <Grid item xs={12} md={6} container spacing={2} direction="column">
              <Grid item>
                <Typography variant='subtitle1'>Gametes Embryo</Typography>
              </Grid>
              {['Sperm Source', 'Egg Source', 'Source Verified', 'Procedure'].map((field, index) => (
                <Grid item key={index}>
                  <TextField
                    fullWidth
                    id={`embryo-${field.toLowerCase().replace(/\s+/g, '-')}`}
                    label={field}
                    select
                    value=""
                  >
                    <MenuItem value="Mr">Absdcef - 123</MenuItem>
                    <MenuItem value="Mrs">Xysad - 897</MenuItem>
                    <MenuItem value="Miss">Zyfdf - 154</MenuItem>
                  </TextField>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} md={6} container spacing={2} direction="column">
              <Grid item>
                <Typography variant='subtitle1'>Surrogate</Typography>
              </Grid>
              {['Surrogate Source', 'Source Verified', 'Procedure'].map((field, index) => (
                <Grid item key={index}>
                  <TextField
                    fullWidth
                    id={`surrogate-${field.toLowerCase().replace(/\s+/g, '-')}`}
                    label={field}
                    select
                    value=""
                  >
                    <MenuItem value="Mr">Absdcef - 123</MenuItem>
                    <MenuItem value="Mrs">Xysad - 897</MenuItem>
                    <MenuItem value="Miss">Zyfdf - 154</MenuItem>
                  </TextField>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Grid item container justifyContent="center">
            <Button variant='contained' sx={{ width: 'fit-content', mt: 2, mb: 2 }}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>)
    );
  }

  const renderPsgPgd = () => {
    return (
      <Grid container spacing={2} direction="column">
        {/* 1st Row */}
        <Grid item container xs={12}>
          <TextField id="karyotype" label="Karyotype" fullWidth select value="">
            <MenuItem value="yes">Absdcef - 123</MenuItem>
            <MenuItem value="no">Xysad - 897</MenuItem>
          </TextField>
        </Grid>

        {/* 2nd Row */}
        <Grid item container>
          <Typography variant="subtitle1" sx={{ wordWrap: 'break-word' }} >Clinical Reason(S) for Referral: Please Tick the Appropriate Choice(s)</Typography>
        </Grid>

        <Grid item container>
          <Grid item xs={12} sm={6} container spacing={1} direction="column">
            {["Screening for Chromosomal Aneuploidies", "Organic Azoospermia", "Organic Oligospermia", "Sperm Donor", "Male Infertility,Unspecified", "Spem Aneuploidy"].map((label, index) => (
              <Grid item key={index}>
                <FormControlLabel
                  control={<Checkbox color="secondary" />}
                  label={label}
                  sx={{ color: "grey.600" }}
                />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} sm={6} container spacing={1} direction="column">
            {["Elevated Maternal Age(>35 Years)", "Primary Ovarian Failure", "Poor Obstetric/Reproductive History,First Trimester", "Egg (Oocyte Donor)", "Female Infertility,Unspecified", "Other"].map((label, index) => (
              <Grid item key={index}>
                <FormControlLabel
                  control={<Checkbox color="secondary" />}
                  label={label}
                  sx={{ color: "grey.600" }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            maxRows={2}
            minRows={2}
            label="If Others(Then Please Specify)"
            value=""
          />
        </Grid>

        {/* 3rd Row */}
        <Grid item>
          <Typography variant="h6">Biopsy Information</Typography>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item xs={12} md={6} container spacing={2} direction="column">
            <Grid item>
              <TextField id="no-of-biopsies" label="No of Biopsies" fullWidth value="" />
            </Grid>
            <Grid item>
              <TextField id="biopsy-method" label="Biopsy Method" fullWidth select value="">
                <MenuItem value="laser">Laser</MenuItem>
                <MenuItem value="acid">Acid Tyrodes</MenuItem>
                <MenuItem value="mechanical">Mechanical</MenuItem>
              </TextField>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">Day of Biopsy:</Typography>
            </Grid>
            <Grid item>
              <FormControlLabel control={<Checkbox />} label="Day 3-Blastomere" sx={{ color: "grey.600" }} />
            </Grid>
            <Grid item>
              <FormControlLabel control={<Checkbox />} label="Day 5-Trophectoderm" sx={{ color: "grey.600" }} />
            </Grid>
            <Grid item>
              <TextField id="biopsy-performed-by" label="Biopsy Performed By" fullWidth select value="">
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
            </Grid>
            {/* Assuming DatePicker and DateTimePicker are properly imported or replaced with equivalent */}
            <Grid item>
              <DatePicker
                label="Biopsy Date"
                value={null}
                onChange={() => { }}
              />
            </Grid>
            <Grid item>
              <DateTimePicker
                label="Planned Date/Time of Embryo Transfer"
                value={null}
                onChange={() => { }}
              />
            </Grid>
            <Grid item>
              <TextField id="embryos-cryopreserved" label="All Embryos will be cryopreserved for future use(Y/N)" fullWidth select value="">
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
            </Grid>
            <Grid item>
              <TextField id="results-for-transfer" label="Results Needed for Fresh Embryo Transfer (Y/N)" fullWidth select value="">
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                multiline
                maxRows={2}
                minRows={2}
                label="Result"
                value=""
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Embryologist Section */}
        <Grid item>
          <Typography variant="subtitle1" sx={{ textDecorationLine: 'underline' }}>To Be Filled By Embryologist</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained">Add Row</Button>
        </Grid>

        <Grid item container>
          <CustomDataGrid columns={biopsyColumn} rows={[]} />
        </Grid>

        {/* Action Buttons */}
        <Grid item container justifyContent="center" spacing={2}>
          <Grid item>
            <Button variant="contained" color="info">Save</Button>
          </Grid>
          <Grid item>
            <Button variant="contained">Logo Print</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="info">Print</Button>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderTreatmentPlan = () => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {/* Sentinel Dates Column */}
          <Grid item xs={12} md={8} container spacing={2} direction="column">
            <Grid item>
              <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Sentinel Dates</Typography>
            </Grid>
            {['Treatment plan assigned', 'Menstr.day1 before downreg', 'Baseline scan', 'Start of follicular phase (LMP)', 'Start date of stim medications', 'Trigger Date', 'Egg collection Date', 'IUI Date', 'LPS', 'Thaw date', 'Embryo transfer date', 'Pregnancy test', 'Clinical pregnancy date', 'Estimate delivery date'].map((label, index) => (
              <Grid item key={index}>
                {label.includes('Date') ? (
                  <DateTimePicker
                    label={label}
                    value={null}
                    onChange={() => { }}
                    sx={{ width: '100%' }}
                  />
                ) : (
                  <DatePicker
                    label={label}
                    value={null}
                    onChange={() => { }}
                    sx={{ width: '100%' }}
                  />
                )}
              </Grid>
            ))}
          </Grid>

          {/* Events Column */}
          <Grid item xs={12} md={4} container spacing={1} direction="column">
            <Grid item>
              <Typography variant='subtitle1' sx={{ mt: 4, mb: 2 }}>Events</Typography>
            </Grid>
            {['Complications', 'Hospitalized', 'Cycle cancelled', 'No embryos transferred', 'Treatment completed', 'Cycle completed', 'Delivered', 'Miscarriage', 'Extopic Pregnancy'].map((label, index) => (
              <Grid item key={index}>
                <FormControlLabel
                  control={<Checkbox color='secondary' />}
                  label={label}
                  sx={{ color: "grey.600" }}
                />
              </Grid>
            ))}
            <Grid item container justifyContent="center">
              <Button variant='contained' sx={{ width: 'fit-content', mt: 2, mb: 2 }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderPlanDetails = () => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container direction="column" spacing={2}>
          {/* Action Buttons and DatePickers */}
          <Grid item container justifyContent="space-between" alignItems="center" spacing={2}>
            <Grid item>
              <Button variant='contained' sx={{ width: 'fit-content' }}>
                Insert/Edit Treatment Plan
              </Button>
            </Grid>
            <Grid item>
              <DatePicker
                label="Start Date"
                value={new Date()}
                onChange={() => { }}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item>
              <DatePicker
                label="End Date"
                value={new Date()}
                onChange={() => { }}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item>
              <Button variant='contained' color="primary" sx={{ width: 'fit-content' }}>
                Print
              </Button>
            </Grid>
          </Grid>

          {/* CustomTable for Plan Details */}
          <Grid container item xs={12}>
            <CustomDataGrid columns={planDetailsColumn} rows={[]} />
          </Grid>
        </Grid>
      </Box>
    );
  };

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