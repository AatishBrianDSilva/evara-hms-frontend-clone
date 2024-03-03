import { Box, Button, IconButton, TextField } from '@mui/material'
import React from 'react'
// import { DatePicker } from '@mui/x-date-pickers'
import { GridColDef } from '@mui/x-data-grid'
// import { setSelectedPatientId } from './patientsSlice'
// import { useDispatch } from 'react-redux'
import CustomDataGrid from '../../components/Table/CustomDataGrid'
import { Add, Delete, Edit } from '@mui/icons-material'
import ContentSection from '../../components/ContentSection/ContentSection'
import { useNavigate } from 'react-router-dom'

const patients = [
  {
    id: 1,
    name: 'John Doe',
    gender: 'male',
    age: 30,
    phone: '1234567890',
    dob: new Date('1991-10-01'),
    email: '',
    education: 'B.Tech',
    referredBy: 'Dr. Smith',
    marketingPerson: 'Mr. Johnson',
    address: '123, Main Street, New York',
    registeredOn: new Date('2021-10-01'),
    registeredBy: 'Dr. Smith',
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    gender: 'male',
    age: 30,
    phone: '1234567890',
    dob: new Date('1991-10-01'),
    email: '',
    education: 'B.Tech',
    referredBy: 'Dr. Smith',
    marketingPerson: 'Mr. Johnson',
    address: '123, Main Street, New York',
    registeredOn: new Date('2021-10-01'),
    registeredBy: 'Dr. Smith',
    status: 'Active'

  },
  {
    id: 3,
    name: 'John Doe',
    gender: 'male',
    age: 30,
    phone: '1234567890',
    dob: new Date('1991-10-01'),
    email: '',
    education: 'B.Tech',
    referredBy: 'Dr. Smith',
    marketingPerson: 'Mr. Johnson',
    address: '123, Main Street, New York',
    registeredOn: new Date('2021-10-01'),
    registeredBy: 'Dr. Smith',
    status: 'Active'

  },
  {
    id: 4,
    name: 'John Doe',
    gender: 'male',
    age: 30,
    phone: '1234567890',
    dob: new Date('1991-10-01'),
    email: '',
    education: 'B.Tech',
    referredBy: 'Dr. Smith',
    marketingPerson: 'Mr. Johnson',
    address: '123, Main Street, New York',
    registeredOn: new Date('2021-10-01'),
    registeredBy: 'Dr. Smith',
    status: 'Active'

  },
  {
    id: 5,
    name: 'John Doe',
    gender: 'male',
    age: 30,
    phone: '1234567890',
    dob: new Date('1991-10-01'),
    email: '',
    education: 'B.Tech',
    referredBy: 'Dr. Smith',
    marketingPerson: 'Mr. Johnson',
    address: '123, Main Street, New York',
    registeredOn: new Date('2021-10-01'),
    registeredBy: 'Dr. Smith',
    status: 'Active'

  },
  {
    id: 6,
    name: 'John Doe',
    gender: 'male',
    age: 30,
    phone: '1234567890',
    dob: new Date('1991-10-01'),
    email: '',
    education: 'B.Tech',
    referredBy: 'Dr. Smith',
    marketingPerson: 'Mr. Johnson',
    address: '123, Main Street, New York',
    registeredOn: new Date('2021-10-01'),
    registeredBy: 'Dr. Smith',
    status: 'Active'

  },
  {
    id: 7,
    name: 'John Doe',
    gender: 'male',
    age: 30,
    phone: '1234567890',
    dob: new Date('1991-10-01'),
    email: '',
    education: 'B.Tech',
    referredBy: 'Dr. Smith',
    marketingPerson: 'Mr. Johnson',
    address: '123, Main Street, New York',
    registeredOn: new Date('2021-10-01'),
    registeredBy: 'Dr. Smith',
    status: 'Active'

  },
  {
    id: 8,
    name: 'John Doe',
    gender: 'male',
    age: 30,
    phone: '1234567890',
    dob: new Date('1991-10-01'),
    email: '',
    education: 'B.Tech',
    referredBy: 'Dr. Smith',
    marketingPerson: 'Mr. Johnson',
    address: '123, Main Street, New York',
    registeredOn: new Date('2021-10-01'),
    registeredBy: 'Dr. Smith',
    status: 'Active'

  }
]

const PatientsList: React.FC = () => {

  // const dispatch = useDispatch();
  const navigation = useNavigate()

  const columnsConfig: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 }, // Adjust the flex values based on your needs
    { field: 'name', headerName: 'Name', flex: 1, },
    { field: 'gender', headerName: 'Gender', flex: 1 },
    { field: 'age', headerName: 'Age', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'referredBy', headerName: 'Referred By', flex: 1 },
    { field: 'registeredOn', headerName: 'Registered On', type: 'date', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions', headerName: 'Actions', flex: 1, type: 'actions', getActions: (params) => {
        return [
          <IconButton size='small' key="edit" onClick={() => console.log('Edit', params.id)}> <Edit sx={{ fontSize: 16 }} /> </IconButton>,
          <IconButton size='small' key="delete" onClick={() => console.log('delete', params.id)}> <Delete sx={{ fontSize: 16 }} /> </IconButton>
        ]
      }
    }
  ];

  return (
    <ContentSection title="Patients" titleSx={{ justifyContent: 'space-between' }}>
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField label="Search" size="small" variant="outlined" />
        <Button variant="contained" startIcon={<Add />} color="secondary" onClick={() => navigation("/ivf-registration")}>
          Add Patient
        </Button>
      </Box>
      <Box mt={2}>
        <CustomDataGrid
          columns={columnsConfig}
          rows={patients}
          rowHover={true}
          onRowClick={(row) => {
            navigation(`/patients/${row.row.id}`)
          }}
        />
      </Box>
    </ContentSection>
  )
}

export default PatientsList