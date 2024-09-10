import React, { useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { useFormik, FormikErrors, FormikTouched } from "formik";
import Delete from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";
import FieldAutocomplete from "../../../components/FieldAutoComplete/FieldAutoComplete";
import { IPharmacyStock } from "../../../types/pharmacyDashboard/stocks";
import { IDrugLocation } from "../../../types/pharmacyDashboard/master";
import { useToast } from "../../../context/ToastContext";
import { useAddInternalConsumptionMutation } from "../../../services/pharmacyDashboardService/internalConsumptionApi";
import _ from "lodash";

interface AddInternalConsumptionProps {
  open: boolean;
  onClose: () => void;
  pharmacyStock: IPharmacyStock[];
}

interface ITransferFrom {
  location: IDrugLocation;
  quantity: number;
}

interface IInternalConsumptionItem {
  item: IPharmacyStock | null;
  transferFrom: ITransferFrom | null;
  quantity: number | null;
}

interface IInternalConsumptionFormValues {
  date: Date | null;
  items: IInternalConsumptionItem[];
}

const AddInternalConsumption: React.FC<AddInternalConsumptionProps> = ({
  open,
  onClose,
  pharmacyStock,
}) => {
  const { showPromiseToast } = useToast();
  const [addInternalConsumption, { isLoading }] = useAddInternalConsumptionMutation();

  const initialValues: IInternalConsumptionFormValues = {
    date: new Date(),
    items: [{ item: null, transferFrom: null, quantity: null }],
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const payload = {
        date: values.date,
        items: values.items.map((item) => ({
          item: item.item?._id,
          quantity: item.quantity || 0,
          transferFrom: {
            location: item.transferFrom?.location._id,
            quantity: item.transferFrom?.quantity || 0,
          },
        })),
      };

      console.log("Payload", payload);

      const promise = addInternalConsumption(payload).unwrap();

      showPromiseToast(promise, {
        loading: "Creating Internal Consumption",
        success: (msg) => msg || "Internal Consumption Created Successfully",
        error: (msg) => msg || "Error Creating Internal Consumption",
      });

      try {
        await promise;
      } catch (error) {
        console.error("Error creating internal consumption", error);
      }

      onClose();
    },
  });

  const handleAddFields = () => {
    formik.setFieldValue("items", [
      ...formik.values.items,
      { item: null, transferFrom: null, quantity: null },
    ]);
  };

  const handleDeleteField = (index: number) => {
    const newFields = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue("items", newFields);
  };

  const getFieldErrorAndTouched = useCallback(
    (index: number, fieldName: "item" | "transferFrom" | "quantity") => {
      const touched = formik?.touched?.items as FormikTouched<IInternalConsumptionItem>[];
      const error = formik?.errors?.items as FormikErrors<IInternalConsumptionItem>[];

      const isFieldTouched = touched?.[index]?.[fieldName];
      const fieldError = error?.[index]?.[fieldName];

      return {
        isError: Boolean(isFieldTouched && fieldError),
        errorMessage: typeof fieldError === "string" ? fieldError : undefined,
      };
    },
    [formik.touched, formik.errors]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Internal Consumption</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2}>
            {formik.values.items.map((item, index) => {
              const { isError: isItemError, errorMessage: itemErrorMessage } =
                getFieldErrorAndTouched(index, "item");
              const { isError: isTransferFromError, errorMessage: transferFromErrorMessage } =
                getFieldErrorAndTouched(index, "transferFrom");
              const { isError: isQuantityError, errorMessage: quantityErrorMessage } =
                getFieldErrorAndTouched(index, "quantity");

              const currentItem = formik.values.items[index];
              const itemSelected = currentItem.item;
              const locationsFrom = currentItem.item?.locations || [];

              const isLastItem = index === formik.values.items.length - 1;
              const onlyOneItem = formik.values.items.length === 1;

              const maxQuantity =
                (currentItem.transferFrom?.quantity ?? 0) -
                formik.values.items.reduce((total, currentItem, idx) => {
                  if (
                    currentItem.item?._id === item.item?._id &&
                    currentItem.transferFrom?.location._id === item.transferFrom?.location._id &&
                    idx !== index
                  ) {
                    return total + (currentItem.quantity || 0);
                  }
                  return total;
                }, 0);

              const quantityLabel = itemSelected
                ? `Quantity (${maxQuantity} available)`
                : "Quantity";

              return (
                <Grid container gap={1} key={index} mt={2}>
                  <Grid item flex={2}>
                    <FieldAutocomplete
                      options={pharmacyStock}
                      getOptionLabel={(option) => option?.item?.name}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      value={item.item}
                      onChange={(newValue) => {
                        formik.setFieldValue(`items[${index}].item`, newValue);
                        formik.setFieldValue(`items[${index}].transferFrom`, null);
                        formik.setFieldValue(`items[${index}].quantity`, null);
                      }}
                      label="Item"
                      error={isItemError}
                      helperText={isItemError ? itemErrorMessage : ""}
                    />
                  </Grid>
                  <Grid item flex={1.5}>
                    <FieldAutocomplete
                      options={locationsFrom}
                      disabled={!itemSelected}
                      getOptionLabel={(option) => {
                        return option?.location?.location;
                      }}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      value={item.transferFrom}
                      onChange={(newValue) =>
                        formik.setFieldValue(`items[${index}].transferFrom`, newValue)
                      }
                      label="Location"
                      error={isTransferFromError}
                      helperText={isTransferFromError ? transferFromErrorMessage : ""}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      disabled={!itemSelected || maxQuantity === 0 || !currentItem.transferFrom}
                      label={quantityLabel}
                      type="number"
                      name={`items[${index}].quantity`}
                      value={currentItem.quantity ?? ""}
                      onChange={formik.handleChange}
                      error={isQuantityError}
                      helperText={isQuantityError ? quantityErrorMessage : ""}
                      InputProps={{
                        inputProps: {
                          min: 1,
                          max: maxQuantity,
                        },
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    flex={1}
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    {!onlyOneItem && (
                      <IconButton size="small" onClick={() => handleDeleteField(index)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                    {isLastItem && (
                      <IconButton size="small" color="primary" onClick={handleAddFields}>
                        <Add fontSize="small" />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              );
            })}
            <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} mt={2}>
              <Button color="primary" variant="contained" type="submit" disabled={isLoading}>
                Add Consumption
              </Button>
              <Button color="secondary" variant="contained" onClick={onClose} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddInternalConsumption;
