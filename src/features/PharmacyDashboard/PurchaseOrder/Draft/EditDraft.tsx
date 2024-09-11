import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback } from "react";
import { IDrugItem, IDrugVendor } from "../../../../types/pharmacyDashboard/master";
import { useToast } from "../../../../context/ToastContext";
import {
  useEditDraftPurchaseOrderMutation,
  useGetPurchaseOrderByIdQuery,
} from "../../../../services/pharmacyDashboardService/purchaseOrderApi";
import { FormikErrors, FormikTouched, useFormik } from "formik";
import Delete from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
import FieldAutocomplete from "../../../../components/FieldAutoComplete/FieldAutoComplete";
import CustomDatePicker from "../../../../components/CustomDatePicker/CustomDatePicker";
import _ from "lodash";

interface EditPurchaseOrderDraftProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
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
  discount: number | null;
}

interface FormValues {
  order_date: Date | null;
  vendor: IDrugVendor | null;
  items: IItem[];
  subTotal: number | null;
  tax: number | null;
  otherCharges: number | null;
  netAmount: number | null;
}

const renderSkeleton = () => (
  <Box sx={{ width: "100%", mt: 2 }}>
    <Grid container gap={2} mt={2}>
      <Grid item lg={3}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item lg={3}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item lg={2}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item lg={3}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
    </Grid>

    <Skeleton variant="text" height={40} width="20%" sx={{ mt: 2 }} />

    {Array.from(new Array(3)).map((_, index) => (
      <Grid container gap={1} key={index} mt={2}>
        <Grid item flex={2}>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid item flex={1}>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid item flex={1}>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid item flex={1}>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid item flex={1}>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid item flex={1}>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid item flex={1}>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid item flex={1}>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid item flex={1}>
          <Skeleton variant="rectangular" width={40} height={40} />
        </Grid>
      </Grid>
    ))}

    <Skeleton variant="text" height={40} width="20%" sx={{ mt: 2 }} />

    <Grid container spacing={2} mt={1}>
      <Grid item lg={3}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item lg={2}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item lg={2}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item lg={2}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item lg={3}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
    </Grid>
    <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mt={2}>
      <Skeleton variant="rectangular" width={90} height={40} />
      <Skeleton variant="rectangular" width={90} height={40} />
    </Box>
  </Box>
);

