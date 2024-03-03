// features/patients/patientsSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PatientState {
  selectedPatientId: number | null;
}

const initialState: PatientState = {
  selectedPatientId: null,
};

export const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setSelectedPatientId: (state, action: PayloadAction<number | null>) => {
      state.selectedPatientId = action.payload;
    },
  },
});

export const { setSelectedPatientId } = patientsSlice.actions;

export default patientsSlice.reducer;
