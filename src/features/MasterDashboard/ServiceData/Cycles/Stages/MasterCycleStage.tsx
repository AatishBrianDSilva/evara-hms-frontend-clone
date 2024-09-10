import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import _ from "lodash";

import EditMasterCycleStage from "./EditMasterCycleStage";
import AddMasterCycleStage from "./AddMasterCycleStage";
import ContentSection from "../../../../../components/ContentSection/ContentSection";
import CustomDataGrid from "../../../../../components/CustomDataGrid/CustomDataGrid";
import { useGetServiceCycleStagesQuery } from "../../../../../services/masterDashboardService/serviceData/cycles/masterCyclesStagesApi";

interface RowType {
  _id: string;
}

const MasterCycleStages: React.FC = () => {

  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const { data: stageData, isLoading: stageLoading } =
    useGetServiceCycleStagesQuery({ paginate: false, filters: { isAdmin: true } });

  const stages = stageData?.data || [];

  const getRowId = (row: RowType) => row._id;

  const columnsConfig: GridColDef[] = [
    {
      field: "name",
      headerName: "Stage Name",
      flex: 1,
      // valueGetter(params) {
      //   return `${params.row?.name}`;
      // },
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
    <ContentSection title="CycleStages">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          disabled={false}
          onClick={openAddModal}
        >
          Add CycleStage
        </Button>
      </Box>

      <Box mt={2} flex={"1 1 auto"} style={{ maxWidth: "100%", overflowX: "auto" }}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={stages}
          loading={stageLoading}
          sx={{ height: "100%" }}
          getRowId={getRowId}
        />
      </Box>

      {isAddModalOpen && (
        <AddMasterCycleStage
          openModal={isAddModalOpen}
          onClose={closeAddModal}
        />
      )}

      {isEditModalOpen && (
        <EditMasterCycleStage
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow}
        />
      )}
    </ContentSection>
  );
};

export default MasterCycleStages;
