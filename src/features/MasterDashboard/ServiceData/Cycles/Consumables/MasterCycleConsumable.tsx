import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import _ from 'lodash';

import EditMasterCycleConsumable from './EditMasterCycleConsumable';
import AddMasterCycleConsumable from './AddMasterCycleConsumable';
import ContentSection from '../../../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../../../components/CustomDataGrid/CustomDataGrid';
import { useGetServiceCycleConsumablesQuery } from '../../../../../services/masterDashboardService/serviceData/cycles/masterCyclesConsumablesApi';

interface RowType {
  _id: string;
}

const MasterCycleConsumables: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const {
    data: investigationsData,
    isLoading: investigationsLoading,
    isFetching: investigationsFetching,
  } = useGetServiceCycleConsumablesQuery({
    paginate: false,
    filters: { isAdmin: true },
  });

  const loading = investigationsLoading || investigationsFetching;
  const investigations = investigationsData?.data || [];

  const getRowId = (row: RowType) => row._id;

  const columnsConfig: GridColDef[] = [
    {
      field: 'pharmacyStock',
      headerName: 'Pharmacy Item',
      flex: 1,
      valueGetter(params) {
        return `${params.row?.pharmacyStock?.item?.name}`;
      },
    },
    {
      field: 'stage',
      headerName: 'Stage',
      flex: 1,
      valueGetter(params) {
        return `${params.row?.stage?.name}`;
      },
    },

    { field: 'treatment', headerName: 'Treatment', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
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
    <ContentSection title="CycleConsumables">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          disabled={false}
          onClick={openAddModal}
        >
          Add CycleConsumable
        </Button>
      </Box>

      <Box
        mt={2}
        flex={'1 1 auto'}
        style={{ maxWidth: '100%', overflowX: 'auto' }}
      >
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={investigations}
          loading={loading}
          sx={{ height: '100%' }}
          getRowId={getRowId}
        />
      </Box>

      {isAddModalOpen && (
        <AddMasterCycleConsumable
          openModal={isAddModalOpen}
          onClose={closeAddModal}
        />
      )}

      {isEditModalOpen && (
        <EditMasterCycleConsumable
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow}
        />
      )}
    </ContentSection>
  );
};

export default MasterCycleConsumables;
