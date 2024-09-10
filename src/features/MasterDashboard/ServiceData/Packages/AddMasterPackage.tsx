import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useFormik } from "formik";
import _ from "lodash";

import { useToast } from "../../../../context/ToastContext";
import CustomDatePicker from "../../../../components/CustomDatePicker/CustomDatePicker";
import FieldAutocomplete from "../../../../components/FieldAutoComplete/FieldAutoComplete";
import { useAddMasterPackageMutation } from "../../../../services/masterDashboardService/serviceData/masterPackagesApi";
import { useGetMasterDefaultProceduresQuery } from "../../../../services/masterDashboardService/serviceData/masterProceduresApi";
import { useGetMasterDefaultCryoPreservationQuery } from "../../../../services/masterDashboardService/serviceData/masterCryoPreservationApi";
import { useGetMasterDefaultInvestigationsQuery } from "../../../../services/masterDashboardService/serviceData/masterInvestigationApi";
import { useGetMasterDefaultServicesQuery } from "../../../../services/masterDashboardService/serviceData/masterServicesApi";
import { useGetMasterDefaultTreatmentCycleQuery } from "../../../../services/masterDashboardService/serviceData/cycles/masterTreatmentCycleApi";

interface AddMasterPackageProps {
  openModal: boolean;
  onClose: () => void;
}

interface IProcedureRow {
  procedure: any | null;
  procedureName: string;
  procedureId: string;
  description: string;
  procedureType: string;
  gender: string;
}

interface IInvestigationRow {
  investigation: any | null;
  testName: string;
  investigationId: string;
  description: string;
  gender: string;
  testType: string;
}

interface IServiceRow {
  service: any | null;
  name: string;
  serviceId: string;
  description: string;
  gender: string;
  serviceType: string;
}

interface ICryoPreservationRow {
  cryoPreservation: any | null;
  cryoPreservationName: string;
  cryoPreservationId: string;
  description: string;
  gender: string;
  cryoPreservationType: string;
}

interface ICycleRow {
  cycle: any | null;
  cycleName: string;
  cycleId: string;
  description: string;
  gender: string;
  cycleType: string;
}

interface IFormValues {
  packageName: string;
  price: number;
  validTill: Date | null;
  gender: string;
  isActive: boolean;
  procedures: IProcedureRow[];
  investigations: IInvestigationRow[];
  services: IServiceRow[];
  cryoPreservation: ICryoPreservationRow[];
  cycles: ICycleRow[];
}

