import {Avatar, Card, Stack, Typography} from "@mui/material";
import React from "react";


export type MainCardsProps = {
    icon: React.ReactElement,
    message: string,
    value: number,
}

export function LogisticsMainCard(props: MainCardsProps): React.JSX.Element {

    return (
        <Card sx={{height: '100%'}}>
            <Stack direction={'column'} gap={1} padding={3}>
                <Stack alignItems="center" gap={2} direction="row">
                    <Avatar sx={{bgcolor: '#fff'}}>
                        {/*    <Box sx={{borderRadius:'50%', padding:'4px', animation: '750ms ease 0s infinite normal none running pulse'}}>*/}
                        {/*        <Box sx={{borderRadius:'50%', bgcolor:'red', height:'18px', width:'18px'}}/>*/}
                        {/*    </Box>*/}
                        {props.icon}
                    </Avatar>
                    <Typography variant={'h5'}>
                        {props.value}
                    </Typography>
                </Stack>
                <Typography variant={'body2'}>
                    {props.message}
                </Typography>
            </Stack>
        </Card>
    )
}