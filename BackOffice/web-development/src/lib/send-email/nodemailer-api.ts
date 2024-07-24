"use strict";


import nodemailer from "nodemailer";
import {emailVerificationType} from "@/src/lib/send-email/types";
import { TokenQueries } from "@/src/prisma/services/token";
import { readFile } from "fs/promises";
import path from "node:path";

const hostEmail = process.env.HOST_EMAIL || ''
const userEmail = process.env.USER_EMAIL || ''
const userPassword = process.env.USER_PASSWORD || ''
const dns = process.env.PUBLIC_URL || ''

const transporter = nodemailer.createTransport({
    host: hostEmail,
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `users` and `pass` values from <https://forwardemail.net>
        user: userEmail,
        pass: userPassword,
    },
});

export async function sendVerificationEmail(user: emailVerificationType, url: string) {

    let htmlFilename = 'account_activated.html'
    let subjectMessage = "Please Activate Your Account"
    if (url == 'reset-password') {
        htmlFilename = 'change_password.html';
        subjectMessage = "Please Change Password"
    }

    let htmlTemplate = await readFile(path.join(process.cwd(),`src/styles/email-templates/${htmlFilename}`), 'utf8');
    // Replace placeholders with actual user data
    htmlTemplate = htmlTemplate.replace('Hello Joana,', `Hello ${user.name ?? user.email},`);
    htmlTemplate = htmlTemplate.replace('https://theiabo.logimade.com/activate-account/877da703db6c4cdaa66c7ba68b429b3c5f4282cc1e8e4eb490bf673e2a33224a', `${dns}/${url}/${user.token}`);

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"TheiaVision 🎆" <${userEmail}>`, // sender address
        to: user.email, // list of receivers
        subject: subjectMessage, // Subject line
        html:  htmlTemplate,

    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
}



