import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import Description from "@mui/icons-material/Description";
import Edit from "@mui/icons-material/Edit";
import Medication from "@mui/icons-material/Medication";
import MonitorHeart from "@mui/icons-material/MonitorHeart";
import Person from "@mui/icons-material/Person";
import PersonSearch from "@mui/icons-material/PersonSearch";
import Print from "@mui/icons-material/Print";
import Troubleshoot from "@mui/icons-material/Troubleshoot";
import Delete from "@mui/icons-material/Delete";
import AddNotes from "./AddNotes";
import EditNotes from "./EditNotes";
import { useGetNotesQuery } from "../../../services/patientDashboardService/notesApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useGetDoctorsQuery } from "../../../services/doctorsApi";
import { IDoctor } from "../../../types/doctor";
import { Chip, CircularProgress } from "@mui/material";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import { useDeleteNotesMutation } from "../../../services/patientDashboardService/notesApi";
import { useToast } from "../../../context/ToastContext";
import { useGetNotesObservationsQuery } from "../../../services/masterDashboardService/local/notesObservationApi";
import { useGetNotesTreatmentAdvicesQuery } from "../../../services/masterDashboardService/local/notesTreatmentAdviceApi";
import { useGetMasterInvestigationsQuery } from "../../../services/masterDashboardService/serviceData/masterInvestigationApi";
import { useGetMasterProceduresQuery } from "../../../services/masterDashboardService/serviceData/masterProceduresApi";
import { useGetStocksQuery } from "../../../services/pharmacyDashboardService/stocksApi";

export interface INote {
  _id: string;
  doctor: IDoctor;
  observations: string[];
  observationNotes: string;
  medications: string[];
  medicationsNotes: string;
  investigations: string[];
  investigationsNotes: string;
  scans: string[];
  scansNotes: string;
  treatmentAdvices: string[];
  treatmentAdvicesNotes: string;
  notes: string;
  createdAt: string;
}

