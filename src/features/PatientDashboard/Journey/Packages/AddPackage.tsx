import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Add from '@mui/icons-material/Add';
import { useFormik, FormikErrors, FormikTouched } from 'formik';
import { Grid, IconButton } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import getFilteredOptions from '../../../../utils/getFilteredOptions';
import { IMasterPackages } from '../../../../types/master';
import { IDoctor } from '../../../../types/doctor';
import { useAddPackageMutation } from '../../../../services/patientDashboardService/packageApi';
import { useToast } from '../../../../context/ToastContext';
import { RootState } from '../../../../app/store';
import { useSelector } from 'react-redux';

interface AddPackageProps {
  open?: boolean;
  onClose?: () => void;
  masterPackages: IMasterPackages[];
  doctors: IDoctor[];
}

interface FieldType {
  package: IMasterPackages | null;
  date: Date | null;
  doctor: IDoctor | null;
}

const AddPackage: React.FC<AddPackageProps> = ({
  open,
  onClose,
  masterPackages,
  doctors,
}) => {
  const { patient, case: patientCase } = useSelector(
    (state: RootState) => state.patients,
  );
  const { showPromiseToast } = useToast();
  const [addPatientPackage] = useAddPackageMutation();

  const handleSubmit = async (values: { fields: FieldType[] }) => {
    const payload = [];
    for (let i = 0; i < values.fields.length; i++) {
      if (patientCase && patient) {
        const data = {
          caseId: patientCase.caseId,
          patient: patient._id,
          patientCode: patient.patientId,
          package: values.fields[i].package?._id || '',
          date: values.fields[i].date?.toISOString() || '',
          doctor: values.fields[i].doctor?._id || '', // Include doctor ID in payload
          price: values.fields[i].package?.price || '', // Include package price in payload
        };
        payload.push(data);
      }
    }

    console.log('payload', payload);

    const promise = addPatientPackage(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding Packages',
      success: response => response.message || 'Packages added successfully',
      error: err =>
        `Error: ${err.response?.data?.message || 'Failed to add Packages'}`,
    });

    try {
      await promise;
      createForm.resetForm();
      onClose && onClose();
    } catch (error) {
      console.log('error', error);
    }
  };

  const createForm = useFormik<{ fields: FieldType[] }>({
    initialValues: {
      fields: [{ package: null, date: null, doctor: doctors.length > 0 ? doctors[0] : null
      }],
    },
    onSubmit: handleSubmit,
  });

  const memoizedGetFilteredOptions = useCallback(
    (currentIndex: number) => {
      const selectedPackages = createForm.values.fields.map(
        field => field.package?._id,
      );
      let filteredPackages = masterPackages;

      // console.log("Patient gender", patient?.gender);

      // Check if the patient's gender is male
      if (patient?.gender === 'male' || patient?.gender === 'Male') {
        // Filter out packages where the gender is female
        filteredPackages = filteredPackages.filter(
          pkg => pkg.gender !== 'female',
        );
        console.log('Filtered Packages:', filteredPackages);
      }

      // Further filter to ensure no already selected packages are shown
      filteredPackages = filteredPackages.filter(
        pkg => !selectedPackages.includes(pkg._id),
      );

      return getFilteredOptions(
        currentIndex,
        filteredPackages,
        'package',
        createForm.values.fields,
      );
    },
    [createForm.values.fields, masterPackages, patient?.gender],
  );

  const getFieldErrorAndTouched = useCallback(
    (index: number, fieldName: keyof FieldType) => {
      const touched = createForm.touched.fields as FormikTouched<FieldType[]>[];
      const error = createForm.errors.fields as FormikErrors<FieldType[]>[];

      const isFieldTouched = touched?.[index]?.[fieldName as any];
      const fieldError = error?.[index]?.[fieldName as any];

      return {
        isError: Boolean(isFieldTouched && fieldError),
        errorMessage: typeof fieldError === 'string' ? fieldError : undefined,
      };
    },
    [createForm.touched.fields, createForm.errors.fields],
  );

  const handlePackageChange = (
    selectedPackage: IMasterPackages | null,
    index: number,
  ) => {
    const updatedFields = [...createForm.values.fields];
    updatedFields[index].package = selectedPackage;
    createForm.setFieldValue('fields', updatedFields);
  };

  const handleDoctorChange = (
    selectedDoctor: IDoctor | null,
    index: number,
  ) => {
    const updatedFields = [...createForm.values.fields];
    updatedFields[index].doctor = selectedDoctor;
    createForm.setFieldValue('fields', updatedFields);
  };

  const handleAddFields = () => {
    createForm.setFieldValue('fields', [
      ...createForm.values.fields,
      { package: null, date: new Date(), doctor: doctors.length > 0 ? doctors[0] : null},
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
        Add Packages
      </DialogTitle>
      <Box component={'form'} onSubmit={createForm.handleSubmit}>
        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
          <DialogContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '2rem',
            }}
          >
            {createForm.values.fields.map(
              (_field: FieldType, index: number) => {
                const {
                  isError: isPackageError,
                  errorMessage: packageErrorMessage,
                } = getFieldErrorAndTouched(index, 'package');
                const { isError: isDateError, errorMessage: dateErrorMessage } =
                  getFieldErrorAndTouched(index, 'date');
                const {
                  isError: isDoctorError,
                  errorMessage: doctorErrorMessage,
                } = getFieldErrorAndTouched(index, 'doctor');

                return (
                  <Grid container gap={2} key={index}>
                    {/* Autocomplete for Packages */}
                    <Grid item flex={1}>
                      <FieldAutocomplete
                        options={memoizedGetFilteredOptions(index)}
                        getOptionLabel={option => option?.name || ''}
                        getOptionKey={option => option._id || ''}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        value={createForm.values.fields[index].package}
                        onChange={newValue =>
                          handlePackageChange(newValue, index)
                        }
                        label="Packages"
                        error={isPackageError}
                        helperText={isPackageError ? packageErrorMessage : ''}
                      />
                    </Grid>
                    {/* Doctor Field */}
                    <Grid item flex={1}>
                      <FieldAutocomplete
                        options={doctors}
                        getOptionLabel={option =>
                          `${option.firstName} ${option.lastName}`
                        }
                        getOptionKey={option => option._id}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        value={createForm.values.fields[index].doctor}
                        onChange={newValue =>
                          handleDoctorChange(newValue, index)
                        }
                        label="Doctor"
                        error={isDoctorError}
                        helperText={isDoctorError ? doctorErrorMessage : ''}
                      />
                    </Grid>
                    {/* Date Field */}
                    <Grid item flex={1}>
                      <CustomDatePicker
                        label="Date"
                        minDate={new Date()}
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
                      {createForm.values.fields.length > 1 && index !== 0 && (
                        <IconButton onClick={() => handleDeleteField(index)}>
                          <Delete />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                );
              },
            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 2,
              }}
            >
              <IconButton
                color="primary"
                onClick={handleAddFields}
                disabled={createForm.values.fields.some(
                  field => !field.package || !field.date || !field.doctor,
                )}
              >
                <Add />
              </IconButton>
            </Box>
          </DialogContent>
        </Paper>
        <DialogActions sx={{ pb: 4, gap: 1, justifyContent: 'center' }}>
          <Button
            variant="contained"
            type="submit"
            disabled={createForm.values.fields.some(
              field => !field.package || !field.doctor,
            )}
          >
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

export default AddPackage;
