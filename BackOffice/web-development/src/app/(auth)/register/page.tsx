import React from "react";
import {Box, Divider, IconButton, Link, Stack, Typography} from "@mui/material";
import {Metadata} from "next";
import {redirect} from "next/navigation";
import {AppleAccountIcon, GoogleAccountIcon} from "@/src/components/svg";
import {SignUpForm, Values} from "@/src/components/auth/sign-up-form";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {emailVerificationType} from "@/src/lib/send-email/types";
import {sendVerificationEmail} from "@/src/lib/send-email/nodemailer-api";

export const metadata: Metadata = {
    title: 'Register',
    description: 'Register in TidyCity Web App',
}

export default function Page() {

    async function onSubmit(values: Values) {
        'use server'

        const user = await trpcServerClient.createUser({
            email: values.email,
            password: values.password,
            name: values.firstName
        });

        if (!user) {
            throw new Error('Cannot Register this user Account');
        }

        const token = await trpcServerClient.createTokenAccount({
            id: user.id
        })

        if (!token) {
            throw new Error('Cannot Register this user Account');
        }

        const credentials: emailVerificationType = {
            email: user.email,
            name: user.name ?? 'New User',
            token: token.token
        }
        await sendVerificationEmail(credentials, 'activate-account')

        return { success: true };

    }

    return (
        <>
            <Box sx={{
                paddingX: 2,
                paddingY: 1,
                color: 'rgb(57,55,55)'
            }}>
                {/*<RegisterForm action={registerUsers}/>*/}
                <SignUpForm action={onSubmit}/>

                {/*<Stack spacing={1}>*/}
                {/*    <Typography component={'p'} variant={'body2'}>*/}
                {/*        Already have an account?*/}
                {/*        <Link href={"/login"} variant="body2" sx={{ml: 1}}>*/}
                {/*            Log in*/}
                {/*        </Link>*/}
                {/*    </Typography>*/}
                {/*</Stack>*/}

                {/*<Divider sx={{*/}
                {/*    color: 'rgb(57,55,55)', marginY: 1,*/}
                {/*    "&::before, &::after": {border: "thin solid"}*/}
                {/*}}>*/}
                {/*    or*/}
                {/*</Divider>*/}

                {/*<Stack spacing={1} direction={'row'} justifyContent={'center'}>*/}
                {/*    <IconButton sx={{width: 64, height: 64}}>*/}
                {/*        <GoogleAccountIcon/>*/}
                {/*    </IconButton>*/}

                {/*    <IconButton sx={{width: 60, height: 60}}>*/}
                {/*        <AppleAccountIcon/>*/}
                {/*    </IconButton>*/}
                {/*</Stack>*/}
            </Box>

        </>
    )
}