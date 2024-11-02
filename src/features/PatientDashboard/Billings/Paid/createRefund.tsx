import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import {
  useGetBillingByIdQuery,
  useAddRefundMutation,
} from '../../../../services/patientDashboardService/billings/billingApi';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';
import { useToast } from '../../../../context/ToastContext';
import FileUploadButton from '../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../types/global';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';

interface CreateRefundProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IBillingItem {
  serviceId: string;
  serviceName: string;
  batchNo: string;
  quantity: number;
  price: number;
  category: string; // Added category to distinguish item types
}

interface RefundItem {
  item: IBillingItem | null;
  batchNo: string;
  qtyToRefund: number;
  amountToRefund: number;
  discount: number;
}

const CreateRefund: React.FC<CreateRefundProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { data, isLoading } = useGetBillingByIdQuery(id);
  const billing = data?.data;

  const { patient } = useSelector((state: RootState) => state.patients);

  const { showPromiseToast } = useToast();

  const [refundItems, setRefundItems] = useState<RefundItem[]>([
    { item: null, batchNo: '', qtyToRefund: 0, amountToRefund: 0, discount: 0 },
  ]);
  const [refundDetails, setRefundDetails] = useState({
    mode: '',
    details: '',
    reason: '',
    charges: '',
    refundNumber: '',
    files: [] as string[],
  });

  const [addRefund, { isLoading: isAddingRefund }] = useAddRefundMutation();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const addRefundItem = () => {
    setRefundItems([
      ...refundItems,
      {
        item: null,
        batchNo: '',
        qtyToRefund: 0,
        amountToRefund: 0,
        discount: 0,
      },
    ]);
  };

  const deleteRefundItem = (index: number) => {
    const updatedRefundItems = refundItems.filter((_, i) => i !== index);
    setRefundItems(updatedRefundItems);
  };

  const handleItemChange = (
    index: number,
    selectedItem: IBillingItem | null,
  ) => {
    const updatedRefundItems = [...refundItems];

    if (selectedItem) {
      const totalPrice =
        billing?.items.reduce((acc, item) => acc + item.price, 0) || 0;
      const discountPerItem = billing?.discount
        ? (billing.discount * selectedItem.price) / totalPrice
        : 0;

      updatedRefundItems[index] = {
        ...updatedRefundItems[index],
        item: selectedItem,
        batchNo: '',
        qtyToRefund: 0,
        amountToRefund: 0,
        discount: discountPerItem, // Set the calculated discount
      };
    } else {
      updatedRefundItems[index] = {
        ...updatedRefundItems[index],
        item: null,
        batchNo: '',
        qtyToRefund: 0,
        amountToRefund: 0,
        discount: 0, // Reset discount if no item selected
      };
    }

    setRefundItems(updatedRefundItems);
  };

  const getFilteredItems = (index: any) => {
    const selectedServiceIds = refundItems
      .filter((_, i) => i !== index)
      .map(item => item.item?.serviceId)
      .filter(id => id);

    return (
      billing?.items.filter(
        item => !selectedServiceIds.includes(item.serviceId),
      ) || []
    );
  };

  const handleBatchChange = (index: number, batchNo: string) => {
    const updatedRefundItems = [...refundItems];
    updatedRefundItems[index].batchNo = batchNo;
    setRefundItems(updatedRefundItems);
  };

  const handleQtyChange = (index: number, qtyToRefund: number) => {
    const updatedRefundItems = [...refundItems];

    if (updatedRefundItems[index].item) {
      const pricePerItem =
        updatedRefundItems[index].item!.price /
        updatedRefundItems[index].item!.quantity;
      const totalDiscount =
        qtyToRefund *
        (updatedRefundItems[index].discount /
          updatedRefundItems[index].item!.quantity);
      const amountToRefund = qtyToRefund * pricePerItem - totalDiscount;

      updatedRefundItems[index] = {
        ...updatedRefundItems[index],
        qtyToRefund,
        amountToRefund: Math.round(amountToRefund * 100) / 100, // Round to 2 decimal places
      };
    }

    setRefundItems(updatedRefundItems);
  };

  // const handleFieldChange = (index: number, field: string, value: any) => {
  //   const updatedRefundItems = [...refundItems];
  //   updatedRefundItems[index] = {
  //     ...updatedRefundItems[index],
  //     [field]: value,
  //   };
  //   setRefundItems(updatedRefundItems);
  // };

  const handleRefundDetailChange = (field: string, value: any) => {
    let validatedValue = value;

    if (field === 'charges') {
      validatedValue = Math.min(parseFloat(value), calculateTotalRefund());
    }

    setRefundDetails({ ...refundDetails, [field]: validatedValue });
  };

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return 'N/A';
    const date =
      typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const cardStyle = {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    border: '1px solid #E0E0E0',
    position: 'relative',
    padding: '16px',
    borderRadius: '4px',
    height: '100px',
    marginBottom: '16px',
  };

  const calculateTotalRefund = () => {
    return refundItems.reduce((acc, item) => acc + item.amountToRefund, 0);
  };

  const getBatchOptions = (item: IBillingItem | null) => {
    if (!item || billing?.billType !== 'Pharmacy' || !billing?.pharmacyData)
      return [];
    const pharmacyItem = billing?.pharmacyData.find(
      (pharmacy: any) => pharmacy._id === item.serviceId,
    );
    return pharmacyItem && pharmacyItem.item
      ? pharmacyItem.item.map((detail: any) => detail.batchNumber)
      : [];
  };

  const totalRefund = calculateTotalRefund();
  const netAmount = Math.max(
    0,
    totalRefund - (parseFloat(refundDetails.charges) || 0),
  );

  const handleProcessRefund = async () => {
    if (!billing) return;

    const pharmacyItems = refundItems
      .filter(item => billing.billType === 'Pharmacy' && item.item)
      .map(item => {
        const pharmacyItem = billing.pharmacyData.find(
          (pharmacy: any) => pharmacy._id === item.item?.serviceId,
        );

        const billingItem = billing.items.find(
          billingItem => billingItem.serviceId === item.item?.serviceId,
        );

        return {
          item: {
            stock: pharmacyItem?.item?.stock,
            details: pharmacyItem?.item,
            _id: billingItem?.serviceId,
          },
          details: pharmacyItem?.item.map((detail: any) => ({
            batchNumber: detail.batchNumber,
            location: detail.location,
            quantity: item.qtyToRefund,
            expiryDate: detail.expiryDate,
            vendor: detail.vendor,
            packSize: detail.packSize,
            itemId: detail.itemId,
          })),
        };
      });

    const refundData = {
      billingId: billing.billingId,
      patientId: patient?._id,
      refundAmount: netAmount,
      refundDetails: {
        method: refundDetails.mode,
        reason: refundDetails.reason,
        details: refundDetails.details,
        charges: parseFloat(refundDetails.charges) || 0,
        items: refundItems.map(item => ({
          serviceName: item.item?.serviceName,
          itemName: item.item?.serviceName,
          batchNo: item.batchNo,
          qtyToRefund: item.qtyToRefund,
          amountToRefund: item.amountToRefund,
          itemId: (
            billing.items.find(
              billingItem => billingItem.serviceId === item.item?.serviceId,
            ) as unknown as { _id: string }
          )?._id,
        })),
        refundNumber: refundDetails.refundNumber,
        files: refundDetails.files,
      },
      pharmacyData: billing.billType === 'Pharmacy' ? pharmacyItems : undefined,
    };

    const promise = addRefund(refundData).unwrap();

    showPromiseToast(promise, {
      loading: 'Processing Refund...',
      success: response => response.message || 'Refund processed successfully',
      error: err =>
        `Failed to process refund: ${err.response?.data?.message || err.message}`,
    });

    try {
      await promise;
      onClose();
    } catch (error) {
      console.error('Refund processing failed:', error);
    }
  };

  const validateForm = () => {
    const refundDetailsValid = refundDetails.mode && refundDetails.reason;

    const refundItemsValid = refundItems.every(item => {
      if (!item.item || item.qtyToRefund <= 0 || item.amountToRefund <= 0)
        return false;
      if (billing?.billType === 'Pharmacy' && !item.batchNo) return false;
      return true;
    });

    setIsSubmitDisabled(!(refundDetailsValid && refundItemsValid));
  };

  useEffect(() => {
    validateForm();
  }, [refundItems, refundDetails]);

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Create Refund</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ ...cardStyle }}>
            <Skeleton width="100%" height={100} />
          </Box>
        ) : (
          <Box sx={{ ...cardStyle }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  component="div"
                >
                  <strong>Bill No:</strong> {billing?.billingId}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  component="div"
                >
                  <strong>Category:</strong> {billing?.billType || 'Service'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  component="div"
                >
                  <strong>Billing Date:</strong>{' '}
                  {formatDate(billing?.createdAt || '')}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  component="div"
                >
                  <strong>Total Amount:</strong> Rs.{billing?.totalPaid}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  component="div"
                >
                  <strong>Patient ID:</strong> {billing?.patientCode}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        <Box>
          {refundItems.map((refundItem, index) => (
            <Grid container spacing={2} mt={2} key={index}>
              <Grid item xs={3}>
                <FieldAutocomplete
                  label="Item"
                  options={getFilteredItems(index)}
                  isOptionEqualToValue={(option, value) =>
                    option.serviceId === value.serviceId
                  }
                  getOptionLabel={option => option.serviceName}
                  value={refundItem.item}
                  onChange={value => handleItemChange(index, value)}
                />
              </Grid>
              {billing?.billType === 'Pharmacy' && (
                <Grid item xs={2}>
                  <FieldAutocomplete
                    label="Batch No"
                    options={getBatchOptions(refundItem.item)}
                    isOptionEqualToValue={(option, value) => option === value}
                    getOptionLabel={option => option}
                    value={refundItem.batchNo}
                    onChange={value => handleBatchChange(index, value)}
                    disabled={!refundItem.item}
                  />
                </Grid>
              )}
              <Grid item xs={billing?.billType === 'Pharmacy' ? 2 : 3}>
                <TextField
                  fullWidth
                  label="Quantity"
                  value={refundItem.item?.quantity || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={billing?.billType === 'Pharmacy' ? 2 : 3}>
                <TextField
                  fullWidth
                  label="Amount"
                  value={refundItem.item?.price || ''}
                  disabled={!refundItem.item}
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  fullWidth
                  label="Qty to refund"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0, max: refundItem.item?.quantity || 0 },
                  }}
                  value={refundItem.qtyToRefund}
                  disabled={!refundItem.item}
                  onChange={e =>
                    handleQtyChange(index, parseInt(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  fullWidth
                  label="Total Discount"
                  value={refundItem.discount}
                  disabled
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  fullWidth
                  label="Amount to refund"
                  value={refundItem.amountToRefund}
                  disabled
                />
              </Grid>
              <Grid
                item
                xs={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {refundItems.length > 1 && (
                  <IconButton
                    onClick={() => deleteRefundItem(index)}
                    color="secondary"
                  >
                    <Delete />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
        </Box>

        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addRefundItem}
            disabled={isLoading || isAddingRefund}
          >
            Add Item
          </Button>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          {isLoading ? (
            <Skeleton width="100%" height={30} />
          ) : (
            <>
              <Typography variant="subtitle2" component="div">
                <strong>Total Amount:</strong> Rs.{totalRefund}
              </Typography>
              <TextField
                label="Charges"
                value={refundDetails.charges}
                onChange={e =>
                  handleRefundDetailChange(
                    'charges',
                    parseFloat(e.target.value),
                  )
                }
                InputProps={{ inputProps: { min: 0, max: totalRefund } }}
              />
              <Typography variant="subtitle2" component="div">
                <strong>Net Amount:</strong> Rs.{netAmount}
              </Typography>
            </>
          )}
        </Box>

        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                select
                label="Mode of Refund"
                value={refundDetails.mode}
                onChange={e => handleRefundDetailChange('mode', e.target.value)}
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="CreditCard">Credit Card</MenuItem>
                <MenuItem value="BankTransfer">Bank Transfer</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Details"
                value={refundDetails.details}
                onChange={e =>
                  handleRefundDetailChange('details', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Reason for Refund"
                value={refundDetails.reason}
                onChange={e =>
                  handleRefundDetailChange('reason', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Refund Invoice No"
                value={refundDetails.refundNumber}
                onChange={e =>
                  handleRefundDetailChange('refundNumber', e.target.value)
                }
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color={'primary'}
                sx={{ mt: 2, mb: 2 }}
              >
                Invoice Upload
              </Typography>
              <FileUploadButton
                acceptTypes="application/pdf"
                maxFiles={5}
                maxFileSizeinMB={10}
                onUploadFiles={files =>
                  setRefundDetails({ ...refundDetails, files })
                }
                bucket={EBuckets.PharmacyInvoices}
                documentType={EDocumentTypes.Invoice}
                user={id}
              />
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="center" mt={3}>
          {isLoading || isAddingRefund ? (
            <Skeleton width={200} height={50} />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleProcessRefund}
              disabled={isSubmitDisabled}
            >
              Process Refund
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRefund;
