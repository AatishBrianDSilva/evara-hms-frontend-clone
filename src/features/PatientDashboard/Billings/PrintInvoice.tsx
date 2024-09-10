
import React from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, Grid, Typography, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Skeleton,
  Divider,
  Box,
  useTheme
} from '@mui/material';
import { useGetBillingByIdQuery } from '../../../services/patientDashboardService/billings/billingApi';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';
import { IPatient } from '../../../types/patient';
import { ICase } from '../../../types/case';
import { FullPagePrintBox, PrintHideBox } from '../../../styles/printStyles';
import { grey } from '@mui/material/colors';

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



interface BillingInvoiceProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
  patient: IPatient;
  patientCase: ICase;
}




const BillingInvoice: React.FC<BillingInvoiceProps> = ({ openModal, onClose, id, patient, patientCase }) => {

  const theme = useTheme();

  const { data, isLoading } = useGetBillingByIdQuery(id);
  const billing = data?.data;


  const printInvoice = () => {
    window.print();
  };

  console.log("billing", billing);
  console.log("patient", patient);

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <FullPagePrintBox>

            <Grid container spacing={2} padding={4}>
              <Grid container spacing={2} borderBottom={1}>
                <Grid item xs={12} padding={2}>
                  <Grid container spacing={2}>
                    <Grid item flex={3} display={"flex"} >
                      <Box>
                        <Typography variant="h6" color={"primary"} >Invoice</Typography>
                        <Typography variant="body1">Invoice No: #{billing?.billingId}</Typography>
                        <Typography variant="body1">Date: {billing?.createdAt ? new Date(billing?.createdAt).toLocaleDateString() : ""}</Typography>
                      </Box>
                    </Grid>
                    <Grid item flex={3} display={"flex"} justifyContent={"center"}>
                      <Box>
                        <Typography variant="h6" color={"primary"}>From</Typography>
                        <Typography variant="body1">Evara Fertility,</Typography>
                        <Typography variant="body1">Kanpur, UP</Typography>
                      </Box>
                    </Grid>
                    <Grid item flex={3} display={"flex"} justifyContent={"flex-end"}>
                      <Box>
                        <Typography variant="h6" color={"primary"}>To</Typography>
                        <Typography variant="body1">{patient?.firstName + " " + patient?.lastName}</Typography>
                        <Typography variant="body1">ID: {patient.patientId}</Typography>
                        <Typography variant="body1">CaseId: {patientCase?.caseId}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>

              <Grid item xs={12} my={4}>
                <TableContainer component={Paper} >
                  <Table>
                    <TableHead sx={{ backgroundColor: grey[200] }}>
                      <TableRow >
                        <TableCell sx={{ color: theme.palette.primary.main }}>Item</TableCell>
                        <TableCell sx={{ color: theme.palette.primary.main }}>Service Type</TableCell>
                        <TableCell sx={{ color: theme.palette.primary.main }}>Quantity</TableCell>
                        <TableCell sx={{ color: theme.palette.primary.main }}>Price</TableCell>
                        <TableCell sx={{ color: theme.palette.primary.main }}>Amount</TableCell>
                        <TableCell sx={{ color: theme.palette.primary.main }}>Tax</TableCell>
                        <TableCell sx={{ color: theme.palette.primary.main }}>Discount</TableCell>
                        <TableCell sx={{ color: theme.palette.primary.main }} align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {billing?.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.serviceName}</TableCell>
                          <TableCell>{item.serviceType}</TableCell>
                          <TableCell>{item.quantity} </TableCell>
                          <TableCell>{formatToIndianCurrencyFormat(item.price)}</TableCell>
                          <TableCell>{formatToIndianCurrencyFormat(item.price * item.quantity)}</TableCell>
                          <TableCell>{formatToIndianCurrencyFormat(item.tax)}</TableCell>
                          <TableCell>{formatToIndianCurrencyFormat(item.discount)}</TableCell>
                          <TableCell align="right">{formatToIndianCurrencyFormat(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Typography variant="h6" color={"primary"}>Summary</Typography>
              <Grid item xs={12} display={"flex"} flexDirection={"column"} gap={1}>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                  <Typography variant="body1">Sub Total: </Typography>
                  <Typography variant="subtitle1">{formatToIndianCurrencyFormat(billing?.subTotal || 0)}</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                  <Typography variant="body1">Tax: </Typography>
                  <Typography variant="subtitle1">{formatToIndianCurrencyFormat(billing?.tax || 0)}</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                  <Typography variant="body1">Discount: </Typography>
                  <Typography variant="subtitle1">{formatToIndianCurrencyFormat(billing?.discount || 0)}</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                  <Typography variant="body1">Grand Total: </Typography>
                  <Typography variant="subtitle1" textAlign={"left"} color="primary">{formatToIndianCurrencyFormat(billing?.grandTotal || 0)}</Typography>
                </Box>
              </Grid>

            </Grid>
          </FullPagePrintBox>
        )}
      </DialogContent>
      <DialogActions>
        <PrintHideBox>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={printInvoice} color="primary">Print</Button>
        </PrintHideBox>
      </DialogActions>
    </Dialog>
  );
};

export default BillingInvoice;

