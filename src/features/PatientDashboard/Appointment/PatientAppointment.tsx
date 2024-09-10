import React, { useState } from "react";
import { Box } from "@mui/material";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useGetAppointmentsQuery } from "../../../services/appointmentApi";

interface RowType {
  _id: string;
}

const PatientAppointment: React.FC = () => {
  const patient = useSelector((state: RootState) => state.patients.patient);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  // Fetch all the appointments
  const {
    data: appointmentData,
    isLoading,
    isFetching,
  } = useGetAppointmentsQuery(
    {
      sort: { date: -1 },
      page,
      limit: pageSize,
      filters: {
        patientId: patient?.patientId,
      },
    },
    { skip: !patient?.patientId }
  );

  const PatientAppointmentLoading = isLoading || isFetching;

  const appointmentsPagination = appointmentData?.data?.pagination;

  const records = appointmentData?.data?.records || [];

  const getRowId = (row: RowType) => row._id;

  // Columns configuration for the data grid
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
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
      field: "time",
      headerName: "Time",
      flex: 1,
    },
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "reason",
      headerName: "Reason",
      flex: 1,
    },
    {
      field: "mode",
      headerName: "Mode",
      flex: 1,
    },
    {
      field: "doctorFullName",
      headerName: "Doctor",
      flex: 1,
      valueGetter: (params) => `${params.row.doctorId.firstName} ${params.row.doctorId.lastName}`, // Alternatively, use this valueGetter to dynamically combine names
    },
  ];

  return (
    <Box display="flex" flexDirection="column" flex={1} p={2}>
      {/* <Box display="flex" justifyContent="flex-end" gap={2}>
        <TextField label="Search" size="small" variant="outlined" />
      </Box> */}

      <Box mt={2} flex={"1 1 auto"}>
        <CustomDataGrid
          autoHeight={false}
          columns={columns}
          rows={records}
          page={page}
          pageSize={pageSize}
          getRowId={getRowId}
          loading={PatientAppointmentLoading}
          sx={{ height: "100%" }}
          enablePagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          totalRows={appointmentsPagination?.totalDocs || 0}
        />
      </Box>
    </Box>
  );
};

export default PatientAppointment;
