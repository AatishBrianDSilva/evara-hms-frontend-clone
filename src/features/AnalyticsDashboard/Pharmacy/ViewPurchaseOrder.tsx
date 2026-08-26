import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import React from 'react';
import { useGetPurchaseOrderByIdQuery } from '../../../services/pharmacyDashboardService/purchaseOrderApi';
import { IPurchaseOrder } from '../../../types/pharmacyDashboard/purchaseOrder';
import FileList from '../../../components/FileList/FileList';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';

interface ViewPurchaseOrderProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

const PurchaseOrderSkeleton = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      <Skeleton width="40%" />
    </Typography>
    {[...Array(3)].map((_, index) => (
      <Skeleton key={index} height={30} style={{ marginBottom: 6 }} />
    ))}
    <Divider sx={{ my: 2 }} />

    <Typography variant="h6" gutterBottom>
      <Skeleton width="60%" />
    </Typography>
    <Grid container spacing={2}>
      {[...Array(2)].map((_, index) => (
        <Grid item xs={6} key={index}>
          {[...Array(4)].map((_, subIndex) => (
            <Skeleton key={subIndex} height={30} style={{ marginBottom: 6 }} />
          ))}
        </Grid>
      ))}
    </Grid>
    <Divider sx={{ my: 2 }} />

    <Typography variant="h6" gutterBottom>
      <Skeleton width="50%" />
    </Typography>
    {[...Array(5)].map((_, index) => (
      <Grid container key={index} spacing={2}>
        {[...Array(3)].map((_, subIndex) => (
          <Grid item xs={4} key={subIndex}>
            <Skeleton height={30} style={{ marginBottom: 6 }} />
          </Grid>
        ))}
        <Divider sx={{ my: 1, width: '100%' }} />
      </Grid>
    ))}
  </Box>
);

const formatCurrency = (value?: number | null) =>
  formatToIndianCurrencyFormat(value || 0);

const formatDate = (value?: string | Date | null) =>
  value ? new Date(value).toLocaleDateString('en-GB') : '—';

const PurchaseOrderDetails: React.FC<{ purchaseOrder: IPurchaseOrder }> = ({
  purchaseOrder,
}) => {
  const responses = Array.isArray(purchaseOrder.responses)
    ? purchaseOrder.responses
    : [];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Vendor Information
      </Typography>
      <Typography>
        {purchaseOrder.vendor?.name} ({purchaseOrder.vendor?.code})
      </Typography>
      <Typography>
        {purchaseOrder.vendor?.contact?.person} -{' '}
        {purchaseOrder.vendor?.contact?.phone}
      </Typography>
      <Typography>
        {purchaseOrder.vendor?.address?.addressLine1},{' '}
        {purchaseOrder.vendor?.address?.city}
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Purchase Order Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>PO Number: {purchaseOrder.poNumber}</Typography>
          <Typography>Date: {formatDate(purchaseOrder.date)}</Typography>
          <Typography>Status: {purchaseOrder.status}</Typography>
          {purchaseOrder.invoiceNumber && (
            <Typography>
              Invoice Number (PO): {purchaseOrder.invoiceNumber}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          <Typography>
            Net Amount: {formatCurrency(purchaseOrder.allResponsesNetAmount)}
          </Typography>
          <Typography>
            Other Charges: {formatCurrency(purchaseOrder.request?.otherCharges)}
          </Typography>
          <Typography>
            Sub Total: {formatCurrency(purchaseOrder.allResponsesSubTotal)}
          </Typography>
          <Typography>
            Tax: {formatCurrency(purchaseOrder.allResponsesTax)}
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Requested Items
      </Typography>
      {(purchaseOrder.request?.items || []).map((item, index) => (
        <Grid container key={`request-${index}`} spacing={2}>
          <Grid item xs={4}>
            <Typography>Name: {item?.item?.name || '—'}</Typography>
            <Typography>Pack Size: {item?.packSize ?? '—'}</Typography>
            <Typography>Quantity: {item?.quantity ?? '—'}</Typography>
            <Typography>MRP: {formatCurrency(item?.mrp)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Buy Price: {formatCurrency(item?.buyPrice)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Tax: {item?.tax ?? '—'}%</Typography>
          </Grid>
          <Divider sx={{ my: 1, width: '100%' }} />
        </Grid>
      ))}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Vendor Bill Details
      </Typography>
      {responses.length === 0 ? (
        <Typography color="text.secondary">
          No vendor bill / GRN responses recorded for this PO yet.
        </Typography>
      ) : (
        responses.map((response: any, responseIndex: number) => (
          <Box key={response._id || responseIndex} mb={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Bill / Receipt {responseIndex + 1}
              {response.status ? ` (${response.status})` : ''}
            </Typography>
            <Grid container spacing={2} mb={1}>
              <Grid item xs={12} md={4}>
                <Typography>
                  Invoice Number: {response.invoiceNumber || '—'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>
                  Net Amount: {formatCurrency(response.netAmount)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>
                  Tax: {formatCurrency(response.tax)} · Other:{' '}
                  {formatCurrency(response.otherCharges)}
                </Typography>
              </Grid>
            </Grid>

            {Array.isArray(response.invoice) && response.invoice.length > 0 && (
              <Box mb={2}>
                <FileList
                  files={response.invoice}
                  title="Invoice Attachments"
                />
              </Box>
            )}

            {(response.items || []).map((item: any, itemIndex: number) => (
              <Grid
                container
                key={`${response._id || responseIndex}-item-${itemIndex}`}
                spacing={2}
              >
                <Grid item xs={4}>
                  <Typography>Name: {item?.item?.name || '—'}</Typography>
                  <Typography>Batch: {item?.batchNo || '—'}</Typography>
                  <Typography>
                    Expiry: {formatDate(item?.expiryDate)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>
                    Packs: {item?.noOfPacks ?? '—'} · Qty:{' '}
                    {item?.quantity ?? '—'}
                  </Typography>
                  <Typography>Free Qty: {item?.freeQuantity ?? '—'}</Typography>
                  <Typography>Pack Size: {item?.packSize ?? '—'}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>
                    Buy Price: {formatCurrency(item?.buyPrice)}
                  </Typography>
                  <Typography>MRP: {formatCurrency(item?.mrp)}</Typography>
                  <Typography>
                    Discount: {item?.discount ?? 0}% · Tax: {item?.tax ?? 0}%
                  </Typography>
                </Grid>
                <Divider sx={{ my: 1, width: '100%' }} />
              </Grid>
            ))}
            {responseIndex < responses.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))
      )}
    </Box>
  );
};

const ViewPurchaseOrder: React.FC<ViewPurchaseOrderProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const {
    data: purchaseOrderData,
    isLoading: isPurchaseOrderLoading,
    isFetching: isPurchaseorderFetching,
  } = useGetPurchaseOrderByIdQuery(id, { skip: !id || !openModal });
  const purchaseOrder = purchaseOrderData?.data;
  const purchaseOrderLoading =
    isPurchaseOrderLoading || isPurchaseorderFetching;

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle color={'primary'}>Purchase Order</DialogTitle>
      <DialogContent>
        {purchaseOrderLoading || !purchaseOrder ? (
          <PurchaseOrderSkeleton />
        ) : (
          <PurchaseOrderDetails purchaseOrder={purchaseOrder} />
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewPurchaseOrder;
