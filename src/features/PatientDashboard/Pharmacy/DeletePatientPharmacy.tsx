import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useDeletePatientPharmacyMutation } from '../../../services/patientDashboardService/patientPharmacyApi';
import { useToast } from '../../../context/ToastContext';

interface DeletePatientPharmacyProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
  name: string;
  quantity: number;
}

const DeletePatientPharmacy: React.FC<DeletePatientPharmacyProps> = ({
  openModal,
  onClose,
  id,
  name,
  quantity,
}) => {
  const [deletePatientPharmacy, { isLoading: deletingPatientPharmacy }] =
    useDeletePatientPharmacyMutation();

  const { showPromiseToast } = useToast();

  const handleDelete = async () => {
    const promise = deletePatientPharmacy(id).unwrap();
    showPromiseToast(promise, {
      loading: 'Deleting Pharmacy Order...',
      success: () => 'Pharmacy Order deleted successfully',
      error: err => err || 'Error Deleting Pharmacy Order',
    });

    try {
      await promise;
      onClose();
    } catch (error) {
      console.error('Error deleting treatmentCycle', error);
    }
  };

  return (
    <Dialog open={openModal} onClose={onClose}>
      <DialogTitle color="primary">Delete Pharmacy Order</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete <strong>{name}</strong> with quantity
          of <strong>{quantity}</strong>? This action cannot be undone.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The pharmacy order will be deleted from the system and the stock will
          be updated.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={handleDelete}
          disabled={deletingPatientPharmacy}
        >
          Delete
        </Button>
        <Button
          color="primary"
          onClick={onClose}
          disabled={deletingPatientPharmacy}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePatientPharmacy;
