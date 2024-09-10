import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { FormikErrors, FormikTouched, useFormik } from "formik";
import { IDrugItem, IDrugVendor } from "../../../../types/pharmacyDashboard/master";
import Delete from "@mui/icons-material/Delete";
import FieldAutocomplete from "../../../../components/FieldAutoComplete/FieldAutoComplete";
import { Add } from "@mui/icons-material";
import CustomDatePicker from "../../../../components/CustomDatePicker/CustomDatePicker";
import _ from "lodash";
import { useAddPurchaseOrderMutation } from "../../../../services/pharmacyDashboardService/purchaseOrderApi";
import { useToast } from "../../../../context/ToastContext";

interface AddPurchaseOrderDraftProps {
  openModal: boolean;
  onClose: () => void;
  drugItems: IDrugItem[];
  drugVendors: IDrugVendor[];
}

interface IItem {
  item: IDrugItem | null;
  quantityPerPack: number | null; // Will map to packSize
  noOfPacks: number | null;
  quantity: number | null;
  cost: number | null; // Will map to buyPrice
  mrp: number | null; // Will map to mrpPerPack
  tax: number | null;
  totalAmount: number | null; // Will map to mrp
  freeQuantity: number | null;
}

interface FormValues {
  order_date: Date | null;
  vendor: IDrugVendor | null;
  items: IItem[];
  subTotal: number | null;
  tax: number | null;
  discount: number | null;
  otherCharges: number | null;
  netAmount: number | null;
  isDifferentAddress: boolean;
  branchName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

const AddDraft: React.FC<AddPurchaseOrderDraftProps> = ({
  openModal,
  onClose,
  drugItems,
  drugVendors,
}) => {
  const { showPromiseToast } = useToast();

  const [createPurchaseOrder, { isLoading }] = useAddPurchaseOrderMutation();

  const initialValues: FormValues = {
    order_date: null,
    vendor: null,
    items: [
      {
        item: null,
        quantityPerPack: null,
        noOfPacks: null,
        quantity: null,
        cost: null,
        mrp: null,
        tax: null,
        totalAmount: null,
        freeQuantity: null,
      },
    ],
    subTotal: null,
    tax: null,
    discount: null,
    otherCharges: null,
    netAmount: null,
    isDifferentAddress: false,
    branchName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  };

  const formSubmit = async (values: FormValues) => {
    const payload = {
      date: values.order_date,
      vendor: values.vendor?._id,
      request: {
        items: values.items.map((item) => {
          return {
            item: item.item?._id,
            packSize: item.quantityPerPack, // Map quantityPerPack to packSize
            mrp: item.totalAmount, // Map totalAmount to mrp
            mrpPerPack: item.mrp, // Map mrp to mrpPerPack
            buyPrice: item.cost, // Map cost to buyPrice
            tax: parseFloat((item.tax ?? 0).toFixed(2)),
            quantity: item.quantity,
            freeQuantity: item.freeQuantity,
            noOfPacks: item.noOfPacks,
          };
        }),
        subTotal: parseFloat((values.subTotal ?? 0).toFixed(2)),
        tax: parseFloat((values.tax ?? 0).toFixed(2)),
        discount: parseFloat((values.discount ?? 0).toFixed(2)),
        otherCharges: parseFloat((values.otherCharges ?? 0).toFixed(2)),
        netAmount: parseFloat((values.netAmount ?? 0).toFixed(2)),
      },
      isDifferentAddress: values.isDifferentAddress,
      ...(values.isDifferentAddress && {
        newAddress: {
          branchName: values.branchName,
          street: values.street,
          city: values.city,
          state: values.state,
          zip: values.zip,
        },
      }),
    };

    console.log("Payload", payload);

    const promise = createPurchaseOrder(payload);

    showPromiseToast(promise, {
      loading: "Creating Order",
      success: (msg) => msg || "Purchase Order Created Successfully",
      error: (msg) => msg || "Error Creating Purchase Order",
    });

    try {
      await promise;
    } catch (error) {
      console.error("Error creating purchase order", error);
    }

    closeModal();
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: formSubmit,
    enableReinitialize: true,
  });

  const handleAddFields = () => {
    const newItems = [
      ...formik.values.items,
      {
        item: null,
        quantityPerPack: null,
        noOfPacks: null,
        quantity: null,
        cost: null,
        mrp: null,
        tax: null,
        totalAmount: null,
        freeQuantity: null,
      },
    ];
    formik.setFieldValue("items", newItems);
    updateCalculations(newItems);
  };

  const handleDeleteField = (index: number) => {
    const newFields = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue("items", newFields);
    updateCalculations(newFields);
  };

