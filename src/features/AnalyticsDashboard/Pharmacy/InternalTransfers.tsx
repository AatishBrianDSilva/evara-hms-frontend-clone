import React, { useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';

const InternalTransfers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterClinic, setFilterClinic] = useState<string>('');
  const [filterItemName, setFilterItemName] = useState<string>('');

  const internalTransfersData = [
    {
      id: '1',
      date: '2024-04-10',
      transferFrom: 'ABC Pharmacy',
      transferTo: 'XYZ Pharmacy',
      itemName: 'Medicine A',
      quantity: 50,
      transferredBy: 'John Doe',
    },
    {
      id: '2',
      date: '2024-03-15',
      transferFrom: 'XYZ Pharmacy',
      transferTo: 'ABC Pharmacy',
      itemName: 'Medicine B',
      quantity: 30,
      transferredBy: 'Jane Smith',
    },
  ];

  const clinics = ['ABC Pharmacy', 'XYZ Pharmacy'];
  const itemNames = ['Medicine A', 'Medicine B'];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClinicChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterClinic(event.target.value as string);
  };

  const handleItemNameChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setFilterItemName(event.target.value as string);
  };

  const filteredTransfers = internalTransfersData.filter(transfer => {
    const searchTermLower = searchTerm.toLowerCase();
    const itemNameLower = filterItemName.toLowerCase();

    return (
      transfer.transferredBy.toLowerCase().includes(searchTermLower) ||
      transfer.itemName.toLowerCase().includes(itemNameLower) ||
      transfer.date.includes(searchTerm) ||
      transfer.transferFrom.includes(filterClinic) ||
      transfer.transferTo.includes(filterClinic)
    );
  });

  return (
    <ContentSection title="Internal Transfers">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <TextField
          label="Search by Patient Name/ID"
          size="small"
          variant="outlined"
          onChange={handleSearchChange}
          placeholder="Enter patient name/ID"
        />
        <TextField
          label="Search by Item Name"
          size="small"
          variant="outlined"
          onChange={handleSearchChange}
          placeholder="item name"
        />
        <TextField
          label="Search by Date"
          size="small"
          variant="outlined"
          onChange={handleSearchChange}
          placeholder="date"
        />
        <TextField
          select
          label="Filter by Clinic"
          size="small"
          variant="outlined"
          value={filterClinic}
          onChange={handleClinicChange}
        >
          {clinics.map(clinic => (
            <MenuItem key={clinic} value={clinic}>
              {clinic}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Filter by Item Name"
          size="small"
          variant="outlined"
          value={filterItemName}
          onChange={handleItemNameChange}
        >
          {itemNames.map(itemName => (
            <MenuItem key={itemName} value={itemName}>
              {itemName}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box flex="1 1 auto">
        <CustomDataGrid
          autoHeight={false}
          columns={[
            { field: 'id', headerName: 'ID', flex: 1 },
            { field: 'date', headerName: 'Date', flex: 1 },
            { field: 'transferFrom', headerName: 'Transfer From', flex: 1 },
            { field: 'transferTo', headerName: 'Transfer To', flex: 1 },
            { field: 'itemName', headerName: 'Item Name', flex: 1 },
            { field: 'quantity', headerName: 'Quantity', flex: 1 },
            { field: 'transferredBy', headerName: 'Transferred By', flex: 1 },
          ]}
          rows={filteredTransfers}
          page={1}
          pageSize={25}
          totalRows={filteredTransfers.length}
          loading={false}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
        />
      </Box>
    </ContentSection>
  );
};

export default InternalTransfers;
