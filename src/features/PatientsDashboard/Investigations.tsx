import { Button, Grid, Typography, Box, IconButton, Dialog, DialogTitle, Paper, DialogContent, DialogActions, FormControlLabel, TextField, Checkbox } from '@mui/material'
import React, { useState } from 'react'
import CustomDataGrid from '../../components/Table/CustomDataGrid'
import { GridColDef, GridRowModes, GridActionsCellItem } from '@mui/x-data-grid'
import { CheckCircle, Circle, Edit, Print, Add } from '@mui/icons-material'
import FormForJourney from '../../components/FormForJourney/FormForJourney'
import { FileUploadAndPreview } from '../../components/FileUploadAndPreview/FileUploadAndPreview'
import { useFormik } from 'formik'

const Investigations: React.FC = () => {
    // State variables for controlling various dialogs
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [isInEditMode, setIsInEditMode] = useState<any>({ id: 0, status: false })
    const [isInPrintMode, setIsInPrintMode] = useState<any>({ id: 0, status: false })
    const formik = useFormik({
        initialValues: {
            testValue: '',
            comment: '',
            status: false,
        },
        onSubmit: (values) => {
            console.log(values);
        },
    });


    // Columns configuration for the data grid
    const columns: GridColDef[] = [
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'investigation', headerName: 'Investigation', flex: 1 },
        { field: 'doctor', headerName: 'Doctor', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        { field: 'notes', headerName: 'Notes', flex: 1 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            cellClassName: 'actions',
            // custom actions for the actions column
            getActions: (params: any) => {
                const { row } = params;
                // return the action buittons
                return [
                    <GridActionsCellItem
                        icon={<Print />}
                        label="Print"
                        className="textPrimary"
                        onClick={() => handlePrintClick(row)}
                    />,
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        onClick={() => handleEditClick(row)}
                    />,
                ];
            },
        },
    ]

    // Dummy data 
    const dummyRows: any[] = [
        { id: 1, date: '2024-02-01', investigation: 'Blood Test', doctor: 'Dr. John Doe', status: 'Scheduled', notes: 'Some notes' },
        { id: 2, date: '2024-02-02', investigation: 'Urine Test', doctor: 'Dr. Jane Doe', status: 'Completed', notes: 'Some notes' },
    ];

    // Function to handle the print click
    const handlePrintClick = (rowData: any) => {
        // console.log(rowData);
        setIsInPrintMode({ id: rowData.id, status: true });
    }

    // Function to handle the edit click
    const handleEditClick = (rowData: any) => {
        // console.log(rowData);
        formik.setFieldValue('status', rowData.status === 'Completed' ? true : false)
        setIsInEditMode({ id: rowData.id, status: true });
    };

    // Function to render the edit dialog
    const editDialog = (selectedRowData: any) => {
        const { id, date, investigation, doctor } = selectedRowData;

        console.log(id)

        return (
            <Dialog open={isInEditMode} onClose={() => setIsInEditMode({ id: 0, status: false })} fullWidth maxWidth="md" scroll="paper">
                <DialogTitle variant='h5' >
                    <Grid container direction={'column'} justifyContent="space-between" alignItems="center" borderBottom={1} py={2}>
                        <Typography variant="h5" position={'absolute'} display={'flex'} justifyContent={'center'} width={'100%'}>
                            {investigation}
                        </Typography>
                        <Grid container justifyContent={'space-between'} position={'relative'} alignItems="center" sx={{ width: '100%' }}>
                            <Typography>Patient Name: Suman Mahato</Typography>
                            <Box display="flex" flexDirection="column" alignItems="start" justifyContent="flex-start">
                                <Typography>Date: {date}</Typography>
                                <Typography>Doc: {doctor}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <DialogContent style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'end', padding: '2rem' }}>
                        <Grid container direction={'column'} gap={3} width={'100%'}>
                            <Grid item width={'100%'}>
                                <TextField label="test-value" variant="outlined" fullWidth onChange={formik.handleChange} value={formik.values.testValue} />
                            </Grid>
                            <Grid item width={'100%'}>
                                <TextField label="Comment" variant="outlined" multiline fullWidth rows={4} onChange={formik.handleChange} value={formik.values.comment} />
                            </Grid>
                            <Grid item width={'100%'}>
                                <FileUploadAndPreview labelName='Upload Report' />
                            </Grid>
                            <Grid container width={'100%'} justifyContent={'center'}>
                                <FormControlLabel label="Mark Complete?" control={<Checkbox checked={formik.values.status} onChange={formik.handleChange} name="status" />} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Paper>
                <DialogActions sx={{ pb: 4, gap: 1, justifyContent: 'center' }}>
                    <Button variant="contained" color="primary">Update</Button>
                    <Button onClick={() => { setIsInEditMode({ id: 0, status: false }); }} variant="outlined" >Cancel</Button>
                </DialogActions>
            </Dialog>
        )
    }

    // Function to render the print dialog
    const printDialog = (selectedRowData: any) => {
        const data = selectedRowData;

        return (
            <Dialog open={isInPrintMode} onClose={() => setIsInPrintMode({ id: 0, status: false })} fullWidth maxWidth="md" scroll="paper">
                <DialogTitle variant='h5' >
                    <Grid container direction={'column'} alignItems="center" borderBottom={1} py={2}>
                        <Typography variant="h5" position={'absolute'} display={'flex'} justifyContent={'center'} width={'100%'}>
                            Evara Fertility Center
                        </Typography>
                        <Grid container justifyContent={'space-between'} position={'relative'} alignItems="center" sx={{ width: '100%' }}>
                            <Box display="flex" flexDirection="column" alignItems="start" justifyContent="flex-start">
                                <Typography>Case ID: EV2023</Typography>
                                <Typography>Patient ID: E3453</Typography>
                                <Typography>Patient Name: Suman Mahato</Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="start" justifyContent="flex-start">
                                <Typography>Test Name: {data.investigation}</Typography>
                                <Typography>Date: {data.date}</Typography>
                                <Typography>Doc: {data.doctor}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <DialogContent style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'end', padding: '2rem' }}>
                        <Grid container direction={'row'} gap={3} width={'100%'} justifyContent={'space-around'} alignItems="center">
                            <Grid>
                                <Typography variant="h6">Test Value: 25/mgL</Typography>
                            </Grid>
                            <Grid>
                                <Typography variant="h6">Ref Value:30/mgL</Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Paper>
                <DialogActions sx={{ p: 4, gap: 1, justifyContent: 'center' }}>
                    <Button variant="contained" color="primary">Print</Button>
                    <Button onClick={() => { setIsInPrintMode({ id: 0, status: false }); }} variant="outlined" >Cancel</Button>
                </DialogActions>
            </Dialog>
        )
    }

    // Main return statement
    return (
        <Box p={2}>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" color="text.secondary">
                    Investigations
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>Create New</Button>
            </Grid>
            <CustomDataGrid rows={dummyRows} columns={columns} pageSizeOptions={[5, 10]}
            />

            {dialogOpen && (
                <FormForJourney title="Investigation" onClose={() => setDialogOpen(false)} open={dialogOpen} />
            )}
            {isInEditMode.status && (
                editDialog(dummyRows.find(row => row.id === isInEditMode.id))
            )}
            {isInPrintMode.status && (
                printDialog(dummyRows.find(row => row.id === isInPrintMode.id))
            )}
        </Box>
    )
}

export default Investigations

// rendering the actions column
// renderCell: (_) => (
//     <Grid container>
//         <Box display="flex" alignItems="center">
//             <IconButton color="secondary" onClick={() => setPrintDialogOpen(true)}><Print /></IconButton>
//             <IconButton color="secondary" onClick={(e) => console.log(e)}><Edit /></IconButton>
//             <CheckCircle color='success' />
//             <Circle color='error' />
//         </Box>
//     </Grid>
// )