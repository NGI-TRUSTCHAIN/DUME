'use client'

import React, {useMemo, useState} from "react";
import {Box, Paper, Stack, SvgIcon, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {ArrowDownOnSquareIcon, ArrowUpOnSquareIcon, PlusIcon} from "@heroicons/react/24/outline";

import {data} from "./sections/customers-page/customers";
import {CustomersTable} from "./sections/customers-page";
import {useSelection} from "@/src/hooks/use-selection";
import {CustomTabs} from "@/src/components/Tabs/tab";
import {SearchBar} from "@/src/components/search-bar";
import {SelectFilter} from "@/src/components/native-select";
import {GenericTablePagination} from "@/src/components/pagination";
import {applyPagination} from "@/src/utils/dashboard/apply-pagination";


const useCustomers = (page: number, rowsPerPage: number) => {
    return useMemo(
        () => {
            return applyPagination(data, page, rowsPerPage);
        },
        [page, rowsPerPage]
    );
};

// @ts-ignore
const useCustomerIds = (Customers) => {
    return useMemo(
        () => {
            return Customers.map((customer: { id: any; }) => customer.id);
        },
        [Customers]
    );
};

const tabNames = [
    {id: '1', name: 'All', value: 10},
    {id: '2', name: 'Dashboard', value: 10},
    {id: '3', name: 'API', value: 10},
    {id: '4', name: 'Mobile', value: 10},
    {id: '5', name: 'Devices', value: 10}
]


export default function Page() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const customers = useCustomers(page, rowsPerPage);
    const customersIds = useCustomerIds(customers);
    const customersSelection = useSelection(customersIds);

    console.log(customers)
    const handlePageChange = (value: number) => {
        setPage(value);
    };

    const handleRowsPerPageChange = () => {
        setRowsPerPage(rowsPerPage);
        setPage(0)
    }

    return (
        <>

            <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between" spacing={4}>
                    <Stack spacing={1}>
                        <Typography variant="h4">Customers</Typography>
                        <Stack alignItems="center" direction="row" spacing={1}>
                            <Button color="inherit" startIcon={(
                                <SvgIcon fontSize="small">
                                    <ArrowUpOnSquareIcon/>
                                </SvgIcon>
                            )}
                            >
                                Import
                            </Button>
                            <Button color="inherit" startIcon={(
                                <SvgIcon fontSize="small">
                                    <ArrowDownOnSquareIcon/>
                                </SvgIcon>
                            )}
                            >
                                Export
                            </Button>
                        </Stack>
                    </Stack>
                    <div>
                        <Button
                            startIcon={(
                                <SvgIcon fontSize="small">
                                    <PlusIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                        >
                            Add
                        </Button>
                    </div>
                </Stack>
                <Paper elevation={3} sx={{borderRadius: 5}}>
                    <CustomTabs tabs={tabNames}/>
                    <Stack
                        direction={{xs: 'column', sm: 'row'}}
                        spacing={{xs: 1, sm: 2, md: 4}}
                        flexWrap="wrap"
                        sx={{display: 'flex', m: 2}}
                        alignItems='center'
                    >
                        <Box component="form" sx={{flexGrow: 1}}>
                            <SearchBar placeholderText={'Search Customer'} sx={{width: '100%'}}/>
                        </Box>
                        <SelectFilter/>
                    </Stack>
                    {/*<BasicTable/>*/}
                    <CustomersTable
                        items={customers}
                        onDeselectAll={customersSelection.handleDeselectAll}
                        onDeselectOne={customersSelection.handleDeselectOne}
                        onSelectAll={customersSelection.handleSelectAll}
                        onSelectOne={customersSelection.handleSelectOne}
                        pagination={
                            <GenericTablePagination
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                currentPage={page}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                            />}
                        selected={customersSelection.selected}
                    />
                    {/*<GenericTablePagination*/}
                    {/*    count={data.length}*/}
                    {/*    rowsPerPage={rowsPerPage}*/}
                    {/*    currentPage={page}*/}
                    {/*    onPageChange={handlePageChange}*/}
                    {/*    onRowsPerPageChange={handleRowsPerPageChange}*/}
                    {/*/>*/}
                </Paper>
            </Stack>
        </>
    )
}

