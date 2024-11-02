import React from 'react';
import PatientInfo from './PatientInfo';
import TreatmentCyclesTable from './TreatmentCyclesTable';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CustomDataGrid from '../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { VisuallyHiddenInput } from '../../components/Utils/VisuallyHiddenInput';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CustomDateTimePicker from '../../components/CustomDatePicker/CustomDateTimePicker';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';

const columns: GridColDef[] = [
  { field: 'patientName', headerName: 'Patient Name', flex: 1 },
  { field: 'createdAt', headerName: 'Created At', flex: 1 },
  { field: 'createdBy', headerName: 'Created By', flex: 1 },
];

const EmbryologyFETDischarge: React.FC = () => {
  return (
    <div className="main-container">
      <PatientInfo />

      <TreatmentCyclesTable />

      <Typography variant="h6" mt={2}>
        FET Discharge
      </Typography>

      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={2}
        mt={2}
      >
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <Button variant="outlined" sx={{ width: 'fit-content' }}>
            Add New
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ width: 'fit-content' }}
          >
            Export
          </Button>
        </Box>
        <TextField label="Search" />
      </Box>

      <Box mb={2}>
        <CustomDataGrid
          rows={[]}
          columns={columns}
          // pageSizeOptions={[5, 10]}
        />
      </Box>

      <Typography variant="subtitle1">FET Discharge Summary</Typography>

      <Grid container spacing={2} mt={2} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="IVF No." fullWidth disabled />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Registration No." fullWidth disabled />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Referral Doctor" select fullWidth>
            <MenuItem value="1">Doctor-1</MenuItem>
            <MenuItem value="2">Doctor-2</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Embryologist-1" fullWidth select>
            <MenuItem value="1">Embryologist-1</MenuItem>
            <MenuItem value="2">Embryologist-2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Embryologist-2" fullWidth select>
            <MenuItem value="1">Embryologist-1</MenuItem>
            <MenuItem value="2">Embryologist-2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Gynaecologist-1" fullWidth select>
            <MenuItem value="1">Embryologist-1</MenuItem>
            <MenuItem value="2">Embryologist-2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Gynaecologist-2" fullWidth select>
            <MenuItem value="1">Embryologist-1</MenuItem>
            <MenuItem value="2">Embryologist-2</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Divider />

      <Typography variant="subtitle2" mt={2}>
        Embryo Thawing
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <CustomDateTimePicker label="Date and Time of Thawing" />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Desc. Of Embryos Remaining" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="No. Of Embryos Thawed" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField
            label="Post Thaw Survival And Description"
            fullWidth
            multiline
          />
        </Grid>
      </Grid>

      <Divider />

      <Typography variant="subtitle2" mt={2}>
        Embryo Transfer
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="No. of Embryos Remaining" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Status Of Remaining Embryos" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <CustomDatePicker label="Embryos Expiry Date" />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <CustomDateTimePicker label="Date and Time of Embryo Transfer" />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="No. of Embryos Transfered" fullWidth />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <TextField
            label="Stage Of Embryonic Development On the Day of ET"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Transfer Comments" fullWidth />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextField label="Endometrial Thicknes On the Day of ET" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Embryo Quality" fullWidth />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <TextField label="Description Of Embryos Transferred" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Embryos Discarded" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <CustomDatePicker label="Serum Beta HCG Date" />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Assisted Hatching" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Doctor Remarks" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Advice" fullWidth />
        </Grid>
      </Grid>

      <Divider />

      <Typography variant="subtitle2" mt={2}>
        Medications As Per Doctor's Prescription
      </Typography>

      <Grid container spacing={2} mt={2} mb={2}>
        <Grid item xs={12} md={6} lg={2}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Upload
            <VisuallyHiddenInput
              onChange={() => {}}
              type="file"
              accept="image/*"
            />
          </Button>
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          <TextField label="Description" multiline fullWidth />
        </Grid>
      </Grid>

      <Box
        display={'flex'}
        justifyContent={'flex-end'}
        alignItems={'center'}
        gap={2}
        mt={2}
      >
        <Button variant="outlined" sx={{ width: 'fit-content' }}>
          Submit
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ width: 'fit-content' }}
        >
          Cancel
        </Button>
      </Box>
    </div>
  );
};

export default EmbryologyFETDischarge;
