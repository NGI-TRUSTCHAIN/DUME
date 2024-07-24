'use client'

import {
    Avatar,
    Card,
    CardContent, Chip,
    FilledInput,
    FormControl,
    InputAdornment,
    InputLabel,
    Stack,
    Table, TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React from "react";
import Button from "@mui/material/Button";
import MailIcon from '@mui/icons-material/Mail';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function createData(
    name: string,
    email: string,
    role: string,
    icon: string,
) {
    return {name, email, role, icon};
}

const rows = [
    createData('Cao Yu', 'cao.yu@devias.io', 'Owner', 'assets/avatars/avatar-alcides-antonio.png'),
    createData('Cao Yu', 'cao.yu@devias.io', 'Standard', 'assets/avatars/avatar-siegbert-gottfried.png'),

];

export const TeamAccount = () => {

    return (
        <Card>
            <CardContent>
                <Grid container spacing={3} mt={3}>
                    <Grid xs={12} md={4}>
                        <Stack spacing={1}>
                            <Typography component={'h6'} variant="h6">Invite members</Typography>
                            <Typography component={'p'} variant="body2">You currently pay for 2
                                Editor Seats.</Typography>
                        </Stack>
                    </Grid>

                    <Grid xs={12} md={8}>
                        <Stack direction="row" alignItems="center">
                            <FormControl fullWidth sx={{m: 1, flexGrow: 1}} variant="filled">
                                <InputLabel htmlFor="filled-with-icon-adornment">Email</InputLabel>
                                <FilledInput
                                    id="filled-with-icon-adornment"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <MailIcon/>
                                        </InputAdornment>
                                    }

                                />
                            </FormControl>

                            <Button variant="contained" sx={{ml: 3}}> Invite </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>

            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Member</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                <Stack direction="row" alignItems={'center'} spacing={1}>
                                    <Avatar
                                        src={row.icon}
                                        sx={{width: 48, height: 48}}
                                    />
                                    <Stack spacing={1}>
                                        <Typography>{row.name}</Typography>
                                        <Stack direction="row" spacing={1} alignItems={'center'}>
                                            <Typography>{row.email}</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Chip label={row.role} color={row.role === "Owner" ? "primary" : "warning"}/>
                            </TableCell>
                            <TableCell align="right">
                                <MoreHorizIcon/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}


