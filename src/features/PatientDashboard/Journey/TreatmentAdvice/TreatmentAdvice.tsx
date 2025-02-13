import React, { useState } from 'react';
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import Add from '@mui/icons-material/Add';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import AddTreatmentAdvice from './AddTreatmentAdvice';
import { Tooltip } from '@mui/material';

import {
  useGetTreatmentAdvicesQuery,
  useDeleteTreatmentAdviceMutation,
} from '../../../../services/patientDashboardService/treatmentAdviceApi';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { useToast } from '../../../../context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Visibility } from '@mui/icons-material';
import ViewTreatmentAdvice from './ViewTreatmentAdvice';
import RoleGuard from '../../../../components/RoleGuard/RoleGuard';
import { EUserRole } from '../../../../types/masterDashboard/global';
import EditTreatmentAdvice from './EditTreatmentAdvice';

const TreatmentAdvice: React.FC = () => {
  const { id, itemId } = useParams<{ id: string; itemId?: string }>();

  const navigate = useNavigate();

  const { showPromiseToast } = useToast();

  const { patient } = useSelector((state: RootState) => state.patients);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedEditTreatmentAdvice, setSelectedEditTreatmentAdvice] =
    useState<any | null>(null);

  // Get patient treatment advice
  const {
    data: treatmentAdvicesData,
    isLoading: treatmentAdviceLoading,
    isFetching: treatmentAdviceFetching,
  } = useGetTreatmentAdvicesQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      filters: {
        patientCode: patient?.patientId,
      },
    },
    {
      skip: !patient?.patientId,
    },
  );

  const patientTreatmentAdvices = treatmentAdvicesData?.data?.records || [];
  const patientTreatmentAdvicesPagination =
    treatmentAdvicesData?.data?.pagination;
  const patientTreatmentAdvicesLoading =
    treatmentAdviceLoading || treatmentAdviceFetching;

  // Delete treatment advice
  const [deleteTreatmentAdvice, { isLoading: deletingTreatmentAdvice }] =
    useDeleteTreatmentAdviceMutation();

  // State variables for controlling various dialogs
  const [addTreatmentAdviceOpen, setAddTreatmentAdviceOpen] =
    useState<boolean>(false);
  const [deleteTreatmentAdviceOpen, setDeleteTreatmentAdviceOpen] = useState<{
    id: string;
    name: string;
    status: boolean;
  }>({ id: '', name: '', status: false });

  const [selectedTreatmentAdvice, setSelectedTreatmentAdvice] = useState<
    any | null
  >(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  const handleViewClick = (row: any) => {
    setSelectedTreatmentAdvice(row);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedTreatmentAdvice(null);
    setIsViewModalOpen(false);
  };

  const handleEditClick = (row: any) => {
    setSelectedEditTreatmentAdvice(row);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedEditTreatmentAdvice(null);
    setIsEditModalOpen(false);
  };

  // Columns configuration for the data grid
  const columns: GridColDef[] = [
    {
      field: 'treatmentAdvice',
      headerName: 'Treatment Advice',
      flex: 1,
    },
    {
      field: 'tentativeDate',
      headerName: 'Tentative Date',
      flex: 1,
      valueGetter: params =>
        new Date(params.row.tentativeDate).toLocaleDateString(),
    },
    {
      field: 'comments',
      headerName: 'Comments',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        return [
          <Tooltip title="View">
            <GridActionsCellItem
              icon={<Visibility />}
              label="View"
              onClick={() => handleViewClick(params.row)}
            />
          </Tooltip>,
          <Tooltip title="Edit">
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              onClick={() => handleEditClick(params.row)}
            />
          </Tooltip>,
        ];
      },
    },
  ];

  const closeDeleteDialog = () => {
    setDeleteTreatmentAdviceOpen({ id: '', name: '', status: false });
  };

  const handleTreatmentAdviceDelete = async () => {
    const id = deleteTreatmentAdviceOpen.id;
    const promise = deleteTreatmentAdvice(id).unwrap();
    showPromiseToast(promise, {
      loading: 'Deleting treatment advice...',
      success: () => 'Treatment advice deleted successfully',
      error: () => 'Error deleting treatment advice',
    });

    try {
      await promise;
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting treatment advice', error);
    }
  };

  const closeForm = () => {
    setAddTreatmentAdviceOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleResetFilters = () => {
    setPage(1);
    setPageSize(25);
    navigate(`/patient/${id}/journey/treatmentAdvice`);
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
            startIcon={<Add />}
            variant="contained"
            color="primary"
            onClick={() => setAddTreatmentAdviceOpen(true)}
          >
            Treatment Advice
          </Button>
        </RoleGuard>
      </Box>
      <CustomDataGrid
        autoHeight={true}
        columns={columns}
        rows={patientTreatmentAdvices}
        page={page}
        pageSize={pageSize}
        totalRows={patientTreatmentAdvicesPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientTreatmentAdvicesLoading}
        sx={{ height: '100%' }}
        enablePagination={true}
      />

      {addTreatmentAdviceOpen && (
        <AddTreatmentAdvice onClose={closeForm} open={addTreatmentAdviceOpen} />
      )}
      {deleteTreatmentAdviceOpen.status && (
        <DeleteConfirmationModal
          open={deleteTreatmentAdviceOpen.status}
          onClose={closeDeleteDialog}
          onConfirm={handleTreatmentAdviceDelete}
          text={`Treatment Advice ${deleteTreatmentAdviceOpen.name}`}
          loading={deletingTreatmentAdvice}
        />
      )}
      {isViewModalOpen && selectedTreatmentAdvice && (
        <ViewTreatmentAdvice
          open={isViewModalOpen}
          onClose={closeViewModal}
          treatmentAdvice={selectedTreatmentAdvice}
        />
      )}

      {isEditModalOpen && selectedEditTreatmentAdvice && (
        <EditTreatmentAdvice
          open={isEditModalOpen}
          onClose={closeEditModal}
          treatmentAdvice={selectedEditTreatmentAdvice}
        />
      )}
    </Box>
  );
};

export default TreatmentAdvice;
