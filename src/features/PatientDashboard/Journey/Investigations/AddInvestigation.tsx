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
import { AddInvestigationValidationSchema } from '../../../../yup/patientDashboard/investigation';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';
import Delete from '@mui/icons-material/Delete';
import getFilteredOptions from '../../../../utils/getFilteredOptions';
import { RootState } from '../../../../app/store';
import { useSelector } from 'react-redux';
import { useAddInvestigationMutation } from '../../../../services/patientDashboardService/investigationApi';
import { useToast } from '../../../../context/ToastContext';
import { ETestType, IMasterInvestigation } from '../../../../types/master';
import { FilterOptionType } from '../../../../types/global';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import DoctorPicker from '../../../../components/DoctorPicker/DoctorPicker';

interface AddInvestigationProps {
  open?: boolean;
  onClose?: () => void;
  masterInvestigations: IMasterInvestigation[];
}

const AddInvestigation: React.FC<AddInvestigationProps> = ({
  open,
  onClose,
  masterInvestigations,
}) => {
  const { patient, case: patientCase } = useSelector(
    (state: RootState) => state.patients,
  );
  const { showPromiseToast } = useToast();

  const [addPatientInvestigation, { isLoading }] =
    useAddInvestigationMutation();

  const handleSubmit = async (values: any) => {
    const payload = [];
    for (let i = 0; i < values.fields.length; i++) {
      if (patientCase && patient) {
        const data = {
          caseId: patientCase.caseId,
          patient: patient._id,
          patientCode: patient.patientId,
          doctor: values.fields[i].doctor._id,
          investigation: values.fields[i].investigation._id,
          date: values.fields[i].date.toISOString(),
        };
        payload.push(data);
      }
    }

    console.log('payload', payload);

    const promise = addPatientInvestigation(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding Investigation',
      success: response =>
        response.message || 'Investigation added successfully',
      error: err =>
        `Error: ${err.response?.data?.message || 'Failed to add Investigation'}`,
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
          investigation: null,
          doctor: null,
          date: null,
        },
      ],
    },
    validationSchema: AddInvestigationValidationSchema,
    onSubmit: handleSubmit,
  });

  const memoizedGetFilteredOptions = useCallback(
    (currentIndex: number, selectedKey: 'investigation') => {
      // Assuming options are stored in the component's state or props
      const options: FilterOptionType[] =
        selectedKey === 'investigation' ? masterInvestigations : [];

      return getFilteredOptions(
        currentIndex,
        options,
        selectedKey,
        createForm.values.fields,
      );
    },
    [createForm.values.fields, masterInvestigations],
  );

  const getFieldErrorAndTouched = useCallback(
    (index: number, fieldName: 'investigation' | 'doctor' | 'date') => {
      // Ensure that we're working with the correct structure
      const touched = createForm?.touched?.fields as FormikTouched<{
        investigation: null;
        doctor: null;
        date: Date;
      }>[];
      const error = createForm?.errors?.fields as FormikErrors<{
        investigation: null;
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
        investigation: null,
        doctor:
          createForm.values.fields.length > 0
            ? createForm.values.fields[0].doctor
            : null,
        date: null,
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
        Add Investigations
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
                  isError: isInvestigationError,
                  errorMessage: investigationErrorMessage,
                } = getFieldErrorAndTouched(index, 'investigation');
                const {
                  isError: isDoctorError,
                  errorMessage: doctorErrorMessage,
                } = getFieldErrorAndTouched(index, 'doctor');
                const { isError: isDateError, errorMessage: dateErrorMessage } =
                  getFieldErrorAndTouched(index, 'date');
                return (
                  <Grid container gap={2} key={index}>
                    {/* Abstracted Autocomplete for Investigations */}
                    <Grid item flex={3}>
                      <FieldAutocomplete
                        options={memoizedGetFilteredOptions(
                          index,
                          'investigation',
                        )}
                        groupBy={option => {
                          const group =
                            option?.test?.testType === ETestType.BloodTest
                              ? 'Blood Tests'
                              : 'Others';
                          return group;
                        }}
                        getOptionLabel={option => option?.name}
                        getOptionKey={option => option._id}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        value={createForm.values.fields[index].investigation}
                        onChange={newValue =>
                          createForm.setFieldValue(
                            `fields.${index}.investigation`,
                            newValue,
                          )
                        }
                        label="Investigations"
                        error={isInvestigationError}
                        helperText={
                          isInvestigationError ? investigationErrorMessage : ''
                        }
                      />
                    </Grid>
                    <Grid item flex={3}>
                      <DoctorPicker
                        formState={createForm}
                        formIndex={index}
                        fieldName={`fields.${index}.doctor`}
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
                    field =>
                      !field.investigation || !field.doctor || !field.date,
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

export default AddInvestigation;
