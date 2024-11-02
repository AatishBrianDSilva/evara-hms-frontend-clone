import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDoctor } from '../../types/doctor';

interface AppointmentState {
  selectedDate: string;
  selectedTimeslot: string | null;
  selectedDoctor: IDoctor | null;
  editingAppointmentId: string | null;
}

const initialState: AppointmentState = {
  selectedDate: new Date().toISOString(),
  selectedTimeslot: null,
  selectedDoctor: null,
  editingAppointmentId: null,
};

export const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      console.log('paylaod', action.payload);
      state.selectedDate = new Date(action.payload).toISOString();
      console.log('Updated selectedDate Payload:', state.selectedDate);
    },

    setSelectedTimeslot: (state, action: PayloadAction<string | null>) => {
      state.selectedTimeslot = action.payload;
    },
    setSelectedDoctor: (state, action: PayloadAction<IDoctor | null>) => {
      state.selectedDoctor = action.payload;
    },
    setEditingAppointmentId: (state, action: PayloadAction<string | null>) => {
      state.editingAppointmentId = action.payload;
    },
    resetAppointment: state => {
      state.selectedDate = initialState.selectedDate;
      state.selectedTimeslot = initialState.selectedTimeslot;
      state.selectedDoctor = initialState.selectedDoctor;
      state.editingAppointmentId = initialState.editingAppointmentId;
    },
  },
});

export const {
  setSelectedDate,
  setSelectedTimeslot,
  setSelectedDoctor,
  resetAppointment,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
