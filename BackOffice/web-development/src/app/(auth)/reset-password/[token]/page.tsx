'use client'

import React, {useState} from "react";
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import {resetPassword} from "./_actions";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Link from "next/link";
import {BasicAlert} from "@/src/components/data-display/alerts/basic";


export interface IUserResetPassword {
    password: string,
    confirmPassword?: string
}

export default function Page({params}: { params: { token: string } }) {


    const [error, setError] = useState<string>('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const submit = async (e: React.FormEvent) => {

        e.preventDefault()

        const data: IUserResetPassword = {
            password: password,
            confirmPassword: confirmPassword
        }

        const error = await resetPassword(params.token, data)
        if (error)
            setError(error.error || '')
    }

    return (
        <Box component='form' onSubmit={submit} noValidate sx={{
            paddingX: 2,
            paddingY: 1,
            color: 'rgb(57,55,55)'
        }}>
            {error && <BasicAlert sx={{mb: 1}}>{error}</BasicAlert>}

            <Stack spacing={2}>
                <Typography component="h1" variant="h5">
                    Choose new password
                </Typography>

                <Typography component="h1" variant="body2">
                    You can reset your password here
                </Typography>

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 1}}
                >
                    Reset Password
                </Button>

                <Link href={'/login'}>
                    <Button
                        variant="text"
                        sx={{color: '#000'}}
                        startIcon={<KeyboardArrowLeftIcon/>}
                    >
                        Return to Login
                    </Button>
                </Link>
            </Stack>
        </Box>
    )
}