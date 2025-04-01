import React, { useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { useGetBillingByIdQuery } from '../../../../services/patientDashboardService/billings/billingApi';
import { useProcessBillingMutation } from '../../../../services/patientDashboardService/billings/billingApi';
import { useFormik } from 'formik';
import { IPatientBilling } from '../../../../types/patientDashboard/billings';
import { Box, Chip, IconButton, Skeleton, Typography } from '@mui/material';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import { processBillingValidationSchema } from '../../../../yup/patientDashboard/billings';
import { getNestedField } from '../../../../utils/nestedFormikValidation';
import { formatToIndianCurrencyFormat } from '../../../../utils/formatToIndianCurrencyFormat';
import { useToast } from '../../../../context/ToastContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';

const SkeletonLoader = () => {
  const numberOfPayments = 2; // Adjust based on typical or maximum number of payments per bill
  return (
    <Dialog open={true} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        Loading Payments...
      </DialogTitle>
      <DialogContent>
        {Array.from({ length: 3 }).map(
          (
            _,
            index, // Simulate multiple bills
          ) => (
            <Box key={index} display={'flex'} flexDirection={'column'} gap={2}>
              <Skeleton variant="text" width="30%" height={40} />
              {Array.from({ length: numberOfPayments }).map((_, pIndex) => (
                <Grid container spacing={2} key={pIndex}>
                  <Grid item flex={2}>
                    <Skeleton variant="rectangular" height={56} />
                  </Grid>
                  <Grid item flex={2}>
                    <Skeleton variant="rectangular" height={56} />
                  </Grid>
                  <Grid item flex={3}>
                    <Skeleton variant="rectangular" height={56} />
                  </Grid>
                  <Grid item flex={2}>
                    <Skeleton variant="rectangular" height={56} />
                  </Grid>
                  <Grid item flex={1}>
                    <Skeleton variant="rectangular" height={56} width="50%" />
                  </Grid>
                </Grid>
              ))}
            </Box>
          ),
        )}
      </DialogContent>
      <DialogActions>
        <Skeleton variant="rectangular" width="85px" height="36px" />
        <Skeleton variant="rectangular" width="85px" height="36px" />
      </DialogActions>
    </Dialog>
  );
};

interface ProcessPendingProps {
  openModal: boolean;
  onClose: () => void;
  ids: string[];
}

interface FormValues {
  bills: {
    id: {
      billingId: string;
      _id: string;
    };
    payments: {
      amount: number | undefined;
      method: string;
      paymentDate: Date | null;
      details: string;
    }[];
  }[];
}

const ProcessPendingModal: React.FC<ProcessPendingProps> = ({
  openModal,
  onClose,
  ids,
}) => {
  const { showPromiseToast } = useToast();

  const patient = useSelector((state: RootState) => state.patients.patient);

  const [billings, setBillings] = useState<IPatientBilling[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [alreadyPaid, setAlreadyPaid] = useState<number>(0);

  // Create an array of query results, one for each ID.
  const billingQueries = ids.map(id => useGetBillingByIdQuery(id));

  console.log('Processing Bill ', billingQueries);

  useEffect(() => {
    const allQueriesLoaded = !billingQueries.some(
      query => query.isLoading || query.isFetching,
    );

    if (allQueriesLoaded) {
      const loadedBillings = billingQueries
        .map(query => query.data?.data)
        .filter((item): item is IPatientBilling => item !== undefined);
      if (loadedBillings.length === ids.length) {
        setBillings(loadedBillings);
        const amount = loadedBillings.reduce(
          (acc, curr) => acc + curr.subTotal,
          0,
        );
        // setAmount(Math.round(amount));
        setAmount(amount);
        const alreadyPaid = loadedBillings.reduce(
          (acc, curr) =>
            acc +
            curr.payments.reduce((acc, curr) => acc + (curr.amount || 0), 0),
          0,
        );
        setAlreadyPaid(alreadyPaid);
        const discount = loadedBillings.reduce(
          (acc, curr) => acc + curr.discount,
          0,
        );
        // setDiscount(Math.round(discount));
        setDiscount(discount);
        // setTotal(Math.round(amount - discount));
        setTotal(amount - alreadyPaid);
      }
    }
  }, [
    billingQueries.map(query => query.isLoading || query.isFetching).toString(),
    ids.length,
  ]);

  const loadingBillingsData =
    billingQueries.some(query => query.isLoading) ||
    billingQueries.some(query => query.isFetching);

  const [processBilling, { isLoading: processingBilling }] =
    useProcessBillingMutation();

  const initialValues: FormValues = useMemo(
    () => ({
      bills: billings.map(bill => ({
        id: {
          billingId: bill.billingId,
          _id: bill._id,
        },
        payments: [
          {
            amount: undefined,
            method: '',
            paymentDate: null,
            details: '',
          },
        ],
      })),
    }),
    [ids, billings],
  );

  const handleSubmit = (values: FormValues) => {
    const payload = {
      patientData: patient,
      billings: values.bills.map(bill => {
        return {
          billingId: bill.id._id,
          payments: bill.payments.map(pay => {
            return {
              amount: pay.amount,
              method: pay.method,
              paymentDate: pay.paymentDate,
              details: pay.details,
            };
          }),
        };
      }),
    };

    console.log('Payload', payload);

    const promise = processBilling(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Processing Billing',
      success(response) {
        return response || 'Billing Processed Successfully';
      },
      error(error) {
        console.log('Error', error);
        return error || 'Error processing billing';
      },
    });

    formik.resetForm();
    onClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: processBillingValidationSchema,
    enableReinitialize: true,
  });

  const addPayment = (index: number) => {
    const newPayment = { amount: undefined, method: '', paymentDate: null };
    const updatedPayments = [
      ...formik.values.bills[index].payments,
      newPayment,
    ];
    formik.setFieldValue(`bills.${index}.payments`, updatedPayments);
  };

  const removePayment = (billIndex: number, paymentIndex: number) => {
    const updatedPayments = formik.values.bills[billIndex].payments.filter(
      (_, idx) => idx !== paymentIndex,
    );
    formik.setFieldValue(`bills.${billIndex}.payments`, updatedPayments);
  };

  const totalPaid = formik.values.bills.reduce((totalAccumulator, bill) => {
    const billTotal = bill.payments.reduce((billAccumulator, payment) => {
      return billAccumulator + (payment?.amount || 0);
    }, 0);
    return totalAccumulator + billTotal;
  }, 0);

  // const due = Math.round(total - totalPaid);
  const due = Math.round((total - totalPaid) * 100) / 100;

  if (loadingBillingsData) {
    return <SkeletonLoader />;
  }

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle textAlign={'center'}>Payments</DialogTitle>
        <DialogContent>
          <Grid
            container
            mt={4}
            mb={4}
            display={'flex'}
            justifyContent={'space-around'}
          >
            <Grid item>
              <Chip
                label={'Amount: ' + formatToIndianCurrencyFormat(amount)}
                color="primary"
              />
            </Grid>
            <Grid item>
              <Chip
                label={'Discount: ' + formatToIndianCurrencyFormat(discount)}
                color="primary"
              />
            </Grid>
            {alreadyPaid > 0 && (
              <Grid item>
                <Chip
                  label={
                    'Already Paid: ' + formatToIndianCurrencyFormat(alreadyPaid)
                  }
                  color="primary"
                />
              </Grid>
            )}
            <Grid item>
              <Chip
                label={'Total: ' + formatToIndianCurrencyFormat(total)}
                color="primary"
              />
            </Grid>
          </Grid>
          {formik.values.bills.map((bill, index) => (
            <Box key={index} display={'flex'} flexDirection={'column'} gap={2}>
              <Typography variant="button" color={'primary'}>
                Bill ID: {bill.id.billingId}
              </Typography>
              {bill.payments.map((payment, pIndex) => {
                const onlyOneItem = bill.payments.length === 1;
                const isLastItem = pIndex === bill.payments.length - 1;

                const amountError = getNestedField<string>(
                  `bills.${index}.payments.${pIndex}.amount`,
                  formik.errors,
                );
                const amountTouched = getNestedField<boolean>(
                  `bills.${index}.payments.${pIndex}.amount`,
                  formik.touched,
                );

                const methodError = getNestedField<string>(
                  `bills.${index}.payments.${pIndex}.method`,
                  formik.errors,
                );
                const methodTouched = getNestedField<boolean>(
                  `bills.${index}.payments.${pIndex}.method`,
                  formik.touched,
                );

                const paymentDateError = getNestedField<string>(
                  `bills.${index}.payments.${pIndex}.paymentDate`,
                  formik.errors,
                );
                const paymentDateTouched = getNestedField<boolean>(
                  `bills.${index}.payments.${pIndex}.paymentDate`,
                  formik.touched,
                );

                const billing = billings.find(
                  b => b.billingId === bill.id.billingId,
                );
                // const grandTotal = Math.round(billing?.grandTotal || 0);
                const grandTotal = billing?.grandTotal || 0;

                // const billingAmount = Math.round(grandTotal);
                const billingAmount = grandTotal;

                const alreadyPaid = bill.payments.reduce((acc, payment) => {
                  return acc + (payment.amount || 0);
                }, 0);

                const amountLeft = formatToIndianCurrencyFormat(
                  billingAmount - alreadyPaid,
                );

                return (
                  <Grid container spacing={2} key={pIndex} mb={2}>
                    <Grid item flex={2}>
                      <TextField
                        fullWidth
                        type="number"
                        label={'Amount'}
                        name={`bills.${index}.payments.${pIndex}.amount`}
                        value={payment.amount}
                        onChange={formik.handleChange}
                        error={Boolean(amountError && amountTouched)}
                        helperText={amountTouched && amountError}
                        placeholder={amountLeft}
                      />
                    </Grid>
                    <Grid item flex={2}>
                      <TextField
                        fullWidth
                        select
                        label="Method"
                        name={`bills.${index}.payments.${pIndex}.method`}
                        value={payment.method}
                        onChange={formik.handleChange}
                        error={Boolean(methodError && methodTouched)}
                        helperText={methodTouched && methodError}
                      >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="CreditCard">Credit Card</MenuItem>
                        <MenuItem value="BankTransfer">Bank Transfer</MenuItem>
                        <MenuItem value="Online">Online</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item flex={3}>
                      <TextField
                        fullWidth
                        label="Details"
                        name={`bills.${index}.payments.${pIndex}.details`}
                        value={payment.details}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item flex={2}>
                      <CustomDatePicker
                        fullWidth
                        label="Payment Date"
                        maxDate={new Date()}
                        name={`bills.${index}.payments.${pIndex}.paymentDate`}
                        value={payment.paymentDate}
                        onChange={date =>
                          formik.setFieldValue(
                            `bills.${index}.payments.${pIndex}.paymentDate`,
                            date,
                          )
                        }
                        error={Boolean(paymentDateError && paymentDateTouched)}
                        helperText={paymentDateTouched && paymentDateError}
                      />
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
                          onClick={() => removePayment(index, pIndex)}
                        >
                          <Delete fontSize={'small'} />
                        </IconButton>
                      )}
                      {isLastItem && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => addPayment(index)}
                        >
                          <Add fontSize={'small'} />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                );
              })}
            </Box>
          ))}

          <Grid
            container
            mt={3}
            gap={2}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'flex-end'}
          >
            <Grid item mr={4}>
              <Chip
                label={'Due: ' + formatToIndianCurrencyFormat(due)}
                color="secondary"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: 4 }}>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={due < 0 || processingBilling}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProcessPendingModal;
