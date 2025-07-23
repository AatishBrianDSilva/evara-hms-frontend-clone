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
  page?: number;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  rowHeight?: number;
  rowHover?: boolean;
  onRowClick?: (params: any) => void;
  columnHeaderHeight?: number;
  pageSizeOptions?: number[];
  sx?: SxProps<Theme>;
  loading?: boolean;
  autoHeight?: boolean;
  onAdd?: () => Promise<void>;
  enablePagination?: boolean;
  showGridToolBar?: boolean;
  checkboxSelection?: boolean;
  getRowId?: (row: any) => string;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  extendedPageSizeOptions?: Array<number | { label: string; value: number }>;
  paginationMode?: 'server' | 'client';
  pageCount?: number;
  useUpdatedPagination?: boolean;
  hideFooter?: boolean;
}

interface CustomToolbarProps {
  onAdd?: () => void;
}

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
  pageSizeOptions = [25, 50, 100],
  extendedPageSizeOptions,
  useUpdatedPagination = false,
  onAdd,
  loading,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  totalRows,
  autoHeight = true,
  enablePagination = false,
  showGridToolBar = false,
  onSelectionChange,
  getRowId,
  hideFooter = false,
  pageCount,
  paginationMode = 'server',
  ...rest
}) => {
  const responsiveColumns = useResponsiveColumns(columns);
  const theme = useTheme();

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
      rowCount={totalRows || 0}
      columns={responsiveColumns}
      rows={rows}
      getRowId={getRowId}
      hideFooter={hideFooter}
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

        ...(useUpdatedPagination
          ? {
              // Updated Pagination Logic
              paginationModel: {
                page: page ? page - 1 : 0,
                pageSize: pageSize || 25,
              },
              onPaginationModelChange: model => {
                if (onPageChange) onPageChange(model.page + 1);
                if (onPageSizeChange) onPageSizeChange(model.pageSize);
              },
            }
          : {
              // Default Pagination Logic
              paginationModel: {
                page: page ? page - 1 : 0,
                pageSize: pageSize || 25,
              },
              onPaginationModelChange: model => {
                if (onPageChange) onPageChange(model.page + 1);
                if (onPageSizeChange) onPageSizeChange(model.pageSize);
              },
            }),
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
