import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage/session'; // defaults to localStorage for web
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import patientsReducer from '../features/Patients/patientsSlice';
import appointmentReducer from '../features/Appointment/appointmentSlice';
import investigationReducer from '../features/PatientDashboard/Journey/Investigations/investigationSlice';
import procedureReducer from '../features/PatientDashboard/Journey/Procedures/procedureSlice';
import cryoPreservationReducer from '../features/PatientDashboard/Journey/CryoPreservation/cryoPreservationSlice';
import treatmentCycleReducer from '../features/PatientDashboard/Journey/TreatmentCycle/treatmentCycleSlice';
import authReducer from '../features/Auth/authSlice';

import { homeApi } from '../services/homeApi';
import { fileApi } from '../services/filesApi';
import { patientsApi } from '../services/patientsApi';
import { doctorsApi } from '../services/doctorsApi';
import { appointmentsApi } from '../services/appointmentApi';
import { investigationApi } from '../services/patientDashboardService/investigationApi';
import { serviceApi } from '../services/patientDashboardService/serviceApi';
import { procedureApi } from '../services/patientDashboardService/procedureApi';
import { cryoPreservationApi } from '../services/patientDashboardService/cryoPreservationApi';
import { treatmentCycleApi } from '../services/patientDashboardService/treatmentCycleApi';
import { taxBracketApi } from '../services/pharmacyDashboardService/master/taxBracketApi';
import { drugLocationApi } from '../services/pharmacyDashboardService/master/drugLocationApi';
import { drugVendorApi } from '../services/pharmacyDashboardService/master/drugVendorApi';
import { drugManufacturerApi } from '../services/pharmacyDashboardService/master/drugManufacturerApi';
import { drugCategoryApi } from '../services/pharmacyDashboardService/master/drugCategoryApi';
import { drugTypeApi } from '../services/pharmacyDashboardService/master/drugTypeApi';
import { drugItemApi } from '../services/pharmacyDashboardService/master/drugItemApi';
import { purchaseOrderApi } from '../services/pharmacyDashboardService/purchaseOrderApi';
import { stocksApi } from '../services/pharmacyDashboardService/stocksApi';
import { internalOrderApi } from '../services/pharmacyDashboardService/internalOrderApi';
import { patientHistoryApi } from '../services/patientDashboardService/patientHistoryApi';
import { billingApi } from '../services/patientDashboardService/billings/billingApi';
import { estimationApi } from '../services/patientDashboardService/billings/estimationApi';
import { patientPharmacyApi } from '../services/patientDashboardService/patientPharmacyApi';
import { masterInvestigationApi } from '../services/masterDashboardService/serviceData/masterInvestigationApi';
import { masterProceduresApi } from '../services/masterDashboardService/serviceData/masterProceduresApi';
import { masterServicesApi } from '../services/masterDashboardService/serviceData/masterServicesApi';
import { masterTreatmentCycleApi } from '../services/masterDashboardService/serviceData/cycles/masterTreatmentCycleApi';
import { serviceCyclesStagesApi } from '../services/masterDashboardService/serviceData/cycles/masterCyclesStagesApi';
import { serviceCyclesConsumablesApi } from '../services/masterDashboardService/serviceData/cycles/masterCyclesConsumablesApi';
import { masterCryoPreservationApi } from '../services/masterDashboardService/serviceData/masterCryoPreservationApi';
import { masterPackagesApi } from '../services/masterDashboardService/serviceData/masterPackagesApi';
import { authApi } from '../services/authApi';
import { donorApi } from '../services/donorApi';
import { globalUserApi } from '../services/masterDashboardService/global/globalUser';
import { globalBranchApi } from '../services/masterDashboardService/global/globalBranch';
import { appointmentSourcesApi } from '../services/masterDashboardService/local/appointmentSourceApi';
import { appointmentReasonsApi } from '../services/masterDashboardService/local/appointmentReasonApi';
import { patientSourcesApi } from '../services/masterDashboardService/local/patientSourceApi';
import { referralDoctorsApi } from '../services/masterDashboardService/local/referralDoctorApi';
import { patientIdTypesApi } from '../services/masterDashboardService/local/patientIdTypeApi';
import { notesTreatmentAdvicesApi } from '../services/masterDashboardService/local/notesTreatmentAdviceApi';
import { notesObservationsApi } from '../services/masterDashboardService/local/notesObservationApi';
import { consentsApi } from '../services/masterDashboardService/local/consentApi';
import { notesApi } from '../services/patientDashboardService/notesApi';
import { patientReportsApi } from '../services/patientDashboardService/reportApi';
import { invoiceApi } from '../services/pharmacyDashboardService/invoiceApi';
import { analyticsPatientBillingsApi } from '../services/analyticsDashboardService/billings/analyticsPatientBillingsApi';
import { patientTimelineApi } from '../services/patientDashboardService/patientTimelineApi';
import { internalConsumptionApi } from '../services/pharmacyDashboardService/internalConsumptionApi';
import { treatmentAdviceApi } from '../services/patientDashboardService/treatmentAdviceApi';
import { packageApi } from '../services/patientDashboardService/packageApi';
import { salesByScheduleApi } from '../services/analyticsDashboardService/pharmacy/salesByScheduleApi';
import { stockSummaryApi } from '../services/analyticsDashboardService/pharmacy/stockSummaryApi';
import { expiryDetailsApi } from '../services/analyticsDashboardService/pharmacy/expiryDetailaApi';
import { drugsAndVendorApi } from '../services/analyticsDashboardService/pharmacy/drugsAndVendorApi';
import { internalConsumptionReportApi } from '../services/analyticsDashboardService/pharmacy/internalConsumptionReportApi';
import { patientReturnApi } from '../services/analyticsDashboardService/pharmacy/patientReturnApi';
import { criticalStocksApi } from '../services/analyticsDashboardService/pharmacy/criticalStocksApi';
import { pharmacyReportApi } from '../services/analyticsDashboardService/pharmacy/PharmacyReportApi';
import { purchaseOrderReportApi } from '../services/analyticsDashboardService/pharmacy/purchaseOrderReportApi';
import { refundReportsApi } from '../services/analyticsDashboardService/billings/refundReports';

