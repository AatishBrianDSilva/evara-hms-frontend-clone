import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Skeleton,
} from '@mui/material';
import { useGetBillingByIdQuery } from '../../../../services/patientDashboardService/billings/billingApi';
import { formatToIndianCurrencyFormat } from '../../../../utils/formatToIndianCurrencyFormat';

const SkeletonLoader = () => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Skeleton variant="text" width="50%" height={40} />
    </Grid>
    {Array.from(new Array(5)).map((_, index) => (
      <React.Fragment key={index}>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" width="100%" height={118} />
        </Grid>
        <Divider />
      </React.Fragment>
    ))}
    <Grid item xs={12}>
      <Skeleton variant="text" width="30%" height={40} />
    </Grid>
    <Grid item xs={12}>
      <Skeleton variant="text" width="30%" height={40} />
    </Grid>
  </Grid>
);

interface EditPendingProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

const EditPending: React.FC<EditPendingProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { data, isLoading } = useGetBillingByIdQuery(id);
  const billing = data?.data;

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isLoading ? (
          <Skeleton width="40%" height={48} />
        ) : (
          `Invoice #${billing?.billingId}`
        )}
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          SkeletonLoader()
        ) : (
          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
            <Typography variant="h6">Patient Code: {billing?.patientCode}</Typography>
          </Grid> */}
            <Grid item xs={12}>
              <List>
                {billing?.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`${item.serviceName} - ${item.quantity} x ${formatToIndianCurrencyFormat(item.price)}`}
                        secondary={`Type: ${item.serviceType}`}
                      />
                      <Typography variant="body2">
                        {formatToIndianCurrencyFormat(item.total)}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                <ListItem>
                  <ListItemText primary="Subtotal" />
                  <Typography variant="subtitle1">
                    {formatToIndianCurrencyFormat(billing?.amount || 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Tax" />
                  <Typography variant="subtitle1">
                    {formatToIndianCurrencyFormat(billing?.tax || 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Discount" />
                  <Typography variant="subtitle1">
                    {formatToIndianCurrencyFormat(billing?.discount || 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Grand Total" />
                  <Typography variant="subtitle1" color="primary">
                    {formatToIndianCurrencyFormat(billing?.grandTotal || 0)}
                  </Typography>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPending;
