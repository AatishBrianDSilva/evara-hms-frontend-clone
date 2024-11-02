import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Grid, IconButton, Modal } from '@mui/material';
import { useToast } from '../../../../context/ToastContext';
import { useSelector } from 'react-redux';
import { useAddEstimationMutation } from '../../../../services/patientDashboardService/billings/estimationApi';
import { useGetDoctorsQuery } from '../../../../services/doctorsApi';
import { useGetAllServicesQuery } from '../../../../services/patientDashboardService/billings/billingApi';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import { RootState } from '../../../../app/store';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import { Add, Delete } from '@mui/icons-material';
import _ from 'lodash';
import { addEstimationValidationSchema } from '../../../../yup/patientDashboard/billings';

interface addEstimationProps {
  openModal: boolean;
  onClose: () => void;
}

interface IItem {
  masterServiceId: any | null;
  doctor: any | null;
  date: Date | null;
}

interface FormValues {
  serviceType: string | null;
  items: IItem[];
}

const AddEstimations: React.FC<addEstimationProps> = ({
  openModal,
  onClose,
}) => {
  const { showPromiseToast } = useToast();

  const { patient, user } = useSelector((state: RootState) => ({
    patient: state.patients.patient,
    user: state.auth.user,
  }));

  const isAdmin = user?.role === 'admin';

  const {
    data: DoctorsData,
    isLoading: DoctorsLoading,
    isFetching: DoctorFetching,
  } = useGetDoctorsQuery({});
  const doctors = DoctorsData?.data?.records || [];
  const isDoctorsLoading = DoctorsLoading || DoctorFetching;

  const {
    data: masterServicesData,
    isLoading: masterServicesLoading,
    isFetching: masterServicesFetching,
  } = useGetAllServicesQuery({
    filters: {
      patientId: patient?.patientId,
    },
  });
  const masterServices = masterServicesData?.data || [];
  const isMasterServicesLoading =
    masterServicesLoading || masterServicesFetching;

  const initialValues: FormValues = {
    serviceType: null,
    items: [
      {
        masterServiceId: null,
        doctor: null,
        date: null,
      },
    ],
  };

  const [addEstimation, { isLoading }] = useAddEstimationMutation();

  const handleSubmit = async (values: FormValues) => {
    const payload = {
      patientCode: patient?.patientId || null,
      serviceType: values.serviceType,
      items: values.items.map(item => ({
        masterServiceId: item.masterServiceId?._id,
        doctor: item.doctor?._id,
        date: item.date,
      })),
    };

    const promise = addEstimation(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding Estimations...',
      success: response => response.message || 'Estimations added successfully',
      error: err =>
        `Error: ${err.response?.data?.message || 'Failed to add Estimations'}`,
    });

    try {
      await promise;
    } catch (error) {
      console.error('Error adding Estimations:', error);
    }

    formik.resetForm();
    closeModal();
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: addEstimationValidationSchema,
    validateOnBlur: true,
    enableReinitialize: true,
  });

  const handleAddFields = () => {
    formik.setFieldValue('items', [
      ...formik.values.items,
      {
        masterServiceId: null,
        doctor: formik.values.items[formik.values.items.length - 1].doctor,
        date: formik.values.items[formik.values.items.length - 1].date,
      },
    ]);
  };

  const handleDeleteField = (index: number) => {
    const newFields = [...formik.values.items];
    newFields.splice(index, 1);
    formik.setFieldValue('items', newFields);
  };

  const closeModal = () => {
    formik.resetForm();
    onClose();
  };

  const getFieldErrorAndTouched = useCallback(
    (index: number, fieldName: 'masterServiceId' | 'date' | 'doctor') => {
      const touched = formik?.touched?.items as FormikTouched<IItem>[];
      const error = formik?.errors?.items as FormikErrors<IItem>[];

      const isFieldTouched = touched?.[index]?.[fieldName];
      const fieldError = error?.[index]?.[fieldName];

      return {
        isError: Boolean(isFieldTouched && fieldError),
        errorMessage: typeof fieldError === 'string' ? fieldError : undefined,
      };
    },
    [formik.touched.items, formik.errors.items],
  );

  // const today = new Date().toLocaleDateString();

  return (
    <Modal open={openModal} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vh',
          overflowY: 'auto',
          borderRadius: 1,
          boxShadow: 5,
          px: 8,
          py: 5,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          Create Estimation
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            alignItems={'center'}
            justifyContent={'center'}
            spacing={2}
            mb={4}
          >
            <Grid item xs={12} lg={4}>
              <FieldAutocomplete
                loading={isMasterServicesLoading}
                options={Object.keys(masterServices)}
                getOptionLabel={option => option}
                isOptionEqualToValue={(option, value) => option === value}
                value={formik.values.serviceType}
                onChange={newValue => {
                  formik.setFieldValue('serviceType', newValue);
                  formik.setFieldValue('items', [
                    {
                      masterServiceId: null,
                      doctor: null,
                      date: isAdmin ? null : new Date(),
                    },
                  ]);
                }}
                label="Select Service"
                error={
                  formik.touched.serviceType &&
                  Boolean(formik.errors.serviceType)
                }
                helperText={
                  formik.touched.serviceType && formik.errors.serviceType
                }
              />
            </Grid>
          </Grid>

          {formik.values.items.map((item, index) => {
            const serviceType = formik.values.serviceType || '';
            const servicesOptions = masterServices[serviceType] || [];
            const serviceLabel = `Select ${serviceType}`;

            const isLastItem = index === formik.values.items?.length - 1;
            const onlyOneItem = formik.values.items?.length === 1;

            const {
              isError: isMasterServiceIdError,
              errorMessage: masterServiceIdErrorErrorMessage,
            } = getFieldErrorAndTouched(index, 'masterServiceId');
            const { isError: isDateError, errorMessage: dateErrorMessage } =
              getFieldErrorAndTouched(index, 'date');
            const { isError: isDoctorError, errorMessage: doctorErrorMessage } =
              getFieldErrorAndTouched(index, 'doctor');

            return (
              <Grid container gap={2} mt={3} key={index}>
                <Grid item flex={4}>
                  <FieldAutocomplete
                    disabled={isMasterServicesLoading || !serviceType}
                    options={servicesOptions}
                    getOptionLabel={option => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    value={item.masterServiceId}
                    onChange={newValue => {
                      formik.setFieldValue(
                        `items[${index}].masterServiceId`,
                        newValue,
                      );
                    }}
                    label={serviceLabel}
                    getOptionKey={option => option._id}
                    error={isMasterServiceIdError}
                    helperText={
                      isMasterServiceIdError && masterServiceIdErrorErrorMessage
                    }
                  />
                </Grid>
                <Grid item flex={3}>
                  <FieldAutocomplete
                    options={doctors}
                    getOptionLabel={option =>
                      `${option.firstName} ${option.lastName}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    value={formik.values.items[index].doctor}
                    onChange={newValue =>
                      formik.setFieldValue(`items.${index}.doctor`, newValue)
                    }
                    label="Doctor"
                    error={isDoctorError}
                    helperText={isDoctorError && doctorErrorMessage}
                    loading={isDoctorsLoading}
                    showNone={serviceType === 'Service'}
                    noneType={{ _id: 'null', firstName: 'None', lastName: '' }}
                    getOptionKey={option => option._id}
                  />
                </Grid>
                <Grid item flex={2}>
                  {isAdmin ? (
                    <CustomDatePicker
                      label="Select Date"
                      name={`items[${index}].date`}
                      value={item.date}
                      maxDate={new Date()}
                      onChange={date =>
                        formik.setFieldValue(`items[${index}].date`, date)
                      }
                      error={isDateError}
                      helperText={isDateError && dateErrorMessage}
                    />
                  ) : (
                    <CustomDatePicker
                      label="Select Date"
                      name={`items[${index}].date`}
                      value={item.date}
                      minDate={new Date()}
                      maxDate={new Date()}
                      onChange={date =>
                        formik.setFieldValue(`items[${index}].date`, date)
                      }
                      error={isDateError}
                      helperText={isDateError && dateErrorMessage}
                    />
                  )}
                </Grid>
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
                      disabled={formik.values.items.some(
                        item => !item.masterServiceId || !item.date,
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
            mt={4}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading || _.isEqual(initialValues, formik.values)}
              sx={{ width: 'fit-content' }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: 'fit-content' }}
              onClick={closeModal}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddEstimations;
