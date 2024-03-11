import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
import { FileUploadAndPreview } from '../../components/FileUploadAndPreview/FileUploadAndPreview';

const History: React.FC = () => {

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Box mt={2} boxShadow={2} p={2} borderRadius={2} height={'200px'}>
        <Typography variant='h6'>Synopsis</Typography>
      </Box>

      <Box padding={2} mt={2}>
        <Stepper activeStep={activeStep} orientation='vertical'>
          <Step key={0}>
            <StepLabel>Medical History</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Married Life" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Infertility" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Duration of Infertility" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Consanguineous Marriage" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Contraception" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="No. Of Pregnancies" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Previous Infertilty Treatments" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Notes" multiline fullWidth />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size='small'
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button
                    disabled={true}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={1}>
            <StepLabel>Menstrual and Ovulation History</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={2}>
                  <DatePicker label="LMP Date" sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Age at Menarche" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Menstrual Regularity" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Menstrual Bleeding" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Longest Cycle Duration" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Shortest Cycle Duration" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Period Duration" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="IMB" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="PCB" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Dyspareunia" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Discharge PV" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Passage of Clots" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Galactorrhoea" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Hirsutism" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Visual Disturbances" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Dysmenorrhoea" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Weight Gain Loss" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Urinary / Bowel Problems" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Notes" multiline fullWidth />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size='small'
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={2}>
            <StepLabel>Coital History</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Frequency Coitus" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Fertile Period Knowledge" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Notes" multiline fullWidth />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size='small'
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={3}>
            <StepLabel>History of disease with a possible adverse effect on Ferility</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Diabetes" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Thyroid Disease" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Tuberculosis" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Other Diseases" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Notes" multiline fullWidth />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size='small'
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={4}>
            <StepLabel>Other factors with a possible adverse effect on Fertility</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Environmental Effects" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Smoking" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Alcohol" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="HIV Risk Factors" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Previous Medical Treatments" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Allergies" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Surgical History" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Family History" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Notes" multiline fullWidth />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size='small'
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={5}>
            <StepLabel>General Physical Examination</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Height" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Weight" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField disabled label="BMI" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="BP" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Chest" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="CVS" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="I/P/E" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="I/P/E 2" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField label="Hair Distribution Score" fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="General Examination" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Breast Development" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Galactorrhoea" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Breast Lumps" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Lymph Nodes" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Pelvic Examination" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Notes" multiline fullWidth />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size='small'
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={6}>
            <StepLabel>Investigations</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>CBP (Complete Blood Picture)</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Estradiol (E2)</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>HCV (Hepatitis C)</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>HIV I & II (Elisa)</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>HbsAg (CMIA)</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Random Blood Sugar (RBS)</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>TSH (Thyroid Stimulating Hormone)</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>VDRL STS Test</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Prolactin</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Sperm DNA Assessment	</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Blood Group & RH Typing</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>ESR</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Rubella IgG	</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>FSH</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>LH</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Pap Smear</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Progesterone</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>AMH</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Karyotyping Chromosomal Analysis Couple	</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>CA 125</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Vitamin D</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Histopathology Small (Endomen Tissue)</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>TB PCR</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>Bacterial Viginosis</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={'center'} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant='subtitle2'>LH (IVF Package)</Typography>
                    <DatePicker label="Date" format='dd/MM/yyyy' value={new Date()} sx={{ width: '100%' }} />
                    <TextField label="Result" fullWidth />
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size='small'
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={7}>
            <StepLabel>Summary</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Impression" multiline minRows={2} fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Treatment Plan" multiline minRows={2} fullWidth />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField label="Summary" multiline minRows={2} fullWidth />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size='small'
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Sumbit
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
        {activeStep === 8 && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>Medical History Taken</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box>

      <Box padding={2}>
        <Typography variant='body1'>Upload Medical Documents</Typography>
        <Box mt={2}>
          <FileUploadAndPreview handleUpload={() => { }} />
        </Box>
      </Box>
    </ >
  )
}

export default History