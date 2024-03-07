import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Box, InputLabel, IconButton, Autocomplete, TextField, Paper } from '@mui/material'
import React from 'react'
import CustomAutocomplete from '../AutoCompleteBox/AutoCompleteBox'
import { Add } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers'
import { useFormik } from 'formik'

interface AlertDialogProps {
    title?: string
    open?: boolean
    onClose?: () => void
    onConfirm?: () => void
    doctorData?: string[]
    investigationData?: string[]
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

const FormForJourney: React.FC<AlertDialogProps> = ({ title, open, onClose, onConfirm, doctorData, investigationData }) => {
    const formik = useFormik({
        initialValues: {
            fields: [
                { investigation: '', doctor: '', date: new Date() },

            ],
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    const handleAddFields = () => {
        formik.setFieldValue('fields', [
            ...formik.values.fields,
            { investigation: '', doctor: '', date: new Date() },
        ]);
    };

    console.log(formik.values.fields)

    return (
        <Dialog open={open || false} onClose={onClose || (() => { })} fullWidth maxWidth="md" scroll="paper">
            <DialogTitle sx={{ textAlign: 'center', pt: 3 }} variant='h5' >
                Create New {title}
            </DialogTitle>
            <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                <DialogContent style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'end', padding: '2rem' }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2 }}>
                        {formik.values.fields.map((field, index) => (
                            <Grid key={index} container direction={'row'} gap={2}>
                                <Grid item flex={3}>
                                    {/* <CustomAutocomplete
                                    label="Investigation"
                                    options={dummyData.investigationData}
                                    value={field.investigation}
                                    onChange={(_, newValue) =>
                                        formik.setFieldValue(`fields.${index}.investigation`, newValue)
                                    }
                                /> */}
                                    < Autocomplete
                                        options={dummyData.investigationData}
                                        value={field.investigation}
                                        onChange={(_, newValue) => formik.setFieldValue(`fields.${index}.investigation`, newValue)}
                                        renderInput={(params) => <TextField {...params} label="Investigation" />}
                                    />
                                </Grid>
                                <Grid item flex={3}>
                                    {/* <CustomAutocomplete
                                    label="Doctor"
                                    options={dummyData.doctorData}
                                    value={field.doctor}
                                    onChange={(_, newValue) => formik.setFieldValue(`fields.${index}.doctor`, newValue)}
                                /> */}
                                    < Autocomplete
                                        options={dummyData.doctorData}
                                        value={field.doctor}
                                        onChange={(_, newValue) => formik.setFieldValue(`fields.${index}.doctor`, newValue)}
                                        renderInput={(params) => <TextField {...params} label="Doctor" />}
                                    />
                                </Grid>
                                <Grid item flex={3}>
                                    <DatePicker
                                        label="Date"
                                        value={field.date}
                                        onChange={(newValue) => formik.setFieldValue(`fields.${index}.date`, newValue)}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </Grid>
                        ))}
                    </Box>
                    <IconButton color="primary" onClick={handleAddFields}>
                        <Add />
                    </IconButton>
                </DialogContent>
            </Paper>
            <DialogActions sx={{ p: 4, gap: 1, justifyContent: 'center' }}>
                <Button variant="contained">Confirm</Button>
                <Button variant="outlined" onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )

}

export default FormForJourney