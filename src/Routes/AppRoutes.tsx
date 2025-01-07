import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Home from '../features/Home/Home';
import Patients from '../features/Patients/Patients';
import Appointment from '../features/Appointment/Appointment';
import PharmacyDashboard from '../features/PharmacyDashboard/PharmacyDashboard';
import PurchaseOrder from '../features/PharmacyDashboard/PurchaseOrder/PurchaseOrder';
import PatientJourneyTabs from '../features/PatientDashboard/Journey/PatientJourneyTabs';
import Notes from '../features/PatientDashboard/Notes/Notes';
import History from '../features/PatientDashboard/History/History';
import PatientDashboard from '../features/PatientDashboard/PatientDashboard';
import BillingsTab from '../features/PatientDashboard/Billings/BillingsTab';
import {
  EJourneyTabPaths,
  EInternalOrdersTabPaths,
  EPatientTabPaths,
  EPurchaseOrderTabPaths,
  EBillingsTabPaths,
  EMasterDashboardTabPaths,
  EIVFRegistrationTabPaths,
} from '../types/global';
import Procedures from '../features/PatientDashboard/Journey/Procedures/Procedures';
import CryoPreservations from '../features/PatientDashboard/Journey/CryoPreservation/CryoPreservation';
import Investigations from '../features/PatientDashboard/Journey/Investigations/Investigations';
import TreatmentCycle from '../features/PatientDashboard/Journey/TreatmentCycle/TreatmentCycle';
import TreatmentAdvice from '../features/PatientDashboard/Journey/TreatmentAdvice/TreatmentAdvice';
import Packages from '../features/PatientDashboard/Journey/Packages/Packages';
import DrugItem from '../features/PharmacyDashboard/Masters/DrugItem/DrugItem';
import DrugManufacturer from '../features/PharmacyDashboard/Masters/DrugManufacturer/DrugManufacturers';
import PatientPharmacy from '../features/PatientDashboard/Pharmacy/PatientPharmacy';
import TaxBracket from '../features/PharmacyDashboard/Masters/TaxBracket/TaxBracket';
import DrugTypes from '../features/PharmacyDashboard/Masters/DrugTypes/DrugTypes';
import DrugCategories from '../features/PharmacyDashboard/Masters/DrugCategories/DrugCategories';
import DrugVendors from '../features/PharmacyDashboard/Masters/DrugVendors/DrugVendors';
import DrugLocation from '../features/PharmacyDashboard/Masters/DrugLocations/DrugLocation';
import PharmacyMasters from '../features/PharmacyDashboard/Masters/PharmacyMasters';
import Services from '../features/PatientDashboard/Journey/Services/Services';
import Draft from '../features/PharmacyDashboard/PurchaseOrder/Draft/Draft';
import Approved from '../features/PharmacyDashboard/PurchaseOrder/Approved/Approved';
import Rejected from '../features/PharmacyDashboard/PurchaseOrder/Rejected/Rejected';
import Ordered from '../features/PharmacyDashboard/PurchaseOrder/Ordered/Ordered';
import PartiallyProcessed from '../features/PharmacyDashboard/PurchaseOrder/PartiallyProcessed/PartiallyProcessed';
import Processed from '../features/PharmacyDashboard/PurchaseOrder/Processed/Processed';
import MasterDashboard from '../features/MasterDashboard/MasterDashboard';
import Local from '../features/MasterDashboard/Local/Local';
import Global from '../features/MasterDashboard/Global/Global';
import ServiceData from '../features/MasterDashboard/ServiceData/ServiceData';
import Advice from '../features/MasterDashboard/Local/Notes/Advice/Advice';
import Observation from '../features/MasterDashboard/Local/Notes/Observation/Observation';
import Customer from '../features/MasterDashboard/Local/Customer/Customer';
import Stocks from '../features/PharmacyDashboard/Stocks/Stocks';
import ApprovedInternalOrder from '../features/PharmacyDashboard/InternalOrders/Approved/Approved';
import RejectedInternalOrder from '../features/PharmacyDashboard/InternalOrders/Rejected/Rejected';
import ProcessInternalOrder from '../features/PharmacyDashboard/InternalOrders/Processed/Processed';
import DraftInternalOrder from '../features/PharmacyDashboard/InternalOrders/Draft/Draft';
import InternalOrders from '../features/PharmacyDashboard/InternalOrders/InternalOrders';
import AdminApproval from '../features/PharmacyDashboard/PurchaseOrder/AdminApproval/AdminApproval';

