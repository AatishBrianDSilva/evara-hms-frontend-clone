import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useGetPatientPharmacyByIdQuery } from '../../../services/patientDashboardService/patientPharmacyApi';
import { IPatientPharmacy } from '../../../types/patientDashboard/patientPharmacy';
import { useToast } from '../../../context/ToastContext';

interface ViewPatientPharmacyProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

// const PharmacyDetailsLoader = () => (
//   <Grid container spacing={2}>
//     {Array.from({ length: 5 }, (_, index) => (
//       <Grid item xs={12} md={6} key={index}>
//         <Skeleton variant="text" width="80%" />
//         <Skeleton variant="text" width="60%" />
//         <Skeleton variant="text" width="40%" />
//       </Grid>
//     ))}
//   </Grid>
// );

// const PharmacyDetails = ({ patientPharmacy }: { patientPharmacy: IPatientPharmacy }) => (
//   <Box mt={2}>
//     <Typography variant="subtitle1" gutterBottom>Pharmacy Details</Typography>
//     <Divider />
//     <Grid container spacing={2} marginTop={2}>
//       <Grid item xs={12} md={6}>
//         <Typography variant="subtitle1">Doctor: {patientPharmacy.doctor.firstName} {patientPharmacy.doctor.lastName}</Typography>
//         <Typography variant="subtitle1">Date: {new Date(patientPharmacy.date).toLocaleDateString()}</Typography>
//         <Typography variant="subtitle1">Allocated By: {patientPharmacy.allocatedBy}</Typography>
//       </Grid>
//       <Grid item xs={12} md={6}>
//         <Typography variant="subtitle1">Patient ID: {patientPharmacy.patient}</Typography>
//       </Grid>
//     </Grid>
//     <Typography mt={2} variant="body1"><strong>Item:</strong> {patientPharmacy.item.stock.item.name}</Typography>
//     {patientPharmacy.item.details.map((detail, index) => (
//       <Box key={index} mb={1}>
//         <Box paddingLeft={2}>
//           <Typography variant="body2">Location: {detail.location.location}</Typography>
//           <Typography variant="body2">Batch Number: {detail.batchNumber}</Typography>
//           <Typography variant="body2">Quantity: {detail.quantity}</Typography>
//         </Box>
//         <Divider />
//       </Box>
//     ))}
//   </Box>
// );

const PharmacyDetailsLoader = () => (
  <Grid container spacing={2}>
    {Array.from({ length: 5 }, (_, index) => (
      <Grid item xs={12} md={6} key={index}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </Grid>
    ))}
  </Grid>
);

const PharmacyDetails = ({
  patientPharmacy,
}: {
  patientPharmacy: IPatientPharmacy;
}) => (
  <Box mt={2}>
    <Typography variant="subtitle1" gutterBottom>
      Pharmacy Details
    </Typography>
    <Divider />
    <Grid container spacing={2} marginTop={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1">
          Doctor: {patientPharmacy.doctor.firstName}{' '}
          {patientPharmacy.doctor.lastName}
        </Typography>
        <Typography variant="subtitle1">
          Date: {new Date(patientPharmacy.date).toLocaleDateString()}
        </Typography>
        <Typography variant="subtitle1">
          Allocated By: {patientPharmacy.allocatedBy}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1">
          Patient ID: {patientPharmacy.patient}
        </Typography>
      </Grid>
    </Grid>
    <Typography mt={2} variant="body1">
      <strong>Item:</strong> {patientPharmacy.item?.stock?.item?.name}
    </Typography>
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Location</TableCell>
            <TableCell>Batch Number</TableCell>
            <TableCell>Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patientPharmacy.item.details.map((detail, index) => (
            <TableRow key={index}>
              <TableCell>{detail.location.location}</TableCell>
              <TableCell>{detail.batchNumber}</TableCell>
              <TableCell>{detail.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const ViewPatientPharmacy: React.FC<ViewPatientPharmacyProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const {
    data: patientPharmacyData,
    isLoading,
    isFetching,
    isError,
  } = useGetPatientPharmacyByIdQuery(id);
  const patientPharmacy = patientPharmacyData?.data;
  const loading = isLoading || isFetching;
  const { showToast } = useToast();

  console.log('View Pateint Pharmacy Data', patientPharmacy);

  if (isError) {
    showToast(
      'An error occurred while fetching patient pharmacy details',
      'error',
    );
    onClose();
    return null;
  }

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle color="primary">Pharmacy Order</DialogTitle>
      <DialogContent>
        {loading || !patientPharmacy ? (
          <PharmacyDetailsLoader />
        ) : (
          <PharmacyDetails patientPharmacy={patientPharmacy} />
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

export default ViewPatientPharmacy;
