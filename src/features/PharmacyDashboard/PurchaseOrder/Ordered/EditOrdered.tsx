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
import React, { useCallback, useEffect } from "react";
import { IDrugItem, IDrugVendor } from "../../../../types/pharmacyDashboard/master";
import { useToast } from "../../../../context/ToastContext";
import {
  useEditPurchaseOrderMutation,
  useGetPurchaseOrderByIdQuery,
  useUpdateStockFromPurchaseOrderMutation,
} from "../../../../services/pharmacyDashboardService/purchaseOrderApi";
import { FormikErrors, FormikTouched, useFormik } from "formik";
import Delete from "@mui/icons-material/Delete";
import FieldAutocomplete from "../../../../components/FieldAutoComplete/FieldAutoComplete";
import CustomDatePicker from "../../../../components/CustomDatePicker/CustomDatePicker";
import _ from "lodash";
import FileUploadButton from "../../../../components/FileUploadAndPreview/FileUploadButton";
import { EBuckets, EDocumentTypes } from "../../../../types/global";
import { ContentCopy } from "@mui/icons-material";

interface EditPurchaseOrderDraftProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
  drugItems: IDrugItem[];
  drugVendors: IDrugVendor[];
}

interface IItem {
  taxAmount: number;
  item: IDrugItem | null;
  packsRequired: number | null;
  packSize: number | null;
  noOfPacks: number | null;
  batchNo?: string | null;
  expiryDate?: Date | null;
  mrp: number | null;
  mrpPerPack: number | null;
  buyPrice: number | null;
  tax: number | null;
  totalCost: number | null;
  freeQuantity: number | null;
  quantity: number | null;
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
  partialyProcessed?: boolean;
  files: string[];
  invoiceNumber: string;
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

const EditPurchaseOrderDraft: React.FC<EditPurchaseOrderDraftProps> = ({
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

  console.log("Ordered PO data", purchaseOrderData);

  const [editPurchaseOrder, { isLoading: isEditingLoading }] = useEditPurchaseOrderMutation();
  const [updateStock, { isLoading: isUpdatingStockLoading }] =
    useUpdateStockFromPurchaseOrderMutation();

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    let initialUrl: string[] = [];
    if (purchaseOrder?.response?.invoice) {
      initialUrl = purchaseOrder.response.invoice.flat();
    }
    return initialUrl;
  });

