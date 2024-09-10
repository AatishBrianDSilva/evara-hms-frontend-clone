import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';

const Patient: React.FC = () => {
  const patientsData = [
    {
      id: '1',
      clinic: 'ABC Clinic',
      caseId: 'C001',
      patientId: 'P001',
      name: 'John Doe',
      phoneNumber: '123-456-7890',
      city: 'New York',
      date: '2024-04-24',
      register: '2024-04-10',
    },
    {
      id: '2',
      clinic: 'XYZ Hospital',
      caseId: 'C002',
      patientId: 'P002',
      name: 'Jane Smith',
      phoneNumber: '987-654-3210',
      city: 'Los Angeles',
      date: '2024-04-25',
      register: '2024-03-15',
    },
  ];

  const cities = ['New York', 'Los Angeles'];
  const clinics = ['ABC Clinic', 'XYZ Hospital'];

  const handleSearchChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
  };

  const handleCityChange = (_event: React.ChangeEvent<{ value: unknown }>) => {
  };

  const handleClinicChange = (_event: React.ChangeEvent<{ value: unknown }>) => {
  };

  return (
    <ContentSection title="Patient">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <TextField
          label="Search by Name or ID"
          size="small"
          variant="outlined"
          onChange={handleSearchChange}
          placeholder="Enter patient name or ID"
        />
        {/* Filter by City */}
        <TextField
          select
          label="Filter by City"
          size="small"
          variant="outlined"
          onChange={handleCityChange}
          defaultValue=""
        >
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </TextField>
        {/* Filter by Clinic */}
        <TextField
          select
          label="Filter by Clinic"
          size="small"
          variant="outlined"
          onChange={handleClinicChange}
          defaultValue=""
        >
          {clinics.map((clinic) => (
            <MenuItem key={clinic} value={clinic}>
              {clinic}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box flex="1 1 auto">
        <CustomDataGrid
          autoHeight={false}
          columns={[
            { field: 'id', headerName: 'ID', flex: 1 },
            { field: 'clinic', headerName: 'Clinic', flex: 1 },
            { field: 'caseId', headerName: 'Case ID', flex: 1 },
            { field: 'patientId', headerName: 'Patient ID', flex: 1 },
            { field: 'name', headerName: 'Patient Name', flex: 1 },
            { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
            { field: 'city', headerName: 'City', flex: 1 },
            { field: 'date', headerName: 'Date', flex: 1 },
            { field: 'register', headerName: 'Register Date', flex: 1 },
          ]}
          rows={patientsData}
          page={1}
          pageSize={25}
          totalRows={patientsData.length}
          loading={false}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={() => { }}
          onPageSizeChange={() => { }}
        />
      </Box>
    </ContentSection>
  );
};

export default Patient;
