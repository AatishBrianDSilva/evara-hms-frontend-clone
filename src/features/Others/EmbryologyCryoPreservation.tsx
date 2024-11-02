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
import CustomTimePicker from '../../components/CustomDatePicker/CustomTimePicker';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';

const columns: GridColDef[] = [
  { field: 'dateOfFreezing', headerName: 'Date of Freezing', flex: 1 },
  { field: 'cell', headerName: 'Cell', flex: 1 },
  { field: 'grade', headerName: 'Grade', flex: 1 },
  { field: 'container', headerName: 'Container', flex: 1 },
  { field: 'expiry', headerName: 'Expiry', flex: 1 },
  { field: 'createdAt', headerName: 'Created At', flex: 1 },
  { field: 'createdBy', headerName: 'Created By', flex: 1 },
];

const EmbryologyCryoPreservation: React.FC = () => {
  return (
    <div className="main-container">
      <PatientInfo />

      <TreatmentCyclesTable />

      <Typography variant="h6" mt={2}>
        Cryo Preservation
      </Typography>

      <Box display={'flex'} alignItems={'center'} gap={2} mb={2} mt={2}>
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

      <Box mb={2}>
        <CustomDataGrid
          rows={[]}
          columns={columns}
          // pageSizeOptions={[5, 10]}
        />
      </Box>

      <Typography variant="subtitle1">Cryo Preservation Of Embryos</Typography>

      <Grid container spacing={2} mt={2} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="IVF No." fullWidth disabled />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Doctor" select fullWidth>
            <MenuItem value="1">Doctor-1</MenuItem>
            <MenuItem value="2">Doctor-2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <CustomDatePicker label="Date Of Freezing" />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <CustomTimePicker label="Time" />
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
      </Grid>

      <Divider />

      <Typography variant="subtitle2" mt={2}>
        IVF Cycle Details
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="No. Of OOCTYES Collected" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Sperm Parameters" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Method Of ART" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="No. Of OOCTYES Fertilized" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Embryo Transfer Details" fullWidth />
        </Grid>
      </Grid>

      <Divider />

      <Typography variant="subtitle2" mt={2}>
        Embryo Details
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Total No. of Embryos Frozen" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField
            label="Development Stage At The Time of Freezing"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Fragmentation" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Method Of Freezing" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Vitrification Media" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Embryo Grade" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Embryo Quality" fullWidth />
        </Grid>
      </Grid>

      <Divider />

      <Typography variant="subtitle2" mt={2}>
        Pre-freeze Screening
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="HIV /HbsAg/HCV/VDRL" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Blood group of wife" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Blood group of husband" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Expiry Of Months" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <CustomDatePicker label="Date Of Expiry" />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Cryo Can No." fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Canister No." fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Goblet Colour" fullWidth />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Tank No." fullWidth />
        </Grid>

        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Container" fullWidth multiline />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <TextField label="Note" fullWidth multiline />
        </Grid>
      </Grid>

      <Divider />

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

export default EmbryologyCryoPreservation;
