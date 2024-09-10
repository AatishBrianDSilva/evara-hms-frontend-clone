import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import Box from "@mui/material/Box";

import React, { useState } from "react";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Circle from "@mui/icons-material/Circle";
import Edit from "@mui/icons-material/Edit";
import Print from "@mui/icons-material/Print";
import CustomDataGrid from "../../../../components/CustomDataGrid/CustomDataGrid";
import { GridColDef, GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import AddProcedure from "./AddProcedure";
import { useGetDoctorsQuery } from "../../../../services/doctorsApi";
import { useGetMasterProceduresQuery } from "../../../../services/masterDashboardService/serviceData/masterProceduresApi";
import { CircularProgress } from "@mui/material";
import {
  useDeleteProcedureMutation,
  useGetProceduresQuery,
} from "../../../../services/patientDashboardService/procedureApi";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import { useToast } from "../../../../context/ToastContext";
import PrintProcedure from "./PrintProcedure";
import { closeEditProcedure, openEditProcedure } from "./procedureSlice";

import ReportModal from "../../../../components/ReportModal/ReportModal";
import { EProcedureType } from "../../../../types/master";
import PGT from "./Both/PGT";
import Tesa from "./Male/Tesa";
import Hysteroscopy from "./Female/Hysteroscopy";
import { usePrint } from "../../../../context/PrintPDFContext";
import Laparoscopy from "./Female/Laproscopy";
import { Visibility } from "@mui/icons-material";
import ViewReports from "../ViewReports";
import { useNavigate, useParams } from "react-router-dom";

const Procedures: React.FC = () => {
  const { id, itemId } = useParams<{ id: string; itemId?: string }>();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { showPromiseToast } = useToast();
  const { fetchAndPrintPdf } = usePrint();

  const { patient } = useSelector((state: RootState) => state.patients);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isViewReportsModalOpen, setIsViewReportsModalOpen] = useState<boolean>(false);

  // Get doctors
  const {
    data: DoctorsData,
    isLoading: DoctorsLoading,
    isFetching: DoctorFetching,
  } = useGetDoctorsQuery({});
  const doctors = DoctorsData?.data?.records || [];

  // Get master procedures
  const {
    data: MasterProceduresData,
    isLoading: MasterProceduresLoading,
    isFetching: MasterProcedureFetching,
  } = useGetMasterProceduresQuery(
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
  const masterProcedures = MasterProceduresData?.data || [];

  console.log("Master procedures", masterProcedures);

  // Get patient procedures
  const {
    data: investgationsData,
    isLoading: procedureLoading,
    isFetching: procedureFetching,
  } = useGetProceduresQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      filters: {
        patientCode: patient?.patientId,
        procedureId: itemId,
      },
    },
    {
      skip: !patient?.patientId,
    }
  );
  const patientProcedures = investgationsData?.data?.records || [];
  const patientProceduresPagination = investgationsData?.data?.pagination;
  const patientProceduresLoading = procedureLoading || procedureFetching;

  console.log("Patient procedures", patientProcedures);

  // Delete procedure
  const [deleteProcedure, { isLoading: deletingProcedure }] = useDeleteProcedureMutation();

  const loading =
    DoctorsLoading || MasterProceduresLoading || DoctorFetching || MasterProcedureFetching;

  // Get the state of the edit procedure dialog
  const { editProcedureOpen } = useSelector((state: RootState) => state.procedure);

  // State variables for controlling various dialogs
  const [addProcedureOpen, setAddProcedureOpen] = useState<boolean>(false);
  const [printProcedureOpen, setPrintProcedureOpen] = useState<{ id: string; status: boolean }>({
    id: "",
    status: false,
  });
  const [deleteProcedureOpen, setDeleteProcedureOpen] = useState<{
    id: string;
    name: string;
    status: boolean;
  }>({ id: "", name: "", status: false });

  // Columns configuration for the data grid
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      type: "date",
      valueFormatter: (params) => new Date(params.value as string).toLocaleDateString(),
    },
    {
      field: "procedure",
      headerName: "Procedure",
      flex: 1,
      valueGetter(params) {
        return params.row.procedure?.procedure?.procedureName;
      },
    },
    {
      field: "doctor",
      headerName: "Doctor",
      flex: 1,
      valueGetter(params) {
        return params.row.doctor?.firstName + " " + params.row.doctor?.lastName;
      },
    },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "notes", headerName: "Notes", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      align: "right",
      flex: 1,
      cellClassName: "actions",
      // custom actions for the actions column
      getActions: (params: GridRowParams) => {
        const row = params.row;

        if (row.status === "Completed") {
          return [
            <GridActionsCellItem
              icon={<Visibility />}
              label="View Reports"
              onClick={() => handleViewReportsClick(row.result?.files)}
            />,
            <GridActionsCellItem
              icon={<Print />}
              label="Print"
              onClick={() => fetchAndPrintPdf(row.id)}
            />,
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              onClick={() => handleEditClick(row.id)}
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              onClick={() => handleDeleteClick(row)}
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => handleEditClick(row.id)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDeleteClick(row)}
          />,
        ];
      },
    },

    {
      field: "stage",
      headerName: "Stage",
      renderCell(params) {
        return (
          <Grid container>
            {params.row.status === "Completed" ? (
              <CheckCircle color="success" />
            ) : (
              <Circle color="warning" />
            )}
          </Grid>
        );
      },
    },
  ];

  const handleEditClick = (id: string) => {
    dispatch(openEditProcedure({ id: id, status: true }));
  };

  // const handlePrintClick = (id: string) => {
  //   setPrintProcedureOpen({
  //     id: id,
  //     status: true,
  //   });
  // };

  const handleDeleteClick = (rowData: any) => {
    setDeleteProcedureOpen({
      id: rowData.id,
      name: rowData.procedure?.procedure?.procedureName,
      status: true,
    });
  };

  const openViewReportsModal = () => {
    setIsViewReportsModalOpen(true);
  };

  const closeViewReportsModal = () => {
    setIsViewReportsModalOpen(false);
  };

  const handleViewReportsClick = (files: string[]) => {
    setSelectedFiles(files);
    openViewReportsModal();
  };

  const closeDeleteDialog = () => {
    setDeleteProcedureOpen({ id: "", name: "", status: false });
  };

  const handleProcedureDelete = async () => {
    const id = deleteProcedureOpen.id;
    const promise = deleteProcedure(id).unwrap();
    showPromiseToast(promise, {
      loading: "Deleting procedure...",
      success: () => "Procedure deleted successfully",
      error: () => "Error deleting procedure",
    });

    try {
      await promise;
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting procedure", error);
    }
  };

  const closeForm = () => {
    setAddProcedureOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const renderEditProcedure = () => {
    const procedure = patientProcedures.find((inv) => inv._id === editProcedureOpen.id);

    switch (procedure?.procedure.procedure.procedureType) {
      case EProcedureType.PGT:
        return <PGT doctors={doctors} />;
      case EProcedureType.TESA:
        return <Tesa doctors={doctors} />;
      case EProcedureType.Hysteroscopy:
        return <Hysteroscopy doctors={doctors} />;
      case EProcedureType.Laparoscopy:
        return <Laparoscopy doctors={doctors} />;
      default:
        return <>Unkown Procedure</>;
    }
  };

  const handleResetFilters = () => {
    setPage(1);
    setPageSize(25);
    navigate(`/patient/${id}/journey/procedure`);
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
          onClick={() => setAddProcedureOpen(true)}
        >
          Procedure
        </Button>
      </Box>
      <CustomDataGrid
        autoHeight={true}
        columns={columns}
        rows={patientProcedures}
        page={page}
        pageSize={pageSize}
        totalRows={patientProceduresPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientProceduresLoading}
        sx={{ height: "100%" }}
        enablePagination={true}
      />

      {addProcedureOpen && (
        <AddProcedure
          masterProcedures={masterProcedures}
          doctors={doctors}
          onClose={closeForm}
          open={addProcedureOpen}
        />
      )}
      {editProcedureOpen.status && (
        <ReportModal open={editProcedureOpen} onClose={() => dispatch(closeEditProcedure())}>
          {renderEditProcedure()}
        </ReportModal>
      )}
      {deleteProcedureOpen.status && (
        <DeleteConfirmationModal
          open={deleteProcedureOpen.status}
          onClose={closeDeleteDialog}
          onConfirm={handleProcedureDelete}
          text={`Procedure ${deleteProcedureOpen.name}`}
          loading={deletingProcedure}
        />
      )}
      {printProcedureOpen.status && (
        <PrintProcedure
          open={printProcedureOpen}
          onClose={() => setPrintProcedureOpen({ id: "", status: false })}
        />
      )}
      {isViewReportsModalOpen && (
        <ViewReports
          openModal={isViewReportsModalOpen}
          onClose={closeViewReportsModal}
          // id={selectedRow}
          files={selectedFiles}
        />
      )}
    </Box>
  );
};

export default Procedures;
