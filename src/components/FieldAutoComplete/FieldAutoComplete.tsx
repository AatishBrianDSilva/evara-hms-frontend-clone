import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { memo, useMemo } from 'react';

// Extended component props to include error, helperText, and showNone
const FieldAutocomplete = memo(
  ({
    fullWidth = false,
    options,
    getOptionLabel,
    getOptionDisabled,
    isOptionEqualToValue,
    getOptionKey,
    groupBy,
    value,
    onChange,
    filterOptions,
    label,
    loading = false,
    error = false,
    helperText = '',
    multiple = false,
    disabled = false,
    showNone = false, // New prop to add "None" option
    noneType,
  }: {
    options: any[];
    getOptionLabel: (option: any) => string;
    getOptionKey?: (option: any) => string;
    getOptionDisabled?: (option: any) => boolean;
    isOptionEqualToValue: (option: any, value: any) => boolean;
    groupBy?: (option: any) => string;
    value: any;
    onChange: (newValue: any) => void;
    filterOptions?: (options: any[], state: any) => any[];
    label: string;
    loading?: boolean;
    error?: boolean; // Marking error as optional
    helperText?: React.ReactNode; // Marking helperText as optional
    multiple?: boolean;
    disabled?: boolean;
    showNone?: boolean; // New prop to add "None" option
    noneType?: any;
    fullWidth?: boolean;
  }) => {
    const sortedOptions = useMemo(() => {
      let updatedOptions = [...options];

      if (showNone) {
        updatedOptions.unshift(noneType);
      }

      if (groupBy) {
        return updatedOptions.sort((a, b) => {
          const groupA = groupBy(a);
          const groupB = groupBy(b);
          return groupA.localeCompare(groupB);
        });
      }

      return updatedOptions;
    }, [options, groupBy, showNone]);

    return (
      <Autocomplete
        disabled={disabled}
        multiple={multiple}
        fullWidth={fullWidth}
        filterSelectedOptions
        filterOptions={filterOptions}
        getOptionKey={getOptionKey}
        options={sortedOptions}
        getOptionLabel={getOptionLabel}
        getOptionDisabled={getOptionDisabled}
        isOptionEqualToValue={isOptionEqualToValue}
        groupBy={groupBy}
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        renderInput={params => (
          <TextField
            {...params}
            fullWidth
            label={label}
            error={error}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        loading={loading}
        loadingText="Loading..."
      />
    );
  },
);

export default FieldAutocomplete;
