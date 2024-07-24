import {Box, TextField} from "@mui/material";
import React from "react";

const currencies = [
    {
        value: 1,
        label: 'Folder x',
    },
    {
        value: 2,
        label: 'Folder y',
    },
    {
        value: 3,
        label: 'Folder z',
    }
]
export const Step2Content = () => {
    return(
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { mb: 2, width: '15ch' },
            }}
            noValidate
            autoComplete="off"
            alignContent='center'
        >
            <div>
                <TextField
                    id="outlined-select-currency-native"
                    label='Select Train Folder'
                    select
                    defaultValue={1}
                    SelectProps={{
                        native: true,
                    }}
                >
                    {currencies.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
                <TextField
                    id="outlined-select-currency-native"
                    label='Select Test Folder'
                    select
                    defaultValue={1}
                    SelectProps={{
                        native: true,
                    }}
                >
                    {currencies.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
                <TextField
                    id="outlined-select-currency-native"
                    label='Select Validation Folder'
                    select
                    defaultValue={1}
                    SelectProps={{
                        native: true,
                    }}
                >
                    {currencies.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
            </div>

        </Box>
    )
}