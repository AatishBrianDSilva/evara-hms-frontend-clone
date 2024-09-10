import Box from "@mui/material/Box";
import React, { useState } from "react";
import CustomDataGrid from "../../../../components/CustomDataGrid/CustomDataGrid";
import { useSelector } from "react-redux";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useToast } from "../../../../context/ToastContext";
import { Button, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useGetEstimationsQuery } from "../../../../services/patientDashboardService/billings/estimationApi";
import AddEstimations from "./AddEstimations";
import { RootState } from "../../../../app/store";
import { useAddBillingMutation } from "../../../../services/patientDashboardService/billings/billingApi";
import { useDeleteEstimationMutation } from "../../../../services/patientDashboardService/billings/estimationApi";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import EditEstimation from "./EditEstimation";
import { useNavigate } from "react-router-dom";
import { formatToIndianCurrencyFormat } from "../../../../utils/formatToIndianCurrencyFormat";

interface RowType {
  _id: string;
}

type checkRowType = {
  _id: string;
  estimatedTotal: number;
};

const BillingsEstimations: React.FC = () => {
  const navigate = useNavigate();
  const { showPromiseToast } = useToast();
  const { patient } = useSelector((state: RootState) => state.patients);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const [selectedRow, setSelectedRow] = useState<any | undefined>();
  const [checkedRows, setCheckedRows] = useState<checkRowType[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Add Modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Edit Modal
  // const openEditModal = (row: any) => {
  //   setSelectedRow(row)
  //   setIsEditModalOpen(true)
  // }
  const closeEditModal = () => {
    setSelectedRow(undefined);
    setIsEditModalOpen(false);
  };

  // Delete Modal
  const openDeleteModal = (row: any) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedRow(undefined);
    setIsDeleteModalOpen(false);
  };

  const {
    data: estimationsData,
    isLoading: estimationsLoading,
    isFetching: estimationsFetching,
  } = useGetEstimationsQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      filters: {
        patientCode: patient?.patientId,
        status: "Active",
      },
    },
    {
      skip: !patient?.patientId,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const patientEstimations = estimationsData?.data?.records || [];
  const patientEstimationsPagination = estimationsData?.data?.pagination;
  const patientEstimationLoading = estimationsLoading || estimationsFetching;

  console.log("Estimation Data", patientEstimations);

  const getRowId = (row: RowType) => row._id;

  const [deleteEstimation, { isLoading: isDeleteLoading }] = useDeleteEstimationMutation();

  const [addBillingMutation, { isLoading: isAddBillingMutationLoading }] = useAddBillingMutation();

  const columnsConfig: GridColDef[] = [
    {
      field: "serviceName",
      headerName: "Item",
      flex: 1,
    },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    {
      field: "estimatedUnitPrice",
      headerName: "MRP",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: "estimatedPrice",
      headerName: "Amount",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: "estimatedTax",
      headerName: "Tax",
      flex: 1,
      valueFormatter: (params) =>
        params.value ? formatToIndianCurrencyFormat(params.value) : "NA",
    },
    {
      field: "estimatedTotal",
      headerName: "Total Amount",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      cellClassName: "actions",
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          // <GridActionsCellItem
          //   icon={<Edit />}
          //   label="Edit"
          //   onClick={() => openEditModal(row)}
          // />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => openDeleteModal(row)}
          />,
        ];
      },
    },
  ];

  const handleContinue = async () => {
    const payload = {
      estimations: checkedRows.map((row) => row._id),
    };

    const promise = addBillingMutation(payload).unwrap();

    showPromiseToast(promise, {
      loading: `Generating Bill...`,
      success: () => "Bill generated successfully",
      error: () => "Error generating Bill",
    });

    try {
      await promise;
      navigate(`/patient/${patient?.patientId}/billings/pending`);
    } catch (error) {
      console.error("Error deleting estimation", error);
    }
  };

  const handleDelete = async () => {
    const id = selectedRow.id;
    const promise = deleteEstimation(id).unwrap();
    showPromiseToast(promise, {
      loading: "Deleting estimation...",
      success: () => "estimation deleted successfully",
      error: () => "Error deleting estimation",
    });

    try {
      await promise;
    } catch (error) {
      console.error("Error deleting estimation", error);
    }
    closeDeleteModal();
  };

  return (
    <Box p={2} display={"flex"} flexDirection={"column"} flex={1}>
      <Box display={"flex"} justifyContent="flex-end" alignItems="center" mb={3}>
        <Button startIcon={<Add />} variant="contained" color="primary" onClick={openAddModal}>
          Estimation
        </Button>
      </Box>

      <CustomDataGrid
        autoHeight={true}
        columns={columnsConfig}
        rows={patientEstimations}
        getRowId={getRowId}
        page={page}
        pageSize={pageSize}
        totalRows={patientEstimationsPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientEstimationLoading}
        sx={{ height: "100%" }}
        enablePagination={true}
        checkboxSelection={true}
        onSelectionChange={(newSelection) => {
          const selectedRows = newSelection
            .map((id) => {
              const row = patientEstimations.find((estimation) => estimation._id === id);
              return { _id: row?._id, estimatedTotal: row?.estimatedTotal };
            })
            .filter(
              (row) => row._id !== undefined && row.estimatedTotal !== undefined
            ) as checkRowType[];
          setCheckedRows(selectedRows);
        }}
      />

      {isAddModalOpen && <AddEstimations openModal={isAddModalOpen} onClose={closeAddModal} />}

      {selectedRow && isEditModalOpen && (
        <EditEstimation openModal={isEditModalOpen} onClose={closeEditModal} id={selectedRow.id} />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text={`${selectedRow?.serviceName}`}
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={isDeleteLoading}
        />
      )}

      <Box display={"flex"} justifyContent="flex-end" alignItems="center" mt={3} gap={2}>
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          gap={2}
          bgcolor={"secondary.main"}
          p={0.75}
          borderRadius={1}
          color={"white"}
          boxShadow={1}
        >
          <Typography>Total Amount:</Typography>
          <Typography>
            {formatToIndianCurrencyFormat(
              checkedRows.reduce((acc, row) => acc + row.estimatedTotal, 0)
            )}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          disabled={checkedRows.length === 0 || isAddBillingMutationLoading}
          onClick={handleContinue}
        >
          Generate Bill
        </Button>
      </Box>
    </Box>
  );
};

export default BillingsEstimations;
