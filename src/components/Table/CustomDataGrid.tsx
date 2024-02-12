import React from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { SxProps, useTheme, Theme } from '@mui/material/styles';
import { LinearProgress } from '@mui/material';

interface CustomDataGridProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  rowHeight?: number;
  columnHeaderHeight?: number;
  pageSizeOptions?: number[];
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const CustomDataGrid: React.FC<CustomDataGridProps> = ({
  columns,
  rows,
  rowHeight = 30,
  columnHeaderHeight = 35,
  loading = false,
  sx = {},
  pageSizeOptions = [25, 50, 100],
  ...rest
}) => {

  const theme = useTheme()

  return (
    <DataGrid
      rowHeight={rowHeight}
      columnHeaderHeight={columnHeaderHeight}
      autoHeight
      slots={{
        loadingOverlay: LinearProgress
      }}
      pagination={true}
      pageSizeOptions={pageSizeOptions}
      columns={columns}
      rows={rows}
      loading={loading}
      sx={{
        ...sx,
        borderColor: theme => theme.palette.primary.light,
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
