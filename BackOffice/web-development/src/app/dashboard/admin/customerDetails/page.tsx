import {Avatar, Box, Chip, Container, Stack, SvgIcon, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {PlusIcon} from "@heroicons/react/24/outline";
import React from "react";
import {PencilIcon} from "@heroicons/react/24/solid";
import TabAPI from "@/components/Tabs/TabWithAPI";
import {DetailsTab, InvoicesTab, LogsTab} from "@/app/dashboard/sections/customers-page/details-page";



const tabs = [
    { value: '1', label: 'Details', content: <DetailsTab/> },
    { value: '2', label: 'Invoices', content:  <InvoicesTab/> },
    { value: '3', label: 'Logs', content: <LogsTab/> },
];

export default function Page(){

    return (
        <>

                <Box component="main"
                     sx={{
                         flexGrow: 1,
                         py: 8
                     }}>
                    <Container maxWidth="xl">
                        <Stack spacing={3} mt={8}>
                            <Stack direction="row" justifyContent="space-between" spacing={4} >
                                <Stack direction="row" alignItems={'center'} spacing={1}>
                                    <Avatar
                                        src={'/assets/avatars/avatar-carson-darrin.png'}
                                        sx={{width: 84, height: 84}}
                                    />
                                    <Stack spacing={1}>
                                        <Typography noWrap variant="h4">miron.vitold@devias.io</Typography>
                                        <Stack direction="row" spacing={1} alignItems={'center'}>
                                            <Typography noWrap variant="h6">user_id: </Typography>
                                            <Chip label="abcgkhjkh56565" />
                                        </Stack>
                                    </Stack>

                                </Stack>
                                <div>
                                    <Button color="inherit" startIcon={(
                                        <SvgIcon fontSize="small">
                                            <PencilIcon/>
                                        </SvgIcon>
                                    )}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        endIcon={(
                                            <SvgIcon fontSize="small">
                                                <PlusIcon/>
                                            </SvgIcon>
                                        )}
                                        variant="contained"
                                    >
                                        Actions
                                    </Button>
                                </div>
                            </Stack>
                            <TabAPI tabs={tabs}/>
                        </Stack>
                    </Container>
                </Box>

        </>

    )
}

