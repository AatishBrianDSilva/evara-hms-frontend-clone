import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import {
  useGetBillingByIdQuery,
  useEditPaidBillingModeMutation,
} from '../../../../services/patientDashboardService/billings/billingApi';
import { useToast } from '../../../../context/ToastContext';
import { formatToIndianCurrencyFormat } from '../../../../utils/formatToIndianCurrencyFormat';
import { useFormik } from 'formik';
import _ from 'lodash';

interface EditBillProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

const EditBill: React.FC<EditBillProps> = ({ openModal, onClose, id }) => {
  const { data, isLoading } = useGetBillingByIdQuery(id);
  const billing = data?.data;

  console.log('Billing Payments', billing?.payments);

  const [mutate, { isLoading: isMutating }] = useEditPaidBillingModeMutation();

  const { showPromiseToast } = useToast();

  const formik = useFormik({
    initialValues: {
      _id: billing?._id || '',
      payments:
        billing?.payments?.map(payment => ({
          _id: payment._id,
          amount: payment.amount,
          type: payment.type,
          paymentDate: payment.paymentDate,
          details: payment.details,
          method: payment.method, // Default to an empty string if no method is set
        })) || [],
    },
    enableReinitialize: true,
    onSubmit: async values => {
      const promise = mutate({
        _id: values._id,
        payments: values.payments,
      }).unwrap();

      showPromiseToast(promise, {
        loading: 'Updating Bill...',
        success: response => response.message || 'Bill updated successfully',
        error: err =>
          `Failed to update bill: ${err.response?.data?.message || err.message}`,
      });

      try {
        await promise;
        onClose();
      } catch (error) {
        console.error('Refund processing failed:', error);
      }
    },
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Update Payment Mode</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box
            display={'flex'}
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Skeleton width={125} height={35} variant="rounded" />
            <Skeleton width={125} height={30} variant="rounded" />
            <Skeleton width={125} height={30} variant="rounded" />
            <Skeleton width={125} height={30} variant="rounded" />
          </Box>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Box p={4}>
              {formik.values.payments.map((payment, index) => (
                <Grid container key={index} mb={3} mt={2} alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography variant="body1" gutterBottom>
                      Payment {index + 1}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1" gutterBottom>
                      {payment.paymentDate && (
                        <>
                          {' '}
                          Date :{' '}
                          {new Date(
                            payment.paymentDate,
                          ).toLocaleDateString()}{' '}
                        </>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1" gutterBottom>
                      Amount : {formatToIndianCurrencyFormat(payment.amount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      select
                      label="Payment Method"
                      name={`payments[${index}].method`}
                      value={formik.values.payments[index].method}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="CreditCard">Credit Card</MenuItem>
                      <MenuItem value="BankTransfer">Bank Transfer</MenuItem>
                      <MenuItem value="Online">Online</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              ))}
            </Box>

            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  _.isEqual(formik.values, formik.initialValues) || isMutating
                }
              >
                Update
              </Button>
            </Box>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBill;