  const initialValues: FormValues = {
    order_date: purchaseOrder?.date || null,
    vendor: purchaseOrder?.vendor || null,
    items:
      purchaseOrder?.request.items.map((item): IItem => {
        const noOfPacks = item.noOfPacks ?? 0;
        const buyPrice = item.buyPrice ?? 0;
        const discount = item.discount ?? 0;

        // Total cost without tax, applying discount
        const itemCost = noOfPacks * buyPrice;
        const discountAmount = (itemCost * discount) / 100;
        const totalCostWithoutTax = itemCost - discountAmount;

        // Calculate tax amount separately using tax percentage, but don't modify `tax` field
        const taxAmount = (totalCostWithoutTax * (item.tax ?? 0)) / 100; // tax is % like 18%

        return {
          item: item.item || null,
          packSize: item.packSize || null,
          noOfPacks: noOfPacks,
          packsRequired: noOfPacks,
          mrp: item.mrp || null,
          mrpPerPack: item.mrpPerPack || null,
          buyPrice: buyPrice,
          tax: item.tax, // Keep tax as the percentage (e.g., 18 for 18%)
          taxAmount: taxAmount, // Calculate and store the tax amount separately
          totalCost: totalCostWithoutTax, // Total cost without tax
          freeQuantity: item.freeQuantity || null,
          batchNo: item.batchNo || null,
          expiryDate: item.expiryDate || null,
          quantity: noOfPacks * (item.packSize ?? 0), // Calculate quantity
          discount: discount,
        };
      }) || [],

    // Calculate subTotal (sum of totalCost without tax)
    subTotal:
      purchaseOrder?.request.items?.reduce((acc, item) => {
        const noOfPacks = item.noOfPacks ?? 0;
        const buyPrice = item.buyPrice ?? 0;
        const discount = item.discount ?? 0;
        const itemCost = noOfPacks * buyPrice;
        const discountAmount = (itemCost * discount) / 100;
        const totalCostWithoutTax = itemCost - discountAmount;
        return acc + totalCostWithoutTax;
      }, 0) ?? 0, // Ensuring subTotal is never undefined, returning 0 by default

    // Calculate total tax for all items based on tax amount
    tax:
      purchaseOrder?.request.items?.reduce((acc, item) => {
        const noOfPacks = item.noOfPacks ?? 0;
        const buyPrice = item.buyPrice ?? 0;
        const discount = item.discount ?? 0;
        const itemCost = noOfPacks * buyPrice;
        const discountAmount = (itemCost * discount) / 100;
        const totalCostWithoutTax = itemCost - discountAmount;
        const taxAmount = (totalCostWithoutTax * (item.tax ?? 0)) / 100; // tax is % like 18%
        return acc + taxAmount;
      }, 0) ?? 0, // Ensuring tax is never undefined, returning 0 by default

    // Keep other charges from purchase order
    otherCharges: purchaseOrder?.request.otherCharges || 0,

    // Calculate the net amount as subTotal + tax + otherCharges
    netAmount: (function () {
      const subTotal = purchaseOrder?.request.items.reduce((acc, item) => {
        const noOfPacks = item.noOfPacks ?? 0;
        const buyPrice = item.buyPrice ?? 0;
        const discount = item.discount ?? 0;
        const itemCost = noOfPacks * buyPrice;
        const discountAmount = (itemCost * discount) / 100;
        const totalCostWithoutTax = itemCost - discountAmount;
        return acc + totalCostWithoutTax;
      }, 0);

      const tax = purchaseOrder?.request.items.reduce((acc, item) => {
        const noOfPacks = item.noOfPacks ?? 0;
        const buyPrice = item.buyPrice ?? 0;
        const discount = item.discount ?? 0;
        const itemCost = noOfPacks * buyPrice;
        const discountAmount = (itemCost * discount) / 100;
        const totalCostWithoutTax = itemCost - discountAmount;
        const taxAmount = (totalCostWithoutTax * (item.tax ?? 0)) / 100; // tax is % like 18%
        return acc + taxAmount;
      }, 0);

      return (subTotal ?? 0) + (tax ?? 0) + (purchaseOrder?.request.otherCharges ?? 0);
    })(),

    partialyProcessed: false,
    invoiceNumber: purchaseOrder?.invoiceNumber || "",
    files: [],
  };

