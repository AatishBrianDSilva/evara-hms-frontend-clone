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
import AddCryoPreservation from './AddCryoPreservation';
import { useGetMasterCryoPreservationsQuery } from '../../../../services/masterDashboardService/serviceData/masterCryoPreservationApi';
import { CircularProgress } from '@mui/material';
import {
  useDeleteCryoPreservationMutation,
  useGetCryoPreservationsQuery,
} from '../../../../services/patientDashboardService/cryoPreservationApi';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { useToast } from '../../../../context/ToastContext';
import PrintCryoPreservation from './PrintCryoPreservation';
import {
  closeEditCryoPreservation,
  openEditCryoPreservation,
} from './cryoPreservationSlice';

import ReportModal from '../../../../components/ReportModal/ReportModal';
import { ECryoPreservationType } from '../../../../types/master';
import Tesa from './Male/Sperm';
import Embryo from './Female/Embryo';
import { usePrint } from '../../../../context/PrintPDFContext';
import { Visibility } from '@mui/icons-material';
import ViewReports from '../ViewReports';
import { useNavigate, useParams } from 'react-router-dom';

const CryoPreservations: React.FC = () => {
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

  // Get master cryoPreservations
  const {
    data: MastercryoPreservationsData,
    isLoading: MastercryoPreservationsLoading,
    isFetching: MastercryoPreservationFetching,
  } = useGetMasterCryoPreservationsQuery(
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
  const mastercryoPreservations = MastercryoPreservationsData?.data || [];

  // Get patient cryoPreservations
  const {
    data: investgationsData,
    isLoading: cryoPreservationLoading,
    isFetching: cryoPreservationFetching,
  } = useGetCryoPreservationsQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      filters: {
        patientCode: patient?.patientId,
        cryoPreservationId: itemId,
      },
    },
    {
      skip: !patient?.patientId,
    },
  );
  const patientcryoPreservations = investgationsData?.data?.records || [];
  const patientcryoPreservationsPagination =
    investgationsData?.data?.pagination;
  const patientcryoPreservationsLoading =
    cryoPreservationLoading || cryoPreservationFetching;

  console.log('Patient Cryo data', patientcryoPreservations);

  // Delete cryoPreservation
  const [deletecryoPreservation, { isLoading: deletingcryoPreservation }] =
    useDeleteCryoPreservationMutation();

  const loading =
    MastercryoPreservationsLoading || MastercryoPreservationFetching;

  // Get the state of the edit cryoPreservation dialog
  const { editCryoPreservationOpen } = useSelector(
    (state: RootState) => state.cryoPreservation,
  );

  // State variables for controlling various dialogs
  const [addcryoPreservationOpen, setAddcryoPreservationOpen] =
    useState<boolean>(false);
  const [printcryoPreservationOpen, setPrintcryoPreservationOpen] = useState<{
    id: string;
    status: boolean;
  }>({ id: '', status: false });
  const [deletecryoPreservationOpen, setDeletecryoPreservationOpen] = useState<{
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
      field: 'cryoPreservation',
      headerName: 'Cryo-Preservation',
      flex: 1,
      valueGetter(params) {
        return params.row.cryo?.name;
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
    {
      field: 'dateofexpiry',
      headerName: 'Date Of Expiry',
      flex: 1,
      valueGetter: params => {
        const details = params.row.details?.details;
        return details?.dateOfExpiry || details?.mediaExpiryDate || '';
      },
      valueFormatter: params => {
        if (!params.value) return ''; // Return empty string if no value
        const date = new Date(params.value);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
      },
    },
    // { field: "notes", headerName: "Notes", flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      align: 'right',
      cellClassName: 'actions',
      // custom actions for the actions column
      getActions: (params: GridRowParams) => {
        const row = params.row;
        if (row.status === 'Completed') {
          return [
            <GridActionsCellItem
              icon={<Visibility />}
              label="View Reports"
              onClick={() => handleViewReportsClick(row.details?.files)}
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
    dispatch(openEditCryoPreservation({ id: id, status: true }));
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

  // const handlePrintClick = (id: string) => {
  //   setPrintcryoPreservationOpen({
  //     id: id,
  //     status: true,
  //   });
  // };

  const handleDeleteClick = (rowData: any) => {
    setDeletecryoPreservationOpen({
      id: rowData.id,
      name: rowData.cryo?.cryoPreservation?.cryoPreservationName,
      status: true,
    });
  };

  const closeDeleteDialog = () => {
    setDeletecryoPreservationOpen({ id: '', name: '', status: false });
  };

  const handlecryoPreservationDelete = async () => {
    const id = deletecryoPreservationOpen.id;
    const promise = deletecryoPreservation(id).unwrap();
    showPromiseToast(promise, {
      loading: 'Deleting cryoPreservation...',
      success: () => 'cryoPreservation deleted successfully',
      error: () => 'Error deleting cryoPreservation',
    });

    try {
      await promise;
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting cryoPreservation', error);
    }
  };

  const closeForm = () => {
    setAddcryoPreservationOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const renderEditcryoPreservation = () => {
    const cryoPreservation = patientcryoPreservations.find(
      inv => inv._id === editCryoPreservationOpen.id,
    );

    switch (cryoPreservation?.cryo.cryoPreservation.cryoPreservationType) {
      case ECryoPreservationType.Embryo:
        return <Embryo />;
      case ECryoPreservationType.Sperm:
        return <Tesa />;
      default:
        return <>Unkown CryoPreservation</>;
    }
  };

  const handleResetFilters = () => {
    setPage(1);
    setPageSize(25);
    navigate(`/patient/${id}/journey/cryo-preservation`);
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
        <Button
          startIcon={
            loading ? <CircularProgress size={16} color="secondary" /> : <Add />
          }
          variant="contained"
          color="primary"
          onClick={() => setAddcryoPreservationOpen(true)}
        >
          Cryo-Preservation
        </Button>
      </Box>
      <CustomDataGrid
        autoHeight={true}
        columns={columns}
        rows={patientcryoPreservations}
        page={page}
        pageSize={pageSize}
        totalRows={patientcryoPreservationsPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientcryoPreservationsLoading}
        sx={{ height: '100%' }}
        enablePagination={true}
      />

      {addcryoPreservationOpen && (
        <AddCryoPreservation
          masterCryoPreservations={mastercryoPreservations}
          onClose={closeForm}
          open={addcryoPreservationOpen}
        />
      )}
      {editCryoPreservationOpen.status && (
        <ReportModal
          open={editCryoPreservationOpen}
          onClose={() => dispatch(closeEditCryoPreservation())}
        >
          {renderEditcryoPreservation()}
        </ReportModal>
      )}
      {deletecryoPreservationOpen.status && (
        <DeleteConfirmationModal
          open={deletecryoPreservationOpen.status}
          onClose={closeDeleteDialog}
          onConfirm={handlecryoPreservationDelete}
          text={`Cryo-Preservation ${deletecryoPreservationOpen.name}`}
          loading={deletingcryoPreservation}
        />
      )}
      {printcryoPreservationOpen.status && (
        <PrintCryoPreservation
          open={printcryoPreservationOpen}
          onClose={() =>
            setPrintcryoPreservationOpen({ id: '', status: false })
          }
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

export default CryoPreservations;
