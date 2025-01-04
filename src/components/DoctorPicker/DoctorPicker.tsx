import React, { useMemo, useEffect } from 'react';
import FieldAutocomplete from '../FieldAutoComplete/FieldAutoComplete';
import { useGetDoctorsQuery } from '../../services/doctorsApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { EUserRole } from '../../types/masterDashboard/global';
import { DoctorSpeciality } from '../../types/masterDashboard/global';

interface IDoctorPickerProps {
  // Formik form references
  formState: any; // e.g. createForm
  formIndex: number; // e.g. "index"
  fieldName: string; // e.g. `fields.${index}.doctor`
  label?: string; // e.g. "Doctor"
  error?: boolean;
  helperText?: string | undefined;

  /** If provided, only doctors matching this speciality are displayed. */
  speciality?: DoctorSpeciality;

  /** If true, and the logged in user is a doctor, automatically select them. */
  autoSelectIfDoctor?: boolean;
}

const DoctorPicker: React.FC<IDoctorPickerProps> = ({
  formState,
  formIndex,
  fieldName,
  label = 'Doctor',
  error,
  helperText,
  speciality,
  autoSelectIfDoctor = false,
}) => {
  // 1. Grab the logged-in user
  const user = useSelector((state: RootState) => state.auth.user);

  // 2. Fetch all doctors
  const {
    data: DoctorsData,
    isLoading: doctorsLoading,
    isFetching: doctorsFetching,
  } = useGetDoctorsQuery({});
  const allDoctors = DoctorsData?.data?.records || [];

  // 3. Filter doctors by speciality if speciality prop is provided
  const doctors = useMemo(() => {
    if (!speciality) {
      return allDoctors;
    }
    return allDoctors.filter(doc => doc.speciality === speciality);
  }, [allDoctors, speciality]);

  // 4. Check if user is a doctor and find their matching doctor document
  const isDoctor =
    user?.role === EUserRole.Doctor || user?.role === EUserRole.Embryologist;
  const loggedInDoctor = useMemo(() => {
    if (!isDoctor) return null;
    // Adjust doc.userId vs doc._id vs doc.id depending on your schema
    return doctors.find(doc => doc.userId === user?.id);
  }, [user, doctors, isDoctor]);

  // 5. Current value from the form
  const currentValue = formState.values?.fields?.[formIndex]?.doctor;

  // 6. If autoSelectIfDoctor is true, and the user is a doctor, auto-select them
  useEffect(() => {
    if (autoSelectIfDoctor && isDoctor && loggedInDoctor) {
      formState.setFieldValue(fieldName, loggedInDoctor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSelectIfDoctor, isDoctor, loggedInDoctor]);

  // 7. Render the FieldAutocomplete
  return (
    <FieldAutocomplete
      options={doctors}
      getOptionLabel={option => `${option.firstName} ${option.lastName}`}
      isOptionEqualToValue={(option, value) => option._id === value?._id}
      groupBy={option => option.speciality}
      value={currentValue || null}
      onChange={newValue => formState.setFieldValue(fieldName, newValue)}
      label={label}
      loading={doctorsLoading || doctorsFetching}
      error={error}
      helperText={helperText}
    />
  );
};

export default DoctorPicker;
