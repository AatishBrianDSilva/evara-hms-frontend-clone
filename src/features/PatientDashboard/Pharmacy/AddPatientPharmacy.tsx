import React, { useCallback } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FormikErrors, FormikTouched, useFormik } from "formik";
import _ from "lodash";
import { IPharmacyStock } from "../../../types/pharmacyDashboard/stocks";
import { useToast } from "../../../context/ToastContext";
import { addPatientPharmacyValidationSchema } from "../../../yup/patientDashboard/pharmacy";
import { useAddPatientPharmacyMutation } from "../../../services/patientDashboardService/patientPharmacyApi";
import FieldAutocomplete from "../../../components/FieldAutoComplete/FieldAutoComplete";
import CustomDatePicker from "../../../components/CustomDatePicker/CustomDatePicker";
import { IDoctor } from "../../../types/doctor";
import Delete from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
import { IDrugLocation } from "../../../types/pharmacyDashboard/master";
import { formatToIndianCurrencyFormat } from "../../../utils/formatToIndianCurrencyFormat";

type SummaryEntry = {
  name: string;
  quantity: number;
  batchNumber: string;
  price: number;
  total: number;
};

interface AddPatientPharmacyProps {
  openModal: boolean;
  onClose: () => void;
  pharmacyStocks: IPharmacyStock[];
  doctors: IDoctor[];
  patientId: string;
}

interface IFormValues {
  doctor: IDoctor | null;
  date: Date | null;
  items: {
    stock: IPharmacyStock | null;
    details: {
      location: IDrugLocation | null;
      batchNumber: string | null;
      quantity: number;
    }[];
  }[];
}

