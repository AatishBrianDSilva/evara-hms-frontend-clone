import {
  Box, Button, FormControl,
  InputLabel, MenuItem, Select,
  TextField, List, ListItem,
  ListItemText, Typography, Checkbox,
  SelectChangeEvent, Step, Stepper,
  StepLabel, StepContent, styled,
  StepConnector, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, Autocomplete
} from '@mui/material'
import React, { useState, } from 'react'
import { useFormik } from 'formik'
import { Description, Edit, Medication, MonitorHeart, Person, PersonSearch, Print, Troubleshoot } from '@mui/icons-material';
import CustomAutocomplete from '../../components/AutoCompleteBox/AutoCompleteBox';

const dummyData = {
  consultantDoctor: ['Dr. John Doe', 'Dr. Jane Doe'],
  observations: [
    'Fever',
    'Cough',
  ],
  treatmentAdvices: [
    'Medication',
    'Diet Plan',
  ],
  investigations: [
    'Blood Test',
    'X-Ray',
  ],
  scans: [
    'CT Scan',
    'MRI',
  ],
  medications: [
    'Paracetamol',
    'Dolo 650',
  ],
};

const notesDummyData = [
  {
    consultantDoctor: 'Dr. John Doe',
    observations: ['Fever', 'Cough'],
    treatmentAdvices: ['Medication', 'Diet Plan'],
    investigations: ['Blood Test', 'X-Ray'],
    scans: ['CT Scan', 'MRI'],
    medications: ['Paracetamol', 'Dolo 650'],
    notes: 'Patient is suffering from fever and cough. Medication and diet plan is advised.',
    date: '05 Feb 2024',
  },
  {
    consultantDoctor: 'Dr. John Doe',
    observations: ['Fever', 'Cough'],
    treatmentAdvices: ['Medication', 'Diet Plan'],
    investigations: ['Blood Test', 'X-Ray'],
    scans: ['CT Scan', 'MRI'],
    medications: ['Paracetamol', 'Dolo 650'],
    notes: 'Patient is suffering from fever and cough. Medication and diet plan is advised.',
    date: '05 Feb 2024',
  },
  {
    consultantDoctor: 'Dr. John Doe',
    observations: ['Fever', 'Cough'],
    treatmentAdvices: ['Medication', 'Diet Plan'],
    investigations: ['Blood Test', 'X-Ray'],
    scans: ['CT Scan', 'MRI'],
    medications: ['Paracetamol', 'Dolo 650'],
    notes: 'Patient is suffering from fever and cough. Medication and diet plan is advised.',
    date: '05 Feb 2024',
  },
]

interface PatientNotesProps {
  consultantDoctor: string;
  observations: string[];
  treatmentAdvices: string[];
  investigations: string[];
  scans: string[];
  medications: string[];
  notes: string;
  [key: string]: string | string[];
}

