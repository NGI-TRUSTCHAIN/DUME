'use client'

import React from "react";
import {Avatar, Collapse, Divider, LinearProgress, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import BasicTimeline from "@/components/timeline/RightTimeline";

export type DescriptionStackProps = {
    id: string,
    address: string,
    temperatureMessage: string,
    temperatureValue: number,

}
export function DescriptionStack(props: DescriptionStackProps & { isOpen: boolean; onClick: () => void }): React.JSX.Element {

    const handleClick = () => {
        props.onClick();
    };


    return (
        <>
            <Stack component={'li'} role={'button'} onClick={handleClick} direction={'row'} gap={2} textAlign={'left'}
                   alignItems={'center'} padding={2}>
                <Avatar>h</Avatar>
                <div>
                    <Typography variant={'subtitle1'}>{props.id}</Typography>
                    <Typography variant={'body2'}>{props.address}</Typography>
                </div>
            </Stack>
            <Collapse in={props.isOpen} timeout="auto" unmountOnExit>
                <Divider/>
                <Box padding={2}>
                    <Stack gap={1}>
                        <Typography variant={'subtitle2'}>
                            Temperature ({props.temperatureMessage})
                        </Typography>

                        <Stack direction={'row'} gap={2} alignItems={'center'} justifyContent={'space-between'}>
                            <LinearProgress variant="determinate" value={8} sx={{height: '4px', flex: '1 1 auto'}}/>
                            <Typography variant={'body2'}>
                                {props.temperatureValue} ºC
                            </Typography>
                        </Stack>
                    </Stack>
                    <BasicTimeline/>
                </Box>
            </Collapse>
        </>

    )

}