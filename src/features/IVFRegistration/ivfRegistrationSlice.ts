import { createSlice } from "@reduxjs/toolkit";

interface IVFRegistrationState {}

const initialState: IVFRegistrationState = {};

export const ivfRegistrationSlice = createSlice({
  name: "ivfRegistration",
  initialState: initialState,
  reducers: {},
});

// export const { resetRegistrationState } = ivfRegistrationSlice.actions;
export default ivfRegistrationSlice.reducer;
