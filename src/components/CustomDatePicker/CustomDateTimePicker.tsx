import React, { forwardRef } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField, SxProps } from '@mui/material';
import { DateOrTimeView } from '@mui/x-date-pickers';

interface DateTimePickerProps {
  name?: string;
  label: string;
  format?: string;
  value?: null | Date;
  onChange?: (newValue: Date | null) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  minDate?: Date;
  minTime?: Date;
  sx?: SxProps;
  fullWidth?: boolean;
  views?: readonly DateOrTimeView[] | undefined;
}

const CustomDateTimePicker = forwardRef<any, DateTimePickerProps>(
  (
    {
      name,
      label,
      format = 'dd/MM/yyyy HH:mm',
      value,
      onChange,
      error = false,
      helperText = '',
      minDate,
      minTime,
      fullWidth = true,
      sx,
      views,
    },
    ref,
  ) => (
    <DateTimePicker
      ref={ref}
      name={name}
      label={label}
      value={value}
      views={views}
      onChange={onChange}
      format={format}
      minDate={minDate}
      minTime={minTime}
      slots={{ textField: TextField }}
      sx={sx}
      slotProps={{
        textField: {
          fullWidth: fullWidth,
          error,
          helperText,
        },
      }}
    />
  ),
);

export default CustomDateTimePicker;
