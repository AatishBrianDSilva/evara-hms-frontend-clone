import React, { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Modal, Step, StepContent, StepLabel, Stepper } from '@mui/material';

import DateDoctorSelection from './DateDoctorSelection';
import AppointmentDetailsForm from './AppointmentDetailsForm';
import AppointmentConfirmation from './AppointmentConfirmation';
import { useDispatch } from 'react-redux';
import { resetAppointment } from './appointmentSlice';

interface BookAppointmentProps {
  openModal: boolean;
  onClose: (value: boolean) => void;
}

const BookAppointment: React.FC<BookAppointmentProps> = ({
  openModal,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);

  // Functions to handle the next step in the stepper
  const handleNext = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }, [setActiveStep]);

  const handleBack = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }, [setActiveStep]);

  const handleReset = useCallback(() => {
    setActiveStep(0);
    dispatch(resetAppointment());
  }, [setActiveStep]);

  return (
    <Modal open={openModal} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: '86vh',
          overflowY: 'auto',
          borderRadius: 1,
          boxShadow: 5,
          px: 8,
          py: 5,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          Book Appointment
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step key={0}>
            <StepLabel>
              {' '}
              <Typography variant="button" color={'secondary'} gutterBottom>
                Date & Doctor Selection
              </Typography>
            </StepLabel>
            <StepContent>
              <DateDoctorSelection handleNext={handleNext} />
            </StepContent>
          </Step>
          <Step key={1}>
            <StepLabel>
              {' '}
              <Typography variant="button" color={'secondary'} gutterBottom>
                Appointment Details
              </Typography>
            </StepLabel>
            <StepContent>
              <AppointmentDetailsForm onBack={handleBack} onNext={handleNext} />
            </StepContent>
          </Step>
          <Step key={2}>
            <StepLabel>
              {' '}
              <Typography variant="button" color={'secondary'} gutterBottom>
                Appointment Confirmed
              </Typography>
            </StepLabel>
            <StepContent>
              <AppointmentConfirmation
                onReset={handleReset}
                onClose={onClose}
              />
            </StepContent>
          </Step>
        </Stepper>
      </Box>
    </Modal>
  );
};

export default BookAppointment;
