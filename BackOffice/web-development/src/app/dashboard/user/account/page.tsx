"use client"

import {Box, Container, Stack, Typography} from "@mui/material";
import TabAPI from "@/components/Tabs/TabWithAPI";
import React from "react";
import {GeneralAccount} from "./GeneralAccount";
import { BillingAccount } from "./BillingAccount";
import { TeamAccount } from "./TeamAccount";
import {NotificationsAccount} from "./NotificationsAccount";
import {SecurityAccount} from "./SecurityAccount";

const tabs = [
    { value: '1', label: 'General', content: <GeneralAccount/> },
    { value: '2', label: 'Billing', content:  <BillingAccount/> },
    { value: '3', label: 'Team', content: <TeamAccount/> },
    { value: '4', label: 'Notifications', content: <NotificationsAccount/> },
    { value: '5', label: 'Security', content: <SecurityAccount/> },
];

export default function Page() {

    return(
        <>
            <Box component="main"
                 sx={{
                     flexGrow: 1,
                     py: 8
                 }}>
                <Container maxWidth="xl">
                    <Stack spacing={1} mb={3}>
                        <Typography component={'h4'} variant="h4">Account</Typography>
                        <TabAPI tabs={tabs}/>
                    </Stack>
                </Container>
            </Box>
        </>
    )
}