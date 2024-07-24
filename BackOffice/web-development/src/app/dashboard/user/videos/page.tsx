'use client'

import {MainCard, TicketsProps} from "@/app/dashboard/users/_components/overview/main-card";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import React from "react";
import {Button, Card, CardActions, CardContent, CardHeader, Divider, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import dynamic from "next/dynamic";
import {Chart} from "@/components/apex-charts";
import {ApexOptions} from "apexcharts";
import {alpha, useTheme} from "@mui/material/styles";
import {VideosTable} from "@/app/dashboard/users/videos/_components/collapse-table";

const cardsContent: TicketsProps[] = [
    {
        icon: <ChecklistRoundedIcon/>,
        title: 'Devices',
        value: 7,
        trend: 'up',
        percentage: 5,
    },
    {
        icon: <ChecklistRoundedIcon/>,
        title: 'Total Videos',
        value: 16706,
        trend: 'up',
        percentage: 0,
    },
    {
        icon: <ChecklistRoundedIcon/>,
        title: 'Distance Covered',
        value: 88,
        trend: 'up',
        percentage: 15,
    },
    {
        icon: <ChecklistRoundedIcon/>,
        title: 'Total Events',
        value: 14000,
        trend: 'up',
        percentage: 15,
    },
]

const DynamicMap = dynamic(() => import('@/components/maps/map-videos'), {
    ssr: false
});

const chartSeries = [
    {name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]},
    {name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]},
]
export default function Page() {

    const chartOptions = useChartOptions();

    return (
        <>
            <Stack gap={4}>
                <Typography component={'h4'} variant="h3">Videos</Typography>
                <Grid container spacing={4}>
                    {
                        cardsContent.map((card, index) =>
                            <Grid xs={12} md={3} key={index}>
                                <MainCard icon={card.icon} title={card.title} value={card.value} trend={card.trend}
                                          percentage={card.percentage}/>
                            </Grid>
                        )
                    }

                    <Grid xs={12} md={6}>
                        <Card sx={{height: '100%'}}>
                            <CardHeader
                                action={
                                    <Button color="inherit" size="small" startIcon={<ChecklistRoundedIcon/>}>
                                        Sync
                                    </Button>
                                }
                                title="Videos"
                            />
                            <CardContent>
                                <Chart height={350} options={chartOptions} series={chartSeries} type="bar"
                                       width="100%"/>
                            </CardContent>
                            <Divider/>
                            <CardActions sx={{justifyContent: 'flex-end'}}>
                                <Button color="inherit" endIcon={<ChecklistRoundedIcon/>} size="small">
                                    Overview
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>

                    <Grid xs={12} md={6}>
                        <Card sx={{height: '100%'}}>
                            <CardHeader
                                action={
                                    <Button color="inherit" size="small" startIcon={<ChecklistRoundedIcon/>}>
                                        Sync
                                    </Button>
                                }
                                title="Distance"
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
                        <VideosTable/>
                    </Grid>
                </Grid>
            </Stack>
        </>
    )
}


function useChartOptions(): ApexOptions {
    const theme = useTheme();

    return {
        chart: {background: 'transparent', stacked: false, toolbar: {show: false}},
        colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
        dataLabels: {enabled: false},
        fill: {opacity: 1, type: 'solid'},
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 2,
            xaxis: {lines: {show: false}},
            yaxis: {lines: {show: true}},
        },
        legend: {show: false},
        plotOptions: {bar: {columnWidth: '40px'}},
        stroke: {colors: ['transparent'], show: true, width: 2},
        theme: {mode: theme.palette.mode},
        xaxis: {
            axisBorder: {color: theme.palette.divider, show: true},
            axisTicks: {color: theme.palette.divider, show: true},
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {offsetY: 5, style: {colors: theme.palette.text.secondary}},
        },
        yaxis: {
            labels: {
                formatter: (value) => (value > 0 ? `${value}K` : `${value}`),
                offsetX: -10,
                style: {colors: theme.palette.text.secondary},
            },
        },
    };
}