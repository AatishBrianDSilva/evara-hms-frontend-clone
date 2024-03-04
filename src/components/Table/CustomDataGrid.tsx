import React from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import { SxProps, useTheme, Theme } from '@mui/material/styles';
import { LinearProgress, Button } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import useResponsiveColumns from '../../hooks/useResponsiveColumn';

interface CustomDataGridProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  page?: number; // Made optional
  pageSize?: number; // Made optional
  totalRows?: number; // Made optional
  onPageChange?: (page: number) => void; // Made optional
  onPageSizeChange?: (pageSize: number) => void; // Made optional
  rowHeight?: number;
  rowHover?: boolean;
  onRowClick?: (params: any) => void;
  columnHeaderHeight?: number;
  pageSizeOptions?: number[];
  sx?: SxProps<Theme>;
  loading?: boolean;
  autoHeight?: boolean;
  onAdd?: () => Promise<void>;
  enablePagination?: boolean; // New prop to control pagination
}

interface CustomToolbarProps {
  onAdd?: () => void;
}

// CustomToolbar remains unchanged
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
  loading,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  totalRows,
  autoHeight = true,
  enablePagination = false, // Default to false
  ...rest
}) => {

  const responsiveColumns = useResponsiveColumns(columns);

  const theme = useTheme();

  return (
    <DataGrid
      rowHeight={rowHeight}
      columnHeaderHeight={columnHeaderHeight}
      loading={loading}
      autoHeight={autoHeight}
      slots={{
        loadingOverlay: LinearProgress,
        toolbar: CustomToolbar,
      }}
      slotProps={{
        toolbar: { onAdd },
      }}
      rowCount={totalRows || 0} // Use 0 as a default value
      columns={responsiveColumns}
      rows={rows}
      sx={{
        ...sx,
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
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          },
        }),
        fontSize: '12px',
        color: theme.palette.text.secondary,
        fontWeight: '500',
      }}
      {...(enablePagination && {
        pagination: true,
        pageSizeOptions: pageSizeOptions,
        paginationMode: "server",
        paginationModel: {
          page: page ? page - 1 : 0, // Adjust for zero-based index
          pageSize: pageSize || 25, // Default page size
        },
        onPaginationModelChange: (model) => {
          if (onPageChange) onPageChange(model.page + 1);
          if (onPageSizeChange) onPageSizeChange(model.pageSize);
        },
      })}
      {...rest}
    />
  );
};

export default CustomDataGrid;
