import React, { useEffect, useState } from "react";
import ContentSection from "../../../components/ContentSection/ContentSection";
import { Box, TextField } from "@mui/material";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useGetPaginatedStocksQuery } from "../../../services/pharmacyDashboardService/stocksApi";
import _ from "lodash";

const ExpiringStocks: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocationQuery(event.target.value);
  };

  // Calculate the date range for expiry filtering
  const currentDate = new Date();
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(currentDate.getMonth() + 1);

  useEffect(() => {
    const queryParts = [];
    if (searchTerm) {
      queryParts.push(`searchTerm:${searchTerm}`);
    }
    if (locationQuery) {
      queryParts.push(`location:${locationQuery}`);
    }
    setSearchQuery(queryParts.join(" "));
  }, [searchTerm, locationQuery]);

  // Fetch data from the backend
  const {
    data: stockData,
    isLoading: stockLoading,
    isFetching: stockFetching,
  } = useGetPaginatedStocksQuery({
    paginate: true,
    page: page,
    limit: pageSize,
    searchQuery, // Use the combined searchQuery
  });

  const allStocks = stockData?.data?.records || [];
  const stocksPagination = stockData?.data?.pagination;
  const stocksLoading = stockLoading || stockFetching;

  // Filter stocks based on expiry date in the frontend
  const filteredStocks = allStocks.filter((stock) => {
    const expiryDate = new Date(stock.latestExpiryDate);
    return expiryDate >= currentDate && expiryDate <= oneMonthFromNow;
  });

  console.log("Expiring Stocks", filteredStocks);

  const columnsConfig: GridColDef[] = [
    {
      field: "itemName",
      headerName: "Item Name",
      flex: 1,
      valueGetter: (params) => params.row.item?.name,
    },
    {
      field: "latestExpiryDate",
      headerName: "Latest Expiry Date",
      type: "date",
      flex: 1,
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      type: "date",
      flex: 1,
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    // {
    //   field: "category",
    //   headerName: "Category",
    //   flex: 1,
    //   valueGetter: (params) => _.upperFirst(params.row.item?.category?.name),
    // },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      valueGetter: (params) => _.upperFirst(params.row.item?.type?.name) || "N/A",
    },
    {
      field: "locationNames",
      headerName: "Locations",
      flex: 1,
    },
    // {
    //   field: "batchesCount",
    //   headerName: "Batch Count",
    //   flex: 1,
    // },
    {
      field: "totalQuantity",
      headerName: "Quantity",
      flex: 1,
    },
    // {
    //   field: "quantityOnHold",
    //   headerName: "Quantity on Hold",
    //   flex: 1,
    // },
    // {
    //   field: "sellPrice",
    //   headerName: "MRP",
    //   flex: 1,
    //   valueGetter: (params) => formatToIndianCurrencyFormat(params.row.sellPrice || 0) || "N/A",
    // },
  ];

  return (
    <ContentSection title="Expiring Stocks (In Next 30 Days)">
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <TextField
          label="Search by Drug Name"
          size="small"
          variant="outlined"
          onChange={handleSearchChange}
          placeholder="Enter Drug Name"
        />
        <TextField
          label="Search by Location Name"
          size="small"
          variant="outlined"
          onChange={handleLocationChange}
          placeholder="Enter Location Name"
        />
      </Box>

      <Box mt={2} flex={"1 1 auto"}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={filteredStocks} // Use filtered stocks here
          page={page}
          pageSize={pageSize}
          totalRows={stocksPagination?.totalDocs || 0}
          loading={stocksLoading}
          sx={{ height: "100%" }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          rowHover={true}
        />
      </Box>
    </ContentSection>
  );
};

export default ExpiringStocks;
