import React from "react";
import {Metadata} from "next";
import {ForgotPasswordForm} from "@/src/app/(auth)/forgot-password/form";


export const metadata: Metadata = {
    title: 'Forgot Password',
    description: 'Login in TidyCity Web App',
}

export default function Page() {

    return (
        <>
            <ForgotPasswordForm/>
        </>
    )
}