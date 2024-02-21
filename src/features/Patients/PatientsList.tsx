import { Button, Grid, TextField } from '@mui/material'
import React from 'react'
import { DatePicker } from '@mui/x-date-pickers'
import { GridColDef } from '@mui/x-data-grid'
import { setSelectedPatientId } from './patientsSlice'
import { useDispatch } from 'react-redux'
import CustomDataGrid from '../../components/Table/CustomDataGrid'

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

  const dispatch = useDispatch();

  const handleClick = (params: any) => {
    console.log(params);
    const patientId = params.row.id;
    // Dispatch action to store patient ID
    dispatch(setSelectedPatientId(params.row.id));
    localStorage.setItem('selectedPatientId', patientId.toString());
    // // Open a new tab with the patient's dashboard
    window.open(`patients/dashboard/${patientId}`, '_blank');
  };

  const viewPatient = (params: any) => {
    return <Button variant="text" size='small' color="primary" onClick={() => handleClick(params)}>{params.formattedValue}</Button>
  }

  const columnsConfig: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1, renderCell: viewPatient }, // Adjust the flex values based on your needs
    { field: 'name', headerName: 'Name', flex: 1, },
    { field: 'gender', headerName: 'Gender', flex: 1 },
    { field: 'age', headerName: 'Age', flex: .25 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'dob', headerName: 'DOB', type: 'date', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'education', headerName: 'Education', flex: 1 },
    { field: 'referredBy', headerName: 'Referred By', flex: 1 },
    { field: 'marketing-person', headerName: 'Marketing Person', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'registeredOn', headerName: 'Registered On', type: 'date', flex: 1 },
    { field: 'registeredBy', headerName: 'Registered By', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
  ];


  return (
    <div className="main-container">
      <Grid container spacing={3} mt={2} mb={4}>
        {/* Use Grid item for each child */}
        <Grid item>
          <DatePicker label="Start Date" format='dd-MM-yyyy' />
        </Grid>
        <Grid item>
          <DatePicker label="End Date" format='dd-MM-yyyy' />
        </Grid>
        <Grid item>
          <TextField label="Search" variant="outlined" placeholder='ID/Name/Mobile' />
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary">Search</Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="secondary">Export</Button>
        </Grid>
      </Grid>
      <CustomDataGrid
        columns={columnsConfig}
        rows={patients}
        pageSizeOptions={[25, 50]}
      />
    </div>
  )
}

export default PatientsList