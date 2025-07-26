import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import {
  IDrugItem,
  IDrugVendor,
} from '../../../../types/pharmacyDashboard/master';
import { useToast } from '../../../../context/ToastContext';
import {
  useUpdatePartialPurchaseOrderMutation,
  useGetPurchaseOrderByIdQuery,
  useRejectPurchaseOrderByAdminMutation,
} from '../../../../services/pharmacyDashboardService/purchaseOrderApi';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import Delete from '@mui/icons-material/Delete';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import _ from 'lodash';
import FileUploadButton from '../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../types/global';
import { ContentCopy } from '@mui/icons-material';
import { useGetBatchesForStocksQuery } from '../../../../services/pharmacyDashboardService/stocksApi';
import FileList from '../../../../components/FileList/FileList';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';

interface EditPartiallyProcessedProps {
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
  partiallyProcessed?: boolean;
  files: string[];
  invoiceNumber: string;
}

const renderSkeleton = () => (
  <Box sx={{ width: '100%', mt: 2 }}>
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
    <Box
      display={'flex'}
      justifyContent={'flex-end'}
      alignItems={'center'}
      gap={2}
      mt={2}
    >
      <Skeleton variant="rectangular" width={90} height={40} />
      <Skeleton variant="rectangular" width={90} height={40} />
    </Box>
  </Box>
);

const EditPartiallyProcessedApprovalPending: React.FC<
  EditPartiallyProcessedProps
