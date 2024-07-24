import {OverviewProductsProps} from "@/utils/pages";
import React from "react";
import {Box, Button, Card, CardContent, CardHeader, Paper, Table,
    TableBody,
    TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

const currencies = [
    {
        value: 1,
        label: 'Resend last invoice',
    },
    {
        value: 2,
        label: 'Send password reset',
    },
    {
        value: 3,
        label: 'Send verification',
    }
]

function createData(
    mailType: string,
    date: string,
) {
    return { mailType: mailType, date: date};
}

const rows = [
    createData('Order confirmation','22/08/2023 | 09:39'),
    createData('Order confirmation', '21/08/2023 | 03:24')
];


export const CustomerEmailCard: React.FC<OverviewProductsProps> = (props) => {

    const {products = [], sx} = props;


    return (
        <Card sx={sx}>
            <CardHeader title="Emails"/>
            <CardContent>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { mb: 2, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    alignContent='center'
                >

                <TextField
                    id="outlined-select-currency-native"
                    select
                    defaultValue={1}
                    SelectProps={{
                        native: true,
                    }}
                >
                    {currencies.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
                </Box>
                <Button variant="contained" endIcon={<SendIcon />}>
                    Send Email
                </Button>

                <TableContainer component={Paper} sx={{mt:4}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Email Type</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.mailType}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.mailType}
                                    </TableCell>
                                    <TableCell align="right">{row.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    )
}