import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Visibility } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useGetReportsQuery } from "../../../services/patientDashboardService/reportApi";
import { usePrint } from "../../../context/PrintPDFContext";

interface RowType {
  _id: string;
}

const Report: React.FC = () => {
  const patient = useSelector((state: RootState) => state.patients.patient);

  const { fetchAndPrintPdf } = usePrint();

  //   console.log("Patient Data", patient);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const {
    data: patientReportData,
    isLoading,
    isFetching,
  } = useGetReportsQuery(
    {
      paginate: false,
      filters: {
        patient: patient?._id,
      },
    },
    { skip: !patient?._id }
  );

  const PatientReportLoading = isLoading || isFetching;

  console.log("Report Data", patientReportData);

  // const Notes: INote[] = Array.isArray(NotesData?.data) ? NotesData?.data : [];
  const reports = patientReportData?.data || [];

  const getRowId = (row: RowType) => row._id;

  // Columns configuration for the data grid
  const columns: GridColDef[] = [
    {
      field: "reportName",
      headerName: "Report",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
    },
    {
      field: "clinicId",
      headerName: "Clinic",
      flex: 1,
    },
    {
      field: "updatedAt",
      headerName: "UpdatedAt",
      flex: 1,
      type: "date",
      valueFormatter(params) {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      cellClassName: "actions",
      // custom actions for the actions column
      getActions: (params: GridRowParams) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<Visibility />}
            label="Print"
            onClick={() => fetchAndPrintPdf(row?.source_report_id)}
          />,
        ];
      },
    },
  ];

  return (
    <Box display="flex" flexDirection="column" flex={1} p={2}>
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField label="Search" size="small" variant="outlined" />
      </Box>

      <Box mt={2} flex={"1 1 auto"}>
        <CustomDataGrid
          autoHeight={false}
          columns={columns}
          rows={reports}
          page={page}
          pageSize={pageSize}
          getRowId={getRowId}
          loading={PatientReportLoading}
          sx={{ height: "100%" }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      {/* View Modal */}
      {/* {isViewModalOpen && (
        <ViewPatientReport
          openModal={isViewModalOpen}
          onClose={closeViewModal}
          id={selectedRow || ""}
        />
      )} */}
    </Box>
  );
};

export default Report;
