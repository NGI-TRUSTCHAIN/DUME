'use client'

import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Container,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    SvgIcon,
    Typography
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2';
import React from "react";
import Button from "@mui/material/Button";
import CachedIcon from '@mui/icons-material/Cached';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChart';
import {useTheme} from "@mui/material/styles";
import {ArrowRightIcon} from "@heroicons/react/24/solid";
import {Chart} from "@/src/components/apex-charts";
import {LinearProgressWithLabel} from "@/src/components/linear-progress";


const chartSeries = [
    {
        name: 'New Customers',
        data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]
    },
    {
        name: 'Up/Cross-Selling',
        data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
    }
];

const useChartOptions = () => {
    const theme = useTheme();

    return {
        chart: {
            background: 'transparent',
            stacked: false,
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            opacity: 1,
            type: 'solid'
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 2,
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        legend: {
            show: true,
            position: 'top' as 'top',
            horizontalAlign: 'right' as 'right',
            labels: {
                colors: [theme.palette.primary.main, theme.palette.warning.main],
                useSeriesColors: false
            },
            markers: {
                fillColors: [theme.palette.primary.main, theme.palette.warning.main]
            }
        },
        markers: {
            size: 6,
            colors: [theme.palette.primary.main, theme.palette.warning.main],
            strokeColors: [theme.palette.primary.main, theme.palette.warning.main]
        },
        stroke: {
            colors: [theme.palette.primary.main, theme.palette.warning.main],
            show: true,
            curve: 'smooth' as 'smooth',
            width: 4,
            dashArray: [0, 4]
        },
        theme: {
            mode: theme.palette.mode
        },
        xaxis: {
            axisBorder: {
                color: theme.palette.divider,
                show: true
            },
            axisTicks: {
                color: theme.palette.divider,
                show: true
            },
            categories: [
                '01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
                '10 Jan', '11 Jan', '12 Jan'
            ],
            labels: {
                offsetY: 1,
                style: {
                    colors: theme.palette.text.primary,
                }
            }
        },
        yaxis: {
            labels: {
                offsetX: -5,
                style: {
                    colors: theme.palette.text.secondary
                }
            }
        }
    };
};

const products = [
    {
        id: '5ece2c077e39da27658aa8a9',
        image: '/assets/products/product-1.png',
        name: 'Plan A',
        sales: 13.153,
        tag: '#1'
    },
    {
        id: '5ece2c0d16f70bff2cf86cd8',
        image: '/assets/products/product-1.png',
        name: 'Plan B',
        sales: 10.300,
        tag: '#2'
    },
    {
        id: 'b393ce1b09c1254c3a92c827',
        image: '/assets/products/product-5.png',
        name: 'Plan C',
        sales: 5.500,
        tag: '#3'
    },
    {
        id: 'a6ede15670da63f49f752c89',
        image: '/assets/products/product-6.png',
        name: 'Plan D',
        sales: 1.203,
        tag: '#4'
    },
    {
        id: 'bcad5524fe3a2f8f8620ceda',
        image: '/assets/products/product-7.png',
        name: 'Plan E',
        sales: 254,
        tag: '#5'
    }
]

const useChartOptionsdonut = (labels: string[]) => {
    const theme = useTheme();

    return {
        chart: {
            background: 'transparent'
        },
        colors: [
            theme.palette.primary.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            ' rgb(229, 231, 235)'
        ],
        dataLabels: {
            enabled: false
        },
        labels,
        legend: {
            show: false,
            // position: 'bottom' as 'bottom',
            // fontSize: '18px',
            // fontFamily: 'Helvetica, Arial',
        },
        plotOptions: {
            pie: {
                expandOnClick: false
            }
        },
        states: {
            active: {
                filter: {
                    type: 'none'
                }
            },
            hover: {
                filter: {
                    type: 'none'
                }
            }
        },
        stroke: {
            width: 0
        },
        theme: {
            mode: theme.palette.mode
        },
        tooltip: {
            fillSeriesColor: false
        }
    };
};

function createData(
    color: string,
    name: string,
    value: string,
) {
    return {color, name, value};
}

const rows = [
    createData('rgb(229, 231, 235)', 'Strategy', '$14,859.00'),
    createData('rgb(6, 174, 212)', 'Outsourcing', '$35,690.00'),
    createData('rgb(99, 102, 241)', 'Marketing', '$45,120.00'),
    createData('rgb(247, 144, 9)', 'Other', '$25,486.00'),

];


export default function Page(){
    const labels = ['Strategy', 'Outsourcing', 'Marketing', 'Other']
    const chartSeriesDonut = [14859.00, 35690.00, 45120.00, 25486.00]
    const chartOptions = useChartOptions();
    const chartOptionsDonut = useChartOptionsdonut(labels);


    return (
        <>

                <Box component="main" sx={{flexGrow: 1, py: 8}}>
                    <Container maxWidth="xl">
                        <Grid container spacing={{xs: 3, lg: 4}}>
                            <Grid xs={12}>
                                <Stack direction="row" justifyContent="space-between" spacing={3}>

                                    <Typography variant="h4">E-Commerce</Typography>
                                    <div>
                                        <Button
                                            startIcon={(
                                                <SvgIcon fontSize="small">
                                                    <CachedIcon/>
                                                </SvgIcon>
                                            )}
                                            variant="contained"
                                        >
                                            Sync Data
                                        </Button>
                                    </div>
                                </Stack>
                            </Grid>
                            <Grid xs={12} lg={8}>
                                <Stack spacing={4}>
                                    <Card>
                                        <CardHeader title="Today's Stats"/>
                                        <CardContent>
                                            <Grid container spacing={3}>
                                                <Grid xs={12} md={4}>
                                                    <Stack direction='row' alignItems='center' sx={
                                                        {
                                                            backgroundColor: 'rgb(254, 243, 242)',
                                                            px: 3, py: 4, borderRadius: '20px'
                                                        }
                                                    }>
                                                        <Box sx={{height: '48px', width: '48px', flexShrink: 0}}>
                                                            {/*<SvgIcon sx={{width: '100%'}}>*/}
                                                            {/*    <InsertChartIcon color="success"/>*/}
                                                            {/*</SvgIcon>*/}
                                                            <InsertChartOutlinedIcon fontSize="large" color='error'/>
                                                        </Box>
                                                        <div>
                                                            <Typography variant="body2">Sales</Typography>
                                                            <Typography variant="h5">$152K</Typography>
                                                        </div>
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={4}>
                                                    <Stack direction='row' alignItems='center' sx={
                                                        {
                                                            backgroundColor: 'rgb(255, 250, 235)',
                                                            px: 3, py: 4, borderRadius: '20px'
                                                        }
                                                    }>
                                                        <Box sx={{height: '48px', width: '48px', flexShrink: 0}}>
                                                            {/*<SvgIcon sx={{width: '100%'}}>*/}
                                                            {/*    <InsertChartIcon color="success"/>*/}
                                                            {/*</SvgIcon>*/}
                                                            <InsertChartOutlinedIcon fontSize="large" color='warning'/>
                                                        </Box>
                                                        <div>
                                                            <Typography variant="body2">Cost</Typography>
                                                            <Typography variant="h5">$152K</Typography>
                                                        </div>
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={4}>
                                                    <Stack direction='row' alignItems='center' sx={
                                                        {
                                                            backgroundColor: 'rgb(240, 253, 249)',
                                                            px: 3, py: 4, borderRadius: '20px'
                                                        }
                                                    }>
                                                        <Box sx={{height: '48px', width: '48px', flexShrink: 0}}>
                                                            {/*<SvgIcon sx={{width: '100%'}}>*/}
                                                            {/*    <InsertChartIcon color="success"/>*/}
                                                            {/*</SvgIcon>*/}
                                                            <InsertChartOutlinedIcon fontSize="large" color='success'/>
                                                        </Box>
                                                        <div>
                                                            <Typography variant="body2">Profit</Typography>
                                                            <Typography variant="h5">$152K</Typography>
                                                        </div>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader title="Sales Revenue"/>
                                        <CardContent>
                                            <Chart
                                                height={350}
                                                options={chartOptions}
                                                series={chartSeries}
                                                type="line"
                                                width="100%"
                                            />
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader title="Sales by Country"/>
                                        <CardContent sx={{display: 'flex', alignItems: 'center'}}>
                                            <Box display='flex' sx={{height: 206, width: 572}}>
                                                <img src={'/assets/map.png'} style={{maxWidth: '100%', height: 'auto'}}/>
                                            </Box>
                                            <Box flexGrow={1}>
                                                <Typography variant="body2">Total</Typography>
                                                <Typography variant="h5">$152K</Typography>
                                                <Stack component="ul" sx={{flexGrow: 1}}>
                                                    <Stack direction='row' alignItems={'center'}>
                                                        <Box sx={{height: 48, width: 48}}>
                                                            <img src={'/assets/flags/flag-us.svg'}/>

                                                        </Box>
                                                        <Stack ml={1} sx={{flexGrow: 1}}>
                                                            <Typography variant="subtitle2">United States</Typography>
                                                            <Box sx={{width: '50%'}}>
                                                                <LinearProgressWithLabel value={60}/>
                                                            </Box>
                                                        </Stack>
                                                    </Stack>
                                                    <Stack direction='row' alignItems={'center'}>
                                                        <Box sx={{height: 48, width: 48}}>
                                                            <img src={'/assets/flags/flag-es.svg'}/>

                                                        </Box>
                                                        <Stack ml={1} sx={{flexGrow: 1}}>
                                                            <Typography variant="subtitle2">Spain</Typography>
                                                            <Box sx={{width: '50%'}}>
                                                                <LinearProgressWithLabel value={20}/>
                                                            </Box>
                                                        </Stack>
                                                    </Stack>
                                                    <Stack direction='row' alignItems={'center'}>
                                                        <Box sx={{height: 48, width: 48}}>
                                                            <img src={'/assets/flags/flag-uk.svg'}/>

                                                        </Box>
                                                        <Stack ml={1} sx={{flexGrow: 1}}>
                                                            <Typography variant="subtitle2">United Kingdom</Typography>
                                                            <Box sx={{width: '50%'}}>
                                                                <LinearProgressWithLabel value={10}/>
                                                            </Box>
                                                        </Stack>
                                                    </Stack>
                                                    <Stack direction='row' alignItems={'center'}>
                                                        <Box sx={{height: 48, width: 48}}>
                                                            <img src={'/assets/flags/flag-de.svg'}/>

                                                        </Box>
                                                        <Stack ml={1} sx={{flexGrow: 1}}>
                                                            <Typography variant="subtitle2">Germany</Typography>
                                                            <Box sx={{width: '50%'}}>
                                                                <LinearProgressWithLabel value={5}/>
                                                            </Box>
                                                        </Stack>
                                                    </Stack>
                                                    <Stack direction='row' alignItems={'center'}>
                                                        <Box sx={{height: 48, width: 48}}>
                                                            <img src={'/assets/flags/flag-ca.svg'}/>

                                                        </Box>
                                                        <Stack ml={1} sx={{flexGrow: 1}}>
                                                            <Typography variant="subtitle2">Canada</Typography>
                                                            <Box sx={{width: '50%'}}>
                                                                <LinearProgressWithLabel value={5}/>
                                                            </Box>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>

                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Stack>
                            </Grid>
                            <Grid xs={12} lg={4}>
                                <Stack spacing={4}>
                                    <Card>
                                        <CardHeader title="Top Selling Products"/>
                                        <CardContent>
                                            <List>
                                                {products.map((product, index) => {
                                                    const hasDivider = index < products.length - 1;

                                                    return (
                                                        <ListItem
                                                            divider={hasDivider}
                                                            key={product.id}
                                                        >
                                                            <ListItemAvatar>
                                                                {
                                                                    product.image
                                                                        ? (
                                                                            <Box
                                                                                component="img"
                                                                                src={product.image}
                                                                                sx={{
                                                                                    borderRadius: 1,
                                                                                    height: 80,
                                                                                    width: 80
                                                                                }}
                                                                            />
                                                                        )
                                                                        : (
                                                                            <Box
                                                                                sx={{
                                                                                    borderRadius: 1,
                                                                                    backgroundColor: 'neutral.200',
                                                                                    height: 80,
                                                                                    width: 80
                                                                                }}
                                                                            />
                                                                        )
                                                                }
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={product.name}
                                                                primaryTypographyProps={{variant: 'subtitle1'}}
                                                                secondary={`Updated  ago`}
                                                                secondaryTypographyProps={{variant: 'body2'}}
                                                                sx={{ml: 1}}
                                                            />
                                                            <ListItemText
                                                                primary={product.sales}
                                                                primaryTypographyProps={{variant: 'subtitle1', sx: {color: 'rgb(16, 185, 129)'}}}
                                                                secondary={`in sales`}
                                                                secondaryTypographyProps={{variant: 'body2'}}
                                                            />
                                                            <Chip label={product.tag}
                                                                  sx={{backgroundColor: "rgb(229, 231, 235)"}}/>
                                                        </ListItem>
                                                    );
                                                })}
                                            </List>
                                        </CardContent>
                                        <Divider/>
                                        <CardActions sx={{justifyContent: 'flex-end'}}>
                                            <Button
                                                color="inherit"
                                                endIcon={(
                                                    <SvgIcon fontSize="small">
                                                        <ArrowRightIcon/>
                                                    </SvgIcon>
                                                )}
                                                size="small"
                                            >
                                                See All
                                            </Button>
                                        </CardActions>

                                    </Card>
                                    <Card>
                                        <CardHeader
                                            title="Cost Breakdown"
                                            subheader="Based on selected period"
                                        />
                                        {/*<CardContent>*/}
                                        {/*    <Chart*/}
                                        {/*        height={300}*/}
                                        {/*        options={chartOptionsDonut}*/}
                                        {/*        series={chartSeriesDonut}*/}
                                        {/*        type="donut"*/}
                                        {/*        width="100%"*/}
                                        {/*    />*/}
                                        {/*    <Table>*/}
                                        {/*        <TableHead>*/}
                                        {/*            <TableRow>*/}
                                        {/*                <TableCell>Top Channels</TableCell>*/}
                                        {/*                <TableCell align="right">Value</TableCell>*/}
                                        {/*            </TableRow>*/}
                                        {/*        </TableHead>*/}
                                        {/*        <TableBody>*/}
                                        {/*            {rows.map((row) => (*/}
                                        {/*                <TableRow key={row.name}>*/}
                                        {/*                    <TableCell component="td">*/}
                                        {/*                        /!*<Box sx={{display: 'flex', alignItems: 'center'}}>*!/*/}
                                        {/*                        /!*    <Box sx={{*!/*/}
                                        {/*                        /!*        width: 8, height: 8, borderRadius: '50%',*!/*/}
                                        {/*                        /!*        marginRight: 8, backgroundColor: row.color*!/*/}
                                        {/*                        /!*    }}>*!/*/}
                                        {/*                        /!*    </Box>*!/*/}
                                        {/*                        /!*    <Typography component={'h6'}*!/*/}
                                        {/*                        /!*                variant='subtitle2'>{row.name}</Typography>*!/*/}
                                        {/*                        /!*</Box>*!/*/}
                                        {/*                        <Box sx={{display: 'flex'}}>*/}
                                        {/*                        <Box sx={{*/}
                                        {/*                                width: 8, height: 8, borderRadius: '50%',*/}
                                        {/*                                marginRight: 8, backgroundColor: row.color*/}
                                        {/*                            }}>*/}
                                        {/*                        </Box>*/}

                                        {/*                        <Typography component={'h6'}*/}
                                        {/*                                    variant='subtitle2'*/}
                                        {/*                                    sx={{flexGrow:1}}>{row.name} </Typography>*/}
                                        {/*                        </Box>*/}
                                        {/*                    </TableCell>*/}
                                        {/*                    <TableCell align="right">{row.value}</TableCell>*/}
                                        {/*                </TableRow>*/}
                                        {/*            ))}*/}
                                        {/*        </TableBody>*/}
                                        {/*    </Table>*/}
                                        {/*</CardContent>*/}
                                    </Card>

                                </Stack>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
        </>
    )
};

