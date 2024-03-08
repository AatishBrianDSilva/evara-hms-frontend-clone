import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICase, IPatient } from "../../types/types"; // Adjust import path as necessary

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
    setPartner: (state, action: PayloadAction<IPatient>) => {
      const patient = action.payload;
      state.partner = patient;
    },
    setCase: (state, action: PayloadAction<ICase>) => {
      state.case = action.payload;
    },
  },
});

export const { setPatientId, setPartnerId, setPartner, setPatient, setCase } =
  patientsSlice.actions;

export default patientsSlice.reducer;
