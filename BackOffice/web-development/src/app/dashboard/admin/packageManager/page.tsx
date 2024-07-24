import {Box, Card, Container, Divider, Stack, SvgIcon, Typography} from "@mui/material";
import React from "react";
import Button from "@mui/material/Button";
import {PlusIcon} from "@heroicons/react/24/outline";
import {SearchBar} from "@/components/search-bar";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CollapsibleTable from "@/components/tables/CollapsableTable";

export default function Page(){
    return (
        <>
                <Box component="main" sx={{flexGrow: 1, py: 8}}>
                    <Container maxWidth="xl">
                        <Stack spacing={3}>
                            <Stack direction="row" justifyContent="space-between" spacing={4}>
                                <Stack spacing={1}>
                                    <Typography variant="h4">Packages</Typography>
                                    <Stack alignItems="center" direction="row" spacing={1}>
                                        <Typography variant="body2">Products </Typography>
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
                            <Card>
                                <div>
                                    <SearchBar placeholderText={'Search Package'} sx={{width: '100%', m:1}}/>
                                    <Divider/>
                                    <Box sx={{height:'100%', m:2}}>
                                        <Typography variant="body1">No filters applied</Typography>
                                    </Box>
                                    <Divider/>
                                    <Stack direction="row" spacing={3}>
                                        <Button color='inherit' endIcon={<KeyboardArrowDownIcon />}>
                                            Category
                                        </Button>
                                        <Button color='inherit' endIcon={<KeyboardArrowDownIcon />}>
                                            Status
                                        </Button>
                                        <Button color='inherit' endIcon={<KeyboardArrowDownIcon />}>
                                            Stock
                                        </Button>
                                    </Stack>
                                </div>
                                <div>
                                    <CollapsibleTable/>
                                </div>
                            </Card>
                        </Stack>
                    </Container>
                </Box>
        </>
    )
}