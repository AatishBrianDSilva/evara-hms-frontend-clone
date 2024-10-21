import React, { useCallback, useState } from "react";
import ContentSection from "../../../../components/ContentSection/ContentSection";
import { Box, Button, TextField } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import CustomDataGrid from "../../../../components/CustomDataGrid/CustomDataGrid";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import AddDrugItem from "./AddDrugItem";
import Delete from "@mui/icons-material/Delete";
import EditDrugItem from "./EditDrugItem";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  useDeleteDrugItemMutation,
  useGetDrugItemsQuery,
} from "../../../../services/pharmacyDashboardService/master/drugItemApi";
import { useToast } from "../../../../context/ToastContext";
import _ from "lodash";
import { useGetTaxBracketsQuery } from "../../../../services/pharmacyDashboardService/master/taxBracketApi";
import { useGetDrugCategoriesQuery } from "../../../../services/pharmacyDashboardService/master/drugCategoryApi";
import { useGetDrugTypesQuery } from "../../../../services/pharmacyDashboardService/master/drugTypeApi";
import { useGetDrugManufacturersQuery } from "../../../../services/pharmacyDashboardService/master/drugManufacturerApi";
import { formatToIndianCurrencyFormat } from "../../../../utils/formatToIndianCurrencyFormat";

const DrugItem: React.FC = () => {
  const { showPromiseToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = React.useState(25);

  const handleSearchChange = useCallback((query: string) => {
    setPage(1); // Reset the page
    setSearchQuery(query);
  }, []);

  // Debounce the search handling
  const debouncedSearchChange = useCallback(
    _.debounce(handleSearchChange, 500),
    [handleSearchChange] // Ensure that handleSearchChange is stable
  );

  const [selectedRow, setSelectedRow] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const {
    data: drugCategoriesData,
    isLoading: drugCategoriesLoading,
    isFetching: drugCategoriesFetching,
  } = useGetDrugCategoriesQuery({
    paginate: false,
    sort: { name: 1 },
    filters: { status: "Active" },
  });
  const drugCategories = drugCategoriesData?.data?.records || [];

  const {
    data: drugTypesData,
    isLoading: drugTypesloading,
    isFetching: drugTypesFetching,
  } = useGetDrugTypesQuery({
    paginate: false,
    sort: { name: 1 },
    filters: { status: "Active" },
  });
  const drugTypes = drugTypesData?.data?.records || [];

  const {
    data: drugManufacturersData,
    isLoading: drugManufacturersLoading,
    isFetching: drugManufacturersFetching,
  } = useGetDrugManufacturersQuery({
    paginate: false,
    sort: { name: 1 },
    filters: { status: "Active" },
  });
  const drugManufacturers = drugManufacturersData?.data?.records || [];

  const {
    data: taxRatesData,
    isLoading: taxRatesLoading,
    isFetching: taxRatesFetching,
  } = useGetTaxBracketsQuery({
    paginate: false,
    sort: { taxRate: 1 },
    filters: { status: "Active" },
  });
  const taxRates = taxRatesData?.data?.records || [];
  const addDrugItemLoading =
    drugCategoriesLoading ||
    drugCategoriesFetching ||
    taxRatesLoading ||
    taxRatesFetching ||
    drugTypesloading ||
    drugTypesFetching ||
    drugManufacturersLoading ||
    drugManufacturersFetching;

  const {
    data: drugItemData,
    isLoading: drugItemLoading,
    isFetching: drugItemFetching,
  } = useGetDrugItemsQuery({
    paginate: true,
    page: page,
    limit: pageSize,
    searchQuery: searchQuery,
  });
  const drugItems = drugItemData?.data?.records || [];
  const drugItemsPagination = drugItemData?.data?.pagination;
  const drugItemsLoading = drugItemLoading || drugItemFetching;

  // console.log("Master Drug items", drugItems);

  const [deleteDrugItem, { isLoading }] = useDeleteDrugItemMutation();
  const handleDelete = async () => {
    const promise = deleteDrugItem(selectedRow).unwrap();

    showPromiseToast(promise, {
      loading: "Deleting...",
      success: (data) => data || "Deleted Successfully",
      error: (data) => data || "Failed to Delete",
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }

    closeDeleteModal();
  };

  const columnsConfig: GridColDef[] = [
    {
      field: "name",
      headerName: "Drug Item",
      flex: 2,
      valueFormatter: (params) => _.upperFirst(params.value),
    },
    { field: "code", headerName: "Drug Code", flex: 1 },
    { field: "genericName", headerName: "Generic Name", flex: 1 },
    { field: "drugClass", headerName: "Drug Class", flex: 1 },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      valueGetter: (params) => params.row.category?.name,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      valueGetter: (params) => params.row.type?.name,
      valueFormatter: (params) => _.upperFirst(params.value),
    },
    { field: "criticalCount", headerName: "Critical Count", flex: 1 },
    { field: "packSize", headerName: "Pack Size", flex: 1 },
    {
      field: "mrp",
      headerName: "MRP",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value || 0),
    },
    {
      field: "rate",
      headerName: "Rate",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value || 0),
    },
    {
      field: "taxRate",
      headerName: "Tax Rate %",
      flex: 1,
      valueGetter: (params) => {
        return params.row.taxRate?.taxRate;
      },
    },
    {
      field: "manufacturer",
      headerName: "Manufacturer",
      flex: 1,
      valueGetter: (params) => {
        return params.row.manufacturer?.name;
      },
    },
    { field: "status", headerName: "Status", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            disabled={addDrugItemLoading}
            icon={<Edit />}
            label="Edit"
            onClick={() => handleEditClick(row.id)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDeleteClick(row.id)}
          />,
        ];
      },
    },
  ];

  // Add Modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Edit Modal
  const openEditModal = () => {
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Delete Modal
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEditClick = (id: string) => {
    setSelectedRow(id);
    openEditModal();
  };

  const handleDeleteClick = (id: string) => {
    setSelectedRow(id);
    openDeleteModal();
  };

  return (
    <ContentSection title="Drug Item">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Item/Code"
          size="small"
          variant="outlined"
          onChange={(e) => debouncedSearchChange(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          disabled={addDrugItemLoading}
          onClick={openAddModal}
        >
          Add Item
        </Button>
      </Box>

      <Box mt={2} flex={"1 1 auto"}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={drugItems}
          page={page}
          pageSize={pageSize}
          totalRows={drugItemsPagination?.totalDocs || 0}
          loading={drugItemsLoading}
          sx={{ height: "100%" }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      {isAddModalOpen && (
        <AddDrugItem
          openModal={isAddModalOpen}
          onClose={closeAddModal}
          drugCategories={drugCategories}
          drugTypes={drugTypes}
          drugManufacturers={drugManufacturers}
          taxRates={taxRates}
        />
      )}

      {isEditModalOpen && (
        <EditDrugItem
          openModal={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedRow}
          drugCategories={drugCategories}
          drugTypes={drugTypes}
          drugManufacturers={drugManufacturers}
          taxRates={taxRates}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          text="this Drug Item"
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={isLoading}
        />
      )}
    </ContentSection>
  );
};

export default DrugItem;
