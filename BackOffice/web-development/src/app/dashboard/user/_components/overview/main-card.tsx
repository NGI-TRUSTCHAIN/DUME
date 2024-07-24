import {Avatar, Box, Card, CardContent, Divider, Stack, Typography} from "@mui/material";
import React from "react";
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

export type TicketsProps = {
    icon: React.ReactElement,
    title: string,
    value: number,
    trend: string,
    percentage: number,
}


export function MainCard({icon, title, value, trend, percentage}: TicketsProps): React.JSX.Element {

    const TrendIcon = trend === 'up' ? TrendingUpOutlinedIcon : TrendingDownOutlinedIcon;
    const trendColor = trend === 'up' ? 'success' : 'error';


    return (
        <Card sx={{height: '100%'}}>
            <CardContent sx={{paddingX: 3, paddingTop: 2, paddingBottom: 3}}>
                <Stack direction={'row'} gap={3} alignItems={'center'}>
                    <Avatar sx={{bgcolor: 'background.paper', boxShadow: '0px 2px 16px rgba(0, 0, 0, 0.08)',}}>
                        {icon}
                    </Avatar>
                    <div>
                        <Typography component={'p'} variant={'body1'}>
                            {title}
                        </Typography>
                        <Typography variant={'h3'}>
                            {value}
                        </Typography>
                    </div>
                </Stack>
            </CardContent>
            <Divider/>
            <Box padding={2}>
                <Stack direction={'row'} gap={1} alignItems={'center'}>
                    <Box justifyContent={'center'}>
                        <TrendIcon color={trendColor}/>
                    </Box>
                    <Typography component={'p'} variant={'caption'}>
                        <Typography component={'span'} variant={'subtitle2'}>
                            {percentage}
                        </Typography>
                        {" "}
                        increase vs last month
                    </Typography>
                </Stack>
            </Box>
        </Card>
    )
}