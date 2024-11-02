import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Skeleton,
  useTheme,
} from '@mui/material';
import { formatToIndianCurrencyFormat } from '../../../../utils/formatToIndianCurrencyFormat';
import { IPatient } from '../../../../types/patient';
import { ICase } from '../../../../types/case';
import { useGetRefundByIdQuery } from '../../../../services/patientDashboardService/billings/billingApi'; // Import the hook

import { FullPagePrintBox, PrintHideBox } from '../../../../styles/printStyles';
import { grey } from '@mui/material/colors';

interface RefundInvoiceProps {
  openModal: boolean;
  onClose: () => void;
  id: string; // The refund ID to fetch the data
  patient: IPatient;
  patientCase: ICase;
}

const PrintRefund: React.FC<RefundInvoiceProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const theme = useTheme();

  // Fetch the refund data by ID
  const { data, isLoading, error } = useGetRefundByIdQuery(id);

  const refund = data?.message as any; // Adjusted to access refund data under 'message'

  const printInvoice = () => {
    window.print();
  };

  console.log('Fetched Refund Data', refund); // Log the fetched refund data for debugging

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent>
        <FullPagePrintBox>
          <Grid container spacing={2} padding={4}>
            <Grid container spacing={2} borderBottom={1}>
              <Grid item xs={12} padding={2}>
                <Typography variant="h6" color={'primary'} align="center">
                  Refund
                </Typography>
              </Grid>
            </Grid>

            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" height={200} />
            ) : error ? (
              <Typography color="error">Failed to load refund data.</Typography>
            ) : (
              <>
                <Grid item xs={12} my={4}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead sx={{ backgroundColor: grey[200] }}>
                        <TableRow>
                          <TableCell sx={{ color: theme.palette.primary.main }}>
                            S.No
                          </TableCell>
                          <TableCell sx={{ color: theme.palette.primary.main }}>
                            Item Name
                          </TableCell>
                          <TableCell sx={{ color: theme.palette.primary.main }}>
                            Batch No
                          </TableCell>
                          <TableCell sx={{ color: theme.palette.primary.main }}>
                            Quantity
                          </TableCell>
                          <TableCell sx={{ color: theme.palette.primary.main }}>
                            Amount
                          </TableCell>
                          <TableCell sx={{ color: theme.palette.primary.main }}>
                            Reason
                          </TableCell>
                          <TableCell sx={{ color: theme.palette.primary.main }}>
                            Date
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {refund?.refundDetails?.items?.map(
                          (item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>{' '}
                              {/* Serial Number */}
                              <TableCell>{item.itemName}</TableCell>
                              <TableCell>{item.batchNo}</TableCell>
                              <TableCell>{item.qtyToRefund}</TableCell>
                              <TableCell>
                                {formatToIndianCurrencyFormat(
                                  item.amountToRefund,
                                )}
                              </TableCell>
                              <TableCell>
                                {refund?.refundDetails.reason}
                              </TableCell>
                              <TableCell>
                                {refund?.refundDetails.refundDate
                                  ? new Date(
                                      refund?.refundDetails.refundDate,
                                    ).toLocaleDateString()
                                  : ''}
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Typography variant="h6" color={'primary'}>
                  Summary
                </Typography>
                <Grid
                  item
                  xs={12}
                  display={'flex'}
                  flexDirection={'column'}
                  gap={1}
                >
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Typography variant="body1">Charges: </Typography>
                    <Typography variant="subtitle1">
                      {formatToIndianCurrencyFormat(
                        refund?.refundDetails?.charges || 0,
                      )}
                    </Typography>
                  </Box>
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Typography variant="body1">
                      Total Refund Amount:{' '}
                    </Typography>
                    <Typography variant="subtitle1">
                      {formatToIndianCurrencyFormat(
                        refund?.refundDetails?.refundAmount || 0,
                      )}
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </FullPagePrintBox>
      </DialogContent>
      <DialogActions>
        <PrintHideBox>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={printInvoice} color="primary">
            Print
          </Button>
        </PrintHideBox>
      </DialogActions>
    </Dialog>
  );
};

export default PrintRefund;
