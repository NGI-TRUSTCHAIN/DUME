import {
    Card,
    CardHeader,
    Chip,
    IconButton,
    Paper,
    SvgIcon,
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
import {ArrowSmallRightIcon} from "@heroicons/react/24/solid";

function createData(
    ID: string,
    Date: string,
    Total: number,
    Status: string,
    Actions: React.ReactElement,
) {
    return {ID, Date, Total, Status, Actions};
}

const rows = [
    createData('#528651571NT', 'Aug 27,2023', 1358.75, 'Paid', <ArrowSmallRightIcon/>),
    createData('#311658671JR', 'Aug 27,2023', 1451.75, 'Unpaid', <ArrowSmallRightIcon/>),

];

export const InvoicesTab = () => {

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

    return (
        <Card>
            <CardHeader title="Invoices"
                        action={
                <IconButton aria-label="settings">
                    <MoreHoriz/>
                </IconButton>
            }
            />
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.ID}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {row.ID}
                                </TableCell>
                                <TableCell align="right">{row.Date}</TableCell>
                                <TableCell align="right">{row.Total}</TableCell>
                                <TableCell align="right">
                                    <Chip label={row.Status}
                                          color={row.Status === "Paid" ? "success" : "error"}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <SvgIcon>
                                        {row.Actions}
                                    </SvgIcon>
                                </TableCell>
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