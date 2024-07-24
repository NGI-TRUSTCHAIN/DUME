'use client'

import React, {useState} from "react";
import {Box, Button, Checkbox, FormControlLabel, TextField} from "@mui/material";
import {useRouter, useSearchParams} from "next/navigation";
import {signIn} from "next-auth/react";
import {BasicAlert} from "@/src/components/data-display/alerts/basic";


export const LoginForm = () => {

    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/admin/packageReport'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
                callbackUrl
            })
            console.log('Res', res)
            if (!res?.error) {
                router.push(callbackUrl)
            } else {
                setError('Invalid email or forgot-password')
            }
        } catch (err: any) {}
    }

    return (
        <Box component="form" onSubmit={onSubmit} noValidate sx={{mt: 1}}>
            {error && <BasicAlert sx={{marginBottom:1}}>{error}</BasicAlert>}
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
            <FormControlLabel
                control={<Checkbox value="remember" color="primary"/>}
                label="Remember me"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 1, mb: 2}}
            >
                Sign In
            </Button>
        </Box>
    )
}