const Notes: React.FC = () => {

  const modalStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    pt: 2,
    alignItems: 'center',
  }

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  // console.log(formik.values.observations);

  const renderAddModal = () => {
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: string[] }>({
      observations: [],
      treatmentAdvices: [],
      investigations: [],
      scans: [],
      medications: [],
    });

    const formik = useFormik<PatientNotesProps>({
      initialValues: {
        consultantDoctor: '',
        observations: [],
        treatmentAdvices: [],
        investigations: [],
        scans: [],
        medications: [],
        notes: '',
      },
      onSubmit: (_) => {
      },
    });

    return (
      addModal && (
        <Dialog open={addModal} onClose={() => setAddModal(false)} fullWidth maxWidth="md">
          <DialogTitle sx={{ textAlign: 'center' }}>Create Consultation Note</DialogTitle>
          <DialogContent sx={{ backgroundColor: 'white', p: 2, borderRadius: 2, boxShadow: 5, maxHeight: 600, overflowY: 'auto' }} style={{ paddingTop: '1rem' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, color: 'black', width: '100%' }}>
              <FormControl fullWidth>
                <Autocomplete
                  options={dummyData.consultantDoctor}
                  value={formik.values.consultantDoctor}
                  onChange={(_, newValue) => {
                    formik.setFieldValue('consultantDoctor', newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Consultant Doctor" />
                  )}
                />
              </FormControl>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <CustomAutocomplete
                    options={dummyData.observations}
                    value={formik.values.observations}
                    onChange={(_, newValue) => {
                      formik.setFieldValue('observations', newValue);
                    }}
                    label="Observations"
                    multiple
                  />
                </FormControl>
                <FormControl fullWidth>
                  <CustomAutocomplete
                    options={dummyData.treatmentAdvices}
                    value={formik.values.treatmentAdvices}
                    onChange={(_, newValue) => {
                      formik.setFieldValue('treatmentAdvices', newValue);
                    }}
                    label="Treatment Advices"
                    multiple
                  />
                </FormControl>
                <FormControl fullWidth>
                  <CustomAutocomplete
                    options={dummyData.investigations}
                    value={formik.values.investigations}
                    onChange={(_, newValue) => {
                      formik.setFieldValue('investigations', newValue);
                    }}
                    label="Investigations"
                    multiple
                  />
                </FormControl>
                <FormControl fullWidth>
                  <CustomAutocomplete
                    options={dummyData.scans}
                    value={formik.values.scans}
                    onChange={(_, newValue) => {
                      formik.setFieldValue('scans', newValue);
                    }}
                    label="Scans"
                    multiple
                  />
                </FormControl>
                <FormControl fullWidth>
                  <CustomAutocomplete
                    options={dummyData.medications}
                    value={formik.values.medications}
                    onChange={(_, newValue) => {
                      formik.setFieldValue('medications', newValue);
                    }}
                    label="Medications"
                    multiple
                  />
                </FormControl>
              </Box>
              <TextField multiline rows={4} variant="outlined" label="Notes" />
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, gap: 2 }}>
                <Button variant="contained" color="primary" sx={{ px: 2, textTransform: 'uppercase' }}>Save</Button>
                <Button variant="outlined" sx={{ px: 2, textTransform: 'uppercase' }} onClick={() => setAddModal(false)}>Cancel</Button>
              </Box>
            </Box>

          </DialogContent>
        </Dialog>
      )
    );
  }

  const renderEditModal = () => {
    const [dialogueOpen, setDialogueOpen] = useState({
      type: '',
      open: false,
    });

    const formik = useFormik({
      initialValues: {
        observations: {},
        medications: {},
        treatmentAdvices: {},
        comments: '',
      },
      onSubmit: (_) => {
        // Handle form submission
      },
    });

    const handleOpenDialogue = (type: string) => {
      setDialogueOpen({ type, open: true });
    }

    const renderTable = (key: string, items: string[]) => {
      // console.log(key, items)
      return (
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <ListItem>
            <Grid container sx={{ flex: 1, position: 'relative', top: 30 }}>
              <Typography sx={{ textTransform: 'capitalize' }}>{key}</Typography>
            </Grid>
            <Grid container sx={{ flex: 1 }}>
              <Typography>Parameter</Typography>
            </Grid>
            <Grid container sx={{ flex: 1 }}>
              <Typography>Value</Typography>
            </Grid>
            <Grid container sx={{ flex: 1 }}>
              <Typography>Notes</Typography>
            </Grid>
          </ListItem>
          {items.map((item, index) => (
            <ListItem key={index} sx={{ position: 'relative' }}>
              <Grid container sx={{ flex: 1, opacity: 0 }}>
                <Typography>{key}</Typography>
              </Grid>
              <Grid container sx={{ flex: 1 }}>
                <Typography>{item}</Typography>
              </Grid>
              <Grid container sx={{ flex: 1 }}>
                <TextField variant="outlined" onChange={formik.handleChange} label="Value" />
              </Grid>
              <Grid container sx={{ flex: 1 }}>
                <TextField variant="outlined" onChange={formik.handleChange} label="Notes" fullWidth />
              </Grid>
            </ListItem>
          ))}
          <Grid container justifyContent={'center'} mb={2}>
            <Button variant="outlined" onClick={() => handleOpenDialogue(key)} sx={{ display: 'flex', justifyContent: 'end' }}>
              + Add {key}
            </Button>
          </Grid>
          <Dialog open={dialogueOpen.open === true && dialogueOpen.type === key}
            onClose={() => setDialogueOpen({ type: '', open: false })}
            PaperProps={{ sx: { width: '50%', boxShadow: 5 } }} sx={{ '& .MuiBackdrop-root': { backgroundColor: 'transparent' } }}
          >
            <DialogTitle> Add {key}</DialogTitle>
            <DialogContent style={{ paddingTop: '1rem' }}>
              <TextField variant="outlined" label={`Add ${key}`} fullWidth />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button variant="contained" color="primary">
                Save
              </Button>
              <Button variant="outlined" onClick={() => setDialogueOpen({ type: '', open: false })}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </List>
      );
    }

    return (
      editModal && (
        <Dialog open={editModal} onClose={() => setEditModal(false)} fullWidth maxWidth="md">
          <DialogTitle sx={{ textAlign: 'center' }}>Edit Consultation Note</DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: 'white',
              p: 2,
              borderRadius: 2,
              boxShadow: 5,
              maxHeight: 650,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {notesDummyData.map((note, index) => (
              <React.Fragment key={index}>
                {renderTable('observations', note.observations)}
                {renderTable('medications', note.medications)}
                {renderTable('treatmentAdvices', note.treatmentAdvices)}
                <TextField
                  multiline
                  rows={2}
                  variant="outlined"
                  label="Comments"
                  onChange={formik.handleChange}
                />
              </React.Fragment>
            ))}
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
              >
                Save
              </Button>
              <Button variant="outlined" onClick={() => setEditModal(false)}>
                Cancel
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      )
    );
  }

  const renderNotes = () => {

    const renderBoxes = (key: string, items: string[], icon: React.ReactNode) => {
      const cycleColors = (key: string) => {
        switch (key) {
          case 'Observations':
            return 'lightpink'
          case 'Medications':
            return 'lightgreen'
          case 'Investigations':
            return 'lightyellow'
          case 'Scans':
            return 'lightblue'
          case 'Treatment Advices':
            return 'lightgray'
          default:
            return 'lightgray';
        }
      }

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', px: 1, py: 0.2 }}>
          <Box sx={{ flex: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Box sx={{ backgroundColor: cycleColors(key), p: 1, borderRadius: 2, display: 'flex' }}>
              {icon}
            </Box>
            <Typography
              sx={{ fontSize: '0.9rem', fontWeight: 600, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'wrap' }}
            >{key}</Typography>
          </Box>
          <Grid container sx={{ flex: 1 }}>
            <List>
              {items.map((item) => (
                <Typography sx={{ fontSize: '0.9rem' }}>{item}</Typography>
              ))}
            </List>
          </Grid>
          <Grid container sx={{ flex: 0.4 }}>
            <List>
              <Typography sx={{ fontSize: '0.9rem' }}>1</Typography>
              <Typography sx={{ fontSize: '0.9rem' }}>2</Typography>
            </List>
          </Grid>
          <Grid container sx={{ flex: 1.5 }}>
            <List>
              <Typography sx={{ fontSize: '0.9rem' }}>---</Typography>
              <Typography sx={{ fontSize: '0.9rem' }}>---</Typography>
            </List>
          </Grid>
          <Grid container sx={{ flex: 1 }}>
            <List>
              <Typography sx={{ fontSize: '0.9rem' }}>Not Allocated</Typography>
              <Typography sx={{ fontSize: '0.9rem' }}>---</Typography>
            </List>
          </Grid>
        </Box>
      )
    }

    return (
      <Stepper orientation="vertical" sx={{ py: 2, px: 1 }} connector={<StepConnector sx={{ ml: 3.5 }} />}>
        {notesDummyData.map((note, index) => (
          <Step key={index} active>
            <Grid container>
              <StepLabel StepIconComponent={coloredStepper} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Typography variant='caption'>
                  {note.date}
                </Typography>

              </StepLabel>
            </Grid>
            <StepContent sx={{ px: 4, ml: 3.5, py: 0 }}>
              <Typography sx={{ fontSize: '1rem', mb: 1 }}>Notes entered by {note.consultantDoctor}</Typography>
              <Box sx={{ backgroundColor: 'rgba(0,0,0,0.02)', p: 2, px: 3, borderRadius: 2, boxShadow: 5 }}>
                {renderBoxes('Observations', note.observations, <PersonSearch />)}
                {renderBoxes('Medications', note.medications, <Medication />)}
                {renderBoxes('Investigations', note.investigations, <MonitorHeart />)}
                {renderBoxes('Scans', note.scans, <Troubleshoot />)}
                {renderBoxes('Treatment Advices', note.treatmentAdvices, <Description />)}
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, mt: 2 }}>Notes: {note.notes}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Edit sx={{ cursor: 'pointer' }} onClick={() => setEditModal(true)} />
                  <Print sx={{ cursor: 'pointer' }} />
                </Box>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    )
  }

  const coloredStepper = () => {

    const ColorlibStepIconRoot = styled('div')(({ }) => ({
      backgroundColor: 'gray',
      color: '#fff',
      width: 40,
      height: 40,
      display: 'flex',
      borderRadius: '50%',
      marginBottom: 7,
      justifyContent: 'center',
      alignItems: 'center',
    }));

    return (
      <ColorlibStepIconRoot>
        <Person />
      </ColorlibStepIconRoot>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Typography variant="h5">Patient Notes</Typography>
        <Button variant="contained" color="primary" sx={{ px: 2, py: 1, textTransform: 'uppercase' }} onClick={() => setAddModal(true)}>Add Note</Button>
      </Box>
      <Box>
        {renderNotes()}
      </Box>
      <Box>
        {renderAddModal()}
      </Box>
      <Box>
        {renderEditModal()}
      </Box>
    </Box>
  )
}

export default Notes