'use client'

import {
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    SvgIcon,
    Tab,
    TextField,
    Typography
} from "@mui/material";
import React from "react";
import Button from "@mui/material/Button";
import {ArrowDownRightIcon, ArrowUpRightIcon, PlusIcon} from "@heroicons/react/24/outline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {ArrowRightIcon, ArrowSmallDownIcon, ArrowSmallUpIcon} from "@heroicons/react/24/solid";
import {Chart} from "@/components/apex-charts";
import {useTheme} from "@mui/material/styles";
import SouthEastIcon from '@mui/icons-material/SouthEast';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import {TabContext, TabList} from "@mui/lab";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Cards from "react-credit-cards-2";
import 'react-credit-cards-2/dist/lib/styles.scss'
import TabAPI from "@/components/Tabs/TabWithAPI";
import {DefiningByEvent, DefiningByGeoLocation, DefiningByImage} from "@/app/dashboard/admin/crypto/sections/crypto-page";




const chartOptions = {
    chart: {
        background: "transparent",
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    markers: {
        size: 0
    },
    stroke: {
        width: 2,
        color: 'rgb(17, 25, 39)'
    },
    xaxis: {
        labels: {
            show: false
        },
        axisBorder: {
            show: false
        }
    },
    yaxis: {
        labels: {
            show: false
        },
        axisBorder: {
            show: false
        }
    },
    grid: {
        show: false
    },
    legend: {
        show: false
    }
};

const chartSeries = [
    {
        name: "Series 1",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
    }
];

const useChartOptionsDonut = (labels: string[]) => {
    const theme = useTheme();

    return {
        chart: {
            background: 'transparent'
        },
        colors: [
            theme.palette.primary.main,
            'rgb(6, 174, 212)',
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

function createData(color: string, name: string, value: string,) {
    return {color, name, value};
}

const rows = [
    createData('rgb(229, 231, 235)', 'Strategy', '$14,859.00'),
    createData('rgb(6, 174, 212)', 'Outsourcing', '$35,690.00'),
    createData('rgb(99, 102, 241)', 'Marketing', '$45,120.00'),
    createData('rgb(247, 144, 9)', 'Other', '$25,486.00'),

];

const tabs = [
    { value: '1', label: 'By Image', content: <DefiningByImage/> },
    { value: '2', label: 'By Event', content:  <DefiningByEvent/> },
    { value: '3', label: 'By GeoLocation', content: <DefiningByGeoLocation/> },
];

export default function Page() {

    const labels = ['TidyCoin', 'Ethereum', 'US Dollars',]
    const chartSeriesDonut = [14859.00, 35690.00, 45120.00]
    const chartOptionsDonut = useChartOptionsDonut(labels);

    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };


    return (
        <>
                <Box component="main"
                     sx={{
                         flexGrow: 1,
                         py: 8
                     }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={{xs: 3, lg: 4}}>
                            <Grid xs={12}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Stack spacing={1}>
                                        <Typography noWrap variant="h4">Crypto</Typography>
                                    </Stack>
                                    <div>
                                        <Button variant="contained" startIcon={(
                                            <SvgIcon fontSize="small">
                                                <PlusIcon/>
                                            </SvgIcon>
                                        )}
                                        >
                                            Add Wallet
                                        </Button>
                                    </div>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={7}>
                                <Stack spacing={2} direction='row'>
                                    <Card>
                                        <CardHeader
                                            action={
                                                <IconButton aria-label="settings">
                                                    <MoreHorizIcon/>
                                                </IconButton>
                                            }
                                            title="0.7568 TC"
                                            subheader="$16,213.20"
                                        />
                                        <Chart
                                            options={chartOptions}
                                            series={chartSeries}
                                            type="area"
                                            height="140px"
                                            width="387px"
                                        />
                                        <Box sx={{px: 2, pb: 2}}>
                                            <Stack direction={'row'} alignItems={'center'}>
                                                <Box
                                                    component="img"
                                                    src={'/assets/icons/logo-bitcoin.svg'}
                                                    sx={{
                                                        borderRadius: 1,
                                                        height: 36,
                                                        width: 36
                                                    }}
                                                />
                                                <div style={{marginLeft: '16px'}}>
                                                    <Typography component={'h6'} variant='subtitle2'>
                                                        TC/USD
                                                    </Typography>
                                                    <Stack direction={'row'} alignItems={'center'}
                                                           color={'rgb(16, 185, 129)'}>
                                                        <SvgIcon fontSize="small">
                                                            <ArrowSmallUpIcon/>
                                                        </SvgIcon>
                                                        <Typography component={'p'} variant='body2'
                                                                    sx={{marginLeft: 0.5}}>
                                                            0.56%
                                                        </Typography>
                                                    </Stack>
                                                </div>
                                            </Stack>

                                        </Box>
                                    </Card>
                                    <Card>
                                        <CardHeader
                                            action={
                                                <IconButton aria-label="settings">
                                                    <MoreHorizIcon/>
                                                </IconButton>
                                            }
                                            title="2.0435 ETH"
                                            subheader="$9,626.80"
                                        />
                                        <Chart
                                            options={chartOptions}
                                            series={chartSeries}
                                            type="area"
                                            height="140px"
                                            width="387px"
                                        />
                                        <Box sx={{px: 2, pb: 2}}>
                                            <Stack direction={'row'} alignItems={'center'}>
                                                <Box
                                                    component="img"
                                                    src={'/assets/icons/logo-eth.svg'}
                                                    sx={{
                                                        borderRadius: 1,
                                                        height: 36,
                                                        width: 36
                                                    }}
                                                />
                                                <div style={{marginLeft: '16px'}}>
                                                    <Typography component={'h6'} variant='subtitle2'>
                                                        ETH/USD
                                                    </Typography>
                                                    <Stack direction={'row'} alignItems={'center'}
                                                           color={'rgb(240, 68, 56)'}>
                                                        <SvgIcon fontSize="small">
                                                            <ArrowSmallDownIcon/>
                                                        </SvgIcon>
                                                        <Typography component={'p'} variant='body2'
                                                                    sx={{marginLeft: 0.5}}>
                                                            0.56%
                                                        </Typography>
                                                    </Stack>
                                                </div>
                                            </Stack>

                                        </Box>
                                    </Card>

                                </Stack>
                            </Grid>
                            <Grid xs={12} md={5}>
                                <Cards
                                    name="André Torneiro"
                                    number="4111 1111 1111 1111"
                                    expiry="10/30"
                                    cvc="737"
                                />
                            </Grid>
                            <Grid xs={12} md={8}>
                                <Stack spacing={2}>
                                    <Card>
                                        <CardHeader
                                            title="Current Balance"
                                            subheader="Balance across all your accounts"
                                        />
                                        <CardContent>
                                            <Stack direction={'row'} flexWrap="wrap" alignItems={'center'}>
                                                <Box sx={{height: 200, width: 200, justifyContent: 'center'}}>
                                                    <Chart
                                                        height='100%'
                                                        options={chartOptionsDonut}
                                                        series={chartSeriesDonut}
                                                        type="donut"
                                                        width="100%"
                                                    />
                                                </Box>
                                                <Stack>
                                                    <Stack>
                                                        <Typography component={'span'}>Total balance</Typography>
                                                        <Typography component={'h4'}
                                                                    variant={'h4'}>$35,916.81</Typography>
                                                    </Stack>
                                                    <Stack mt={4}>
                                                        <Typography component={'span'}>Available currency</Typography>
                                                        <Stack component={'ul'} mt={1}>
                                                            <Stack component={'li'} direction={'row'}>
                                                                <Box sx={{
                                                                    width: 16, height: 16, borderRadius: '4px',
                                                                    backgroundColor: 'rgb(99, 102, 241)'
                                                                }}/>
                                                                <Typography component={'h6'} variant={'subtitle2'}
                                                                            ml={2}>Bitcoin</Typography>
                                                                <Typography component={'h6'} variant={'subtitle2'}
                                                                            ml={2}>$16,213.20</Typography>
                                                            </Stack>
                                                            <Stack component={'li'} direction={'row'}>
                                                                <Box sx={{
                                                                    width: 16, height: 16, borderRadius: '4px',
                                                                    backgroundColor: 'rgb(6, 174, 212)'
                                                                }}/>
                                                                <Typography component={'h6'} variant={'subtitle2'}
                                                                            ml={2}>Bitcoin</Typography>
                                                                <Typography component={'h6'} variant={'subtitle2'}
                                                                            ml={2}>$9,626.80</Typography>
                                                            </Stack>
                                                            <Stack component={'li'} direction={'row'}>
                                                                <Box sx={{
                                                                    width: 16, height: 16, borderRadius: '4px',
                                                                    backgroundColor: 'rgb(247, 144, 9)'
                                                                }}/>
                                                                <Typography component={'h6'} variant={'subtitle2'}
                                                                            ml={2}>Bitcoin</Typography>
                                                                <Typography component={'h6'} variant={'subtitle2'}
                                                                            ml={2}>$10,076.81</Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                        <Divider/>
                                        <CardActions sx={{justifyContent: 'flex-start'}}>
                                            <Button
                                                color="inherit"
                                                endIcon={(
                                                    <SvgIcon fontSize="small">
                                                        <ArrowUpRightIcon/>
                                                    </SvgIcon>
                                                )}
                                                size="small"
                                            >
                                                Add Founds
                                            </Button>
                                            <Button
                                                color="inherit"
                                                endIcon={(
                                                    <SvgIcon fontSize="small">
                                                        <ArrowDownRightIcon/>
                                                    </SvgIcon>
                                                )}
                                                size="small"
                                            >
                                                Transfer Founds
                                            </Button>
                                        </CardActions>


                                    </Card>
                                    <Card>
                                        <CardHeader title="Transactions"/>
                                        <List>
                                            <ListItem disablePadding >
                                                <ListItemAvatar color={'success'}>
                                                    <Avatar sx={{ bgcolor:'white'}}>
                                                        <SvgIcon fontSize="large" >
                                                            <NorthEastIcon color='success'/>
                                                        </SvgIcon>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Buy TC" secondary="08.27.2023 / 08:56 AM"/>
                                                <ListItemSecondaryAction sx={{edge:'end'}}>
                                                    <Typography component={'h6'} variant='subtitle2' sx={{color:'rgb(16, 185, 129)'}}>+ 0.1337 TC</Typography>
                                                    <Typography component={'p'} variant='body2'>$4,805.00</Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <ListItem disablePadding >
                                                <ListItemAvatar color={'success'}>
                                                    <Avatar sx={{ bgcolor:'white'}}>
                                                        <SvgIcon fontSize="large" >
                                                            <SouthEastIcon color='error'/>
                                                        </SvgIcon>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Sell TC" secondary="08.27.2023 / 08:56 AM"/>
                                                <ListItemSecondaryAction sx={{edge:'end'}}>
                                                    <Typography component={'h6'} variant='subtitle2' sx={{color:'rgb(240, 68, 56)'}}>- 0.2105 TC</Typography>
                                                    <Typography component={'p'} variant='body2'>$2,344.00</Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </List>
                                        <CardActions sx={{justifyContent: 'flex-start'}}>
                                            <Button
                                                color="inherit"
                                                endIcon={(
                                                    <SvgIcon fontSize="small">
                                                        <ArrowRightIcon/>
                                                    </SvgIcon>
                                                )}
                                                size="small"
                                                variant="text"
                                            >
                                                View all
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={4}>
                                <Stack spacing={4} sx={{marginLeft:2}}>
                                    <Card>
                                        <CardHeader title="Operation"
                                                    action={
                                                        <TabContext value={value}>
                                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                                                    <Tab label="Buy" value="1" />
                                                                    <Tab label="Sell" value="2" />
                                                                </TabList>
                                                            </Box>
                                                            {/*<TabPanel value="1">Buy</TabPanel>*/}
                                                            {/*<TabPanel value="2">Sell</TabPanel>*/}

                                                        </TabContext>
                                                    }/>
                                        <CardContent>
                                            <TextField
                                                id="input-with-icon-textfield"
                                                label="From"
                                                placeholder="0.4567"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Box
                                                                component="img"
                                                                src={'/assets/icons/logo-bitcoin.svg'}
                                                                sx={{
                                                                    borderRadius: 1,
                                                                    height: 24,
                                                                    width: 24
                                                                }}
                                                            />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="outlined"
                                                sx={{width: '100%'}}
                                            />

                                            <Box display='flex' mt={1} mb={1} justifyContent={'center'}  sx={{alignItems:'center'}}>
                                                <IconButton aria-label="delete" sx={{size:'large'}}>
                                                    <SwapVertIcon />
                                                </IconButton>
                                            </Box>

                                            <TextField
                                                id="input-with-icon-textfield"
                                                label="From"
                                                placeholder="0.4567"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Box
                                                                component="img"
                                                                src={'/assets/icons/logo-eth.svg'}
                                                                sx={{
                                                                    borderRadius: 1,
                                                                    height: 24,
                                                                    width: 24
                                                                }}
                                                            />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="outlined"
                                                sx={{width: '100%'}}
                                            />

                                            <Typography component={'p'} variant='body2'
                                                        sx={{marginTop: 1, marginBottom:1}}>
                                                1 BTC = $20,024.90
                                            </Typography>

                                            <Button variant="contained" fullWidth>Buy TidyCoin</Button>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader title="Change TidyCoin Value"/>
                                        <TabAPI tabs={tabs}/>
                                    </Card>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
        </>
    )
}

