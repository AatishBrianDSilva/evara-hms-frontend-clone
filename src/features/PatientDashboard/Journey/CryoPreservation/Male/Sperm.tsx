import {
  Box,
  Button,
  Grid,
  Skeleton,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import React from 'react';
import ReportModalHeader from '../../../../../components/ReportModalHeader/ReportModalHeader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import { useFormik } from 'formik';
import _ from 'lodash';
import { closeEditCryoPreservation } from '../cryoPreservationSlice';
import CustomDatePicker from '../../../../../components/CustomDatePicker/CustomDatePicker';
import {
  IEditCryoPreservationForm,
  IEditCryoPreservationPayload,
} from '../../../../../types/patientDashboard/cryoPreservations';
import { ICryoPreservationSpermForm } from '../../../../../types/patientDashboard/investigation';
import Divider from '@mui/material/Divider';
import { ECryoPreservationType } from '../../../../../types/master';
import {
  useEditCryoPreservationMutation,
  useGetCryoPreservationByIdQuery,
} from '../../../../../services/patientDashboardService/cryoPreservationApi';
import { useToast } from '../../../../../context/ToastContext';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../../types/global';
import FieldAutocomplete from '../../../../../components/FieldAutoComplete/FieldAutoComplete';
import { DoctorSpeciality } from '../../../../../types/masterDashboard/global';
import { useGetDoctorsQuery } from '../../../../../services/doctorsApi';

const renderSkeletonLoader = () => {
  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        borderBottom={1}
        py={2}
      >
        <Box>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>
        <Box>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>
      </Box>
      <Box pt={2} mt={2}>
        <Box>
          <Grid container justifyContent={'space-between'}>
            <Grid item md={6} lg={3}>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
            <Grid item>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Grid item lg={3}>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
            <Grid item lg={3}>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box></Box>
    </>
  );
};

