import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import { useGetEstimationByIdQuery } from '../../../../services/patientDashboardService/billings/estimationApi';

interface EditEstimationProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

const EditEstimation: React.FC<EditEstimationProps> = ({
  openModal,
  onClose,
  id,
}) => {
  console.log('Passed id', id);

  const { data } = useGetEstimationByIdQuery(id);

  const estimation = data?.data;
  console.log('Estimation', estimation);

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Estimation</DialogTitle>
      <DialogContent>
        <form>
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
          >
            <Grid item xs={3}>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                value={data?.data?.serviceName || ''}
                disabled
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                margin="normal"
                label="Status"
                value={data?.status || ''}
                disabled
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                margin="normal"
                label="Quantity"
                // value={quantity}
                // onChange={handleQuantityChange}
                required
              />
            </Grid>
            {/* <Grid item xs={3}>
              <TextField
                fullWidth
                margin="normal"
                label="Estimated Price"
                value={data?.estimatedPrice || ""}
                disabled
              />
            </Grid> */}
            {/* <Grid item xs={3}>
              <TextField
                fullWidth
                margin="normal"
                label="Estimated Total"
                value={data?.estimatedTotal || ""}
                disabled
              />
            </Grid> */}
            <Grid
              item
              xs={12}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                // onClick={handleEdit}
                // disabled={isEditing}
              >
                Save
              </Button>
              <Button
                onClick={onClose}
                variant="contained"
                color="secondary"
                style={{ marginLeft: '8px' }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEstimation;
