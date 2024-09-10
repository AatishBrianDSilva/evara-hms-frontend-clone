import React, { useState } from "react";
import ContentSection from "../../../../components/ContentSection/ContentSection";
import { Box, Button } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import CustomDataGrid from "../../../../components/CustomDataGrid/CustomDataGrid";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import Delete from "@mui/icons-material/Delete";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import { useToast } from "../../../../context/ToastContext";
import _ from "lodash";
import {
  useGetConsentsQuery,
  useDeleteConsentMutation,
} from "../../../../services/masterDashboardService/local/consentApi";
import AddConsent from "./AddConsents";
import EditConsent from "./EditConsents";

interface RowType {
  _id: string;
}

const Consent: React.FC = () => {
  const { showPromiseToast } = useToast();

  const [selectedRow, setSelectedRow] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const {
    data: ConsentData,
    isLoading: ConsentLoading,
    isFetching: ConsentFetching,
  } = useGetConsentsQuery({ paginate: false, filters: { isAdmin: true, isGlobal: false } });

  const Consents = ConsentData?.data || [];

  console.log("Consent Data", Consents);

  const getRowId = (row: RowType) => row._id;

  const columnsConfig: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "purpose",
      headerName: "Purpose",
      flex: 1,
    },
    {
      field: "associatedWith",
      headerName: "Associated With",
      flex: 1,
    },
    {
      field: "file",
      headerName: "file",
      flex: 1,
    },
    {
      field: "clinicId",
      headerName: "Clinic Id",
      flex: 1,
    },
    { field: "branchId", headerName: "Branch Id", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => handleEditClick(row._id)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDeleteClick(row._id)}
          />,
        ];
      },
    },
  ];

  const [deleteUser, { isLoading: DeleteLoading }] = useDeleteConsentMutation();

  const handleDelete = async () => {
    const promise = deleteUser(selectedRow).unwrap();

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
    <ContentSection title="Consents">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          // disabled={}
          onClick={openAddModal}
        >
          Add Consent
        </Button>
      </Box>

      <Box mt={2} flex={"1 1 auto"}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={Consents}
          loading={ConsentLoading || ConsentFetching}
          sx={{ height: "100%" }}
          getRowId={getRowId}
        />
      </Box>

      {isAddModalOpen && <AddConsent openModal={isAddModalOpen} onClose={closeAddModal} />}

      {isEditModalOpen && (
        <EditConsent openModal={isEditModalOpen} onClose={closeEditModal} id={selectedRow} />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text="this Consent"
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={DeleteLoading}
        />
      )}
    </ContentSection>
  );
};

export default Consent;