> = ({ openModal, onClose, id, drugItems, drugVendors }) => {
  const { showPromiseToast } = useToast();

  const { user } = useSelector((state: RootState) => ({
    user: state.auth.user,
  }));

  const isAdmin = user?.role === 'admin';

  const {
    data: purchaseOrderData,
    isLoading: isPurchaseOrderLoading,
    isFetching: isPurchaseOrderFetching,
  } = useGetPurchaseOrderByIdQuery(id);
  const purchaseOrder = purchaseOrderData?.data;
  const payloadForApproval = purchaseOrder?.payloadForApproval || null;

  const purchaseOrderLoading =
    isPurchaseOrderLoading || isPurchaseOrderFetching;

  // Store older response items
  const oldResponseItems =
    (purchaseOrder as any)?.responses?.flatMap((res: any) => res.items) || [];

  const [editPurchaseOrder, { isLoading: isEditingLoading }] =
    useUpdatePartialPurchaseOrderMutation();

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    let initialUrl: string[] = [];
    if (payloadForApproval?.files) {
      initialUrl = payloadForApproval.files.flat();
    }
    return initialUrl;
  });

  const initialValues: FormValues = {
    order_date: purchaseOrder?.date || null,
    vendor: purchaseOrder?.vendor || null,
    invoiceNumber:
      payloadForApproval?.invoiceNumber || purchaseOrder?.invoiceNumber || '',

    items:
      payloadForApproval?.items?.map((item: any): IItem => {
        const noOfPacks = item.noOfPacks ?? 0;
        const buyPrice = item.buyPrice ?? 0;
        const discount = item.discount ?? 0;

        // Calculate initial costs
        const itemCost = noOfPacks * buyPrice;
        const discountAmount = (itemCost * discount) / 100;
        const totalCostWithoutTax = itemCost - discountAmount;
        const taxAmount = (totalCostWithoutTax * (item.tax ?? 0)) / 100;

        return {
          item: drugItems.find(drug => drug._id === item.item) || null,
          packSize: item.packSize || null,
          noOfPacks: noOfPacks,
          packsRequired: item.packsRequired || noOfPacks,
          mrp: item.mrp || null,
          mrpPerPack: item.mrpPerPack || null,
          buyPrice: buyPrice,
          tax: item.tax || null,
          taxAmount: taxAmount,
          totalCost: totalCostWithoutTax,
          freeQuantity: item.freeQuantity || null,
          batchNo: item.batchNo || null,
          expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
          quantity: noOfPacks * (item.packSize ?? 0),
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
    otherCharges:
      payloadForApproval?.otherCharges ||
      purchaseOrder?.request.otherCharges ||
      0,

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

      return (
        (subTotal ?? 0) +
        (tax ?? 0) +
        (purchaseOrder?.request.otherCharges ?? 0)
      );
    })(),
    files: payloadForApproval?.files || [],
  };

  const formSubmit = async (values: FormValues) => {
    // Combine old response items with new items
    const combinedResponseItems = [
      ...oldResponseItems,
      ...values.items.map(item => ({
        item: item.item?._id,
        batchNo: item.batchNo,
        expiryDate: item.expiryDate,
        packSize: item.packSize,
        quantity: (item.packSize ?? 0) * (item.noOfPacks ?? 0),
        mrp: item.mrp,
        mrpPerPack: item.mrpPerPack,
        buyPrice: item.buyPrice,
        tax: item.tax,
        freeQuantity: item.freeQuantity,
        noOfPacks: item.noOfPacks,
        packsRequired: item.packsRequired,
        discount: item.discount,
      })),
    ];

    const payload = {
      id: id,
      date: purchaseOrder?.date,
      vendor: purchaseOrder?.vendor?._id,
      invoiceNumber: values.invoiceNumber,
      request: {
        items: values.items.map(item => ({
          item: item.item?._id,
          packSize: item.packSize,
          quantity: (item.packSize ?? 0) * (item.noOfPacks ?? 0),
          mrp: item.mrp,
          mrpPerPack: item.mrpPerPack,
          buyPrice: item.buyPrice,
          tax: item.tax,
          freeQuantity: item.freeQuantity,
          noOfPacks: item.noOfPacks,
          packsRequired: item.packsRequired,
          discount: item.discount,
        })),
        subTotal: values.subTotal,
        tax: values.tax,
        otherCharges: values.otherCharges,
        netAmount: values.netAmount,
      },
      response: {
        items: combinedResponseItems as any,
        subTotal: values.subTotal,
        tax: values.tax,
        otherCharges: values.otherCharges,
        netAmount: values.netAmount,
        invoice: fileUploadedUrl,
      },
    };

    const editPromise = editPurchaseOrder(payload).unwrap();
    showPromiseToast(editPromise, {
      loading: 'Updating Purchase Order',
      success: msg => msg || 'Purchase Order Updated Successfully',
      error: msg => msg || 'Error Updating Purchase Order',
    });

    try {
      await editPromise;
    } catch (error) {
      console.error('Error Updating purchase order', error);
      closeModal();
      return;
    }

    closeModal();
  };

  const {
    data: stocksData,
    isLoading: isStocksLoading,
    isFetching: isStocksFetching,
  } = useGetBatchesForStocksQuery();

  const stocksLoading = isStocksLoading || isStocksFetching;

  // purchase order rejection
  const [rejectPurchaseOrderByAdmin, { isLoading: isRejecting }] =
    useRejectPurchaseOrderByAdminMutation();

  const handleReject = async () => {
    const isPartial = true;

    const rejectPromise = rejectPurchaseOrderByAdmin({
      id,
      isPartial,
    }).unwrap();

    showPromiseToast(rejectPromise, {
      loading: 'Rejecting Purchase Order...',
      success: msg => msg || 'Purchase Order Rejected Successfully!',
      error: msg => msg || 'Error Rejecting Purchase Order.',
    });

    try {
      await rejectPromise;
      closeModal(); // Close the modal after the rejection is successful
    } catch (error) {
      console.error('Error Rejecting Purchase Order:', error);
      closeModal(); // Close the modal even if an error occurs
      return;
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: formSubmit,
    enableReinitialize: true,
  });

  const handleCloneField = (index: number) => {
    const currentItem = formik.values.items[index];
    const noOfPacks = currentItem.noOfPacks ?? 0;
    const packsRequired = currentItem.packsRequired ?? 0;

    formik.setFieldValue('items', [
      ...formik.values.items,
      {
        ...currentItem,
        batchNo: '',
        expiryDate: null,
        packsRequired: packsRequired - noOfPacks,
        noOfPacks: 0,
        freeQuantity: null, // Set freeQuantity to null for cloned item
        discount: null,
      },
    ]);
    updateCalculations();
  };

  const handleDeleteField = (index: number) => {
    const newFields = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue('items', newFields);
    updateCalculations();
  };

  const [currentBatchNumbers, setCurrentBatchNumbers] = React.useState<
    Record<string, string[]>
  >({});
  const [batchWarnings, setBatchWarnings] = React.useState<
    Record<number, string>
  >({});

  const handleValueChange = (
    index: number,
    field: keyof IItem,
    rawValue: any,
  ) => {
    let newItems: IItem[] = [...formik.values.items];
    let currentItem: IItem = newItems[index];

    // field === "buyPrice" ||
    // field === "mrpPerPack" ||
    // field === "discount" || // Ensure discount is treated as a number

    const numericValue =
      field === 'noOfPacks' || field === 'packSize' || field === 'freeQuantity'
        ? Number(rawValue.replace(/[^\d.-]/g, '')) || 0
        : rawValue;

    currentItem = { ...currentItem, [field]: numericValue };

    if (
      field === 'noOfPacks' ||
      field === 'packSize' ||
      field === 'buyPrice' ||
      field === 'discount'
    ) {
      const noOfPacks = currentItem.noOfPacks ?? 0;
      const packSize = currentItem.packSize ?? 0;
      const buyPrice = currentItem.buyPrice ?? 0;
      const tax = currentItem.tax ?? 0;
      const discount = currentItem.discount ?? 0; // Item-specific discount
      const quantity = noOfPacks * packSize;

      currentItem.quantity = quantity;
      currentItem.mrp = noOfPacks * (currentItem.mrpPerPack || 0);

      const itemCost = noOfPacks * buyPrice;
      const discountAmount = (itemCost * discount) / 100; // Calculate item-wise discount
      currentItem.totalCost =
        itemCost + (itemCost * tax) / 100 - discountAmount || 0; // Update totalCost considering item-wise discount
    }

    // Handle item change to update batch numbers
    if (field === 'item') {
      const selectedDrugItemId = numericValue?._id;
      const selectedDrugItem = stocksData?.data?.find(
        stock => stock.itemId === selectedDrugItemId,
      );

      // Update current batch numbers and reset batch number for the item
      setCurrentBatchNumbers(prev => ({
        ...prev,
        [selectedDrugItemId]: selectedDrugItem?.batchNumbers || [],
      }));
      currentItem.batchNo = null; // Reset batch number
      setBatchWarnings(prevWarnings => {
        const updatedWarnings = { ...prevWarnings };
        delete updatedWarnings[index]; // Clear any warnings for the current item
        return updatedWarnings;
      });
    }

    // Validate batch number if the field is 'batchNo'
    if (field === 'batchNo') {
      const batchNumbersForItem = currentItem.item?._id
        ? currentBatchNumbers[currentItem.item._id] || []
        : [];
      if (batchNumbersForItem.includes(numericValue)) {
        setBatchWarnings(prev => ({
          ...prev,
          [index]:
            'This batch number is already in use for the selected item, new price and expiry will be applied to all items in batch',
        }));
      } else {
        setBatchWarnings(prev => {
          const updatedWarnings = { ...prev };
          delete updatedWarnings[index]; // Clear warning if batch number is valid
          return updatedWarnings;
        });
      }
    }
    newItems[index] = currentItem;
    formik.setFieldValue('items', newItems);
    updateCalculations(); // Call the update calculations after changing item values
  };

  const updateCalculations = useCallback(() => {
    const totalCost = formik.values.items.reduce((acc, item) => {
      const itemTotalCost = Number(item.totalCost ?? 0);
      return acc + itemTotalCost;
    }, 0);

    const otherCharges = Number(formik.values.otherCharges ?? 0);
    const taxAmount = Number(formik.values.tax ?? 0); // Use the tax field directly
    const netAmount = totalCost + taxAmount + otherCharges; // Calculate netAmount as subtotal + tax + other charges

    formik.setFieldValue('subTotal', totalCost); // Set subtotal
    formik.setFieldValue('netAmount', netAmount); // Set net amount
  }, [
    formik.values.items,
    formik.values.tax,
    formik.values.otherCharges,
    formik.setFieldValue,
  ]);

  useEffect(() => {
    // Initialize batch numbers for all items when stocksData changes
    if (stocksData?.data) {
      const batchMap: Record<string, string[]> = {};
      stocksData.data.forEach(stock => {
        batchMap[stock.itemId] = stock.batchNumbers;
      });
      setCurrentBatchNumbers(batchMap);
    }

    // Ensure calculations are updated when items change
    updateCalculations();
  }, [stocksData, updateCalculations]);

  const getFieldErrorAndTouched = useCallback(
    (
      index: number,
      fieldName:
        | 'item'
        | 'noOfPacks'
        | 'packSize'
        | 'mrpPerPack'
        | 'buyPrice'
        | 'batchNo'
        | 'expiryDate'
        | 'freeQuantity'
        | 'discount',
    ) => {
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

  const closeModal = () => {
    formik.resetForm();
    onClose();
  };

  const isAnyItemExceedsRequired = formik.values.items.some(
    item => (item.noOfPacks ?? 0) > (item.packsRequired ?? 0),
  );

  const isAnyItemMissingBatchOrExpiry = formik.values.items.some(
    item => !item.batchNo || !item.expiryDate,
  );

  return (
    <Modal open={openModal} onClose={onClose}>
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
          Admin Approval
        </Typography>

        {purchaseOrderLoading || stocksLoading ? (
          renderSkeleton()
        ) : (
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
                  <TextField
                    label="Purchase Order Number"
                    value={purchaseOrder?.poNumber || ''}
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid item lg={2}>
                  <CustomDatePicker
                    label="Date"
                    value={formik.values.order_date}
                    onChange={value =>
                      formik.setFieldValue('order_date', value)
                    }
                    error={
                      formik.touched.order_date &&
                      Boolean(formik.errors.order_date)
                    }
                    helperText={
                      formik.touched.order_date && formik.errors.order_date
                    }
                  />
                </Grid>
                <Grid item lg={2}>
                  <FieldAutocomplete
                    options={drugVendors}
                    getOptionLabel={option => {
                      return option?.name;
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    value={formik.values.vendor}
                    onChange={newValue => {
                      formik.setFieldValue('vendor', newValue);
                    }}
                    label="Vendor"
                    error={
                      formik.touched.vendor && Boolean(formik.errors.vendor)
                    }
                    helperText={formik.touched.vendor && formik.errors.vendor}
                    disabled
                  />
                </Grid>
                <Grid item lg={2}>
                  <TextField
                    label="Supplier Name"
                    value={formik.values.vendor?.contact?.person || ''}
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid item lg={2}>
                  <TextField
                    label="Supplier Email"
                    value={formik.values.vendor?.contact?.email || ''}
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid item lg={2}>
                  <TextField
                    label="Invoice Number"
                    value={formik.values.invoiceNumber || ''}
                    fullWidth
                    onChange={formik.handleChange}
                    name="invoiceNumber"
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
                  isError: isNoOfPacksError,
                  errorMessage: noOfPacksErrorMessage,
                } = getFieldErrorAndTouched(index, 'noOfPacks');
                const {
                  isError: isPackSizeError,
                  errorMessage: packSizeErrorMessage,
                } = getFieldErrorAndTouched(index, 'packSize');
                const {
                  isError: isMrpPerPackError,
                  errorMessage: mrpPerPackErrorMessage,
                } = getFieldErrorAndTouched(index, 'mrpPerPack');
                const {
                  isError: buyPriceError,
                  errorMessage: buyPriceErrorMessage,
                } = getFieldErrorAndTouched(index, 'buyPrice');
                const {
                  isError: batchNoError,
                  errorMessage: batchNoErrorMessage,
                } = getFieldErrorAndTouched(index, 'batchNo');
                const {
                  isError: expiryDateError,
                  errorMessage: expiryDateErrorMessage,
                } = getFieldErrorAndTouched(index, 'expiryDate');
                const {
                  isError: freeQuantityError,
                  errorMessage: freeQuantityErrorMessage,
                } = getFieldErrorAndTouched(index, 'freeQuantity');
                const {
                  isError: discountError,
                  errorMessage: discountErrorMessage,
                } = getFieldErrorAndTouched(index, 'discount');

                const onlyOneItem = formik.values.items.length === 1;

                const itemSelected =
                  formik.values.items[index].item?.name || '';

                return (
                  <Grid container gap={1} key={index} mt={2}>
                    <Grid item flex={4}>
                      <FieldAutocomplete
                        options={drugItems}
                        getOptionLabel={option => option?.name}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        value={formik.values.items[index].item}
                        onChange={newValue =>
                          handleValueChange(index, 'item', newValue)
                        }
                        label="Item"
                        error={isItemError}
                        helperText={isItemError ? itemErrorMessage : ''}
                        disabled // disable the field as required
                      />
                    </Grid>
                    <Grid item flex={1}>
                      <TextField
                        fullWidth
                        label="No Of Packs"
                        disabled={!itemSelected}
                        name={`items[${index}].noOfPacks`}
                        value={formik.values.items[index].noOfPacks || ''}
                        onChange={e =>
                          handleValueChange(index, 'noOfPacks', e.target.value)
                        }
                        error={isNoOfPacksError}
                        helperText={
                          isNoOfPacksError ? noOfPacksErrorMessage : ''
                        }
                      />
                    </Grid>
                    <Grid item flex={1}>
                      <TextField
                        fullWidth
                        disabled={!itemSelected}
                        label="Pack Size"
                        name={`items[${index}].packSize`}
                        value={formik.values.items[index].packSize || ''}
                        onChange={e =>
                          handleValueChange(index, 'packSize', e.target.value)
                        }
                        error={isPackSizeError}
                        helperText={isPackSizeError ? packSizeErrorMessage : ''}
                      />
                    </Grid>
                    <Grid item flex={1}>
                      <TextField
                        fullWidth
                        disabled={!itemSelected}
                        label="MRP"
                        name={`items[${index}].mrpPerPack`}
                        value={formik.values.items[index].mrpPerPack || ''}
                        onChange={e =>
                          handleValueChange(index, 'mrpPerPack', e.target.value)
                        }
                        error={isMrpPerPackError}
                        helperText={
                          isMrpPerPackError ? mrpPerPackErrorMessage : ''
                        }
                      />
                    </Grid>
                    <Grid item flex={1}>
                      <TextField
                        fullWidth
                        disabled={!itemSelected}
                        label="Cost"
                        name={`items[${index}].buyPrice`}
                        value={
                          formik.values.items[
                            index
                          ].buyPrice?.toLocaleString() || ''
                        }
                        onChange={e =>
                          handleValueChange(index, 'buyPrice', e.target.value)
                        }
                        error={buyPriceError}
                        helperText={buyPriceError ? buyPriceErrorMessage : ''}
                      />
                    </Grid>
                    <Grid item flex={1}>
                      <TextField
                        fullWidth
                        label="Tax"
                        disabled
                        name={`items[${index}].tax`}
                        value={
                          formik.values.items[index].tax?.toLocaleString() || ''
                        }
                      />
                    </Grid>
                    <Grid item flex={1.5}>
                      <TextField
                        fullWidth
                        label="Batch No"
                        name={`items[${index}].batchNo`}
                        value={formik.values.items[index].batchNo || ''}
                        error={!!batchWarnings[index] || batchNoError}
                        helperText={
                          batchWarnings[index]
                            ? batchWarnings[index] // Show the batch warning if present
                            : batchNoError
                              ? batchNoErrorMessage // Show validation error if present
                              : ''
                        }
                        onChange={e =>
                          handleValueChange(index, 'batchNo', e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item flex={2}>
                      <CustomDatePicker
                        minDate={new Date()}
                        label="Expiry Date"
                        value={formik.values.items[index].expiryDate || null}
                        error={expiryDateError}
                        helperText={
                          expiryDateError ? expiryDateErrorMessage : ''
                        }
                        onChange={value =>
                          formik.setFieldValue(
                            `items[${index}].expiryDate`,
                            value,
                          )
                        }
                      />
                    </Grid>
                    <Grid item flex={1}>
                      <TextField
                        fullWidth
                        disabled={!itemSelected}
                        label="Free Quantity"
                        name={`items[${index}].freeQuantity`}
                        value={formik.values.items[index].freeQuantity || ''}
                        onChange={e =>
                          handleValueChange(
                            index,
                            'freeQuantity',
                            e.target.value,
                          )
                        }
                        error={freeQuantityError}
                        helperText={
                          freeQuantityError ? freeQuantityErrorMessage : ''
                        }
                      />
                    </Grid>
                    <Grid item flex={1}>
                      <TextField
                        fullWidth
                        disabled={!itemSelected}
                        label="Discount %"
                        name={`items[${index}].discount`}
                        value={formik.values.items[index].discount || ''}
                        onChange={e =>
                          handleValueChange(index, 'discount', e.target.value)
                        }
                        error={discountError}
                        helperText={discountError ? discountErrorMessage : ''}
                      />
                    </Grid>
                    <Grid item flex={2}>
                      <TextField
                        fullWidth
                        label="Total Cost"
                        disabled
                        value={
                          formik.values.items[
                            index
                          ].totalCost?.toLocaleString() || ''
                        }
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
                          onClick={() => handleDeleteField(index)}
                        >
                          <Delete fontSize={'small'} />
                        </IconButton>
                      )}
                      {(formik.values.items[index].packsRequired ?? 0) >
                        (formik.values.items[index].noOfPacks ?? 0) && (
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleCloneField(index)}
                        >
                          <ContentCopy fontSize={'small'} />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                );
              })}
              <Typography
                variant="subtitle1"
                color={'primary'}
                mt={2}
                gutterBottom
              >
                Summary
              </Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item lg={3}>
                  <TextField
                    fullWidth
                    label="Sub Total"
                    disabled
                    value={formik.values.subTotal?.toLocaleString() || ''}
                  />
                </Grid>
                <Grid item lg={2}>
                  <TextField
                    fullWidth
                    label="Tax"
                    disabled
                    value={formik.values.tax?.toLocaleString() || ''}
                  />
                </Grid>

                <Grid item lg={2}>
                  <TextField
                    fullWidth
                    label="Other Charges"
                    value={formik.values.otherCharges?.toLocaleString() || ''}
                    onChange={formik.handleChange}
                    name="otherCharges"
                  />
                </Grid>
                <Grid item lg={3}>
                  <TextField
                    fullWidth
                    label="Net Amount"
                    disabled
                    value={formik.values.netAmount?.toLocaleString() || ''}
                  />
                </Grid>
              </Grid>
              <Typography
                variant="subtitle1"
                color={'primary'}
                sx={{ mt: 2, mb: 2 }}
              >
                Invoice Upload
              </Typography>
              <Grid container spacing={2} marginBottom={2}>
                <Grid item xs={12}>
                  <FileUploadButton
                    showSubmitHint={true}
                    acceptTypes="application/pdf"
                    maxFiles={5}
                    maxFileSizeinMB={10}
                    // onUploadFiles={setFileUploadedUrl}
                    onUploadFiles={files => {
                      const existingFiles = payloadForApproval?.files || [];
                      const updatedFiles = [
                        ...existingFiles,
                        ...fileUploadedUrl,
                        ...files,
                      ]; // Combine existing files, already uploaded files, and new files
                      const uniqueFiles = [...new Set(updatedFiles)];
                      setFileUploadedUrl(uniqueFiles);
                    }}
                    bucket={EBuckets.PharmacyInvoices}
                    documentType={EDocumentTypes.Invoice}
                    user={id}
                    // reportId={openEditDialog.id}
                  />
                </Grid>
                <Grid item xs={12}>
                  {payloadForApproval?.files && (
                    <FileList
                      files={payloadForApproval?.files || []}
                      title="Uploaded Files"
                      bucket={EBuckets.PharmacyInvoices}
                      documentType={EDocumentTypes.Invoice}
                    />
                  )}
                </Grid>
              </Grid>
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
                  disabled={
                    isEditingLoading ||
                    isAnyItemExceedsRequired ||
                    isAnyItemMissingBatchOrExpiry ||
                    !isAdmin
                  }
                  sx={{ width: 'fit-content' }}
                >
                  Approve Purchase Order
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ width: 'fit-content' }}
                  onClick={handleReject}
                  disabled={!isAdmin || isRejecting}
                >
                  Reject
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
        )}
      </Box>
    </Modal>
  );
};

export default EditPartiallyProcessedApprovalPending;
