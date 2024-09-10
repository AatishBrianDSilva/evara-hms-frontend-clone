import React, { useState, useMemo } from "react";
import { Box, Button } from "@mui/material";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import ContentSection from "../../../components/ContentSection/ContentSection";
import AddInternalConsumption from "./AddInternalConsumption";
import { useGetStocksQuery } from "../../../services/pharmacyDashboardService/stocksApi";
import { useGetInternalConsumptionsQuery } from "../../../services/pharmacyDashboardService/internalConsumptionApi";

// Define the required interfaces
interface Batch {
  batchId: string;
  deductedQuantity: number;
}

interface TransferFrom {
  location: {
    location: string;
  };
}

interface ItemDetail {
  name: string;
}

interface Item {
  item: ItemDetail;
}

interface InternalTransferItem {
  item: Item;
  transferFrom: TransferFrom;
  batches: Batch[];
}

interface InternalConsumptionRecord {
  _id: string;
  date: Date;
  createdBy: string;
  items: InternalTransferItem[];
}

interface RowType {
  _id: string;
  drugLocation: string;
  date: string;
  drugName: string;
  batchNo: string;
  quantity: number;
  transferredBy: string;
}

const InternalConsumption: React.FC = () => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);

  const {
    data: internalConsumptionData,
    isLoading: internalConsumptionLoading,
    isFetching: internalConsumptionFetching,
  } = useGetInternalConsumptionsQuery({
    paginate: true,
    page: 1,
    limit: 1000,
    sort: { createdAt: -1 },
  });

  console.log("Internal Consumptions Data", internalConsumptionData);

  const internalConsumptionsLoading = internalConsumptionLoading || internalConsumptionFetching;

  // Map internal consumption data to table rows
  const internalConsumptions: RowType[] = useMemo(() => {
    return (
      (internalConsumptionData?.data?.records as unknown as InternalConsumptionRecord[])?.flatMap(
        (record: InternalConsumptionRecord) => {
          if (!record.items) return [];
          return record.items.flatMap((item: InternalTransferItem) => {
            if (!item.batches) return [];
            return item.batches
              .filter((batch) => batch.deductedQuantity > 0) // Only include batches with deducted quantity > 0
              .map((batch) => ({
                _id: `${record._id}-${batch.batchId}`,
                drugLocation: item.transferFrom?.location?.location || "Unknown Location",
                date: new Date(record.date).toLocaleDateString(),
                drugName: item.item?.item?.name || "Unknown Drug",
                batchNo: batch.batchId || "Unknown Batch",
                quantity: batch.deductedQuantity || 0,
                transferredBy: record.createdBy || "Unknown",
              }));
          });
        }
      ) || []
    );
  }, [internalConsumptionData]);

  console.log("Internal Consumptions Data after transformation", internalConsumptions);

  const openTransferModal = () => {
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const getRowId = (row: RowType) => row._id;

  const columns: GridColDef[] = [
    {
      field: "drugLocation",
      headerName: "Drug Location",
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
      valueFormatter(params) {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: "drugName",
      headerName: "Drug Name",
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      field: "batchNo",
      headerName: "Batch No",
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      field: "transferredBy",
      headerName: "Transferred By",
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
    },
  ];

  // Get stocks
  const { data: stocksData } = useGetStocksQuery();

  const stocks = stocksData?.data || [];

  return (
    <ContentSection title="Internal Consumption">
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="contained" color="primary" onClick={openTransferModal}>
          + Add Item
        </Button>
      </Box>

      <Box mt={2} flex={"1 1 auto"} width="100%">
        <CustomDataGrid
          autoHeight={false}
          columns={columns}
          rows={internalConsumptions}
          getRowId={getRowId}
          loading={internalConsumptionsLoading}
          enablePagination={false}
          sx={{ height: "100%" }}
        />
      </Box>

      {isTransferModalOpen && (
        <AddInternalConsumption
          open={isTransferModalOpen}
          onClose={closeTransferModal}
          pharmacyStock={stocks}
        />
      )}
    </ContentSection>
  );
};

export default InternalConsumption;
