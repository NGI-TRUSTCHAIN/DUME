'use client'

import {
    Box,
    Card,
    CardContent,
    CardHeader,
    FilledInput,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import React from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";


function createData(
    type: string,
    date: string,
    address: string,
    client: string,
) {
    return {type, date, address, client};
}

const rows = [
    createData('Credential login', 'on 01:52 AM 09/05/2023', '95.130.17.84', 'Chrome, Mac OS 10.15.7'),
    createData('Credential login', 'on 23:32 PM 09/04/2023', '95.130.17.84', 'Chrome, Mac OS 10.15.7'),

];

export const SecurityAccount = () => {

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <Stack spacing={3}>
            <Card>
                <CardContent>
                    <Grid container spacing={3} mt={3}>
                        <Grid xs={12} md={4}>
                            <Typography component={'h6'} variant="h6">Change Password</Typography>
                        </Grid>

                        <Grid xs={12} md={8}>
                            <Stack direction="row" alignItems="center">
                                <FormControl fullWidth sx={{m: 1, flexGrow: 1}} variant="filled">
                                    <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                                    <FilledInput
                                        id="filled-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        defaultValue={'abcdefghgfhgfgh'}
                                    />
                                </FormControl>

                                <Button variant="text" sx={{ml: 3}}> Edit </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title={'Multi Factor Authentication'}/>
                <CardContent>
                    <Grid container spacing={4} mt={3}>
                        <Grid xs={12} sm={6}>
                            <Card>
                                <CardContent>
                                    <Box>
                                        <Box>
                                            <Typography component={'p'} variant="body2" sx={{color:'red'}}>Off</Typography>
                                        </Box>
                                        <Typography component={'h6'} variant="h6" mt={1}>
                                            Authenticator App
                                        </Typography>
                                    </Box>
                                    <Typography component={'p'} variant="body2" mt={1}>
                                        Use an authenticator app to generate one time security codes.
                                    </Typography>
                                    <Box>
                                        <Button variant="outlined"
                                                endIcon={<SendIcon />}
                                                sx={{mt: 4}}
                                        >
                                            Set Up
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <Card>
                                <CardContent>
                                    <Box>
                                        <Box>
                                            <Typography component={'p'} variant="body2" sx={{color:'red'}}>Off</Typography>
                                        </Box>
                                        <Typography component={'h6'} variant="h6" mt={1}>
                                            Text Message
                                        </Typography>
                                    </Box>
                                    <Typography component={'p'} variant="body2" mt={1}>
                                        Use your mobile phone to receive security codes via SMS.
                                    </Typography>
                                    <Box>
                                        <Button variant="outlined"
                                                endIcon={<SendIcon />}
                                                sx={{mt: 4}}
                                        >
                                            Set Up
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title={'Login history'}
                            subheader={'Your recent login activity'}
                />
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Login Type</TableCell>
                            <TableCell>IP Address</TableCell>
                            <TableCell>Client</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.type}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Stack spacing={1}>
                                        <Typography variant={'subtitle2'}>{row.type}</Typography>
                                        <Typography variant={'body2'}>{row.date}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{row.address}</TableCell>
                                <TableCell>{row.client}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </Card>
        </Stack>


    )
}