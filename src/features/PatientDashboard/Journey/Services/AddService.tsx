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
import { AddServiceValidationSchema } from '../../../../yup/patientDashboard/service';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';
import Delete from '@mui/icons-material/Delete';
import getFilteredOptions from '../../../../utils/getFilteredOptions';
import { RootState } from '../../../../app/store';
import { useSelector } from 'react-redux';
import { useAddServiceMutation } from '../../../../services/patientDashboardService/serviceApi';
import { useToast } from '../../../../context/ToastContext';
import { IMasterService } from '../../../../types/master';
import { FilterOptionType } from '../../../../types/global';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import DoctorPicker from '../../../../components/DoctorPicker/DoctorPicker';

interface AddServiceProps {
  open?: boolean;
  onClose?: () => void;
  masterServices: IMasterService[];
}

const AddService: React.FC<AddServiceProps> = ({
  open,
  onClose,
  masterServices,
}) => {
  const { patient, case: patientCase } = useSelector(
    (state: RootState) => state.patients,
  );
  const { showPromiseToast } = useToast();

  const [addPatientService, { isLoading }] = useAddServiceMutation();

  const handleSubmit = async (values: any) => {
    const payload = [];
    for (let i = 0; i < values.fields.length; i++) {
      if (patientCase && patient) {
        const data = {
          caseId: patientCase.caseId,
          patient: patient._id,
          patientCode: patient.patientId,
          doctor: values?.fields[i]?.doctor?._id || null,
          service: values.fields[i].service._id,
          date: values.fields[i].date.toISOString(),
        };
        payload.push(data);
      }
    }

    console.log('payload', payload);

    const promise = addPatientService(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding Service',
      success: response => response.message || 'Service added successfully',
      error: err =>
        `Error: ${err.response?.data?.message || 'Failed to add Service'}`,
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
      fields: [
        {
          service: null,
          doctor: null,
          date: null,
        },
      ],
    },
    validationSchema: AddServiceValidationSchema,
    onSubmit: handleSubmit,
  });

  const memoizedGetFilteredOptions = useCallback(
    (currentIndex: number, selectedKey: 'service') => {
      // Assuming options are stored in the component's state or props
      const options: FilterOptionType[] =
        selectedKey === 'service' ? masterServices : [];

      return getFilteredOptions(
        currentIndex,
        options,
        selectedKey,
        createForm.values.fields,
      );
    },
    [createForm.values.fields, masterServices],
  );

  const getFieldErrorAndTouched = useCallback(
    (index: number, fieldName: 'service' | 'doctor' | 'date') => {
      // Ensure that we're working with the correct structure
      const touched = createForm?.touched?.fields as FormikTouched<{
        service: null;
        doctor: null;
        date: Date;
      }>[];
      const error = createForm?.errors?.fields as FormikErrors<{
        service: null;
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
      {
        service: null,
        doctor: createForm.values.fields[0].doctor,
        date: new Date(),
      },
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
        Add Services
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
                  isError: isServiceError,
                  errorMessage: serviceErrorMessage,
                } = getFieldErrorAndTouched(index, 'service');
                const {
                  isError: isDoctorError,
                  errorMessage: doctorErrorMessage,
                } = getFieldErrorAndTouched(index, 'doctor');
                const { isError: isDateError, errorMessage: dateErrorMessage } =
                  getFieldErrorAndTouched(index, 'date');
                return (
                  <Grid container gap={2} key={index}>
                    {/* Abstracted Autocomplete for Services */}
                    <Grid item flex={3}>
                      <FieldAutocomplete
                        options={memoizedGetFilteredOptions(index, 'service')}
                        getOptionLabel={option => option?.name}
                        getOptionKey={option => option._id}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        value={createForm.values.fields[index].service}
                        onChange={newValue =>
                          createForm.setFieldValue(
                            `fields.${index}.service`,
                            newValue,
                          )
                        }
                        label="Services"
                        error={isServiceError}
                        helperText={isServiceError ? serviceErrorMessage : ''}
                      />
                    </Grid>
                    {/* Abstracted Autocomplete for Doctors */}
                    <Grid item flex={3}>
                      <DoctorPicker
                        formState={createForm}
                        fieldName={`fields[${index}].doctor`}
                        label="Doctor"
                        error={isDoctorError}
                        helperText={isDoctorError ? doctorErrorMessage : ''}
                        autoSelectIfDoctor={true}
                      />
                    </Grid>
                    {/* Date Picker */}
                    <Grid item flex={3}>
                      <CustomDatePicker
                        label="Date"
                        minDate={
                          new Date(new Date().setDate(new Date().getDate() - 7))
                        }
                        format="dd/MM/yyyy"
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
                    field => !field.service || !field.doctor || !field.date,
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

export default AddService;