const AddMasterPackage: React.FC<AddMasterPackageProps> = ({ openModal, onClose }) => {
  const { showPromiseToast } = useToast();

  // Fetching master procedures data
  const { data: defaultProceduresData, isLoading: isDefaultProceduresLoading } =
    useGetMasterDefaultProceduresQuery({
      paginate: false,
      filters: { isAdmin: true },
    });
  const { data: defaultInvestigationsData, isLoading: isDefaultInvestigationsLoading } =
    useGetMasterDefaultInvestigationsQuery({ paginate: false, filters: { isAdmin: true } });
  const { data: defaultServicesData, isLoading: isDefaultServicesLoading } =
    useGetMasterDefaultServicesQuery({
      paginate: false,
      filters: { isAdmin: true },
    });
  const { data: defaultCryoPreservationsData, isLoading: isDefaultCryoPreservationsLoading } =
    useGetMasterDefaultCryoPreservationQuery({ paginate: false, filters: { isAdmin: true } });
  const { data: defaultCyclesData, isLoading: isDefaultCyclesLoading } =
    useGetMasterDefaultTreatmentCycleQuery({ paginate: false, filters: { isAdmin: true } });

  const defaultProcedures = defaultProceduresData?.data || [];
  const defaultInvestigations = defaultInvestigationsData?.data || [];
  const defaultServices = defaultServicesData?.data || [];
  const defaultCycles = defaultCyclesData?.data || [];
  const defaultCryoPreservation = defaultCryoPreservationsData?.data || [];

  const [addPackage, { isLoading }] = useAddMasterPackageMutation();

  // State to manage the dynamically added rows
  const [procedureRows, setProcedureRows] = useState<IProcedureRow[]>([]);
  const [investigationRows, setInvestigationRows] = useState<IInvestigationRow[]>([]);
  const [serviceRows, setServiceRows] = useState<IServiceRow[]>([]);
  const [cryoPreservationRows, setCryoPreservationRows] = useState<ICryoPreservationRow[]>([]);
  const [cycleRows, setCycleRows] = useState<ICycleRow[]>([]);

  // Handle form submission
  const handleFormSubmit = async (values: IFormValues) => {
    // Prepare payload with selected procedures and master valid date
    const payload = {
      name: values.packageName,
      price: values.price,
      validTill: values.validTill,
      gender: values.gender,
      active: values.isActive,

      // Payload for Procedures
      procedures: values.procedures.map((p) => ({
        procedure: p.procedure._id,
        name: appendPackageName(p.procedureName),
        validTill: values.validTill, // Use master valid date for each procedure
        isPackageItem: true, // set isPackageItem to true for each item
        description: p.description,
        procedureType: p.procedureType,
        gender: p.gender,
      })),

      // Payload for Investigations
      investigations: investigationRows.map((i) => ({
        investigation: i.investigation._id,
        name: appendPackageName(i.testName),
        validTill: values.validTill, // Use master valid date for each investigation
        isPackageItem: true, // set isPackageItem to true for each item
        description: i.description,
        gender: i.gender,
        testType: i.testType,
      })),

      // Payload for Services
      services: serviceRows.map((s) => ({
        service: s.service._id,
        name: appendPackageName(s.name),
        validTill: values.validTill, // Use master valid date for each service
        isPackageItem: true, // set isPackageItem to true for each item
        description: s.description,
        gender: s.gender,
        serviceType: s.serviceType,
      })),

      // Payload for Cryo Preservations
      cryoPreservations: cryoPreservationRows.map((c) => ({
        cryoPreservation: c.cryoPreservation._id,
        name: appendPackageName(c.cryoPreservationName),
        validTill: values.validTill, // Use master valid date for each cryo preservation
        isPackageItem: true, // set isPackageItem to true for each item
        description: c.description,
        gender: c.gender,
        cryoPreservationType: c.cryoPreservationType,
      })),

      // Payload for Cycles
      cycles: cycleRows.map((c) => ({
        cycle: c.cycle._id,
        name: appendPackageName(c.cycleName),
        validTill: values.validTill, // Use master valid date for each cycle
        isPackageItem: true, // set isPackageItem to true for each item
        description: c.description,
        gender: c.gender,
        cycleType: c.cycleType,
      })),
    };

    console.log("Payload to be submitted:", payload); // Log the payload

    const promise = addPackage(payload).unwrap();

    showPromiseToast(promise, {
      loading: "Adding...",
      success: (data) => data || "Added Successfully",
      error: (data) => data || "Adding Failed",
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  const initialValues: IFormValues = {
    packageName: "",
    price: 0,
    validTill: null,
    gender: "",
    isActive: true,
    procedures: [],
    investigations: [],
    services: [],
    cryoPreservation: [],
    cycles: [],
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  function appendPackageName(itemName: string) {
    return `${itemName} - ${formik.values.packageName}`;
  }

  // Function to add a new procedure row
  const addProcedureRow = () => {
    setProcedureRows([
      ...procedureRows,
      {
        procedure: null,
        procedureName: "",
        procedureId: "",
        description: "",
        procedureType: "",
        gender: "",
      },
    ]);
  };

  // Function to remove a procedure row
  const removeProcedureRow = (index: number) => {
    setProcedureRows(procedureRows.filter((_, i) => i !== index));
  };

  // Adding rows
  const addInvestigationRow = () =>
    setInvestigationRows([
      ...investigationRows,
      {
        investigation: null,
        testName: "",
        investigationId: "",
        description: "",
        gender: "",
        testType: "",
      },
    ]);
  const addServiceRow = () =>
    setServiceRows([
      ...serviceRows,
      { service: null, name: "", serviceId: "", description: "", gender: "", serviceType: "" },
    ]);
  const addCryoPreservationRow = () =>
    setCryoPreservationRows([
      ...cryoPreservationRows,
      {
        cryoPreservation: null,
        cryoPreservationName: "",
        cryoPreservationId: "",
        description: "",
        gender: "",
        cryoPreservationType: "",
      },
    ]);
  const addCycleRow = () =>
    setCycleRows([
      ...cycleRows,
      { cycle: null, cycleName: "", cycleId: "", description: "", gender: "", cycleType: "" },
    ]);

  // Removing rows
  const removeInvestigationRow = (index: number) =>
    setInvestigationRows(investigationRows.filter((_, i) => i !== index));
  const removeServiceRow = (index: number) =>
    setServiceRows(serviceRows.filter((_, i) => i !== index));
  const removeCryoPreservationRow = (index: number) =>
    setCryoPreservationRows(cryoPreservationRows.filter((_, i) => i !== index));
  const removeCycleRow = (index: number) => setCycleRows(cycleRows.filter((_, i) => i !== index));

  // Function to check if required fields are filled
  const isFormComplete =
    formik.values.packageName &&
    formik.values.price &&
    formik.values.validTill &&
    formik.values.gender;

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Add Master Package</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
          {/* Package details */}
          <Grid container spacing={2} mb={2} mt={2} alignItems="center">
            <Grid item xs={12} sm={6} lg={3}>
              <TextField
                fullWidth
                id="packageName"
                name="packageName"
                label="Package Name"
                value={formik.values.packageName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Price"
                value={formik.values.price}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <CustomDatePicker
                name="validTill"
                label="Valid Till"
                minDate={new Date()}
                value={formik.values.validTill}
                onChange={(value) => formik.setFieldValue("validTill", value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <TextField
                fullWidth
                id="gender"
                name="gender"
                label="Gender"
                select
                value={formik.values.gender}
                onChange={formik.handleChange}
              >
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Buttons to add different types of items */}
          <Grid container spacing={2} mt={2}>
            <Grid item xs="auto">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addInvestigationRow}
                disabled={!isFormComplete}
              >
                Add Investigation
              </Button>
            </Grid>
            <Grid item xs="auto">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addProcedureRow}
                disabled={!isFormComplete}
              >
                Add Procedure
              </Button>
            </Grid>
            <Grid item xs="auto">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addServiceRow}
                disabled={!isFormComplete}
              >
                Add Service
              </Button>
            </Grid>
            <Grid item xs="auto">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addCryoPreservationRow}
                disabled={!isFormComplete}
              >
                Add Cryo Preservation
              </Button>
            </Grid>
            {/* Conditionally render "Add Cycle" button */}
            {formik.values.gender === "female" && (
              <Grid item xs="auto">
                <Button variant="outlined" startIcon={<AddIcon />} onClick={addCycleRow}>
                  Add Cycle
                </Button>
              </Grid>
            )}
          </Grid>

          {/* Dynamic rows for adding procedures */}
          {procedureRows.map((row, index) => (
            <Grid container spacing={2} mt={2} key={index}>
              <Grid item xs={12} sm={4} lg={4}>
                <FieldAutocomplete
                  label="Master Procedure"
                  options={defaultProcedures}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  getOptionLabel={(option) => option.procedureName}
                  loading={isDefaultProceduresLoading}
                  value={row.procedure}
                  onChange={(value) => {
                    const updatedRows = [...procedureRows];
                    updatedRows[index] = {
                      procedure: value,
                      procedureName: value?.procedureName || "",
                      procedureId: value?.procedureId || "",
                      description: value?.description || "",
                      procedureType: value?.procedureType || "",
                      gender: value?.gender || "",
                    };
                    setProcedureRows(updatedRows);
                    formik.setFieldValue("procedures", updatedRows);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  fullWidth
                  id={`procedureName-${index}`}
                  name={`procedureName-${index}`}
                  label="Procedure Name"
                  helperText={`Procedure name : ${appendPackageName(row.procedureName)}`}
                  value={row.procedureName}
                  onChange={(e) => {
                    const updatedRows = [...procedureRows];
                    updatedRows[index].procedureName = e.target.value;
                    setProcedureRows(updatedRows);
                    formik.setFieldValue("procedures", updatedRows);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={2}>
                <TextField
                  fullWidth
                  id={`procedureId-${index}`}
                  name={`procedureId-${index}`}
                  label="Procedure ID"
                  value={row.procedureId}
                  onChange={formik.handleChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={2} lg={2} display="flex" alignItems="center">
                <IconButton onClick={() => removeProcedureRow(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {/* Investigation Row */}
          {investigationRows.map((row, index) => (
            <Grid container spacing={2} mt={2} key={`investigation-${index}`}>
              <Grid item xs={12} sm={4} lg={4}>
                <FieldAutocomplete
                  label="Master Investigation"
                  options={defaultInvestigations}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  getOptionLabel={(option) => option.testName}
                  loading={isDefaultInvestigationsLoading}
                  value={row.investigation}
                  onChange={(value) => {
                    const updatedRows = [...investigationRows];
                    updatedRows[index] = {
                      investigation: value,
                      testName: value?.testName || "",
                      investigationId: value?.testId || "",
                      description: value?.description || "",
                      gender: value?.gender || "",
                      testType: value?.testType || "",
                    };
                    setInvestigationRows(updatedRows);
                    formik.setFieldValue("investigations", updatedRows);
                  }}
                />{" "}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  fullWidth
                  label="Investigation Name"
                  value={row.testName}
                  helperText={`Investigation name : ${appendPackageName(row.testName)}`}
                  onChange={(e) => {
                    const updatedRows = [...investigationRows];
                    updatedRows[index].testName = e.target.value;
                    setInvestigationRows(updatedRows);
                    formik.setFieldValue("investigations", updatedRows);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={2}>
                <TextField
                  fullWidth
                  label="Investigation ID"
                  value={row.investigationId}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={2} lg={2} display="flex" alignItems="center">
                <IconButton onClick={() => removeInvestigationRow(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {/* Service Row */}
          {serviceRows.map((row, index) => (
            <Grid container spacing={2} mt={2} key={`service-${index}`}>
              <Grid item xs={12} sm={4} lg={4}>
                <FieldAutocomplete
                  label="Service"
                  options={defaultServices}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  getOptionLabel={(option) => option.name}
                  loading={isDefaultServicesLoading}
                  value={row.service}
                  onChange={(value) => {
                    const updatedRows = [...serviceRows];
                    updatedRows[index] = {
                      service: value,
                      name: value?.name || "",
                      serviceId: value?.serviceId || "",
                      description: value?.description || "",
                      gender: value?.gender || "",
                      serviceType: value?.serviceType || "",
                    };
                    setServiceRows(updatedRows);
                    formik.setFieldValue("services", updatedRows);
                  }}
                />{" "}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  fullWidth
                  label="Master Service Name"
                  value={row.name}
                  helperText={`Service name : ${appendPackageName(row.name)}`}
                  onChange={(e) => {
                    const updatedRows = [...serviceRows];
                    updatedRows[index].name = e.target.value;
                    setServiceRows(updatedRows);
                    formik.setFieldValue("services", updatedRows);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={2}>
                <TextField fullWidth label="Service ID" value={row.serviceId} disabled />
              </Grid>
              <Grid item xs={12} sm={2} lg={2} display="flex" alignItems="center">
                <IconButton onClick={() => removeServiceRow(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {/* Cryo preservastion row */}
          {cryoPreservationRows.map((row, index) => (
            <Grid container spacing={2} mt={2} key={`cryoPreservation-${index}`}>
              <Grid item xs={12} sm={4} lg={4}>
                <FieldAutocomplete
                  label="Cryo Preservation"
                  options={defaultCryoPreservation}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  getOptionLabel={(option) => option.cryoPreservationName}
                  loading={isDefaultCryoPreservationsLoading}
                  value={row.cryoPreservation}
                  onChange={(value) => {
                    const updatedRows = [...cryoPreservationRows];
                    updatedRows[index] = {
                      cryoPreservation: value,
                      cryoPreservationName: value?.cryoPreservationName || "",
                      cryoPreservationId: value?.cryoPreservationId || "",
                      description: value?.description || "",
                      gender: value?.gender || "",
                      cryoPreservationType: value?.cryoPreservationType || "",
                    };
                    setCryoPreservationRows(updatedRows);
                    formik.setFieldValue("cryoPreservation", updatedRows);
                  }}
                />{" "}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  fullWidth
                  label="Master Cryo Preservation Name"
                  value={row.cryoPreservationName}
                  helperText={`Cryo Preservation name : ${appendPackageName(
                    row.cryoPreservationName
                  )}`}
                  onChange={(e) => {
                    const updatedRows = [...cryoPreservationRows];
                    updatedRows[index].cryoPreservationName = e.target.value;
                    setCryoPreservationRows(updatedRows);
                    formik.setFieldValue("cryoPreservation", updatedRows);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={2}>
                <TextField
                  fullWidth
                  label="Cryo Preservation ID"
                  value={row.cryoPreservationId}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={2} lg={2} display="flex" alignItems="center">
                <IconButton onClick={() => removeCryoPreservationRow(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {/* Cycle Rows */}
          {cycleRows.map((row, index) => (
            <Grid container spacing={2} mt={2} key={`cycle-${index}`}>
              <Grid item xs={12} sm={4} lg={4}>
                <FieldAutocomplete
                  label="Cycle"
                  options={defaultCycles}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  getOptionLabel={(option) => option.cycleName}
                  loading={isDefaultCyclesLoading}
                  value={row.cycle}
                  onChange={(value) => {
                    const updatedRows = [...cycleRows];
                    updatedRows[index] = {
                      cycle: value,
                      cycleName: value?.cycleName || "",
                      cycleId: value?.cycleId || "",
                      description: value?.description || "",
                      gender: value?.gender || "",
                      cycleType: value?.cycleType || "",
                    };
                    setCycleRows(updatedRows);
                    formik.setFieldValue("cycles", updatedRows);
                  }}
                />{" "}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  fullWidth
                  label="Master Cycle Name"
                  value={row.cycleName}
                  helperText={`Cycle name : ${appendPackageName(row.cycleName)}`}
                  onChange={(e) => {
                    const updatedRows = [...cycleRows];
                    updatedRows[index].cycleName = e.target.value;
                    setCycleRows(updatedRows);
                    formik.setFieldValue("cycle", updatedRows);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={2}>
                <TextField fullWidth label="Cycle ID" value={row.cycleId} disabled />
              </Grid>
              <Grid item xs={12} sm={2} lg={2} display="flex" alignItems="center">
                <IconButton onClick={() => removeCycleRow(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {/* Is Active checkbox moved to the end */}
          <Grid item xs={12} sm={6} lg={4} mb={2} mt={4}>
            <FormControlLabel
              label="Is Active ?"
              control={
                <Checkbox
                  name="isActive"
                  checked={formik.values.isActive}
                  onChange={formik.handleChange}
                />
              }
            />
          </Grid>

          {/* Save and Cancel buttons */}
          <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isFormComplete || isLoading}
              sx={{ width: "fit-content" }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "fit-content" }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddMasterPackage;