import { revenueBreakupApi } from '../services/analyticsDashboardService/billings/revenueBreakupApi';
import { treatmentTestingApi } from '../services/analyticsDashboardService/treatment&testing/treatmentTestingApi';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    patientsApi.reducerPath,
    donorApi.reducerPath,
    doctorsApi.reducerPath,
    appointmentsApi.reducerPath,
    investigationApi.reducerPath,
    serviceApi.reducerPath,
    procedureApi.reducerPath,
    cryoPreservationApi.reducerPath,
    treatmentCycleApi.reducerPath,
    taxBracketApi.reducerPath,
    drugLocationApi.reducerPath,
    drugVendorApi.reducerPath,
    drugManufacturerApi.reducerPath,
    drugCategoryApi.reducerPath,
    drugTypeApi.reducerPath,
    drugItemApi.reducerPath,
    purchaseOrderApi.reducerPath,
    stocksApi.reducerPath,
    internalOrderApi.reducerPath,
    patientHistoryApi.reducerPath,
    billingApi.reducerPath,
    estimationApi.reducerPath,
    patientPharmacyApi.reducerPath,
    serviceApi.reducerPath,
    masterInvestigationApi.reducerPath,
    masterCryoPreservationApi.reducerPath,
    masterServicesApi.reducerPath,
    masterTreatmentCycleApi.reducerPath,
    masterProceduresApi.reducerPath,
    serviceCyclesConsumablesApi.reducerPath,
    serviceCyclesStagesApi.reducerPath,
    authApi.reducerPath,
    globalUserApi.reducerPath,
    globalBranchApi.reducerPath,
    appointmentReasonsApi.reducerPath,
    appointmentSourcesApi.reducerPath,
    patientSourcesApi.reducerPath,
    patientIdTypesApi.reducerPath,
    referralDoctorsApi.reducerPath,
    notesObservationsApi.reducerPath,
    notesTreatmentAdvicesApi.reducerPath,
    consentsApi.reducerPath,
    fileApi.reducerPath,
    notesApi.reducerPath,
    homeApi.reducerPath,
    patientReportsApi.reducerPath,
    invoiceApi.reducerPath,
    analyticsPatientBillingsApi.reducerPath,
    patientTimelineApi.reducerPath,
    internalConsumptionApi.reducerPath,
    treatmentAdviceApi.reducerPath,
    masterPackagesApi.reducerPath,
    packageApi.reducerPath,
    salesByScheduleApi.reducerPath,
    stockSummaryApi.reducerPath,
    expiryDetailsApi.reducerPath,
    drugsAndVendorApi.reducerPath,
    internalConsumptionReportApi.reducerPath,
    patientReturnApi.reducerPath,
    criticalStocksApi.reducerPath,
    pharmacyReportApi.reducerPath,
    purchaseOrderReportApi.reducerPath,
    purchaseOrderApi.reducerPath,
    refundReportsApi.reducerPath,
    revenueBreakupApi.reducerPath,
    treatmentTestingApi.reducerPath,
    'patients',
    'appointments',
    'investigation',
    'procedure',
    'cryoPreservation',
    'treatmentCycle',
  ],
};