const Notes: React.FC = () => {
  const { showPromiseToast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editNotesData, setEditNotesData] = useState<INote>();

  const { patient } = useSelector((state: RootState) => state.patients);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    React.useState<boolean>(false);

  const [deleteNotes, { isLoading: deletingNotes }] = useDeleteNotesMutation();

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const {
    data: NotesData,
    isLoading: NotesLoading,
    isFetching: NotesFetching,
  } = useGetNotesQuery(
    {
      paginate: false,
      filters: {
        patient: patient?._id,
      },
    },
    { skip: !patient?._id }
  );

  const Notes: INote[] = Array.isArray(NotesData?.data) ? NotesData?.data : [];

  // Fetch observations
  const {
    data: observationsData,
    isLoading: observationsLoading,
    isFetching: observationsFetching,
  } = useGetNotesObservationsQuery({});

  const observations = observationsData?.data || [];

  // Fetch treatment advices
  const {
    data: treatmentAdvicesData,
    isLoading: treatmentAdvicesLoading,
    isFetching: treatmentAdvicesFetching,
  } = useGetNotesTreatmentAdvicesQuery({});

  const treatmentAdvices = treatmentAdvicesData?.data || [];

  // Fetch investigations
  const {
    data: investigationsData,
    isLoading: investigationsLoading,
    isFetching: investigationsFetching,
  } = useGetMasterInvestigationsQuery({
    filters: {
      patientCode: patient?.patientId,
    },
  });

  const investigations = investigationsData?.data || [];

  // Fetch scans
  const {
    data: scansData,
    isLoading: scansLoading,
    isFetching: scansFetching,
  } = useGetMasterProceduresQuery({
    filters: {
      patientCode: patient?.patientId,
    },
  });

  const scans = scansData?.data || [];

  // Fetch medications
  const {
    data: medicationsData,
    isLoading: medicationsLoading,
    isFetching: medicationsFetching,
  } = useGetStocksQuery();

  const medications = medicationsData?.data || [];

  const {
    data,
    isLoading: DoctorLoading,
    isFetching: DoctorFetching,
  } = useGetDoctorsQuery({});

  const doctors = data?.data?.records || [];

  if (
    NotesLoading ||
    NotesFetching ||
    DoctorLoading ||
    DoctorFetching ||
    observationsLoading ||
    observationsFetching ||
    treatmentAdvicesLoading ||
    treatmentAdvicesFetching ||
    investigationsLoading ||
    investigationsFetching ||
    scansLoading ||
    scansFetching ||
    medicationsLoading ||
    medicationsFetching
  ) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  console.log({
    observations,
    treatments: treatmentAdvices,
    investigations,
    scans,
    medications,
  });

  const handleAddModalOpen = () => {
    setShowAddModal(true);
  };

  const handleEditModalOpen = (note: any) => {
    setEditNotesData(note);
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleNotesDelete = (note: any) => {
    const noteId = note._id;
    setSelectedNoteId(noteId); // Set the selected note ID
    openDeleteDialog();
  };

  const handleNotesConfirm = async () => {
    if (selectedNoteId !== null) {
      // Check if selectedNoteId is not null
      const noteId: string = selectedNoteId;
      const promise = deleteNotes(noteId).unwrap();
      showPromiseToast(promise, {
        loading: "Deleting Note...",
        success: () => "Note deleted successfully",
        error: () => "Error Deleting Note",
      });

      try {
        await promise;
        closeDeleteDialog();
      } catch (error) {
        console.error("Error deleting Note", error);
      }
    }
  };

  const renderBoxes = (
    key: string,
    items: string[],
    icon: React.ReactNode,
    notes: string
  ) => {
    const cycleColors = (key: string) => {
      switch (key) {
        case "Observations":
          return "lightpink";
        case "Medications":
          return "lightgreen";
        case "Investigations":
          return "lightyellow";
        case "Scans":
          return "lightblue";
        case "Treatment Advices":
          return "lightgray";
        default:
          return "lightgray";
      }
    };

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0,0,0,0.2)",
          px: 1,
          py: 0.2,
        }}
      >
        <Box sx={{ flex: 1, display: "flex", gap: 1.5, alignItems: "center" }}>
          <Box
            sx={{
              backgroundColor: cycleColors(key),
              p: 1,
              borderRadius: 2,
              display: "flex",
            }}
          >
            {icon}
          </Box>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              maxWidth: 100,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "wrap",
            }}
          >
            {key}
          </Typography>
        </Box>
        <Grid container sx={{ flex: 1 }}>
          <List>
            <Grid container sx={{ flex: 1 }} direction="row">
              {items.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  variant="outlined"
                  sx={{ mr: 1, mb: 1, backgroundColor: cycleColors(key) }}
                />
              ))}
            </Grid>
          </List>
        </Grid>
        <Grid container sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, mt: 2 }}>
            Notes:
            <Typography
              component={"span"}
              sx={{ fontSize: "0.9rem", fontWeight: 500, mt: 2, ml: 1 }}
            >
              {notes}
            </Typography>
          </Typography>
        </Grid>
      </Box>
    );
  };

  const renderNotes = () => {
    return (
      <Stepper orientation="vertical" sx={{ py: 2, px: 1 }}>
        {Notes.map((note, index) => (
          <Step key={index} active>
            <StepLabel StepIconComponent={coloredStepper}>
              <Typography variant="caption">
                {getDatePart(note.createdAt)}
              </Typography>
            </StepLabel>
            <StepContent sx={{ px: 4, py: 0 }}>
              <Typography sx={{ fontSize: "1rem", mb: 1 }}>
                {/* Notes entered by {note.doctor} */}
                Notes entered by Dr. {note.doctor?.firstName}{" "}
                {note.doctor?.lastName}
              </Typography>
              <Box
                sx={{
                  backgroundColor: "rgba(0,0,0,0.02)",
                  p: 2,
                  px: 3,
                  borderRadius: 2,
                  boxShadow: 5,
                }}
              >
                {renderBoxes(
                  "Observations",
                  note.observations,
                  <PersonSearch />,
                  note.observationNotes
                )}
                {renderBoxes(
                  "Medications",
                  note.medications,
                  <Medication />,
                  note.medicationsNotes
                )}
                {renderBoxes(
                  "Investigations",
                  note.investigations,
                  <MonitorHeart />,
                  note.investigationsNotes
                )}
                {renderBoxes(
                  "Scans",
                  note.scans,
                  <Troubleshoot />,
                  note.scansNotes
                )}
                {renderBoxes(
                  "Treatment Advices",
                  note.treatmentAdvices,
                  <Description />,
                  note.treatmentAdvicesNotes
                )}
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, mt: 2 }}>
                  Notes: {note.notes}
                </Typography>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Edit
                    onClick={() => handleEditModalOpen(note)}
                    sx={{ cursor: "pointer" }}
                  />
                  <Print sx={{ cursor: "pointer" }} />
                  <Delete onClick={() => handleNotesDelete(note)} />
                </Box>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    );
  };

  const coloredStepper = () => {
    return (
      <div
        style={{
          backgroundColor: "gray",
          color: "#fff",
          width: 40,
          height: 40,
          display: "flex",
          borderRadius: "50%",
          marginBottom: 7,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Person />
      </div>
    );
  };

  // Function to extract date part from a timestamp
  const getDatePart = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5">Patient Notes</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 2, py: 1, textTransform: "uppercase" }}
          onClick={handleAddModalOpen}
        >
          Add Note
        </Button>
      </Box>
      <Box>{renderNotes()}</Box>
      <AddNotes
        closeModal={handleModalClose}
        addModal={showAddModal}
        observations={observations}
        treatmentAdvices={treatmentAdvices}
        investigations={investigations}
        scans={scans}
        medications={medications}
        doctors={doctors}
      />
      <EditNotes
        closeModal={handleModalClose}
        addModal={showEditModal}
        observations={observations}
        treatmentAdvices={treatmentAdvices}
        investigations={investigations}
        scans={scans}
        medications={medications}
        notesData={editNotesData as INote}
      />

      <DeleteConfirmationModal
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleNotesConfirm}
        text={"Note"}
        loading={deletingNotes}
      />
    </Box>
  );
};

export default Notes;
