import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useToast } from '../../../context/ToastContext';
import { useEditNotesMutation } from '../../../services/patientDashboardService/notesApi';
import {
  INotesObservation,
  INotesTreatmentAdvice,
} from '../../../types/masterDashboard/local';
import { IMasterInvestigation, IMasterProcedures } from '../../../types/master';
import { IPharmacyStock } from '../../../types/pharmacyDashboard/stocks';
import { INote } from './Notes';

interface IFormValues {
  doctor: {
    _id: string;
  } | null;
  observations: string[];
  observationNotes: string;
  treatmentAdvices: string[];
  treatmentAdvicesNotes: string;
  investigations: string[];
  investigationsNotes: string;
  scans: string[];
  scansNotes: string;
  medications: string[];
  medicationsNotes: string;
  notes: string;
}

const EditNotes: React.FC<{
  closeModal: () => void;
  addModal: boolean;
  notesData: INote;
  observations: INotesObservation[];
  treatmentAdvices: INotesTreatmentAdvice[];
  investigations: IMasterInvestigation[];
  scans: IMasterProcedures[];
  medications: IPharmacyStock[];
}> = ({
  closeModal,
  addModal,
  notesData,
  observations,
  treatmentAdvices,
  investigations,
  scans,
  medications,
}) => {
  if (!notesData) return null;

  const observationOptions = observations
    .map(observations => observations?.name) // Map to get the names
    .filter(name => name !== undefined); // Filter out the undefined values

  const adviceOptions = treatmentAdvices
    .map(treatmentAdvices => treatmentAdvices?.name) // Map to get the names
    .filter(name => name !== undefined); // Filter out the undefined values

  const investigationNames = investigations
    .map(investigations => investigations?.test?.testName) // Map to get the names
    .filter(name => name !== undefined); // Filter out the undefined values

  const scanNames = scans
    .map(scans => scans?.procedure?.procedureName) // Map to get the names
    .filter(name => name !== undefined); // Filter out the undefined values

  const medicationNames = medications
    .map(medication => medication?.item?.name) // Map to get the names
    .filter(name => name !== undefined); // Filter out the undefined values

  const { showPromiseToast } = useToast();

  const { patient } = useSelector((state: RootState) => state.patients);

  console.log('Notes Data at Edit:', notesData);

  //Adding notes

  const [editNotes] = useEditNotesMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      _id: notesData._id,
      doctor: values.doctor?._id,
      patient: patient?._id,
      observations: values.observations,
      observationNotes: values.observationNotes,
      treatmentAdvices: values.treatmentAdvices,
      treatmentAdvicesNotes: values.treatmentAdvicesNotes,
      investigations: values.investigations,
      investigationsNotes: values.investigationsNotes,
      scans: values.scans,
      scansNotes: values.scansNotes,
      medications: values.medications,
      medicationsNotes: values.medicationsNotes,
      notes: values.notes,
    };

    console.log('Payload to be submitted:', payload);

    const promise = editNotes(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Editing...',
      success: data => data || 'Edited Successfully',
      error: data => data || 'Edit Failed',
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }

    closeModal();
  };

  const formik = useFormik({
    initialValues: {
      doctor: null,
      observations: notesData?.observations || [],
      observationNotes: notesData?.observationNotes || '',
      treatmentAdvices: notesData?.treatmentAdvices || [],
      treatmentAdvicesNotes: notesData?.treatmentAdvicesNotes || '',
      investigations: notesData?.investigations || [],
      investigationsNotes: notesData?.investigationsNotes || '',
      scans: notesData?.scans || [],
      scansNotes: notesData?.scansNotes || '',
      medications: notesData?.medications || [],
      medicationsNotes: notesData?.medicationsNotes || '',
      notes: notesData?.notes || '',
    },
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  return (
    <Dialog open={addModal} onClose={closeModal} fullWidth maxWidth={false}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        Edit Consultation Note
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: 'white',
          p: 2,
          borderRadius: 2,
          maxHeight: 600,
          overflowY: 'auto',
        }}
        style={{ paddingTop: '1rem' }}
      >
        <Box
          component={'form'}
          onSubmit={formik.handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            color: 'black',
            width: '100%',
          }}
        >
          <Grid container spacing={2} mt={2} justifyContent="center">
            <Grid item xs={6} sm={3} lg={3} pb={3}>
              <TextField
                disabled
                fullWidth
                value={notesData.doctor.firstName}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 2, pb: 2, width: '100%' }}>
            <Box width="calc(20% - 8px)" px={1}>
              <Grid item xs={6} sm={3} lg={3}>
                <Autocomplete
                  options={observationOptions}
                  value={formik.values.observations}
                  onChange={(_, newValue) => {
                    formik.setFieldValue('observations', newValue);
                  }}
                  renderInput={params => (
                    <TextField {...params} label="Observations" />
                  )}
                  multiple
                />
              </Grid>
            </Box>
            <Box width="calc(20% - 8px)" px={1}>
              <Grid item xs={6} sm={3} lg={3}>
                <Autocomplete
                  options={adviceOptions}
                  value={formik.values.treatmentAdvices}
                  onChange={(_, newValue) => {
                    formik.setFieldValue('treatmentAdvices', newValue);
                  }}
                  renderInput={params => (
                    <TextField {...params} label="Advices" />
                  )}
                  multiple
                />
              </Grid>
            </Box>
            <Box width="calc(20% - 8px)" px={1}>
              <Grid item xs={6} sm={3} lg={3}>
                <Autocomplete
                  options={investigationNames}
                  value={formik.values.investigations}
                  onChange={(_, newValue) => {
                    formik.setFieldValue('investigations', newValue);
                  }}
                  renderInput={params => (
                    <TextField {...params} label="Investigations" />
                  )}
                  multiple
                />
              </Grid>
            </Box>
            <Box width="calc(20% - 8px)" px={1}>
              <Grid item xs={6} sm={3} lg={3}>
                <Autocomplete
                  options={scanNames}
                  value={formik.values.scans}
                  onChange={(_, newValue) => {
                    formik.setFieldValue('scans', newValue);
                  }}
                  renderInput={params => (
                    <TextField {...params} label="Scans" />
                  )}
                  multiple
                />
              </Grid>
            </Box>
            <Box width="calc(20% - 8px)" px={1}>
              <Grid item xs={6} sm={3} lg={3}>
                <Autocomplete
                  fullWidth
                  options={medicationNames}
                  value={formik.values.medications}
                  onChange={(_, newValue) => {
                    formik.setFieldValue('medications', newValue);
                  }}
                  renderInput={params => (
                    <TextField {...params} label="Medications" />
                  )}
                  multiple
                />
              </Grid>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, pb: 2, width: '100%' }}>
            <Box width="calc(20% - 8px)" px={1}>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                sx={{ width: '100%' }}
                label="Observation Notes"
                value={formik.values.observationNotes}
                onChange={event =>
                  formik.setFieldValue('observationNotes', event.target.value)
                }
              />
            </Box>
            <Box width="calc(20% - 8px)" px={1}>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                sx={{ width: '100%' }}
                label="Advice Notes"
                value={formik.values.treatmentAdvicesNotes}
                onChange={event =>
                  formik.setFieldValue(
                    'treatmentAdvicesNotes',
                    event.target.value,
                  )
                }
              />
            </Box>
            <Box width="calc(20% - 8px)" px={1}>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                sx={{ width: '100%' }}
                label="Investigation Notes"
                value={formik.values.investigationsNotes}
                onChange={event =>
                  formik.setFieldValue(
                    'investigationsNotes',
                    event.target.value,
                  )
                }
              />
            </Box>
            <Box width="calc(20% - 8px)" px={1}>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                sx={{ width: '100%' }}
                label="Scans Notes"
                value={formik.values.scansNotes}
                onChange={event =>
                  formik.setFieldValue('scansNotes', event.target.value)
                }
              />
            </Box>
            <Box width="calc(20% - 8px)" px={1}>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                sx={{ width: '100%' }}
                label="Medications Notes"
                value={formik.values.medicationsNotes}
                onChange={event =>
                  formik.setFieldValue('medicationsNotes', event.target.value)
                }
              />
            </Box>
          </Box>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            label="Notes"
            value={formik.values.notes}
            // onChange={formik.handleChange}
            onChange={event =>
              formik.setFieldValue('notes', event.target.value)
            }
            fullWidth
          />
          <Box
            sx={{ display: 'flex', justifyContent: 'center', py: 2, gap: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ px: 2, textTransform: 'uppercase' }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              sx={{ px: 2, textTransform: 'uppercase' }}
              onClick={closeModal}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditNotes;
