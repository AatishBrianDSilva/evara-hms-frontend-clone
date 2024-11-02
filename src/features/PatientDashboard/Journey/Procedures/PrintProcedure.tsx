import { Box, Button, Grid, Modal, Skeleton } from '@mui/material';
import React from 'react';
import _ from 'lodash';
import ReportModalHeader from '../../../../components/ReportModalHeader/ReportModalHeader';
// import { ETestType } from '../../../types/master';
// import { IUltraSoundScanForm } from '../../../types/procedures';
// import { format } from 'date-fns';
import { useGetProcedureByIdQuery } from '../../../../services/patientDashboardService/procedureApi';

interface PrintInvestigationProps {
  open: {
    status: boolean;
    id: string;
  };
  onClose: () => void;
}

const renderSkeletonLoader = () => {
  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        borderBottom={1}
        py={2}
      >
        <Box>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>
        <Box>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>
      </Box>
      <Box pt={2} mt={2}>
        <Box>
          <Grid container justifyContent={'space-between'}>
            <Grid item md={6} lg={3}>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
            <Grid item>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Grid item lg={3}>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
            <Grid item lg={3}>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

const PrintInvestigation: React.FC<PrintInvestigationProps> = ({
  open: openPrintModal,
  onClose,
}) => {
  const {
    data: procedureData,
    isLoading: procedureLoading,
    isFetching: procedureFetching,
  } = useGetProcedureByIdQuery(openPrintModal.id, {
    skip: !openPrintModal || !openPrintModal.id,
  });

  const procedure = procedureData?.data;
  const loading = procedureLoading || procedureFetching;

  const date = new Date(procedure?.date || new Date()).toLocaleDateString();
  const doctor =
    procedure?.doctor?.firstName + ' ' + procedure?.doctor?.lastName;
  const procedureName = procedure?.procedure?.procedure?.procedureName;

  const renderInvestigation = () => {
    let component = null;

    switch (
      procedure?.procedure.procedureType
      // case ETestType.BloodTest:
      //   component = renderBloodTests();
      //   break;
      // case ETestType.UltrasoundScan:
      //   component = renderUltraSoundScan()
    ) {
    }

    return (
      <>
        <ReportModalHeader
          date={date}
          doctor={doctor}
          reportName={procedureName}
        />
        <Box
          display={'flex'}
          flexDirection={'column'}
          pt={2}
          px={3}
          mt={2}
          flex={1}
        >
          {component}
        </Box>
        <Box borderBottom={1} />
        <div className="print-hide">
          <Box display={'flex'} justifyContent={'center'} gap={2} p={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.print()}
            >
              Print
            </Button>
            <Button onClick={() => onClose()} variant="outlined">
              Cancel
            </Button>
          </Box>
        </div>
      </>
    );
  };

  // const renderBloodTests = () => {
  //   return (
  //     <>
  //       <Box flex={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'space-around', mt: 2 }}>
  //         <Typography variant="h6" color="primary" gutterBottom>Report</Typography>

  //         {/* Test Name, Value (Unit), Reference Range headers */}
  //         <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }} borderBottom={1}>
  //           <Typography flex={1} variant="subtitle2">Test Name</Typography>
  //           <Typography flex={1} textAlign={"center"} variant="subtitle2">Value (Unit)</Typography>
  //           <Typography flex={1} textAlign={"end"} variant="subtitle2">Reference Range</Typography>
  //         </Box>

  //         {/* Details */}
  //         {_.isArray(procedure?.result?.details) && procedure?.result?.details?.map((detail, index) => (
  //           <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
  //             <Typography flex={1} variant="body1">{detail.component}</Typography>
  //             <Typography flex={1} textAlign={"center"} variant="body1">{`${detail.value} ${detail.unit ? `(${detail.unit})` : ''}`}</Typography>
  //             <Typography flex={1} textAlign={"end"} variant="body1">{detail.referenceRange || 'N/A'}</Typography>
  //           </Box>
  //         ))}
  //       </Box>

  //       <Grid container justifyContent={"space-between"}>
  //         <Grid item md={6} lg={3}>
  //           <Typography variant="subtitle1" gutterBottom>
  //             Status: <strong>{procedure?.status || 'Not Available'}</strong>
  //           </Typography>
  //         </Grid>
  //       </Grid>

  //       <Box sx={{ mt: 2, pb: 4 }} borderTop={1}>
  //         <Typography variant="h6" color="primary" gutterBottom>Notes</Typography>
  //         <Typography variant="body1" >{procedure?.result?.notes || 'N/A'}</Typography>
  //       </Box>
  //     </>
  //   )
  // }

  // const renderUltraSoundScan = () => {
  //   if (!_.isArray(procedure?.result?.details) && procedure?.result?.details) {
  //     const details: IUltraSoundScanForm = procedure?.result?.details;

  //     // Helper function for formatting dates
  //     const formatDate = (date: Date | string | null) => date ? format(new Date(date), 'PPP') : 'N/A';

  //     // Helper function for boolean values presentation
  //     const formatBoolean = (value: boolean | undefined) => value ? 'Yes' : 'No';

  //     return (
  //       <>
  //         <Typography variant="h6" color="primary" gutterBottom>Ultrasound Scan Report</Typography>

  //         {/* Common Information */}
  //         <Box display={"flex"} justifyContent={"space-between"} mt={2}>
  //           <Typography variant="subtitle1">Scan Type</Typography>
  //           <Typography variant="body1">{_.startCase(details.scanType) || 'N/A'}</Typography>
  //         </Box>
  //         <Box display={"flex"} justifyContent={"space-between"} mt={2}>
  //           <Typography variant="subtitle1">LMP Date</Typography>
  //           <Typography variant="body1">{formatDate(details.lmpDate)}</Typography>
  //         </Box>
  //         <Box display={"flex"} justifyContent={"space-between"} mt={2}>
  //           <Typography variant="subtitle1">Requested Date</Typography>
  //           <Typography variant="body1">{formatDate(details.requestedDate)}</Typography>
  //         </Box>
  //         <Box display={"flex"} justifyContent={"space-between"} mt={2}>
  //           <Typography variant="subtitle1">Date of Scan</Typography>
  //           <Typography variant="body1">{formatDate(details.dateOfScan)}</Typography>
  //         </Box>

  //         {/* Scan Details */}
  //         <Box display={"flex"} justifyContent={"space-between"} mt={2}>
  //           <Typography variant="subtitle1">Day of Cycle</Typography>
  //           <Typography variant="body1">{details.dayOfCycle || 'N/A'}</Typography>
  //         </Box>
  //         <Box display={"flex"} justifyContent={"space-between"} mt={2}>
  //           <Typography variant="subtitle1">Transabdominal</Typography>
  //           <Typography variant="body1">{formatBoolean(details.transAbdominal)}</Typography>
  //         </Box>
  //         <Box display={"flex"} justifyContent={"space-between"} mt={2}>
  //           <Typography variant="subtitle1">Transvaginal Sonography</Typography>
  //           <Typography variant="body1">{formatBoolean(details.transVaginalSonography)}</Typography>
  //         </Box>

  //         {/* Uterus and Ovary Details */}
  //         <Box display={"flex"} justifyContent={"space-between"} mt={2}>
  //           <Typography variant="subtitle1">Uterus Appeared</Typography>
  //           <Typography variant="body1">{details.utreusAppeared || 'N/A'}</Typography>
  //         </Box>
  //         <Box display={"flex"} justifyContent={"space-between"} mt={2}>
  //           <Typography variant="subtitle1">Uterus Measurement</Typography>
  //           <Typography variant="body1">{details.uterusMeasurement || 'N/A'}</Typography>
  //         </Box>
  //         {/* ... Additional details for Uterus ... */}

  //         {/* Right Ovary Details */}
  //         <Box display={"flex"} flexDirection="column" mt={2}>
  //           <Typography variant="subtitle1">Right Ovary</Typography>
  //           <Box display={"flex"} justifyContent={"space-between"} mt={1}>
  //             <Typography variant="body1">Not Visualized:</Typography>
  //             <Typography variant="body1">{formatBoolean(details.rightOvary?.notVisualzed)}</Typography>
  //           </Box>
  //           {/* ... Additional details for Right Ovary ... */}

  //           {/* Left Ovary Details */}
  //           <Typography variant="subtitle1" mt={2}>Left Ovary</Typography>
  //           <Box display={"flex"} justifyContent={"space-between"} mt={1}>
  //             <Typography variant="body1">Not Visualized:</Typography>
  //             <Typography variant="body1">{formatBoolean(details.leftOvary?.notVisualzed)}</Typography>
  //           </Box>
  //           {/* ... Additional details for Left Ovary ... */}
  //         </Box>

  //         {/* Final Remarks */}
  //         <Box display={"flex"} justifyContent={"space-between"} mt={2}>
  //           <Typography variant="subtitle1">Impression</Typography>
  //           <Typography variant="body1">{details.impression || 'N/A'}</Typography>
  //         </Box>
  //         <Box display={"flex"} justifyContent={"space-between"} mt={2}>
  //           <Typography variant="subtitle1">Doctor's Remarks</Typography>
  //           <Typography variant="body1">{details.doctorRemarks || 'N/A'}</Typography>
  //         </Box>
  //         <Box display={"flex"} justifyContent={"space-between"} mt={2}>
  //           <Typography variant="subtitle1">Description</Typography>
  //           <Typography variant="body1">{details.description || 'N/A'}</Typography>
  //         </Box>
  //       </>
  //     )
  //   }
  // }

  return (
    <Modal open={openPrintModal.status} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '80%',
          maxHeight: '80%',
          overflowY: 'auto',
          borderRadius: 1,
          boxShadow: 5,
          px: 8,
          py: 5,
          bgcolor: 'background.paper',
        }}
      >
        {loading ? renderSkeletonLoader() : renderInvestigation()}
      </Box>
    </Modal>
  );
};

export default PrintInvestigation;
