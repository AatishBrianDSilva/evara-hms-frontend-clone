import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editProcedureOpen: { id: "", status: false },
};

export const procedureSlice = createSlice({
  name: "procedure",
  initialState,
  reducers: {
    openEditProcedure: (state, action) => {
      state.editProcedureOpen = action.payload;
    },
    closeEditProcedure: (state) => {
      state.editProcedureOpen = { id: "", status: false };
    },
  },
});

export const { openEditProcedure, closeEditProcedure } = procedureSlice.actions;

export default procedureSlice.reducer;
