'use client'

import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    List,
    ListItem,
    ListItemText,
    Stack,
    SvgIcon,
    Table, TableBody, TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React from "react";
import {Logo} from "@/components/logo";
import {PencilIcon} from "@heroicons/react/24/solid";
import Button from "@mui/material/Button";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


function createData(
    date: string,
    total: string,
    view: string,
) {
    return {date, total, view};
}

const rows = [
    createData('05 Aug 2023', '$4.99', 'View Invoice'),
    createData('05 Jul 2023', '$4.99', 'View Invoice'),
    createData('05 Jun 2023', '$4.99', 'View Invoice'),
];

export const BillingAccount = () => {

    return (
        <Stack spacing={3}>
            <Card>
                <CardHeader title={'Change Plan'}
                            subheader={'You can upgrade and downgrade whenever you want'}
                />
                <CardContent>
                    <div>
                        <Grid container spacing={3} sx={{marginBottom: 1}}>
                            <Grid xs={12} sm={4}>
                                <Card sx={{borderStyle: 'solid', borderWidth: '2px', borderColor: 'rgb(99, 102, 241)'}}>
                                    <CardContent>
                                        <Box sx={{width: 52, height: 52}}>
                                            <Logo/>
                                        </Box>

                                        <Box mt={1} mb={1} display={'flex'}>
                                            <Typography component={'h5'} variant="h5">$0.00</Typography>
                                            <Typography component={'p'} variant="body2"
                                                        sx={{marginTop: 'auto', marginLeft: '4px'}}>/mo</Typography>
                                        </Box>
                                        <Stack>
                                            <Typography component={'span'}>Startup</Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid xs={12} sm={4}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{width: 52, height: 52}}>
                                            <Logo/>
                                        </Box>

                                        <Box mt={1} mb={1} display={'flex'}>
                                            <Typography component={'h5'} variant="h5">$0.00</Typography>
                                            <Typography component={'p'} variant="body2"
                                                        sx={{marginTop: 'auto', marginLeft: '4px'}}>/mo</Typography>
                                        </Box>
                                        <Stack>
                                            <Typography component={'span'}>Startup</Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid xs={12} sm={4}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{width: 52, height: 52}}>
                                            <Logo/>
                                        </Box>

                                        <Box mt={1} mb={1} display={'flex'}>
                                            <Typography component={'h5'} variant="h5">$0.00</Typography>
                                            <Typography component={'p'} variant="body2"
                                                        sx={{marginTop: 'auto', marginLeft: '4px'}}>/mo</Typography>
                                        </Box>
                                        <Stack>
                                            <Typography component={'span'}>Startup</Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                    <Divider/>

                    <Box display={'flex'} justifyContent={'space-between'} mt={3}>
                        <Typography component={'h6'} variant="h6">Billing Details</Typography>
                        <Button color="inherit" startIcon={(
                            <SvgIcon fontSize="small">
                                <PencilIcon/>
                            </SvgIcon>
                        )}
                        >
                            Edit
                        </Button>
                    </Box>
                    <Box sx={{
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        borderRadius: '8px',
                        borderColor: 'rgb(242, 244, 247)'
                    }}>
                        <List>
                            <ListItem>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Typography component={'h6'} variant="subtitle2">Billing name</Typography>
                                </ListItemText>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Box flexGrow={1} flexShrink={1} flexBasis={'0%'}>
                                        <Typography component={'p'} variant="body2">Andre Torneiro</Typography>
                                    </Box>
                                </ListItemText>
                            </ListItem>
                            <Divider/>
                            <ListItem>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Typography component={'h6'} variant="subtitle2">Card number</Typography>
                                </ListItemText>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Box flexGrow={1} flexShrink={1} flexBasis={'0%'}>
                                        <Typography component={'p'} variant="body2">**** 1111</Typography>
                                    </Box>
                                </ListItemText>
                            </ListItem>
                            <Divider/>
                            <ListItem>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Typography component={'h6'} variant="subtitle2">Country</Typography>
                                </ListItemText>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Box flexGrow={1} flexShrink={1} flexBasis={'0%'}>
                                        <Typography component={'p'} variant="body2">Portugal</Typography>
                                    </Box>
                                </ListItemText>
                            </ListItem>
                            <Divider/>
                            <ListItem>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Typography component={'h6'} variant="subtitle2">Zip / Postal Code</Typography>
                                </ListItemText>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Box flexGrow={1} flexShrink={1} flexBasis={'0%'}>
                                        <Typography component={'p'} variant="body2">4715</Typography>
                                    </Box>
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Box>

                    <Typography component={'p'} variant="body2" mt={3}>
                        We cannot refund once you purchased a subscription, but you can always
                        <Typography component={'a'} variant="body2" color={'primary'} ml={'4px'}>Cancel</Typography>
                    </Typography>
                    <Box display={'flex'} justifyContent={'flex-end'} mt={3}>
                        <Button variant="contained">Upgrade plan</Button>
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title={'Invoice Details'}
                            subheader={'Change your invoice details here'}
                            action={
                                <Button color="inherit" startIcon={(
                                    <SvgIcon fontSize="small">
                                        <PencilIcon/>
                                    </SvgIcon>
                                )}
                                >
                                    Edit
                                </Button>
                            }
                />

                <CardContent>
                    <Box sx={{
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        borderRadius: '8px',
                        borderColor: 'rgb(242, 244, 247)'
                    }}>
                        <List>
                            <ListItem>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Typography component={'h6'} variant="subtitle2">Billing name</Typography>
                                </ListItemText>
                                <Typography component={'p'} variant="body2" textAlign={'left'}>Andre Torneiro</Typography>
                            </ListItem>
                            <Divider/>
                            <ListItem>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Typography component={'h6'} variant="subtitle2">NIF</Typography>
                                </ListItemText>
                                <Typography component={'p'} variant="body2" textAlign={'left'}>111 111 111</Typography>
                            </ListItem>
                            <Divider/>
                            <ListItem>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Typography component={'h6'} variant="subtitle2">Country</Typography>
                                </ListItemText>
                                <Typography component={'p'} variant="body2" textAlign={'left'}>Portugal</Typography>
                            </ListItem>
                            <Divider/>
                            <ListItem>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Typography component={'h6'} variant="subtitle2">Address</Typography>
                                </ListItemText>
                                <Typography component={'p'} variant="body2" textAlign={'left'}>Rua A nº2 1ºDrt</Typography>
                            </ListItem>
                            <Divider/>
                            <ListItem>
                                <ListItemText sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Typography component={'h6'} variant="subtitle2">Zip / Postal Code</Typography>
                                </ListItemText>
                                <Typography component={'p'} variant="body2" textAlign={'left'}>4715</Typography>
                            </ListItem>
                        </List>
                    </Box>

                    <Box display={'flex'} justifyContent={'flex-end'} mt={3}>
                        <Button variant="contained">Update</Button>
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title={'Invoice history'}
                            subheader={'You can view and download all your previous invoices here. If you’ve just made a payment, it may take a few hours for it to appear in the table below.'}
                />

                <Table sx={{width: '100%'}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Total (incl. tax)</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.date}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {row.date}
                                </TableCell>
                                <TableCell align="right">{row.total}</TableCell>
                                <TableCell align="right">
                                    <Button color="inherit" startIcon={(
                                        <SvgIcon fontSize="small">
                                            <RemoveRedEyeIcon/>
                                        </SvgIcon>
                                    )}
                                    >
                                        {row.view}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </Card>

        </Stack>
    )
}