const rootReducer = combineReducers({
  [patientsApi.reducerPath]: patientsApi.reducer,
  [donorApi.reducerPath]: donorApi.reducer,
  [doctorsApi.reducerPath]: doctorsApi.reducer,
  [appointmentsApi.reducerPath]: appointmentsApi.reducer,
  [investigationApi.reducerPath]: investigationApi.reducer,
  [serviceApi.reducerPath]: serviceApi.reducer,
  [procedureApi.reducerPath]: procedureApi.reducer,
  [cryoPreservationApi.reducerPath]: cryoPreservationApi.reducer,
  [treatmentCycleApi.reducerPath]: treatmentCycleApi.reducer,
  [taxBracketApi.reducerPath]: taxBracketApi.reducer,
  [drugLocationApi.reducerPath]: drugLocationApi.reducer,
  [drugVendorApi.reducerPath]: drugVendorApi.reducer,
  [drugManufacturerApi.reducerPath]: drugManufacturerApi.reducer,
  [drugCategoryApi.reducerPath]: drugCategoryApi.reducer,
  [drugTypeApi.reducerPath]: drugTypeApi.reducer,
  [drugItemApi.reducerPath]: drugItemApi.reducer,
  [purchaseOrderApi.reducerPath]: purchaseOrderApi.reducer,
  [stocksApi.reducerPath]: stocksApi.reducer,
  [internalOrderApi.reducerPath]: internalOrderApi.reducer,
  [patientHistoryApi.reducerPath]: patientHistoryApi.reducer,
  [billingApi.reducerPath]: billingApi.reducer,
  [estimationApi.reducerPath]: estimationApi.reducer,
  [patientPharmacyApi.reducerPath]: patientPharmacyApi.reducer,
  [masterInvestigationApi.reducerPath]: masterInvestigationApi.reducer,
  [masterCryoPreservationApi.reducerPath]: masterCryoPreservationApi.reducer,
  [masterTreatmentCycleApi.reducerPath]: masterTreatmentCycleApi.reducer,
  [masterProceduresApi.reducerPath]: masterProceduresApi.reducer,
  [masterServicesApi.reducerPath]: masterServicesApi.reducer,
  [serviceCyclesStagesApi.reducerPath]: serviceCyclesStagesApi.reducer,
  [serviceCyclesConsumablesApi.reducerPath]:
    serviceCyclesConsumablesApi.reducer,
  [globalUserApi.reducerPath]: globalUserApi.reducer,
  [globalBranchApi.reducerPath]: globalBranchApi.reducer,
  [appointmentSourcesApi.reducerPath]: appointmentSourcesApi.reducer,
  [appointmentReasonsApi.reducerPath]: appointmentReasonsApi.reducer,
  [patientSourcesApi.reducerPath]: patientSourcesApi.reducer,
  [patientIdTypesApi.reducerPath]: patientIdTypesApi.reducer,
  [notesObservationsApi.reducerPath]: notesObservationsApi.reducer,
  [notesTreatmentAdvicesApi.reducerPath]: notesTreatmentAdvicesApi.reducer,
  [consentsApi.reducerPath]: consentsApi.reducer,
  [referralDoctorsApi.reducerPath]: referralDoctorsApi.reducer,
  [notesApi.reducerPath]: notesApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [homeApi.reducerPath]: homeApi.reducer,
  [patientReportsApi.reducerPath]: patientReportsApi.reducer,
  [invoiceApi.reducerPath]: invoiceApi.reducer,
  [analyticsPatientBillingsApi.reducerPath]:
    analyticsPatientBillingsApi.reducer,
  [patientTimelineApi.reducerPath]: patientTimelineApi.reducer,
  [internalConsumptionApi.reducerPath]: internalConsumptionApi.reducer,
  [treatmentAdviceApi.reducerPath]: treatmentAdviceApi.reducer,
  [masterPackagesApi.reducerPath]: masterPackagesApi.reducer,
  [packageApi.reducerPath]: packageApi.reducer,
  [salesByScheduleApi.reducerPath]: salesByScheduleApi.reducer,
  [drugsAndVendorApi.reducerPath]: drugsAndVendorApi.reducer,
  [expiryDetailsApi.reducerPath]: expiryDetailsApi.reducer,
  [stockSummaryApi.reducerPath]: stockSummaryApi.reducer,
  [internalConsumptionReportApi.reducerPath]:
    internalConsumptionReportApi.reducer,
  [patientReturnApi.reducerPath]: patientReturnApi.reducer,
  [criticalStocksApi.reducerPath]: criticalStocksApi.reducer,
  [pharmacyReportApi.reducerPath]: pharmacyReportApi.reducer,
  [purchaseOrderReportApi.reducerPath]: purchaseOrderReportApi.reducer,
  [refundReportsApi.reducerPath]: refundReportsApi.reducer,
  [revenueBreakupApi.reducerPath]: revenueBreakupApi.reducer,
  [treatmentTestingApi.reducerPath]: treatmentTestingApi.reducer,
  patients: patientsReducer,
  appointments: appointmentReducer,
  investigation: investigationReducer,
  procedure: procedureReducer,
  cryoPreservation: cryoPreservationReducer,
  treatmentCycle: treatmentCycleReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // These actions are ignored during serializability checks. It's required by redux-persist
      },
    })
      .concat(patientsApi.middleware)
      .concat(donorApi.middleware)
      .concat(doctorsApi.middleware)
      .concat(appointmentsApi.middleware)
      .concat(investigationApi.middleware)
      .concat(serviceApi.middleware)
      .concat(procedureApi.middleware)
      .concat(cryoPreservationApi.middleware)
      .concat(treatmentCycleApi.middleware)
      .concat(taxBracketApi.middleware)
      .concat(drugLocationApi.middleware)
      .concat(drugVendorApi.middleware)
      .concat(drugManufacturerApi.middleware)
      .concat(drugCategoryApi.middleware)
      .concat(drugTypeApi.middleware)
      .concat(drugItemApi.middleware)
      .concat(purchaseOrderApi.middleware)
      .concat(stocksApi.middleware)
      .concat(internalOrderApi.middleware)
      .concat(patientHistoryApi.middleware)
      .concat(patientPharmacyApi.middleware)
      .concat(masterInvestigationApi.middleware)
      .concat(masterCryoPreservationApi.middleware)
      .concat(masterTreatmentCycleApi.middleware)
      .concat(serviceCyclesStagesApi.middleware)
      .concat(serviceCyclesConsumablesApi.middleware)
      .concat(masterProceduresApi.middleware)
      .concat(masterServicesApi.middleware)
      .concat(billingApi.middleware)
      .concat(estimationApi.middleware)
      .concat(patientPharmacyApi.middleware)
      .concat(authApi.middleware)
      .concat(globalUserApi.middleware)
      .concat(globalBranchApi.middleware)
      .concat(consentsApi.middleware)
      .concat(appointmentReasonsApi.middleware)
      .concat(appointmentSourcesApi.middleware)
      .concat(patientSourcesApi.middleware)
      .concat(referralDoctorsApi.middleware)
      .concat(patientIdTypesApi.middleware)
      .concat(notesObservationsApi.middleware)
      .concat(notesTreatmentAdvicesApi.middleware)
      .concat(fileApi.middleware)
      .concat(notesApi.middleware)
      .concat(homeApi.middleware)
      .concat(patientReportsApi.middleware)
      .concat(invoiceApi.middleware)
      .concat(analyticsPatientBillingsApi.middleware)
      .concat(patientTimelineApi.middleware)
      .concat(internalConsumptionApi.middleware)
      .concat(treatmentAdviceApi.middleware)
      .concat(masterPackagesApi.middleware)
      .concat(packageApi.middleware)
      .concat(salesByScheduleApi.middleware)
      .concat(drugsAndVendorApi.middleware)
      .concat(expiryDetailsApi.middleware)
      .concat(internalConsumptionReportApi.middleware)
      .concat(stockSummaryApi.middleware)
      .concat(patientReturnApi.middleware)
      .concat(criticalStocksApi.middleware)
      .concat(pharmacyReportApi.middleware)
      .concat(purchaseOrderReportApi.middleware)
      .concat(refundReportsApi.middleware)
      .concat(revenueBreakupApi.middleware)
      .concat(treatmentTestingApi.middleware),
  enhancers(getDefaultEnhancers) {
    return getDefaultEnhancers();
  },
});

export const persistor = persistStore(store);

export const handlePersistorPurge = () => {
  persistor.purge();
};

export type RootState = ReturnType<typeof store.getState>;
