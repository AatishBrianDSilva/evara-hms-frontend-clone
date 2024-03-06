import {
    Box, Button, FormControl,
    InputLabel, MenuItem, Select,
    TextField, List, ListItem,
    ListItemText, Typography, Checkbox,
    SelectChangeEvent, Step, Stepper,
    StepLabel, StepContent, styled,
    StepConnector, Grid
} from '@mui/material'
import React, { useState, } from 'react'
import { useFormik } from 'formik'
import { Description, Edit, Medication, MonitorHeart, Person, PersonSearch, Print, Troubleshoot } from '@mui/icons-material';

const dummyData = {
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

const PatientNotes: React.FC = () => {

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

        const handleItemChange = (e: SelectChangeEvent<string[]>, key: string) => {
            formik.handleChange(e);
            setSelectedItems((prevSelected) => ({
                ...prevSelected,
                [key]: e.target.value as string[],
            }));
        };

        const handleRemoveItem = (item: string, key: string) => {
            setSelectedItems((prevSelected) => ({
                ...prevSelected,
                [key]: prevSelected[key].filter((selectedItem) => selectedItem !== item),
            }));
            formik.setFieldValue(key, (formik.values[key] as string[]).filter((selectedItem: string) => selectedItem !== item))
        };

        const renderSelectedItems = (key: string) => (
            <List>
                {selectedItems[key].map((item) => (
                    <ListItem key={item} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ListItemText primary={item} />
                        <Button
                            sx={{ px: 1, py: 0, minWidth: 0, border: '1px solid rgba(255,0,0,0.4)', borderRadius: '50%' }}
                            onClick={() => handleRemoveItem(item, key)}>X</Button>
                    </ListItem>
                ))}
            </List>
        );

        return (
            <Box>
                {addModal && (
                    <Box sx={{ ...modalStyle }}>
                        <Box sx={{ width: '55%', backgroundColor: 'white', p: 2, borderRadius: 2, boxShadow: 5, maxHeight: 600, overflowY: 'auto' }}>
                            <Typography variant="h5" sx={{ py: 5, textAlign: 'center' }}>Create Consultation Note</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, color: 'black', width: '100%' }}>
                                <FormControl fullWidth>
                                    <InputLabel>Consultant Doctor</InputLabel>
                                    <Select
                                        label="Consultant Doctor"
                                        name="consultantDoctor"
                                        value={formik.values.consultantDoctor}
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value="Dr. John Doe">Dr. John Doe</MenuItem>
                                        <MenuItem value="Dr. Jane Doe">Dr. Jane Doe</MenuItem>
                                    </Select>
                                </FormControl>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Observations</InputLabel>
                                        <Select
                                            label="Observations"
                                            name="observations"
                                            onChange={(e) => handleItemChange(e, 'observations')}
                                            multiple
                                            renderValue={(selected) => selected.join(', ')}
                                            value={formik.values.observations}
                                        >
                                            {dummyData.observations.map((observation) => (
                                                <MenuItem key={observation} value={observation}>
                                                    <Checkbox checked={formik.values.observations.includes(observation)} />
                                                    <ListItemText primary={observation} />
                                                </MenuItem>
                                            ))}
                                        </Select>

                                        {renderSelectedItems('observations')}
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>Treatment Advices</InputLabel>
                                        <Select
                                            label="Treatment Advices"
                                            name="treatmentAdvices"
                                            value={formik.values.treatmentAdvices}
                                            onChange={(e) => handleItemChange(e, 'treatmentAdvices')}
                                            multiple
                                            renderValue={(selected) => selected.join(', ')}
                                        >
                                            {dummyData.treatmentAdvices.map((treatmentAdvice) => (
                                                <MenuItem key={treatmentAdvice} value={treatmentAdvice}>
                                                    <Checkbox checked={formik.values.treatmentAdvices.includes(treatmentAdvice)} />
                                                    <ListItemText primary={treatmentAdvice} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {renderSelectedItems('treatmentAdvices')}
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>Investgations</InputLabel>
                                        <Select
                                            label="Investgations"
                                            name="investigations"
                                            value={formik.values.investigations}
                                            onChange={(e) => handleItemChange(e, 'investigations')}
                                            multiple
                                            renderValue={(selected) => selected.join(', ')}
                                        >
                                            {dummyData.investigations.map((investigation) => (
                                                <MenuItem key={investigation} value={investigation}>
                                                    <Checkbox checked={formik.values.investigations.includes(investigation)} />
                                                    <ListItemText primary={investigation} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {renderSelectedItems('investigations')}
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>Scans</InputLabel>
                                        <Select
                                            label="Scans"
                                            name="scans"
                                            value={formik.values.scans}
                                            onChange={(e) => handleItemChange(e, 'scans')}
                                            multiple
                                            renderValue={(selected) => selected.join(', ')}
                                        >
                                            {dummyData.scans.map((scan) => (
                                                <MenuItem key={scan} value={scan}>
                                                    <Checkbox checked={formik.values.scans.includes(scan)} />
                                                    <ListItemText primary={scan} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {renderSelectedItems('scans')}
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>Medications</InputLabel>
                                        <Select
                                            label="Medications"
                                            name="medications"
                                            value={formik.values.medications}
                                            onChange={(e) => handleItemChange(e, 'medications')}
                                            multiple
                                            renderValue={(selected) => selected.join(', ')}
                                        >
                                            {dummyData.medications.map((medication) => (
                                                <MenuItem key={medication} value={medication}>
                                                    <Checkbox checked={formik.values.medications.includes(medication)} />
                                                    <ListItemText primary={medication} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {renderSelectedItems('medications')}
                                    </FormControl>
                                </Box>
                                <TextField multiline rows={4} variant="outlined" label="Notes" />
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, gap: 2 }}>
                                    <Button variant="contained" color="primary" sx={{ px: 2, textTransform: 'uppercase' }}>Save</Button>
                                    <Button variant="outlined" sx={{ px: 2, textTransform: 'uppercase' }} onClick={() => setAddModal(false)}>Cancel</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        )
    }

    const renderEditModal = () => {
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

        const renderItems = (key: string, items: string[]) => {
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
                            <Typography>Content</Typography>
                        </Grid>
                    </ListItem>
                    {items.map((item, index) => (
                        <ListItem key={index}>
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
                                <TextField variant="outlined" onChange={formik.handleChange} label="Content" />
                            </Grid>
                        </ListItem>
                    ))}
                </List>
            );
        }

        return (
            editModal && (
                <Box sx={{ ...modalStyle }}>
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            width: '50%',
                            mt: 2,
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
                        <Typography variant="h5" sx={{ py: 5, textAlign: 'center' }}>
                            Edit Consultation Note
                        </Typography>
                        {notesDummyData.map((note, index) => (
                            <React.Fragment key={index}>
                                {renderItems('observations', note.observations)}
                                {renderItems('medications', note.medications)}
                                {renderItems('treatmentAdvices', note.treatmentAdvices)}
                                <TextField
                                    multiline
                                    rows={2}
                                    variant="outlined"
                                    label="Comments"
                                    onChange={formik.handleChange}
                                />
                            </React.Fragment>
                        ))}
                        <Grid container gap={3} alignItems="center" justifyContent="center" sx={{ py: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                            >
                                Save
                            </Button>
                            <Button variant="outlined" onClick={() => setEditModal(false)}>
                                Cancel
                            </Button>
                        </Grid>
                    </Box>
                </Box>
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

export default PatientNotes