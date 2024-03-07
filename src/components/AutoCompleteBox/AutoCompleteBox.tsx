import React, { useState } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';

interface CustomAutocompleteProps {
    options: any[];
    value: any;
    onChange: (event: any, newValue: any) => void;
    label?: string;
    multiple?: boolean;
}

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({ options, value, onChange, label, multiple }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value.toString());
    };

    const handleAddNewClick = () => {
        if (typeof inputValue === 'string' && inputValue.trim() !== '') {
            const newValue = multiple ? [...value, inputValue] : inputValue;
            onChange(null, newValue);
            setInputValue('');
        }
    };

    return (
        <Autocomplete
            multiple={multiple || false}
            options={options}
            value={value}
            fullWidth
            onChange={onChange}
            inputValue={inputValue}
            onInputChange={(e, _) => {
                handleInputChange(e);
            }}
            disableClearable={true} // hidden as it causes trim error while removing all the tags
            renderInput={(params) => (
                <>
                    <TextField {...params} label={label} />
                </>
            )}
            noOptionsText={
                <Button variant="outlined" color="primary" onClick={handleAddNewClick} disabled={inputValue.trim() === ''}>
                    Add New
                </Button>
            }
        />
    );
};

export default CustomAutocomplete;
