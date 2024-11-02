import React, { useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import ContentSection from '../../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';

const UpcomingAppointments: React.FC = () => {
  const [searchDate, setSearchDate] = useState<string>('');
  const [searchPatientId, setSearchPatientId] = useState<string>('');
  const [filterCity, setFilterCity] = useState<string>('');
  const [filterClinic, setFilterClinic] = useState<string>('');
  const [filterDoctor, setFilterDoctor] = useState<string>('');

  const handleSearchDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchDate(event.target.value);
  };

  const handleSearchPatientIdChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchPatientId(event.target.value);
  };

  const handleFilterCityChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setFilterCity(event.target.value as string);
  };

  const handleFilterClinicChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setFilterClinic(event.target.value as string);
  };

  const handleFilterDoctorChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setFilterDoctor(event.target.value as string);
  };

  const appointmentsData = [
    {
      id: '1',
      date: '2024-04-24',
      time: '10:00 AM',
      clinicName: 'ABC Clinic',
      caseId: 'C001',
      patientId: 'P001',
      reason: 'Follow-up checkup',
      doctor: 'Dr. Smith',
      city: 'New York',
    },
    {
      id: '2',
      date: '2024-04-25',
      time: '11:30 AM',
      clinicName: 'XYZ Hospital',
      caseId: 'C002',
      patientId: 'P002',
      reason: 'Consultation',
      doctor: 'Dr. Johnson',
      city: 'Los Angeles',
    },
    // Add more appointment data as needed
  ];

  const columnsConfig = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'date', headerName: 'Date', flex: 1 },
    { field: 'time', headerName: 'Time', flex: 1 },
    { field: 'clinicName', headerName: 'Clinic Name', flex: 1 },
    { field: 'caseId', headerName: 'Case ID', flex: 1 },
    { field: 'patientId', headerName: 'Patient ID', flex: 1 },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    { field: 'doctor', headerName: 'Doctor', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
  ];

  return (
    <ContentSection title="Upcoming Appointments">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        {/* Search By Text Input for Date */}
        <TextField
          label="Search Date"
          size="small"
          variant="outlined"
          value={searchDate}
          onChange={handleSearchDateChange}
        />
        {/* Search By Text Input for Patient ID */}
        <TextField
          label="Search Patient ID"
          size="small"
          variant="outlined"
          value={searchPatientId}
          onChange={handleSearchPatientIdChange}
        />
        {/* Filter By Dropdowns */}
        <TextField
          select
          label="City"
          size="small"
          variant="outlined"
          value={filterCity}
          onChange={handleFilterCityChange}
        >
          <MenuItem value="New York">New York</MenuItem>
          <MenuItem value="Los Angeles">Los Angeles</MenuItem>
          {/* Add more cities as needed */}
        </TextField>
        <TextField
          select
          label="Clinic"
          size="small"
          variant="outlined"
          value={filterClinic}
          onChange={handleFilterClinicChange}
        >
          <MenuItem value="ABC Clinic">ABC Clinic</MenuItem>
          <MenuItem value="XYZ Hospital">XYZ Hospital</MenuItem>
          {/* Add more clinics as needed */}
        </TextField>
        <TextField
          select
          label="Doctor"
          size="small"
          variant="outlined"
          value={filterDoctor}
          onChange={handleFilterDoctorChange}
        >
          <MenuItem value="Dr. Smith">Dr. Smith</MenuItem>
          <MenuItem value="Dr. Johnson">Dr. Johnson</MenuItem>
          {/* Add more doctors as needed */}
        </TextField>
      </Box>
      <Box mt={2} flex="1 1 auto">
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={appointmentsData}
          page={1}
          pageSize={25}
          totalRows={0}
          loading={false}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
        />
      </Box>
    </ContentSection>
  );
};

export default UpcomingAppointments;
