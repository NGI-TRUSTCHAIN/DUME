'use client'

import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Container,
    IconButton, ListItemText,
    Stack,
    SvgIcon,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead, TablePagination,
    TableRow,
    Tabs,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React from "react";
import Button from "@mui/material/Button";
import {BellIcon, PencilIcon, PlusIcon, XMarkIcon} from "@heroicons/react/24/solid";
import CheckIcon from "@mui/icons-material/Check";
import {SearchBar} from "@/components/search-bar";
import {SelectFilter} from "@/components/native-select";
import FavoriteIcon from '@mui/icons-material/Favorite';
import MultipleSelectCheckmarks from "@/components/select/Checkmarks";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Data {
    date: string;
    time: string;
    event: string;
    status: string;
    color: string,
    annotation: string
}

function createData(
    date: string,
    time: string,
    event: string,
    status: string,
    color: string,
    annotation: string
): Data {
    return {
        date,
        time,
        event,
        status,
        color,
        annotation
    };
}

const rows = [
    createData('23 Aug 2023', '2:55 PM', 'xxx', 'Confirmed', 'success', 'CardBoard'),
    createData('23 Aug 2023', '2:55 PM', 'xxx', 'Unconfirmed', 'error', 'Plastic Bag'),
    createData('23 Aug 2023', '2:55 PM', 'xxx', 'Submitted for Confirmation', 'primary', 'Rails'),
    createData('23 Aug 2023', '2:55 PM', 'xxx', 'Submitted for Manual Confirmation', 'warning', 'Traffic Sign'),

];


