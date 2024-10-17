import React, { useCallback, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import _ from "lodash";
import { useGetMasterTreatmentCyclesQuery } from "../../../../../services/masterDashboardService/serviceData/cycles/masterTreatmentCycleApi";
import ContentSection from "../../../../../components/ContentSection/ContentSection";
import CustomDataGrid from "../../../../../components/CustomDataGrid/CustomDataGrid";
import AddMasterCycleItem from "./AddMasterCycleItem";
import EditMasterCycleItem from "./EditMasterCycleItem";

interface RowType {
  _id: string;
}

const MasterCycleItems: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

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
    data: CycleItemsData,
    isLoading: CycleItemsLoading,
    isFetching: CycleItemFetching,
  } = useGetMasterTreatmentCyclesQuery({
    paginate: false,
    filters: { isAdmin: true },
    searchQuery,
  });

  const CycleItems = CycleItemsData?.data || [];

  const getRowId = (row: RowType) => row._id;

  const columnsConfig: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      valueGetter(params) {
        return `${params.row?.treatmentCycle?.cycleId}`;
      },
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      valueGetter(params) {
        return `${params.row?.name}`;
      },
    },
    { field: "cost", headerName: "Price", flex: 1 },

    {
      field: "validTill",
      headerName: "Valid Till",
      flex: 1,
      type: "date",
      valueFormatter: (params) =>
        params.value
          ? new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(params.value))
          : null,
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
            icon={<Edit />}
            label="Edit"
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

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditClick = (id: string) => {
    setSelectedRow(id);
    openEditModal();
  };

  return (
    <ContentSection title="CycleItems">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Name"
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
          Add Master Treatment Cycle
        </Button>
      </Box>

      <Box mt={2} flex={"1 1 auto"} style={{ maxWidth: "100%", overflowX: "auto" }}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={CycleItems}
          loading={CycleItemsLoading || CycleItemFetching}
          sx={{ height: "100%" }}
          getRowId={getRowId}
        />
      </Box>

      {isAddModalOpen && <AddMasterCycleItem openModal={isAddModalOpen} onClose={closeAddModal} />}

      {isEditModalOpen && (
        <EditMasterCycleItem
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow}
        />
      )}
    </ContentSection>
  );
};

export default MasterCycleItems;
