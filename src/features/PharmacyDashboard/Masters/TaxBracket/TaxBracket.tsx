import React, { useState } from 'react'
import ContentSection from '../../../../components/ContentSection/ContentSection'
import { Box, Button } from '@mui/material'
import { Add, Edit } from '@mui/icons-material'
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid'
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import AddTaxBracket from './AddTaxBracket'
import Delete from '@mui/icons-material/Delete'
import EditTaxBracket from './EditTaxBracket'
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal/DeleteConfirmationModal'
import { useDeleteTaxBracketMutation, useGetTaxBracketsQuery } from '../../../../services/pharmacyDashboardService/master/taxBracketApi'
import { useToast } from '../../../../context/ToastContext'

const TaxBracket: React.FC = () => {

  const { showPromiseToast } = useToast();

  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(25)

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

  const { data: taxBracketData, isLoading: taxBracketLoading, isFetching: taxBracketFetching } = useGetTaxBracketsQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      sort: { taxRate: 1 }
    }
  );
  const taxBrackets = taxBracketData?.data?.records || [];
  const taxBracketsPagination = taxBracketData?.data?.pagination;
  const taxBracketsLoading = taxBracketLoading || taxBracketFetching;

  const [deleteTaxBracket, { isLoading }] = useDeleteTaxBracketMutation()
  const handleDelete = async () => {

    const promise = deleteTaxBracket(selectedRow).unwrap()

    showPromiseToast(
      promise,
      {
        loading: 'Deleting Tax Bracket...',
        success: (data) => {
          console.log("data", data);
          return 'Tax Bracket Deleted Successfully'
        },
        error: (data) => data.message || 'Failed to Delete Tax Bracket'
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
    { field: 'taxRate', headerName: 'Tax Rate', flex: 1, sortingOrder: ['asc', 'desc'] },
    { field: 'notes', headerName: 'Notes', flex: 1 },

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
    <ContentSection title="Tax Brackets">
      <Box display="flex" justifyContent="flex-end" gap={2}>
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
          rows={taxBrackets}
          page={page}
          pageSize={pageSize}
          totalRows={taxBracketsPagination?.totalDocs || 0}
          loading={taxBracketsLoading}
          sx={{ height: '100%' }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      {isAddModalOpen && (
        <AddTaxBracket openModal={isAddModalOpen} onClose={closeAddModal} />
      )}

      {isEditModalOpen && (
        <EditTaxBracket openModal={isEditModalOpen} onClose={closeEditModal} id={selectedRow} />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text='this Tax Bracket'
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={isLoading}
        />
      )}

    </ContentSection>
  )
}

export default TaxBracket
