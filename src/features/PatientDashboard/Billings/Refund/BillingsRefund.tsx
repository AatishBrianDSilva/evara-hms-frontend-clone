import Box from "@mui/material/Box";
import React, { useState } from "react";
import CustomDataGrid from "../../../../components/CustomDataGrid/CustomDataGrid";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Chip, Skeleton } from "@mui/material";
import { Print, Visibility } from "@mui/icons-material";
import { useGetRefundsQuery } from "../../../../services/patientDashboardService/billings/billingApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { formatToIndianCurrencyFormat } from "../../../../utils/formatToIndianCurrencyFormat";
import ViewReports from "../../Journey/ViewReports";
import { usePrint } from "../../../../context/PrintPDFContext";

interface RowType {
  _id: string;
  createdAt: string;
  serviceName: string;
  itemName: string;
  batchNo: string;
  quantity: number;
  amount: number;
  reason: string;
  files: string[]; // Add this field for storing the uploaded invoice files
}

const BillingsRefund: React.FC = () => {
  const { fetchAndPrintPdf } = usePrint(); // Adding usePrint to handle the printing
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const { patient } = useSelector((state: RootState) => state.patients);

  const { data, isLoading, isFetching } = useGetRefundsQuery(
    {
      paginate: true,
      page: page,
      limit: pageSize,
      filters: {
        patientCode: patient?.patientId,
      },
      sort: {
        createdAt: -1,
      },
    },
    {
      skip: !patient?.patientId,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  console.log("Current Refund", data);

  // Flatten refund details into rows for the table
  const patientBillingsRefund: RowType[] =
    (data?.message as unknown as any[])?.flatMap(
      (refund: any) =>
        refund.refundDetails?.items?.map((item: any) => ({
          _id: refund._id,
          createdAt: item.refundDate || refund.createdAt,
          serviceName: item.serviceName || "",
          itemName: item.itemName || "",
          batchNo: item.batchNo || "",
          quantity: item.qtyToRefund || 0,
          amount: refund.refundDetails.refundAmount || 0,
          reason: refund.refundDetails.reason || "",
          files: refund.refundDetails.files || [], // Include files here
        })) || []
    ) || [];

  patientBillingsRefund.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const [isViewInvoicesModalOpen, setIsViewInvoicesModalOpen] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleViewInvoices = (files: string[]) => {
    setSelectedFiles(files);
    setIsViewInvoicesModalOpen(true);
  };

  const closeViewInvoicesModal = () => {
    setIsViewInvoicesModalOpen(false);
  };

  const patientBillingsPagination = data?.data?.pagination;
  const patientBillingsLoading = isLoading || isFetching;

  console.log("Refund Data", patientBillingsRefund);

  const getRowId = (row: RowType) => row._id;

  const columnsConfig: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Date",
      type: "date",
      flex: 1,
      valueFormatter(params) {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: "itemName",
      headerName: "Item",
      flex: 1,
    },
    {
      field: "batchNo",
      headerName: "Batch",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Qty",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      valueFormatter: (params) => formatToIndianCurrencyFormat(params.value),
    },
    {
      field: "reason",
      headerName: "Reason for Refund",
      flex: 2,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<Visibility />}
            label="View Invoices"
            onClick={() => handleViewInvoices(row.files)}
          />,
          <GridActionsCellItem
            icon={<Print />}
            label="Print"
            onClick={() => fetchAndPrintPdf(row._id)} // Using fetchAndPrintPdf to print the required invoice
          />,
        ];
      },
    },
  ];

  return (
    <Box p={2} display={"flex"} flexDirection={"column"} flex={1}>
      {patientBillingsLoading ? (
        <Box display={"flex"} justifyContent="space-between" alignItems="center" mb={3}>
          <Skeleton width={125} height={35} variant="rounded" />
          <Skeleton width={125} height={30} variant="rounded" />
          <Skeleton width={125} height={30} variant="rounded" />
          <Skeleton width={125} height={30} variant="rounded" />
        </Box>
      ) : (
        <Box display={"flex"} justifyContent="space-between" alignItems="center" mb={3}>
          <Chip
            label={
              "Total Refunds: " +
              formatToIndianCurrencyFormat(
                patientBillingsRefund.reduce((acc, refund) => acc + refund.amount, 0)
              )
            }
            color="primary"
          />
        </Box>
      )}

      <CustomDataGrid
        autoHeight={true}
        columns={columnsConfig}
        rows={patientBillingsRefund}
        page={page}
        getRowId={getRowId}
        pageSize={pageSize}
        totalRows={patientBillingsPagination?.totalDocs || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={patientBillingsLoading}
        sx={{ height: "100%" }}
        enablePagination={true}
      />

      {isViewInvoicesModalOpen && (
        <ViewReports
          openModal={isViewInvoicesModalOpen}
          onClose={closeViewInvoicesModal}
          files={selectedFiles}
        />
      )}
    </Box>
  );
};

export default BillingsRefund;
