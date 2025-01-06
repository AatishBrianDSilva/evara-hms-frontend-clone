import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import CustomDataGrid from '../../../../components/CustomDataGrid/CustomDataGrid';
import {
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import AddPackage from './AddPackage';
import { useGetMasterPackagesQuery } from '../../../../services/masterDashboardService/serviceData/masterPackagesApi';
import {
  useDeletePackageMutation,
  useGetPackagesQuery,
} from '../../../../services/patientDashboardService/packageApi';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { useToast } from '../../../../context/ToastContext';

const Packages: React.FC = () => {
  const { showPromiseToast } = useToast();
  const { patient } = useSelector((state: RootState) => state.patients);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [addPackageOpen, setAddPackageOpen] = useState<boolean>(false);
  const [deletePackageOpen, setDeletePackageOpen] = useState<{
    id: string;
    name: string;
    status: boolean;
  }>({ id: '', name: '', status: false });

  // Get master packages
  const {
    data: MasterPackagesData,
    isLoading: MasterPackagesLoading,
    isFetching: MasterPackageFetching,
  } = useGetMasterPackagesQuery(
    {
      paginate: false,
      filters: {
        patientId: patient?.patientId,
        active: true,
      },
    },
    {
      skip: !patient?.patientId,
    },
  );
  const masterPackages = MasterPackagesData?.data || [];

  // Get patient packages
  const {
    data: packagesData,
    isLoading: packageLoading,
    isFetching: packageFetching,
  } = useGetPackagesQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      filters: {
        patientCode: patient?.patientId,
      },
    },
    {
      skip: !patient?.patientId,
    },
  );
  const patientPackages = packagesData?.data?.records || [];
  const patientPackagesPagination = packagesData?.data?.pagination;
  const patientPackagesLoading = packageLoading || packageFetching;

  console.log('Master Packages', masterPackages);

  console.log('Packages', patientPackages);

  // Delete package
  const [deletePackage, { isLoading: deletingPackage }] =
    useDeletePackageMutation();

  const loading = MasterPackagesLoading || MasterPackageFetching;

  const columns: GridColDef[] = [
    {
      field: 'dateAssigned',
      headerName: 'Date',
      flex: 1,
      type: 'date',
      valueFormatter: params => {
        const date = new Date(params.value as string);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: 'package',
      headerName: 'Package',
      flex: 1,
      valueGetter(params) {
        return params.row.package?.name;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellClassName: 'actions',
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDeleteClick(row)}
          />,
        ];
      },
    },
  ];

  const handleDeleteClick = (rowData: any) => {
    setDeletePackageOpen({
      id: rowData.id,
      name: rowData.package?.name,
      status: true,
    });
  };

  const closeDeleteDialog = () => {
    setDeletePackageOpen({ id: '', name: '', status: false });
  };

  const handlePackageDelete = async () => {
    const id = deletePackageOpen.id;
    const promise = deletePackage(id).unwrap();
    showPromiseToast(promise, {
      loading: 'Deleting package...',
      success: () => 'Package deleted successfully',
      error: () => 'Error deleting package',
    });

    try {
      await promise;
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting package', error);
    }
  };

  const closeForm = () => {
    setAddPackageOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  return (
    <Box p={2} display={'flex'} flexDirection={'column'} flex={1}>
      <Box
        display={'flex'}
        justifyContent="flex-end"
        alignItems="center"
        mb={3}
      >
        <Button
          startIcon={<Add />}
          variant="contained"
          color="primary"
          onClick={() => setAddPackageOpen(true)}
          disabled={loading}
        >
          Add Package
        </Button>
      </Box>
      <CustomDataGrid
        autoHeight={true}
        columns={columns}
        rows={patientPackages}
        page={page}
        pageSize={pageSize}
        totalRows={patientPackagesPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientPackagesLoading}
        sx={{ height: '100%' }}
        enablePagination={true}
      />

      {addPackageOpen && (
        <AddPackage
          masterPackages={masterPackages as any}
          onClose={closeForm}
          open={addPackageOpen}
        />
      )}
      {deletePackageOpen.status && (
        <DeleteConfirmationModal
          open={deletePackageOpen.status}
          onClose={closeDeleteDialog}
          onConfirm={handlePackageDelete}
          text={`Package ${deletePackageOpen.name}`}
          loading={deletingPackage}
        />
      )}
    </Box>
  );
};

export default Packages;
