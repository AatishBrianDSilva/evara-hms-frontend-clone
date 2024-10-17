import React, { useCallback, useState } from "react";
import ContentSection from "../../../../components/ContentSection/ContentSection";
import { Box, Button, TextField } from "@mui/material";
import { Add, Circle, Edit } from "@mui/icons-material";
import CustomDataGrid from "../../../../components/CustomDataGrid/CustomDataGrid";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import AddDrugLocation from "./AddDrugLocation";
import Delete from "@mui/icons-material/Delete";
import EditDrugLocation from "./EditDrugLocation";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  useDeleteDrugLocationMutation,
  useGetDrugLocationsQuery,
} from "../../../../services/pharmacyDashboardService/master/drugLocationApi";
import { useToast } from "../../../../context/ToastContext";
import _ from "lodash";

const DrugLocation: React.FC = () => {
  const { showPromiseToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = React.useState(25);

  const handleSearchChange = useCallback((query: string) => {
    setPage(1); // Reset the page
    setSearchQuery(query);
  }, []);

  // Debounce the search handling
  const debouncedSearchChange = useCallback(
    _.debounce(handleSearchChange, 500),
    [handleSearchChange] // Ensure that handleSearchChange is stable
  );

  const [selectedRow, setSelectedRow] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const {
    data: drugLocationData,
    isLoading: drugLocationLoading,
    isFetching: drugLocationFetching,
  } = useGetDrugLocationsQuery({
    paginate: true,
    page: page,
    limit: pageSize,
    searchQuery: searchQuery,
    sort: { location: 1 },
  });
  const drugLocations = drugLocationData?.data?.records || [];
  const drugLocationsPagination = drugLocationData?.data?.pagination;
  const drugLocationsLoading = drugLocationLoading || drugLocationFetching;

  const [deleteDrugLocation, { isLoading }] = useDeleteDrugLocationMutation();
  const handleDelete = async () => {
    const promise = deleteDrugLocation(selectedRow).unwrap();

    showPromiseToast(promise, {
      loading: "Deleting...",
      success: (data) => data || "Deleted Successfully",
      error: (data) => data || "Failed to Delete",
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }

    closeDeleteModal();
  };

  const columnsConfig: GridColDef[] = [
    { field: "location", headerName: "Drug Location", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },

    { field: "notes", headerName: "Notes", flex: 2 },
    {
      field: "main",
      headerName: "Primary location",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      renderCell: (params) => {
        return params.value ? <Circle color="success" /> : <Circle />;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      type: "actions",
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => handleEditClick(row.id)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDeleteClick(row.id)}
          />,
        ];
      },
    },
  ];

  // Add Modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Edit Modal
  const openEditModal = () => {
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Delete Modal
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEditClick = (id: string) => {
    setSelectedRow(id);
    openEditModal();
  };

  const handleDeleteClick = (id: string) => {
    setSelectedRow(id);
    openDeleteModal();
  };

  return (
    <ContentSection title="Drug Location">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Location"
          size="small"
          variant="outlined"
          onChange={(e) => debouncedSearchChange(e.target.value)}
        />
        <Button variant="contained" startIcon={<Add />} color="primary" onClick={openAddModal}>
          Add Item
        </Button>
      </Box>

      <Box mt={2} flex={"1 1 auto"}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={drugLocations}
          page={page}
          pageSize={pageSize}
          totalRows={drugLocationsPagination?.totalDocs || 0}
          loading={drugLocationsLoading}
          sx={{ height: "100%" }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      {isAddModalOpen && <AddDrugLocation openModal={isAddModalOpen} onClose={closeAddModal} />}

      {isEditModalOpen && (
        <EditDrugLocation openModal={isEditModalOpen} onClose={closeEditModal} id={selectedRow} />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text="this Drug Location"
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={isLoading}
        />
      )}
    </ContentSection>
  );
};

export default DrugLocation;
