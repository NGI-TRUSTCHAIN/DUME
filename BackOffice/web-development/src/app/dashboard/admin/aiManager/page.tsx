'use client'


import {
    Avatar,
    AvatarGroup,
    Box,
    Card,
    CardActions, CardContent,
    CardHeader, Chip,
    Collapse,
    Container,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material"
import Button from "@mui/material/Button";
import {FolderIcon, PlusIcon} from "@heroicons/react/24/outline";
import React from "react";
import {ArrowRightIcon} from "@heroicons/react/24/solid";
import Grid from '@mui/material/Unstable_Grid2';
import {alpha, useTheme} from "@mui/material/styles";
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {Chart} from "@/components/apex-charts";
import {LinearProgressWithLabel} from "@/components/linear-progress";
import {SelectFilter} from "@/components/native-select";
import {SearchBar} from "@/components/search-bar";
import HorizontalNonLinearStepper from "@/components/stepper/HorizontalStepper";


const chartSeries = [
    {
        data: [18, 16, 5, 50, 80]
    }
]

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
        colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25), alpha(theme.palette.primary.dark, 0.25)],
        dataLabels: {
            enabled: false
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
            show: false,
            position: 'top' as 'top'
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        stroke: {
            colors: ['transparent'],
            show: true,
            width: 1
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
                'Model 1',
                'Model 2',
                'Model 3',
                'Model 4',
                'Model 5'
            ],
            labels: {
                offsetY: 1,
                style: {
                    colors: theme.palette.text.secondary
                },
                function(value: string) {
                    return value + "ms";
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

const useChartOptionsLine = () => {
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
                '01', '02', '03', '04', '05', '06', '07', '08', '09',
                '10', '11', '12'
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

const chartSeriesLine = [
    {
        name: 'Accuracy',
        data: [0.18, 0.16, 0.5, 0.8, 0.3, 0.14, 0.14, 0.16, 0.17, 0.19, 0.18, 0.20]
    },
    {
        name: 'Loss',
        data: [0.12, 0.11, 0.4, 0.6, 0.2, 0.9, 0.9, 0.10, 0.11, 0.12, 0.13, 0.13]
    }
];

function createData(
    image: string,
    date: string,
    status: string,
) {
    return {
        image,
        date,
        status,
        model: [
            {
                accuracy: '24%',
                model: 4.0
            }
        ]
    };
}

const rows = [
    createData('/public/assets/products/product-1.png', '2020-01-05', 'Inferred'),
    createData('/assets/products/product-2.png', '2020-01-05', 'Failed'),

];

function Row(props: { row: ReturnType<typeof createData> }) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Box
                        component="img"
                        src={row.image}
                        sx={{
                            borderRadius: 1,
                            height: 80,
                            width: 80
                        }}
                    />
                </TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">
                    <Chip
                        label={row.status}
                        color={row.status === "Inferred" ? "success" : "error"}
                    />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {row.model.map((modelRow) => (
                            <CardContent key={modelRow.model}>
                                <Grid container spacing={3}>
                                    <Grid xs={12} md={6}>
                                        <Typography variant="h6" gutterBottom component="h6">
                                            Details
                                        </Typography>
                                        <Divider/>
                                        <Grid container spacing={1}>
                                            <Grid xs={12} md={6}>
                                                <Box
                                                    component="form"
                                                    sx={{
                                                        '& .MuiTextField-root': {m: 1, width: '20ch'},
                                                    }}
                                                    noValidate
                                                    autoComplete="off"
                                                >
                                                    <TextField
                                                        id="outlined-read-only-input"
                                                        label="Accuracy"
                                                        defaultValue={modelRow.accuracy}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid xs={12} md={6}>
                                                <Box
                                                    component="form"
                                                    sx={{
                                                        '& .MuiTextField-root': {m: 1, width: '20ch'},
                                                    }}
                                                    noValidate
                                                    autoComplete="off"
                                                >
                                                    <TextField
                                                        id="outlined-read-only-input"
                                                        label="Used Model"
                                                        defaultValue={modelRow.model}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <Typography variant="h6" gutterBottom component="h6">
                                            Change Model
                                        </Typography>
                                        <Divider/>
                                        <Grid container spacing={3}>
                                            <Grid xs={12} md={6}>
                                                <Button color='inherit' endIcon={<KeyboardArrowDownIcon/>}
                                                        sx={{marginTop: 3}}>
                                                    Model
                                                </Button>

                                            </Grid>
                                            <Grid xs={12} md={6}>
                                                <Button variant="contained" startIcon={(
                                                    <SvgIcon fontSize="small">
                                                        <PlusIcon/>
                                                    </SvgIcon>
                                                )} sx={{marginTop: 3}}
                                                >
                                                    Force Process
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        ))}
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function Page() {

    const chartOptions = useChartOptions();
    const chartOptionsLine = useChartOptionsLine();

    return (
        <>
            <Box component="main"
                 sx={{
                     flexGrow: 1,
                     py: 8
                 }}>
                <Container maxWidth="xl">
                    <Grid container spacing={{xs: 3, lg: 4}}>
                        <Grid xs={12}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={1}
                            >
                                <Stack spacing={1}>
                                    <Typography noWrap variant="h4">AI Manager</Typography>
                                </Stack>
                                <div>
                                    <Button variant="contained" startIcon={(
                                        <SvgIcon fontSize="small">
                                            <PlusIcon/>
                                        </SvgIcon>
                                    )}
                                    >
                                        Add Model
                                    </Button>
                                </div>
                            </Stack>
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Card>
                                <Stack direction={'row'} align-items={'center'} sx={{px: 4, py: 3}}>
                                    <div>
                                        <img src={"/assets/icons/iconly-glass-paper.svg"} width={28} alt={''}/>
                                    </div>
                                    <Box ml={3}>
                                        <Typography component={'p'} variant='body2'>Available Models</Typography>
                                        <Typography component={'h4'} variant='h4'>10</Typography>
                                    </Box>
                                </Stack>
                                <Divider/>
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
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Card>
                                <Stack direction={'row'} align-items={'center'} sx={{px: 4, py: 3}}>
                                    <div>
                                        <img src={"/assets/icons/iconly-glass-tick.svg"} width={28} alt={''}/>
                                    </div>
                                    <Box ml={3}>
                                        <Typography component={'p'} variant='body2'>Models in Use</Typography>
                                        <Typography component={'h4'} variant='h4'>5</Typography>
                                    </Box>
                                </Stack>
                                <Divider/>
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
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Card>
                                <Stack direction={'row'} align-items={'center'} sx={{px: 4, py: 3}}>
                                    <div>
                                        <img src={"/assets/icons/iconly-glass-info.svg"} width={28} alt={''}/>
                                    </div>
                                    <Box ml={3}>
                                        <Typography component={'p'} variant='body2'>Models Training</Typography>
                                        <Typography component={'h4'} variant='h4'>1</Typography>
                                    </Box>
                                </Stack>
                                <Divider/>
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
                        </Grid>
                        <Grid xs={12} md={8}>
                            <Card>
                                <CardHeader
                                    title={'Inference Duration'}
                                    subheader={'Average of 100 processes'}
                                />
                                <Box>
                                    <Chart
                                        height={350}
                                        options={chartOptions}
                                        series={chartSeries}
                                        type="bar"
                                        width="100%"
                                    />

                                </Box>


                            </Card>
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Card>
                                <CardHeader title={'Training Process'}/>
                                <Divider/>
                                <List>

                                    <ListItem secondaryAction={
                                        <SelectFilter/>
                                    } alignItems={'center'}>
                                        <ListItemIcon sx={{width: 24, height: 24}}>
                                            <FolderIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={'Model'}/>
                                    </ListItem>
                                    <Divider/>
                                    <ListItem secondaryAction={
                                        <Stack component={'li'} direction={'row'}>
                                            <Box sx={{
                                                width: 16, height: 16, borderRadius: '4px',
                                                backgroundColor: 'rgb(255, 0, 0)'
                                            }}/>
                                            <Typography component={'h6'} variant={'subtitle2'}
                                                        ml={2}>Not Running</Typography>
                                        </Stack>
                                    } alignItems={'center'}>
                                        <ListItemIcon sx={{width: 24, height: 24}}>
                                            <FolderIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={'Process'}/>
                                    </ListItem>
                                    <Divider/>
                                    <ListItem alignItems={'center'}>
                                        <ListItemIcon sx={{width: 24, height: 24}}>
                                            <FolderIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={'Elapsed Time'}/>
                                        <ListItemText primary={'00:00:24'}/>
                                    </ListItem>
                                    <Divider/>
                                    <ListItem alignItems={'center'}>
                                        <ListItemIcon sx={{width: 24, height: 24}}>
                                            <FolderIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={'Time Left'}/>
                                        <ListItemText primary={'00:00:24'}/>
                                    </ListItem>
                                    <Divider/>
                                    <ListItem alignItems={'center'}>
                                        <ListItemIcon sx={{width: 24, height: 24}}>
                                            <FolderIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={'Progress'}/>
                                        <Box sx={{width: '50%'}}>
                                            <LinearProgressWithLabel value={60}/>
                                        </Box>
                                    </ListItem>
                                </List>
                                <Divider/>
                                <Stack alignItems={'center'} justifyContent={'space-evenly'} direction={'row'}
                                       spacing={1} mt={1} mb={1}>
                                    <Stack alignItems={'center'} spacing={1}>
                                        <Typography component={'h6'} variant='subtitle2'
                                                    color={'#10B981'}>Accuracy</Typography>
                                        <Typography component={'h6'} variant='h6'>0.59%</Typography>
                                    </Stack>
                                    <Stack alignItems={'center'} spacing={1}>
                                        <Typography component={'h6'} variant='subtitle2'
                                                    color={'error'}>Loss</Typography>
                                        <Typography component={'h6'} variant='h6'>1.125%</Typography>
                                    </Stack>
                                </Stack>
                                <Divider/>
                                <CardActions sx={{justifyContent: 'flex-start'}}>
                                    <Button
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <VisibilityIcon/>
                                            </SvgIcon>
                                        )}
                                        size="small"
                                        variant="text"
                                    >
                                        View live
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid xs={12} md={8}>
                            <Card>
                                <CardHeader title={'Inference Processes'}/>
                                <Divider/>
                                <CardContent>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="collapsible table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell/>
                                                    <TableCell>Image</TableCell>
                                                    <TableCell align="right">Inference Date</TableCell>
                                                    <TableCell align="right">Inference Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.map((row) => (
                                                    <Row key={row.image} row={row}/>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
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
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Card>
                                <CardHeader
                                    title={'Model Performance'}
                                    subheader={'Last Training Session'}
                                />
                                <Divider/>
                                <SelectFilter/>
                                <Chart
                                    height={350}
                                    options={chartOptionsLine}
                                    series={chartSeriesLine}
                                    type="line"
                                    width="100%"
                                />
                                {/*<CardContent>*/}
                                {/*    <List>*/}

                                {/*        <ListItem secondaryAction={*/}
                                {/*            <SelectFilter/>*/}
                                {/*        } alignItems={'center'}>*/}
                                {/*            <ListItemIcon sx={{width: 24, height: 24}}>*/}
                                {/*                <FolderIcon/>*/}
                                {/*            </ListItemIcon>*/}
                                {/*            <ListItemText primary={'Model'}/>*/}
                                {/*        </ListItem>*/}
                                {/*        <Divider/>*/}
                                {/*        <ListItem secondaryAction={*/}
                                {/*            <Stack component={'li'} direction={'row'}>*/}
                                {/*                <Box sx={{*/}
                                {/*                    width: 16, height: 16, borderRadius: '4px',*/}
                                {/*                    backgroundColor: 'rgb(255, 0, 0)'*/}
                                {/*                }}/>*/}
                                {/*                <Typography component={'h6'} variant={'subtitle2'}*/}
                                {/*                            ml={2}>Not Running</Typography>*/}
                                {/*            </Stack>*/}
                                {/*        } alignItems={'center'}>*/}
                                {/*            <ListItemIcon sx={{width: 24, height: 24}}>*/}
                                {/*                <FolderIcon/>*/}
                                {/*            </ListItemIcon>*/}
                                {/*            <ListItemText primary={'Process'}/>*/}
                                {/*        </ListItem>*/}
                                {/*        <Divider/>*/}
                                {/*        <ListItem alignItems={'center'}>*/}
                                {/*            <ListItemIcon sx={{width: 24, height: 24}}>*/}
                                {/*                <FolderIcon/>*/}
                                {/*            </ListItemIcon>*/}
                                {/*            <ListItemText primary={'Elapsed Time'}/>*/}
                                {/*            <ListItemText primary={'00:00:24'}/>*/}
                                {/*        </ListItem>*/}
                                {/*        <Divider/>*/}
                                {/*        <ListItem alignItems={'center'}>*/}
                                {/*            <ListItemIcon sx={{width: 24, height: 24}}>*/}
                                {/*                <FolderIcon/>*/}
                                {/*            </ListItemIcon>*/}
                                {/*            <ListItemText primary={'Time Left'}/>*/}
                                {/*            <ListItemText primary={'00:00:24'}/>*/}
                                {/*        </ListItem>*/}
                                {/*    </List>*/}
                                {/*    <Divider/>*/}
                                {/*    <Stack alignItems={'center'} justifyContent={'space-evenly'} direction={'row'}*/}
                                {/*           spacing={1} mt={2}>*/}
                                {/*        <Stack alignItems={'center'} spacing={1}>*/}
                                {/*            <Typography component={'h6'} variant='subtitle2'*/}
                                {/*                        color={'#10B981'}>Accuracy</Typography>*/}
                                {/*            <Typography component={'h6'} variant='h6'>0.59%</Typography>*/}
                                {/*        </Stack>*/}
                                {/*        <Stack alignItems={'center'} spacing={1}>*/}
                                {/*            <Typography component={'h6'} variant='subtitle2'*/}
                                {/*                        color={'error'}>Loss</Typography>*/}
                                {/*            <Typography component={'h6'} variant='h6'>1.125%</Typography>*/}
                                {/*        </Stack>*/}
                                {/*    </Stack>*/}
                                {/*</CardContent>*/}
                            </Card>
                        </Grid>
                        <Grid xs={12} md={7}>
                            <Card>
                                <CardHeader
                                    title={'Training Folders'}
                                    subheader={'Create a full page with both cards'}
                                />
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                            <SearchBar placeholderText={'Search Model'} sx={{width:'75%'}}/>
                                            <SelectFilter/>
                                        </Stack>
                                        <Box display={'grid'} sx={{gridTemplateColumns:'repeat(3, 1fr)', gap:'24px'}}>
                                            <Paper>
                                                <Box>
                                                    <Box
                                                        component="img"
                                                        src={'/assets/icons/icon-folder.svg'}
                                                        sx={{
                                                            borderRadius: 1,
                                                            height: 28,
                                                            width: 28
                                                        }}
                                                    />
                                                    <Typography component={'h6'} variant='subtitle2'>Folder Name</Typography>
                                                    <Divider/>
                                                    <Stack direction='row'>
                                                        <div>
                                                            <Typography component={'p'} variant='body2'>503.9 MB• 12 items</Typography>
                                                        </div>
                                                        <div>
                                                            <AvatarGroup max={2}>
                                                                <Avatar alt="Remy Sharp" src={"/assets/avatars/avatar-alcides-antonio.png"} />

                                                            </AvatarGroup>
                                                        </div>
                                                    </Stack>
                                                    <Typography component={'span'}>Created at Sep 01, 2023</Typography>
                                                </Box>
                                            </Paper>
                                            <Paper>
                                                <Box>
                                                    <Box
                                                        component="img"
                                                        src={'/assets/icons/icon-folder.svg'}
                                                        sx={{
                                                            borderRadius: 1,
                                                            height: 28,
                                                            width: 28
                                                        }}
                                                    />
                                                    <Typography component={'h6'} variant='subtitle2'>Folder Name</Typography>
                                                    <Divider/>
                                                    <Stack direction='row'>
                                                        <div>
                                                            <Typography component={'p'} variant='body2'>503.9 MB• 12 items</Typography>
                                                        </div>
                                                        <div>
                                                            <AvatarGroup max={2}>
                                                                <Avatar alt="Remy Sharp" src={"/assets/avatars/avatar-alcides-antonio.png"}/>

                                                            </AvatarGroup>
                                                        </div>
                                                    </Stack>
                                                    <Typography component={'span'}>Created at Sep 01, 2023</Typography>
                                                </Box>
                                            </Paper>
                                            <Paper>
                                                <Box>
                                                    <Box
                                                        component="img"
                                                        src={'/assets/icons/icon-folder.svg'}
                                                        sx={{
                                                            borderRadius: 1,
                                                            height: 28,
                                                            width: 28
                                                        }}
                                                    />
                                                    <Typography component={'h6'} variant='subtitle2'>Folder Name</Typography>
                                                    <Divider/>
                                                    <Stack direction='row'>
                                                        <div>
                                                            <Typography component={'p'} variant='body2'>503.9 MB• 12 items</Typography>
                                                        </div>
                                                        <div>
                                                            <AvatarGroup max={2}>
                                                                <Avatar alt="Remy Sharp" src={"/assets/avatars/avatar-alcides-antonio.png"} />

                                                            </AvatarGroup>
                                                        </div>
                                                    </Stack>
                                                    <Typography component={'span'}>Created at Sep 01, 2023</Typography>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    </Stack>
                                </CardContent>

                            </Card>
                        </Grid>
                        <Grid xs={12} md={5}>
                            <Card>
                                <CardHeader title={'Defining training procedure'}/>
                                <HorizontalNonLinearStepper/>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    )
}