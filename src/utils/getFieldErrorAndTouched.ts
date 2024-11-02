import { FormikTouched, FormikErrors } from 'formik';

interface FieldState<T> {
  touched: FormikTouched<T>[];
  errors: FormikErrors<T>[];
}

interface FieldErrorAndTouched {
  isError: boolean;
  errorMessage?: string;
}

function getFieldErrorAndTouched<T>(
  fieldState: FieldState<T>,
  index: number,
  fieldName: keyof T,
): FieldErrorAndTouched {
  const { touched, errors } = fieldState;

  const isFieldTouched = touched?.[index]?.[fieldName] as boolean;
  const fieldError = errors?.[index]?.[fieldName] as string | undefined;

  return {
    isError: Boolean(isFieldTouched && fieldError),
    errorMessage: typeof fieldError === 'string' ? fieldError : undefined,
  };
}

export default getFieldErrorAndTouched;