  const formSubmit = async (values: FormValues) => {
    const originalPurchaseOrder = purchaseOrderData?.data;

    const payload = {
      id: id,
      date: purchaseOrder?.date,
      vendor: purchaseOrder?.vendor?._id,
      invoiceNumber: values.invoiceNumber,
      request: {
        items: values.items.map((item) => ({
          item: item.item?._id,
          packSize: item.packSize,
          quantity: (item.packSize ?? 0) * (item.noOfPacks ?? 0), // Handle null values
          mrp: item.mrp,
          mrpPerPack: item.mrpPerPack,
          buyPrice: item.buyPrice,
          tax: item.tax,
          freeQuantity: item.freeQuantity, // Ensure freeQuantity is included
          noOfPacks: item.noOfPacks, // Ensure noOfPacks is included
          packsRequired: item.packsRequired, // Include packsRequired here
          discount: item.discount,
        })),
        subTotal: values.subTotal,
        tax: values.tax,

        otherCharges: values.otherCharges,
        netAmount: Math.round(values.netAmount ?? 0),
      },
      response: {
        items: values.items.map((item) => ({
          item: item.item?._id,
          batchNo: item.batchNo,
          expiryDate: item.expiryDate,
          packSize: item.packSize,
          quantity: (item.packSize ?? 0) * (item.noOfPacks ?? 0), // Handle null values
          mrp: item.mrp,
          mrpPerPack: item.mrpPerPack,
          buyPrice: item.buyPrice,
          tax: item.tax,
          freeQuantity: item.freeQuantity, // Ensure freeQuantity is included
          noOfPacks: item.noOfPacks, // Ensure noOfPacks is included
          packsRequired: item.packsRequired, // Include packsRequired here
          discount: item.discount,
        })),
        subTotal: values.subTotal,
        tax: values.tax,

        otherCharges: values.otherCharges,
        netAmount: values.netAmount,
        invoice: fileUploadedUrl,
      },
    };

    const editPromise = editPurchaseOrder(payload).unwrap();
    showPromiseToast(editPromise, {
      loading: "Creating Invoice",
      success: (msg) => msg || "Invoice Created Successfully",
      error: (msg) => msg || "Error Creating Invoice Order",
    });

    try {
      await editPromise;
    } catch (error) {
      console.error("Error Updating purchase order", error);
      closeModal();
      return;
    }

    closeModal();

    const promise = updateStock({
      purchaseOrderId: id,
    }).unwrap();

    showPromiseToast(promise, {
      loading: "Updating Stock",
      success: (msg) => msg || "Stock Updated Successfully",
      error: (msg) => msg || "Error Updating Stock",
    });

    // try {
    //   await promise;
    // } catch (error) {
    //   console.error("Error Updating Stock order", error);
    // }

    try {
      await promise;
    } catch (error) {
      console.error("Error Updating Stock order", error);
      // Rollback to original state
      if (originalPurchaseOrder) {
        const rollbackPayload = {
          ...originalPurchaseOrder,
          id: id,
          vendor: originalPurchaseOrder.vendor.toString(),
          branch: originalPurchaseOrder.branch.toString(),
          request: {
            ...originalPurchaseOrder.request,
            items: originalPurchaseOrder.request.items.map((item) => ({
              ...item,
              item: item.item.toString(),
              freeQuantity: Number(item.freeQuantity) || 0,
              noOfPacks: Number(item.noOfPacks) || 0,
            })),
          },
          response: {
            ...originalPurchaseOrder.response,
            items: originalPurchaseOrder.response.items.map((item) => ({
              ...item,
              item: item.item.toString(),
              freeQuantity: Number(item.freeQuantity) || 0,
              noOfPacks: Number(item.noOfPacks) || 0,
            })),
          },
        };

        try {
          await editPurchaseOrder(rollbackPayload).unwrap();
          console.log("Rolled back to original state successfully");
        } catch (rollbackError) {
          console.error("Error rolling back to original state", rollbackError);
        }
      }

      closeModal();
      return;
    }

    closeModal();
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: addPurchaseOrderInvoiceValidationSchema,
    onSubmit: formSubmit,
    enableReinitialize: true,
  });

  // const handleAddFields = () => {
  //   formik.setFieldValue("items", [
  //     ...formik.values.items,
  //     {
  //       item: null,
  //       packsRequired: null,
  //       packSize: null,
  //       noOfPacks: null,
  //       mrp: null,
  //       mrpPerPack: null,
  //       buyPrice: null,
  //       tax: null,
  //       totalCost: null,
  //       freeQuantity: null,
  //     },
  //   ]);
  // };

  const handleCloneField = (index: number) => {
    const currentItem = formik.values.items[index];
    const noOfPacks = currentItem.noOfPacks ?? 0;
    const packsRequired = currentItem.packsRequired ?? 0;

    formik.setFieldValue("items", [
      ...formik.values.items,
      {
        ...currentItem,
        batchNo: "",
        expiryDate: null,
        packsRequired: packsRequired - noOfPacks,
        noOfPacks: null,
        freeQuantity: null, // Set freeQuantity to null for cloned item
        discount: null,
      },
    ]);
    updateCalculations();
  };

  const handleDeleteField = (index: number) => {
    const newFields = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue("items", newFields);
    updateCalculations();
  };

  const handleValueChange = (index: number, field: keyof IItem, rawValue: any) => {
    let newItems: IItem[] = [...formik.values.items];
    let currentItem: IItem = newItems[index];

    // Parse the numeric value for specific fields
    const numericValue =
      field === "noOfPacks" ||
      field === "packSize" ||
      // field === "buyPrice" ||
      // field === "mrpPerPack" ||
      // field === "discount" ||
      field === "freeQuantity"
        ? Number(rawValue.replace(/[^\d.-]/g, "")) || null
        : rawValue;

    currentItem = { ...currentItem, [field]: numericValue };

    // Recalculate total cost and tax amount, but do not modify the `tax` field (it remains as %)
    if (field === "noOfPacks" || field === "buyPrice" || field === "discount") {
      const noOfPacks = currentItem.noOfPacks ?? 0;
      const buyPrice = currentItem.buyPrice ?? 0;
      const discount = currentItem.discount ?? 0;
      const taxPercentage = currentItem.tax ?? 0; // This is the tax percentage (e.g., 18 for 18%)

      // Total cost without tax
      const itemCost = noOfPacks * buyPrice;
      const discountAmount = (itemCost * discount) / 100;
      currentItem.totalCost = itemCost - discountAmount; // Total cost without tax

      // Calculate tax amount based on the total cost and tax percentage
      const taxAmount = (currentItem.totalCost * taxPercentage) / 100;

      // Store the calculated tax amount separately (not modifying the `tax` field)
      currentItem.taxAmount = taxAmount; // New field to store calculated tax
    }

    newItems[index] = currentItem;
    formik.setFieldValue("items", newItems);
    updateCalculations(); // Trigger recalculations
  };

  const updateCalculations = useCallback(() => {
    // Recalculate subTotal (sum of total costs without tax)
    const subTotal = formik.values.items.reduce((acc, item) => {
      const itemTotalCost = Number(item.totalCost ?? 0); // Only total cost without tax
      return acc + itemTotalCost;
    }, 0);

    // Recalculate total tax (sum of calculated tax amounts)
    const totalTax = formik.values.items.reduce((acc, item) => {
      return acc + (item.taxAmount ?? 0); // Sum up individual calculated tax amounts
    }, 0);

    // Recalculate netAmount (subTotal + totalTax + otherCharges)
    // const netAmount = subTotal + totalTax + (formik.values.otherCharges ?? 0);
    const netAmount = Math.round(subTotal + totalTax + (formik.values.otherCharges ?? 0)); // Round to nearest integer

    // Update formik values
    formik.setFieldValue("subTotal", subTotal);
    formik.setFieldValue("tax", totalTax); // Set total tax amount (not percentage)
    formik.setFieldValue("netAmount", netAmount);
  }, [formik.values.items, formik.values.otherCharges, formik.setFieldValue]);

  useEffect(() => {
    updateCalculations(); // Ensure calculations are updated when items change
  }, [updateCalculations]);

  const getFieldErrorAndTouched = useCallback(
    (
      index: number,
      fieldName:
        | "item"
        | "noOfPacks"
        | "packSize"
        | "mrpPerPack"
        | "buyPrice"
        | "batchNo"
        | "expiryDate"
        | "freeQuantity" // Add freeQuantity here
        | "discount"
    ) => {
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

  const isAnyItemExceedsRequired = formik.values.items.some(
    (item) => (item.noOfPacks ?? 0) > (item.packsRequired ?? 0)
  );

  const isAnyItemMissingBatchOrExpiry = formik.values.items.some(
    (item) => !item.batchNo || !item.expiryDate
  );

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
                    disabled
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
                <Grid item lg={2}>
                  <TextField
                    label="Invoice Number"
                    value={formik.values.invoiceNumber || ""}
                    fullWidth
                    onChange={formik.handleChange}
                    name="invoiceNumber"
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle1" color={"primary"} mt={2}>
                Items
              </Typography>
              {formik.values.items.map((_field: any, index: number) => {
                const { isError: isItemError, errorMessage: itemErrorMessage } =
                  getFieldErrorAndTouched(index, "item");
                const { isError: isNoOfPacksError, errorMessage: noOfPacksErrorMessage } =
                  getFieldErrorAndTouched(index, "noOfPacks");
                const { isError: isPackSizeError, errorMessage: packSizeErrorMessage } =
                  getFieldErrorAndTouched(index, "packSize");
                const { isError: isMrpPerPackError, errorMessage: mrpPerPackErrorMessage } =
                  getFieldErrorAndTouched(index, "mrpPerPack");
                const { isError: buyPriceError, errorMessage: buyPriceErrorMessage } =
                  getFieldErrorAndTouched(index, "buyPrice");
                const { isError: batchNoError, errorMessage: batchNoErrorMessage } =
                  getFieldErrorAndTouched(index, "batchNo");
                const { isError: expiryDateError, errorMessage: expiryDateErrorMessage } =
                  getFieldErrorAndTouched(index, "expiryDate");
                const { isError: freeQuantityError, errorMessage: freeQuantityErrorMessage } =
                  getFieldErrorAndTouched(index, "freeQuantity"); // Add freeQuantity error
                const { isError: discountError, errorMessage: discountErrorMessage } =
                  getFieldErrorAndTouched(index, "discount");

                const onlyOneItem = formik.values.items.length === 1;

                const itemSelected = formik.values.items[index].item?.name || "";

                return (
                  <Box
                    key={index}
                    mt={2}
                    sx={{
                      mt: formik.values.items[index].batchNo === "" ? 3 : 0,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {`Item ${index + 1}`}
                    </Typography>
                    <Grid container gap={1} key={index} mt={2}>
                      <Grid item flex={2}>
                        <FieldAutocomplete
                          options={drugItems}
                          getOptionLabel={(option) => option?.name}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          value={formik.values.items[index].item}
                          onChange={(newValue) => handleValueChange(index, "item", newValue)}
                          label="Item"
                          error={isItemError}
                          helperText={isItemError ? itemErrorMessage : ""}
                          disabled // disable the field as required
                        />
                      </Grid>
                      <Grid item flex={2}>
                        <TextField
                          fullWidth
                          label="No Of Packs"
                          disabled={!itemSelected}
                          name={`items[${index}].noOfPacks`}
                          value={formik.values.items[index].noOfPacks || ""}
                          onChange={(e) => handleValueChange(index, "noOfPacks", e.target.value)}
                          error={isNoOfPacksError}
                          helperText={isNoOfPacksError ? noOfPacksErrorMessage : ""}
                        />
                      </Grid>
                      <Grid item flex={2}>
                        <TextField
                          fullWidth
                          disabled={!itemSelected}
                          label="Pack Size"
                          name={`items[${index}].packSize`}
                          value={formik.values.items[index].packSize || ""}
                          onChange={(e) => handleValueChange(index, "packSize", e.target.value)}
                          error={isPackSizeError}
                          helperText={isPackSizeError ? packSizeErrorMessage : ""}
                        />
                      </Grid>

                      <Grid item flex={2}>
                        <TextField
                          fullWidth
                          disabled={!itemSelected}
                          label="MRP"
                          name={`items[${index}].mrpPerPack`}
                          value={formik.values.items[index].mrpPerPack || ""}
                          onChange={(e) => handleValueChange(index, "mrpPerPack", e.target.value)}
                          error={isMrpPerPackError}
                          helperText={isMrpPerPackError ? mrpPerPackErrorMessage : ""}
                        />
                      </Grid>

                      <Grid item flex={2}>
                        <TextField
                          fullWidth
                          disabled={!itemSelected}
                          label="Cost"
                          name={`items[${index}].buyPrice`}
                          value={formik.values.items[index].buyPrice?.toLocaleString() || ""}
                          onChange={(e) => handleValueChange(index, "buyPrice", e.target.value)}
                          error={buyPriceError}
                          helperText={buyPriceError ? buyPriceErrorMessage : ""}
                        />
                      </Grid>
                    </Grid>
                    <Grid container gap={1} mt={2} mb={2}>
                      <Grid item flex={2}>
                        <TextField
                          fullWidth
                          label="Tax"
                          disabled
                          name={`items[${index}].tax`}
                          value={formik.values.items[index].tax?.toLocaleString() || ""}
                        />
                      </Grid>
                      <Grid item flex={2}>
                        <TextField
                          fullWidth
                          label="Batch No"
                          name={`items[${index}].batchNo`}
                          value={formik.values.items[index].batchNo || ""}
                          error={batchNoError}
                          helperText={batchNoError ? batchNoErrorMessage : ""}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item flex={2}>
                        <CustomDatePicker
                          minDate={new Date()}
                          label="Expiry Date"
                          value={formik.values.items[index].expiryDate || null}
                          error={expiryDateError}
                          helperText={expiryDateError ? expiryDateErrorMessage : ""}
                          onChange={(value) =>
                            formik.setFieldValue(`items[${index}].expiryDate`, value)
                          }
                        />
                      </Grid>
                      <Grid item flex={2}>
                        <TextField
                          fullWidth
                          disabled={!itemSelected}
                          label="Free Quantity"
                          name={`items[${index}].freeQuantity`}
                          value={formik.values.items[index].freeQuantity || ""}
                          onChange={(e) => handleValueChange(index, "freeQuantity", e.target.value)}
                          error={freeQuantityError}
                          helperText={freeQuantityError ? freeQuantityErrorMessage : ""}
                        />
                      </Grid>
                      <Grid item flex={2}>
                        <TextField
                          fullWidth
                          disabled={!itemSelected}
                          label="Discount %"
                          name={`items[${index}].discount`}
                          value={formik.values.items[index].discount || ""}
                          onChange={(e) => handleValueChange(index, "discount", e.target.value)}
                          error={discountError}
                          helperText={discountError ? discountErrorMessage : ""}
                        />
                      </Grid>
                      <Grid item flex={2}>
                        <TextField
                          fullWidth
                          label="Total Cost"
                          disabled
                          value={formik.values.items[index].totalCost?.toLocaleString() || ""}
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
                        {(formik.values.items[index].packsRequired ?? 0) >
                          (formik.values.items[index].noOfPacks ?? 0) && (
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleCloneField(index)}
                          >
                            <ContentCopy fontSize={"small"} />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
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
                    onChange={formik.handleChange}
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
                {/* <Grid item lg={12} display={"flex"} justifyContent={"center"}>
                  <FormControlLabel
                    label="Partially Processed ?"
                    control={
                      <Checkbox
                        name="partialyProcessed"
                        value={formik.values.partialyProcessed}
                        checked={formik.values.partialyProcessed}
                        onChange={formik.handleChange}
                      />
                    }
                  />
                </Grid> */}
              </Grid>
              <Typography variant="subtitle1" color={"primary"} sx={{ mt: 2, mb: 2 }}>
                Invoice Upload
              </Typography>
              <Grid container spacing={2} marginBottom={2}>
                <Grid item xs={12}>
                  <FileUploadButton
                    acceptTypes="application/pdf"
                    maxFiles={5}
                    maxFileSizeinMB={10}
                    onUploadFiles={setFileUploadedUrl}
                    bucket={EBuckets.PharmacyInvoices}
                    documentType={EDocumentTypes.Invoice}
                    user={id}
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
                  disabled={
                    isEditingLoading ||
                    isUpdatingStockLoading ||
                    _.isEqual(initialValues, formik.values) ||
                    isAnyItemExceedsRequired ||
                    isAnyItemMissingBatchOrExpiry
                  }
                  sx={{ width: "fit-content" }}
                >
                  Update Pharmacy Stock
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

export default EditPurchaseOrderDraft;
