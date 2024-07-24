import {Box, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import React from "react";
import EuroIcon from '@mui/icons-material/Euro';
import Button from "@mui/material/Button";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const DefiningByImage = () => {

    return (
        <Stack justifyContent="center" alignItems="center" spacing={2}>
            <Typography component={'h6'} variant='subtitle1'>
                Formula = X + Y * 10
            </Typography>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="outlined"
                    label="X -> Image Value"
                    defaultValue="Hello World"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EuroIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    id="outlined"
                    label="Y -> Time"
                    defaultValue="Hello World"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccessTimeIcon/>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <Button fullWidth variant="contained">Change Formula</Button>

        </Stack>
    )
}