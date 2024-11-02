import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editCryoPreservationOpen: { id: '', status: false },
};

export const cryoPreservationSlice = createSlice({
  name: 'cryoPreservation',
  initialState,
  reducers: {
    openEditCryoPreservation: (state, action) => {
      state.editCryoPreservationOpen = action.payload;
    },
    closeEditCryoPreservation: state => {
      state.editCryoPreservationOpen = { id: '', status: false };
    },
  },
});

export const { openEditCryoPreservation, closeEditCryoPreservation } =
  cryoPreservationSlice.actions;

export default cryoPreservationSlice.reducer;