  const handleValueChange = (index: number, field: keyof IItem, rawValue: any) => {
    let newItems: IItem[] = [...formik.values.items];
    let currentItem: IItem = newItems[index];

    const numericValue =
      field === "quantity" ||
      field === "quantityPerPack" ||
      field === "noOfPacks" ||
      field === "cost" ||
      field === "mrp" ||
      field === "tax"
        ? parseFloat(rawValue.replace(/[^\d.-]/g, "")) || null
        : rawValue;

    currentItem = { ...currentItem, [field]: numericValue };

    if (
      field === "quantityPerPack" ||
      field === "noOfPacks" ||
      field === "cost" ||
      field === "tax"
    ) {
      const quantityPerPack = currentItem.quantityPerPack ?? 0;
      const noOfPacks = currentItem.noOfPacks ?? 0;
      const cost = currentItem.cost ?? 0;
      const taxPercentage = currentItem.tax ?? 0;
      const taxAmount = noOfPacks * cost * (taxPercentage / 100);
      const totalAmount = noOfPacks * cost + taxAmount;
      currentItem.totalAmount = totalAmount;
      currentItem.quantity = quantityPerPack * noOfPacks;
    }

    if (field === "item") {
      const quantityPerPack = currentItem.item?.packSize || 1;
      const noOfPacks = currentItem.noOfPacks || 1;
      currentItem.quantityPerPack = quantityPerPack;
      currentItem.noOfPacks = noOfPacks;
      currentItem.quantity = quantityPerPack * noOfPacks;
      currentItem.cost = currentItem.item?.rate || 0;
      currentItem.mrp = currentItem.item?.mrp || 0;
      const taxPercentage = currentItem.item?.taxRate?.taxRate || 0;
      const taxAmount = noOfPacks * (currentItem.cost || 0) * (taxPercentage / 100);
      currentItem.tax = taxPercentage;
      currentItem.totalAmount = noOfPacks * (currentItem.cost || 0) + taxAmount;
      currentItem.freeQuantity = currentItem.item?.freeQuantity || 0;
    }

    newItems[index] = currentItem;
    formik.setFieldValue("items", newItems);
    updateCalculations(newItems);
  };

  const updateCalculations = useCallback(
    (items = formik.values.items) => {
      const subTotal = calculateSubTotal(items);
      const tax = calculateTax(items);

      let netAmount = subTotal + tax;

      const discountPercentage: number = formik.values.discount || 0;
      const discount: number = netAmount * (discountPercentage / 100);
      netAmount -= discount;

      const otherChargesRaw = formik.values.otherCharges ? +formik.values.otherCharges : 0;
      const otherCharges: number = !isNaN(otherChargesRaw)
        ? parseFloat(otherChargesRaw.toFixed(2))
        : 0;

      netAmount += otherCharges;

      formik.setFieldValue("subTotal", subTotal);
      formik.setFieldValue("tax", tax);
      formik.setFieldValue("netAmount", netAmount);
    },
    [formik.values.discount, formik.values.otherCharges, formik.setFieldValue]
  );

  useEffect(() => {
    updateCalculations();
  }, [updateCalculations]);

  const getFieldErrorAndTouched = useCallback(
    (
      index: number,
      fieldName:
        | "item"
        | "quantityPerPack"
        | "noOfPacks"
        | "quantity"
        | "cost"
        | "mrp"
        | "tax"
        | "totalAmount"
        | "freeQuantity"
    ) => {
      // Ensure that we're working with the correct structure
      const touched = formik?.touched?.items as FormikTouched<IItem>[];
      const error = formik?.errors?.items as FormikErrors<IItem>[];

      const isFieldTouched = touched?.[index]?.[fieldName];
      const fieldError = error?.[index]?.[fieldName];

      return {
        isError: Boolean(isFieldTouched && fieldError),
        errorMessage: typeof fieldError === "string" ? fieldError : undefined,
      };
    },
    [formik.touched.items, formik.errors.items]
  );

  const closeModal = () => {
    formik.resetForm();
    onClose();
  };

  const calculateSubTotal = (items: IItem[]) => {
    return items.reduce((acc, item) => {
      const noOfPacks = item.noOfPacks ?? 0;
      const cost = item.cost ?? 0;
      return acc + noOfPacks * cost;
    }, 0);
  };

  const calculateTax = (items: IItem[]) => {
    return items.reduce((acc, item) => {
      const noOfPacks = item.noOfPacks ?? 0;
      const itemTax = noOfPacks * (item.cost || 0) * ((item.tax || 0) / 100);
      return acc + itemTax;
    }, 0);
  };

