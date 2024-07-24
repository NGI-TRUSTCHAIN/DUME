import {
    Card,
    CardHeader,
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";
import React from "react";

function createData(
    Method: string,
    Date: string,
    Event: string,
    Status: number,
    IP: string,
    Path:string
) {
    return { Method, Date, IP, Status, Path, Event};
}

const rows = [
    createData('POST', '2023/08/25 11:09:17', 'Purchase', 200, '84.234.243.42','/api/purchase'),
    createData('POST', '2023/08/25 11:09:17',	'Purchase', 522,	'84.234.243.42', '/api/purchase'),
    createData('GET', '2023/08/25 10:51:19', 'Cart add', 200, '84.234.243.42','/api/products/d65654e/add'),
    createData('POST', '2023/08/25 11:03:50',	'Cart remove', 200,	'84.234.243.42', '/api/products/d65654e/remove'),

];

export const LogsTab = () => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

    return(
        <Card>
            <CardHeader title="Invoices"
                        action={
                <IconButton aria-label="settings">
                    <MoreHoriz />
                </IconButton>
            }/>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Method</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Path</TableCell>
                            <TableCell align="right">Event</TableCell>
                            <TableCell align="right">IP</TableCell>
                            <TableCell align="right">Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.Method}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.Method}
                                </TableCell>
                                <TableCell align="right">
                                    <Chip label={row.Status}
                                          color={row.Status === 200 ? "success" : "error"}
                                    />
                                </TableCell>
                                <TableCell align="right">{row.Path}</TableCell>
                                <TableCell align="right">{row.Event}</TableCell>
                                <TableCell align="right">{row.IP}</TableCell>
                                <TableCell align="right">{row.Date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={100}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Card>
    )
}