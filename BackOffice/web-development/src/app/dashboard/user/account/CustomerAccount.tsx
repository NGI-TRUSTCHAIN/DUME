
import {Box, Container, Stack, Typography} from "@mui/material"
import React from "react";
import TabAPI from "@/components/Tabs/TabWithAPI";
import {GeneralAccount } from "./GeneralAccount";
import {TeamAccount} from "@/app/dashboard/users/account/TeamAccount";
import { NotificationsAccount } from "./NotificationsAccount";
import {SecurityAccount} from "@/app/dashboard/users/account/SecurityAccount";
import { BillingAccount } from "./BillingAccount";



const tabs = [
    { value: '1', label: 'General', content: <GeneralAccount/> },
    { value: '2', label: 'Billing', content:  <BillingAccount/> },
    { value: '3', label: 'Team', content: <TeamAccount/> },
    { value: '4', label: 'Notifications', content: <NotificationsAccount/> },
    { value: '5', label: 'Security', content: <SecurityAccount/> },
];


const CustomerAccount = () => {

    return (
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

export default CustomerAccount