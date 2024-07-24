'use server'

import formData from 'form-data';
import Mailgun from 'mailgun.js';

import {redirect} from "next/navigation";
import UserQueries, {IUserEmailCredential} from "@/src/prisma/services/user";
import { PasswordTokenQueries } from '@/src/prisma/services/password-token';


const API_KEY = process.env.MAILGUN_API_KEY || ''
const DOMAIN = process.env.MAILGUN_DOMAIN || ''

const mailgun = new Mailgun(formData)
const client = mailgun.client({ username: 'api', key: API_KEY })


export async function resetPassword(email:IUserEmailCredential) {


    if (!email.email) {
        return {
            error: 'Invalid email',
        }
    }


    const user =  await new UserQueries().findUser(email)

    if (!user) {
        return {
            error: 'This email is not registered',
        }
    }

    const token = await new PasswordTokenQueries().createToken(user.id)

    const messageData = {
        from: `Password Reset <security@${DOMAIN}>`,
        to: user.email,
        subject: 'Reset Password Request',
        text: `Hello ${user.name}, someone (hopefully you) requested a password reset for this account. If you did want to reset your password, please click here: http://localhost:3000/reset-password/${token.token}
        
For security reasons, this link is only valid for four hours.

If you did not request this reset, please ignore this email.`,
    }

    await client.messages.create(DOMAIN, messageData)
    
    redirect('/forgot-password/success')
}
