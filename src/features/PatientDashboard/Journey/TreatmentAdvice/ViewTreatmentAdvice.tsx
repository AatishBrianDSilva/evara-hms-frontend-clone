import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface ViewTreatmentAdviceProps {
  open: boolean;
  onClose: () => void;
  treatmentAdvice: any; // Replace 'any' with the correct type if available
}

const ViewTreatmentAdvice: React.FC<ViewTreatmentAdviceProps> = ({
  open,
  onClose,
  treatmentAdvice,
}) => {
  console.log("Treatment Advice", treatmentAdvice);

  const columns: GridColDef[] = [
    {
      field: "callDate",
      headerName: "Call Date",
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "callTime",
      headerName: "Call Time",
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleTimeString(),
    },
    { field: "comments", headerName: "Comments", flex: 2 },
  ];

  const rows = treatmentAdvice.callDetails.map((detail: any, index: number) => ({
    id: index + 1,
    callDate: detail.callDate,
    callTime: detail.callTime,
    comments: detail.comments,
  }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: "primary.main" }}>Treatment Advice</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="h6">Treatment Advice:</Typography>
              <Typography variant="body1">{treatmentAdvice.treatmentAdvice}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">Status:</Typography>
              <Typography variant="body1">{treatmentAdvice.status}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">Tentative Date:</Typography>
              <Typography variant="body1">
                {new Date(treatmentAdvice.tentativeDate).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box mb={2}>
          <Typography variant="h6">Comments:</Typography>
          <Typography variant="body1" gutterBottom>
            {treatmentAdvice.comments}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Call Details
          </Typography>
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid rows={rows} columns={columns} disableColumnMenu hideFooterPagination />
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTreatmentAdvice;
