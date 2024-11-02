import React, { useCallback } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import _ from 'lodash';
import { useToast } from '../../../../context/ToastContext';
import { Add, Delete } from '@mui/icons-material';
import { useAddMasterMedicalTestMutation } from '../../../../services/masterDashboardService/serviceData/masterInvestigationApi';

interface AddMasterBloodTestProps {
  openModal: boolean;
  onClose: () => void;
}

interface IComponent {
  componentName: string;
  unit: string;
  referenceRange: string;
}

interface IFormValues {
  testName: string;
  description: string;
  gender: string;
  components: IComponent[];
}

const AddMasterBloodTest: React.FC<AddMasterBloodTestProps> = ({
  openModal,
  onClose,
}) => {
  const { showPromiseToast } = useToast();

  const [addInvestigation, { isLoading }] = useAddMasterMedicalTestMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      testName: values.testName,
      description: values.description,
      gender: values.gender,
      testType: 'BloodTest', // Ensure testType is set to 'BloodTest'

      components: values.components.map(component => ({
        componentName: component.componentName,
        unit: component.unit,
        referenceRange: component.referenceRange,
        componentType: 'text', // Set componentType to 'text'
      })),
    };

    console.log('Payload to be submitted:', payload); // Log the payload

    const promise = addInvestigation(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding...',
      success: data => data || 'Added Successfully',
      error: data => data || 'Adding Failed',
    });

    try {
      await promise;
      onClose();
      formik.resetForm();
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  const initialValues: IFormValues = {
    testName: '',
    description: '',
    gender: '',
    components: [
      {
        componentName: '',
        unit: '',
        referenceRange: '',
      },
    ],
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  const handleAddFields = () => {
    formik.setFieldValue('components', [
      ...formik.values.components,
      { componentName: null, unit: null, referenceRange: null },
    ]);
  };

  const handleDeleteField = (index: number) => {
    const newFields = formik.values.components.filter((_, i) => i !== index);
    formik.setFieldValue('components', newFields);
  };

  const getFieldErrorAndTouched = useCallback(
    (index: number, fieldName: 'componentName' | 'unit' | 'referenceRange') => {
      // Ensure that we're working with the correct structure
      const touched = formik?.touched
        ?.components as FormikTouched<IComponent>[];
      const error = formik?.errors?.components as FormikErrors<IComponent>[];

      const isFieldTouched = touched?.[index]?.[fieldName];
      const fieldError = error?.[index]?.[fieldName];

      return {
        isError: Boolean(isFieldTouched && fieldError),
        errorMessage: typeof fieldError === 'string' ? fieldError : undefined,
      };
    },
    [formik.touched.components, formik.errors.components],
  );

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Add Master Blood Test</DialogTitle>
      <DialogContent>
        <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2} alignItems="center">
            <Grid item lg={2}>
              <TextField
                label="Test Name"
                name="testName"
                onChange={formik.handleChange}
                value={formik.values.testName}
                fullWidth
              />
            </Grid>
            <Grid item lg={2}>
              <TextField
                label="Description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                fullWidth
              />
            </Grid>
            <Grid item lg={2}>
              <TextField
                name="gender"
                select
                label="Gender"
                onChange={formik.handleChange}
                value={formik.values.gender}
                fullWidth
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" color={'primary'} mt={2}>
            Component Details
          </Typography>

          {formik.values.components.map((_field: any, index: number) => {
            const {
              isError: isComponentNameError,
              errorMessage: componentNameErrorMessage,
            } = getFieldErrorAndTouched(index, 'componentName');
            const { isError: isUnitError, errorMessage: unitErrorMessage } =
              getFieldErrorAndTouched(index, 'unit');
            // const { isError: isMrpPerUnitError, errorMessage: mrpPerPackErrorMessage } = getFieldErrorAndTouched(index, 'mrpPerPack');
            const {
              isError: isReferenceRangeError,
              errorMessage: referenceRangeErrorMessage,
            } = getFieldErrorAndTouched(index, 'referenceRange');

            const isLastItem = index === formik.values.components.length - 1;
            const onlyOneItem = formik.values.components.length === 1;

            return (
              <Grid container spacing={2} mb={2} mt={2} alignItems="center">
                <Grid item flex={1}>
                  <TextField
                    fullWidth
                    name={`components[${index}].componentName`}
                    label="Component Name"
                    value={formik.values.components[index].componentName || ''}
                    onChange={formik.handleChange}
                    error={isComponentNameError}
                    helperText={
                      isComponentNameError ? componentNameErrorMessage : ''
                    }
                  />
                </Grid>
                <Grid item flex={1}>
                  <TextField
                    fullWidth
                    name={`components[${index}].unit`}
                    label="Unit"
                    value={formik.values.components[index].unit || ''}
                    onChange={formik.handleChange}
                    error={isUnitError}
                    helperText={isUnitError ? unitErrorMessage : ''}
                  />
                </Grid>
                <Grid item flex={1}>
                  <TextField
                    fullWidth
                    name={`components[${index}].referenceRange`}
                    label="Reference Range"
                    value={formik.values.components[index].referenceRange || ''}
                    onChange={formik.handleChange}
                    error={isReferenceRangeError}
                    helperText={
                      isReferenceRangeError ? referenceRangeErrorMessage : ''
                    }
                  />
                </Grid>
                {/* Dynamic Add/Delete Buttons */}
                <Grid
                  item
                  flex={1}
                  display={'flex'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                >
                  {!onlyOneItem && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteField(index)}
                    >
                      <Delete fontSize={'small'} />
                    </IconButton>
                  )}
                  {isLastItem && (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={handleAddFields}
                      disabled={formik.values.components.some(
                        component => !component.componentName,
                      )}
                    >
                      <Add fontSize={'small'} />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            );
          })}

          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            gap={2}
            mb={2}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={_.isEqual(initialValues, formik.values) || isLoading}
              sx={{ width: 'fit-content' }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: 'fit-content' }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddMasterBloodTest;
