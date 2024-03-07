import { Button, Grid, Typography, Box, IconButton, Dialog, DialogTitle, Paper, DialogContent, DialogActions, InputLabel, TextField } from '@mui/material'
import React, { useState } from 'react'
import CustomDataGrid from '../../components/Table/CustomDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { CheckCircle, Circle, Edit, Print } from '@mui/icons-material'
import FormForJourney from '../../components/FormForJourney/FormForJourney'
import { FileUploadAndPreview } from '../../components/FileUploadAndPreview/FileUploadAndPreview'

const Investigations: React.FC = () => {
    // State variables for controlling various dialogs
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
    const [printDialogOpen, setPrintDialogOpen] = useState<boolean>(false)

    // Columns configuration for the data grid
    const columns: GridColDef[] = [
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'investigation', headerName: 'Investigation', flex: 1 },
        { field: 'doctor', headerName: 'Doctor', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        { field: 'notes', headerName: 'Notes', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            // rendering the actions column
            renderCell: (_) => (
                <Grid container>
                    <Box display="flex" alignItems="center">
                        <IconButton color="secondary" onClick={() => setPrintDialogOpen(true)}><Print /></IconButton>
                        <IconButton color="secondary" onClick={() => setEditDialogOpen(true)}><Edit /></IconButton>
                        <CheckCircle color='success' />
                        <Circle color='error' />
                    </Box>
                </Grid>
            )
        }
    ];

    // Dummy data 
    const dummyRows: any[] = [
        { id: 1, date: '2024-02-01', investigation: 'Blood Test', doctor: 'Dr. John Doe', status: 'Scheduled', notes: 'Some notes' },
        { id: 2, date: '2024-02-02', investigation: 'Urine Test', doctor: 'Dr. Jane Doe', status: 'Completed', notes: 'Some notes' },
    ];

    // Function to render the edit dialog
    const editDialog = () => {

        return (
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md" scroll="paper">
                <DialogTitle variant='h5' >
                    <Grid container direction={'column'} justifyContent="space-between" alignItems="center" borderBottom={1} py={2}>
                        <Typography variant="h5" position={'absolute'} display={'flex'} justifyContent={'center'} width={'100%'}>
                            TSH Value
                        </Typography>
                        <Grid container justifyContent={'space-between'} position={'relative'} alignItems="center" sx={{ width: '100%' }}>
                            <Typography>Patient Name: Suman Mahato</Typography>
                            <Box display="flex" flexDirection="column" alignItems="start" justifyContent="flex-start">
                                <Typography>Date: 07/03/2024</Typography>
                                <Typography>Doc: Dr.Prem Kumar</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <DialogContent style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'end', padding: '2rem' }}>
                        <Grid container direction={'column'} gap={3} width={'100%'}>
                            <Grid item width={'100%'}>
                                <TextField label="test-value" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item width={'100%'}>
                                <TextField label="Comment" variant="outlined" multiline fullWidth />
                            </Grid>
                            <Grid item width={'100%'}>
                                <FileUploadAndPreview labelName='Upload Report' />
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Paper>
                <DialogActions sx={{ p: 4, gap: 1, justifyContent: 'center' }}>
                    <Button variant="contained" color="primary">Update</Button>
                    <Button onClick={() => setEditDialogOpen(false)} variant="outlined" >Cancel</Button>
                </DialogActions>
            </Dialog>
        )
    }

    // Function to render the print dialog
    const printDialog = () => {
        return (
            <Dialog open={printDialogOpen} onClose={() => setPrintDialogOpen(false)} fullWidth maxWidth="md" scroll="paper">
                <DialogTitle variant='h5' >
                    <Grid container direction={'column'} alignItems="center" borderBottom={1} py={2}>
                        <Typography variant="h5" position={'absolute'} display={'flex'} justifyContent={'center'} width={'100%'}>
                            TSH Value
                        </Typography>
                        <Grid container justifyContent={'space-between'} position={'relative'} alignItems="center" sx={{ width: '100%' }}>
                            <Box display="flex" flexDirection="column" alignItems="start" justifyContent="flex-start">
                                <Typography>Case ID: EV2023</Typography>
                                <Typography>Patient ID: E3453</Typography>
                                <Typography>Patient Name: Suman Mahato</Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="start" justifyContent="flex-start">
                                <Typography>Test Name: TSH Test</Typography>
                                <Typography>Date: 07/03/2024</Typography>
                                <Typography>Doc: Dr.Prem Kumar</Typography>
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
                    <Button onClick={() => setPrintDialogOpen(false)} variant="outlined" >Cancel</Button>
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
            <CustomDataGrid rows={dummyRows} columns={columns} pageSizeOptions={[5, 10]} />

            {dialogOpen && (
                <FormForJourney title="Investigation" onClose={() => setDialogOpen(false)} open={dialogOpen} />
            )}
            {editDialogOpen && (
                editDialog()
            )}
            {printDialogOpen && (
                printDialog()
            )}
        </Box>
    )
}


export default Investigations