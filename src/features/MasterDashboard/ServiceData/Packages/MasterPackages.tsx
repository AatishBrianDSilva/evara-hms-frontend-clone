import React, { useCallback, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Add, Edit, Visibility } from "@mui/icons-material";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import _ from "lodash";
import ContentSection from "../../../../components/ContentSection/ContentSection";
import CustomDataGrid from "../../../../components/CustomDataGrid/CustomDataGrid";
import AddMasterPackage from "./AddMasterPackage";
import { useGetMasterPackagesQuery } from "../../../../services/masterDashboardService/serviceData/masterPackagesApi"; // Import the correct API hook
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import ViewMasterPackage from "./ViewMasterPackage";
import EditMasterPackage from "./EditMasterPackage";

interface RowType {
  _id: string;
}

const MasterPackages: React.FC = () => {
  const patientData = useSelector((state: RootState) => state.patients.patientId);

  console.log("Patient Data", patientData);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // New state for edit modal

  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Debounce the search handling
  const debouncedSearchChange = useCallback(
    _.debounce(handleSearchChange, 500),
    [handleSearchChange] // Ensure that handleSearchChange is stable
  );

  const {
    data: packagesData,
    isLoading: packagesLoading,
    isFetching: packagesFetching,
  } = useGetMasterPackagesQuery({ paginate: false, searchQuery });

  const packages = packagesData?.data || [];

  const getRowId = (row: RowType) => row._id;

  const columnsConfig: GridColDef[] = [
    {
      field: "name",
      headerName: "Package Name",
      flex: 1,
    },
    {
      field: "cost",
      headerName: "Price",
      flex: 1,
    },
    {
      field: "validTill",
      headerName: "Valid Till",
      flex: 1,
      type: "date",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : null,
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      renderCell: (params) => <>{params.value ? "Yes" : "No"}</>,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            disabled={false}
            icon={<Visibility />}
            label="View"
            onClick={() => handleViewClick(row._id)}
          />,
          <GridActionsCellItem
            disabled={false}
            icon={<Edit />}
            label="View"
            onClick={() => handleEditClick(row._id)}
          />,
        ];
      },
    },
  ];

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };
  const handleViewClick = (id: string) => {
    setSelectedPackageId(id);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
  };

  const handleEditClick = (id: string) => {
    setSelectedPackageId(id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <ContentSection title="Packages">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Package Name"
          size="small"
          variant="outlined"
          onChange={(e) => debouncedSearchChange(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          disabled={false}
          onClick={openAddModal}
        >
          Add Package
        </Button>
      </Box>

      <Box mt={2} flex={"1 1 auto"} style={{ maxWidth: "100%", overflowX: "auto" }}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={packages}
          loading={packagesLoading || packagesFetching}
          sx={{ height: "100%" }}
          getRowId={getRowId}
        />
      </Box>

      {isAddModalOpen && <AddMasterPackage openModal={isAddModalOpen} onClose={closeAddModal} />}
      {isViewModalOpen && selectedPackageId && (
        <ViewMasterPackage
          openModal={isViewModalOpen}
          onClose={closeViewModal}
          id={selectedPackageId}
        />
      )}
      {isEditModalOpen && selectedPackageId && (
        <EditMasterPackage
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedPackageId}
        />
      )}
    </ContentSection>
  );
};

export default MasterPackages;
