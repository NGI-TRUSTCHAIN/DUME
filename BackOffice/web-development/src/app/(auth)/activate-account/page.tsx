'use client'

import {Box, CircularProgress, Stack, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from 'next/navigation';


export default function Page() {
    const { data: session, status } = useSession();

    const [verified, setVerified] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(async () => {
            const emailVerified = localStorage.getItem('emailVerified');
            if (emailVerified === 'true') {
                setVerified(true);
                localStorage.removeItem('emailVerified');
                clearInterval(interval);
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (verified) {
            setTimeout(() => {
                router.push('/login'); // Redirect to the desired page
            }, 1000); // Wait for 1 second before redirecting
        }
    }, [verified, router]);

    if (verified) {
        return (
            <Box sx={{
                paddingX: 2,
                paddingY: 2,
                color: 'rgb(57,55,55)',
            }}>
                <Stack justifyContent="center" alignItems="center" spacing={2}>
                    <Typography variant="h5">Email Verified</Typography>
                    <Typography variant={'body1'} textAlign={'justify'}>
                        Your email has been verified successfully. Redirecting...
                    </Typography>
                    <CircularProgress color="success" />
                </Stack>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{
                paddingX: 2,
                paddingY: 2,
                color: 'rgb(57,55,55)',
            }}>
                <Stack justifyContent="center"
                       alignItems="center"
                       spacing={2}>
                   <Typography variant="h5">
                        Security Challenge
                    </Typography>

                    <Typography variant={'body1'} textAlign={'justify'}>
                        To protect the security of your account, we sent an email to {session?.user?.email || 'your email'} to activate your account, please click the link in the email to proceed.
                    </Typography>
                    <CircularProgress color="success"/>
                </Stack>
            </Box>
        </>
    )
}

