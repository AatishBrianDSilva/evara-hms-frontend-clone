import React from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import { SxProps, useTheme, Theme } from '@mui/material/styles';
import { LinearProgress, Button } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import useResponsiveColumns from '../../hooks/useResponsiveColumn';

interface CustomDataGridProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  rowHeight?: number;
  rowHover?: boolean;
  onRowClick?: (params: any) => void;
  columnHeaderHeight?: number;
  pageSizeOptions?: number[];
  sx?: SxProps<Theme>;
  onAdd?: () => Promise<void>; // Handler for adding a new row
}

interface CustomToolbarProps {
  onAdd: () => void;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ onAdd }) => (
  <GridToolbarContainer sx={{ p: 0.5 }}>
    {onAdd && (
      <Button color="primary" size='small' variant='contained' startIcon={<AddIcon />} onClick={onAdd}>
        Add Row
      </Button>
    )}
  </GridToolbarContainer>
);

const CustomDataGrid: React.FC<CustomDataGridProps> = ({
  columns,
  rows,
  rowHover = false,
  rowHeight = 40,
  columnHeaderHeight = 40,
  sx = {},
  pageSizeOptions = [25, 50, 100],
  onAdd,
  ...rest
}) => {

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
        toolbar: { onAdd },
      }}
      pagination
      pageSizeOptions={pageSizeOptions}
      columns={responsiveColumns}
      rows={rows}
      sx={{
        ...sx,
        // borderColor: theme.palette.primary.light,
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: theme.palette.secondary.main,
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
        },
        '& .MuiDataGrid-iconButtonContainer .MuiButtonBase-root': {
          color: "white"
        },
        ...(rowHover && {
          '& .MuiDataGrid-row': {
            cursor: 'pointer', // Apply cursor style conditionally based on rowHover prop
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)', // Optional: change row background on hover
            }
          },
        }),
        fontSize: '12px',
        color: theme.palette.text.secondary,
        fontWeight: '500',
      }}
      {...rest}
    />
  );
};

export default CustomDataGrid;
