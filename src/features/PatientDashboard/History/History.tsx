import React, { useState, RefObject, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CustomDatePicker from "../../../components/CustomDatePicker/CustomDatePicker";
import { useToast } from "../../../context/ToastContext";
import { useFormik } from "formik";
import {
  useAddPatientHistoryMutation,
  useEditPatientHistoryMutation,
  useGetPatientHistoryQuery,
} from "../../../services/patientDashboardService/patientHistoryApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { Autocomplete, Checkbox, IconButton } from "@mui/material";
import FileUploadButton from "../../../components/FileUploadAndPreview/FileUploadButton";
import { EBuckets, EDocumentTypes } from "../../../types/global";
import { format } from "date-fns";

import { Edit } from "@mui/icons-material";

const History: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { patient } = useSelector((state: RootState) => state.patients);
  const patientId = patient?.patientId || "";

  const [showOtherComponent, setShowOtherComponent] = useState(true);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>([""]);

  const [filteredPatientHistory, setFilteredPatientHistory] = useState<Record<string, any>>({});

  const handleComponentChangeClick = () => {
    setShowOtherComponent(!showOtherComponent);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const resetStepper = () => {
    setActiveStep(0);
  };

  const inputRefs: Record<string, RefObject<any>> = {};

  const { showPromiseToast } = useToast();

  const { data: patientHistoryData } = useGetPatientHistoryQuery(patientId, {
    skip: !patientId,
  });

  const patientHistory = patientHistoryData?.data;
  // console.log("Patient History", patientHistory);

  //Check if previous patient history exists
  const patientExists = !!patientHistory?.patientId;

  const [addPatientHistory, { isLoading: isAddPatientLoading }] = useAddPatientHistoryMutation();

  const [editPatientHistory, { isLoading: isEditPatientLoading }] = useEditPatientHistoryMutation();

  const loading = isAddPatientLoading || isEditPatientLoading;

  const filterNonEmptyValues = (obj: Record<string, any>): Record<string, any> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const filteredNestedValues = filterNonEmptyValues(value);
        if (Object.keys(filteredNestedValues).length > 0) {
          acc[key] = filteredNestedValues;
        }
      } else if (value && value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
  };

  useEffect(() => {
    if (patientHistory) {
      setFilteredPatientHistory(filterNonEmptyValues(patientHistory));
    }
  }, [patientHistory]);

  // console.log("Filtered Patient History", filteredPatientHistory);

  const handleSubmit = async (values: any) => {
    const payload = {
      patientCode: patient?.patientId,
      medicalHistory: {
        marriedLife: values.marriedLife,
        infertility: values.infertility,
        infertilityDuration: values.infertilityDuration,
        consanguineousMarriage: values.consanguineousMarriage,
        contraception: values.contraception,
        noOfPregnencies: values.noOfPregnencies,
        previousInfertilityTreatments: values.previousInfertilityTreatments,
        medicalHostoryNotes: values.medicalHostoryNotes,
      },
      menstrualAndOvulationHistory: {
        lmpDate: values.lmpDate,
        ageAtMenarche: values.ageAtMenarche,
        mensturalRegularity: values.mensturalRegularity,
        mensturalBleeding: values.mensturalBleeding,
        longestCycleDuration: values.longestCycleDuration,
        shortestCycleDuration: values.shortestCycleDuration,
        periodDuration: values.periodDuration,
        imb: values.imb,
        pcb: values.pcb,
        dyspareunia: values.dyspareunia,
        dischargePV: values.dischargePV,
        passageOfClots: values.passageOfClots,
        galactorrhoeaHistory: values.galactorrhoeaHistory,
        hirsutism: values.hirsutism,
        visualDisturbances: values.visualDisturbances,
        dysmenorrhoea: values.dysmenorrhoea,
        weightGainLoss: values.weightGainLoss,
        urinaryBowelProblems: values.urinaryBowelProblems,
        mesturalNotes: values.mesturalNotes,
      },
      coitalHistory: {
        frequencyCoitus: values.frequencyCoitus,
        fertilityPeriodKnowledge: values.fertilityPeriodKnowledge,
        coitalHistoryNotes: values.coitalHistoryNotes,
      },
      diseaseAdverseEffect: {
        diabetes: values.diabetes,
        thyroid: values.thyroid,
        tuberculosis: values.tuberculosis,
        otherDisease: values.otherDisease,
        diseaseNotes: values.diseaseNotes,
      },
      otherFactorsAdverseEffect: {
        environmentalEffects: values.environmentalEffects,
        smoking: values.smoking,
        alcohol: values.alcohol,
        hivRisk: values.hivRisk,
        previousTreaments: values.previousTreaments,
        allergies: values.allergies,
        surgicalHistory: values.surgicalHistory,
        familyHistory: values.familyHistory,
        otherFactorNotes: values.otherFactorNotes,
      },
      generalPhysicalExamination: {
        height: values.height,
        weight: values.weight,
        bmi: values.bmi,
        bp: values.bp,
        chest: values.chest,
        cvs: values.cvs,
        ipe: values.ipe,
        ipe2: values.ipe2,
        hairDistributionScore: values.hairDistributionScore,
        generalExamination: values.generalExamination,
        breastDevelopment: values.breastDevelopment,
        galactorrhoea: values.galactorrhoea,
        breastLumps: values.breastLumps,
        lymphNodes: values.lymphNodes,
        pelvicExamination: values.pelvicExamination,
        genralExaminationNotes: values.genralExaminationNotes,
      },
      investigations: {
        cbpDate: values.cbpDate,
        cbpResult: values.cbpResult,
        e2Date: values.e2Date,
        e2Result: values.e2Result,
        hepCDate: values.hepCDate,
        hepCResult: values.hepCResult,
        hivDate: values.hivDate,
        hivResult: values.hivResult,
        cmiaDate: values.cmiaDate,
        cmiaResult: values.cmiaResult,
        rbsDate: values.rbsDate,
        rbsResult: values.rbsResult,
        tshDate: values.tshDate,
        tshResult: values.tshResult,
        vdrlDate: values.vdrlDate,
        vdrlResult: values.vdrlResult,
        prolactinDate: values.prolactinDate,
        prolactinResult: values.prolactinResult,
        spermAssessmentDate: values.spermAssessmentDate,
        spermAssessmentResult: values.spermAssessmentResult,
        bloodGroupDate: values.bloodGroupDate,
        bloodGroupResult: values.bloodGroupResult,
        esrDate: values.esrDate,
        esrResult: values.esrResult,
        rubellaDate: values.rubellaDate,
        rubellaResult: values.rubellaResult,
        fshDate: values.fshDate,
        fshResult: values.fshResult,
        lhDate: values.lhDate,
        lhResult: values.lhResult,
        papDate: values.papDate,
        papResult: values.papResult,
        progesteroneDate: values.progesteroneDate,
        progesteroneResult: values.progesteroneResult,
        amhDate: values.amhDate,
        amhResult: values.amhResult,
        kcacDate: values.kcacDate,
        kcacResult: values.kcacResult,
        ca125Date: values.ca125Date,
        ca125Result: values.ca125Result,
        vitaminDDate: values.vitaminDDate,
        vitaminDResult: values.vitaminDResult,
        histopathologyDate: values.histopathologyDate,
        histopathologyResult: values.histopathologyResult,
        tbpcrDate: values.tbpcrDate,
        tbpcrResult: values.tbpcrResult,
        bacterialViginosisDate: values.bacterialViginosis,
        bacterialViginosisResult: values.bacterialViginosisResult,
        lhIvfDate: values.lhIvfDate,
        lhIvfResult: values.lhIvfResult,
      },
      summary: {
        summarySummary: values.summary,
        impression: values.impression,
        treatmentPlan: values.treatmentPlan,
      },
      files: fileUploadedUrl,
    };

    if (patientExists) {
      let promise = editPatientHistory(payload).unwrap();

      showPromiseToast(promise, {
        loading: "Updating...",
        success: (response) => response.message || "Patient History Updated Sucessfully",
        error: (err) => `Error: ${err.response?.data?.message || "Failed To Update "}`,
      });

      try {
        await promise;
        formik.resetForm();
        resetStepper();
      } catch (error: any) {
        console.error("Failed to update history", error);
      }
    } else {
      let promise = addPatientHistory(payload).unwrap();

      showPromiseToast(promise, {
        loading: "Adding...",
        success: (response) => response.message || "Patient History Added Sucessfully",
        error: (err) => `Error: ${err.response?.data?.message || "Failed To Add "}`,
      });

      try {
        await promise;
        formik.resetForm();
        resetStepper();
      } catch (error: any) {
        console.error("Failed to add history", error);
      }
    }
  };

  const initialValues = {
    patientCode: "",
    //Medical History
    marriedLife: patientHistory?.medicalHistory.marriedLife || "",

    infertility: patientHistory?.medicalHistory.infertility || "",
    infertilityDuration: patientHistory?.medicalHistory.infertilityDuration || "",
    consanguineousMarriage: patientHistory?.medicalHistory.consanguineousMarriage || "",
    contraception: patientHistory?.medicalHistory.contraception || "",
    noOfPregnencies: patientHistory?.medicalHistory.noOfPregnencies || "",
    previousInfertilityTreatments:
      patientHistory?.medicalHistory.previousInfertilityTreatments || "",
    medicalHostoryNotes: patientHistory?.medicalHistory.medicalHostoryNotes || "",
    //MenstrualAndOvulationHistory
    lmpDate: patientHistory?.menstrualAndOvulationHistory.lmpDate || null,
    ageAtMenarche: patientHistory?.menstrualAndOvulationHistory.ageAtMenarche || "",
    mensturalRegularity: patientHistory?.menstrualAndOvulationHistory.mensturalRegularity || "",
    mensturalBleeding: patientHistory?.menstrualAndOvulationHistory.mensturalBleeding || "",
    longestCycleDuration: patientHistory?.menstrualAndOvulationHistory.longestCycleDuration || "",
    shortestCycleDuration: patientHistory?.menstrualAndOvulationHistory.shortestCycleDuration || "",
    periodDuration: patientHistory?.menstrualAndOvulationHistory.periodDuration || "",
    imb: patientHistory?.menstrualAndOvulationHistory.imb || "",
    pcb: patientHistory?.menstrualAndOvulationHistory.pcb || "",
    dyspareunia: patientHistory?.menstrualAndOvulationHistory.dyspareunia || "",
    dischargePV: patientHistory?.menstrualAndOvulationHistory.dischargePV || "",
    passageOfClots: patientHistory?.menstrualAndOvulationHistory.passageOfClots || "",
    galactorrhoeaHistory: patientHistory?.menstrualAndOvulationHistory.galactorrhoeaHistory || "",
    hirsutisnm: patientHistory?.menstrualAndOvulationHistory.hirsutisnm || "",
    visualDisturbances: patientHistory?.menstrualAndOvulationHistory.visualDisturbances || "",
    dysmenorrhoea: patientHistory?.menstrualAndOvulationHistory.dysmenorrhoea || "",
    weightGainLoss: patientHistory?.menstrualAndOvulationHistory.weightGainLoss || "",
    urinaryBowelProblems: patientHistory?.menstrualAndOvulationHistory.urinaryBowelProblems || "",
    mesturalNotes: patientHistory?.menstrualAndOvulationHistory.mesturalNotes || "",
    // CoitalHistory
    frequencyCoitus: patientHistory?.coitalHistory.frequencyCoitus || "",
    fertilityPeriodKnowledge: patientHistory?.coitalHistory.fertilityPeriodKnowledge || "",
    coitalHistoryNotes: patientHistory?.coitalHistory.coitalHistoryNotes || "",
    //DiseaseAdverseEffect
    diabetes: patientHistory?.diseaseAdverseEffect.diabetes || "",
    thyroid: patientHistory?.diseaseAdverseEffect.thyroid || "",
    tuberculosis: patientHistory?.diseaseAdverseEffect.tuberculosis || "",
    otherDisease: patientHistory?.diseaseAdverseEffect.otherDisease || "",
    diseaseNotes: patientHistory?.diseaseAdverseEffect.diseaseNotes || "",
    //OtherFactorsAdverseEffect
    environmentalEffects: patientHistory?.otherFactorsAdverseEffect.environmentalEffects || "",
    smoking: patientHistory?.otherFactorsAdverseEffect.smoking || "",
    alcohol: patientHistory?.otherFactorsAdverseEffect.alcohol || "",
    hivRisk: patientHistory?.otherFactorsAdverseEffect.hivRisk || "",
    previousTreaments: patientHistory?.otherFactorsAdverseEffect.previousTreaments || "",
    allergies: patientHistory?.otherFactorsAdverseEffect.allergies || "",
    surgicalHistory: patientHistory?.otherFactorsAdverseEffect.surgicalHistory || "",
    familyHistory: patientHistory?.otherFactorsAdverseEffect.familyHistory || "",
    otherFactorNotes: patientHistory?.otherFactorsAdverseEffect.otherFactorNotes || "",
    //GeneralPhysicalExamination
    height: patientHistory?.generalPhysicalExamination.height || "",
    weight: patientHistory?.generalPhysicalExamination.weight || "",
    bmi: patientHistory?.generalPhysicalExamination.bmi || "",
    bp: patientHistory?.generalPhysicalExamination.bp || "",
    chest: patientHistory?.generalPhysicalExamination.chest || "",
    cvs: patientHistory?.generalPhysicalExamination.cvs || "",
    ipe: patientHistory?.generalPhysicalExamination.ipe || "",
    ipe2: patientHistory?.generalPhysicalExamination.ipe2 || "",
    hairDistributionScore: patientHistory?.generalPhysicalExamination.hairDistributionScore || "",
    generalExamination: patientHistory?.generalPhysicalExamination.generalExamination || "",
    breastDevelopment: patientHistory?.generalPhysicalExamination.breastDevelopment || "",
    galactorrhoea: patientHistory?.generalPhysicalExamination.galactorrhoea || "",
    breastLumps: patientHistory?.generalPhysicalExamination.breastLumps || "",
    lymphNodes: patientHistory?.generalPhysicalExamination.lymphNodes || "",
    pelvicExamination: patientHistory?.generalPhysicalExamination.pelvicExamination || "",
    genralExaminationNotes: patientHistory?.generalPhysicalExamination.genralExaminationNotes || "",
    //Investigations
    cbpDate: patientHistory?.investigations.cbpDate || null,
    cbpResult: patientHistory?.investigations.cbpResult || "",
    e2Date: patientHistory?.investigations.e2Date || null,
    e2Result: patientHistory?.investigations.e2Result || "",
    hepCDate: patientHistory?.investigations.hepCDate || null,
    hepCResult: patientHistory?.investigations.hepCResult || "",
    hivDate: patientHistory?.investigations.hivDate || null,
    hivResult: patientHistory?.investigations.hivResult || "",
    cmiaDate: patientHistory?.investigations.cmiaDate || null,
    cmiaResult: patientHistory?.investigations.cmiaResult || "",
    rbsDate: patientHistory?.investigations.rbsDate || null,
    rbsResult: patientHistory?.investigations.rbsResult || "",
    tshDate: patientHistory?.investigations.tshDate || null,
    tshResult: patientHistory?.investigations.tshResult || "",
    vdrlDate: patientHistory?.investigations.vdrlDate || null,
    vdrlResult: patientHistory?.investigations.vdrlResult || "",
    prolactinDate: patientHistory?.investigations.prolactinDate || null,
    prolactinResult: patientHistory?.investigations.prolactinResult || "",
    spermAssessmentDate: patientHistory?.investigations.spermAssessmentDate || null,
    spermAssessmentResult: patientHistory?.investigations.spermAssessmentResult || "",
    bloodGroupDate: patientHistory?.investigations.bloodGroupDate || null,
    bloodGroupResult: patientHistory?.investigations.bloodGroupResult || "",
    esrDate: patientHistory?.investigations.esrDate || null,
    esrResult: patientHistory?.investigations.esrResult || "",
    rubellaDate: patientHistory?.investigations.rubellaDate || null,
    rubellaResult: patientHistory?.investigations.rubellaResult || "",
    fshDate: patientHistory?.investigations.fshDate || null,
    fshResult: patientHistory?.investigations.fshResult || "",
    lhDate: patientHistory?.investigations.lhDate || null,
    lhResult: patientHistory?.investigations.lhResult || "",
    papDate: patientHistory?.investigations.papDate || null,
    papResult: patientHistory?.investigations.papResult || "",
    progesteroneDate: patientHistory?.investigations.progesteroneDate || null,
    progesteroneResult: patientHistory?.investigations.progesteroneResult || "",
    amhDate: patientHistory?.investigations.amhDate || null,
    amhResult: patientHistory?.investigations.amhResult || "",
    kcacDate: patientHistory?.investigations.kcacDate || null,
    kcacResult: patientHistory?.investigations.kcacResult || "",
    ca125Date: patientHistory?.investigations.ca125Date || null,
    ca125Result: patientHistory?.investigations.ca125Result || "",
    vitaminDDate: patientHistory?.investigations.vitaminDDate || null,
    vitaminDResult: patientHistory?.investigations.vitaminDResult || "",
    histopathologyDate: patientHistory?.investigations.histopathologyDate || null,
    histopathologyResult: patientHistory?.investigations.histopathologyResult || "",
    tbpcrDate: patientHistory?.investigations.tbpcrDate || null,
    tbpcrResult: patientHistory?.investigations.tbpcrResult || "",
    bacterialViginosisDate: patientHistory?.investigations.bacterialViginosisDate || null,
    bacterialViginosisResult: patientHistory?.investigations.bacterialViginosisResult || "",
    lhIvfDate: patientHistory?.investigations.lhIvfDate || null,
    lhIvfResult: patientHistory?.investigations.lhIvfResult || "",
    //Summary
    impression: patientHistory?.summary.impression || "",
    treatmentPlan: patientHistory?.summary.treatmentPlan || "",
    summarySummary: patientHistory?.summary.summarySummary || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const keyMapping: Record<string, string> = {
    _id: "ID",
    patientId: "Patient ID",
    clinicId: "Clinic ID",
    branchId: "Branch ID",
    medicalHistory: "Medical History",
    marriedLife: "Married Life",
    infertility: "Infertility",
    infertilityDuration: "Infertility Duration",
    menstrualAndOvulationHistory: "Menstrual and Ovulation History",
    diseaseAdverseEffect: "Disease Adverse Effect",
    generalPhysicalExamination: "General Physical Examination",
    investigations: "Investigations",
    files: "Files",
    patientCode: "Patient Code",
    consanguineousMarriage: "Consanguineous Marriage",
    contraception: "Contraception",
    noOfPregnencies: "Number of Pregnancies",
    previousInfertilityTreatments: "Previous Infertility Treatments",
    medicalHostoryNotes: "Medical History Notes",
    lmpDate: "LMP Date",
    ageAtMenarche: "Age at Menarche",
    mensturalRegularity: "Menstrual Regularity",
    mensturalBleeding: "Menstrual Bleeding",
    longestCycleDuration: "Longest Cycle Duration",
    shortestCycleDuration: "Shortest Cycle Duration",
    periodDuration: "Period Duration",
    imb: "IMB",
    pcb: "PCB",
    dyspareunia: "Dyspareunia",
    dischargePV: "Discharge PV",
    passageOfClots: "Passage of Clots",
    galactorrhoeaHistory: "Galactorrhoea History",
    hirsutism: "Hirsutism",
    visualDisturbances: "Visual Disturbances",
    dysmenorrhoea: "Dysmenorrhoea",
    weightGainLoss: "Weight Gain/Loss",
    urinaryBowelProblems: "Urinary/Bowel Problems",
    mesturalNotes: "Mestural Notes",
    frequencyCoitus: "Frequency of Coitus",
    fertilityPeriodKnowledge: "Fertility Period Knowledge",
    coitalHistoryNotes: "Coital History Notes",
    diabetes: "Diabetes",
    thyroid: "Thyroid",
    tuberculosis: "Tuberculosis",
    otherDisease: "Other Disease",
    diseaseNotes: "Disease Notes",
    environmentalEffects: "Environmental Effects",
    smoking: "Smoking",
    alcohol: "Alcohol",
    hivRisk: "HIV Risk",
    previousTreaments: "Previous Treatments",
    allergies: "Allergies",
    surgicalHistory: "Surgical History",
    familyHistory: "Family History",
    otherFactorNotes: "Other Factor Notes",
    height: "Height",
    weight: "Weight",
    bmi: "BMI",
    bp: "Blood Pressure",
    chest: "Chest",
    cvs: "Cardiovascular System",
    ipe: "IPE",
    ipe2: "IPE2",
    hairDistributionScore: "Hair Distribution Score",
    generalExamination: "General Examination",
    breastDevelopment: "Breast Development",
    galactorrhoea: "Galactorrhoea",
    breastLumps: "Breast Lumps",
    lymphNodes: "Lymph Nodes",
    pelvicExamination: "Pelvic Examination",
    genralExaminationNotes: "General Examination Notes",
    cbpDate: "CBP Date",
    cbpResult: "CBP Result",
    e2Date: "E2 Date",
    e2Result: "E2 Result",
    hepCDate: "Hepatitis C Date",
    hepCResult: "Hepatitis C Result",
    hivDate: "HIV Date",
    hivResult: "HIV Result",
    cmiaDate: "CMIA Date",
    cmiaResult: "CMIA Result",
    rbsDate: "RBS Date",
    rbsResult: "RBS Result",
    tshDate: "TSH Date",
    tshResult: "TSH Result",
    vdrlDate: "VDRL Date",
    vdrlResult: "VDRL Result",
    prolactinDate: "Prolactin Date",
    prolactinResult: "Prolactin Result",
    spermAssessmentDate: "Sperm Assessment Date",
    spermAssessmentResult: "Sperm Assessment Result",
    bloodGroupDate: "Blood Group Date",
    bloodGroupResult: "Blood Group Result",
    esrDate: "ESR Date",
    esrResult: "ESR Result",
    rubellaDate: "Rubella Date",
    rubellaResult: "Rubella Result",
    fshDate: "FSH Date",
    fshResult: "FSH Result",
    lhDate: "LH Date",
    lhResult: "LH Result",
    papDate: "PAP Date",
    papResult: "PAP Result",
    progesteroneDate: "Progesterone Date",
    progesteroneResult: "Progesterone Result",
    amhDate: "AMH Date",
    amhResult: "AMH Result",
    kcacDate: "KCAC Date",
    kcacResult: "KCAC Result",
    ca125Date: "CA125 Date",
    ca125Result: "CA125 Result",
    vitaminDDate: "Vitamin D Date",
    vitaminDResult: "Vitamin D Result",
    histopathologyDate: "Histopathology Date",
    histopathologyResult: "Histopathology Result",
    tbpcrDate: "TBPCR Date",
    tbpcrResult: "TBPCR Result",
    bacterialViginosisDate: "Bacterial Vaginosis Date",
    bacterialViginosisResult: "Bacterial Vaginosis Result",
    lhIvfDate: "LH IVF Date",
    lhIvfResult: "LH IVF Result",
  };

  const getReadableKey = (key: string) => {
    return keyMapping[key] || key;
  };

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1") // Insert space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
      .trim(); // Remove leading or trailing spaces
  };

  const formatDate = (date: any) => {
    try {
      return format(new Date(date), "dd/MM/yyyy");
    } catch (error) {
      console.error("Invalid date format:", date);
      return date; // Return the original value if formatting fails
    }
  };

  const renderNestedObject = (obj: any) => {
    return Object.entries(obj)
      .filter(
        ([key]) => !["__v", "files", "createdAt", "updatedAt", "_id", "patientId"].includes(key)
      )
      .map(([key, value], index) => {
        const fullKey = getReadableKey(key);
        if (typeof value === "object" && !Array.isArray(value)) {
          return (
            <Grid container key={index}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom style={{ marginTop: "25px" }}>
                  {fullKey}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {renderNestedColumns(value)}
                </Grid>
              </Grid>
            </Grid>
          );
        } else {
          const formattedValue = key.toLowerCase().includes("date") ? formatDate(value) : value;
          return (
            <Typography key={index} variant="body1">
              {`${fullKey}: ${formattedValue}`}
            </Typography>
          );
        }
      });
  };

  const renderNestedColumns = (obj: any) => {
    return Object.entries(obj).map(([key, value], index) => {
      const fullKey = getReadableKey(key);
      // const fullKey = formatKey(getReadableKey(key));

      const formattedValue = key.toLowerCase().includes("date") ? formatDate(value) : value;
      return (
        <Grid key={index} item xs={12} sm={6} md={4}>
          <Typography variant="body1">{`${fullKey}: ${formattedValue}`}</Typography>
        </Grid>
      );
    });
  };
  //Handling selctive data fetching and display

  const [selectedSubheadings, setSelectedSubheadings] = useState<string[]>([]);

  const handleSubheadingToggle = (selectedOptions: string[]) => {
    setSelectedSubheadings(selectedOptions);
  };

  const renderSelectedData = () => {
    if (selectedSubheadings.length === 0) {
      // If no subheadings are selected, display all data
      return Object.keys(filteredPatientHistory).map((subheading, index) => (
        <div key={index} style={{ paddingBottom: "25px" }}>
          {renderNestedObject({ [subheading]: filteredPatientHistory[subheading] })}
        </div>
      ));
    }

    // Display only selected subheadings
    return selectedSubheadings.map((subheading, index) => (
      <div key={index} style={{ paddingBottom: "25px" }}>
        {renderNestedObject({ [subheading]: filteredPatientHistory[subheading] })}
      </div>
    ));
  };

  return (
    <Box
      p={2}
      display={"flex"}
      flexDirection={"column"}
      flex={1}
      component={"form"}
      onSubmit={formik.handleSubmit}
    >
      <Box mt={2} boxShadow={2} p={2} borderRadius={2} height={"500px"} overflow={"auto"}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6} lg={2}>
            <Typography variant="h4">Synopsis</Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton size="small" key="edit" onClick={handleComponentChangeClick}>
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
          </Grid>
        </Grid>

        <Grid container style={{ marginTop: "40px" }}>
          <Grid item xs={12}>
            {showOtherComponent ? (
              renderNestedObject(filteredPatientHistory)
            ) : (
              <>
                <Autocomplete
                  id="checkboxes-tags-demo"
                  options={Object.keys(filteredPatientHistory).filter(
                    (key) =>
                      ![
                        "_id",
                        "patientId",
                        "clinicId",
                        "branchId",
                        "patientCode",
                        "files",
                        "createdAt",
                        "updatedAt",
                        "__v",
                      ].includes(key)
                  )}
                  multiple
                  disableCloseOnSelect
                  // getOptionLabel={(option) => option}
                  getOptionLabel={(option) => formatKey(option)}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {/* {option} */}
                      {formatKey(option)}
                    </li>
                  )}
                  onChange={(_event, selectedOptions) => handleSubheadingToggle(selectedOptions)}
                  style={{ width: 500 }}
                  renderInput={(params) => <TextField {...params} label="History" placeholder="" />}
                />
                {renderSelectedData()}
              </>
            )}
          </Grid>
        </Grid>
      </Box>

      <Box padding={2} mt={2}>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step key={0}>
            <StepLabel>Medical History</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Married Life"
                    name="marriedLife"
                    value={formik.values.marriedLife}
                    onChange={formik.handleChange}
                    error={formik.touched.marriedLife && Boolean(formik.errors.marriedLife)}
                    helperText={formik.touched.marriedLife && formik.errors.marriedLife}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Infertility"
                    name="infertility"
                    value={formik.values.infertility}
                    onChange={formik.handleChange}
                    error={formik.touched.infertility && Boolean(formik.errors.infertility)}
                    helperText={formik.touched.infertility && formik.errors.infertility}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Duration of Infertility"
                    name="infertilityDuration"
                    value={formik.values.infertilityDuration}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.infertilityDuration &&
                      Boolean(formik.errors.infertilityDuration)
                    }
                    helperText={
                      formik.touched.infertilityDuration && formik.errors.infertilityDuration
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Consanguineous Marriage"
                    name="consanguineousMarriage"
                    value={formik.values.consanguineousMarriage}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.consanguineousMarriage &&
                      Boolean(formik.errors.consanguineousMarriage)
                    }
                    helperText={
                      formik.touched.consanguineousMarriage && formik.errors.consanguineousMarriage
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Contraception"
                    name="contraception"
                    value={formik.values.contraception}
                    onChange={formik.handleChange}
                    error={formik.touched.contraception && Boolean(formik.errors.contraception)}
                    helperText={formik.touched.contraception && formik.errors.contraception}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="No. Of Pregnancies"
                    name="noOfPregnencies"
                    value={formik.values.noOfPregnencies}
                    onChange={formik.handleChange}
                    error={formik.touched.noOfPregnencies && Boolean(formik.errors.noOfPregnencies)}
                    helperText={formik.touched.noOfPregnencies && formik.errors.noOfPregnencies}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Previous Infertilty Treatments"
                    name="previousInfertilityTreatments"
                    value={formik.values.previousInfertilityTreatments}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.previousInfertilityTreatments &&
                      Boolean(formik.errors.previousInfertilityTreatments)
                    }
                    helperText={
                      formik.touched.previousInfertilityTreatments &&
                      formik.errors.previousInfertilityTreatments
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Notes"
                    multiline
                    name="medicalHostoryNotes"
                    value={formik.values.medicalHostoryNotes}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.medicalHostoryNotes &&
                      Boolean(formik.errors.medicalHostoryNotes)
                    }
                    helperText={
                      formik.touched.medicalHostoryNotes && formik.errors.medicalHostoryNotes
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button disabled={true} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={1}>
            <StepLabel>Menstrual and Ovulation History</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={2}>
                  <CustomDatePicker
                    ref={inputRefs.lmpDate}
                    label="Date"
                    name="lmpDate"
                    value={formik.values.lmpDate}
                    onChange={async (value) => await formik.setFieldValue("lmpDate", value)}
                    error={formik.touched.lmpDate && Boolean(formik.errors.lmpDate)}
                    helperText={formik.touched.lmpDate && formik.errors.lmpDate}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Age at Menarche"
                    name="ageAtMenarche"
                    value={formik.values.ageAtMenarche}
                    onChange={formik.handleChange}
                    error={formik.touched.ageAtMenarche && Boolean(formik.errors.ageAtMenarche)}
                    helperText={formik.touched.ageAtMenarche && formik.errors.ageAtMenarche}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Menstrual Regularity"
                    name="mensturalRegularity"
                    value={formik.values.mensturalRegularity}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.mensturalRegularity &&
                      Boolean(formik.errors.mensturalRegularity)
                    }
                    helperText={
                      formik.touched.mensturalRegularity && formik.errors.mensturalRegularity
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Menstrual Bleeding"
                    name="mensturalBleeding "
                    value={formik.values.mensturalBleeding}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.mensturalBleeding && Boolean(formik.errors.mensturalBleeding)
                    }
                    helperText={formik.touched.mensturalBleeding && formik.errors.mensturalBleeding}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Longest Cycle Duration"
                    name="longestCycleDuration"
                    value={formik.values.longestCycleDuration}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.longestCycleDuration &&
                      Boolean(formik.errors.longestCycleDuration)
                    }
                    helperText={
                      formik.touched.longestCycleDuration && formik.errors.longestCycleDuration
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Shortest Cycle Duration"
                    name="shortestCycleDuration"
                    value={formik.values.shortestCycleDuration}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.shortestCycleDuration &&
                      Boolean(formik.errors.shortestCycleDuration)
                    }
                    helperText={
                      formik.touched.shortestCycleDuration && formik.errors.shortestCycleDuration
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Period Duration"
                    name="periodDuration"
                    value={formik.values.periodDuration}
                    onChange={formik.handleChange}
                    error={formik.touched.periodDuration && Boolean(formik.errors.periodDuration)}
                    helperText={formik.touched.periodDuration && formik.errors.periodDuration}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="IMB"
                    name="imb"
                    value={formik.values.imb}
                    onChange={formik.handleChange}
                    error={formik.touched.imb && Boolean(formik.errors.imb)}
                    helperText={formik.touched.imb && formik.errors.imb}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="PCB"
                    name="pcb"
                    value={formik.values.pcb}
                    onChange={formik.handleChange}
                    error={formik.touched.pcb && Boolean(formik.errors.pcb)}
                    helperText={formik.touched.pcb && formik.errors.pcb}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Dyspareunia"
                    name="dyspareunia"
                    value={formik.values.dyspareunia}
                    onChange={formik.handleChange}
                    error={formik.touched.dyspareunia && Boolean(formik.errors.dyspareunia)}
                    helperText={formik.touched.dyspareunia && formik.errors.dyspareunia}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Discharge PV"
                    name="dischargePV"
                    value={formik.values.dischargePV}
                    onChange={formik.handleChange}
                    error={formik.touched.dischargePV && Boolean(formik.errors.dischargePV)}
                    helperText={formik.touched.dischargePV && formik.errors.dischargePV}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Passage of Clots"
                    name="passageOfClots"
                    value={formik.values.passageOfClots}
                    onChange={formik.handleChange}
                    error={formik.touched.passageOfClots && Boolean(formik.errors.passageOfClots)}
                    helperText={formik.touched.passageOfClots && formik.errors.passageOfClots}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Galactorrhoea"
                    name="galactorrhoeaHistory"
                    value={formik.values.galactorrhoeaHistory}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.galactorrhoeaHistory &&
                      Boolean(formik.errors.galactorrhoeaHistory)
                    }
                    helperText={
                      formik.touched.galactorrhoeaHistory && formik.errors.galactorrhoeaHistory
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Hirsutism"
                    name="hirsutism"
                    value={formik.values.hirsutisnm}
                    onChange={formik.handleChange}
                    error={formik.touched.hirsutisnm && Boolean(formik.errors.hirsutisnm)}
                    helperText={formik.touched.hirsutisnm && formik.errors.hirsutisnm}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Visual Disturbances"
                    name="visualDisturbances"
                    value={formik.values.visualDisturbances}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.visualDisturbances && Boolean(formik.errors.visualDisturbances)
                    }
                    helperText={
                      formik.touched.visualDisturbances && formik.errors.visualDisturbances
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Dysmenorrhoea"
                    name="dysmenorrhoea"
                    value={formik.values.dysmenorrhoea}
                    onChange={formik.handleChange}
                    error={formik.touched.dysmenorrhoea && Boolean(formik.errors.dysmenorrhoea)}
                    helperText={formik.touched.dysmenorrhoea && formik.errors.dysmenorrhoea}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Weight Gain Loss"
                    name="weightGainLoss"
                    value={formik.values.weightGainLoss}
                    onChange={formik.handleChange}
                    error={formik.touched.weightGainLoss && Boolean(formik.errors.weightGainLoss)}
                    helperText={formik.touched.weightGainLoss && formik.errors.weightGainLoss}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Urinary / Bowel Problems"
                    name="urinaryBowelProblems"
                    value={formik.values.urinaryBowelProblems}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.urinaryBowelProblems &&
                      Boolean(formik.errors.urinaryBowelProblems)
                    }
                    helperText={
                      formik.touched.urinaryBowelProblems && formik.errors.urinaryBowelProblems
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Notes"
                    multiline
                    name="mesturalNotes"
                    value={formik.values.mesturalNotes}
                    onChange={formik.handleChange}
                    error={formik.touched.mesturalNotes && Boolean(formik.errors.mesturalNotes)}
                    helperText={formik.touched.mesturalNotes && formik.errors.mesturalNotes}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={2}>
            <StepLabel>Coital History</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Frequency Coitus"
                    name="frequencyCoitus"
                    value={formik.values.frequencyCoitus}
                    onChange={formik.handleChange}
                    error={formik.touched.frequencyCoitus && Boolean(formik.errors.frequencyCoitus)}
                    helperText={formik.touched.frequencyCoitus && formik.errors.frequencyCoitus}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Fertile Period Knowledge"
                    name="fertilityPeriodKnowledge"
                    value={formik.values.fertilityPeriodKnowledge}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.fertilityPeriodKnowledge &&
                      Boolean(formik.errors.fertilityPeriodKnowledge)
                    }
                    helperText={
                      formik.touched.fertilityPeriodKnowledge &&
                      formik.errors.fertilityPeriodKnowledge
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Notes"
                    multiline
                    name="coitalHistoryNotes"
                    value={formik.values.coitalHistoryNotes}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.coitalHistoryNotes && Boolean(formik.errors.coitalHistoryNotes)
                    }
                    helperText={
                      formik.touched.coitalHistoryNotes && formik.errors.coitalHistoryNotes
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={3}>
            <StepLabel>History of disease with a possible adverse effect on Ferility</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Diabetes"
                    name="diabetes"
                    value={formik.values.diabetes}
                    onChange={formik.handleChange}
                    error={formik.touched.diabetes && Boolean(formik.errors.diabetes)}
                    helperText={formik.touched.diabetes && formik.errors.diabetes}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Thyroid Disease"
                    name="thyroid"
                    value={formik.values.thyroid}
                    onChange={formik.handleChange}
                    error={formik.touched.thyroid && Boolean(formik.errors.thyroid)}
                    helperText={formik.touched.thyroid && formik.errors.thyroid}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Tuberculosis"
                    name="tuberculosis"
                    value={formik.values.tuberculosis}
                    onChange={formik.handleChange}
                    error={formik.touched.tuberculosis && Boolean(formik.errors.tuberculosis)}
                    helperText={formik.touched.tuberculosis && formik.errors.tuberculosis}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Other Diseases"
                    name="otherDisease"
                    value={formik.values.otherDisease}
                    onChange={formik.handleChange}
                    error={formik.touched.otherDisease && Boolean(formik.errors.otherDisease)}
                    helperText={formik.touched.otherDisease && formik.errors.otherDisease}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Notes"
                    multiline
                    name="diseaseNotes"
                    value={formik.values.diseaseNotes}
                    onChange={formik.handleChange}
                    error={formik.touched.diseaseNotes && Boolean(formik.errors.diseaseNotes)}
                    helperText={formik.touched.diseaseNotes && formik.errors.diseaseNotes}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={4}>
            <StepLabel>Other factors with a possible adverse effect on Fertility</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Environmental Effects"
                    name="environmentalEffects"
                    value={formik.values.environmentalEffects}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.environmentalEffects &&
                      Boolean(formik.errors.environmentalEffects)
                    }
                    helperText={
                      formik.touched.environmentalEffects && formik.errors.environmentalEffects
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Smoking"
                    name="smoking"
                    value={formik.values.smoking}
                    onChange={formik.handleChange}
                    error={formik.touched.smoking && Boolean(formik.errors.smoking)}
                    helperText={formik.touched.smoking && formik.errors.smoking}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Alcohol"
                    name="alcohol"
                    value={formik.values.alcohol}
                    onChange={formik.handleChange}
                    error={formik.touched.alcohol && Boolean(formik.errors.alcohol)}
                    helperText={formik.touched.alcohol && formik.errors.alcohol}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="HIV Risk Factors"
                    name="hivRisk"
                    value={formik.values.hivRisk}
                    onChange={formik.handleChange}
                    error={formik.touched.hivRisk && Boolean(formik.errors.hivRisk)}
                    helperText={formik.touched.hivRisk && formik.errors.hivRisk}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Previous Medical Treatments"
                    multiline
                    name="previousTreaments"
                    value={formik.values.previousTreaments}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.previousTreaments && Boolean(formik.errors.previousTreaments)
                    }
                    helperText={formik.touched.previousTreaments && formik.errors.previousTreaments}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Allergies"
                    multiline
                    name="allergies"
                    value={formik.values.allergies}
                    onChange={formik.handleChange}
                    error={formik.touched.allergies && Boolean(formik.errors.allergies)}
                    helperText={formik.touched.allergies && formik.errors.allergies}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Surgical History"
                    multiline
                    name="surgicalHistory"
                    value={formik.values.surgicalHistory}
                    onChange={formik.handleChange}
                    error={formik.touched.surgicalHistory && Boolean(formik.errors.surgicalHistory)}
                    helperText={formik.touched.surgicalHistory && formik.errors.surgicalHistory}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Family History"
                    multiline
                    name="familyHistory"
                    value={formik.values.familyHistory}
                    onChange={formik.handleChange}
                    error={formik.touched.familyHistory && Boolean(formik.errors.familyHistory)}
                    helperText={formik.touched.familyHistory && formik.errors.familyHistory}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Notes"
                    multiline
                    name="otherFactorNotes"
                    value={formik.values.otherFactorNotes}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.otherFactorNotes && Boolean(formik.errors.otherFactorNotes)
                    }
                    helperText={formik.touched.otherFactorNotes && formik.errors.otherFactorNotes}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={5}>
            <StepLabel>General Physical Examination</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Height"
                    name="height"
                    value={formik.values.height}
                    onChange={formik.handleChange}
                    error={formik.touched.height && Boolean(formik.errors.height)}
                    helperText={formik.touched.height && formik.errors.height}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Weight"
                    name="weight"
                    value={formik.values.weight}
                    onChange={formik.handleChange}
                    error={formik.touched.weight && Boolean(formik.errors.weight)}
                    helperText={formik.touched.weight && formik.errors.weight}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    disabled
                    label="BMI"
                    name="bmi"
                    value={formik.values.bmi}
                    onChange={formik.handleChange}
                    error={formik.touched.bmi && Boolean(formik.errors.bmi)}
                    helperText={formik.touched.bmi && formik.errors.bmi}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="BP"
                    name="bp"
                    value={formik.values.bp}
                    onChange={formik.handleChange}
                    error={formik.touched.bp && Boolean(formik.errors.bp)}
                    helperText={formik.touched.bp && formik.errors.bp}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Chest"
                    name="chest"
                    value={formik.values.chest}
                    onChange={formik.handleChange}
                    error={formik.touched.chest && Boolean(formik.errors.chest)}
                    helperText={formik.touched.chest && formik.errors.chest}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="CVS"
                    name="cvs"
                    value={formik.values.cvs}
                    onChange={formik.handleChange}
                    error={formik.touched.cvs && Boolean(formik.errors.cvs)}
                    helperText={formik.touched.cvs && formik.errors.cvs}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="I/P/E"
                    multiline
                    name="ipe"
                    value={formik.values.ipe}
                    onChange={formik.handleChange}
                    error={formik.touched.ipe && Boolean(formik.errors.ipe)}
                    helperText={formik.touched.ipe && formik.errors.ipe}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="I/P/E 2"
                    multiline
                    name="ipe2"
                    value={formik.values.ipe2}
                    onChange={formik.handleChange}
                    error={formik.touched.ipe2 && Boolean(formik.errors.ipe2)}
                    helperText={formik.touched.ipe2 && formik.errors.ipe2}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <TextField
                    label="Hair Distribution Score"
                    name="hairDistributionScore"
                    value={formik.values.hairDistributionScore}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.hairDistributionScore &&
                      Boolean(formik.errors.hairDistributionScore)
                    }
                    helperText={
                      formik.touched.hairDistributionScore && formik.errors.hairDistributionScore
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="General Examination"
                    multiline
                    name="generalExamination"
                    value={formik.values.generalExamination}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.generalExamination && Boolean(formik.errors.generalExamination)
                    }
                    helperText={
                      formik.touched.generalExamination && formik.errors.generalExamination
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Breast Development"
                    multiline
                    name="breastDevelopment"
                    value={formik.values.breastDevelopment}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.breastDevelopment && Boolean(formik.errors.breastDevelopment)
                    }
                    helperText={formik.touched.breastDevelopment && formik.errors.breastDevelopment}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Galactorrhoea"
                    multiline
                    name="galactorrhoea"
                    value={formik.values.galactorrhoea}
                    onChange={formik.handleChange}
                    error={formik.touched.galactorrhoea && Boolean(formik.errors.galactorrhoea)}
                    helperText={formik.touched.galactorrhoea && formik.errors.galactorrhoea}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Breast Lumps"
                    multiline
                    name="breastLumps"
                    value={formik.values.breastLumps}
                    onChange={formik.handleChange}
                    error={formik.touched.breastLumps && Boolean(formik.errors.breastLumps)}
                    helperText={formik.touched.breastLumps && formik.errors.breastLumps}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Lymph Nodes"
                    multiline
                    name="lymphNodes"
                    value={formik.values.lymphNodes}
                    onChange={formik.handleChange}
                    error={formik.touched.lymphNodes && Boolean(formik.errors.lymphNodes)}
                    helperText={formik.touched.lymphNodes && formik.errors.lymphNodes}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Pelvic Examination"
                    multiline
                    name="pelvicExamination"
                    value={formik.values.pelvicExamination}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.pelvicExamination && Boolean(formik.errors.pelvicExamination)
                    }
                    helperText={formik.touched.pelvicExamination && formik.errors.pelvicExamination}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Notes"
                    multiline
                    name="genralExaminationNotes"
                    value={formik.values.genralExaminationNotes}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.genralExaminationNotes &&
                      Boolean(formik.errors.genralExaminationNotes)
                    }
                    helperText={
                      formik.touched.genralExaminationNotes && formik.errors.genralExaminationNotes
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={6}>
            <StepLabel>Investigations</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      CBP (Complete Blood Picture)
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.cbpDate}
                      label="Date"
                      name="cbpDate"
                      value={formik.values.cbpDate}
                      onChange={async (value) => await formik.setFieldValue("cbpDate", value)}
                      error={formik.touched.cbpDate && Boolean(formik.errors.cbpDate)}
                      helperText={formik.touched.cbpDate && formik.errors.cbpDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="cbpResult"
                      value={formik.values.cbpResult}
                      onChange={formik.handleChange}
                      error={formik.touched.cbpResult && Boolean(formik.errors.cbpResult)}
                      helperText={formik.touched.cbpResult && formik.errors.cbpResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      Estradiol (E2)
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.e2Date}
                      label="Date"
                      name="e2Date"
                      value={formik.values.e2Date}
                      onChange={async (value) => await formik.setFieldValue("e2Date", value)}
                      error={formik.touched.e2Date && Boolean(formik.errors.e2Date)}
                      helperText={formik.touched.e2Date && formik.errors.e2Date}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="e2Result"
                      value={formik.values.e2Result}
                      onChange={formik.handleChange}
                      error={formik.touched.e2Result && Boolean(formik.errors.e2Result)}
                      helperText={formik.touched.e2Result && formik.errors.e2Result}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      HCV (Hepatitis C)
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.hepCDate}
                      label="Date"
                      name="hepCDate"
                      value={formik.values.hepCDate}
                      onChange={async (value) => await formik.setFieldValue("hepCDate", value)}
                      error={formik.touched.hepCDate && Boolean(formik.errors.hepCDate)}
                      helperText={formik.touched.hepCDate && formik.errors.hepCDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="hepCResult"
                      value={formik.values.hepCResult}
                      onChange={formik.handleChange}
                      error={formik.touched.hepCResult && Boolean(formik.errors.hepCResult)}
                      helperText={formik.touched.hepCResult && formik.errors.hepCResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      HIV I & II (Elisa)
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.lmpDate}
                      label="Date"
                      name="hivDate"
                      value={formik.values.hivDate}
                      onChange={async (value) => await formik.setFieldValue("hivDate", value)}
                      error={formik.touched.hivDate && Boolean(formik.errors.hivDate)}
                      helperText={formik.touched.hivDate && formik.errors.hivDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="hivResult"
                      value={formik.values.hivResult}
                      onChange={formik.handleChange}
                      error={formik.touched.hivResult && Boolean(formik.errors.hivResult)}
                      helperText={formik.touched.hivResult && formik.errors.hivResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      HbsAg (CMIA)
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.cmiaDate}
                      label="Date"
                      name="cmiaDate"
                      value={formik.values.cmiaDate}
                      onChange={async (value) => await formik.setFieldValue("cmiaDate", value)}
                      error={formik.touched.cmiaDate && Boolean(formik.errors.cmiaDate)}
                      helperText={formik.touched.cmiaDate && formik.errors.cmiaDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="cmiaResult"
                      value={formik.values.cmiaResult}
                      onChange={formik.handleChange}
                      error={formik.touched.cmiaResult && Boolean(formik.errors.cmiaResult)}
                      helperText={formik.touched.cmiaResult && formik.errors.cmiaResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      Random Blood Sugar (RBS)
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.rbsDate}
                      label="Date"
                      name="rbsDate"
                      value={formik.values.rbsDate}
                      onChange={async (value) => await formik.setFieldValue("rbsDate", value)}
                      error={formik.touched.rbsDate && Boolean(formik.errors.rbsDate)}
                      helperText={formik.touched.rbsDate && formik.errors.rbsDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="rbsResult"
                      value={formik.values.rbsResult}
                      onChange={formik.handleChange}
                      error={formik.touched.rbsResult && Boolean(formik.errors.rbsResult)}
                      helperText={formik.touched.rbsResult && formik.errors.rbsResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      TSH (Thyroid Stimulating Hormone)
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.tshDate}
                      label="Date"
                      name="tshDate"
                      value={formik.values.tshDate}
                      onChange={async (value) => await formik.setFieldValue("tshDate", value)}
                      error={formik.touched.tshDate && Boolean(formik.errors.tshDate)}
                      helperText={formik.touched.lmpDate && formik.errors.lmpDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="tshResult"
                      value={formik.values.tshResult}
                      onChange={formik.handleChange}
                      error={formik.touched.tshResult && Boolean(formik.errors.tshResult)}
                      helperText={formik.touched.tshResult && formik.errors.tshResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      VDRL STS Test
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.vdrlDate}
                      label="Date"
                      name="vdrlDate"
                      value={formik.values.vdrlDate}
                      onChange={async (value) => await formik.setFieldValue("vdrlDate", value)}
                      error={formik.touched.vdrlDate && Boolean(formik.errors.vdrlDate)}
                      helperText={formik.touched.vdrlDate && formik.errors.vdrlDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="vdrlResult"
                      value={formik.values.vdrlResult}
                      onChange={formik.handleChange}
                      error={formik.touched.vdrlResult && Boolean(formik.errors.vdrlResult)}
                      helperText={formik.touched.vdrlResult && formik.errors.vdrlResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      Prolactin
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.prolactinDate}
                      label="Date"
                      name="prolactinDate"
                      value={formik.values.prolactinDate}
                      onChange={async (value) => await formik.setFieldValue("prolactinDate", value)}
                      error={formik.touched.prolactinDate && Boolean(formik.errors.prolactinDate)}
                      helperText={formik.touched.prolactinDate && formik.errors.prolactinDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="prolactinResult"
                      value={formik.values.prolactinResult}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.prolactinResult && Boolean(formik.errors.prolactinResult)
                      }
                      helperText={formik.touched.prolactinResult && formik.errors.prolactinResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      Sperm DNA Assessment{" "}
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.spermAssessmentDate}
                      label="Date"
                      name="spermAssessmentDate"
                      value={formik.values.spermAssessmentDate}
                      onChange={async (value) =>
                        await formik.setFieldValue("spermAssessmentDate", value)
                      }
                      error={
                        formik.touched.spermAssessmentDate &&
                        Boolean(formik.errors.spermAssessmentDate)
                      }
                      helperText={
                        formik.touched.spermAssessmentDate && formik.errors.spermAssessmentDate
                      }
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="spermAssessmentResult"
                      value={formik.values.spermAssessmentResult}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.spermAssessmentResult &&
                        Boolean(formik.errors.spermAssessmentResult)
                      }
                      helperText={
                        formik.touched.spermAssessmentResult && formik.errors.spermAssessmentResult
                      }
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      Blood Group & RH Typing
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.bloodGroupDate}
                      label="Date"
                      name="bloodGroupDate"
                      value={formik.values.bloodGroupDate}
                      onChange={async (value) =>
                        await formik.setFieldValue("bloodGroupDate", value)
                      }
                      error={formik.touched.bloodGroupDate && Boolean(formik.errors.bloodGroupDate)}
                      helperText={formik.touched.bloodGroupDate && formik.errors.bloodGroupDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="bloodGroupResult"
                      value={formik.values.bloodGroupResult}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.bloodGroupResult && Boolean(formik.errors.bloodGroupResult)
                      }
                      helperText={formik.touched.bloodGroupResult && formik.errors.bloodGroupResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      ESR
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.esrDate}
                      label="Date"
                      name="esrDate"
                      value={formik.values.esrDate}
                      onChange={async (value) => await formik.setFieldValue("esrDate", value)}
                      error={formik.touched.esrDate && Boolean(formik.errors.esrDate)}
                      helperText={formik.touched.esrDate && formik.errors.esrDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="esrResult"
                      value={formik.values.esrResult}
                      onChange={formik.handleChange}
                      error={formik.touched.esrResult && Boolean(formik.errors.esrResult)}
                      helperText={formik.touched.esrResult && formik.errors.esrResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      Rubella IgG{" "}
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.rubellaDate}
                      label="Date"
                      name="rubellaDate"
                      value={formik.values.rubellaDate}
                      onChange={async (value) => await formik.setFieldValue("rubellaDate", value)}
                      error={formik.touched.rubellaDate && Boolean(formik.errors.rubellaDate)}
                      helperText={formik.touched.rubellaDate && formik.errors.rubellaDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="rubellaResult"
                      value={formik.values.rubellaResult}
                      onChange={formik.handleChange}
                      error={formik.touched.rubellaResult && Boolean(formik.errors.rubellaResult)}
                      helperText={formik.touched.rubellaResult && formik.errors.rubellaResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      FSH
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.fshDate}
                      label="Date"
                      name="fshDate"
                      value={formik.values.fshDate}
                      onChange={async (value) => await formik.setFieldValue("fshDate", value)}
                      error={formik.touched.fshDate && Boolean(formik.errors.fshDate)}
                      helperText={formik.touched.fshDate && formik.errors.fshDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="fshResult"
                      value={formik.values.fshResult}
                      onChange={formik.handleChange}
                      error={formik.touched.fshResult && Boolean(formik.errors.fshResult)}
                      helperText={formik.touched.fshResult && formik.errors.fshResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      LH
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.lhDate}
                      label="Date"
                      name="lhDate"
                      value={formik.values.lhDate}
                      onChange={async (value) => await formik.setFieldValue("lhDate", value)}
                      error={formik.touched.lhDate && Boolean(formik.errors.lhDate)}
                      helperText={formik.touched.lhDate && formik.errors.lhDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="lhResult"
                      value={formik.values.lhResult}
                      onChange={formik.handleChange}
                      error={formik.touched.lhResult && Boolean(formik.errors.lhResult)}
                      helperText={formik.touched.lhResult && formik.errors.lhResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      Pap Smear
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.papDate}
                      label="Date"
                      name="papDate"
                      value={formik.values.papDate}
                      onChange={async (value) => await formik.setFieldValue("papDate", value)}
                      error={formik.touched.papDate && Boolean(formik.errors.papDate)}
                      helperText={formik.touched.papDate && formik.errors.papDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="papResult"
                      value={formik.values.papResult}
                      onChange={formik.handleChange}
                      error={formik.touched.papResult && Boolean(formik.errors.papResult)}
                      helperText={formik.touched.papResult && formik.errors.papResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      Progesterone
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.progesteroneDate}
                      label="Date"
                      name="progesteroneDate"
                      value={formik.values.progesteroneDate}
                      onChange={async (value) =>
                        await formik.setFieldValue("progesteroneDate", value)
                      }
                      error={
                        formik.touched.progesteroneDate && Boolean(formik.errors.progesteroneDate)
                      }
                      helperText={formik.touched.progesteroneDate && formik.errors.progesteroneDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="progesteroneResult"
                      value={formik.values.progesteroneResult}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.progesteroneResult &&
                        Boolean(formik.errors.progesteroneResult)
                      }
                      helperText={
                        formik.touched.progesteroneResult && formik.errors.progesteroneResult
                      }
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      AMH
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.amhDate}
                      label="Date"
                      name="amhDate"
                      value={formik.values.amhDate}
                      onChange={async (value) => await formik.setFieldValue("amhDate", value)}
                      error={formik.touched.amhDate && Boolean(formik.errors.amhDate)}
                      helperText={formik.touched.amhDate && formik.errors.amhDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="amhResult"
                      value={formik.values.amhResult}
                      onChange={formik.handleChange}
                      error={formik.touched.amhResult && Boolean(formik.errors.amhResult)}
                      helperText={formik.touched.amhResult && formik.errors.amhResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      Karyotyping Chromosomal Analysis Couple{" "}
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.kcacDate}
                      label="Date"
                      name="kcacDate"
                      value={formik.values.kcacDate}
                      onChange={async (value) => await formik.setFieldValue("kcacDate", value)}
                      error={formik.touched.kcacDate && Boolean(formik.errors.kcacDate)}
                      helperText={formik.touched.kcacDate && formik.errors.kcacDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="kcacResult"
                      value={formik.values.kcacResult}
                      onChange={formik.handleChange}
                      error={formik.touched.kcacResult && Boolean(formik.errors.kcacResult)}
                      helperText={formik.touched.kcacResult && formik.errors.kcacResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      CA 125
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.ca125Date}
                      label="Date"
                      name="ca125Date"
                      value={formik.values.ca125Date}
                      onChange={async (value) => await formik.setFieldValue("ca125Date", value)}
                      error={formik.touched.ca125Date && Boolean(formik.errors.ca125Date)}
                      helperText={formik.touched.ca125Date && formik.errors.ca125Date}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="ca125Result"
                      value={formik.values.ca125Result}
                      onChange={formik.handleChange}
                      error={formik.touched.ca125Result && Boolean(formik.errors.ca125Result)}
                      helperText={formik.touched.ca125Result && formik.errors.ca125Result}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      Vitamin D
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.vitaminDDate}
                      label="Date"
                      name="vitaminDDate"
                      value={formik.values.vitaminDDate}
                      onChange={async (value) => await formik.setFieldValue("vitaminDDate", value)}
                      error={formik.touched.vitaminDDate && Boolean(formik.errors.vitaminDDate)}
                      helperText={formik.touched.vitaminDDate && formik.errors.vitaminDDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="vitaminDResult"
                      value={formik.values.vitaminDResult}
                      onChange={formik.handleChange}
                      error={formik.touched.vitaminDResult && Boolean(formik.errors.vitaminDResult)}
                      helperText={formik.touched.vitaminDResult && formik.errors.vitaminDResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      Histopathology Small (Endomen Tissue)
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.vitaminDDate}
                      label="Date"
                      name="vitaminDDate"
                      value={formik.values.vitaminDDate}
                      onChange={async (value) => await formik.setFieldValue("vitaminDDate", value)}
                      error={formik.touched.vitaminDDate && Boolean(formik.errors.vitaminDDate)}
                      helperText={formik.touched.vitaminDDate && formik.errors.vitaminDDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="histopathologyResult"
                      value={formik.values.histopathologyResult}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.histopathologyResult &&
                        Boolean(formik.errors.histopathologyResult)
                      }
                      helperText={
                        formik.touched.histopathologyResult && formik.errors.histopathologyResult
                      }
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      TB PCR
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.tbpcrDate}
                      label="Date"
                      name="tbpcrDate"
                      value={formik.values.tbpcrDate}
                      onChange={async (value) => await formik.setFieldValue("tbpcrDate", value)}
                      error={formik.touched.tbpcrDate && Boolean(formik.errors.tbpcrDate)}
                      helperText={formik.touched.tbpcrDate && formik.errors.tbpcrDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="tbpcrResult"
                      value={formik.values.tbpcrResult}
                      onChange={formik.handleChange}
                      error={formik.touched.tbpcrResult && Boolean(formik.errors.tbpcrResult)}
                      helperText={formik.touched.tbpcrResult && formik.errors.tbpcrResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      Bacterial Viginosis
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.bacterialViginosisDate}
                      label="Date"
                      name="bacterialViginosisDate"
                      value={formik.values.bacterialViginosisDate}
                      onChange={async (value) =>
                        await formik.setFieldValue("bacterialViginosisDate", value)
                      }
                      error={
                        formik.touched.bacterialViginosisDate &&
                        Boolean(formik.errors.bacterialViginosisDate)
                      }
                      helperText={
                        formik.touched.bacterialViginosisDate &&
                        formik.errors.bacterialViginosisDate
                      }
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="bacterialViginosisResult"
                      value={formik.values.bacterialViginosisResult}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.bacterialViginosisResult &&
                        Boolean(formik.errors.bacterialViginosisResult)
                      }
                      helperText={
                        formik.touched.bacterialViginosisResult &&
                        formik.errors.bacterialViginosisResult
                      }
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={4} gap={2}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Typography width={500} color={"grey"} fontSize={12} variant="subtitle2">
                      LH (IVF Package)
                    </Typography>
                    <CustomDatePicker
                      ref={inputRefs.lhIvfDate}
                      label="Date"
                      name="lhIvfDate"
                      value={formik.values.lhIvfDate}
                      onChange={async (value) => await formik.setFieldValue("lhIvfDate", value)}
                      error={formik.touched.lhIvfDate && Boolean(formik.errors.lhIvfDate)}
                      helperText={formik.touched.lhIvfDate && formik.errors.lhIvfDate}
                      fullWidth
                    />
                    <TextField
                      label="Result"
                      name="lhIvfResult"
                      value={formik.values.lhIvfResult}
                      onChange={formik.handleChange}
                      error={formik.touched.lhIvfResult && Boolean(formik.errors.lhIvfResult)}
                      helperText={formik.touched.lhIvfResult && formik.errors.lhIvfResult}
                      fullWidth
                    />
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step key={7}>
            <StepLabel>Summary</StepLabel>
            <StepContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Impression"
                    multiline
                    minRows={2}
                    name="impression"
                    value={formik.values.impression}
                    onChange={formik.handleChange}
                    error={formik.touched.impression && Boolean(formik.errors.impression)}
                    helperText={formik.touched.impression && formik.errors.impression}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Treatment Plan"
                    multiline
                    minRows={2}
                    name="treatmentPlan"
                    value={formik.values.treatmentPlan}
                    onChange={formik.handleChange}
                    error={formik.touched.treatmentPlan && Boolean(formik.errors.treatmentPlan)}
                    helperText={formik.touched.treatmentPlan && formik.errors.treatmentPlan}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    label="Summary"
                    multiline
                    minRows={2}
                    name="summary"
                    value={formik.values.summarySummary}
                    onChange={formik.handleChange}
                    error={formik.touched.summarySummary && Boolean(formik.errors.summarySummary)}
                    helperText={formik.touched.summarySummary && formik.errors.summarySummary}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box pt={2} pb={2}>
                <Typography variant="body1">Upload Medical Documents</Typography>
                <Box mt={2}>
                  <Grid item xs={12}>
                    {patient && (
                      <FileUploadButton
                        acceptTypes="image/*, application/pdf"
                        maxFiles={5}
                        maxFileSizeinMB={15}
                        onUploadFiles={setFileUploadedUrl}
                        bucket={EBuckets.UserReports}
                        documentType={EDocumentTypes.MedicalHistory}
                        user={patient?._id}
                      />
                    )}
                  </Grid>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    size="small"
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Sumbit
                  </Button>
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
        {activeStep === 8 && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>Medical History Taken</Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default History;
