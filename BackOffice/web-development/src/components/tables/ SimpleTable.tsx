import {Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {TableProps} from "@/utils/components";
import React from "react";
import {format} from "date-fns";


export const SimpleTable: React.FC<TableProps> = (props) => {

    const {columnsName, rows, sx} = props
    return (
        <TableContainer component={Paper}>
            <Table sx={sx}>
                <TableHead>
                    <TableRow>
                        {
                            columnsName.map(column =>
                                <TableCell key={column}>
                                    {column}
                                </TableCell>
                            )
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rows.map((row) => (
                                <TableRow
                                    hover
                                    key={row.id}
                                >
                                    <TableCell>
                                        {row.ref}
                                    </TableCell>
                                    <TableCell>
                                        {row.customer.name}
                                    </TableCell>
                                    <TableCell>
                                        {format(row.createdAt, 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={row.status}
                                              color={row.status === "delivered" ? "success" : "error"}
                                        />
                                        {/*<SeverityPill color={statusMap[row.status]}>*/}
                                        {/*    */}
                                        {/*</SeverityPill>*/}
                                    </TableCell>
                                </TableRow>
                            )
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}