import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editPackageOpen: { id: "", status: false },
};

export const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    openEditPackage: (state, action) => {
      state.editPackageOpen = action.payload;
    },
    closeEditPackage: (state) => {
      state.editPackageOpen = { id: "", status: false };
    },
  },
});

export const { openEditPackage, closeEditPackage } = packageSlice.actions;

export default packageSlice.reducer;