// import BillingsAdvance from "../features/PatientDashboard/Billings/Advance/BillingsAdvance";
import BillingsPaid from '../features/PatientDashboard/Billings/Paid/BillingsPaid';
import BillingsEstimations from '../features/PatientDashboard/Billings/Estimation/BillingsEstimations';
import BillingsPending from '../features/PatientDashboard/Billings/Pending/BillingsPending';
// import BillingsRefund from "../features/PatientDashboard/Billings/Refund/BillingsRefund";
// import BillingsArchived from "../features/PatientDashboard/Billings/Archived/BillingsArchived";
// import BillingsTransactions from "../features/PatientDashboard/Billings/Transactions/BillingsTransactions";
import IDType from '../features/MasterDashboard/Local/Patients/IDType/IDType';
import ReferralDoctor from '../features/MasterDashboard/Local/Patients/ReferralDoctor/ReferralDoctor';
import Source from '../features/MasterDashboard/Local/Patients/Source/Source';
import Consents from '../features/MasterDashboard/Local/Consents/Consents';
import CryoParameters from '../features/MasterDashboard/Local/CryoParameters/CryoParameters';
import Roles from '../features/MasterDashboard/Local/Role/Roles';
import Reports from '../features/MasterDashboard/Local/Reports/Reports';
import Branch from '../features/MasterDashboard/Global/Branch/Branch';
import User from '../features/MasterDashboard/Global/Users/User';
import LocalConsultantDoctor from '../features/MasterDashboard/Local/ConsultantDoctors/LocalConsultantDoctors';
import GlobalConsultantDoctor from '../features/MasterDashboard/Global/ConsultantDoctors/GlobalConsultantDoctors';
import AppointmentReason from '../features/MasterDashboard/Local/Appointments/Reason/Reason';
import AppointmentSource from '../features/MasterDashboard/Local/Appointments/Source/Source';
import MasterInvestigations from '../features/MasterDashboard/ServiceData/Investigations/MasterInvestigations';
import MastersProcedures from '../features/MasterDashboard/ServiceData/Procedures/MastersProcedures';
import MasterService from '../features/MasterDashboard/ServiceData/Service/MasterService';
import MasterCryoPreservation from '../features/MasterDashboard/ServiceData/CryoPreservations/MasterCryoPreservation';
import MasterCycleStages from '../features/MasterDashboard/ServiceData/Cycles/Stages/MasterCycleStage';
import MasterPackages from '../features/MasterDashboard/ServiceData/Packages/MasterPackages';
// import MasterPackages from "../features/MasterDashboard/ServiceData/Packages/Packages";
import MasterCycleItems from '../features/MasterDashboard/ServiceData/Cycles/Items/MasterCycleItem';
import MasterCycleConsumables from '../features/MasterDashboard/ServiceData/Cycles/Consumables/MasterCycleConsumable';
import Login from '../features/Auth/Login';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import IVFRegistrationTab from '../features/IVFRegistration/IVFRegistrationTabs';
import PatientRegistration from '../features/IVFRegistration/PatientRegistration';
import DonorRegistrationFromBank from '../features/IVFRegistration/DonorRegistrationFromBank';
import DonorRegistrationFromHospital from '../features/IVFRegistration/DonorRegistrationFromHospital';
import PharmacyTransactions from '../features/AnalyticsDashboard/Pharmacy/PharmacyTransactions';
import BillingsTransactions from '../features/PatientDashboard/Billings/Transactions/BillingsTransactions';
import AnalyticsDashboard from '../features/AnalyticsDashboard/AnalyticsDashboard';
import PreviousAppointments from '../features/AnalyticsDashboard/Appointment/PreviousAppointment/PreviousAppointment';
import UpcomingAppointments from '../features/AnalyticsDashboard/Appointment/PreviousAppointment/UpcomingAppointment';
import Donors from '../features/AnalyticsDashboard/Patients/Donors';
import PatientBillings from '../features/AnalyticsDashboard/AnalyticsBillings/PatientBillings';
import InternalTransfers from '../features/AnalyticsDashboard/Pharmacy/InternalTransfers';
import LocalDonor from '../features/MasterDashboard/Local/Donors/LocalDonor';
import Report from '../features/PatientDashboard/Report/report';
import Invoices from '../features/PharmacyDashboard/Invoices/Invoices';
import PatientAppointment from '../features/PatientDashboard/Appointment/PatientAppointment';
import { EUserRole } from '../types/masterDashboard/global';
import NoPermission from '../components/NoPermission/NoPermission';
import ExpiringStocks from '../features/AnalyticsDashboard/Pharmacy/ExpiringStocks';
import PharmacyReport from '../features/AnalyticsDashboard/Pharmacy/PharmacyReport';
import PurchaseOrderReports from '../features/AnalyticsDashboard/Pharmacy/PurchaseOrderReports';
import Timeline from '../features/PatientDashboard/Journey/Timeline/Timeline';
import InternalConsumption from '../features/PharmacyDashboard/InternalConsumption/InternalConsumption';
import BillingsRefund from '../features/PatientDashboard/Billings/Refund/BillingsRefund';
import SaleBySchedule from '../features/AnalyticsDashboard/Pharmacy/SaleBySchedule';
import InternalConsumptionReports from '../features/AnalyticsDashboard/Pharmacy/InternalConsumption';
import DrugsAndVendorReports from '../features/AnalyticsDashboard/Pharmacy/DrugsAndVendor';
import PatientReturnReports from '../features/AnalyticsDashboard/Pharmacy/PatientReturn';
import StockSummaryReports from '../features/AnalyticsDashboard/Pharmacy/StockSummary';
import ExpiryDetails from '../features/AnalyticsDashboard/Pharmacy/ExpiryDetails';
import CriticalStocksReport from '../features/AnalyticsDashboard/Pharmacy/criticalStocks';
import RefundsReport from '../features/AnalyticsDashboard/AnalyticsBillings/RefundsReport';
import RevenueBreakupReport from '../features/AnalyticsDashboard/AnalyticsBillings/RevenueBreakupReport';
import AnalyticsInvestigations from '../features/AnalyticsDashboard/Treatments&Testing/Investigations';
import AnalyticsProcedures from '../features/AnalyticsDashboard/Treatments&Testing/Procedures';
import AnalyticsCryoPreservation from '../features/AnalyticsDashboard/Treatments&Testing/CryoPreservation';
import AnalyticsTreatmentCycle from '../features/AnalyticsDashboard/Treatments&Testing/TreatmentCycle';
import AnalyticsServices from '../features/AnalyticsDashboard/Treatments&Testing/Services';
import AnalyticsPatientPackages from '../features/AnalyticsDashboard/Treatments&Testing/PatientPackages';
import AnalyticsMasterPackages from '../features/AnalyticsDashboard/Treatments&Testing/MasterPackages';

