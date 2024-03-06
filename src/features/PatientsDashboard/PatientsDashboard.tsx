import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import ContentSection from '../../components/ContentSection/ContentSection';
import { useParams } from 'react-router-dom';
import { useGetPatientByIdQuery } from '../../services/patientsApi';
import { IPatient } from '../../types/types';
import PatientDetails from './PatientDetails';
import PatientMainTab from './PatientMainTab';

const PatientsDashboard: React.FC = () => {

  const { patientId } = useParams<{ patientId: string }>();

  if (!patientId) {
    return <Box display='flex' justifyContent='center' alignItems='center' height='100vh'><CircularProgress /></Box>
  }

  const { data, isLoading, isFetching } = useGetPatientByIdQuery(patientId, {
    skip: !patientId
  });

  const patient: IPatient = data?.data
  console.log("patient", patient)

  const renderDashboard = () => {
    if (isLoading || isFetching) {
      return (<Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
        <CircularProgress />
      </Box>)
    } else {
      return (
        <>
          <PatientDetails patient={patient} />
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