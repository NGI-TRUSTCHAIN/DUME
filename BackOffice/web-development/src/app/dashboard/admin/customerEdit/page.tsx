import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Container,
    Divider,
    Grid,
    Stack,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import React from "react";

import Button from "@mui/material/Button";


const label = {inputProps: {'aria-label': 'Switch demo'}};

export default function Page() {

    return (
        <>
                <Box component="main"
                     sx={{
                         flexGrow: 1,
                         py: 8
                     }}>
                    <Container maxWidth="lg">
                        <Stack spacing={3} mt={8}>
                            <Stack direction="row" alignItems={'center'} spacing={1}>
                                <Avatar
                                    src={'/assets/avatars/avatar-carson-darrin.png'}
                                    sx={{width: 84, height: 84}}
                                />
                                <Stack spacing={1}>
                                    <Typography noWrap variant="h4">miron.vitold@devias.io</Typography>
                                    <Stack direction="row" spacing={1} alignItems={'center'}>
                                        <Typography noWrap variant="h6">user_id: </Typography>
                                        <Chip label="abcgkhjkh56565"/>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <form>
                                <Card>
                                    <CardHeader title='Edit Customer'/>
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid xs={12} md={6}>
                                                <Box
                                                    component="form"
                                                    sx={{
                                                        '& .MuiTextField-root': {m: 3, width: '50ch'},
                                                    }}
                                                    noValidate
                                                    autoComplete="off"
                                                >
                                                    <div>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            id="outlined-required"
                                                            label="Required"
                                                            defaultValue="Hello World"
                                                        />
                                                    </div>
                                                </Box>
                                            </Grid>
                                            <Grid xs={12} md={6}>
                                                <Box
                                                    component="form"
                                                    sx={{
                                                        '& .MuiTextField-root': {m: 3, width: '50ch'},
                                                    }}
                                                    noValidate
                                                    autoComplete="off"
                                                >
                                                    <div>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            id="outlined-required"
                                                            label="Required"
                                                            defaultValue="Hello World"
                                                        />
                                                    </div>
                                                </Box>
                                            </Grid>
                                            <Grid xs={12} md={6}>
                                                <Box
                                                    component="form"
                                                    sx={{
                                                        '& .MuiTextField-root': {m: 3, width: '50ch'},
                                                    }}
                                                    noValidate
                                                    autoComplete="off"
                                                >
                                                    <div>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            id="outlined-required"
                                                            label="Required"
                                                            defaultValue="Hello World"
                                                        />
                                                    </div>
                                                </Box>
                                            </Grid>
                                            <Grid xs={12} md={6}>
                                                <Box
                                                    component="form"
                                                    sx={{
                                                        '& .MuiTextField-root': {m: 3, width: '50ch'},
                                                    }}
                                                    noValidate
                                                    autoComplete="off"
                                                >
                                                    <div>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            id="outlined-required"
                                                            label="Required"
                                                            defaultValue="Hello World"
                                                        />
                                                    </div>
                                                </Box>
                                            </Grid>
                                            <Grid xs={12} md={6}>
                                                <Box
                                                    component="form"
                                                    sx={{
                                                        '& .MuiTextField-root': {m: 3, width: '50ch'},
                                                    }}
                                                    noValidate
                                                    autoComplete="off"
                                                >
                                                    <div>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            id="outlined-required"
                                                            label="Required"
                                                            defaultValue="Hello World"
                                                        />
                                                    </div>
                                                </Box>
                                            </Grid>
                                            <Grid xs={12} md={6}>
                                                <Box
                                                    component="form"
                                                    sx={{
                                                        '& .MuiTextField-root': {m: 3, width: '50ch'},
                                                    }}
                                                    noValidate
                                                    autoComplete="off"
                                                >
                                                    <div>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            id="outlined-required"
                                                            label="Required"
                                                            defaultValue="Hello World"
                                                        />
                                                    </div>
                                                </Box>
                                            </Grid>
                                            <Grid xs={12} md={6}>
                                                <Box
                                                    component="form"
                                                    sx={{
                                                        '& .MuiTextField-root': {m: 3, width: '50ch'},
                                                    }}
                                                    noValidate
                                                    autoComplete="off"
                                                >
                                                    <div>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            id="outlined-required"
                                                            label="Required"
                                                            defaultValue="Hello World"
                                                        />
                                                    </div>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Stack
                                            divider={<Divider orientation="horizontal" flexItem/>}
                                            spacing={2}
                                        >
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                spacing={1}
                                            >
                                                <Stack spacing={1}>
                                                    <Typography noWrap variant="h6">Make Contact Info
                                                        Public</Typography>
                                                    <Typography noWrap variant="body2">Means that anyone viewing your
                                                        profile will be able to see your contacts details</Typography>
                                                </Stack>
                                                <div>
                                                    <Switch {...label} defaultChecked/>
                                                </div>
                                            </Stack>
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                spacing={1}
                                            >
                                                <Stack spacing={1}>
                                                    <Typography noWrap variant="h6">Available to
                                                        partnership</Typography>
                                                    <Typography noWrap variant="body2">Toggling this will let your
                                                        teammates know that you are available for acquiring new
                                                        projects</Typography>
                                                </Stack>
                                                <div>
                                                    <Switch {...label} />
                                                </div>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                    <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                                        <Button variant="contained">Update</Button>
                                        <Button color="inherit">Cancel</Button>
                                    </Stack>
                                </Card>
                            </form>
                        </Stack>
                    </Container>
                </Box>
        </>
    )
}


