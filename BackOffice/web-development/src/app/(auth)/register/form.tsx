'use client'

import React, {useState} from "react";
import {Box, Button, TextField} from "@mui/material";
import {IUserCredentials} from "@/src/prisma/services/user";
import {BasicAlert} from "@/src/components/data-display/alerts/basic";



type Props = {
    action: Function
}
export const RegisterForm = (props: Props) => {

    const  {action} = props

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    // register users in prisma db without email verification through register api
    const onSubmitAPI = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // const res = await fetch('/api/register', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         email,
            //         password
            //     }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // })

            // const res = trpc.healthchecker.useQuery()
            // console.log(res)
            // if (res.ok) {
            //     await signIn()
            // } else {
            //     setError((await res.json()).error)
            // }
        } catch (error: any) {
            setError(error?.message)
        }
    }

    const testSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()
        // alert(`Form Submitted with email:${email} and pass:${password}`);
        // console.log("a", email)
        const credentials: IUserCredentials = {
            email: email,
            password: password
        }
        // console.log(credentials)
        action(credentials)
    }


    return (
        <Box component="form" onSubmit={testSubmit} noValidate sx={{mt: 1}}>
            {error && <BasicAlert sx={{}}>{error}</BasicAlert>}
            <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                id="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 1, mb: 2}}
            >
                Create Account
            </Button>

            {/*<LoginForm/>*/}
        </Box>
    )
}