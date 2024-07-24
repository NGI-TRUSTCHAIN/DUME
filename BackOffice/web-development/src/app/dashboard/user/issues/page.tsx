'use client'

import {MainCard, TicketsProps} from "@/app/dashboard/users/_components/overview/main-card";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import React from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableContainer,
    Typography
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import {Chart} from "@/components/apex-charts";
import {DynamicMap} from "@/components/maps";
import {chartSeries, useChartOptions} from "@/app/dashboard/users/videos/[id]/page";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import NextLink from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";



const cardsContent: TicketsProps[] = [
    {
        icon: <ChecklistRoundedIcon/>,
        title: 'Total',
        value: 31,
        trend: 'up',
        percentage: 15,
    },
    {
        icon: <ChecklistRoundedIcon/>,
        title: 'Solved',
        value: 31,
        trend: 'up',
        percentage: 15,
    },
    {
        icon: <ChecklistRoundedIcon/>,
        title: 'Pending',
        value: 31,
        trend: 'up',
        percentage: 15,
    },
    {
        icon: <ChecklistRoundedIcon/>,
        title: 'Not Solved',
        value: 31,
        trend: 'up',
        percentage: 15,
    },
]


export default function Page() {

    const chartOptions = useChartOptions();

    return (
        <>
            <Stack gap={4}>
                <Typography component={'h4'} variant="h3">Issues</Typography>
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
                                title="Issues"
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
                                title="Issues Distribution"
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
                        <IssuesTable/>
                    </Grid>

                </Grid>
            </Stack>
        </>
    )

}

function IssuesTable(): React.JSX.Element {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Issue</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Coordinates</TableCell>
                        <TableCell>Captured By</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                    <TableCell component="th" scope="row">
                        <video
                            autoPlay
                            loop
                            muted
                            poster="https://assets.codepen.io/6093409/river.jpg"
                            width={'100px'}
                            height={'100px'}
                        >
                            <source
                                src="https://assets.codepen.io/6093409/river.mp4"
                                type="video/mp4"
                            />
                        </video>
                    </TableCell>

                    <TableCell>
                        Trash Outside container
                    </TableCell>
                    <TableCell>
                        Rua x 1111-568 Madeira
                    </TableCell>
                    <TableCell>
                        41,3 /56.3
                    </TableCell>
                        <TableCell>
                            Alcides
                        </TableCell>
                    <TableCell>
                        <Chip color={'warning'} label={"Pending"}/>
                    </TableCell>
                    <TableCell>
                        <Stack direction={'row'} spacing={1}
                               alignItems={'center'}>
                            <IconButton component={NextLink}
                                        href="/admin/customerEdit">
                                <EditIcon/>
                            </IconButton>

                            <IconButton aria-label="delete" color={'error'}>
                                <DeleteIcon/>
                            </IconButton>

                            <IconButton component={NextLink}
                                        href={"/users/videos/:videoId"}>
                                <VisibilityIcon/>
                            </IconButton>
                        </Stack>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
</TableContainer>
)

}