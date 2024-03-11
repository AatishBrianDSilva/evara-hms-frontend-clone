import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    text: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ open, onClose, onConfirm, text }) => {

    const handleDelete = () => {
        onConfirm();
    };

    return (

        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Delete Confirmation
            </DialogTitle>
            <DialogContent sx={{ p: 2, px: 3 }}>
                <DialogContentText>
                    Are you sure you want to delete {text}?
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleDelete} color="primary" autoFocus>
                    Delete
                </Button>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationModal;