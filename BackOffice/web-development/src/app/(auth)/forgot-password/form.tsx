'use client'


import React, {useState} from "react";
import {resetPassword} from './_action'
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import {BasicAlert} from "@/src/components/data-display/alerts/basic";


export const ForgotPasswordForm = () => {

    const [error, setError] = useState<string>('')
    const [email, setEmail] = useState('')
    const submit = async (e: React.FormEvent) => {
        e.preventDefault()

        const error = await resetPassword({email: email})
        if (error)
            setError(error.error)
    }

    return (
        <>
            <Box component='form' onSubmit={submit} noValidate sx={{
                paddingX: 2,
                paddingY: 1,
                color: 'rgb(57,55,55)'
            }}>
                <Stack spacing={2}>
                    <Typography component="h1" variant="h5">
                        Reset password
                    </Typography>

                    <Typography component="h1" variant="body2">
                        Enter your email address to get instructions for resetting your password.
                    </Typography>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        autoFocus
                    />
                    {error && <BasicAlert sx={{mb: 1}}>{error}</BasicAlert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 1, mb: 2}}
                    >
                        Reset Password
                    </Button>
                </Stack>
            </Box>
        </>
    )
}