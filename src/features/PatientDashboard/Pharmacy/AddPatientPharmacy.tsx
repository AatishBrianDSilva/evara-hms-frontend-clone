import React, { useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import _ from 'lodash';
import { IPharmacyStock } from '../../../types/pharmacyDashboard/stocks';
import { useToast } from '../../../context/ToastContext';
import { addPatientPharmacyValidationSchema } from '../../../yup/patientDashboard/pharmacy';
import { useAddPatientPharmacyMutation } from '../../../services/patientDashboardService/patientPharmacyApi';
import FieldAutocomplete from '../../../components/FieldAutoComplete/FieldAutoComplete';
import CustomDatePicker from '../../../components/CustomDatePicker/CustomDatePicker';
import { IDoctor } from '../../../types/doctor';
import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import { IDrugLocation } from '../../../types/pharmacyDashboard/master';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import { useGetDrugLocationsQuery } from '../../../services/pharmacyDashboardService/master/drugLocationApi';

type SummaryEntry = {
  name: string;
  quantity: number;
  batchNumber: string;
  price: number;
  total: number;
};

interface AddPatientPharmacyProps {
  openModal: boolean;
  onClose: () => void;
  pharmacyStocks: IPharmacyStock[];
  doctors: IDoctor[];
  patientId: string;
}

interface IFormValues {
  doctor: IDoctor | null;
  location: IDrugLocation | null;
  date: Date | null;
  items: {
    stock: IPharmacyStock | null;
    batchNumber: string | null;
    quantity: number;
  }[];
}

const AddPatientPharmacy: React.FC<AddPatientPharmacyProps> = ({
  openModal,
  onClose,
  pharmacyStocks,
  doctors,
  patientId,
}) => {
  const { showPromiseToast } = useToast();

  const [addPharmacy, { isLoading }] = useAddPatientPharmacyMutation();

  const [stocksByLocation, setStocksByLocation] = React.useState<
    IPharmacyStock[]
  >([]);

  const {
    data,
    isLoading: druglocationLoading,
    isFetching: druglocationFetching,
  } = useGetDrugLocationsQuery({
    paginate: false,
  });

  const locations = data?.data?.records || [];

  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      patient: patientId,
      doctor: values.doctor?._id,
      location: values.location?._id,
      date: values.date,
      items: values.items.map(item => {
        // Find the selected batch to extract the sellPrice
        const selectedBatch = item.stock?.locations
          .find(location => location.location._id === values.location?._id)
          ?.batches.find(batch => batch.batchNo === item.batchNumber);
  
        const sellPrice = selectedBatch?.sellPrice || item.stock?.sellPrice;
  
        // TODO: Remove fallback to stock-level sellPrice once all batches include sellPrice
        if (!selectedBatch?.sellPrice) {
          console.warn(
            `Fallback to stock-level sellPrice for batch "${item.batchNumber}" in "${item.stock?.item?.name}"`
          );
        }
          return {
          stock: item.stock?._id,
          batchNumber: item.batchNumber,
          quantity: item.quantity,
          sellPrice, // Add the sellPrice to the payload

        };
      }),
    };

    console.log('payload', payload);

    const promise = addPharmacy(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding...',
      success: data => data || 'Added Successfully',
      error: data => data || 'Adding Failed',
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }

    closeModal();
  };

  const initialValues: IFormValues = {
    doctor: null,
    date: new Date(),
    location: null,
    items: [
      {
        stock: null,
        quantity: 0,
        batchNumber: null,
      },
    ],
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: addPatientPharmacyValidationSchema,
  });

  console.log("Pharmacy stocks", pharmacyStocks)

  useEffect(() => {
    if (!formik.values.location) {
      formik.setFieldValue('items', [
        {
          stock: null,
          quantity: 0,
          batchNumber: null,
        },
      ]);
    } else {
      const stocksBasedOnLocation = pharmacyStocks.filter(stock =>
        stock.locations.some(
          location =>
            location.location._id === formik.values.location?._id &&
            location.quantity > 0,
        ),
      );
      setStocksByLocation(stocksBasedOnLocation);
    }
  }, [formik.values.location]);

  const closeModal = () => {
    formik.resetForm();
    onClose();
  };

  const getFieldErrorAndTouched = useCallback(
    (index: number, fieldName: 'stock' | 'quantity' | 'batchNumber') => {
      // Ensure that we're working with the correct structure
      const initialValues = formik.initialValues.items[index];

      const touched = formik?.touched?.items as FormikTouched<
        typeof initialValues
      >[];
      const error = formik?.errors?.items as FormikErrors<
        typeof initialValues
      >[];

      const isFieldTouched = touched?.[index]?.[fieldName];
      const fieldError = error?.[index]?.[fieldName];

      return {
        isError: Boolean(isFieldTouched && fieldError),
        errorMessage: typeof fieldError === 'string' ? fieldError : undefined,
      };
    },
    [formik.touched.items, formik.errors.items],
  );

  const handleAddStock = () => {
    formik.setFieldValue('items', [
      ...formik.values.items,
      {
        stock: formik.values.items[formik.values.items.length - 1].stock,
        batchNumber: null,
        quantity: null,
      },
    ]);
  };

  const handleDeleteStock = (index: number) => {
    const newFields = [...formik.values.items];
    newFields.splice(index, 1);
    formik.setFieldValue('items', newFields);
  };

  // const handleAddStockDetails = (index: number) => {
  //   const newFields = [...formik.values.items];
  //   newFields[index].details.push({
  //     batchNumber: null,
  //     quantity: 0,
  //   });
  //   formik.setFieldValue("items", newFields);
  // };

  // const handleDeleteStockDetails = (index: number, detailIndex: number) => {
  //   const newFields = [...formik.values.items];
  //   newFields[index].details.splice(detailIndex, 1);
  //   formik.setFieldValue("items", newFields);
  // };

  // const calculateSummary = () => {
  //   const summary = formik.values.items.reduce<SummaryEntry[]>((acc, item) => {
  //     if (!item.stock) return acc;

  //     const pricePerUnit = item.stock.sellPrice / item.stock.item.packSize;

  //     const totalQuantity = item.quantity || 0;
  //     const batchNumber = item.batchNumber ? `, ${item.batchNumber}` : '';
  //     const price = pricePerUnit || 0;
  //     const total = price * totalQuantity;

  //     if (item.stock && item.stock.item) {
  //       const existingItem = acc.find(i => i.name === item?.stock?.item.name);
  //       if (existingItem) {
  //         existingItem.quantity += totalQuantity;
  //         existingItem.batchNumber = existingItem.batchNumber + batchNumber;
  //         existingItem.price = pricePerUnit || 0;
  //         existingItem.total += total;
  //       } else {
  //         const data = {
  //           name: item.stock.item.name,
  //           quantity: totalQuantity,
  //           batchNumber: item.batchNumber || '',
  //           price: pricePerUnit || 0,
  //           total: pricePerUnit * totalQuantity,
  //         };
  //         acc.push(data);
  //       }
  //     }
  //     return acc;
  //   }, []);
  //   return summary;
  // };

  const calculateSummary = () => {
    const summaryData: SummaryEntry[] = [];
  
    formik.values.items.forEach(item => {
      if (!item.stock || !item.batchNumber) return;
  
      const packSize = item.stock.item.packSize || 1;
  
      // Find the batch for the selected batch number
      const selectedBatch = item.stock.locations
        .find(location => location.location._id === formik.values.location?._id)
        ?.batches.find(batch => batch.batchNo === item.batchNumber);
  
      // Use batch sellPrice if available, otherwise fallback to stock-level sellPrice
      const batchSellPrice = selectedBatch?.sellPrice;
      const stockSellPrice = item.stock.sellPrice;
      const pricePerUnit = batchSellPrice
        ? batchSellPrice / packSize
        : stockSellPrice / packSize;
  
      // TODO: Remove fallback logic once all data uses batch sellPrice
      if (!batchSellPrice) {
        console.warn(
          `Fallback to stock-level sellPrice for batch "${item.batchNumber}" in "${item.stock.item.name}"`
        );
      }
  
      const totalQuantity = item.quantity ?? 0;
      const total = pricePerUnit * totalQuantity;
  
      summaryData.push({
        name: item.stock.item.name,
        quantity: totalQuantity,
        batchNumber: item.batchNumber,
        price: pricePerUnit,
        total: total,
      });
    });
  
    return summaryData;
  };
  
  const SummaryTable = () => {
    const summaryData = calculateSummary();

    // Calculate total items and total amount
    const totalItems = summaryData.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalAmount = summaryData.reduce((sum, item) => sum + item.total, 0);

    return (
      summaryData.length > 0 && (
        <>
          <Typography variant="subtitle1" color="primary" mt={2} gutterBottom>
            Summary
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2, mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Batch No(s)</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summaryData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.batchNumber}</TableCell>
                    <TableCell>
                      {formatToIndianCurrencyFormat(item.price)}
                    </TableCell>
                    <TableCell>
                      {formatToIndianCurrencyFormat(item.total)}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Add a footer row for totals */}
                <TableRow>
                  <TableCell colSpan={1} />
                  <TableCell>
                    <strong>Total Items: {totalItems}</strong>
                  </TableCell>
                  <TableCell colSpan={2} />
                  <TableCell>
                    <strong>
                      Total: {formatToIndianCurrencyFormat(totalAmount)}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )
    );
  };

  return (
    <Modal open={openModal} onClose={closeModal}>
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          minHeight: '30vh',
          maxHeight: '86vh',
          overflowY: 'auto',
          borderRadius: 1,
          boxShadow: 5,
          px: 8,
          py: 5,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" color={'primary'} mt={2} textAlign={'center'}>
          Add Medicine
        </Typography>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 2,
            mt: 2,
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid container gap={2} mt={2}>
              <Grid item lg={2}>
                <CustomDatePicker
                  label="Date"
                  value={formik.values.date}
                  onChange={value => formik.setFieldValue('date', value)}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                />
              </Grid>
              <Grid item lg={2}>
                <FieldAutocomplete
                  options={doctors}
                  getOptionLabel={option =>
                    `${option.firstName} ${option.lastName}`
                  }
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  value={formik.values.doctor}
                  onChange={newValue => {
                    formik.setFieldValue('doctor', newValue);
                  }}
                  label="Doctor"
                  error={formik.touched.doctor && Boolean(formik.errors.doctor)}
                  helperText={formik.touched.doctor && formik.errors.doctor}
                />
              </Grid>
              <Grid item lg={3}>
                <FieldAutocomplete
                  options={locations}
                  loading={druglocationLoading || druglocationFetching}
                  getOptionLabel={option => {
                    if (typeof option === 'string') {
                      return option;
                    }
                    return option?.location;
                  }}
                  isOptionEqualToValue={(option, value) => {
                    return option?._id === value?._id;
                  }}
                  value={formik.values.location}
                  onChange={newValue => {
                    formik.setFieldValue(`location`, newValue);
                  }}
                  label="Location"
                  error={
                    formik.touched.location && Boolean(formik.errors.location)
                  }
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" color={'primary'} mt={2}>
              Pharmacy Item(s)
            </Typography>
            {formik.values.items.map((_field: any, index: number) => {
              const { isError: isStockError, errorMessage: stockErrorMessage } =
                getFieldErrorAndTouched(index, 'stock');
              const { isError: isBatchError, errorMessage: batchErrorMessage } =
                getFieldErrorAndTouched(index, 'batchNumber');
              const {
                isError: isQuantityError,
                errorMessage: quantityErrorMessage,
              } = getFieldErrorAndTouched(index, 'quantity');

              const drugBatches =
                formik.values.items[index].stock?.locations.filter(
                  location =>
                    location.location._id === formik.values.location?._id,
                )[0]?.batches || [];

              const maxQuantity =
                drugBatches.find(
                  batch =>
                    batch.batchNo === formik.values.items[index].batchNumber,
                )?.quantity || 0;
              const quantityLabel = `Quantity (Max: ${maxQuantity})`;

              const isLastItem = index === formik.values.items.length - 1;
              const onlyOneItem = formik.values.items.length === 1;

              return (
                <Box key={index}>
                  <Grid container gap={1} mt={2} mb={4}>
                    {/* Abstracted Autocomplete for Items */}
                    <Grid item lg={4}>
                      <FieldAutocomplete
                        options={stocksByLocation}
                        getOptionLabel={option => option?.item?.name || ''}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        value={formik.values.items[index].stock}
                        onChange={newValue => {
                          formik.setFieldValue(
                            `items[${index}].stock`,
                            newValue,
                          );
                          formik.setFieldValue(`items[${index}].details`, [
                            {
                              // location: newValue?.location || null,
                              quantity: 0,
                              batchNumber: null,
                            },
                          ]);
                        }}
                        label="Item"
                        error={isStockError}
                        helperText={isStockError ? stockErrorMessage : ''}
                      />
                    </Grid>

                    <Grid item lg={2}>
                      <FieldAutocomplete
                        disabled={!formik.values.location}
                        options={drugBatches}
                        getOptionLabel={option => {
                          return option?.batchNo ? option?.batchNo : option;
                        }}
                        isOptionEqualToValue={(option, value) => {
                          return option.batchNo == value;
                        }}
                        filterOptions={(options, params) => {
                          const inputValue = params.inputValue.toLowerCase();
                          const currentStockId =
                            formik.values.items[index].stock?._id;

                          return options.filter(option => {
                            const optionLabel = option?.batchNo.toLowerCase();

                            // Check if the batch number is already selected for the same stock
                            const isBatchSelectedForSameStock =
                              formik.values.items.some(
                                item =>
                                  item.stock?._id === currentStockId &&
                                  item.batchNumber === option.batchNo,
                              );

                            return (
                              optionLabel.includes(inputValue) &&
                              !isBatchSelectedForSameStock
                            );
                          });
                        }}
                        value={formik.values.items[index].batchNumber}
                        onChange={newValue => {
                          formik.setFieldValue(
                            `items[${index}].batchNumber`,
                            newValue?.batchNo,
                          );
                        }}
                        label="Batch No"
                        error={isBatchError}
                        helperText={isBatchError ? batchErrorMessage : ''}
                      />
                    </Grid>
                    <Grid item lg={2}>
                      <TextField
                        fullWidth
                        disabled={maxQuantity === 0}
                        label={quantityLabel}
                        type="number"
                        name={`items[${index}].quantity`}
                        value={formik.values.items[index].quantity || ''}
                        onChange={e => {
                          const inputValue = Number(e.target.value);
                          const limitedValue = Math.min(
                            inputValue,
                            maxQuantity,
                          ); // Restrict to maxQuantity
                          formik.setFieldValue(
                            `items[${index}].quantity`,
                            limitedValue,
                          );
                        }}
                        InputProps={{
                          inputProps: {
                            min: 1,
                            max: maxQuantity,
                          },
                        }}
                        error={isQuantityError}
                        helperText={isQuantityError && quantityErrorMessage}
                      />
                    </Grid>

                    {/* Dynamic Add/Delete Buttons */}
                    <Grid
                      item
                      lg={1}
                      display={'flex'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                    >
                      {!onlyOneItem && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteStock(index)}
                        >
                          <Delete fontSize={'small'} />
                        </IconButton>
                      )}
                      {isLastItem && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={handleAddStock}
                          disabled={formik.values.items.some(
                            item =>
                              !item.stock ||
                              !item.quantity ||
                              !item.batchNumber,
                          )}
                        >
                          <Add fontSize={'small'} />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              );
            })}

            {SummaryTable()}

            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              alignItems={'center'}
              gap={2}
              mb={2}
              mt={2}
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
      </Box>
    </Modal>
  );
};

export default AddPatientPharmacy;
