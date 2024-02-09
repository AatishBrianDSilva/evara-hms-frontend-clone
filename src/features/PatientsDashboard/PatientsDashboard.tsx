import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import PatientInfo from './PatientInfo';
import TreatmentCyclesTable from './TreatmentCyclesTable';
import { setSelectedPatientId } from '../Patients/patientsSlice';
import { useDispatch } from 'react-redux';

const PatientsDashboard: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Retrieve patient ID from localStorage
    const storedPatientId = localStorage.getItem('selectedPatientId');
    if (storedPatientId) {
      dispatch(setSelectedPatientId(parseInt(storedPatientId, 10)));
      // Optionally clear the stored ID if it's no longer needed
      localStorage.removeItem('selectedPatientId');
    }
  }, []);

  return (
    <div className='main-container'>
      <Box sx={{ marginTop: 1 }}>
        <PatientInfo />
        <TreatmentCyclesTable />
      </Box>
    </div>
  )
}

export default PatientsDashboard