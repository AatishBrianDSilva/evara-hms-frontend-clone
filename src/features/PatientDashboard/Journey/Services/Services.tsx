import Button from "@mui/material/Button";

import Box from "@mui/material/Box";

import React, { useState } from "react";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";

import CustomDataGrid from "../../../../components/CustomDataGrid/CustomDataGrid";
import { GridColDef, GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import AddService from "./AddService";
import { useGetDoctorsQuery } from "../../../../services/doctorsApi";
import { useGetMasterServicesQuery } from "../../../../services/masterDashboardService/serviceData/masterServicesApi";
import { CircularProgress } from "@mui/material";
import {
  useDeleteServiceMutation,
  useGetServicesQuery,
} from "../../../../services/patientDashboardService/serviceApi";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import { useToast } from "../../../../context/ToastContext";
import { useNavigate, useParams } from "react-router-dom";

const Services: React.FC = () => {
  const { showPromiseToast } = useToast();
  const navigate = useNavigate();

  const { patient } = useSelector((state: RootState) => state.patients);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const { id, itemId } = useParams<{ id: string; itemId?: string }>();

  // Get doctors
  const {
    data: DoctorsData,
    isLoading: DoctorsLoading,
    isFetching: DoctorFetching,
  } = useGetDoctorsQuery({});
  const doctors = DoctorsData?.data?.records || [];

  // Get master services
  const {
    data: MasterServicesData,
    // error: MasterServicesError,
    isLoading: MasterServicesLoading,
    isFetching: MasterServiceFetching,
  } = useGetMasterServicesQuery(
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
  const masterServices = MasterServicesData?.data || [];

  // Get patient services
  const {
    data: servicesData,
    isLoading: serviceLoading,
    isFetching: serviceFetching,
  } = useGetServicesQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      filters: {
        patientCode: patient?.patientId,
        serviceId: itemId,
      },
    },
    {
      skip: !patient?.patientId,
    }
  );
  const patientServices = servicesData?.data?.records || [];
  const patientServicesPagination = servicesData?.data?.pagination;
  const patientServicesLoading = serviceLoading || serviceFetching;

  // Delete service
  const [deleteService, { isLoading: deletingService }] = useDeleteServiceMutation();

  const loading =
    DoctorsLoading || MasterServicesLoading || DoctorFetching || MasterServiceFetching;

  // State variables for controlling various dialogs
  const [addServiceOpen, setAddServiceOpen] = useState<boolean>(false);
  const [deleteServiceOpen, setDeleteServiceOpen] = useState<{
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
      field: "service",
      headerName: "Service",
      flex: 1,
      valueGetter(params) {
        return params.row.service?.name;
      },
    },
    {
      field: "doctor",
      headerName: "Doctor",
      flex: 1,
      valueGetter(params) {
        if (params.row.doctor) {
          return params.row.doctor?.firstName + " " + params.row.doctor?.lastName;
        }
        return "N/A";
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      cellClassName: "actions",
      // custom actions for the actions column
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDeleteClick(row)}
          />,
        ];
      },
    },
  ];

  const handleDeleteClick = (rowData: any) => {
    setDeleteServiceOpen({
      id: rowData.id,
      name: rowData.service?.service?.name,
      status: true,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteServiceOpen({ id: "", name: "", status: false });
  };

  const handleServiceDelete = async () => {
    const id = deleteServiceOpen.id;
    const promise = deleteService(id).unwrap();
    showPromiseToast(promise, {
      loading: "Deleting service...",
      success: () => "Service deleted successfully",
      error: () => "Error deleting service",
    });

    try {
      await promise;
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting service", error);
    }
  };

  const closeForm = () => {
    setAddServiceOpen(false);
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
    navigate(`/patient/${id}/journey/services`);
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
          onClick={() => setAddServiceOpen(true)}
        >
          Service
        </Button>
      </Box>
      <CustomDataGrid
        autoHeight={true}
        columns={columns}
        rows={patientServices}
        page={page}
        pageSize={pageSize}
        totalRows={patientServicesPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientServicesLoading}
        sx={{ height: "100%" }}
        enablePagination={true}
      />

      {addServiceOpen && (
        <AddService
          masterServices={masterServices}
          doctors={doctors}
          onClose={closeForm}
          open={addServiceOpen}
        />
      )}
      {deleteServiceOpen.status && (
        <DeleteConfirmationModal
          open={deleteServiceOpen.status}
          onClose={closeDeleteDialog}
          onConfirm={handleServiceDelete}
          text={`Service ${deleteServiceOpen.name}`}
          loading={deletingService}
        />
      )}
    </Box>
  );
};

export default Services;
