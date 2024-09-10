import React, { useCallback, useState } from 'react'
import ContentSection from '../../../../components/ContentSection/ContentSection'
import { Box, Button, TextField } from '@mui/material'
import { Add, Edit } from '@mui/icons-material'
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid'
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import AddDrugVendor from './AddDrugVendor'
import Delete from '@mui/icons-material/Delete'
import EditDrugVendor from './EditDrugVendor'
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal/DeleteConfirmationModal'
import { useDeleteDrugVendorMutation, useGetDrugVendorsQuery } from '../../../../services/pharmacyDashboardService/master/drugVendorApi'
import { useToast } from '../../../../context/ToastContext'
import _ from 'lodash'

const DrugVendor: React.FC = () => {

  const { showPromiseToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = React.useState(25);


  const handleSearchChange = useCallback((query: string) => {
    setPage(1);  // Reset the page
    setSearchQuery(query);
  }, []);

  // Debounce the search handling
  const debouncedSearchChange = useCallback(
    _.debounce(handleSearchChange, 500),
    [handleSearchChange] // Ensure that handleSearchChange is stable
  );

  const [selectedRow, setSelectedRow] = useState<string>('')
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
  }

  const { data: drugVendorData, isLoading: drugVendorLoading, isFetching: drugVendorFetching } = useGetDrugVendorsQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      searchQuery: searchQuery,
      sort: { location: 1 }
    }
  );
  const drugVendors = drugVendorData?.data?.records || [];
  const drugVendorsPagination = drugVendorData?.data?.pagination;
  const drugVendorsLoading = drugVendorLoading || drugVendorFetching;

  const [deleteDrugVendor, { isLoading }] = useDeleteDrugVendorMutation()
  const handleDelete = async () => {

    const promise = deleteDrugVendor(selectedRow).unwrap()

    showPromiseToast(
      promise,
      {
        loading: 'Deleting...',
        success: (data) => data || 'Deleted Successfully',
        error: (data) => data || 'Failed to Delete'
      }
    )

    try {
      await promise
    } catch (error) {
      console.log(error)
    }

    closeDeleteModal()
  }

  const columnsConfig: GridColDef[] = [
    { field: 'name', headerName: 'Vendor Name', flex: 2 },
    {
      field: 'address', headerName: 'Address', flex: 1, valueGetter(params) {
        return `${params.row.address.city}, ${params.row.address.state}`
      },
    },
    {
      field: 'person', headerName: 'Contact Person', flex: 1, valueGetter(params) {
        return `${params.row.contact.person}`
      }
    },
    {
      field: 'phone', headerName: 'Phone', flex: 1, valueGetter(params) {
        return `${params.row.contact.phone}`
      }
    },
    {
      field: 'email', headerName: 'Email', flex: 2, valueGetter(params) {
        return `${params.row.contact.email}`
      },
    },
    { field: 'remarks', headerName: 'Remarks', flex: 2 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => handleEditClick(row.id)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDeleteClick(row.id)}
          />
        ]
      },
    },
  ]

  // Add Modal
  const openAddModal = () => {
    setIsAddModalOpen(true)
  }
  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  // Edit Modal
  const openEditModal = () => {
    setIsEditModalOpen(true)
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false)
  }

  // Delete Modal
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true)
  }
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
  }

  const handleEditClick = (id: string) => {
    setSelectedRow(id)
    openEditModal()
  };

  const handleDeleteClick = (id: string) => {
    setSelectedRow(id)
    openDeleteModal()
  };


  return (
    <ContentSection title="Drug Vendor">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField label="Search" placeholder="Name" size="small" variant="outlined" onChange={(e) => debouncedSearchChange(e.target.value)} />
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          onClick={openAddModal}
        >
          Add Item
        </Button>
      </Box>

      <Box mt={2} flex={'1 1 auto'}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={drugVendors}
          page={page}
          pageSize={pageSize}
          totalRows={drugVendorsPagination?.totalDocs || 0}
          loading={drugVendorsLoading}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      {isAddModalOpen && (
        <AddDrugVendor openModal={isAddModalOpen} onClose={closeAddModal} />
      )}

      {isEditModalOpen && (
        <EditDrugVendor openModal={isEditModalOpen} onClose={closeEditModal} id={selectedRow} />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text='Drug Vendor'
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={isLoading}
        />
      )}

    </ContentSection>
  )
}

export default DrugVendor
