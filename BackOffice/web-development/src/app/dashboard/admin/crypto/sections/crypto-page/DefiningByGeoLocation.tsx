import {Box, MenuItem, Stack, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";

const currencies = [
    {
        value: 'Mad',
        label: 'Madeira',
    },
    {
        value: 'Lis',
        label: 'Lisboa',
    }
];
export const DefiningByGeoLocation = () => {

    return (
        <Stack justifyContent="center" alignItems="center" spacing={2}>
            <Typography component={'h6'} variant='subtitle1'>
                Formula = X + Y * 10
            </Typography>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': {m: 1, width: '25ch'},
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Select Region"
                    defaultValue="Mad"
                    helperText="Please select your category"
                >
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    id="outlined-number"
                    label="Y -> Number"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Button fullWidth variant="contained">Change Formula</Button>
        </Stack>

    )
}