import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useToast } from "../../../../context/ToastContext";
import { useAddDrugItemMutation } from "../../../../services/pharmacyDashboardService/master/drugItemApi";
import _ from "lodash";
import { AddDrugItemValidationSchema } from "../../../../yup/pharmacyDashboard";
import FieldAutocomplete from "../../../../components/FieldAutoComplete/FieldAutoComplete";
import {
  EDrugClass,
  IDrugCategory,
  IDrugManufacturer,
  IDrugType,
  ITaxRate,
} from "../../../../types/pharmacyDashboard/master";

interface AddDrugItemProps {
  openModal: boolean;
  onClose: () => void;
  drugCategories: IDrugCategory[];
  drugTypes: IDrugType[];
  drugManufacturers: IDrugManufacturer[];
  taxRates: ITaxRate[];
}

interface IFormValues {
  name: string;
  genericName: string;
  drugClass: string;
  hsnCode: string;
  category: IDrugCategory | null;
  type?: IDrugType | null;
  packSize?: null | number;
  taxRate: ITaxRate | null;
  manufacturer: IDrugManufacturer | null;
  mrp: number;
  rate: number;
  status: boolean;
}

const AddDrugItem: React.FC<AddDrugItemProps> = ({
  openModal,
  onClose,
  drugCategories,
  drugManufacturers,
  drugTypes,
  taxRates,
}) => {
  const { showPromiseToast } = useToast();

  const [addDrugItem, { isLoading }] = useAddDrugItemMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const type =
      values.category?.name === "Medication" ||
      values.category?.name === "Emergency Medication"
        ? values.type?._id
        : null;

    const payload = {
      name: values.name,
      genericName: values.genericName,
      drugClass: values.drugClass,
      hsnCode: values.hsnCode,
      category: values.category?._id || null,
      type: type,
      packSize: values.packSize ? values.packSize : 0,
      taxRate: values.taxRate?._id || null,
      mrp: values.mrp || 0,
      rate: values.rate || 0,
      manufacturer: values.manufacturer?._id || null,
      status: values.status ? "Active" : "Inactive",
    };

    const promise = addDrugItem(payload).unwrap();

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
    name: "",
    genericName: "",
    drugClass: "",
    hsnCode: "",
    category: null,
    type: null,
    packSize: null,
    taxRate: null,
    manufacturer: null,
    mrp: 0,
    rate: 0,
    status: false,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: AddDrugItemValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Add Drug Item</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2}>
            <Grid item lg={4}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item lg={4}>
              <TextField
                fullWidth
                id="genericName"
                name="genericName"
                label="Generic Name"
                value={formik.values.genericName}
                onChange={formik.handleChange}
                error={
                  formik.touched.genericName &&
                  Boolean(formik.errors.genericName)
                }
                helperText={
                  formik.touched.genericName && formik.errors.genericName
                }
              />
            </Grid>
            <Grid item lg={4}>
              <TextField
                select
                fullWidth
                id="drugClass"
                name="drugClass"
                label="Drug Class"
                value={formik.values.drugClass}
                onChange={formik.handleChange}
                error={
                  formik.touched.drugClass && Boolean(formik.errors.drugClass)
                }
                helperText={formik.touched.drugClass && formik.errors.drugClass}
              >
                {Object.values(EDrugClass).map((drugClass) => (
                  <MenuItem value={drugClass}>{drugClass}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item lg={4}>
              <TextField
                fullWidth
                id="hsnCode"
                name="hsnCode"
                label="HSN Code"
                value={formik.values.hsnCode}
                onChange={formik.handleChange}
                error={formik.touched.hsnCode && Boolean(formik.errors.hsnCode)}
                helperText={formik.touched.hsnCode && formik.errors.hsnCode}
              />
            </Grid>
            <Grid item lg={4}>
              <FieldAutocomplete
                options={drugCategories}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                getOptionLabel={(option) => option.name}
                label="Category"
                value={formik.values.category}
                onChange={(newValue) =>
                  formik.setFieldValue("category", newValue)
                }
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                helperText={formik.touched.category && formik.errors.category}
              />
            </Grid>
            <Grid item lg={4}>
              <FieldAutocomplete
                disabled={
                  formik.values.category?.name !== "Medication" &&
                  formik.values.category?.name !== "Emergency Medication"
                }
                options={drugTypes}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                getOptionLabel={(option) => _.upperFirst(option.name)}
                label="Type"
                value={formik.values.type}
                onChange={(newValue) => formik.setFieldValue("type", newValue)}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
              />
            </Grid>
            <Grid item lg={4}>
              <TextField
                fullWidth
                id="packSize"
                name="packSize"
                label="Pack Size"
                value={formik.values.packSize || ""}
                onChange={formik.handleChange}
                error={
                  formik.touched.packSize && Boolean(formik.errors.packSize)
                }
                helperText={formik.touched.packSize && formik.errors.packSize}
              />
            </Grid>
            <Grid item lg={4}>
              <FieldAutocomplete
                options={taxRates}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                getOptionLabel={(option) => option.taxRate.toString()}
                label="Tax Rate"
                value={formik.values.taxRate}
                onChange={(newValue) =>
                  formik.setFieldValue("taxRate", newValue)
                }
                error={formik.touched.taxRate && Boolean(formik.errors.taxRate)}
                helperText={formik.touched.taxRate && formik.errors.taxRate}
              />
            </Grid>
            <Grid item lg={4}>
              <TextField
                fullWidth
                id="MRP"
                name="mrp"
                label="MRP"
                value={formik.values.mrp}
                onChange={formik.handleChange}
                error={formik.touched.mrp && Boolean(formik.errors.mrp)}
                helperText={formik.touched.mrp && formik.errors.mrp}
              />
            </Grid>
            <Grid item lg={4}>
              <TextField
                fullWidth
                id="Rate"
                name="rate"
                label="Rate"
                value={formik.values.rate}
                onChange={formik.handleChange}
                error={formik.touched.rate && Boolean(formik.errors.rate)}
                helperText={formik.touched.rate && formik.errors.rate}
              />
            </Grid>
            <Grid item lg={4}>
              <FieldAutocomplete
                options={drugManufacturers}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                getOptionLabel={(option) => option.name}
                label="Manufacturer"
                value={formik.values.manufacturer}
                onChange={(newValue) =>
                  formik.setFieldValue("manufacturer", newValue)
                }
                error={
                  formik.touched.manufacturer &&
                  Boolean(formik.errors.manufacturer)
                }
                helperText={
                  formik.touched.manufacturer && formik.errors.manufacturer
                }
              />
            </Grid>
            <Grid item lg={12} display={"flex"} justifyContent={"center"}>
              <FormControlLabel
                label="Active ?"
                control={
                  <Checkbox
                    name="status"
                    value={formik.values.status}
                    checked={formik.values.status}
                    onChange={formik.handleChange}
                  />
                }
              />
            </Grid>
          </Grid>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={2}
            mb={2}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading || _.isEqual(initialValues, formik.values)}
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

export default AddDrugItem;
