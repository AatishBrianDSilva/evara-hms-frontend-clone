import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPatient } from "../../types/patient";
import { ICase } from "../../types/case";

interface PatientState {
  patientId: string | null;
  partnerId: string | null;
  patient: IPatient | null;
  partner: IPatient | null;
  case: ICase | null;
}

const initialState: PatientState = {
  patientId: null,
  partnerId: null,
  patient: null,
  partner: null,
  case: null,
};

export const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setPatientId: (state, action: PayloadAction<string | null>) => {
      state.patientId = action.payload;
    },
    setPartnerId: (state, action: PayloadAction<string | null>) => {
      state.partnerId = action.payload;
    },
    setPatient: (state, action: PayloadAction<IPatient>) => {
      const patient = action.payload;
      state.patient = patient;
    },
    setPartner: (state, action: PayloadAction<IPatient | null>) => {
      const patient = action.payload;
      state.partner = patient;
    },
    setCase: (state, action: PayloadAction<ICase>) => {
      state.case = action.payload;
    },
    swapPatientAndPartner: (state) => {
      const tempPatient = state.patient;
      state.patient = state.partner;
      state.partner = tempPatient;

      const tempPatientId = state.patientId;
      state.patientId = state.partnerId;
      state.partnerId = tempPatientId;
    },
  },
});

export const {
  setPatientId,
  setPartnerId,
  setPartner,
  setPatient,
  setCase,
  swapPatientAndPartner,
} = patientsSlice.actions;

export default patientsSlice.reducer;
