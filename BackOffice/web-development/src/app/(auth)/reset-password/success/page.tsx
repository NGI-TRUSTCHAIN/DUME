'use client'

import {Box, Button, Stack, Typography} from "@mui/material";
import Link from "next/link";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation";

export default function Page() {
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            router.push('/login') // Redirect to login page
        }, 1000)
    })

    return (
        <>
            <Box sx={{
                paddingX: 2,
                paddingY: 1,
                color: 'rgb(57,55,55)'
            }}>
                <Stack spacing={1}>
                    <Typography component="h1" variant="h5">
                         Reset Password
                    </Typography>

                    <Typography component="h1" variant="body2">
                        Your password has been updated.
                    </Typography>

                    <Typography component="h1" variant="body2">
                        You will now be redirected to the login page where you can login again.
                    </Typography>

                    {/*<Link href={'/login'}>*/}
                    {/*    <Button*/}
                    {/*        fullWidth*/}
                    {/*        variant="contained"*/}
                    {/*        sx={{mt: 1, mb: 2}}*/}
                    {/*    >*/}
                    {/*        Return to Login*/}
                    {/*    </Button>*/}
                    {/*</Link>*/}
                </Stack>
            </Box>
        </>
    )
}