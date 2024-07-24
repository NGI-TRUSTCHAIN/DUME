'use client'

import {
    Avatar,
    Box,
    Card,
    Container,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import NextLink from "next/link";
import Button from "@mui/material/Button";
import WestIcon from '@mui/icons-material/West';
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Logo } from "@/src/components/logo";

export default function Page() {

       return (
        <>
                <Box component="main"
                     sx={{
                         flexGrow: 1,
                         py: 8
                     }}>
                    <Container maxWidth="lg">
                        <Stack divider={<Divider sx={{marginTop: 4}}/>}>
                            <Stack>
                                <div>
                                    <Button sx={{color: "rgb(17, 25, 39)"}} variant="text" startIcon={<WestIcon/>}
                                            component={NextLink} href="/user/invoices">
                                        Invoices
                                    </Button>
                                </div>

                                <Stack mt={4} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                    <Stack alignItems={'center'} direction={'row'}>
                                        <Avatar sx={{
                                            width: 42,
                                            height: 42,
                                            color: 'rgb(0, 0, 0)',
                                            backgroundColor: 'rgb(229, 231, 235)'
                                        }}>
                                            A
                                        </Avatar>
                                        <div style={{marginLeft: 16}}>
                                            <Typography component={'h6'}>
                                                <b>INV-0019</b>
                                            </Typography>
                                            <Typography component={'p'} variant='body2'
                                                        sx={{color: 'rgb(108, 115, 127)'}}>
                                                API
                                            </Typography>
                                        </div>
                                    </Stack>

                                    <Stack ml={4} alignItems={'center'} direction={'row'}>
                                        <Button sx={{color: "rgb(17, 25, 39)"}} variant="text"
                                                component={NextLink} href="/invoices">
                                            Preview
                                        </Button>

                                        <Button variant="contained" component={NextLink} href="/invoices">
                                            Download
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Stack>

                            <Card sx={{marginTop: 4, padding: 6}}>
                                <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
                                    <div>
                                        <Box display={'inline-flex'} height={24} width={24}>
                                            <Logo/>
                                        </Box>

                                        <Typography component={'h6'}>
                                            <b>theia.logimade.pt</b>
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography component={'h6'} variant={'h5'} sx={{color: 'rgb(16, 185, 129)'}}>
                                            PAID
                                        </Typography>

                                        <Typography component={'h6'}>
                                            INV-0019
                                        </Typography>
                                    </div>
                                </Stack>

                                <Box mt={4}>
                                    <Grid container>
                                        <Grid xs={12} md={4}>
                                            <Typography component={'p'} variant={'body2'}>
                                                Street King William, 123
                                            </Typography>
                                            <Typography component={'p'} variant={'body2'}>
                                                Level 2, C, 442456
                                            </Typography>
                                            <Typography component={'p'} variant={'body2'}>
                                                San Francisco, CA, USA
                                            </Typography>
                                        </Grid>

                                        <Grid xs={12} md={4} justifyContent={'space-between'}>
                                            <Typography component={'p'} variant={'body2'}>
                                                Company No. 4675933
                                            </Typography>
                                            <Typography component={'p'} variant={'body2'}>
                                                EU VAT No. 949 67545 45
                                            </Typography>

                                        </Grid>

                                        <Grid xs={12} md={4}>
                                            <Typography component={'p'} variant={'body2'} textAlign={'right'}>
                                                client@theia.io
                                            </Typography>
                                            <Typography component={'p'} variant={'body2'} textAlign={'right'}>
                                                (+40) 652 3456 23
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box mt={4}>
                                    <Grid container>
                                        <Grid xs={12} md={4}>
                                            <Typography component={'p'} variant={'body2'}>
                                                <b>Due date</b>
                                            </Typography>
                                            <Typography component={'p'} variant={'body2'}>
                                                20 Sep 2023
                                            </Typography>
                                        </Grid>

                                        <Grid xs={12} md={4} justifyContent={'space-between'}>
                                            <Typography component={'p'} variant={'body2'}>
                                                <b>Date of issue</b>
                                            </Typography>
                                            <Typography component={'p'} variant={'body2'}>
                                                15 Sep 2023
                                            </Typography>

                                        </Grid>

                                        <Grid xs={12} md={4}>
                                            <Typography component={'p'} variant={'body2'} >
                                                <b>Number</b>
                                            </Typography>
                                            <Typography component={'p'} variant={'body2'}>
                                                INV-0019
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box mt={4}>
                                    <Typography component={'p'} variant={'body2'}>
                                        <b>Billed to</b>
                                    </Typography>

                                    <Typography component={'p'} variant={'body2'}>
                                        ACME SRL
                                    </Typography>

                                    <Typography component={'p'} variant={'body2'}>
                                        Countdown Grey Lynn
                                    </Typography>

                                    <Typography component={'p'} variant={'body2'}>
                                        6934656584231
                                    </Typography>

                                    <Typography component={'p'} variant={'body2'}>
                                        271 Richmond Rd, Grey Lynn, Auckland 1022, New Zealand
                                    </Typography>
                                </Box>

                                <Table sx={{marginTop:4, minWidth: 700 }} aria-label="spanning table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell align="left">Description.</TableCell>
                                            <TableCell align="left">QTY</TableCell>
                                            <TableCell align="left">Unit Price</TableCell>
                                            <TableCell align="left">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>1</TableCell>
                                            <TableCell align="left">
                                                API Subscription (12/05/2019 - 11/06/2019)
                                            </TableCell>
                                            <TableCell align="left">1</TableCell>
                                            <TableCell align="left">$55.50</TableCell>
                                            <TableCell align="left">$55.50</TableCell>
                                        </TableRow>

                                        <TableRow sx={{ "& td": { border: 0 } }}>
                                            <TableCell colSpan={3} />
                                            <TableCell>
                                                <b>Subtotal</b>
                                            </TableCell>
                                            <TableCell><b>$50.50</b></TableCell>
                                        </TableRow>

                                        <TableRow sx={{ "& td": { border: 0 } }}>
                                            <TableCell colSpan={3} />
                                            <TableCell><b>Taxes</b></TableCell>
                                            <TableCell><b>$5.00</b></TableCell>
                                        </TableRow>

                                        <TableRow sx={{ "& td": { border: 0 } }}>
                                            <TableCell colSpan={3} />
                                            <TableCell><b>Total</b></TableCell>
                                            <TableCell><b>$55.50</b></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Card>
                        </Stack>
                    </Container>
                </Box>
        </>
    )
}

