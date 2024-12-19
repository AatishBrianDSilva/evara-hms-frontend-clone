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
import { AddProcedureValidationSchema } from '../../../../yup/patientDashboard/procedure';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';
import Delete from '@mui/icons-material/Delete';
import getFilteredOptions from '../../../../utils/getFilteredOptions';
import { RootState } from '../../../../app/store';
import { useSelector } from 'react-redux';
import { useAddProcedureMutation } from '../../../../services/patientDashboardService/procedureApi';
import { useToast } from '../../../../context/ToastContext';
import { IDoctor } from '../../../../types/doctor';
import { FilterOptionType } from '../../../../types/global';
import { IMasterProcedures } from '../../../../types/master';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';

interface AddProcedureProps {
  open?: boolean;
  onClose?: () => void;
  doctors: IDoctor[];
  masterProcedures: IMasterProcedures[];
}

const AddProcedure: React.FC<AddProcedureProps> = ({
  open,
  onClose,
  doctors,
  masterProcedures,
}) => {
  const { patient, case: patientCase } = useSelector(
    (state: RootState) => state.patients,
  );
  const { showPromiseToast } = useToast();

  const [addPatientProcedures, { isLoading }] = useAddProcedureMutation();

  const handleSubmit = async (values: any) => {
    const payload = [];
    for (let i = 0; i < values.fields.length; i++) {
      if (patientCase && patient) {
        const data = {
          caseId: patientCase.caseId,
          patient: patient._id,
          patientCode: patient.patientId,
          doctor: values.fields[i].doctor._id,
          procedure: values.fields[i].procedure._id,
          date: values.fields[i].date.toISOString(),
        };
        payload.push(data);
      }
    }

    console.log('payload', payload);

    const promise = addPatientProcedures(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding Procedures',
      success: response => response.message || 'Procedures added successfully',
      error: err =>
        `Error: ${err.response?.data?.message || 'Failed to add Procedures'}`,
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
      fields: [{ procedure: null, doctor: doctors.length > 0 ? doctors[0] : null, date: null }],
    },
    validationSchema: AddProcedureValidationSchema,
    onSubmit: handleSubmit,
  });

  const memoizedGetFilteredOptions = useCallback(
    (currentIndex: number, selectedKey: 'procedure') => {
      // Assuming options are stored in the component's state or props
      const options: FilterOptionType[] =
        selectedKey === 'procedure' ? masterProcedures : [];

      return getFilteredOptions(
        currentIndex,
        options,
        selectedKey,
        createForm.values.fields,
      );
    },
    [createForm.values.fields, doctors, masterProcedures],
  );

  const getFieldErrorAndTouched = useCallback(
    (index: number, fieldName: 'procedure' | 'doctor' | 'date') => {
      // Ensure that we're working with the correct structure
      const touched = createForm?.touched?.fields as FormikTouched<{
        procedure: null;
        doctor: null;
        date: Date;
      }>[];
      const error = createForm?.errors?.fields as FormikErrors<{
        procedure: null;
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
      { procedure: null, doctor: doctors.length > 0 ? doctors[0] : null, date: new Date() },
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
        Add Procedures
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
                  isError: isProceduresError,
                  errorMessage: procedureErrorMessage,
                } = getFieldErrorAndTouched(index, 'procedure');
                const {
                  isError: isDoctorError,
                  errorMessage: doctorErrorMessage,
                } = getFieldErrorAndTouched(index, 'doctor');
                const { isError: isDateError, errorMessage: dateErrorMessage } =
                  getFieldErrorAndTouched(index, 'date');
                return (
                  <Grid container gap={2} key={index}>
                    {/* Abstracted Autocomplete for Proceduress */}
                    <Grid item flex={3}>
                      <FieldAutocomplete
                        options={memoizedGetFilteredOptions(index, 'procedure')}
                        groupBy={option => option?.procedure?.procedureType}
                        getOptionLabel={option => option?.name}
                        getOptionKey={option => option._id}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        value={createForm.values.fields[index].procedure}
                        onChange={newValue =>
                          createForm.setFieldValue(
                            `fields.${index}.procedure`,
                            newValue,
                          )
                        }
                        label="Procedures"
                        error={isProceduresError}
                        helperText={
                          isProceduresError ? procedureErrorMessage : ''
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
                        minDate={new Date(new Date().setDate(new Date().getDate() - 7))}
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
                    field => !field.procedure || !field.doctor || !field.date,
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

export default AddProcedure;
