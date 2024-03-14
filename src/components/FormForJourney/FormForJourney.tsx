import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';

import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers';

interface AlertDialogProps {
    title?: string
    open?: boolean
    onClose?: () => void
    onConfirm?: () => void
    doctorData?: string[]
    investigationData?: string[]
    handleAddFields?: () => void
    handleDeleteField?: any
    form: any
}

const dummyData: any = {
    investigationData: [
        'Blood Test',
        'Urine Test',
        'X-Ray',
        'MRI'
    ],
    doctorData: [
        'Dr. John Doe',
        'Dr. Jane Doe',
        'Dr. Alex',
        'Dr. Smith'
    ]
}

const FormForJourney: React.FC<AlertDialogProps> = ({ title, open, onClose, onConfirm, doctorData, investigationData, handleAddFields, handleDeleteField, form }) => {
    console.log("Doctor Data", doctorData);
    console.log("Investigation Data", investigationData);
    return (
        <Dialog open={open || false} onClose={onClose || (() => { })} fullWidth maxWidth="md" scroll="paper">
            <DialogTitle sx={{ textAlign: 'center', pt: 3 }} variant="h5">
                Create New {title}
            </DialogTitle>
            <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                <DialogContent style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'end', padding: '2rem' }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2 }}>
                        {form.values.fields.map((field: any, index: number) => (
                            <Grid key={index} container direction={'row'} gap={2}>
                                <Grid item flex={3}>
                                    <Autocomplete
                                        options={dummyData.investigationData}
                                        value={field.investigation}
                                        isOptionEqualToValue={(option, value) => option === value}
                                        onChange={(_, newValue) => form.setFieldValue(`fields.${index}.investigation`, newValue)}
                                        renderInput={(params) => <TextField {...params} label="Investigation" />}
                                    />
                                </Grid>
                                <Grid item flex={3}>
                                    <Autocomplete
                                        options={dummyData.doctorData}
                                        value={field.doctor}
                                        onChange={(_, newValue) => form.setFieldValue(`fields.${index}.doctor`, newValue)}
                                        renderInput={(params) => <TextField {...params} label="Doctor" />}
                                    />
                                </Grid>
                                <Grid item flex={3}>
                                    <DatePicker
                                        label="Date"
                                        value={field.date}
                                        onChange={(newValue) => form.setFieldValue(`fields.${index}.date`, newValue)}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                                {index < form.values.fields.length - 1 &&
                                    <Grid item>
                                        <IconButton onClick={() => handleDeleteField(index)}>
                                            <Delete />
                                        </IconButton>
                                    </Grid>
                                }
                                {index === form.values.fields.length - 1 &&
                                    <Grid item>
                                        <IconButton color="primary" onClick={handleAddFields}>
                                            <Add />
                                        </IconButton>
                                    </Grid>
                                }
                            </Grid>
                        ))}
                    </Box>
                </DialogContent>
            </Paper>
            <DialogActions sx={{ p: 4, gap: 1, justifyContent: 'center' }}>
                <Button variant="contained" onClick={onConfirm}>Save</Button>
                <Button variant="outlined" onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FormForJourney