export default function Page(){

    const [value, setValue] = React.useState(0);

    const [page, setPage] = React.useState(2);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
                <Box component="main"
                     sx={{
                         flexGrow: 1,
                         py: 8
                     }}>
                    <Container maxWidth="xl">
                        <Grid container spacing={3}>
                            <Grid xs={12}>
                                <Stack direction="row" justifyContent="space-between" spacing={4}>
                                    <Typography noWrap variant="h4">Annotations List</Typography>
                                    <div>
                                        <Button
                                            startIcon={(
                                                <SvgIcon fontSize="small">
                                                    <PencilIcon/>
                                                </SvgIcon>
                                            )}
                                            variant="contained"
                                        >
                                            Annotate
                                        </Button>
                                    </div>
                                </Stack>
                            </Grid>

                            <Grid xs={12} sm={6} lg={3}>
                                <Card sx={{height: '100%'}}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start"
                                               spacing={3}>
                                            <Stack spacing={1}>
                                                <Typography
                                                    color="text.secondary"
                                                    variant="overline"
                                                >
                                                    Created
                                                </Typography>
                                                <Typography variant="h4">
                                                    5
                                                </Typography>
                                            </Stack>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: 'primary.main',
                                                    height: 56,
                                                    width: 56
                                                }}
                                            >
                                                <SvgIcon>
                                                    <PlusIcon/>
                                                </SvgIcon>
                                            </Avatar>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid xs={12} sm={6} lg={3}>
                                <Card sx={{height: '100%'}}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start"
                                               spacing={3}>
                                            <Stack spacing={1}>
                                                <Typography
                                                    color="text.secondary"
                                                    variant="overline"
                                                >
                                                    Confirmed
                                                </Typography>
                                                <Typography variant="h4">
                                                    10
                                                </Typography>
                                            </Stack>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: 'success.main',
                                                    height: 56,
                                                    width: 56
                                                }}
                                            >
                                                <SvgIcon>
                                                    <CheckIcon/>
                                                </SvgIcon>
                                            </Avatar>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid xs={12} sm={6} lg={3}>
                                <Card sx={{height: '100%'}}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start"
                                               spacing={3}>
                                            <Stack spacing={1}>
                                                <Typography
                                                    color="text.secondary"
                                                    variant="overline"
                                                >
                                                    Unconfirmed
                                                </Typography>
                                                <Typography variant="h4">
                                                    10
                                                </Typography>
                                            </Stack>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: 'error.main',
                                                    height: 56,
                                                    width: 56
                                                }}
                                            >
                                                <SvgIcon>
                                                    <XMarkIcon/>
                                                </SvgIcon>
                                            </Avatar>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid xs={12} sm={6} lg={3}>
                                <Card sx={{height: '100%'}}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start"
                                               spacing={3}>
                                            <Stack spacing={1}>
                                                <Typography
                                                    color="text.secondary"
                                                    variant="overline"
                                                >
                                                    Submitted
                                                </Typography>
                                                <Typography variant="h4">
                                                    10
                                                </Typography>
                                            </Stack>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: 'warning.main',
                                                    height: 56,
                                                    width: 56
                                                }}
                                            >
                                                <SvgIcon>
                                                    <BellIcon/>
                                                </SvgIcon>
                                            </Avatar>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid xs={12}>
                                <Card>
                                    <CardHeader title={'Annotations Status'}/>
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="icon position tabs example"
                                        sx={{paddingX: '20px', marginBottom: 1, marginLeft: 1}}
                                    >
                                        <Tab label="All" iconPosition="end"
                                             icon={
                                                 <Box component={'span'} sx={{
                                                     marginLeft: 1, height: '24px',
                                                     borderRadius: '8px',
                                                     paddingX: '8px', backgroundColor: 'rgb(33, 43, 54)',
                                                     color:'rgb(255, 255, 255)'
                                                 }}>10</Box>
                                             }
                                        />

                                        <Tab label="Confirmed" iconPosition="end"
                                             icon={
                                                 <Box component={'span'} sx={{
                                                     marginLeft: 1, height: '24px',
                                                     borderRadius: '8px',
                                                     paddingX: '8px', backgroundColor: 'rgb(57,143,86)',
                                                     color:'rgb(255, 255, 255)'
                                                 }}>10</Box>
                                             }/>

                                        <Tab label="Unconfirmed" iconPosition="end"
                                             icon={
                                                 <Box component={'span'} sx={{
                                                     marginLeft: 1, height: '24px',
                                                     borderRadius: '8px',
                                                     paddingX: '8px', backgroundColor: 'rgb(183, 29, 24)',
                                                     color:'rgb(255, 255, 255)'
                                                 }}>10</Box>
                                             }/>

                                        <Tab label="Submitted for Confirmation" iconPosition="end"
                                             icon={
                                                 <Box component={'span'} sx={{
                                                     marginLeft: 1, height: '24px',
                                                     borderRadius: '8px',
                                                     paddingX: '8px', backgroundColor: 'rgb(183, 110, 0)',
                                                     color:'rgb(255, 255, 255)'
                                                 }}>10</Box>
                                             }/>

                                        <Tab label="Submitted for Manual Confirmation"
                                             iconPosition="end"
                                             icon={
                                                 <Box component={'span'} sx={{
                                                     marginLeft: 1, height: '24px',
                                                     borderRadius: '8px',
                                                     paddingX: '8px', backgroundColor: 'rgb(99, 115, 129)',
                                                     color:'rgb(255, 255, 255)'
                                                 }}>10</Box>
                                             }/>
                                    </Tabs>


                                    <Stack spacing={2} ml={2}>
                                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                            <MultipleSelectCheckmarks/>
                                            <SearchBar placeholderText={'Search Annotation'} sx={{width: '60%'}}/>
                                            <SelectFilter/>
                                        </Stack>

                                        <Table sx={{minWidth: 800}}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Annotation</TableCell>
                                                    <TableCell>Date & Time</TableCell>
                                                    <TableCell>Event Type</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.map((row) => (
                                                    <TableRow
                                                        key={row.date}
                                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                    >
                                                        <TableCell component="th" scope="row" align="left">
                                                            {row.annotation}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <ListItemText primary={row.date} secondary={row.time}/>
                                                        </TableCell>
                                                        <TableCell align="left">{row.event}</TableCell>
                                                        <TableCell align="left">
                                                            <Chip label={row.status}
                                                                  color={row.color as "success" | "error" | "primary" | "warning"}/>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                                <IconButton>
                                                                    <EditIcon/>
                                                                </IconButton>

                                                                <IconButton aria-label="delete" color={'error'}>
                                                                    <DeleteIcon/>
                                                                </IconButton>

                                                                <IconButton>
                                                                    <VisibilityIcon/>
                                                                </IconButton>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            component="div"
                                            count={100}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            rowsPerPage={rowsPerPage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </Stack>
                                </Card>
                            </Grid>

                        </Grid>
                    </Container>
                </Box>
        </>
    )
}
