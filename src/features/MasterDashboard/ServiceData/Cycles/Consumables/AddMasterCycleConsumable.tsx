import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";
import {
  useAddServiceCycleConsumableMutation,
} from "../../../../../services/masterDashboardService/serviceData/cycles/masterCyclesConsumablesApi";
import { useToast } from "../../../../../context/ToastContext";
import { useGetStocksQuery } from "../../../../../services/pharmacyDashboardService/stocksApi";
import { IPharmacyStock } from "../../../../../types/pharmacyDashboard/stocks";
import FieldAutocomplete from "../../../../../components/FieldAutoComplete/FieldAutoComplete";
import { useGetServiceCycleStagesQuery } from "../../../../../services/masterDashboardService/serviceData/cycles/masterCyclesStagesApi";

interface AddMasterCycleConsumableProps {
  openModal: boolean;
  onClose: () => void;
}

interface IFormValues {
  pharmacyStock: IPharmacyStock | null;
  stage: any;
  treatment: string;
}

const AddMasterCycleConsumable: React.FC<AddMasterCycleConsumableProps> = ({
  openModal,
  onClose,
}) => {
  const { showPromiseToast } = useToast();

  //fetching default data
  const { data: pharmacyStockData,
    isLoading: isPharmacyStockLoading,
    isFetching: isPharmacyStockFetching
  } = useGetStocksQuery();
  const pharmacyStocks = pharmacyStockData?.data || [];
  const pharmacyStocksLoading = isPharmacyStockLoading || isPharmacyStockFetching;

  //fetching default data
  const { data: masterCycleStagesData,
    isLoading: isMasterCycleStageLoading,
    isFetching: isMasterCycleStageFetching
  } = useGetServiceCycleStagesQuery({
    paginate: false,
    filters: { isAdmin: true },
  });
  const cycleStages = masterCycleStagesData?.data || [];
  const cycleStagesLoading = isMasterCycleStageLoading || isMasterCycleStageFetching;



  // const cycleConsumables = cycleConsumablesData?.data || [];
  const [addCycleConsumable, { isLoading }] = useAddServiceCycleConsumableMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    console.log("Form values submitted", values);



    const payload = {
      pharmacyStock: values.pharmacyStock?._id,
      stage: values.stage?._id || null,
      treatment: values.treatment,
    };

    console.log("Payload to be submitted:", payload); // Log the payload

    // Add your submission logic here, including tax
    // Extract tax from values
    const promise = addCycleConsumable(payload).unwrap();

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
    pharmacyStock: null,
    stage: null,
    treatment: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Add Cycle Consumable</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={6} sm={3} lg={3}>
              <FieldAutocomplete
                label="Pharmacy Consumable"
                options={pharmacyStocks}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                getOptionLabel={(option) => option.item.name}
                loading={pharmacyStocksLoading}
                value={formik.values.pharmacyStock}
                onChange={(value) => {
                  formik.setFieldValue("pharmacyStock", value);
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} lg={3}>
              <FieldAutocomplete
                label="Stage"
                options={cycleStages}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                getOptionLabel={(option) => option.name}
                loading={cycleStagesLoading}
                value={formik.values.stage}
                onChange={(value) => {
                  formik.setFieldValue("stage", value);
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} lg={3}>
              <TextField
                fullWidth
                id="treatment"
                name="treatment"
                label="Treatment"
                value={formik.values.treatment}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={_.isEqual(initialValues, formik.values) || isLoading}
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

export default AddMasterCycleConsumable;

