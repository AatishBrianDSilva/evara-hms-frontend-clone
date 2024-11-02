import React from 'react';
import { Dialog } from '@mui/material';
import ViewUserUploadedReports from '../../../components/ViewUseUploadedReports/viewUserUploadedReports';

interface ViewReportsProps {
  openModal: boolean;
  onClose: () => void;
  files: string[];
}

const ViewReports: React.FC<ViewReportsProps> = ({
  openModal,
  onClose,
  files,
}) => {
  console.log('Files', files);

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <ViewUserUploadedReports files={files} />
    </Dialog>
  );
};

export default ViewReports;
