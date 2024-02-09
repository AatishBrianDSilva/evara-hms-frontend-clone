import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';


interface Table {
  columns: GridColDef[];
  rows: any[];
}

const CustomTable: React.FC<Table> = ({ columns, rows }) => {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}

export default CustomTable;