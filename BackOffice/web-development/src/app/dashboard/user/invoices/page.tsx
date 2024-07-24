'use client'

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Drawer,
    FormControlLabel,
    FormGroup,
    FormLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Paper,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import React from "react";
import FormControl from "@mui/material/FormControl";
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddIcon from '@mui/icons-material/Add';
import {styled} from '@mui/material/styles';
import Grid from "@mui/material/Unstable_Grid2";
import EastIcon from '@mui/icons-material/East';
import CloseIcon from '@mui/icons-material/Close';
import {InvoicesPaid, InvoicesPending, InvoicesTotal } from "@/components/svg-icons";
import NextLink from "next/link";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

const drawerWidth = 380;


const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
    open?: boolean;
}>(({theme, open}) => ({
    flexGrow: 1,
    padding: '64px 24px',
    zIndex: 1,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

function createData(
    invoice: string,
    plan: string,
    price: number,
    dateIssued: string,
    dateDue: string,
    status: string
) {
    return {invoice, plan, price, dateIssued, dateDue, status};
}

const rowsPaid = [
    createData('INV-0019', 'API', 55.50, '13/09/2023', '18/09/2023', 'Paid'),
    createData('INV-0018', 'Map', 688.90, '13/09/2023', '19/09/2023', 'Paid'),
    createData('INV-0017', 'Occurrence', 695.20, '13/09/2023', '22/09/2023', 'Paid'),

];

const rowsPending = [
    createData('INV-0021', 'Full-API', 23.11, '11/09/2023', '08/10/2023', 'Pending'),
    createData('INV-0020', 'Full-Map', 253.76, '11/09/2023', '30/09/2023', 'Pending'),
]


export default function Page() {

    const [open, setOpen] = React.useState(true);

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
                     display: 'flex',

                 }}>


                <Drawer
                    sx={{
                        flexShrink: 0,
                        padding: 3,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            boxShadow: 'rgba(0, 0, 0, 0.08) 0px 6px 30px',
                            border: 'medium',
                            borderRadius: '20px',
                            height: '100%',
                            zIndex: 1200,
                            maxWidth: '100%',
                            color: 'rgb(17, 25, 39)',
                            backgroundColor: 'rgb(255, 255, 255)',
                            position: 'relative',
                            marginTop: '30px'
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <div>
                        <Stack alignItems={'center'} justifyContent={'space-between'} padding={3}
                               sx={{display: 'flex', flexDirection: 'row'}}>
                            <Typography component={'h5'} variant='h5'>Filters</Typography>
                            <IconButton onClick={() => setOpen(!open)} sx={{display: {md: 'block', lg: 'none'}}}>
                                <CloseIcon/>
                            </IconButton>
                        </Stack>

                        <Stack padding={3} sx={{display: 'flex', flexDirection: 'column'}}>
                            <FormControl fullWidth sx={{m: 1}}>
                                <InputLabel htmlFor="outlined-adornment-invoice"></InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-invoice"
                                    startAdornment={<InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>}
                                    placeholder="Invoice number"
                                />
                            </FormControl>

                            <div style={{marginTop: '24px'}}>
                                <FormLabel color={'primary'}>Issue Date</FormLabel>
                                <Stack spacing={2} mt={2}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label={'From'}/>
                                    </LocalizationProvider>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label={'To'}/>
                                    </LocalizationProvider>
                                </Stack>
                            </div>

                            <div style={{marginTop: '24px'}}>
                                <FormLabel color={'primary'}>From Plan</FormLabel>
                                <Box sx={{
                                    backgroundColor: 'rgb(248, 249, 250)',
                                    borderColor: 'rgb(242, 244, 247)',
                                    borderRadius: 1,
                                    borderStyle: 'solid',
                                    borderWidth: '1px'
                                }}
                                >

                                    <FormGroup sx={{paddingX: '12px', paddingY: 1, flexFlow: 'column wrap'}}>
                                        <FormControlLabel sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            marginRight: 2,
                                            marginLeft: '-11px'
                                        }} control={<Checkbox/>} label="API"/>
                                        <FormControlLabel sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            marginRight: 2,
                                            marginLeft: '-11px'
                                        }} control={<Checkbox/>} label="Map"/>
                                        <FormControlLabel sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            marginRight: 2,
                                            marginLeft: '-11px'
                                        }} control={<Checkbox/>} label="Occurrence"/>
                                        <FormControlLabel sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            marginRight: 2,
                                            marginLeft: '-11px'
                                        }} control={<Checkbox/>} label="Full-API"/>
                                        <FormControlLabel sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            marginRight: 2,
                                            marginLeft: '-11px'
                                        }} control={<Checkbox/>} label="Full-Map"/>
                                    </FormGroup>
                                </Box>
                            </div>

                            <FormControlLabel
                                value="end"
                                control={<Switch color="primary"/>}
                                label="Paid Only"
                                labelPlacement="end"
                                sx={{marginTop: 3}}
                            />

                            <FormControlLabel
                                value="end"
                                control={<Switch color="primary"/>}
                                label="Group by Status"
                                labelPlacement="end"
                                sx={{marginTop: 3}}
                            />
                        </Stack>
                    </div>
                </Drawer>
                <Main open={open}>
                    <Stack>
                        <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
                            <div>
                                <Typography component={'h4'} variant={'h4'}>Invoices</Typography>
                            </div>
                            <Stack ml={3} direction={'row'} alignItems={'center'}>
                                <Button onClick={() => setOpen(!open)} color="inherit" variant="text"
                                        startIcon={<FilterAltOutlinedIcon/>}>
                                    Filters
                                </Button>

                                <Button variant="contained" startIcon={<AddIcon/>}>
                                    New
                                </Button>
                            </Stack>
                        </Stack>
                        <div style={{marginTop: 32}}>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={6} lg={4}>
                                    <Card>
                                        <CardContent>
                                            <Stack direction={'row'} alignItems={'center'}>
                                                <Avatar sx={{
                                                    width: 48,
                                                    height: 48,
                                                    color: 'rgb(0, 0, 0)',
                                                    backgroundColor: 'rgb(229, 231, 235)'
                                                }}>
                                                    <InvoicesTotal/>
                                                </Avatar>
                                                <div style={{marginLeft: 16}}>
                                                    <Typography>Total</Typography>
                                                    <Typography variant={'h6'}>$5,300.00</Typography>
                                                    <Typography>from 12 invoices</Typography>
                                                </div>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid xs={12} md={6} lg={4}>
                                    <Card>
                                        <CardContent>
                                            <Stack direction={'row'} alignItems={'center'}>
                                                <Avatar sx={{
                                                    width: 48,
                                                    height: 48,
                                                    color: 'rgb(16, 185, 129)',
                                                    backgroundColor: 'rgb(240, 253, 249)'
                                                }}>
                                                    <InvoicesPaid/>
                                                </Avatar>
                                                <div style={{marginLeft: 16}}>
                                                    <Typography>Paid</Typography>
                                                    <Typography variant={'h6'}>$4,000.00</Typography>
                                                    <Typography>from 12 invoices</Typography>
                                                </div>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid xs={12} md={6} lg={4}>
                                    <Card>
                                        <CardContent>
                                            <Stack direction={'row'} alignItems={'center'}>
                                                <Avatar sx={{
                                                    width: 48, height: 48,
                                                    color: 'rgb(247, 144, 9)',
                                                    backgroundColor: 'rgb(255, 250, 235)'
                                                }}>
                                                    <InvoicesPending/>
                                                </Avatar>
                                                <div style={{marginLeft: 16}}>
                                                    <Typography>Pending</Typography>
                                                    <Typography variant={'h6'}>$1,300.00</Typography>
                                                    <Typography>from 12 invoices</Typography>
                                                </div>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>

                            </Grid>
                        </div>

                        <Stack mt={4}>
                            <Stack spacing={6}>
                                <Stack>
                                    <Typography component={'h6'} variant='h6'>
                                        Canceled (0)
                                    </Typography>
                                </Stack>

                                <Stack>
                                    <Typography component={'h6'} variant='h6'>
                                        Paid (5)
                                    </Typography>

                                    <TableContainer component={Paper}>
                                        <Table sx={{minWidth: 650}} aria-label="simple table">
                                            <TableBody>
                                                {rowsPaid.map((row) => (
                                                    <TableRow
                                                        key={row.invoice}
                                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            <Stack alignItems={'center'} direction={'row'}
                                                                   display={'inline-flex'}
                                                            >
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
                                                                        <b>{row.invoice}</b>
                                                                    </Typography>
                                                                    <Typography component={'p'} variant='body2'
                                                                                sx={{color: 'rgb(108, 115, 127)'}}>
                                                                        {row.plan}
                                                                    </Typography>
                                                                </div>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell align="left">${row.price}</TableCell>
                                                        <TableCell align="left">
                                                            <Typography component={'h6'}>
                                                                <b>Issued</b>
                                                            </Typography>
                                                            <Typography component={'p'} variant='body2'
                                                                        sx={{color: 'rgb(108, 115, 127)'}}>
                                                                {row.dateIssued}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography component={'h6'}>
                                                                <b>Due</b>
                                                            </Typography>
                                                            <Typography component={'p'} variant='body2'
                                                                        sx={{color: 'rgb(108, 115, 127)'}}>
                                                                {row.dateDue}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Chip color={'success'} label={row.status}/>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton component={NextLink}
                                                                        href="/user/invoices/:orderId"
                                                                        aria-label="next">
                                                                <EastIcon/>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Stack>

                                <Stack>
                                    <Typography component={'h6'} variant='h6'>
                                        Pending (2)
                                    </Typography>

                                    <TableContainer component={Paper}>
                                        <Table sx={{minWidth: 650}} aria-label="simple table">
                                            <TableBody>
                                                {rowsPending.map((row) => (
                                                    <TableRow
                                                        key={row.invoice}
                                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            <Stack alignItems={'center'} direction={'row'}
                                                                   display={'inline-flex'}
                                                            >
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
                                                                        <b>{row.invoice}</b>
                                                                    </Typography>
                                                                    <Typography component={'p'} variant='body2'
                                                                                sx={{color: 'rgb(108, 115, 127)'}}>
                                                                        {row.plan}
                                                                    </Typography>
                                                                </div>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell align="left">${row.price}</TableCell>
                                                        <TableCell align="left">
                                                            <Typography component={'h6'}>
                                                                <b>Issued</b>
                                                            </Typography>
                                                            <Typography component={'p'} variant='body2'
                                                                        sx={{color: 'rgb(108, 115, 127)'}}>
                                                                {row.dateIssued}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography component={'h6'}>
                                                                <b>Due</b>
                                                            </Typography>
                                                            <Typography component={'p'} variant='body2'
                                                                        sx={{color: 'rgb(108, 115, 127)'}}>
                                                                {row.dateDue}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Chip color={'warning'} label={row.status}/>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton component={NextLink}
                                                                        href="/dashboard/user/invoices/:orderId"
                                                                        aria-label="next">
                                                                <EastIcon/>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Stack>

                            </Stack>
                            <TablePagination
                                component="div"
                                count={100}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Stack>
                    </Stack>
                </Main>

            </Box>
        </>
    )
}

