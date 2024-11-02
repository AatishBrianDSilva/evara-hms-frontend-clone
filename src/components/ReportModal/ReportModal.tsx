import { Box, Modal } from '@mui/material';
import React from 'react';
import _ from 'lodash';

interface ReportModalProps {
  open: {
    status: boolean;
    id: string;
  };
  onClose: () => void;
  children: React.ReactNode;
}

const ReportModal: React.FC<ReportModalProps> = ({
  open: openDialog,
  onClose,
  children,
}) => {
  return (
    <Modal open={openDialog.status} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
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
        {children}
      </Box>
    </Modal>
  );
};

export default ReportModal;
