import React from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridActionsCellItem, GridToolbarContainer } from '@mui/x-data-grid';
import { SxProps, useTheme, Theme } from '@mui/material/styles';
import { LinearProgress, Button } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import useResponsiveColumns from '../../hooks/useResponsiveColumn';

interface CustomDataGridProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  rowHeight?: number;
  columnHeaderHeight?: number;
  pageSizeOptions?: number[];
  sx?: SxProps<Theme>;
  onAdd?: () => Promise<void>; // Handler for adding a new row
  onEdit?: (id: any) => Promise<void>; // Handler for starting to edit a row
  onSave?: (id: any) => Promise<void>; // Handler for saving changes to a row
  onCancel?: (id: any) => Promise<void>; // Handler for canceling edits
  onDelete?: (id: any) => Promise<void>; // Handler for deleting a row
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

interface CustomToolbarProps {
  onAdd: () => void;
  canAdd: boolean;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ onAdd, canAdd }) => (
  <GridToolbarContainer sx={{ p: 0.5 }}>
    {canAdd && (
      <Button color="primary" size='small' variant='contained' startIcon={<AddIcon />} onClick={onAdd}>
        Add Row
      </Button>
    )}
  </GridToolbarContainer>
);

const CustomDataGrid: React.FC<CustomDataGridProps> = ({
  columns,
  rows,
  rowHeight = 30,
  columnHeaderHeight = 35,
  sx = {},
  pageSizeOptions = [25, 50, 100],
  onAdd,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  canAdd,
  canEdit,
  canDelete,
  ...rest
}) => {


  const actionColumn: GridColDef = {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    flex: 1,
    getActions: (params) => {
      const actions = [];
      if (canEdit && onEdit && onSave && onCancel) {
        actions.push(
          <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => onEdit(params.id)} />,
          <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={() => onSave(params.id)} />,
          <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={() => onCancel(params.id)} />
        );
      }
      if (canDelete && onDelete) {
        actions.push(
          <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => onDelete(params.id)} />
        );
      }
      return actions;
    },
  };

  if (canEdit || canDelete) {
    columns = [...columns, actionColumn];
  }

  const responsiveColumns = useResponsiveColumns(columns);

  const theme = useTheme();

  return (
    <DataGrid
      rowHeight={rowHeight}
      columnHeaderHeight={columnHeaderHeight}
      autoHeight
      slots={{
        loadingOverlay: LinearProgress,
        toolbar: CustomToolbar,
      }}
      slotProps={{
        toolbar: { onAdd, canAdd },
      }}
      pagination
      pageSizeOptions={pageSizeOptions}
      columns={responsiveColumns}
      rows={rows}
      sx={{
        ...sx,
        borderColor: theme.palette.primary.light,
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
        },
        '& .MuiDataGrid-iconButtonContainer .MuiButtonBase-root': {
          color: "white"
        },
        fontSize: '12px',
        fontWeight: '500',
      }}
      {...rest}
    />
  );
};

export default CustomDataGrid;