  return (
    <Modal open={openModal} onClose={closeModal}>
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          minHeight: "30vh",
          maxHeight: "86vh",
          overflowY: "auto",
          borderRadius: 1,
          boxShadow: 5,
          px: 8,
          py: 5,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" color={"primary"} mt={2} textAlign={"center"}>
          Add Purchase Order
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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
                  maxDate={new Date()}
                  value={formik.values.order_date}
                  onChange={(value) => formik.setFieldValue("order_date", value)}
                  error={formik.touched.order_date && Boolean(formik.errors.order_date)}
                  helperText={formik.touched.order_date && formik.errors.order_date}
                />
              </Grid>
              <Grid item lg={2}>
                <FieldAutocomplete
                  options={drugVendors}
                  getOptionLabel={(option) => {
                    return option?.name;
                  }}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  value={formik.values.vendor}
                  onChange={(newValue) => {
                    formik.setFieldValue("vendor", newValue);
                  }}
                  label="Vendor"
                  error={formik.touched.vendor && Boolean(formik.errors.vendor)}
                  helperText={formik.touched.vendor && formik.errors.vendor}
                />
              </Grid>
              <Grid item lg={2}>
                <TextField
                  label="Supplier Name"
                  value={formik.values.vendor?.contact?.person || ""}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item lg={2}>
                <TextField
                  label="Supplier Email"
                  value={formik.values.vendor?.contact?.email || ""}
                  disabled
                  fullWidth
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.isDifferentAddress}
                  onChange={(e) => formik.setFieldValue("isDifferentAddress", e.target.checked)}
                  color="primary"
                />
              }
              label="Ship To Another Address"
              sx={{ mt: 2 }}
            />

            {formik.values.isDifferentAddress && (
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item lg={4}>
                    <TextField
                      fullWidth
                      label="Branch Name"
                      value={formik.values.branchName}
                      onChange={(e) => formik.setFieldValue("branchName", e.target.value)}
                    />
                  </Grid>
                  <Grid item lg={4}>
                    <TextField
                      fullWidth
                      label="Street"
                      value={formik.values.street}
                      onChange={(e) => formik.setFieldValue("street", e.target.value)}
                    />
                  </Grid>
                  <Grid item lg={4}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formik.values.city}
                      onChange={(e) => formik.setFieldValue("city", e.target.value)}
                    />
                  </Grid>
                  <Grid item lg={4}>
                    <TextField
                      fullWidth
                      label="State"
                      value={formik.values.state}
                      onChange={(e) => formik.setFieldValue("state", e.target.value)}
                    />
                  </Grid>
                  <Grid item lg={4}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={formik.values.zip}
                      onChange={(e) => formik.setFieldValue("zip", e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            <Typography variant="subtitle1" color={"primary"} mt={2}>
              Items
            </Typography>
            {formik.values.items.map((_field: any, index: number) => {
              const { isError: isItemError, errorMessage: itemErrorMessage } =
                getFieldErrorAndTouched(index, "item");
              const { isError: isQuantityPerPackError, errorMessage: quantityPerPackErrorMessage } =
                getFieldErrorAndTouched(index, "quantityPerPack");
              const { isError: isNoOfPacksError, errorMessage: noOfPacksErrorMessage } =
                getFieldErrorAndTouched(index, "noOfPacks");
              const { isError: isQuantityError, errorMessage: quantityErrorMessage } =
                getFieldErrorAndTouched(index, "quantity");
              const { isError: isCostError, errorMessage: costErrorMessage } =
                getFieldErrorAndTouched(index, "cost");
              const { isError: isMrpError, errorMessage: mrpErrorMessage } =
                getFieldErrorAndTouched(index, "mrp");
              const { isError: isTaxError, errorMessage: taxErrorMessage } =
                getFieldErrorAndTouched(index, "tax");
              const { isError: isTotalAmountError, errorMessage: totalAmountErrorMessage } =
                getFieldErrorAndTouched(index, "totalAmount");
              const { isError: isFreeQuantityError, errorMessage: freeQuantityErrorMessage } =
                getFieldErrorAndTouched(index, "freeQuantity");

              const isLastItem = index === formik.values.items.length - 1;
              const onlyOneItem = formik.values.items.length === 1;

              const itemSelected = formik.values.items[index].item?.name || "";

              return (
                <Grid container gap={1} key={index} mt={2}>
                  <Grid item flex={3}>
                    <FieldAutocomplete
                      options={drugItems}
                      getOptionLabel={(option) => {
                        return option?.name;
                      }}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      value={formik.values.items[index].item}
                      onChange={(newValue) => {
                        handleValueChange(index, "item", newValue);
                      }}
                      label="Item"
                      error={isItemError}
                      helperText={isItemError ? itemErrorMessage : ""}
                    />
                  </Grid>

                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      name={`items[${index}].quantityPerPack`}
                      label="Quantity/Pack"
                      disabled={!itemSelected}
                      value={formik.values.items[index].quantityPerPack || ""}
                      onChange={(e) => handleValueChange(index, "quantityPerPack", e.target.value)}
                      error={isQuantityPerPackError}
                      helperText={isQuantityPerPackError ? quantityPerPackErrorMessage : ""}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      name={`items[${index}].noOfPacks`}
                      label="No. Of Packs"
                      disabled={!itemSelected}
                      value={formik.values.items[index].noOfPacks || ""}
                      onChange={(e) => handleValueChange(index, "noOfPacks", e.target.value)}
                      error={isNoOfPacksError}
                      helperText={isNoOfPacksError ? noOfPacksErrorMessage : ""}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      disabled
                      label="Quantity"
                      value={formik.values.items[index].quantity || ""}
                      onChange={(e) => handleValueChange(index, "quantity", e.target.value)}
                      error={isQuantityError}
                      helperText={isQuantityError ? quantityErrorMessage : ""}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      disabled={!itemSelected}
                      label="Cost"
                      value={formik.values.items[index].cost?.toLocaleString() || ""}
                      onChange={(e) => handleValueChange(index, "cost", e.target.value)}
                      error={isCostError}
                      helperText={isCostError ? costErrorMessage : ""}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="MRP"
                      disabled={!itemSelected}
                      value={formik.values.items[index].mrp?.toLocaleString() || ""}
                      onChange={(e) => handleValueChange(index, "mrp", e.target.value)}
                      error={isMrpError}
                      helperText={isMrpError ? mrpErrorMessage : ""}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      disabled
                      label="Tax"
                      value={formik.values.items[index].tax?.toLocaleString() || ""}
                      onChange={(e) => handleValueChange(index, "tax", e.target.value)}
                      error={isTaxError}
                      helperText={isTaxError ? taxErrorMessage : ""}
                    />
                  </Grid>

                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="Total Amount"
                      disabled
                      value={formik.values.items[index].totalAmount?.toLocaleString() || ""}
                      error={isTotalAmountError}
                      helperText={isTotalAmountError ? totalAmountErrorMessage : ""}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="Free Quantity"
                      disabled={!itemSelected}
                      value={formik.values.items[index].freeQuantity?.toLocaleString() || ""}
                      onChange={(e) => handleValueChange(index, "freeQuantity", e.target.value)}
                      error={isFreeQuantityError}
                      helperText={isFreeQuantityError ? freeQuantityErrorMessage : ""}
                    />
                  </Grid>
                  <Grid
                    item
                    flex={1}
                    display={"flex"}
                    justifyContent={"flex-start"}
                    alignItems={"flex-start"}
                  >
                    {!onlyOneItem && (
                      <IconButton size="small" onClick={() => handleDeleteField(index)}>
                        <Delete fontSize={"small"} />
                      </IconButton>
                    )}
                    {isLastItem && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={handleAddFields}
                        disabled={formik.values.items.some(
                          (item) => !item.item || !item.quantity || !item.quantityPerPack
                        )}
                      >
                        <Add fontSize={"small"} />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              );
            })}
            <Typography variant="subtitle1" color={"primary"} mt={2} gutterBottom>
              Summary
            </Typography>
            <Grid container spacing={2} mt={1}>
              <Grid item lg={3}>
                <TextField
                  fullWidth
                  label="Sub Total"
                  disabled
                  value={formik.values.subTotal?.toLocaleString() || ""}
                />
              </Grid>
              <Grid item lg={2}>
                <TextField
                  fullWidth
                  label="Tax"
                  disabled
                  value={formik.values.tax?.toLocaleString() || ""}
                />
              </Grid>
              <Grid item lg={2}>
                <TextField
                  fullWidth
                  label="Discount %"
                  value={formik.values.discount || ""}
                  onChange={(e) => {
                    formik.handleChange(e);
                    updateCalculations();
                  }}
                  name="discount"
                />
              </Grid>
              <Grid item lg={2}>
                <TextField
                  fullWidth
                  label="Other Charges"
                  value={formik.values.otherCharges?.toLocaleString() || ""}
                  onChange={(e) => {
                    formik.handleChange(e);
                    updateCalculations();
                  }}
                  name="otherCharges"
                />
              </Grid>
              <Grid item lg={3}>
                <TextField
                  fullWidth
                  label="Net Amount"
                  disabled
                  value={formik.values.netAmount?.toLocaleString() || ""}
                />
              </Grid>
            </Grid>
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
              gap={2}
              mb={2}
              mt={2}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading || _.isEqual(initialValues, formik.values)}
                sx={{ width: "fit-content" }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: "fit-content" }}
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