interface ProtectedRouteProps {
  allowedRoles: string[];
  navigateTo: '/login' | '/not-authorized';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  navigateTo,
}) => {
  const user = useSelector((state: RootState) => {
    return state.auth.user;
  });
  const userRole = user?.role ?? '';
  // const userRole = EUserRole.Pharmacist;
  return allowedRoles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to={navigateTo} />
  );
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route element={<Layout />}>
      <Route
        path="/"
        element={
          <ProtectedRoute
            allowedRoles={Object.values(EUserRole)}
            navigateTo="/login"
          />
        }
      >
        <Route index element={<Home />} />

        <Route
          path="ivf-registration"
          element={
            <ProtectedRoute
              allowedRoles={[
                EUserRole.Admin,
                EUserRole.Doctor,
                EUserRole.Nurse,
                EUserRole.Reception,
                EUserRole.CenterManager,
              ]}
              navigateTo="/not-authorized"
            />
          }
        >
          <Route element={<IVFRegistrationTab />}>
            <Route
              index
              element={<Navigate to={EIVFRegistrationTabPaths.Patient} />}
            />
            <Route
              path={EIVFRegistrationTabPaths.Patient}
              element={<PatientRegistration />}
            />
            <Route
              path={EIVFRegistrationTabPaths.DonorBank}
              element={<DonorRegistrationFromBank />}
            />
            <Route
              path={EIVFRegistrationTabPaths.DonorHospital}
              element={<DonorRegistrationFromHospital />}
            />
          </Route>
        </Route>

        <Route
          path="patients"
          element={
            <ProtectedRoute
              allowedRoles={Object.values(EUserRole)}
              navigateTo={'/not-authorized'}
            />
          }
        >
          <Route index element={<Patients />} />
        </Route>

        <Route path="patient/:id" element={<PatientDashboard />}>
          {/* Default path is journey for the patient/:id */}
          <Route
            index
            element={<Navigate to={EPatientTabPaths.Journey} replace />}
          />
          {/* Routing for Patient Main Tabs */}

          {/* Routing for Journey Tabs */}
          <Route
            path={EPatientTabPaths.Journey}
            element={<PatientJourneyTabs />}
          >
            {/* Default path is investigation for journey tab*/}
            <Route
              index
              element={<Navigate to={EJourneyTabPaths.Timeline} replace />}
            />
            <Route path={EJourneyTabPaths.Timeline} element={<Timeline />} />
            <Route
              path={`${EJourneyTabPaths.Investigations}/:itemId?`}
              element={<Investigations />}
            />
            <Route
              path={`${EJourneyTabPaths.Packages}/:itemId?`}
              element={<Packages />}
            />
            <Route
              path={`${EJourneyTabPaths.TreatmentAdvice}/:itemId?`}
              element={<TreatmentAdvice />}
            />
            <Route
              path={`${EJourneyTabPaths.Procedure}/:itemId?`}
              element={<Procedures />}
            />
            <Route
              path={`${EJourneyTabPaths.CryoPreservation}/:itemId?`}
              element={<CryoPreservations />}
            />
            <Route
              path={`${EJourneyTabPaths.Services}/:itemId?`}
              element={<Services />}
            />
            <Route
              path={`${EJourneyTabPaths.Cycle}/:itemId?`}
              element={<TreatmentCycle />}
            />
          </Route>

          {/* Routing for the rest of the tabs */}
          <Route path={EPatientTabPaths.Notes} element={<Notes />} />
          <Route path={EPatientTabPaths.History} element={<History />} />
          <Route
            path={EPatientTabPaths.Appointment}
            element={<PatientAppointment />}
          />
          <Route
            path={EPatientTabPaths.Pharmacy}
            element={<PatientPharmacy />}
          />

          <Route
            index
            element={<Navigate to={EJourneyTabPaths.Investigations} replace />}
          />
          <Route path={EPatientTabPaths.Report} element={<Report />} />
          <Route
            path={EPatientTabPaths.Billings}
            element={
              <ProtectedRoute
                allowedRoles={[
                  EUserRole.Admin,
                  EUserRole.CenterManager,
                  EUserRole.Billing,
                  EUserRole.PharmacyManager,
                ]}
                navigateTo={'/not-authorized'}
              />
            }
          >
            <Route element={<BillingsTab />}>
              <Route
                index
                element={<Navigate to={EBillingsTabPaths.Estimation} replace />}
              />
              <Route
                path={EBillingsTabPaths.Estimation}
                element={<BillingsEstimations />}
              />
              <Route
                path={EBillingsTabPaths.Pending}
                element={<BillingsPending />}
              />
              {/* <Route path={EBillingsTabPaths.Advance} element={<BillingsAdvance />} /> */}
              <Route path={EBillingsTabPaths.Paid} element={<BillingsPaid />} />
              <Route
                path={EBillingsTabPaths.Refund}
                element={<BillingsRefund />}
              />
            </Route>
            {/* <Route path={EBillingsTabPaths.Archieved} element={<BillingsArchived />} /> */}
            {/* <Route path={EBillingsTabPaths.Transactions} element={<BillingsTransactions />} /> */}
          </Route>

          {/* More routes for each tab */}
        </Route>

        <Route
          path="appointments"
          element={
            <ProtectedRoute
              allowedRoles={Object.values(EUserRole)}
              navigateTo={'/not-authorized'}
            />
          }
        >
          <Route index element={<Appointment />} />
        </Route>

        <Route
          path="pharmacy"
          element={
            <ProtectedRoute
              allowedRoles={[
                EUserRole.Admin,
                EUserRole.Billing,
                EUserRole.Pharmacist,
                EUserRole.PharmacyManager,
                EUserRole.Embryologist,
                EUserRole.CenterManager,
              ]}
              navigateTo={'/not-authorized'}
            />
          }
        >
          <Route element={<PharmacyDashboard />}>
            <Route index element={<Navigate to={'masters'} />} />
            <Route path="masters" element={<PharmacyMasters />}>
              <Route index element={<Navigate to={'drug-item'} />} />
              <Route path="drug-item" element={<DrugItem />} />
              <Route path="drug-types" element={<DrugTypes />} />
              <Route path="drug-categories" element={<DrugCategories />} />
              <Route path="drug-manufacturer" element={<DrugManufacturer />} />
              <Route path="drug-vendors" element={<DrugVendors />} />
              <Route path="drug-locations" element={<DrugLocation />} />
              <Route path="tax-brackets" element={<TaxBracket />} />
            </Route>

            <Route path="purchase-order" element={<PurchaseOrder />}>
              <Route
                index
                element={<Navigate to={EPurchaseOrderTabPaths.Draft} replace />}
              />
              <Route path={EPurchaseOrderTabPaths.Draft} element={<Draft />} />
              <Route
                path={EPurchaseOrderTabPaths.Approved}
                element={<Approved />}
              />
              <Route
                path={EPurchaseOrderTabPaths.Rejected}
                element={<Rejected />}
              />
              <Route
                path={EPurchaseOrderTabPaths.Ordered}
                element={<Ordered />}
              />
              <Route
                path={EPurchaseOrderTabPaths.AdminApproval}
                element={<AdminApproval />}
              />
              <Route
                path={EPurchaseOrderTabPaths.PartiallyProcessed}
                element={<PartiallyProcessed />}
              />
              <Route
                path={EPurchaseOrderTabPaths.Processed}
                element={<Processed />}
              />
            </Route>
            <Route path="orders" element={<InternalOrders />}>
              <Route
                index
                element={
                  <Navigate to={EInternalOrdersTabPaths.Draft} replace />
                }
              />
              <Route
                path={EInternalOrdersTabPaths.Draft}
                element={<DraftInternalOrder />}
              />
              <Route
                path={EInternalOrdersTabPaths.Approved}
                element={<ApprovedInternalOrder />}
              />
              <Route
                path={EInternalOrdersTabPaths.Rejected}
                element={<RejectedInternalOrder />}
              />
              <Route
                path={EInternalOrdersTabPaths.Processed}
                element={<ProcessInternalOrder />}
              />
            </Route>
            <Route
              path="internal-consumption"
              element={<InternalConsumption />}
            />
            <Route path="stocks" element={<Stocks />} />
            <Route path="invoices" element={<Invoices />} />

            <Route path="*" element={<Navigate to="pharmacy" />} />
          </Route>
        </Route>

        <Route
          path="master"
          element={
            <ProtectedRoute
              allowedRoles={[EUserRole.Admin, EUserRole.CenterManager]}
              navigateTo={'/not-authorized'}
            />
          }
        >
          <Route element={<MasterDashboard />}>
            <Route index element={<Navigate to={'local'} />} />
            <Route path={EMasterDashboardTabPaths.Local} element={<Local />}>
              <Route
                index
                element={<Navigate to={'patient/referral-doctor'} />}
              />
              <Route path="customer" element={<Customer />} />
              <Route
                path="patient/referral-doctor"
                element={<ReferralDoctor />}
              />
              <Route path="patient/id-type" element={<IDType />} />
              <Route path="patient/source" element={<Source />} />

              <Route
                path="appointment/reason"
                element={<AppointmentReason />}
              />
              <Route
                path="appointment/source"
                element={<AppointmentSource />}
              />

              <Route path="/master/local/notes/advice" element={<Advice />} />
              <Route
                path="/master/local/notes/observation"
                element={<Observation />}
              />

              <Route path="consents" element={<Consents />} />
              <Route path="cryo-parameters" element={<CryoParameters />} />
              <Route
                path="consultant-doctors"
                element={<LocalConsultantDoctor />}
              />
              <Route path="roles" element={<Roles />} />

              <Route path="reports" element={<Reports />} />

              <Route path="/master/local/donors" element={<LocalDonor />} />
            </Route>

            {/* <Route path={EMasterDashboardTabPaths.Global} element={<Global />} /> */}
            <Route path={EMasterDashboardTabPaths.Global} element={<Global />}>
              <Route index element={<Navigate to={'user'} />} />
              <Route path="global" element={<Global />} />
              <Route path="branch" element={<Branch />} />
              <Route path="doctors" element={<GlobalConsultantDoctor />} />
              <Route path="user" element={<User />} />
            </Route>

            <Route
              path={EMasterDashboardTabPaths.ServiceData}
              element={<ServiceData />}
            >
              <Route index element={<Navigate to={'investigation'} />} />
              <Route path="investigation" element={<MasterInvestigations />} />
              <Route path="procedure" element={<MastersProcedures />} />
              <Route path="service" element={<MasterService />} />
              {/* <Route path="packages" element={<MasterPackages />} /> */}
              <Route path="cycle">
                <Route index element={<Navigate to={'items'} />} />
                <Route path="items" element={<MasterCycleItems />} />
                <Route path="stages" element={<MasterCycleStages />} />
                <Route
                  path="consumables"
                  element={<MasterCycleConsumables />}
                />
              </Route>
              <Route
                path="cryo-preservation"
                element={<MasterCryoPreservation />}
              />
              <Route path="packages" element={<MasterPackages />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="analytics"
          element={
            <ProtectedRoute
              allowedRoles={[EUserRole.Admin, EUserRole.CenterManager]}
              navigateTo={'/not-authorized'}
            />
          }
        >
          <Route element={<AnalyticsDashboard />}>
            <Route index element={<Navigate to="appointment" />} />

            <Route path="appointment">
              <Route index element={<Navigate to="previous-appointment" />} />

              <Route
                path="previous-appointment"
                element={<PreviousAppointments />}
              />

              <Route index element={<Navigate to="upcoming-appointment" />} />
              <Route
                path="upcoming-appointment"
                element={<UpcomingAppointments />}
              />
            </Route>

            <Route path="patient">
              <Route index element={<Navigate to="patients" />} />
              <Route path="donors" element={<Donors />} />
            </Route>

            <Route path="billings">
              <Route index element={<Navigate to="patient-billings" />} />
              <Route path="patient-billings" element={<PatientBillings />} />
              <Route
                path="billings-transactions"
                element={<BillingsTransactions />}
              />
              <Route path="refund-reports" element={<RefundsReport />} />
              <Route
                path="revenue-breakup-reports"
                element={<RevenueBreakupReport />}
              />
            </Route>

            <Route path="pharmacy">
              <Route index element={<Navigate to="pharmacy-transactions" />} />
              <Route
                path="pharmacy-transactions"
                element={<PharmacyTransactions />}
              />
              <Route
                path="internal-transfers"
                element={<InternalTransfers />}
              />
              <Route path="expiring-stocks" element={<ExpiringStocks />} />
              <Route path="pharmacy-reports" element={<PharmacyReport />} />
              <Route
                path="purchase-order-reports"
                element={<PurchaseOrderReports />}
              />
              <Route
                path="sale-by-schedule-reports"
                element={<SaleBySchedule />}
              />
              <Route
                path="internal-consumption-reports"
                element={<InternalConsumptionReports />}
              />
              <Route
                path="drugs-and-vendors-reports"
                element={<DrugsAndVendorReports />}
              />
              <Route
                path="patient-return-reports"
                element={<PatientReturnReports />}
              />
              <Route
                path="stock-summary-reports"
                element={<StockSummaryReports />}
              />
              <Route path="expiry-details" element={<ExpiryDetails />} />
              <Route
                path="critical-stocks"
                element={<CriticalStocksReport />}
              />
            </Route>

            <Route path="treatments-testing">
              <Route index element={<Navigate to="investigation-reports" />} />
              <Route
                path="investigation-reports"
                element={<AnalyticsInvestigations />}
              />
              <Route
                path="procedure-reports"
                element={<AnalyticsProcedures />}
              />
              <Route
                path="treatment-reports"
                element={<AnalyticsTreatmentCycle />}
              />
              <Route
                path="cryo-preservation-reports"
                element={<AnalyticsCryoPreservation />}
              />
              <Route path="service-reports" element={<AnalyticsServices />} />
              <Route path="packages">
                <Route index element={<Navigate to="patient-reports" />} />
                <Route
                  path="patient-reports"
                  element={<AnalyticsPatientPackages />}
                />
                <Route
                  path="master-reports"
                  element={<AnalyticsMasterPackages />}
                />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="not-authorized" element={<NoPermission />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
