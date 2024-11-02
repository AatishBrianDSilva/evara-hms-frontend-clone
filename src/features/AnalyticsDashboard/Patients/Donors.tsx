import React, { useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';

const Donors: React.FC = () => {
  const [filterCity, setFilterCity] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState<string | null>(null);

  const patientsData = [
    {
      sNo: 1,
      name: 'John Doe',
      gender: 'Male',
      age: 35,
      registeredOn: '2024-04-10',
      religion: 'Christian',
      assignedTo: 'Dr. Smith',
      city: 'New York',
    },
    {
      sNo: 2,
      name: 'Jane Smith',
      gender: 'Female',
      age: 28,
      registeredOn: '2024-03-15',
      religion: 'Jewish',
      assignedTo: 'Dr. Johnson',
      city: 'Los Angeles',
    },
  ];

  const cities = ['New York', 'Los Angeles'];
  const genders = ['Male', 'Female'];

  const handleSearchChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    // Implement search logic based on Donor's ID
    // const searchTerm = event.target.value.toLowerCase().trim();
    // Your search filtering logic here
  };

  const handleCityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterCity(event.target.value as string);
  };

  const handleGenderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterGender(event.target.value as string);
  };

  // Filtered data based on selected city and gender
  const filteredData = patientsData.filter(patient => {
    return (
      (!filterCity || patient.city === filterCity) &&
      (!filterGender || patient.gender === filterGender)
    );
  });

  return (
    <ContentSection title="Donors">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        {/* Search by Donor's ID */}
        <TextField
          label="Search by Donor's ID"
          size="small"
          variant="outlined"
          onChange={handleSearchChange}
          placeholder="Enter Donor's ID"
        />
        {/* Filter by City */}
        <TextField
          select
          label="Filter by City"
          size="small"
          variant="outlined"
          value={filterCity || ''}
          onChange={handleCityChange}
        >
          {cities.map(city => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </TextField>
        {/* Filter by Gender */}
        <TextField
          select
          label="Filter by Gender"
          size="small"
          variant="outlined"
          value={filterGender || ''}
          onChange={handleGenderChange}
        >
          {genders.map(gender => (
            <MenuItem key={gender} value={gender}>
              {gender}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box flex="1 1 auto">
        <CustomDataGrid
          autoHeight={false}
          columns={[
            { field: 'sNo', headerName: 'S.NO', flex: 1 },
            { field: 'name', headerName: 'Name', flex: 1 },
            { field: 'gender', headerName: 'Gender', flex: 1 },
            { field: 'age', headerName: 'Age', flex: 1 },
            { field: 'registeredOn', headerName: 'Registered On', flex: 1 },
            { field: 'religion', headerName: 'Religion', flex: 1 },
            { field: 'assignedTo', headerName: 'Assigned To', flex: 1 },
            { field: 'city', headerName: 'City', flex: 1 },
          ]}
          rows={filteredData.map(patient => ({
            ...patient,
            id: patient.sNo, // Setting 'id' for data grid (not shown in columns)
          }))}
          page={1}
          pageSize={25}
          totalRows={filteredData.length}
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

export default Donors;
