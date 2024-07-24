'use client'

import {Card, CardContent, Divider, Stack, Switch, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React from "react";

const label = {inputProps: {'aria-label': 'Switch demo'}};

export const NotificationsAccount = () => {

    return (
        <Card>
            <CardContent>
                <Grid container spacing={3} mb={3}>
                    <Grid xs={12} md={4}>
                        <Typography component={'h6'} variant="h6">Email</Typography>
                    </Grid>

                    <Grid xs={12} md={8}>
                        <Stack
                            divider={<Divider orientation="horizontal" flexItem/>}
                            spacing={2} justifyContent="flex-end"
                        >
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={1}
                            >
                                <Stack spacing={1}>
                                    <Typography component={'h6'} variant="subtitle1">Product updates</Typography>
                                    <Typography component={'p'} variant="body2">News, announcements, and product updates.
                                    </Typography>
                                </Stack>
                                <div>
                                    <Switch {...label} defaultChecked/>
                                </div>
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={1}
                            >
                                <Stack spacing={1}>
                                    <Typography component={'h6'} variant="subtitle1">Security updates</Typography>
                                    <Typography component={'p'} variant="body2">Important notifications about
                                        your account security.</Typography>
                                </Stack>
                                <div>
                                    <Switch {...label} />
                                </div>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider/>

                <Grid container spacing={3} mt={3}>
                    <Grid xs={12} md={4}>
                        <Typography component={'h6'} variant="h6">Phone notifications</Typography>
                    </Grid>

                    <Grid xs={12} md={8}>
                        <Stack
                            divider={<Divider orientation="horizontal" flexItem/>}
                            spacing={2} justifyContent="flex-end"
                        >
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={1}
                            >
                                <Stack spacing={1}>
                                    <Typography component={'h6'} variant="subtitle1">Security updates</Typography>
                                    <Typography component={'p'} variant="body2">Important notifications about
                                        your account security.</Typography>
                                </Stack>
                                <div>
                                    <Switch {...label} defaultChecked/>
                                </div>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

            </CardContent>
        </Card>
    )
}