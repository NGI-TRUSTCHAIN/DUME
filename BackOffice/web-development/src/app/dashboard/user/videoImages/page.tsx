'use client'

import {Box, Card, CardContent, Container, Divider, Stack, TablePagination, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import React from "react";
import {SelectFilter} from "@/components/native-select";
import {SearchBar} from "@/components/search-bar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Page() {

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


    return (
        <>

                <Box component="main"
                     sx={{
                         flex: '1 1 auto',
                         display: 'flex'
                     }}>
                    <Container maxWidth="xl">
                        <Grid container spacing={{xs: 3, lg: 4}}>
                            <Grid xs={12}>
                                <Typography noWrap variant="h4">Video Manager</Typography>
                            </Grid>

                            <Grid xs={12} md={10}>
                                <SearchBar placeholderText={'Search Image'} sx={{width: '100%'}}/>
                            </Grid>

                            <Grid xs={12} md={2}>
                                <SelectFilter/>
                            </Grid>

                            <Grid xs={12}>
                                <Stack>
                                    <Stack direction="row" spacing={3}>
                                        <Button color='inherit' endIcon={<KeyboardArrowDownIcon />}>
                                            Category
                                        </Button>
                                        <Button color='inherit' endIcon={<KeyboardArrowDownIcon />}>
                                            Status
                                        </Button>
                                    </Stack>
                                    <Box display={'grid'} sx={{gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px'}}>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent>
                                                <img
                                                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                                                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                                                    loading="lazy"
                                                    alt=""
                                                    width={'220px'}
                                                    height={'150px'}
                                                />
                                                <Divider sx={{marginY: 2}}/>

                                                <Stack spacing={1}>
                                                    <Typography component={'p'} variant='body2'>503.9 MB</Typography>
                                                    <Typography component={'span'}>Captured at Sep 01, 2023</Typography>
                                                    <Typography component={'span'}>
                                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                            <Typography component={'span'}>0 Annotations</Typography>
                                                            <Button color="primary">Annotate</Button>
                                                        </Stack>
                                                    </Typography>

                                                </Stack>
                                            </CardContent>
                                        </Card>

                                    </Box>

                                    <TablePagination
                                        component="div"
                                        count={100}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={rowsPerPage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Stack>
                            </Grid>

                        </Grid>
                    </Container>
                </Box>

        </>
    )
}

