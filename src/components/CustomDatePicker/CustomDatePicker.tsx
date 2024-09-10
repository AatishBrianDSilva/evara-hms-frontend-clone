import React, { forwardRef } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, SxProps } from "@mui/material";
import { DateView } from "@mui/x-date-pickers";

interface DatePickerProps {
  name?: string;
  label?: string;
  format?: string;
  value?: null | Date;
  onChange?: (newValue: Date | null) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  minDate?: Date;
  maxDate?: Date;
  sx?: SxProps;
  fullWidth?: boolean;
  views?: readonly DateView[] | undefined;
}

const CustomDatePicker = forwardRef<any, DatePickerProps>(
  (
    {
      name,
      label,
      format = "dd/MM/yyyy",
      value,
      onChange,
      error = false,
      helperText = "",
      minDate,
      maxDate,
      fullWidth = true,
      sx,
      views,
    },
    ref
  ) => (
    <DatePicker
      name={name}
      timezone="Asia/Kolkata"
      ref={ref}
      label={label}
      value={value}
      views={views}
      onChange={onChange}
      format={format}
      minDate={minDate}
      maxDate={maxDate}
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
  )
);

export default CustomDatePicker;
