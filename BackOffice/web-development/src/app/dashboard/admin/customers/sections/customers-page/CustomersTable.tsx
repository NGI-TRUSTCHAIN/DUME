import {
    Avatar,
    Checkbox,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {format} from "date-fns";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NextLink from "next/link";

type CustomerProps = {
    id: string,
    PricingPlan: string,
    avatar: string,
    createdAt: number,
    email: string,
    name: string,
    phone: string
}

type CustomerTableProps = {
    items: CustomerProps[],
    onDeselectAll?: () => void,
    onDeselectOne?: (id: any) => void,
    onSelectAll?: () => void,
    onSelectOne?: (id: any) => void,
    pagination: React.ReactElement,
    selected: any []
}

export const CustomersTable: React.FC<CustomerTableProps> = (props) => {

    const {
        items = [],
        onDeselectAll,
        onDeselectOne,
        onSelectAll,
        onSelectOne,
        pagination,
        selected = []
    } = props;

    const selectedSome = (selected.length > 0) && (selected.length < items.length);
    const selectedAll = (items.length > 0) && (selected.length === items.length);


    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 800}}>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={selectedAll}
                                indeterminate={selectedSome}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        onSelectAll?.();
                                    } else {
                                        onDeselectAll?.();
                                    }
                                }}
                            />
                        </TableCell>
                        <TableCell>
                            Name
                        </TableCell>
                        <TableCell>
                            Email
                        </TableCell>
                        <TableCell>
                            Pricing Plan
                        </TableCell>
                        <TableCell>
                            Phone
                        </TableCell>
                        <TableCell>
                            Signed Up
                        </TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((customer) => {
                        const isSelected = selected.includes(customer.id);
                        const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                        return (
                            <TableRow
                                hover
                                key={customer.id}
                                selected={isSelected}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                onSelectOne?.(customer.id);
                                            } else {
                                                onDeselectOne?.(customer.id);
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Stack
                                        alignItems="center"
                                        direction="row"
                                        spacing={2}
                                    >
                                        <Avatar src={customer.avatar}>
                                            customer.name
                                        </Avatar>
                                        <Typography variant="subtitle2">
                                            {customer.name}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    {customer.email}
                                </TableCell>
                                <TableCell>
                                    {customer.PricingPlan}
                                </TableCell>
                                <TableCell>
                                    {customer.phone}
                                </TableCell>
                                <TableCell>
                                    {createdAt}
                                </TableCell>
                                <TableCell>
                                    <Stack direction={'row'} spacing={1}
                                           alignItems={'center'}>
                                        <IconButton component={NextLink}
                                                    href="/admin/customerEdit">
                                            <EditIcon/>
                                        </IconButton>

                                        <IconButton aria-label="delete" color={'error'}>
                                            <DeleteIcon/>
                                        </IconButton>

                                        <IconButton component={NextLink}
                                                    href="/admin/customerDetails">
                                            <VisibilityIcon/>
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            {pagination}
        </TableContainer>
    )
}
