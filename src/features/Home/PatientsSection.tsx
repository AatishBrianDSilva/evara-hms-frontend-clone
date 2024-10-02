import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ArrowForward, AssignmentLate } from "@mui/icons-material";
import PatientSummaryCard from "../../components/PatientSummaryCard/PatientSummaryCard";
import SkeletonPatientSummaryCard from "../../components/PatientSummaryCard/Skeleton";
import { Button, Link } from "@mui/material";
import PatientCard from "../../components/PatientCard/PatientCard";
import { calculateAge } from "../../utils/calculateAge";
import SkeletonPatientCard from "../../components/PatientCard/Skeleton";
import { useGetPatientSummaryQuery } from "../../services/homeApi";

interface PatientsSectionProps {
  startDate: Date | null;
  endDate: Date | null;
}

const PatientsSection: React.FC<PatientsSectionProps> = ({ startDate, endDate }) => {
  // Fetch patients for the selected date range
  const {
    data: patientsData,
    isLoading: isPatientLoading,
    isFetching: isPatientFetching,
  } = useGetPatientSummaryQuery(
    {
      dateRange: {
        startDate: startDate?.toISOString() || "",
        endDate: endDate?.toISOString() || "",
      },
    },
    {
      skip: !startDate || !endDate,
    }
  );

  const patientSummary = patientsData?.data;
  const loading = isPatientLoading || isPatientFetching;

  return (
    <Box display="flex" flexDirection="column" gap={2} overflow={"hidden"}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="button" color="primary">
          Patients
        </Typography>
      </Box>
      <Box display="flex" gap={2}>
        {loading ? (
          <SkeletonPatientSummaryCard />
        ) : (
          <PatientSummaryCard
            newPatients={patientSummary?.patientCount || 0}
            newDonors={patientSummary?.donorsCount || 0}
          />
        )}
        <Box
          flex={1}
          display="flex"
          flexDirection={"column"}
          border="1px solid"
          borderColor="primary.main"
          borderRadius={4}
          p={2}
          overflow={"hidden"}
        >
          <Typography variant="button" color="primary">
            New Patients
          </Typography>
          <Box display="flex" flex={1} overflow="auto" flexWrap="nowrap" gap={2}>
            {loading ? (
              [1, 2, 3].map((_, index) => <SkeletonPatientCard key={index} />)
            ) : patientSummary?.patients && patientSummary?.patients.length > 0 ? (
              patientSummary?.patients.map((patient) => (
                <PatientCard
                  key={patient._id}
                  patientId={patient.patientId}
                  profileUrl={patient.image}
                  firstName={patient.firstName}
                  lastName={patient.lastName}
                  age={calculateAge(new Date(patient.dob))}
                  gender={patient.gender}
                />
              ))
            ) : (
              <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flex={1}>
                <Box display="flex" alignItems="center" sx={{ m: 2 }}>
                  <AssignmentLate color="info" sx={{ mr: 1 }} />
                  <Typography variant="body1" color="textSecondary">
                    No new patients registered
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="text"
          color="primary"
          endIcon={<ArrowForward />}
          component={Link}
          href={"/patients"}
        >
          View All
        </Button>
      </Box>
    </Box>
  );
};

export default PatientsSection;