const AddPatientPharmacy: React.FC<AddPatientPharmacyProps> = ({
  openModal,
  onClose,
  pharmacyStocks,
  doctors,
  patientId,
}) => {
  const { showPromiseToast } = useToast();

  const [addPharmacy, { isLoading }] = useAddPatientPharmacyMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    console.log("values", values);

    const payload = {
      patient: patientId,
      doctor: values.doctor?._id,
      date: values.date,
      items: values.items.map((item) => {
        return {
          stock: item.stock?._id,
          details: item.details.map((detail) => {
            return {
              location: detail.location?._id,
              batchNumber: detail.batchNumber,
              quantity: detail.quantity,
            };
          }),
        };
      }),
    };

    console.log("payload", payload);

    const promise = addPharmacy(payload).unwrap();

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

    closeModal();
  };

  const initialValues: IFormValues = {
    doctor: null,
    date: new Date(),
    items: [
      {
        stock: null,
        details: [
          {
            location: null,
            quantity: 0,
            batchNumber: null,
          },
        ],
      },
    ],
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: addPatientPharmacyValidationSchema,
  });

  const closeModal = () => {
    formik.resetForm();
    onClose();
  };

  const getFieldErrorAndTouched = useCallback(
    (index: number, fieldName: "stock" | "details") => {
      // Ensure that we're working with the correct structure
      const initialValues = formik.initialValues.items[index];

      const touched = formik?.touched?.items as FormikTouched<typeof initialValues>[];
      const error = formik?.errors?.items as FormikErrors<typeof initialValues>[];

      const isFieldTouched = touched?.[index]?.[fieldName];
      const fieldError = error?.[index]?.[fieldName];

      return {
        isError: Boolean(isFieldTouched && fieldError),
        errorMessage: typeof fieldError === "string" ? fieldError : undefined,
      };
    },
    [formik.touched.items, formik.errors.items]
  );

  const handleAddStock = () => {
    formik.setFieldValue("items", [
      ...formik.values.items,
      {
        stock: null,
        details: [
          {
            location: null,
            batchNumber: null,
            quantity: null,
          },
        ],
      },
    ]);
  };

  const handleDeleteStock = (index: number) => {
    const newFields = [...formik.values.items];
    newFields.splice(index, 1);
    formik.setFieldValue("items", newFields);
  };

  const handleAddStockDetails = (index: number) => {
    const newFields = [...formik.values.items];
    newFields[index].details.push({
      location: null,
      batchNumber: null,
      quantity: 0,
    });
    formik.setFieldValue("items", newFields);
  };

  const handleDeleteStockDetails = (index: number, detailIndex: number) => {
    const newFields = [...formik.values.items];
    newFields[index].details.splice(detailIndex, 1);
    formik.setFieldValue("items", newFields);
  };

  const calculateSummary = () => {
    const summary = formik.values.items.reduce<SummaryEntry[]>((acc, item) => {
      if (!item.stock || item.details.length === 0) return acc;

      const totalQuantity = item.details.reduce((sum, detail) => sum + (detail.quantity || 0), 0);

      if (item.stock && item.stock.item) {
        const existingItem = acc.find((i) => i.name === item?.stock?.item.name);
        if (existingItem) {
          existingItem.quantity += totalQuantity;
        } else {
          const pricePerUnit = item.stock.sellPrice / item.stock.item.packSize;
          const data = {
            name: item.stock.item.name,
            quantity: totalQuantity,
            batchNumber: item.details.map((detail) => detail.batchNumber).join(", "),
            price: pricePerUnit || 0,
            total: pricePerUnit * totalQuantity,
          };
          acc.push(data);
        }
      }
      return acc;
    }, []);
    return summary;
  };

  const SummaryTable = () => {
    const summaryData = calculateSummary();

    // Calculate total items and total amount
    const totalItems = summaryData.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = summaryData.reduce((sum, item) => sum + item.total, 0);

    return (
      summaryData.length > 0 && (
        <>
          <Typography variant="subtitle1" color="primary" mt={2} gutterBottom>
            Summary
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2, mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Batch No(s)</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summaryData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.batchNumber}</TableCell>
                    <TableCell>{formatToIndianCurrencyFormat(item.price)}</TableCell>
                    <TableCell>{formatToIndianCurrencyFormat(item.total)}</TableCell>
                  </TableRow>
                ))}
                {/* Add a footer row for totals */}
                <TableRow>
                  <TableCell colSpan={1} />
                  <TableCell>
                    <strong>Total Items: {totalItems}</strong>
                  </TableCell>
                  <TableCell colSpan={2} />
                  <TableCell>
                    <strong>Total: {formatToIndianCurrencyFormat(totalAmount)}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )
    );
  };

  return (
    <Modal open={openModal} onClose={closeModal}>
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          minHeight: "30vh",
          maxHeight: "86vh",
          overflowY: "auto",
          borderRadius: 1,
          boxShadow: 5,
          px: 8,
          py: 5,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" color={"primary"} mt={2} textAlign={"center"}>
          Add Medicine
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 2,
            mt: 2,
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid container gap={2} mt={2}>
              <Grid item lg={2}>
                <CustomDatePicker
                  label="Date"
                  value={formik.values.date}
                  onChange={(value) => formik.setFieldValue("date", value)}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                />
              </Grid>
              <Grid item lg={2}>
                <FieldAutocomplete
                  options={doctors}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  value={formik.values.doctor}
                  onChange={(newValue) => {
                    formik.setFieldValue("doctor", newValue);
                  }}
                  label="Doctor"
                  error={formik.touched.doctor && Boolean(formik.errors.doctor)}
                  helperText={formik.touched.doctor && formik.errors.doctor}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" color={"primary"} mt={2}>
              Pharmacy Item(s)
            </Typography>
            {formik.values.items.map((_field: any, index: number) => {
              const { isError: isStockError, errorMessage: stockErrorMessage } =
                getFieldErrorAndTouched(index, "stock");

              const isLastItem = index === formik.values.items.length - 1;
              const onlyOneItem = formik.values.items.length === 1;

              return (
                <Box key={index}>
                  <Grid container gap={1} mt={2} mb={4}>
                    {/* Abstracted Autocomplete for Items */}
                    <Grid item lg={4}>
                      <FieldAutocomplete
                        options={pharmacyStocks}
                        getOptionLabel={(option) => option?.item?.name || ""}
                        filterOptions={(options, params) => {
                          const inputValue = params.inputValue.toLowerCase();
                          return options.filter((option) => {
                            const optionLabel = option?.item?.name.toLowerCase();
                            return (
                              optionLabel.includes(inputValue) &&
                              !formik.values.items.some((item) => item.stock?._id === option._id)
                            );
                          });
                        }}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        value={formik.values.items[index].stock}
                        onChange={(newValue) => {
                          formik.setFieldValue(`items[${index}].stock`, newValue);
                          formik.setFieldValue(`items[${index}].details`, [
                            {
                              location: newValue?.location || null,
                              quantity: 0,
                              batchNumber: null,
                            },
                          ]);
                        }}
                        label="Item"
                        error={isStockError}
                        helperText={isStockError ? stockErrorMessage : ""}
                      />
                    </Grid>
                    {/* Dynamic Add/Delete Buttons */}
                    <Grid
                      item
                      lg={1}
                      display={"flex"}
                      justifyContent={"flex-start"}
                      alignItems={"flex-start"}
                    >
                      {!onlyOneItem && (
                        <IconButton size="small" onClick={() => handleDeleteStock(index)}>
                          <Delete fontSize={"small"} />
                        </IconButton>
                      )}
                      {isLastItem && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={handleAddStock}
                          disabled={formik.values.items.some(
                            (item) => !item.stock || !item.details
                          )}
                        >
                          <Add fontSize={"small"} />
                        </IconButton>
                      )}
                    </Grid>

                    {formik.values.items[index].stock &&
                      formik.values.items[index].details.map((detail, detailIndex) => {
                        const locations = formik.values.items[index].stock?.locations || [];
                        const drugBatches =
                          locations.find(
                            (location) => location.location._id === detail.location?._id
                          )?.batches || [];

                        const maxQuantity =
                          drugBatches.find((batch) => batch.batchNo === detail.batchNumber)
                            ?.quantity || 0;
                        const quantityLabel = `Quantity (Max: ${maxQuantity})`;

                        const onlyOneDetail = formik.values.items[index].details.length === 1;
                        const isLastDetail =
                          detailIndex === formik.values.items[index].details.length - 1;

                        return (
                          <Grid
                            container
                            gap={1}
                            key={detailIndex}
                            mt={1}
                            justifyContent={"center"}
                          >
                            <Grid item lg={3}>
                              <FieldAutocomplete
                                options={locations}
                                getOptionLabel={(option) => {
                                  if (option?.location?.location) {
                                    return option?.location?.location;
                                  } else {
                                    return option?.location;
                                  }
                                }}
                                isOptionEqualToValue={(option, value) => {
                                  return option?.location?._id === value?._id;
                                }}
                                // filterOptions={(options, _params) => {
                                //   return options.filter(option => {
                                //     return !formik.values.items[index].details.some(detail => detail.location?._id === option.location?._id)
                                //   })
                                // }}
                                value={formik.values.items[index].details[detailIndex].location}
                                onChange={(newValue) => {
                                  console.log("New Value", newValue?.location);
                                  formik.setFieldValue(
                                    `items[${index}].details[${detailIndex}].location`,
                                    newValue?.location
                                  );
                                }}
                                label="Location"
                                error={isStockError}
                                helperText={isStockError ? stockErrorMessage : ""}
                              />
                            </Grid>
                            <Grid item lg={2}>
                              <FieldAutocomplete
                                disabled={!formik.values.items[index].details[detailIndex].location}
                                options={drugBatches}
                                getOptionLabel={(option) => {
                                  return option?.batchNo ? option?.batchNo : option;
                                }}
                                isOptionEqualToValue={(option, value) => {
                                  return option.batchNo == value;
                                }}
                                value={formik.values.items[index].details[detailIndex].batchNumber}
                                onChange={(newValue) => {
                                  formik.setFieldValue(
                                    `items[${index}].details[${detailIndex}].batchNumber`,
                                    newValue?.batchNo
                                  );
                                }}
                                label="Batch No"
                                error={isStockError}
                                helperText={isStockError ? stockErrorMessage : ""}
                              />
                            </Grid>
                            <Grid item lg={2}>
                              <TextField
                                fullWidth
                                disabled={maxQuantity === 0}
                                label={quantityLabel}
                                type="number"
                                name={`items[${index}].details[${detailIndex}].quantity`}
                                value={
                                  formik.values.items[index].details[detailIndex].quantity || ""
                                }
                                onChange={formik.handleChange}
                                InputProps={{
                                  inputProps: {
                                    min: 1,
                                    max: maxQuantity,
                                  },
                                }}
                              />
                            </Grid>
                            {/* Dynamic Add/Delete Buttons */}
                            <Grid
                              item
                              lg={1}
                              display={"flex"}
                              justifyContent={"flex-start"}
                              alignItems={"flex-start"}
                            >
                              {!onlyOneDetail && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteStockDetails(index, detailIndex)}
                                >
                                  <Delete fontSize={"small"} />
                                </IconButton>
                              )}
                              {isLastDetail && (
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleAddStockDetails(index)}
                                  disabled={formik.values.items[index].details.some(
                                    (detail) =>
                                      !detail.location || !detail.batchNumber || !detail.quantity
                                  )}
                                >
                                  <Add fontSize={"small"} />
                                </IconButton>
                              )}
                            </Grid>
                          </Grid>
                        );
                      })}
                  </Grid>
                  <Divider />
                </Box>
              );
            })}

            {SummaryTable()}

            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
              gap={2}
              mb={2}
              mt={2}
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
                onClick={closeModal}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddPatientPharmacy;
