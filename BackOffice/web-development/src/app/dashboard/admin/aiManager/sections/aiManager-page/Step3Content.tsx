import {Box, TextField} from "@mui/material";
import React from "react";


export const Step3Content = () => {
    return(
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField
                    required
                    id="outlined-required"
                    label="Epochs"
                    defaultValue="x"
                />

                <TextField
                    required
                    id="outlined-required"
                    label="Learning Rate"
                    defaultValue="x"
                />

            </div>
        </Box>
    )
}

