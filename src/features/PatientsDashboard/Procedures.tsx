import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import React, { useState } from 'react';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Circle from '@mui/icons-material/Circle';
import Edit from '@mui/icons-material/Edit';
import Print from '@mui/icons-material/Print';
// Additional imports remain unchanged
import CustomDataGrid from '../../components/Table/CustomDataGrid';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import FormForJourney from '../../components/FormForJourney/FormForJourney';
import { FileUploadAndPreview } from '../../components/FileUploadAndPreview/FileUploadAndPreview';
import { useFormik } from 'formik';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';

const Procedures: React.FC = () => {
    // State variables for controlling various dialogs
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [isInEditMode, setIsInEditMode] = useState<any>({ id: 0, status: false })
    const [isInPrintMode, setIsInPrintMode] = useState<any>({ id: 0, status: false })
    const [isInDeleteMode, setIsInDeleteMode] = useState<any>({ id: 0, status: false })
    // const [file, setFile] = useState<any>(null)
    const formik = useFormik({
        initialValues: {
            testValue: null,
            comment: null,
            status: false,
            file: null
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    // Columns configuration for the data grid
    const columns: GridColDef[] = [
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'procedure', headerName: 'Procedure', flex: 1 },
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

                if (row.status === 'Completed') {
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
                        <GridActionsCellItem
                            sx={{ opacity: 0, pointerEvents: 'none' }}
                            icon={<Delete />}
                            label="Delete"
                        />,
                        <CheckCircle color='success' />
                    ]
                }

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
                    <GridActionsCellItem
                        icon={<Delete />}
                        label="Delete"
                        onClick={() => handleConfirmDelete(row)}
                    />,
                    <Circle color='error' />
                ]
            },
        },
    ]

    // Dummy data 
    const dummyRows: any[] = [
        { id: 1, date: '2024-02-01', procedure: 'MRI Scan', doctor: 'Dr. John Doe', status: 'Pending', notes: 'Some notes' },
        { id: 2, date: '2024-02-02', procedure: 'X-ray', doctor: 'Dr. Jane Doe', status: 'Completed', notes: 'Some notes' },
    ];

    const handlePrintClick = (rowData: any) => {
        setIsInPrintMode({ id: rowData.id, status: true });
    }

    const handleEditClick = (rowData: any) => {
        formik.setFieldValue('testValue', rowData.testValue)
        formik.setFieldValue('comment', rowData.comment)
        formik.setFieldValue('status', rowData.status === 'Completed' ? true : false)
        setIsInEditMode({ id: rowData.id, status: true });
    };

    const handleConfirmDelete = (rowData: any) => {
        setIsInDeleteMode({ id: rowData.id, status: true });
    };

    const editDialog = (selectedRowData: any) => {
        const { id, date, procedure, doctor } = selectedRowData;

        console.log(id)

        return (
            <Dialog open={isInEditMode} onClose={() => setIsInEditMode({ id: 0, status: false })} fullWidth maxWidth="md" scroll="paper">
                <DialogTitle variant='h5' >
                    <Grid container direction={'column'} justifyContent="space-between" alignItems="center" borderBottom={1} py={2}>
                        <Typography variant="h5" position={'absolute'} display={'flex'} justifyContent={'center'} width={'100%'}>
                            {procedure}
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
                    <DialogContent
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 10,
                            justifyContent: 'space-between',
                            alignItems: 'end',
                            padding: '2rem',
                        }}
                    >
                        <Grid container direction={'column'} gap={3} width={'100%'}>
                            <Grid item width={'100%'}>
                                <TextField
                                    label="test-value"
                                    variant="outlined"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.testValue}
                                    name="testValue"
                                />
                            </Grid>
                            <Grid item width={'100%'}>
                                <TextField
                                    label="Comment"
                                    variant="outlined"
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.comment}
                                    name="comment"
                                />
                            </Grid>
                            <Grid item width={'100%'}>
                                <FileUploadAndPreview labelName='Upload Report' />
                            </Grid>
                            <Grid container width={'100%'} justifyContent={'center'}>
                                <FormControlLabel
                                    label="Mark Complete?"
                                    control={
                                        <Checkbox
                                            checked={formik.values.status}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            name="status"
                                        />
                                    }
                                />
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
                                <Typography>Test Name: {data.procedure}</Typography>
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

    const deleteDialog = (selectedRowData: any) => {
        const { id } = selectedRowData;

        const handleDelete = (id: number) => {
            console.log('Deleted', id)
        }

        return <DeleteConfirmationModal
            open={isInDeleteMode}
            onClose={() => setIsInDeleteMode({ id: 0, status: false })}
            onConfirm={() => handleDelete(id)}
            text='this procedure'
        />
    }

    const createForm = useFormik({
        initialValues: {
            fields: [
                { procedure: null, doctor: null, date: new Date() },

            ],
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    const handleAddFields = () => {
        createForm.setFieldValue('fields', [
            ...createForm.values.fields,
            { procedure: null, doctor: null, date: new Date() }
        ]);
    };

    const handleDeleteField = (index: number) => {
        const newFields = [...createForm.values.fields];
        newFields.splice(index, 1);
        createForm.setFieldValue('fields', newFields);
    };

    const closeForm = () => {
        createForm.resetForm();
        setDialogOpen(false);
    }

    // Main return statement
    return (
        <Box p={2}>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" color="text.secondary">
                    Procedures
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}><Add />Create New</Button>
            </Grid>
            <CustomDataGrid rows={dummyRows} columns={columns} pageSizeOptions={[5, 10]}
            />

            {dialogOpen && (
                <FormForJourney
                    title="procedure"
                    onClose={closeForm}
                    open={dialogOpen}
                    form={createForm}
                    handleAddFields={handleAddFields}
                    handleDeleteField={handleDeleteField} />
            )}
            {isInEditMode.status && (
                editDialog(dummyRows.find(row => row.id === isInEditMode.id))
            )}
            {isInPrintMode.status && (
                printDialog(dummyRows.find(row => row.id === isInPrintMode.id))
            )}
            {isInDeleteMode.status && (
                deleteDialog(dummyRows.find(row => row.id === isInDeleteMode.id))
            )}
        </Box>
    )
}

export default Procedures

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