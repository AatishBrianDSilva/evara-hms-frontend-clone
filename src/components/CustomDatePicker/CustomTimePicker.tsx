import React, { forwardRef } from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TextField, SxProps } from '@mui/material';
import { TimeView } from '@mui/x-date-pickers';

interface TimePickerProps {
  name?: string;
  label: string;
  format?: string;
  disabled?: boolean;
  value?: null | Date;
  onChange?: (newValue: any) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  minTime?: Date;
  sx?: SxProps;
  fullWidth?: boolean;
  views?: readonly TimeView[] | undefined;
}

const CustomTimePicker = forwardRef<any, TimePickerProps>(
  (
    {
      name,
      label,
      disabled = false,
      format = 'HH:mm',
      value,
      onChange,
      error = false,
      helperText = '',
      fullWidth = true,
      sx,
      views,
    },
    ref,
  ) => (
    <TimePicker
      ref={ref}
      name={name}
      label={label}
      value={value}
      views={views}
      disabled={disabled}
      onChange={onChange}
      format={format}
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

export default CustomTimePicker;
