import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import React, { useState } from "react";
import Add from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import AddTreatmentCycle from "./AddTreatmentCycle";
import { useGetDoctorsQuery } from "../../../../services/doctorsApi";
import { useGetMasterTreatmentCyclesQuery } from "../../../../services/masterDashboardService/serviceData/cycles/masterTreatmentCycleApi";
import { Chip, CircularProgress, Divider } from "@mui/material";
import { useGetTreatmentCyclesQuery } from "../../../../services/patientDashboardService/treatmentCycleApi";

import TreatmentCycleCard from "../../../../components/TreatmentCycleCard/TreatmentCycleCard";
import TreatmentCycleCardSkeleton from "../../../../components/TreatmentCycleCard/TreatmentCycleSkeleton";
import { useNavigate, useParams } from "react-router-dom";

const TreatmentCycles: React.FC = () => {
  const navigate = useNavigate();

  const { id, itemId } = useParams<{ id: string; itemId?: string }>();

  const { patient } = useSelector((state: RootState) => state.patients);

  // Get doctors
  const {
    data: DoctorsData,
    isLoading: DoctorsLoading,
    isFetching: DoctorFetching,
  } = useGetDoctorsQuery({});
  const doctors = DoctorsData?.data?.records || [];

  // Get master treatmentCycles
  const {
    data: MasterTreatmentCyclesData,
    isLoading: MasterTreatmentCyclesLoading,
    isFetching: MasterTreatmentCycleFetching,
  } = useGetMasterTreatmentCyclesQuery(
    {
      paginate: false,
      filters: {
        patientId: patient?.patientId,
      },
    },
    {
      skip: !patient?.patientId,
    }
  );
  const masterTreatmentCycles = MasterTreatmentCyclesData?.data || [];

  // Get patient treatmentCycles
  const {
    data: investgationsData,
    isLoading: treatmentCycleLoading,
    isFetching: treatmentCycleFetching,
  } = useGetTreatmentCyclesQuery(
    {
      filters: {
        patientCode: patient?.patientId,
        treatmentCycleId: itemId,
      },
      sort: {
        createdAt: -1,
      },
    },
    {
      skip: !patient?.patientId,
    }
  );
  const patientTreatmentCycles = investgationsData?.data || [];
  const patientTreatmentCyclesLoading = treatmentCycleLoading || treatmentCycleFetching;

  console.log("Cycle", patientTreatmentCycles);

  const loading =
    DoctorsLoading ||
    MasterTreatmentCyclesLoading ||
    DoctorFetching ||
    MasterTreatmentCycleFetching;

  const [addTreatmentCycleOpen, setAddTreatmentCycleOpen] = useState<boolean>(false);

  const closeForm = () => {
    setAddTreatmentCycleOpen(false);
  };

  const handleResetFilters = () => {
    navigate(`/patient/${id}/journey/cycle`);
  };

  const hasFilters = !!itemId;

  // Main return statement
  return (
    <Box p={2} display={"flex"} flexDirection={"column"} flex={1}>
      <Box display={"flex"} justifyContent="flex-end" alignItems="center" mb={3}>
        {hasFilters && (
          <Button variant="contained" color="primary" onClick={handleResetFilters} sx={{ mr: 2 }}>
            Remove Filter
          </Button>
        )}
        <Button
          startIcon={loading ? <CircularProgress size={16} color="secondary" /> : <Add />}
          variant="contained"
          color="primary"
          onClick={() => setAddTreatmentCycleOpen(true)}
        >
          Treatment Cycle
        </Button>
      </Box>

      <Box
        gap={2}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        {(patientTreatmentCyclesLoading && <TreatmentCycleCardSkeleton />) ||
          patientTreatmentCycles.map((treatmentCycle, index) => (
            <Box
              key={index}
              display={"flex"}
              flexDirection={"column"}
              width={"100%"}
              gap={2}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Divider textAlign="left" flexItem>
                <Chip
                  label={`Treatment: #${index + 1}`}
                  color={treatmentCycle.status === "Completed" ? "success" : "warning"}
                  size="small"
                />
              </Divider>
              <TreatmentCycleCard treatmentCycle={treatmentCycle} key={index} />
            </Box>
          ))}
      </Box>

      {addTreatmentCycleOpen && (
        <AddTreatmentCycle
          masterTreatmentCycles={masterTreatmentCycles}
          doctors={doctors}
          onClose={closeForm}
          open={addTreatmentCycleOpen}
        />
      )}
    </Box>
  );
};

export default TreatmentCycles;
