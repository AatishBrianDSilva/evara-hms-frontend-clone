import React, { useState, useMemo, useCallback, useEffect } from 'react';
import ContentSection from '../../../components/ContentSection/ContentSection';
import { Box, TextField } from '@mui/material';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import { useGetPaginatedStocksQuery } from '../../../services/pharmacyDashboardService/stocksApi';
import { useEditPurchaseOrderMutation } from '../../../services/pharmacyDashboardService/purchaseOrderApi';
import _ from 'lodash';
import { formatToIndianCurrencyFormat } from '../../../utils/formatToIndianCurrencyFormat';

interface BatchLocation {
  location: {
    location: string;
  };
  quantity: number;
}

interface IStock {
  item: {
    name: string;
    category: { name: string };
    type: { name: string };
  };
  batches: Array<{
    batchNo: string;
    expiryDate: string;
    locations: BatchLocation[];
  }>;
  sellPrice: number;
  updatedAt: string;
}

interface IPaginatedPharmacyStock {
  records: IStock[];
  total: number;
}

const Stocks: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(-1);

  const {
    data: stockData,
    isLoading: stockLoading,
    isFetching: stockFetching,
    refetch,
  } = useGetPaginatedStocksQuery({
    paginate: true,
    page: page + 1,
    limit: pageSize,
    sort: { 'item.name': 1 },
    searchQuery: `searchTerm:${searchQuery}`,
  });

  useEffect(() => {
    refetch();
  }, [location, refetch]);

  const [editPurchaseOrder] = useEditPurchaseOrderMutation();

  // Debounce the search handling
  const handleSearchChange = useCallback((query: string) => {
    setPage(0); // Reset the page to 0 when searching
    setSearchQuery(query);
  }, []);

  const debouncedSearchChange = useCallback(
    _.debounce(handleSearchChange, 500),
    [handleSearchChange], // Ensure that handleSearchChange is stable
  );

  const stocks = stockData?.data?.records || [];
  const totalRows =
    (stockData?.data as unknown as IPaginatedPharmacyStock)?.total || 0;
  const stocksLoading = stockLoading || stockFetching;

  useEffect(() => {
    // Refetch stocks data after updating a purchase order
    const refetchStocksData = async () => {
      await refetch();
    };

    if ((editPurchaseOrder as any).isSuccess) {
      refetchStocksData();
    }
  }, [(editPurchaseOrder as any).isSuccess, refetch]);

  console.log('🚀 ~ stocks:', stocks);

  const getQuantityByLocation = (batch: any, locationName: string): number => {
    return batch.locations.reduce((total: number, loc: BatchLocation) => {
      const location = loc.location?.location;
      if (
        locationName === 'Other' &&
        ![
          'OPD Pharmacy',
          'OT Pharmacy',
          'Central Pharmacy',
          'IVF Pharmacy',
          'Internal Stock',
          'Recovery Pharmacy',
        ].includes(location)
      ) {
        return total + loc.quantity;
      } else if (location === locationName) {
        return total + loc.quantity;
      }
      return total;
    }, 0);
  };

  const locations = [
    'OPD Pharmacy',
    'OT Pharmacy',
    'Central Pharmacy',
    'IVF Pharmacy',
    'Internal Stock',
    'Recovery Pharmacy',
    // "Other",
  ];

  const transformedStocks = useMemo(() => {
    return stocks
      .flatMap((stock, stockIndex) =>
        stock.batches.map((batch, batchIndex) => {
          const locationQuantities = locations.reduce(
            (acc: { [key: string]: number }, location) => {
              acc[location] = getQuantityByLocation(batch, location);
              return acc;
            },
            {},
          );

          const totalQuantity = Object.values(locationQuantities).reduce(
            (sum, quantity) => sum + quantity,
            0,
          );

          return {
            id: `${stockIndex}-${batchIndex}`,
            itemName: stock.item?.name || 'N/A',
            category: _.upperFirst(stock.item?.category?.name) || 'N/A',
            type: _.upperFirst(stock.item?.type?.name) || 'N/A',
            batchNo: batch.batchNo,
            expiryDate: new Date(batch.expiryDate).toISOString(),
            ...locationQuantities,
            sellPrice: formatToIndianCurrencyFormat(batch.sellPrice),
            latestExpiryDate: new Date(batch.expiryDate).toISOString(),
            updatedAt: new Date(stock.updatedAt).toISOString(),
            quantity: totalQuantity,
          };
        }),
      )
      .sort((a, b) => a.itemName.localeCompare(b.itemName)); // Sort transformed data
  }, [stocks, locations]);

  const columnsConfig: GridColDef[] = useMemo(
    () => [
      { field: 'itemName', headerName: 'Item Name', flex: 1 },
      { field: 'category', headerName: 'Category', flex: 1 },
      // { field: "type", headerName: "Type", flex: 1 },
      { field: 'batchNo', headerName: 'Batch No', flex: 1 },
      ...locations.map(location => ({
        field: location,
        headerName: location,
        flex: 1,
      })),
      { field: 'quantity', headerName: 'Quantity', flex: 1 },
      { field: 'sellPrice', headerName: 'MRP/Item', flex: 1 },
      {
        field: 'latestExpiryDate',
        headerName: 'Expiry Date',
        type: 'date',
        flex: 1,
        valueFormatter(params) {
          const date = new Date(params.value);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
          const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
          return `${day}/${month}/${year}`;
        },
      },
      {
        field: 'updatedAt',
        headerName: 'Updated At',
        type: 'date',
        flex: 1,
        valueFormatter(params) {
          const date = new Date(params.value);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
          const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
          return `${day}/${month}/${year}`;
        },
      },
    ],
    [locations],
  );

  return (
    <ContentSection title="Stocks">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField
          label="Search"
          placeholder="Item Name"
          size="small"
          variant="outlined"
          onChange={e => debouncedSearchChange(e.target.value)}
        />
      </Box>
      <Box mt={2} flex={'1 1 auto'} height={600}>
        <CustomDataGrid
          autoHeight={false}
          columns={columnsConfig}
          rows={transformedStocks}
          page={page}
          pageSize={pageSize}
          totalRows={totalRows}
          loading={stocksLoading}
          sx={{
            height: '100%',
            '& .MuiDataGrid-columnHeaders': {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: '#fff', // Optional: to keep the background consistent
            },
            '& .MuiDataGrid-virtualScroller': {
              overflow: 'auto',
            },
          }}
          onPageChange={newPage => setPage(newPage)}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          pageSizeOptions={[25, 50, 100]}
          rowHover={true}
        />
      </Box>
    </ContentSection>
  );
};

export default Stocks;
