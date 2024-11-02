import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback } from 'react';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import { IDrugLocation } from '../../../../types/pharmacyDashboard/master';
import Delete from '@mui/icons-material/Delete';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';
import { Add } from '@mui/icons-material';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import _ from 'lodash';
import { addInternalOrderValidationSchema } from '../../../../yup/pharmacyDashboard';
import { useCreateInternalOrderDraftMutation } from '../../../../services/pharmacyDashboardService/internalOrderApi';
import { useToast } from '../../../../context/ToastContext';
import { IPharmacyStock } from '../../../../types/pharmacyDashboard/stocks';

interface AddInternalOrderDraftProps {
  openModal: boolean;
  onClose: () => void;
  pharmacyStock: IPharmacyStock[];
  drugLocations: IDrugLocation[];
}

export interface ITransferFrom {
  location: IDrugLocation;
  quantity: number;
}

export interface IInternalOrderItem {
  transferFrom: ITransferFrom | null;
  transferTo: IDrugLocation | null;
  item: IPharmacyStock | null;
  quantity: number | null;
  notes?: string;
}

export interface IInternalOrderFormValues {
  date: Date | null;
  items: IInternalOrderItem[];
}

const AddDraft: React.FC<AddInternalOrderDraftProps> = ({
  openModal,
  onClose,
  pharmacyStock,
  drugLocations,
}) => {
  const { showPromiseToast } = useToast();

  const [createDraft, { isLoading }] = useCreateInternalOrderDraftMutation();

  const initialValues: IInternalOrderFormValues = {
    date: null,
    items: [
      {
        item: null,
        quantity: null,
        notes: '',
        transferFrom: null,
        transferTo: null,
      },
    ],
  };

  const formSubmit = async (values: IInternalOrderFormValues) => {
    const payload = {
      date: values.date,
      items: values.items.map(item => {
        return {
          item: item.item?._id,
          quantity: item.quantity || 0,
          transferFrom: {
            location: item.transferFrom?.location._id,
            quantity: item.transferFrom?.quantity || 0,
          },
          transferTo: item.transferTo?._id,
          notes: item.notes,
        };
      }),
    };

    console.log('Payload', payload);

    const promise = createDraft(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Creating Order',
      success: msg => msg || 'Internal Order Created Successfully',
      error: msg => msg || 'Error Creating Internal Order',
    });

    try {
      await promise;
    } catch (error) {
      console.error('Error creating purchase order', error);
    }

    closeModal();
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: addInternalOrderValidationSchema,
    onSubmit: formSubmit,
    enableReinitialize: true,
  });

  const handleAddFields = () => {
    formik.setFieldValue('items', [
      ...formik.values.items,
      { item: null, quantity: null, notes: '' },
    ]);
  };

  const handleDeleteField = (index: number) => {
    const newFields = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue('items', newFields);
  };

  const getFieldErrorAndTouched = useCallback(
    (
      index: number,
      fieldName: 'item' | 'quantity' | 'transferFrom' | 'transferTo',
    ) => {
      // Ensure that we're working with the correct structure
      const touched = formik?.touched
        ?.items as FormikTouched<IInternalOrderItem>[];
      const error = formik?.errors?.items as FormikErrors<IInternalOrderItem>[];

      const isFieldTouched = touched?.[index]?.[fieldName];
      const fieldError = error?.[index]?.[fieldName];

      return {
        isError: Boolean(isFieldTouched && fieldError),
        errorMessage: typeof fieldError === 'string' ? fieldError : undefined,
      };
    },
    [formik.touched.items, formik.errors.items],
  );

  const closeModal = () => {
    formik.resetForm();
    onClose();
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
          Add Internal Order
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
                  minDate={new Date()}
                  value={formik.values.date}
                  onChange={value => formik.setFieldValue('date', value)}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" color={'primary'} mt={2}>
              Items
            </Typography>
            {formik.values.items.map((_field: any, index: number) => {
              const { isError: isItemError, errorMessage: itemErrorMessage } =
                getFieldErrorAndTouched(index, 'item');
              const {
                isError: isTransferFromError,
                errorMessage: transferFromErrorMessage,
              } = getFieldErrorAndTouched(index, 'transferFrom');
              const {
                isError: isTransferToError,
                errorMessage: transferToErrorMessage,
              } = getFieldErrorAndTouched(index, 'transferTo');
              const {
                isError: isQuantityError,
                errorMessage: quantityErrorMessage,
              } = getFieldErrorAndTouched(index, 'quantity');

              const { items } = formik.values;
              const currentItem = items[index];

              const locationsFrom = currentItem.item?.locations || [];

              const isLastItem = index === formik.values.items.length - 1;
              const onlyOneItem = formik.values.items.length === 1;

              const itemSelected = currentItem.item?.item.name || '';

              const maxQuantity =
                (currentItem.transferFrom?.quantity ?? 0) -
                formik.values.items.reduce((total, item, idx) => {
                  // Ensure we only subtract quantities for the same item and from location, and not the current item itself
                  if (
                    item.item?._id === currentItem.item?._id &&
                    item.transferFrom?.location._id ===
                      currentItem.transferFrom?.location._id &&
                    idx !== index
                  ) {
                    return total + (item.quantity || 0);
                  }
                  return total;
                }, 0);

              const currentFromLocationId =
                currentItem.transferFrom?.location._id;

              const alreadySelectedToLocations = formik.values.items.reduce(
                (acc, item, idx) => {
                  if (
                    item.item?._id === currentItem.item?._id &&
                    item.transferFrom?.location._id === currentFromLocationId &&
                    idx !== index
                  ) {
                    acc.add(item.transferTo?._id);
                  }
                  return acc;
                },
                new Set(),
              );

              const filteredToLocations = drugLocations.filter(
                location => !alreadySelectedToLocations.has(location._id),
              );

              const quantityLabel = itemSelected
                ? `Quantity (${maxQuantity} available)`
                : 'Quantity';

              return (
                <Grid container gap={1} key={index} mt={2}>
                  {/* Abstracted Autocomplete for Items */}
                  <Grid item flex={2}>
                    <FieldAutocomplete
                      options={pharmacyStock}
                      getOptionLabel={option => {
                        return option?.item?.name;
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      }
                      value={currentItem.item}
                      onChange={newValue => {
                        formik.setFieldValue(`items[${index}].item`, newValue);
                        formik.setFieldValue(`items[${index}].quantity`, null);
                        formik.setFieldValue(
                          `items[${index}].transferFrom`,
                          null,
                        );
                        formik.setFieldValue(
                          `items[${index}].transferTo`,
                          null,
                        );
                      }}
                      label="Item"
                      error={isItemError}
                      helperText={isItemError ? itemErrorMessage : ''}
                    />
                  </Grid>
                  <Grid item flex={1.5}>
                    <FieldAutocomplete
                      options={locationsFrom}
                      disabled={!itemSelected}
                      getOptionLabel={option => {
                        return option?.location?.location;
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      }
                      value={currentItem.transferFrom}
                      onChange={newValue => {
                        formik.setFieldValue(
                          `items[${index}].transferFrom`,
                          newValue,
                        );
                      }}
                      label="Transfer From"
                      error={isTransferFromError}
                      helperText={
                        isTransferFromError ? transferFromErrorMessage : ''
                      }
                    />
                  </Grid>
                  <Grid item flex={1.5}>
                    <FieldAutocomplete
                      disabled={!itemSelected}
                      options={filteredToLocations}
                      filterOptions={(options, _state) => {
                        return options.filter(option => {
                          return (
                            option._id !==
                            currentItem.transferFrom?.location._id
                          );
                        });
                      }}
                      getOptionLabel={option => {
                        return option?.location;
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      }
                      value={currentItem.transferTo}
                      onChange={newValue => {
                        formik.setFieldValue(
                          `items[${index}].transferTo`,
                          newValue,
                        );
                      }}
                      label="Transfer To"
                      error={isTransferToError}
                      helperText={
                        isTransferToError ? transferToErrorMessage : ''
                      }
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      disabled={
                        !itemSelected ||
                        maxQuantity === 0 ||
                        !currentItem.transferFrom ||
                        !currentItem.transferTo
                      }
                      label={quantityLabel}
                      type="number"
                      name={`items[${index}].quantity`}
                      value={currentItem.quantity || ''}
                      onChange={formik.handleChange}
                      error={isQuantityError}
                      helperText={isQuantityError ? quantityErrorMessage : ''}
                      InputProps={{
                        inputProps: {
                          min: 1,
                          max: maxQuantity,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      multiline
                      disabled={!itemSelected}
                      label="Notes"
                      name={`items[${index}].notes`}
                      value={currentItem.notes || ''}
                      onChange={formik.handleChange}
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
                        // disabled={formik.values.items.some(item =>
                        //   !item.item || !item.quantity || !item.mrpPerUnit
                        // )}
                      >
                        <Add fontSize={'small'} />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              );
            })}
            {/* {JSON.stringify(formik.errors)} */}
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

export default React.memo(AddDraft);