const EditDraft: React.FC<EditPurchaseOrderDraftProps> = ({
  openModal,
  onClose,
  id,
  drugItems,
  drugVendors,
}) => {
  const { showPromiseToast } = useToast();

  const {
    data: purchaseOrderData,
    isLoading: isPurchaseOrderLoading,
    isFetching: isPurchaseorderFetching,
  } = useGetPurchaseOrderByIdQuery(id);
  const purchaseOrder = purchaseOrderData?.data;
  const purchaseOrderLoading = isPurchaseOrderLoading || isPurchaseorderFetching;

  const [editPurchaseOrder, { isLoading }] = useEditDraftPurchaseOrderMutation();

  // const initialValues: FormValues = {
  //   order_date: purchaseOrder?.date || null,
  //   vendor: purchaseOrder?.vendor || null,
  //   items: purchaseOrder?.request.items || [],
  //   subTotal: purchaseOrder?.request.subTotal || null,
  //   tax: purchaseOrder?.request.tax || null,
  //   discount: purchaseOrder?.request.discount || null,
  //   otherCharges: purchaseOrder?.request.otherCharges || null,
  //   netAmount: purchaseOrder?.request.netAmount || null,
  // };

  const initialValues: FormValues = {
    order_date: purchaseOrder?.date || null,
    vendor: purchaseOrder?.vendor || null,
    items:
      purchaseOrder?.request.items.map((item: any) => ({
        item: item.item || null,
        quantityPerPack: item.packSize || null,
        noOfPacks: item.noOfPacks || null,
        quantity: item.quantity || null,
        cost: item.buyPrice || null,
        mrp: item.mrpPerPack || null,
        tax: item.tax || null,
        totalAmount: item.mrp || null,
        freeQuantity: item.freeQuantity || null,
        discount: item.discount,
      })) || [],
    subTotal: purchaseOrder?.request.subTotal || null,
    tax: purchaseOrder?.request.tax || null,
    otherCharges: purchaseOrder?.request.otherCharges || null,
    netAmount: purchaseOrder?.request.netAmount || null,
  };

  // const formSubmit = async (values: FormValues) => {
  //   const payload = {
  //     id: id,
  //     date: values.order_date,
  //     vendor: values.vendor?._id,
  //     request: {
  //       items: values.items.map((item) => {
  //         return {
  //           item: item.item?._id,
  //           packSize: parseFloat(
  //             (item.packSize ? +item.packSize : 0).toFixed(2)
  //           ),
  //           quantity: parseFloat(
  //             item.quantity ? item.quantity.toFixed(2) : "0"
  //           ),
  //           mrp: parseFloat(item.mrp ? item.mrp.toFixed(2) : "0"),
  //           mrpPerPack: parseFloat(
  //             item.mrpPerPack ? item.mrpPerPack.toFixed(2) : "0"
  //           ),
  //           buyPrice: parseFloat(
  //             item.buyPrice ? item.buyPrice.toFixed(2) : "0"
  //           ),
  //           tax: parseFloat(item.tax ? item.tax.toFixed(2) : "0"),
  //         };
  //       }),
  //       subTotal: parseFloat(
  //         values.subTotal ? values.subTotal.toFixed(2) : "0"
  //       ),
  //       tax: parseFloat(values.tax ? values.tax.toFixed(2) : "0"),
  //       discount: parseFloat(
  //         (values.discount ? +values.discount : 0).toFixed(2)
  //       ),
  //       otherCharges: parseFloat(
  //         (values.otherCharges ? +values.otherCharges : 0).toFixed(2)
  //       ),
  //       netAmount: parseFloat(
  //         (values.netAmount ? +values.netAmount : 0).toFixed(2)
  //       ),
  //     },
  //   };

  const formSubmit = async (values: FormValues) => {
    const payload = {
      id: id,
      date: values.order_date,
      vendor: values.vendor?._id,
      request: {
        items: values.items.map((item) => ({
          item: item.item?._id,
          packSize: parseFloat((item.quantityPerPack ?? 0).toFixed(2)),
          mrp: parseFloat((item.totalAmount ?? 0).toFixed(2)),
          mrpPerPack: parseFloat((item.mrp ?? 0).toFixed(2)),
          buyPrice: parseFloat((item.cost ?? 0).toFixed(2)),
          tax: parseFloat((item.tax ?? 0).toFixed(2)),
          quantity: parseFloat((item.quantity ?? 0).toFixed(2)),
          freeQuantity: parseFloat((item.freeQuantity ?? 0).toFixed(2)),
          noOfPacks: item.noOfPacks ?? 0,
          discount: item.discount ?? 0,
        })),
        subTotal: parseFloat((values.subTotal ?? 0).toFixed(2)),
        tax: parseFloat((values.tax ?? 0).toFixed(2)),
        otherCharges: parseFloat((values.otherCharges ?? 0).toFixed(2)),
        netAmount: parseFloat((values.netAmount ?? 0).toFixed(2)),
      },
    };

    console.log("Payload", payload);

    const promise = editPurchaseOrder(payload);

    showPromiseToast(promise, {
      loading: "Updating Order",
      success: (msg) => msg || "Purchase Order Updated Successfully",
      error: (msg) => msg || "Error Updating Purchase Order",
    });

    try {
      await promise;
    } catch (error) {
      console.error("Error Updating purchase order", error);
    }
    closeModal();
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: addPurchaseOrderValidationSchema,
    onSubmit: formSubmit,
    enableReinitialize: true,
  });

  const handleAddFields = () => {
    formik.setFieldValue("items", [
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
        discount: null,
      },
    ]);
  };

  const handleDeleteField = (index: number) => {
    const newFields = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue("items", newFields);
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
      field === "tax" ||
      field === "discount"
        ? parseFloat(rawValue.replace(/[^\d.-]/g, "")) || null
        : rawValue;

    currentItem = { ...currentItem, [field]: numericValue };

    if (
      field === "quantityPerPack" ||
      field === "noOfPacks" ||
      field === "cost" ||
      field === "tax" ||
      field === "discount"
    ) {
      const quantityPerPack = currentItem.quantityPerPack ?? 0;
      const noOfPacks = currentItem.noOfPacks ?? 0;
      const cost = currentItem.cost ?? 0;
      const taxPercentage = currentItem.tax ?? 0;
      const taxAmount = noOfPacks * cost * (taxPercentage / 100);

      const totalBeforeDiscount = noOfPacks * cost + taxAmount;
      const discountAmount = ((currentItem.discount ?? 0) / 100) * totalBeforeDiscount;
      const totalAmount = totalBeforeDiscount - discountAmount;

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
      const totalBeforeDiscount = noOfPacks * (currentItem.cost || 0) + taxAmount;
      const discountAmount = ((currentItem.discount ?? 0) / 100) * totalBeforeDiscount;
      currentItem.totalAmount = totalBeforeDiscount - discountAmount;
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

      const otherChargesRaw = formik.values.otherCharges ? +formik.values.otherCharges : 0;
      const otherCharges: number = !isNaN(otherChargesRaw)
        ? parseFloat(otherChargesRaw.toFixed(2))
        : 0;

      netAmount += otherCharges;

      formik.setFieldValue("subTotal", subTotal);
      formik.setFieldValue("tax", tax);
      formik.setFieldValue("netAmount", netAmount);
    },
    [formik.values.otherCharges, formik.setFieldValue]
  );

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
        | "discount"
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
    return items.reduce((acc, item) => acc + (item.totalAmount ?? 0), 0);
  };

  const calculateTax = (items: IItem[]) => {
    return items.reduce((acc, item) => {
      const noOfPacks = item.noOfPacks ?? 0;
      const itemTax = noOfPacks * (item.cost || 0) * ((item.tax || 0) / 100);
      return acc + itemTax;
    }, 0);
  };

  return (
    <Modal open={openModal} onClose={onClose}>
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
          Edit Purchase Order
        </Typography>

        {purchaseOrderLoading ? (
          renderSkeleton()
        ) : (
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
                  <TextField
                    label="Purchase Order Number"
                    value={purchaseOrder?.poNumber || ""}
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid item lg={2}>
                  <CustomDatePicker
                    label="Date"
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

              <Typography variant="subtitle1" color={"primary"} mt={2}>
                Items
              </Typography>
              {formik.values.items.map((_field: any, index: number) => {
                const { isError: isItemError, errorMessage: itemErrorMessage } =
                  getFieldErrorAndTouched(index, "item");
                const {
                  isError: isQuantityPerPackError,
                  errorMessage: quantityPerPackErrorMessage,
                } = getFieldErrorAndTouched(index, "quantityPerPack");
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
                const { isError: isDiscountError, errorMessage: discountErrorMessage } =
                  getFieldErrorAndTouched(index, "discount");

                const isLastItem = index === formik.values.items.length - 1;
                const onlyOneItem = formik.values.items.length === 1;

                const itemSelected = formik.values.items[index].item?.name || "";

                return (
                  <Grid container gap={1} key={index} mt={2}>
                    {/* Abstracted Autocomplete for Items */}
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
                        onChange={(e) =>
                          handleValueChange(index, "quantityPerPack", e.target.value)
                        }
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
                        name={`items[${index}].discount`}
                        label="Discount (%)"
                        value={formik.values.items[index].discount || ""}
                        onChange={(e) => handleValueChange(index, "discount", e.target.value)}
                        error={isDiscountError}
                        helperText={isDiscountError ? discountErrorMessage : ""}
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
        )}
      </Box>
    </Modal>
  );
};

export default EditDraft;
