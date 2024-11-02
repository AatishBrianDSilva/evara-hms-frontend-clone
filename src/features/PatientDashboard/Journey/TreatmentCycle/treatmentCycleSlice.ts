import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editTreatmentCycleOpen: { id: '', status: false },
};

export const treatmentCycleSlice = createSlice({
  name: 'treatmentCycle',
  initialState,
  reducers: {
    openEditTreatmentCycle: (state, action) => {
      state.editTreatmentCycleOpen = action.payload;
    },
    closeEditTreatmentCycle: state => {
      state.editTreatmentCycleOpen = { id: '', status: false };
    },
  },
});

export const { openEditTreatmentCycle, closeEditTreatmentCycle } =
  treatmentCycleSlice.actions;

export default treatmentCycleSlice.reducer;
