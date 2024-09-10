import React, { useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import ContentSection from '../../../components/ContentSection/ContentSection';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';

const BillingsTransactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterClinic, setFilterClinic] = useState<string>('');
  const [filterItemName, setFilterItemName] = useState<string>('');
  const [filterMethods, setFilterMethods] = useState<string>('');

  const patientsBillingData = [
    {
      id: '1',
      patientName: 'John Doe',
      caseId: 'C001',
      patientId: 'P001',
      itemName: 'Consultation',
      amountPaid: 200,
      amountDue: 150,
      discounts: 50,
      methods: 'Credit Card',
      paymentDetails: 'Paid',
      registeredAt: '2024-04-10',
      clinic: 'ABC Clinic',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      caseId: 'C002',
      patientId: 'P002',
      itemName: 'Follow-up',
      amountPaid: 300,
      amountDue: 100,
      discounts: 0,
      methods: 'Cash',
      paymentDetails: 'Unpaid',
      registeredAt: '2024-03-15',
      clinic: 'XYZ Hospital',
    },
  ];

  const clinics = ['ABC Clinic', 'XYZ Hospital'];
  const itemNames = ['Consultation', 'Follow-up'];
  const methods = ['Credit Card', 'Cash'];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClinicChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterClinic(event.target.value as string);
  };

  const handleItemNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterItemName(event.target.value as string);
  };

  const handleMethodsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterMethods(event.target.value as string);
  };

  const filteredBillings = patientsBillingData.filter((billing) => {
    const searchTermLower = searchTerm.toLowerCase();
    const itemNameLower = filterItemName.toLowerCase();
    const methodsLower = filterMethods.toLowerCase();

    return (
      billing.patientName.toLowerCase().includes(searchTermLower) ||
      billing.patientId.toLowerCase() === searchTermLower ||
      billing.itemName.toLowerCase().includes(itemNameLower) ||
      billing.clinic.toLowerCase().includes(filterClinic.toLowerCase()) ||
      billing.methods.toLowerCase().includes(methodsLower)
    );
  });

  return (
    <ContentSection title="Billings Transactions">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <TextField
          label="Search by Patient Name or ID"
          size="small"
          variant="outlined"
          onChange={handleSearchChange}
          placeholder="Enter patient name or ID"
        />
        <TextField
          select
          label="Filter by Clinic"
          size="small"
          variant="outlined"
          value={filterClinic}
          onChange={handleClinicChange}
        >
          {clinics.map((clinic) => (
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
          {itemNames.map((itemName) => (
            <MenuItem key={itemName} value={itemName}>
              {itemName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Filter by Methods"
          size="small"
          variant="outlined"
          value={filterMethods}
          onChange={handleMethodsChange}
        >
          {methods.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box flex="1 1 auto">
        <CustomDataGrid
          autoHeight={false}
          columns={[
            { field: 'id', headerName: 'ID', flex: 1 },
            { field: 'patientName', headerName: 'Patient Name', flex: 1 },
            { field: 'caseId', headerName: 'Case ID', flex: 1 },
            { field: 'patientId', headerName: 'Patient ID', flex: 1 },
            { field: 'itemName', headerName: 'Item Name', flex: 1 },
            { field: 'amountPaid', headerName: 'Amount Paid', flex: 1 },
            { field: 'amountDue', headerName: 'Amount Due', flex: 1 },
            { field: 'discounts', headerName: 'Discounts', flex: 1 },
            { field: 'methods', headerName: 'Methods', flex: 1 },
            { field: 'paymentDetails', headerName: 'Payment Details', flex: 1 },
          ]}
          rows={filteredBillings}
          page={1}
          pageSize={25}
          totalRows={filteredBillings.length}
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

export default BillingsTransactions;
