import React, { useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';

const TreatmentHistory: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string>('');
  const [filterClinic, setFilterClinic] = useState<string>('');
  const [filterDoctor, setFilterDoctor] = useState<string>('');
  const [filterTreatment, setFilterTreatment] = useState<string>('');

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(event.target.value);
  };

  const handleSearchDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchDate(event.target.value);
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

  const handleFilterTreatmentChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setFilterTreatment(event.target.value as string);
  };

  const appointmentsData = [
    {
      id: '1',
      date: '2024-04-24',
      time: '10:00 AM',
      clinicName: 'ABC Clinic',
      caseId: 'C001',
      patientId: 'P001',
      treatmentName: 'Follow-up checkup',
      doctor: 'Dr. Smith',
      city: 'New York',
      status: 'Pending',
    },
    {
      id: '2',
      date: '2024-04-25',
      time: '11:30 AM',
      clinicName: 'XYZ Hospital',
      caseId: 'C002',
      patientId: 'P002',
      treatmentName: 'Consultation',
      doctor: 'Dr. Johnson',
      city: 'Los Angeles',
      status: 'Completed',
    },
  ];

  const columnsConfig = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'date', headerName: 'Date', flex: 1 },
    { field: 'time', headerName: 'Time', flex: 1 },
    { field: 'clinicName', headerName: 'Clinic Name', flex: 1 },
    { field: 'caseId', headerName: 'Case ID', flex: 1 },
    { field: 'patientId', headerName: 'Patient ID', flex: 1 },
    { field: 'treatmentName', headerName: 'Treatment Name', flex: 1 },
    { field: 'doctor', headerName: 'Doctor', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
  ];

  const filteredAppointments = appointmentsData.filter(appointment => {
    return (
      (searchText === '' ||
        appointment.patientId
          .toLowerCase()
          .includes(searchText.toLowerCase())) &&
      (searchDate === '' || appointment.date === searchDate) &&
      (filterClinic === '' || appointment.clinicName === filterClinic) &&
      (filterDoctor === '' || appointment.doctor === filterDoctor) &&
      (filterTreatment === '' || appointment.treatmentName === filterTreatment)
    );
  });

  return (
    <ContentSection title="Treatment History">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search Patient ID_Name"
          size="small"
          variant="outlined"
          value={searchText}
          onChange={handleSearchTextChange}
        />
        <TextField
          label="Search Date"
          size="small"
          variant="outlined"
          value={searchDate}
          onChange={handleSearchDateChange}
        />
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
        </TextField>
        <TextField
          select
          label="Treatment"
          size="small"
          variant="outlined"
          value={filterTreatment}
          onChange={handleFilterTreatmentChange}
        >
          <MenuItem value="Follow-up checkup">Follow-up checkup</MenuItem>
          <MenuItem value="Consultation">Consultation</MenuItem>
        </TextField>
      </Box>
      <Box mt={2} flex="1 1 auto">
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={filteredAppointments}
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

export default TreatmentHistory;
