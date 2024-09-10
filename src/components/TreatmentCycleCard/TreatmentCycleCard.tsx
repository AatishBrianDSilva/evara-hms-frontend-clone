import React from "react";
import {
  IPatientTreatmentCycle,
  IPatientTreatmentCycleChecklist,
  IPatientTreatmentCycleMetric,
  IPatientTreatmentCycleProtocol,
  IPatientTreatmentCycleReport,
} from "../../types/patientDashboard/treatmentCycle";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import { ETreatmentCycleMetric, ETreatmentCycleReport } from "../../types/master";
import {
  Assessment,
  Assignment,
  AssignmentTurnedIn,
  CheckCircle,
  Circle,
  Summarize,
} from "@mui/icons-material";
import TreatmentCycleList from "./TreatmentCycleList";
import IUIProtocol from "../../features/PatientDashboard/Journey/TreatmentCycle/Protocols/IUIProtocol";
import PregnancyOutcomeBetaHCG from "../../features/PatientDashboard/Journey/TreatmentCycle/Metrics/PregnancyOutcomeBetaHCG";
import IUIChecklist from "../../features/PatientDashboard/Journey/TreatmentCycle/Checklists/IUIChecklist";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import { useToast } from "../../context/ToastContext";
import { useDeleteTreatmentCycleMutation } from "../../services/patientDashboardService/treatmentCycleApi";
import IUIHReport from "../../features/PatientDashboard/Journey/TreatmentCycle/Reports/IUIHReport";
import IUIDReport from "../../features/PatientDashboard/Journey/TreatmentCycle/Reports/IUIDReport";
import EmbryoTransferReport from "../../features/PatientDashboard/Journey/TreatmentCycle/Reports/IVFReport";
import IVFProtocol from "../../features/PatientDashboard/Journey/TreatmentCycle/Protocols/IVFProtocol";
import IVFChecklist from "../../features/PatientDashboard/Journey/TreatmentCycle/Checklists/IVFChecklist";
import OocyteAspirationReportForm from "../../features/PatientDashboard/Journey/TreatmentCycle/Reports/OPUReport";
import IVFCycleSummary from "../../features/PatientDashboard/Journey/TreatmentCycle/Reports/IVFCycleSummary";
import EmbryologyWorksheet from "../../features/PatientDashboard/Journey/TreatmentCycle/Metrics/EmbryologyWorksheet";

interface ITreatmentCycleCardProps {
  treatmentCycle: IPatientTreatmentCycle;
}

