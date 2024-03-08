import { Box, CircularProgress } from '@mui/material'
import React, { useEffect } from 'react'
import ContentSection from '../../components/ContentSection/ContentSection';
import { useGetPatientByIdQuery } from '../../services/patientsApi';
import PatientDetails from './PatientDetails';
import PatientMainTab from './PatientMainTab';
import { useDispatch } from 'react-redux';
import { setCase, setPartnerId, setPatientId, setPatient, setPartner } from '../Patients/patientsSlice';
import { useParams } from 'react-router-dom';

const PatientsDashboard: React.FC = () => {

  const dispatch = useDispatch()
  const { patientId } = useParams<{ patientId: string }>();

  if (!patientId) {
    return <Box display='flex' justifyContent='center' alignItems='center' height='100vh'><CircularProgress /></Box>
  }

  const { data, isLoading, isFetching } = useGetPatientByIdQuery(patientId, {
    skip: !patientId,
  });

  useEffect(() => {
    if (data && data.status === "success") {
      const { patient, partner, case: patientCase } = data.data;

      if (patientCase) {
        dispatch(setCase(patientCase));
      }

      // Dispatch actions in response to successfully fetched data
      dispatch(setPatientId(patient.patientId));
      dispatch(setPatient(patient));

      if (partner) {
        dispatch(setPartnerId(partner.patientId));
        dispatch(setPartner(partner));
      }
    }
  }, [data, dispatch]);

  const renderDashboard = () => {
    if (isLoading || isFetching || !patientId) {
      return (<Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
        <CircularProgress />
      </Box>)
    } else {
      return (
        <>
          <PatientDetails />
          <PatientMainTab />
        </>
      )
    }
  }

  return (
    <ContentSection title="Patient Dashboard">
      {renderDashboard()}
    </ContentSection>
  )
}

export default PatientsDashboard