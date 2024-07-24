'use client'

import React from "react";
import {Avatar, Box, Stack, Typography, Button, CardHeader, CardContent, CardActions, Card} from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/system/Unstable_Grid";

import BasicTimeline from "@/components/timeline/RightTimeline";
import ImageIcon from '@mui/icons-material/Image';
import NextLink from "next/link";
import dynamic from "next/dynamic";
import Image from 'next/image'
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";

const DynamicMap = dynamic(() => import('@/components/maps/map-videos'), {
    ssr: false
});


export default function Page() {

    return (
        <>

            <Box component="main"
                 sx={{
                     flex: '1 1 auto',
                     display: 'flex'
                 }}>
                <Box sx={{flex: '0 0 400px'}}>
                    <Box padding={2}>
                        <Typography component={'h5'} variant={'h5'}>Image Details</Typography>
                    </Box>
                    <Stack component={'ul'}>
                        <Stack component={'li'} role={'button'}>
                            <Button sx={{justifyContent: 'flex-start', textAlign: 'left'}}>
                                <Avatar sx={{marginRight: 2}}/>
                                <div>
                                    <Typography component={'p'} variant={'body1'}>Video xxx</Typography>
                                    <Typography component={'p'} variant={'body2'}>Funchal,Madeira, PT</Typography>
                                    <Typography component={'p'} variant={'body2'}>Frame xxx</Typography>
                                </div>
                            </Button>
                            <Divider sx={{marginY: '16px'}}/>

                            <BasicTimeline/>
                        </Stack>
                        <Divider/>
                        <Button component={NextLink}
                                href="/dashboard/user/videoImages"
                                color="error"
                                sx={{justifyContent: 'flex-start', textAlign: 'left'}}>
                            <ImageIcon fontSize="large"/>
                            <div>
                                <Typography component={'p'} variant={'body1'}>View Images</Typography>
                            </div>
                        </Button>
                    </Stack>
                </Box>


                <Box sx={{flex: '1 1 auto', position: 'relative'}}>
                    <Box width={'100%'} height={'100%'}>
                        <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>
                            <Grid xs={12}>
                                <Card sx={{height: '100%'}}>
                                    <CardHeader
                                        action={
                                            <Button color="inherit" size="small" startIcon={<ChecklistRoundedIcon/>}>
                                                Sync
                                            </Button>
                                        }
                                        title="Path travelled"
                                    />
                                    <CardContent sx={{paddingX: 3, paddingTop: 2, paddingBottom: 3}}>
                                        <DynamicMap/>
                                    </CardContent>
                                    <Divider/>
                                    <CardActions sx={{justifyContent: 'flex-end'}}>
                                        <Button color="inherit" endIcon={<ChecklistRoundedIcon/>} size="small">
                                            Overview
                                        </Button>
                                    </CardActions>
                                </Card>

                            </Grid>

                            <Grid xs={12}>
                                <Image
                                    src="/assets/img/planet.jpeg"
                                    width={500}
                                    height={500}
                                    alt="Picture of the author"
                                />
                            </Grid>
                        </Grid>


                    </Box>
                </Box>
            </Box>
        </>
    )
}

