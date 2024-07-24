import {Box, MenuItem, Stack, TextField, Typography} from "@mui/material";
import React from "react";
import Button from "@mui/material/Button";

const currencies = [
    {
        value: 'Card',
        label: 'CardBoard',
    },
    {
        value: 'Graf',
        label: 'Graffiti',
    }
];

export const DefiningByEvent = () => {

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
                    label="Select Category"
                    defaultValue="Card"
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