const TreatmentCycleCard: React.FC<ITreatmentCycleCardProps> = ({ treatmentCycle }) => {
  const theme = useTheme();
  const { showPromiseToast } = useToast();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState<boolean>(false);

  const [deleteTreatmentCycle, { isLoading: deletingTreatmentCycle }] =
    useDeleteTreatmentCycleMutation();

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleTreatmentCycleDelete = async () => {
    const id = treatmentCycle._id;
    const promise = deleteTreatmentCycle(id).unwrap();
    showPromiseToast(promise, {
      loading: "Deleting Treatment Cycle...",
      success: () => "Treatment Cycle deleted successfully",
      error: () => "Error Deleting Treatment Cycle",
    });

    try {
      await promise;
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting treatmentCycle", error);
    }
  };

  const renderProtocol = (protocols: IPatientTreatmentCycleProtocol[]) => {
    return (
      <Box display="flex" flex={3} flexDirection="column" gap={2}>
        {protocols.map((protocol, index) => {
          let content: React.ReactNode;
          let contentProps = { protocol, treatmentCycleId: treatmentCycle._id };

          switch (protocol.name) {
            case "IUI Protocol":
              content = <IUIProtocol {...contentProps} />;
              break;
            case "IVF Protocol":
              content = <IVFProtocol {...contentProps} />;
              break;

            default:
              content = <Typography>Unknown Protocol</Typography>;
          }

          return <TreatmentCycleList key={index} content={content} contentProps={contentProps} />;
        })}
      </Box>
    );
  };

  const renderChecklist = (checklists: IPatientTreatmentCycleChecklist[]) => {
    return (
      <Box display="flex" flex={3} flexDirection="column" gap={2}>
        {checklists.map((checklist, index) => {
          let content: React.ReactNode;
          let contentProps = { checklist, treatmentCycleId: treatmentCycle._id };
          switch (checklist.name) {
            case "IVF Checklist":
              content = <IVFChecklist {...contentProps} />;
              break;
            case "IUI Checklist":
              content = <IUIChecklist {...contentProps} />;
              break;
            default:
              content = <Typography>Unknown Checklist</Typography>;
          }

          return <TreatmentCycleList key={index} content={content} contentProps={contentProps} />;
        })}
      </Box>
    );
  };

  const renderReport = (reports: IPatientTreatmentCycleReport[]) => {
    return (
      <Box display="flex" flex={3} flexDirection="column" gap={2}>
        {reports.map((report, index) => {
          let content: React.ReactNode;
          let contentProps = { report, treatmentCycleId: treatmentCycle._id };
          console.log("report", report.reportType);
          switch (report.reportType) {
            case ETreatmentCycleReport.IUIDReport:
              content = <IUIDReport {...contentProps} />;
              break;
            case ETreatmentCycleReport.IUIHReport:
              content = <IUIHReport {...contentProps} />;
              break;
            case ETreatmentCycleReport.EmbryoTransferReport:
              content = <EmbryoTransferReport {...contentProps} />;
              break;
            case ETreatmentCycleReport.OPUReport: // Render the OocyteAspirationReportForm component for OPUReport case
              content = <OocyteAspirationReportForm {...contentProps} />;
              break;
            case ETreatmentCycleReport.IVFSummaryReport:
              content = (
                <IVFCycleSummary
                  contentProps={{
                    report: report,
                    treatmentCycleId: treatmentCycle._id,
                  }}
                  {...contentProps}
                />
              );
              break;

            default:
              content = <Typography>Unknown Report</Typography>;
          }

          return <TreatmentCycleList key={index} content={content} contentProps={contentProps} />;
        })}
      </Box>
    );
  };

  const renderMetric = (metrics: IPatientTreatmentCycleMetric[]) => {
    return (
      <Box display="flex" flex={3} flexDirection="column" gap={2}>
        {metrics.map((metric, index) => {
          let content: React.ReactNode;
          let contentProps = { metric, treatmentCycleId: treatmentCycle._id };
          switch (metric.metricType) {
            case ETreatmentCycleMetric.PregnancyOutcomeBetaHCGMetric:
              content = <PregnancyOutcomeBetaHCG {...contentProps} />;
              break;
            case ETreatmentCycleMetric.EmbryologyWorksheetMetric:
              content = <EmbryologyWorksheet {...contentProps} />;
              break;
            default:
              content = <Typography>Unknown Metric</Typography>;
          }

          return <TreatmentCycleList key={index} content={content} contentProps={contentProps} />;
        })}
      </Box>
    );
  };

  return (
    <>
      <Box
        width={"60%"}
        border={1}
        borderRadius={1}
        borderColor={theme.palette.secondary.main}
        mb={2}
      >
        <Box
          gap={2}
          p={2}
          display={"flex"}
          alignItems={"center"}
          borderBottom={2}
          borderColor={theme.palette.secondary.main}
        >
          <Box display={"flex"} flex={1} justifyItems={"flex-start"} alignItems={"center"} gap={2}>
            <Typography variant="button" color={"primary"}>
              <Typography component={"span"} variant="button" color={"secondary"}>
                Cycle:{" "}
              </Typography>
              #{treatmentCycle.cycleNo}
            </Typography>
            <Typography variant="button" color={"primary"}>
              {new Date(treatmentCycle.date).toLocaleDateString()}
            </Typography>
          </Box>
          <Typography flex={3} textAlign={"center"} variant="button" color={"primary"}>
            {treatmentCycle.cycle?.name}
          </Typography>
          <Box display={"flex"} flex={1} justifyContent={"flex-end"} alignItems={"center"} gap={1}>
            {treatmentCycle.status === "Completed" ? (
              <CheckCircle fontSize="small" color="success" />
            ) : (
              <Circle fontSize="small" color="warning" />
            )}
            <Box>
              <IconButton color="primary" size="small" onClick={openDeleteDialog}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box
          gap={2}
          p={2}
          display={"flex"}
          alignItems={"center"}
          borderBottom={1}
          borderColor={theme.palette.secondary.main}
        >
          <Box
            display={"flex"}
            flex={1}
            justifyContent={"flex-start"}
            alignItems={"center"}
            gap={1}
          >
            <Assignment color="primary" />{" "}
            <Typography fontSize={12} variant="button" color={"secondary"}>
              Protocols
            </Typography>
          </Box>
          {renderProtocol(treatmentCycle.protocols)}
          <Box display={"flex"} flex={1} justifyContent={"flex-end"} alignItems={"center"} gap={1}>
            {treatmentCycle.protocols.every((cat) => cat.status === "Completed") ? (
              <CheckCircle fontSize="small" color="success" />
            ) : (
              <Circle fontSize="small" color="warning" />
            )}
          </Box>
        </Box>

        <Box
          gap={2}
          p={2}
          display={"flex"}
          alignItems={"center"}
          borderBottom={1}
          borderColor={theme.palette.secondary.main}
        >
          <Box
            display={"flex"}
            flex={1}
            justifyContent={"flex-start"}
            alignItems={"center"}
            gap={1}
          >
            <AssignmentTurnedIn color="primary" />{" "}
            <Typography fontSize={12} variant="button" color={"secondary"}>
              Checklist
            </Typography>
          </Box>
          {renderChecklist(treatmentCycle.checklists)}
          <Box display={"flex"} flex={1} justifyContent={"flex-end"} alignItems={"center"} gap={1}>
            {treatmentCycle.checklists.every((cat) => cat.status === "Completed") ? (
              <CheckCircle fontSize="small" color="success" />
            ) : (
              <Circle fontSize="small" color="warning" />
            )}
          </Box>
        </Box>

        <Box
          gap={2}
          p={2}
          display={"flex"}
          alignItems={"center"}
          borderBottom={1}
          borderColor={theme.palette.secondary.main}
        >
          <Box
            display={"flex"}
            flex={1}
            justifyContent={"flex-start"}
            alignItems={"center"}
            gap={1}
          >
            <Summarize color="primary" />{" "}
            <Typography fontSize={12} variant="button" color={"secondary"}>
              Reports
            </Typography>
          </Box>
          {renderReport(treatmentCycle.reports)}
          <Box display={"flex"} flex={1} justifyContent={"flex-end"} alignItems={"center"} gap={1}>
            {treatmentCycle.reports.every((cat) => cat.status === "Completed") ? (
              <CheckCircle fontSize="small" color="success" />
            ) : (
              <Circle fontSize="small" color="warning" />
            )}
          </Box>
        </Box>

        <Box
          gap={2}
          p={2}
          display={"flex"}
          alignItems={"center"}
          borderColor={theme.palette.secondary.main}
        >
          <Box
            display={"flex"}
            flex={1}
            justifyContent={"flex-start"}
            alignItems={"center"}
            gap={1}
          >
            <Assessment color="primary" />{" "}
            <Typography fontSize={12} variant="button" color={"secondary"}>
              Metrics
            </Typography>
          </Box>
          {renderMetric(treatmentCycle.metrics)}
          <Box display={"flex"} flex={1} justifyContent={"flex-end"} alignItems={"center"} gap={1}>
            {treatmentCycle.metrics.every((cat) => cat.status === "Completed") ? (
              <CheckCircle fontSize="small" color="success" />
            ) : (
              <Circle fontSize="small" color="warning" />
            )}
          </Box>
        </Box>
      </Box>

      <DeleteConfirmationModal
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleTreatmentCycleDelete}
        text={`Treatment Cycle ${treatmentCycle.cycle?.name}`}
        loading={deletingTreatmentCycle}
      />
    </>
  );
};

export default TreatmentCycleCard;
