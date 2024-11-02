import React from 'react';
import * as Yup from 'yup';
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
import FieldAutoComplete from '../../../components/FieldAutoComplete/FieldAutoComplete';
import { useAddNotesMutation } from '../../../services/patientDashboardService/notesApi';
import { useToast } from '../../../context/ToastContext';
import {
  INotesObservation,
  INotesTreatmentAdvice,
} from '../../../types/masterDashboard/local';
import { IMasterInvestigation, IMasterProcedures } from '../../../types/master';
import { IPharmacyStock } from '../../../types/pharmacyDashboard/stocks';
import { IDoctor } from '../../../types/doctor';

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

const AddNotes: React.FC<{
  closeModal: () => void;
  addModal: boolean;
  observations: INotesObservation[];
  treatmentAdvices: INotesTreatmentAdvice[];
  investigations: IMasterInvestigation[];
  scans: IMasterProcedures[];
  medications: IPharmacyStock[];
  doctors: IDoctor[];
}> = ({
  closeModal,
  addModal,
  observations,
  treatmentAdvices,
  investigations,
  scans,
  medications,
  doctors,
}) => {
  const { showPromiseToast } = useToast();

  const { patient } = useSelector((state: RootState) => state.patients);

  //Adding notes

  const [addProcedure] = useAddNotesMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
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

    console.log('Payload to be submitted:', payload); // Log the payload

    // Add your submission logic here, including tax
    // Extract tax from values
    const promise = addProcedure(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding...',
      success: data => data || 'Added Successfully',
      error: data => data || 'Adding Failed',
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
      observations: [],
      observationNotes: '',
      treatmentAdvices: [],
      treatmentAdvicesNotes: '',
      investigations: [],
      investigationsNotes: '',
      scans: [],
      scansNotes: '',
      medications: [],
      medicationsNotes: '',
      notes: '',
    },
    validationSchema: Yup.object().shape({
      doctor: Yup.object().required('Doctor is required'),
    }),
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

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

  return (
    <Dialog open={addModal} onClose={closeModal} fullWidth maxWidth={false}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        Create Consultation Note
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: 'white',
          p: 2,
          borderRadius: 2,
          pb: 3,
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
              <FieldAutoComplete
                label="Doctor"
                options={doctors}
                getOptionLabel={option =>
                  `${option.firstName} ${option.lastName}`
                }
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                value={formik.values.doctor || null} // Ensure value is not undefined
                onChange={value => {
                  formik.setFieldValue('doctor', value);
                }}
                error={formik.errors.doctor !== undefined}
                helperText={formik.errors.doctor}
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
                {/* </Box> */}
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

export default AddNotes;
