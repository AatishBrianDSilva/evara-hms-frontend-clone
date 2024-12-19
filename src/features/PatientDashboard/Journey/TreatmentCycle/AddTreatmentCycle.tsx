import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';

import Paper from '@mui/material/Paper';

import Add from '@mui/icons-material/Add';

import { FormikErrors, FormikTouched, useFormik } from 'formik';
import { Grid, IconButton } from '@mui/material';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';
import Delete from '@mui/icons-material/Delete';
import getFilteredOptions from '../../../../utils/getFilteredOptions';
import { RootState } from '../../../../app/store';
import { useSelector } from 'react-redux';
import { useAddTreatmentCycleMutation } from '../../../../services/patientDashboardService/treatmentCycleApi';
import { useToast } from '../../../../context/ToastContext';
import { IDoctor } from '../../../../types/doctor';
import { FilterOptionType } from '../../../../types/global';
import { IMasterTreatmentCycle } from '../../../../types/master';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import { AddTreatmentCycleValidationSchema } from '../../../../yup/patientDashboard/treatmentCycle';

interface AddTreatmentCycleProps {
  open?: boolean;
  onClose?: () => void;
  doctors: IDoctor[];
  masterTreatmentCycles: IMasterTreatmentCycle[];
}

const AddTreatmentCycle: React.FC<AddTreatmentCycleProps> = ({
  open,
  onClose,
  doctors,
  masterTreatmentCycles,
}) => {
  const { patient, case: patientCase } = useSelector(
    (state: RootState) => state.patients,
  );
  const { showPromiseToast } = useToast();

  const [addPatientTreatmentCycles, { isLoading }] =
    useAddTreatmentCycleMutation();

  const handleSubmit = async (values: any) => {
    const payload = [];
    for (let i = 0; i < values.fields.length; i++) {
      if (patientCase && patient) {
        const data = {
          caseId: patientCase.caseId,
          patient: patient._id,
          patientCode: patient.patientId,
          doctor: values.fields[i].doctor._id,
          cycle: values.fields[i].treatmentCycle._id,
          date: values.fields[i].date.toISOString(),
        };
        payload.push(data);
      }
    }

    console.log('payload', payload);

    const promise = addPatientTreatmentCycles(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding Treatment Cycle(s)...',
      success: response => response || 'Treatment Cycle(s) added successfully',
      error: err =>
        `Error: ${err.response?.data?.message || 'Failed to add Treatment Cycle(s)'}`,
    });

    try {
      await promise;
      createForm.resetForm();
      onClose && onClose();
    } catch (error) {
      console.log('error', error);
    }
  };

  const createForm = useFormik({
    initialValues: {
      fields: [{ treatmentCycle: null, doctor: doctors.length > 0 ? doctors[0] : null, date: null }],
    },
    validationSchema: AddTreatmentCycleValidationSchema,
    onSubmit: handleSubmit,
  });

  const memoizedGetFilteredOptions = useCallback(
    (currentIndex: number, selectedKey: 'treatmentCycle') => {
      // Assuming options are stored in the component's state or props
      const options: FilterOptionType[] =
        selectedKey === 'treatmentCycle' ? masterTreatmentCycles : [];

      return getFilteredOptions(
        currentIndex,
        options,
        selectedKey,
        createForm.values.fields,
      );
    },
    [createForm.values.fields, doctors, masterTreatmentCycles],
  );

  const getFieldErrorAndTouched = useCallback(
    (index: number, fieldName: 'treatmentCycle' | 'doctor' | 'date') => {
      // Ensure that we're working with the correct structure
      const touched = createForm?.touched?.fields as FormikTouched<{
        treatmentCycle: null;
        doctor: null;
        date: Date;
      }>[];
      const error = createForm?.errors?.fields as FormikErrors<{
        treatmentCycle: null;
        doctor: null;
        date: Date;
      }>[];

      const isFieldTouched = touched?.[index]?.[fieldName];
      const fieldError = error?.[index]?.[fieldName];

      return {
        isError: Boolean(isFieldTouched && fieldError),
        errorMessage: typeof fieldError === 'string' ? fieldError : undefined,
      };
    },
    [createForm.touched.fields, createForm.errors.fields],
  );

  const handleAddFields = () => {
    createForm.setFieldValue('fields', [
      ...createForm.values.fields,
      { treatmentCycle: null, doctor: doctors.length > 0 ? doctors[0] : null, date: new Date() },
    ]);
  };

  const handleDeleteField = (index: number) => {
    const newFields = [...createForm.values.fields];
    newFields.splice(index, 1);
    createForm.setFieldValue('fields', newFields);
  };

  return (
    <Dialog
      open={open || false}
      onClose={onClose || (() => {})}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 4 }} variant="h5">
        Add TreatmentCycles
      </DialogTitle>
      <Box component={'form'} onSubmit={createForm.handleSubmit}>
        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
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
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              {createForm.values.fields.map((_field: any, index: number) => {
                const {
                  isError: isTreatmentCyclesError,
                  errorMessage: treatmentCycleErrorMessage,
                } = getFieldErrorAndTouched(index, 'treatmentCycle');
                const {
                  isError: isDoctorError,
                  errorMessage: doctorErrorMessage,
                } = getFieldErrorAndTouched(index, 'doctor');
                const { isError: isDateError, errorMessage: dateErrorMessage } =
                  getFieldErrorAndTouched(index, 'date');
                return (
                  <Grid container gap={2} key={index}>
                    {/* Abstracted Autocomplete for TreatmentCycless */}
                    <Grid item flex={3}>
                      <FieldAutocomplete
                        options={memoizedGetFilteredOptions(
                          index,
                          'treatmentCycle',
                        )}
                        getOptionLabel={option => option?.name}
                        getOptionKey={option => option._id}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        value={createForm.values.fields[index].treatmentCycle}
                        onChange={newValue =>
                          createForm.setFieldValue(
                            `fields.${index}.treatmentCycle`,
                            newValue,
                          )
                        }
                        label="Treatment Cycles"
                        error={isTreatmentCyclesError}
                        helperText={
                          isTreatmentCyclesError
                            ? treatmentCycleErrorMessage
                            : ''
                        }
                      />
                    </Grid>
                    {/* Abstracted Autocomplete for Doctors */}
                    <Grid item flex={3}>
                      <FieldAutocomplete
                        options={doctors}
                        getOptionLabel={option =>
                          `${option.firstName} ${option.lastName}`
                        }
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        value={createForm.values.fields[index].doctor}
                        onChange={newValue =>
                          createForm.setFieldValue(
                            `fields.${index}.doctor`,
                            newValue,
                          )
                        }
                        label="Doctor"
                        error={isDoctorError}
                        helperText={isDoctorError ? doctorErrorMessage : ''}
                      />
                    </Grid>
                    {/* Date Picker */}
                    <Grid item flex={3}>
                      <CustomDatePicker
                        label="Date"
                        // minDate={new Date()}
                        value={createForm.values.fields[index].date}
                        onChange={newValue =>
                          createForm.setFieldValue(
                            `fields.${index}.date`,
                            newValue,
                          )
                        }
                        error={isDateError}
                        helperText={isDateError ? dateErrorMessage : ''}
                      />
                    </Grid>
                    {/* Dynamic Add/Delete Buttons */}
                    <Grid item flex={0.5}>
                      {createForm.values.fields.length > 1 &&
                        index != 0 &&
                        handleDeleteField && (
                          <IconButton onClick={() => handleDeleteField(index)}>
                            <Delete />
                          </IconButton>
                        )}
                    </Grid>
                  </Grid>
                );
              })}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 2,
                }}
              >
                <IconButton
                  disabled={createForm.values.fields.some(
                    field =>
                      !field.treatmentCycle || !field.doctor || !field.date,
                  )}
                  color="primary"
                  onClick={handleAddFields}
                >
                  <Add />
                </IconButton>
              </Box>
            </Box>
          </DialogContent>
        </Paper>
        <DialogActions sx={{ pb: 4, gap: 1, justifyContent: 'center' }}>
          <Button variant="contained" disabled={isLoading} type="submit">
            Save
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddTreatmentCycle;
