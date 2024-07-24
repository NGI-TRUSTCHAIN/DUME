'use client'

import {Avatar, Box, Card, CardContent, Divider, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import {SelectChangeEvent} from "@mui/material/Select";

const label = {inputProps: {'aria-label': 'Switch demo'}};

export const GeneralAccount = () => {

    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value);
    };

    return (
        <Stack spacing={1}>
            <Card>
                <CardContent>
                    <Grid container spacing={3} columnSpacing={3} rowSpacing={3}>
                        <Grid xs={12} md={4}>
                            <Typography component={'h6'} variant="h6">Basic Details</Typography>
                        </Grid>

                        <Grid xs={12} md={8}>
                            <Stack>
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'flex-start'}>
                                    <Box borderRadius={'50%'} padding={'4px'}
                                         sx={{
                                             borderStyle: 'dashed', borderWidth: '1px',
                                             borderColor: 'rgb(210, 214, 219)'
                                         }}>
                                        <Avatar
                                            src={'/assets/avatars/avatar-carson-darrin.png'}
                                            sx={{width: 100, height: 100}}
                                        />

                                    </Box>
                                    <Button color="inherit">Change</Button>
                                </Stack>

                                <Stack mt={3} direction={'row'} alignItems={'center'}>
                                    <TextField id="outlined-required"
                                               label="Full Name"
                                               defaultValue="Andre Torneiro"
                                               sx={{width: '100ch', flexGrow: 1, flexDirection: 'column'}}/>
                                    <Button color="inherit">Save</Button>
                                </Stack>

                                <Stack mt={3} direction={'row'} alignItems={'center'}>
                                    <TextField id="outlined-required"
                                               label="Email address"
                                               defaultValue="andre.torneiro12@gmail.com"
                                               sx={{width: '50ch', flexGrow: 1, flexDirection: 'column'}}/>
                                    <Button color="inherit">Save</Button>
                                </Stack>

                                <Stack mt={3} direction={'row'} alignItems={'center'}>
                                    <Stack direction={'row'} justifyContent={'space-between'} spacing={1}>
                                        <FormControl sx={{ minWidth: 100 }}>
                                            <InputLabel id="demo-select-small-label">Country</InputLabel>
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                value={age}
                                                label="Country"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="">
                                                    <em>+351</em>
                                                </MenuItem>
                                                <MenuItem value={10}>+41</MenuItem>
                                                <MenuItem value={20}>+51</MenuItem>
                                                <MenuItem value={30}>+61</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField id="outlined-required"
                                                   label="Contact"
                                                   defaultValue="91 xxx xxxx"
                                                   sx={{width: '77ch', flexGrow: 1, flexDirection: 'column'}}/>
                                    </Stack>

                                    <Button color="inherit">Save</Button>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            {/*<Card>*/}
            {/*    <CardContent>*/}
            {/*        <Grid container spacing={3} columnSpacing={3} rowSpacing={3}>*/}
            {/*            <Grid xs={12} md={4}>*/}
            {/*                <Typography component={'h6'} variant="h6">Public Profile</Typography>*/}
            {/*            </Grid>*/}

            {/*            <Grid xs={12} md={8}>*/}
            {/*                <Stack*/}
            {/*                    divider={<Divider orientation="horizontal" flexItem/>}*/}
            {/*                    spacing={2} justifyContent="flex-end"*/}
            {/*                >*/}
            {/*                    <Stack*/}
            {/*                        direction="row"*/}
            {/*                        justifyContent="space-between"*/}
            {/*                        alignItems="center"*/}
            {/*                        spacing={1}*/}
            {/*                    >*/}
            {/*                        <Stack spacing={1}>*/}
            {/*                            <Typography component={'h6'} variant="subtitle1">Make Contact Info*/}
            {/*                                Public</Typography>*/}
            {/*                            <Typography component={'p'} variant="body2">Means that anyone viewing your*/}
            {/*                                profile will be able to see your contacts details</Typography>*/}
            {/*                        </Stack>*/}
            {/*                        <div>*/}
            {/*                            <Switch {...label} defaultChecked/>*/}
            {/*                        </div>*/}
            {/*                    </Stack>*/}
            {/*                    <Stack*/}
            {/*                        direction="row"*/}
            {/*                        justifyContent="space-between"*/}
            {/*                        alignItems="center"*/}
            {/*                        spacing={1}*/}
            {/*                    >*/}
            {/*                        <Stack spacing={1}>*/}
            {/*                            <Typography component={'h6'} variant="subtitle1">Available to*/}
            {/*                                partnership</Typography>*/}
            {/*                            <Typography component={'p'} variant="body2">Toggling this will let your*/}
            {/*                                teammates know that you are available for acquiring new*/}
            {/*                                projects</Typography>*/}
            {/*                        </Stack>*/}
            {/*                        <div>*/}
            {/*                            <Switch {...label} />*/}
            {/*                        </div>*/}
            {/*                    </Stack>*/}
            {/*                </Stack>*/}
            {/*            </Grid>*/}
            {/*        </Grid>*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}
            <Card>
                <CardContent>
                    <Grid container spacing={3} columnSpacing={3} rowSpacing={3}>
                        <Grid xs={12} md={4}>
                            <Typography component={'h6'} variant="h6">Delete Account</Typography>
                        </Grid>

                        <Grid xs={12} md={8}>
                            <Typography variant="body2" sx={{mt: 1}}>
                                Delete your account and all of your source data. This is irreversible.
                            </Typography>
                            <Button variant="outlined" color="error">
                                Delete Account
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Stack>
    )
}
