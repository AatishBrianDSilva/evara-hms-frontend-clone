import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Skeleton,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  useEditBillingMutation,
  useGetBillingByIdQuery,
} from '../../../../services/patientDashboardService/billings/billingApi';
import { useFormik } from 'formik';
import { useToast } from '../../../../context/ToastContext';
import FileUploadButton from '../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../types/global';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import FileList from '../../../../components/FileList/FileList';

interface EditPendingProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

const EditPending: React.FC<EditPendingProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const patient = useSelector((state: RootState) => state.patients.patient);
  const { user } = useSelector((state: RootState) => state.auth);

  // const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(['']);

  const { data, isLoading } = useGetBillingByIdQuery(id);

  const billing = data?.data;

  console.log('Billing Data', billing);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (billing?.discountFile) {
      setFileUploadedUrl([billing.discountFile]);
    } else {
      setFileUploadedUrl([]);
    }
  }, [billing]);

  const [updateBilling, { isLoading: isEditing }] = useEditBillingMutation();

  const handleUpdate = async (values: any) => {
    console.log('Values', values);

    const payload = {
      _id: billing?._id || '',
      updates: {
        discount: values.discount,
        discountType: values.discountType,
        discountReason: values.discountReason,
        discountFile: fileUploadedUrl[0],
      },
    };

    const promise = updateBilling(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding Discount',
      success(response) {
        return response || 'Discount Added Successfully';
      },
      error(error) {
        console.log('Error');
        return error || 'Error adding discount';
      },
    });

    try {
      await promise;
    } catch (error) {
      console.log('Error', error);
    }

    onClose();
  };

  const formik = useFormik({
    initialValues: {
      discount: billing?.discount || 0,
      discountReason: billing?.discountReason || '',
      discountType: 'amount',
    },
    onSubmit: handleUpdate,
    enableReinitialize: true,
  });

  const calculateDiscountAmount = (percentage: number) => {
    if (billing?.amount) {
      return Number(billing.amount * (percentage / 100)).toFixed(2);
    }
    return 0;
  };

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Bill: {billing?.billingId}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Skeleton width={140} height={30} variant="rounded" />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Grid
              container
              spacing={1}
              justifyContent="flex-start"
              alignItems="center"
              flexDirection="row"
              mt={2}
            >
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="discountType"
                  value={formik.values.discountType}
                  onChange={e => {
                    formik.handleChange(e);
                    formik.setFieldValue('discountType', e.target.value);
                    formik.setFieldValue('discount', 0);
                  }}
                  select
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="amount">Amount</MenuItem>
                </TextField>
              </Grid>
              {formik.values.discountType === 'percentage' ? (
                <>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      name="discount"
                      label="Discount %"
                      type="number"
                      InputProps={{
                        inputProps: {
                          min: 0, // Minimum value is 0
                          max: 100, // Maximum value is 100
                          step: 'any', // Allow any decimal places
                        },
                      }}
                      value={formik.values.discount}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      disabled
                      label="Discount in ₹"
                      value={calculateDiscountAmount(formik.values.discount)}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    name="discount"
                    label="Discount Amount ₹"
                    type="number"
                    InputProps={{
                      inputProps: {
                        min: 0,
                        step: 'any', // Allow any decimal places
                      },
                    }}
                    value={formik.values.discount}
                    onChange={formik.handleChange}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="discountReason"
                  label="Discount Reason"
                  multiline
                  rows={1}
                  value={formik.values.discountReason}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FileUploadButton
                  documentType={EDocumentTypes.BillingDiscount}
                  acceptTypes="image/*, application/pdf"
                  maxFiles={1}
                  maxFileSizeinMB={5}
                  onUploadFiles={setFileUploadedUrl}
                  bucket={EBuckets.UserReports}
                  user={patient?._id || ''}
                  reportId={billing?._id || ''}
                />
              </Grid>
              <Grid item xs={12}>
                {fileUploadedUrl.length > 0 && (
                  <FileList
                    files={fileUploadedUrl}
                    title="Uploaded Files"
                    bucket={EBuckets.UserReports}
                    documentType={EDocumentTypes.BillingDiscount}
                    reportId={billing?._id || ''}
                  />
                )}
              </Grid>
              <Grid
                item
                xs={12}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isEditing || user?.role === 'doctor'}
                >
                  Save
                </Button>
                <Button
                  onClick={onClose}
                  variant="contained"
                  color="secondary"
                  style={{ marginLeft: '8px' }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditPending;
