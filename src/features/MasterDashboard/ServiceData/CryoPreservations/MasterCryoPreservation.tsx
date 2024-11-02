import React, { useCallback, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import _ from 'lodash';
import ContentSection from '../../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';
import { useGetMasterCryoPreservationsQuery } from '../../../../services/masterDashboardService/serviceData/masterCryoPreservationApi';
import AddMasterCryoPreservation from './AddMasterCryoPreservation';
import EditMasterCryoPreservation from './EditMasterCryoPreservation';

interface RowType {
  _id: string;
}

const MasterCryoPreservations: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Debounce the search handling
  const debouncedSearchChange = useCallback(
    _.debounce(handleSearchChange, 500),
    [handleSearchChange], // Ensure that handleSearchChange is stable
  );

  const {
    data: CryoPreservationsData,
    isLoading: CryoPreservationsLoading,
    isFetching: CryoPreservationFetching,
  } = useGetMasterCryoPreservationsQuery({
    paginate: false,
    searchQuery,
    filters: { isAdmin: true },
  });

  const CryoPreservations = CryoPreservationsData?.data || [];

  const getRowId = (row: RowType) => row._id;

  const columnsConfig: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      valueGetter(params) {
        return `${params.row?.cryoPreservation?.cryoPreservationId}`;
      },
    },
    {
      field: 'cryoPreservationName',
      headerName: 'Name',
      flex: 1,
      valueGetter(params) {
        return `${params.row?.name}`;
      },
    },
    { field: 'cost', headerName: 'Price', flex: 1 },

    {
      field: 'validTill',
      headerName: 'Valid Till',
      flex: 1,
      type: 'date',
      valueFormatter: params =>
        params.value
          ? new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).format(new Date(params.value))
          : null,
    },
    {
      field: 'active',
      headerName: 'Active',
      flex: 1,
      renderCell: params => <>{params.value ? 'Yes' : 'No'}</>,
    },
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
    <ContentSection title="Cryo Preservations">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Name"
          size="small"
          variant="outlined"
          onChange={e => debouncedSearchChange(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          disabled={false}
          onClick={openAddModal}
        >
          Add CryoPreservation
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
          rows={CryoPreservations}
          loading={CryoPreservationsLoading || CryoPreservationFetching}
          sx={{ height: '100%' }}
          getRowId={getRowId}
        />
      </Box>

      {isAddModalOpen && (
        <AddMasterCryoPreservation
          openModal={isAddModalOpen}
          onClose={closeAddModal}
        />
      )}

      {isEditModalOpen && (
        <EditMasterCryoPreservation
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow}
        />
      )}
    </ContentSection>
  );
};

export default MasterCryoPreservations;
