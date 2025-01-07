import React, { useMemo, useEffect, useRef } from 'react';
import { getIn } from 'formik'; // Helps safely read nested values
import FieldAutocomplete from '../FieldAutoComplete/FieldAutoComplete';
import { useGetDoctorsQuery } from '../../services/doctorsApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { EUserRole } from '../../types/masterDashboard/global';
import { DoctorSpeciality } from '../../types/masterDashboard/global';

interface IDoctorPickerProps {
  formState: any; // your Formik form instance
  fieldName: string; // full field path, e.g. "fields[0].doctor" or just "doctor"
  label?: string;
  error?: boolean;
  helperText?: string;
  speciality?: DoctorSpeciality;
  /** Auto-select the logged-in doctor exactly once if true. */
  autoSelectIfDoctor?: boolean;
}

const DoctorPicker: React.FC<IDoctorPickerProps> = ({
  formState,
  fieldName,
  label = 'Doctor',
  error,
  helperText,
  speciality,
  autoSelectIfDoctor = false,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);

  // 1. Fetch all doctors
  const {
    data: DoctorsData,
    isLoading: doctorsLoading,
    isFetching: doctorsFetching,
  } = useGetDoctorsQuery({});
  const allDoctors = DoctorsData?.data?.records || [];

  // 2. Filter by speciality if provided
  const doctors = useMemo(() => {
    if (!speciality) return allDoctors;
    return allDoctors.filter(doc => doc.speciality === speciality);
  }, [allDoctors, speciality]);

  // 3. Check if user is a doctor/embryologist and find their doc record
  const isDoctor =
    user?.role === EUserRole.Doctor || user?.role === EUserRole.Embryologist;

  const loggedInDoctor = useMemo(() => {
    if (!isDoctor) return null;
    return doctors.find(doc => doc.userId === user?.id);
  }, [isDoctor, user?.id, doctors]);

  // 4. Current value from Formik
  //    Using getIn() from formik to safely read nested keys (like fields[0].doctor).
  const currentValue = getIn(formState.values, fieldName) || null;

  // 5. Use a ref so we only auto-select *once*
  const hasAutoSelectedRef = useRef(false);

  // 6. If autoSelectIfDoctor, pick the logged-in doc exactly once if not set
  useEffect(() => {
    if (
      autoSelectIfDoctor &&
      !hasAutoSelectedRef.current &&
      isDoctor &&
      loggedInDoctor &&
      !currentValue // only if the current field is empty/null
    ) {
      formState.setFieldValue(fieldName, loggedInDoctor);
      hasAutoSelectedRef.current = true;
    }
  }, [
    autoSelectIfDoctor,
    isDoctor,
    loggedInDoctor,
    currentValue,
    fieldName,
    formState,
  ]);

  // 7. Handle user picks from dropdown
  const handleChange = (newValue: any) => {
    formState.setFieldValue(fieldName, newValue);
  };

  return (
    <FieldAutocomplete
      options={doctors}
      getOptionLabel={option => `${option.firstName} ${option.lastName}`}
      isOptionEqualToValue={(option, value) => option._id === value?._id}
      groupBy={option => option.speciality}
      value={currentValue}
      onChange={handleChange}
      label={label}
      loading={doctorsLoading || doctorsFetching}
      error={error}
      helperText={helperText}
    />
  );
};

export default DoctorPicker;
