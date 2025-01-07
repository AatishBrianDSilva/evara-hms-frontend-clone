import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import Box from '@mui/material/Box';

import React, { useState } from 'react';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Circle from '@mui/icons-material/Circle';
import Edit from '@mui/icons-material/Edit';
import Print from '@mui/icons-material/Print';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';
import {
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import AddInvestigation from './AddInvestigation';
import { useGetMasterInvestigationsQuery } from '../../../../services/masterDashboardService/serviceData/masterInvestigationApi';
import { CircularProgress } from '@mui/material';
import {
  useDeleteInvestigationMutation,
  useGetInvestigationsQuery,
} from '../../../../services/patientDashboardService/investigationApi';
import ReportModal from '../../../../components/ReportModal/ReportModal';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { useToast } from '../../../../context/ToastContext';
import PrintInvestigation from './PrintInvestigation';
import {
  closeEditInvestigation,
  openEditInvestigation,
} from './investigationSlice';
import BloodTests from './Both/BloodTests';
import SemenAnalysis from './Male/SemenAnalysis';
import UltraSoundScan from './Female/UltraSoundScan';
import { ETestType } from '../../../../types/master';
import SpermDFI from './Male/SpermDFI';
import EndometrialAssessment from './Female/EndometrialAssessment';
import EarlyPregnancyScan from './Female/EarlyPregnancyScan';
import { usePrint } from '../../../../context/PrintPDFContext';
import { Visibility } from '@mui/icons-material';
import ViewReports from '../ViewReports';
import { useNavigate, useParams } from 'react-router-dom';
import RoleGuard from '../../../../components/RoleGuard/RoleGuard';
import { EUserRole } from '../../../../types/masterDashboard/global';

const Investigations: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id, itemId } = useParams<{ id: string; itemId?: string }>();

  const { showPromiseToast } = useToast();
  const { fetchAndPrintPdf } = usePrint();

  const { patient } = useSelector((state: RootState) => state.patients);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isViewReportsModalOpen, setIsViewReportsModalOpen] =
    useState<boolean>(false);

  // // Get doctors
  // const {
  //   data: DoctorsData,
  //   isLoading: DoctorsLoading,
  //   isFetching: DoctorFetching,
  // } = useGetDoctorsQuery({});
  // const doctors = DoctorsData?.data?.records || [];

  // Get master investigations
  const {
    data: MasterInvestigationsData,
    // error: MasterInvestigationsError,
    isLoading: MasterInvestigationsLoading,
    isFetching: MasterInvestigationFetching,
  } = useGetMasterInvestigationsQuery(
    {
      paginate: false,
      filters: {
        patientId: patient?.patientId,
      },
    },
    {
      skip: !patient?.patientId,
    },
  );
  const masterInvestigations = MasterInvestigationsData?.data || [];

  // Get patient investigations
  const {
    data: investgationsData,
    isLoading: investigationLoading,
    isFetching: investigationFetching,
  } = useGetInvestigationsQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      filters: {
        patientCode: patient?.patientId,
        investigationId: itemId,
      },
    },
    {
      skip: !patient?.patientId,
    },
  );
  const patientInvestigations = investgationsData?.data?.records || [];
  const patientInvestigationsPagination = investgationsData?.data?.pagination;
  const patientInvestigationsLoading =
    investigationLoading || investigationFetching;

  // console.log("Patient Investigations", patientInvestigations);

  // Delete investigation
  const [deleteInvestigation, { isLoading: deletingInvestigation }] =
    useDeleteInvestigationMutation();

  const loading =
    // DoctorsLoading ||
    MasterInvestigationsLoading ||
    // DoctorFetching ||
    MasterInvestigationFetching;

  // Get the state of the edit investigation dialog
  const { editInvestigationOpen } = useSelector(
    (state: RootState) => state.investigation,
  );

  // State variables for controlling various dialogs
  const [addInvestigationOpen, setAddInvestigationOpen] =
    useState<boolean>(false);
  const [printInvestigationOpen, setPrintInvestigationOpen] = useState<{
    id: string;
    status: boolean;
  }>({ id: '', status: false });
  const [deleteInvestigationOpen, setDeleteInvestigationOpen] = useState<{
    id: string;
    name: string;
    status: boolean;
  }>({ id: '', name: '', status: false });

  // Columns configuration for the data grid
  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      type: 'date',
      valueFormatter: params =>
        new Date(params.value as string).toLocaleDateString(),
    },
    {
      field: 'investigation',
      headerName: 'Investigation',
      flex: 1,
      valueGetter(params) {
        return params.row?.investigation?.name;
      },
    },
    {
      field: 'doctor',
      headerName: 'Doctor',
      flex: 1,
      valueGetter(params) {
        return params.row.doctor?.firstName + ' ' + params.row.doctor?.lastName;
      },
    },
    { field: 'status', headerName: 'Status', flex: 1 },
    // { field: "notes", headerName: "Notes", flex: 0.5 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      align: 'right',
      flex: 1,
      cellClassName: 'actions',
      // custom actions for the actions column
      getActions: (params: GridRowParams) => {
        const row = params.row;

        if (row.status === 'Completed') {
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
      field: 'stage',
      headerName: 'Stage',
      renderCell(params) {
        return (
          <Grid container>
            {params.row.status === 'Completed' ? (
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
    dispatch(openEditInvestigation({ id: id, status: true }));
  };

  const handleDeleteClick = (rowData: any) => {
    setDeleteInvestigationOpen({
      id: rowData.id,
      name: rowData.investigation?.test?.testName,
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
    // console.log("Front end Files", files);
    setSelectedFiles(files);
    openViewReportsModal();
  };

  const closeDeleteDialog = () => {
    setDeleteInvestigationOpen({ id: '', name: '', status: false });
  };

  const handleInvestigationDelete = async () => {
    const id = deleteInvestigationOpen.id;
    const promise = deleteInvestigation(id).unwrap();
    showPromiseToast(promise, {
      loading: 'Deleting investigation...',
      success: () => 'Investigation deleted successfully',
      error: () => 'Error deleting investigation',
    });

    try {
      await promise;
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting investigation', error);
    }
  };

  const closeForm = () => {
    setAddInvestigationOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const renderEditInvestigationComponent = () => {
    const investigation = patientInvestigations.find(
      inv => inv._id === editInvestigationOpen.id,
    );

    switch (investigation?.investigation.test.testType) {
      case ETestType.BloodTest:
        return <BloodTests />;
      case ETestType.SemenAnalysis:
        return <SemenAnalysis />;
      case ETestType.EarlyPregnancyScan:
        return <EarlyPregnancyScan />;
      case ETestType.SpermDFI:
        return <SpermDFI />;
      case ETestType.UltrasoundScan:
        return <UltraSoundScan />;
      case ETestType.BaseLineFollicularMonitoring:
        return <>BaseLineFollicularMonitoring</>;
      case ETestType.EndometrialAssessment:
        return <EndometrialAssessment />;
      case ETestType.EarlyPregnancyScan:
        return <>EarlyPregnancyScan</>;
      default:
        return <>Unkown Investigation</>;
    }
  };

  const handleResetFilters = () => {
    setPage(1);
    setPageSize(25);
    navigate(`/patient/${id}/journey/investigations`);
  };

  const hasFilters = !!itemId;

  // Main return statement
  return (
    <Box p={2} display={'flex'} flexDirection={'column'} flex={1}>
      <Box
        display={'flex'}
        justifyContent="flex-end"
        alignItems="center"
        mb={3}
      >
        {hasFilters && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleResetFilters}
            sx={{ mr: 2 }}
          >
            Remove Filter
          </Button>
        )}
        <RoleGuard
          allowedRoles={[
            EUserRole.Doctor,
            EUserRole.Nurse,
            EUserRole.Admin,
            EUserRole.CenterManager,
            EUserRole.Embryologist,
          ]}
        >
          <Button
            startIcon={
              loading ? (
                <CircularProgress size={16} color="secondary" />
              ) : (
                <Add />
              )
            }
            variant="contained"
            color="primary"
            onClick={() => setAddInvestigationOpen(true)}
          >
            Investigation
          </Button>
        </RoleGuard>
      </Box>
      <CustomDataGrid
        autoHeight={true}
        columns={columns}
        rows={patientInvestigations}
        page={page}
        pageSize={pageSize}
        totalRows={patientInvestigationsPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientInvestigationsLoading}
        sx={{ height: '100%' }}
        enablePagination={true}
      />

      {addInvestigationOpen && (
        <AddInvestigation
          masterInvestigations={masterInvestigations}
          // doctors={doctors}
          onClose={closeForm}
          open={addInvestigationOpen}
        />
      )}
      {editInvestigationOpen.status && (
        <ReportModal
          open={editInvestigationOpen}
          onClose={() => dispatch(closeEditInvestigation())}
        >
          {renderEditInvestigationComponent()}
        </ReportModal>
      )}
      {deleteInvestigationOpen.status && (
        <DeleteConfirmationModal
          open={deleteInvestigationOpen.status}
          onClose={closeDeleteDialog}
          onConfirm={handleInvestigationDelete}
          text={`Investigation ${deleteInvestigationOpen.name}`}
          loading={deletingInvestigation}
        />
      )}
      {printInvestigationOpen.status && (
        <PrintInvestigation
          open={printInvestigationOpen}
          onClose={() => setPrintInvestigationOpen({ id: '', status: false })}
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

export default Investigations;
