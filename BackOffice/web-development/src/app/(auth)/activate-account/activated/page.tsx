'use client'

import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

export default function Page() {

    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime === 1) {
                    clearInterval(timerId);
                    localStorage.setItem('emailVerified', 'true');
                    if (window.opener) {
                        window.close();
                    }
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, []);


    return (
        <Box sx={{
            paddingX: 2,
            paddingY: 2,
            color: 'rgb(57,55,55)',
        }}>
            <Typography variant="h5" gutterBottom align={'center'}>
                Email Verification
            </Typography>
            <Typography variant="body1" gutterBottom align={'justify'}>
                Your email has been verified. This page will close in {timeLeft} seconds.
            </Typography>
            <Typography variant="body1" gutterBottom align={'justify'}>
                If the page does not close automatically, please close it manually.
            </Typography>
            <CircularProgress/>
        </Box>
    );
}
