import React, { useState } from "react";
import { ContentProps } from "../../types/patientDashboard/treatmentCycle";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material"; // Import MUI components
import Add from "@mui/icons-material/Add";
import Print from "@mui/icons-material/Print";
import ModalContext from "../../context/ModalContext";
import useGenerateTreatmentCyclelistDetails from "../../hooks/useGenerateTreatmentCycleListDetails";
import { usePrint } from "../../context/PrintPDFContext";
import { Edit, Visibility } from "@mui/icons-material";
import ViewReports from "../../features/PatientDashboard/Journey/ViewReports";

interface TreatmentCycleListProps {
  content: React.ReactNode;
  contentProps: ContentProps;
}

const TreatmentCycleList: React.FC<TreatmentCycleListProps> = ({ content, contentProps }) => {
  const theme = useTheme();
  // const { showPromiseToast } = useToast();
  const { fetchAndPrintPdf } = usePrint();

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isViewReportsModalOpen, setIsViewReportsModalOpen] = useState<boolean>(false);

  const { name, status, category, documentId, files } =
    useGenerateTreatmentCyclelistDetails(contentProps);
  // const [isPreviewOpenModal, setIsPreviewOpenModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [isRestModalOpen, setIsResetModalOpen] = useState(false);

  console.log("Category", category);
  console.log("Document Ud", documentId);

  // Functions to handle opening and closing the add modal
  const handleOpenModal = () => setIsAddModalOpen(true);
  const handleAddModalClose = () => setIsAddModalOpen(false);

  const openViewReportsModal = () => {
    setIsViewReportsModalOpen(true);
  };

  const closeViewReportsModal = () => {
    setIsViewReportsModalOpen(false);
  };

  const handleViewReportsClick = (files: string[]) => {
    setSelectedFiles(files);
    openViewReportsModal();
  };

  // Functions to handle opening and closing the reset modal
  // const handleRestModalOpen = () => setIsResetModalOpen(true);
  // const handleRestModalClose = () => setIsResetModalOpen(false);

  // const [updateProtocol, { isLoading }] = useEditTreatmentCycleMutation();

  // const handleModalRest = async () => {
  //   // Ensure we have necessary data before proceeding
  // if (!category || !documentId) {
  //   console.error("Missing category or documentId, cannot proceed with reset.");
  //   return;
  // }

  //   const options = {
  //     conditions: {
  //       editType: "reset",
  //       category: category,
  //     },
  //   };

  //   const payload = {
  //     id: contentProps.treatmentCycleId,
  //     details: {},
  //     documentId: documentId,
  //   };

  //   console.log("Payload:", payload);
  //   console.log("Options:", options);

  //   const promise = updateProtocol({ payload, options }).unwrap();

  //   showPromiseToast(promise, {
  //     loading: "Reseting Protocol...",
  //     success: (data) => data.message || "Protocol Reset Successful",
  //     error: (data) => data.message || "Error Resetting Protocol",
  //   });

  //   try {
  //     await promise;
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   setIsResetModalOpen(false);
  // };

  // const handlePreviewClose = () => {
  //   setIsPreviewOpenModal(false);
  // };

  return (
    <ModalContext.Provider value={{ closeModal: handleAddModalClose }}>
      <Box display="flex" flex={3} flexDirection="column" gap={2}>
        <Paper
          elevation={2}
          sx={{
            padding: theme.spacing(1),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="button" color="GrayText">
            {name}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {status === "Completed" ? (
              <>
                <Tooltip title="Preview Report">
                  <IconButton color="primary">
                    <Print fontSize="small" onClick={() => fetchAndPrintPdf(documentId)} />
                  </IconButton>
                </Tooltip>
                {files && files.length > 0 && (
                  <Tooltip title="View Uploaded Files">
                    <IconButton color="primary">
                      <Visibility fontSize="small" onClick={() => handleViewReportsClick(files)} />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Edit Report">
                  <IconButton color="primary" onClick={handleOpenModal}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Add Report">
                <IconButton color="primary" onClick={handleOpenModal}>
                  <Add fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {/* <Tooltip title="Reset Form">
              <Box>
                <IconButton
                  color="primary"
                  disabled={status === "Pending" || isLoading}
                  onClick={handleRestModalOpen}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip> */}
          </Box>
        </Paper>
        {/* Add Protocol, Checklist, Report, Metrics */}
        <Dialog open={isAddModalOpen} onClose={handleAddModalClose} maxWidth="md" fullWidth>
          <DialogContent>{content}</DialogContent>
        </Dialog>

        {/* Preview Modal for Protocol, Checklist, Report, Metrics */}
        {/* <Dialog open={isPreviewOpenModal} onClose={handlePreviewClose} maxWidth="md" fullWidth>
          <DialogContent>
            <Box>
              {previewContent}
            </Box>
          </DialogContent>
        </Dialog> */}

        {/* Reset Protocol, Checklist, Report, Metrics
        <Dialog open={isRestModalOpen} onClose={handleRestModalClose} maxWidth="sm" fullWidth>
          <DialogTitle color="primary">Reset {name}</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to reset {name}?</Typography>
            <Typography variant="subtitle2" color="grey">
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleRestModalClose}>
              Cancel
            </Button> */}
        {/* <Button color="primary" disabled={isLoading} onClick={handleModalRest}>
              Reset
            </Button> */}
        {/* </DialogActions>
        </Dialog> */}

        {isViewReportsModalOpen && (
          <ViewReports
            openModal={isViewReportsModalOpen}
            onClose={closeViewReportsModal}
            // id={selectedRow}
            files={selectedFiles}
          />
        )}
      </Box>
    </ModalContext.Provider>
  );
};

export default TreatmentCycleList;