const Sperm: React.FC = () => {
  const dispatch = useDispatch();
  const { showPromiseToast } = useToast();

  // const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>([""]);
  const patient = useSelector((state: RootState) => state.patients.patient);

  // Fetch doctors for the doctor selection
  const { data: doctorData } = useGetDoctorsQuery({});
  const doctors = doctorData?.data?.records || [];

  const [editCryopreservation, { isLoading }] =
    useEditCryoPreservationMutation();

  const openEditDialog = useSelector(
    (state: RootState) => state.cryoPreservation.editCryoPreservationOpen,
  );

  const {
    data: cryopresrvationData,
    isLoading: cryopresrvationLoading,
    isFetching: cryopresrvationFetching,
  } = useGetCryoPreservationByIdQuery(openEditDialog.id, {
    skip: !openEditDialog || !openEditDialog.id,
  });
  const Cryopreservation = cryopresrvationData?.data;
  console.log('CryoPreservation Fetch at sperm.tsx', Cryopreservation);

  const loading = cryopresrvationLoading || cryopresrvationFetching;

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    // Initialize with an empty array by default
    let initialUrl: string[] = [];

    // Check if the file upload URL is present in the investigation details
    if (Cryopreservation?.details?.files) {
      initialUrl = Cryopreservation.details.files.flat();
    }

    return initialUrl;
  });

  const date = new Date(
    Cryopreservation?.date || new Date(),
  ).toLocaleDateString();
  const doctor =
    Cryopreservation?.doctor?.firstName +
    ' ' +
    Cryopreservation?.doctor?.lastName;
  const cryopreservationName = Cryopreservation?.details?.cryoPreservationName;
  const actualProcedureName = Cryopreservation?.cryo?.name;

  const initialValues: IEditCryoPreservationForm<ICryoPreservationSpermForm> = {
    status: Cryopreservation?.status || '',
    details: {
      // doctor: Cryopreservation?.details?.details?.doctor || null,
      // date: Cryopreservation?.details?.details?.date || null,
      // time: Cryopreservation?.details?.details?.time || null,
      // Sperm Freezing Keys
      spermProductionDate:
        Cryopreservation?.details?.details?.spermProductionDate || null,
      spermFreezingType:
        Cryopreservation?.details?.details?.spermFreezingType || '',
      spermFreezingId:
        Cryopreservation?.details?.details?.spermFreezingId || '',
      periodOfAbstinence:
        Cryopreservation?.details?.details?.periodOfAbstinence || '',
      sampleCollectionLocation:
        Cryopreservation?.details?.details?.sampleCollectionLocation || '',
      freezingDate: Cryopreservation?.details?.details?.freezingDate || null,
      morphology: Cryopreservation?.details?.details?.morphology || '',
      // Sperm Wash Keys
      // semenPreparation: Cryopreservation?.details?.details?.semenPreparation || "",
      // spermVol: Cryopreservation?.details?.details?.spermVol || "",
      // spermConc: Cryopreservation?.details?.details?.spermConc || "",
      // motility: Cryopreservation?.details?.details?.motility || "",
      // progressiveMotility: Cryopreservation?.details?.details?.progressiveMotility || "",
      // nonProgressiveMotility: Cryopreservation?.details?.details?.nonProgressiveMotility || "",
      // immotile: Cryopreservation?.details?.details?.immotile || "",
      // washType: Cryopreservation?.details?.details?.washType || "",
      durationOfFreezing:
        Cryopreservation?.details?.details?.durationOfFreezing || '',
      // daysOfFreezing: Cryopreservation?.details?.details?.daysOfFreezing || "",
      embryologist: Cryopreservation?.details?.details?.embryologist || null,
      // Freezing Location
      noOfVials: Cryopreservation?.details?.details?.noOfVials || '',
      cryoVialNo: Cryopreservation?.details?.details?.cryoVialNo || '',
      cannisterNo: Cryopreservation?.details?.details?.cannisterNo || '',
      tankNo: Cryopreservation?.details?.details?.tankNo || '',
      comments: Cryopreservation?.details?.details?.comments || '',
      // Media Details
      freezingMedia: Cryopreservation?.details?.details?.freezingMedia || '',
      mediaBatchNo: Cryopreservation?.details?.details?.mediaBatchNo || '',
      mediaExpiryDate:
        Cryopreservation?.details?.details?.mediaExpiryDate || null,
      mediaRemarks: Cryopreservation?.details?.details?.mediaRemarks || '',
      description: Cryopreservation?.details?.details?.description || '',
      // sperm_wash_items: Cryopreservation?.details?.details?.sperm_wash_items?.map((item) => ({
      // sperm_wash_items: (Cryopreservation?.details?.details?.sperm_wash_items || []).map(
      //   (item: ISpermWashItem) => ({
      //     semenPreparation: item.semenPreparation || "",
      //     spermVol: item.spermVol || "",
      //     spermConc: item.spermConc || "",
      //     motility: item.motility || "",
      //     progressiveMotility: item.progressiveMotility || "",
      //     nonProgressiveMotility: item.nonProgressiveMotility || "",
      //     immotile: item.immotile || "",
      //     washType: item.washType || "",
      //   })
      // ) || [
      //   {
      //     semenPreparation: "",
      //     spermVol: "",
      //     spermConc: "",
      //     motility: "",
      //     progressiveMotility: "",
      //     nonProgressiveMotility: "",
      //     immotile: "",
      //     washType: "",
      //   },
      // ],
      sperm_wash_items: Cryopreservation?.details?.details
        ?.sperm_wash_items || [
        {
          semenPreparation: '',
          spermVol: '',
          spermConc: '',
          motility: '',
          progressiveMotility: '',
          nonProgressiveMotility: '',
          immotile: '',
          washType: '',
        },
      ],
      discard: Cryopreservation?.details?.details?.discard || false,
    },
    files: Cryopreservation?.details?.files || [],
  };

  const handleSubmit = async (
    values: IEditCryoPreservationForm<ICryoPreservationSpermForm>,
  ) => {
    const actualName = actualProcedureName || 'Default CryoPreservation Name'; // Use a fallback if procedureName is null/undefined

    const payload: IEditCryoPreservationPayload = {
      details: {
        procedureName: cryopreservationName!,
        details: formik.values.details,
        files: fileUploadedUrl,
        notes: formik.values.notes,
      },
      status: values.status,
      testType: ECryoPreservationType.Sperm,
      actualName: actualName, // New field added to the payload
    };

    const promise = editCryopreservation({
      _id: openEditDialog.id,
      ...payload,
    }).unwrap();

    showPromiseToast(promise, {
      loading: 'Updating cryopreservation...',
      success: () => ' cryopreservation updated successfully',
      error: () => 'An error occurred while updating  cryopreservation',
    });

    try {
      await promise;
    } catch (error) {
      console.error('Failed to update  cryopreservation', error);
    }
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const handleAddFields = () => {
    formik.setFieldValue('details.sperm_wash_items', [
      ...formik.values.details.sperm_wash_items,
      {
        semenPreparation: '',
        spermVol: '',
        spermConc: '',
        motility: '',
        progressiveMotility: '',
        nonProgressiveMotility: '',
        immotile: '',
        washType: '',
      },
    ]);
    console.log('Add field values');
  };

  const handleDeleteField = (index: number) => {
    const newFields = formik.values.details.sperm_wash_items.filter(
      (_, i) => i !== index,
    );
    formik.setFieldValue('details.sperm_wash_items', newFields);
    console.log('Delete row');
  };

  const onModalClose = () => {
    formik.resetForm();
    dispatch(closeEditCryoPreservation());
  };

  if (loading) return renderSkeletonLoader();

  // log to check the content of sperm_wash_items
  console.log('Sperm Wash Items:', formik.values.details.sperm_wash_items);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ReportModalHeader
        date={date}
        doctor={doctor}
        reportName={cryopreservationName}
      />
      <Box display={'flex'} flexDirection={'column'} mt={2} flex={1}></Box>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
        Sperm Freezing
      </Typography>

      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <CustomDatePicker
            name="details.spermProductionDate"
            value={formik?.values.details.spermProductionDate}
            label="Production Date"
            onChange={date =>
              formik.setFieldValue('details.spermProductionDate', date)
            }
            error={
              formik.touched?.details?.spermProductionDate &&
              Boolean(formik.errors?.details?.spermProductionDate)
            }
            helperText={
              formik.touched.details?.spermProductionDate &&
              formik.errors.details?.spermProductionDate
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="details.spermFreezingType"
            fullWidth
            label="Sperm Freezing Type"
            value={formik.values.details.spermFreezingType}
            onChange={formik.handleChange}
            error={
              formik.touched.details?.spermFreezingType &&
              Boolean(formik.errors.details?.spermFreezingType)
            }
            helperText={
              formik.touched.details?.spermFreezingType &&
              formik.errors.details?.spermFreezingType
            }
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Sperm Freezing ID"
            fullWidth
            name="details.spermFreezingId"
            value={formik.values.details.spermFreezingId}
            onChange={formik.handleChange}
            error={
              formik.touched.details?.spermFreezingId &&
              Boolean(formik.errors.details?.spermFreezingId)
            }
            helperText={
              formik.touched.details?.spermFreezingId &&
              formik.errors.details?.spermFreezingId
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Period Of Abstinence(Days)"
            type="number"
            fullWidth
            name="details.periodOfAbstinence"
            value={formik.values.details.periodOfAbstinence}
            onChange={formik.handleChange}
            error={
              formik.touched.details?.periodOfAbstinence &&
              Boolean(formik.errors.details?.periodOfAbstinence)
            }
            helperText={
              formik.touched.details?.periodOfAbstinence &&
              formik.errors.details?.periodOfAbstinence
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="details.sampleCollectionLocation"
            fullWidth
            label="Sample Collection Location"
            value={formik.values.details.sampleCollectionLocation}
            onChange={formik.handleChange}
            error={
              formik.touched.details?.sampleCollectionLocation &&
              Boolean(formik.errors.details?.sampleCollectionLocation)
            }
            helperText={
              formik.touched.details?.sampleCollectionLocation &&
              formik.errors.details?.sampleCollectionLocation
            }
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomDatePicker
            name="details.freezingDate"
            value={formik?.values.details.freezingDate}
            label="Sperm Freezing Date"
            onChange={date =>
              formik.setFieldValue('details.freezingDate', date)
            }
            error={
              formik.touched?.details?.freezingDate &&
              Boolean(formik.errors?.details?.freezingDate)
            }
            helperText={
              formik.touched.details?.freezingDate &&
              formik.errors.details?.freezingDate
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Morphology"
            fullWidth
            name="details.morphology"
            value={formik.values.details.morphology}
            onChange={formik.handleChange}
            error={
              formik.touched.details?.morphology &&
              Boolean(formik.errors.details?.morphology)
            }
            helperText={
              formik.touched.details?.morphology &&
              formik.errors.details?.morphology
            }
          />
        </Grid>
      </Grid>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
        Sperm Wash Details
      </Typography>

      <Grid container spacing={2} marginBottom={2}>
        <Grid container gap={2} mt={2}>
          <Grid item flex={1} ml={2}>
            <Typography variant="subtitle2">Semen Preparation</Typography>
          </Grid>
          <Grid item flex={1} ml={2}>
            <Typography variant="subtitle2">Vol(ml)</Typography>
          </Grid>
          <Grid item flex={1}>
            <Typography variant="subtitle2">Conc(M/ml)</Typography>
          </Grid>
          <Grid item flex={1}>
            <Typography variant="subtitle2">% Motility</Typography>
          </Grid>
          <Grid item flex={1}>
            <Typography variant="subtitle2">
              (A+B) (Progressive Motility)
            </Typography>
          </Grid>
          <Grid item flex={1}>
            <Typography variant="subtitle2">C(Non Progressive)</Typography>
          </Grid>
          <Grid item flex={1}>
            <Typography variant="subtitle2">D(Immotile)</Typography>
          </Grid>
          <Grid item flex={1}>
            <Typography variant="subtitle2">Wash Type</Typography>
          </Grid>
          <Grid item flex={1}>
            <Typography variant="subtitle2">Actions</Typography>
          </Grid>

          {/* render sperm wash table */}
          {formik.values.details.sperm_wash_items.map(
            (_field: any, index: number) => {
              const isLastItem =
                index === formik.values.details.sperm_wash_items.length - 1;

              return (
                <Grid container gap={1} key={index} mt={2} ml={2}>
                  <Grid item flex={1}>
                    <TextField
                      name={`details.sperm_wash_items[${index}].semenPreparation`}
                      fullWidth
                      label="Preparation"
                      value={
                        formik.values.details.sperm_wash_items[index]
                          .semenPreparation
                      }
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item flex={1}>
                    <TextField
                      name={`details.sperm_wash_items[${index}].spermVol`}
                      fullWidth
                      label="Vol(ml)"
                      value={
                        formik.values.details.sperm_wash_items[index].spermVol
                      }
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item flex={1}>
                    <TextField
                      name={`details.sperm_wash_items[${index}].spermConc`}
                      fullWidth
                      label="Conc(M/ml)"
                      value={
                        formik.values.details.sperm_wash_items[index].spermConc
                      }
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item flex={1}>
                    <TextField
                      name={`details.sperm_wash_items[${index}].motility`}
                      fullWidth
                      label="%Motility"
                      value={
                        formik.values.details.sperm_wash_items[index].motility
                      }
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item flex={1}>
                    <TextField
                      name={`details.sperm_wash_items[${index}].progressiveMotility`}
                      fullWidth
                      label="Prog. Motility"
                      value={
                        formik.values.details.sperm_wash_items[index]
                          .progressiveMotility
                      }
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item flex={1}>
                    <TextField
                      name={`details.sperm_wash_items[${index}].nonProgressiveMotility`}
                      fullWidth
                      label="Non Prog. Motility"
                      value={
                        formik.values.details.sperm_wash_items[index]
                          .nonProgressiveMotility
                      }
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item flex={1}>
                    <TextField
                      name={`details.sperm_wash_items[${index}].immotile`}
                      fullWidth
                      label="Immotile"
                      value={
                        formik.values.details.sperm_wash_items[index].immotile
                      }
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item flex={1}>
                    <TextField
                      name={`details.sperm_wash_items[${index}].washType`}
                      fullWidth
                      label="Wash Type"
                      value={
                        formik.values.details.sperm_wash_items[index].washType
                      }
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item flex={1}>
                    {!isLastItem && (
                      <IconButton onClick={() => handleDeleteField(index)}>
                        <Delete />
                      </IconButton>
                    )}
                    {isLastItem && (
                      <IconButton color="primary" onClick={handleAddFields}>
                        <Add />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              );
            },
          )}
        </Grid>

        <Divider sx={{ marginY: 10 }} />

        <Grid container pl={2}>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Freezing Data
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Duraiton Of Freezing(Days)"
            fullWidth
            type="number"
            name="details.durationOfFreezing"
            value={formik.values.details.durationOfFreezing}
            onChange={formik.handleChange}
            error={
              formik.touched.details?.durationOfFreezing &&
              Boolean(formik.errors.details?.durationOfFreezing)
            }
            helperText={
              formik.touched.details?.durationOfFreezing &&
              formik.errors.details?.durationOfFreezing
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FieldAutocomplete
            options={doctors}
            getOptionLabel={option =>
              `${option.firstName || ''} ${option.lastName || ''}`
            }
            filterOptions={(options, _state) => {
              return options.filter(
                option => option.speciality === DoctorSpeciality.Embryologist,
              );
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formik.values.details.embryologist}
            onChange={newValue =>
              formik.setFieldValue(`details.embryologist`, newValue)
            }
            label="Embryologist"
            error={
              formik.touched.details?.embryologist &&
              Boolean(formik.errors.details?.embryologist)
            }
            helperText={
              formik.touched.details?.embryologist &&
              formik.errors.details?.embryologist
            }
          />
        </Grid>
      </Grid>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
        Freezing Location
      </Typography>
      <Grid container spacing={2} marginBottom={2}>
        {/* Cryo Vial Table */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="No. Of Vials"
            fullWidth
            type="number"
            name="details.noOfVials"
            value={formik.values.details.noOfVials}
            onChange={formik.handleChange}
            error={
              formik.touched.details?.noOfVials &&
              Boolean(formik.errors.details?.noOfVials)
            }
            helperText={
              formik.touched.details?.noOfVials &&
              formik.errors.details?.noOfVials
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Cryo Vial No."
            fullWidth
            name="details.cryoVialNo"
            value={formik.values.details.cryoVialNo}
            onChange={formik.handleChange}
            error={
              formik.touched.details?.cryoVialNo &&
              Boolean(formik.errors.details?.cryoVialNo)
            }
            helperText={
              formik.touched.details?.cryoVialNo &&
              formik.errors.details?.cryoVialNo
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Cannister No."
            fullWidth
            name="details.cannisterNo"
            value={formik.values.details.cannisterNo}
            onChange={formik.handleChange}
            error={
              formik.touched.details?.cannisterNo &&
              Boolean(formik.errors.details?.cannisterNo)
            }
            helperText={
              formik.touched.details?.cannisterNo &&
              formik.errors.details?.cannisterNo
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Tank No."
            fullWidth
            name="details.tankNo"
            value={formik.values.details.tankNo}
            onChange={formik.handleChange}
            error={
              formik.touched.details?.tankNo &&
              Boolean(formik.errors.details?.tankNo)
            }
            helperText={
              formik.touched.details?.tankNo && formik.errors.details?.tankNo
            }
          />
        </Grid>

        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              label="Comments"
              fullWidth
              multiline
              minRows={2}
              name="details.comments"
              value={formik.values.details.comments}
              onChange={formik.handleChange}
              error={
                formik.touched.details?.comments &&
                Boolean(formik.errors.details?.comments)
              }
              helperText={
                formik.touched.details?.comments &&
                formik.errors.details?.comments
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
        Media Details
      </Typography>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Freezing Media"
            fullWidth
            name="details.freezingMedia"
            value={formik.values.details.freezingMedia}
            onChange={formik.handleChange}
            error={
              formik.touched.details?.freezingMedia &&
              Boolean(formik.errors.details?.freezingMedia)
            }
            helperText={
              formik.touched.details?.freezingMedia &&
              formik.errors.details?.freezingMedia
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Batch No."
            fullWidth
            name="details.mediaBatchNo"
            value={formik.values.details.mediaBatchNo}
            onChange={formik.handleChange}
            error={
              formik.touched.details?.mediaBatchNo &&
              Boolean(formik.errors.details?.mediaBatchNo)
            }
            helperText={
              formik.touched.details?.mediaBatchNo &&
              formik.errors.details?.mediaBatchNo
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomDatePicker
            name="details.mediaExpiryDate"
            minDate={new Date()}
            value={formik?.values.details.mediaExpiryDate}
            label="Media Expiry date"
            onChange={date =>
              formik.setFieldValue('details.mediaExpiryDate', date)
            }
            error={
              formik.touched?.details?.mediaExpiryDate &&
              Boolean(formik.errors?.details?.mediaExpiryDate)
            }
            helperText={
              formik.touched.details?.mediaExpiryDate &&
              formik.errors.details?.mediaExpiryDate
            }
          />
        </Grid>
        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              label="Remarks"
              fullWidth
              multiline
              minRows={2}
              name="details.mediaRemarks"
              value={formik.values.details.mediaRemarks}
              onChange={formik.handleChange}
              error={
                formik.touched.details?.mediaRemarks &&
                Boolean(formik.errors.details?.mediaRemarks)
              }
              helperText={
                formik.touched.details?.mediaRemarks &&
                formik.errors.details?.mediaRemarks
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} marginBottom={2} pt={3} pl={2}>
          {' '}
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, pl: 2 }}>
            Upload Report
          </Typography>
          {/* <Grid container spacing={2} marginBottom={2}> */}
          <Grid item xs={12}>
            {patient && (
              <FileUploadButton
                acceptTypes="image/*, application/pdf"
                maxFiles={5}
                maxFileSizeinMB={15}
                onUploadFiles={setFileUploadedUrl}
                bucket={EBuckets.UserReports}
                documentType={EDocumentTypes.CryoPreservation}
                user={patient?._id}
                reportId={openEditDialog.id}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              label="Description"
              multiline
              minRows={2}
              fullWidth
              name="details.description"
              value={formik.values.details.description}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <Grid item lg={12} display={'flex'} justifyContent={'center'}>
          <FormControlLabel
            label="Discard"
            control={
              <Checkbox
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
              />
            }
          />
        </Grid>
      </Grid>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={2}
        mb={2}
      >
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.status === 'Completed'}
                onChange={e =>
                  formik.setFieldValue(
                    'status',
                    e.target.checked ? 'Completed' : 'Scheduled',
                  )
                }
                color="primary"
              />
            }
            label="Status: Completed"
          />
        </Grid>
      </Box>

      {/* Submit and close buttons */}
      <Box display={'flex'} justifyContent={'center'} gap={2} p={2}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoading || _.isEqual(initialValues, formik.values)}
        >
          Update
        </Button>
        <Button onClick={onModalClose} variant="outlined">
          Close
        </Button>
      </Box>
    </form>
  );
};

export default Sperm;
