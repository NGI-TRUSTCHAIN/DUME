import {Box, TextField} from "@mui/material";
import React from "react";

const currencies = [
    {
        value: 1,
        label: 'Model x',
    },
    {
        value: 2,
        label: 'Model y',
    },
    {
        value: 3,
        label: 'Model z',
    }
]
export const Step1Content = () => {
    return(
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { mb: 2, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            alignContent='center'
        >

            <TextField
                id="outlined-select-currency-native"
                label='Select Model'
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
        </Box>
    )
}