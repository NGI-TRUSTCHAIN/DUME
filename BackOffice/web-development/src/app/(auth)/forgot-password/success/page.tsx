import {Box, Button, Stack, Typography} from "@mui/material";
import Link from "next/link";
import React from "react";

export default function Page() {

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
                        {"If the email doesn't show up, check your spam folder."}
                    </Typography>

                    <Link href={'/login'}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{mt: 1, mb: 2}}
                        >
                            Return to Login
                        </Button>
                    </Link>
                </Stack>
            </Box>
        </>
    )
}