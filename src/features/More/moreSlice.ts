// moreSlice.js or moreSlice.ts if you're using TypeScript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MoreState {
  isMoreModalOpen: boolean;
  modalType: string | null; // Add a field to store the type or any identifier
}

const initialState: MoreState = {
  isMoreModalOpen: false,
  modalType: null,
};

export const moreSlice = createSlice({
  name: "more",
  initialState,
  reducers: {
    openMoreModal: (state, action: PayloadAction<string>) => {
      state.isMoreModalOpen = true;
      state.modalType = action.payload; // Use the payload to set the type
    },
    closeMoreModal: (state) => {
      state.isMoreModalOpen = false;
      state.modalType = null; // Reset the type when modal is closed
    },
  },
});

export const { openMoreModal, closeMoreModal } = moreSlice.actions;

export default moreSlice.reducer;
