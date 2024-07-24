import {Box, Link, Stack, Typography} from "@mui/material";
import React from "react";
import {Metadata} from "next";
import {SignInForm} from "@/src/components/auth/sign-in-form";

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Login in TidyCity Web App',
}

export default function Page() {

    return (
        <>
            <Box sx={{
                paddingX: 2,
                paddingY: 2,
                color: 'rgb(57,55,55)'
            }}>
                <SignInForm/>

                {/*<Stack spacing={1}>*/}
                {/*    <Link href={"/forgot-password"} variant="body2">*/}
                {/*        Forgot password?*/}
                {/*    </Link>*/}

                {/*    <Typography component={'p'} variant={'body2'}>*/}
                {/*        {"Don't have an account?"}*/}
                {/*        <Link href={"/register"} variant="body2" sx={{ml: 1}}>*/}
                {/*            Sign Up*/}
                {/*        </Link>*/}
                {/*    </Typography>*/}
                {/*</Stack>*/}

                {/*<Divider sx={{*/}
                {/*    color: 'rgb(57,55,55)', marginY: 1, "&::before, &::after": {*/}
                {/*        border: "thin solid",*/}
                {/*    },*/}
                {/*}}>or</Divider>*/}


                {/*<Stack spacing={1} direction={'row'} justifyContent={'center'}>*/}
                {/*    /!*<GoogleSignIn sx={{width: 60, height: 60}}/>*!/*/}
                {/*    /!*<AppleSignIn sx={{width: 60, height: 60}}/>*!/*/}
                {/*</Stack>*/}

                {/*<Stack spacing={1} direction={'row'} justifyContent={'center'}>*/}
                {/*    /!*<GoogleSignIn sx={{width: 60, height: 60}}/>*!/*/}
                {/*    /!*<AppleSignIn sx={{width: 60, height: 60}}/>*!/*/}
                {/*</Stack>*/}

            </Box>

        </>
    )
}