import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editInvestigationOpen: { id: "", status: false },
};

export const investigationSlice = createSlice({
  name: "investigation",
  initialState,
  reducers: {
    openEditInvestigation: (state, action) => {
      state.editInvestigationOpen = action.payload;
    },
    closeEditInvestigation: (state) => {
      state.editInvestigationOpen = { id: "", status: false };
    },
  },
});

export const { openEditInvestigation, closeEditInvestigation } =
  investigationSlice.actions;

export default investigationSlice.reducer;
