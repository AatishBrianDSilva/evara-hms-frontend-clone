import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { SxProps, useTheme, Theme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
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
  showGridToolBar?: boolean; // New prop to show/hide toolbar
  checkboxSelection?: boolean;
  getRowId?: (row: any) => string; // New prop to get row id
  onSelectionChange?: (selectedIds: (string | number)[]) => void; // New prop for handling selection changes
  extendedPageSizeOptions?: Array<number | { label: string; value: number }>; // Optional prop for extended page sizes
  paginationMode?: 'server' | 'client'; // Optional pagination mode prop
  pageCount?: number; // New prop for total pages
}

interface CustomToolbarProps {
  onAdd?: () => void;
}

// CustomToolbar remains unchanged
const CustomToolbar: React.FC<CustomToolbarProps> = ({ onAdd }) => (
  <GridToolbarContainer sx={{ p: 0.5 }}>
    {onAdd && (
      <Button
        color="primary"
        size="small"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAdd}
      >
        Add Row
      </Button>
    )}
    {/* CSV Export Button */}
    {/* <GridToolbarExport
      csvOptions={{
        allColumns: true, // This option ensures all columns are exported
      }}
    /> */}
  </GridToolbarContainer>
);

const CustomDataGrid: React.FC<CustomDataGridProps> = ({
  checkboxSelection = false,
  columns,
  rows,
  rowHover = false,
  rowHeight = 40,
  columnHeaderHeight = 40,
  sx = {},
  pageSizeOptions = [25, 50, 100], // Default page size options
  extendedPageSizeOptions, // New optional prop for extended page sizes
  onAdd,
  loading,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  totalRows,
  autoHeight = true,
  enablePagination = false, // Default to false
  showGridToolBar = false, // Default to true
  onSelectionChange,
  getRowId,
  pageCount,
  paginationMode = 'server', // Default to client pagination
  ...rest
}) => {
  const responsiveColumns = useResponsiveColumns(columns);
  const theme = useTheme();

  // Use extendedPageSizeOptions if provided, otherwise use the default pageSizeOptions
  const effectivePageSizeOptions = extendedPageSizeOptions || pageSizeOptions;

  return (
    <DataGrid
      rowHeight={rowHeight}
      hideFooterPagination={!enablePagination}
      columnHeaderHeight={columnHeaderHeight}
      loading={loading}
      autoHeight={autoHeight}
      slots={{
        loadingOverlay: LinearProgress,
        toolbar: showGridToolBar ? GridToolbar : CustomToolbar,
      }}
      slotProps={{
        toolbar: { onAdd },
      }}
      rowCount={totalRows || 0} // Use 0 as a default value
      // pageCount={pageCount || Math.ceil((totalRows || 0) / (pageSize || 25))}
      columns={responsiveColumns}
      rows={rows}
      getRowId={getRowId}
      sx={{
        ...sx,
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: theme.palette.secondary.main,
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
        },
        '& .MuiDataGrid-iconButtonContainer .MuiButtonBase-root': {
          color: 'white',
        },
        ...(rowHover && {
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
        }),
        fontSize: '12px',
        color: theme.palette.text.secondary,
        fontWeight: '500',
        minHeight: '200px',
      }}
      {...(enablePagination && {
        pagination: true,
        pageSizeOptions: effectivePageSizeOptions,
        paginationMode: paginationMode,
        paginationModel: {
          page: page ? page - 1 : 0, // Adjust for zero-based index
          pageSize: pageSize || 25, // Default page size
        },
        onPaginationModelChange: model => {
          if (onPageChange) onPageChange(model.page + 1); // Convert back to one-based index
          if (onPageSizeChange) onPageSizeChange(model.pageSize);
        },
      })}
      checkboxSelection={checkboxSelection}
      onRowSelectionModelChange={newSelection => {
        if (onSelectionChange) onSelectionChange(newSelection);
      }}
      {...rest}
    />
  );
};

export default CustomDataGrid;
